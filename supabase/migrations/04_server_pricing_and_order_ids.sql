-- ==============================================================================
-- MON CHAISE (মঞ্চাইছে) - SERVER-SIDE DELIVERY FEE & COLLISION-SAFE ORDER IDS
-- Migration: 04_server_pricing_and_order_ids.sql
-- ==============================================================================
-- Replaces public.place_order (same signature, so existing callers keep working):
--  1. Delivery charge is derived from p_district inside the database
--     (Inside Dhaka = 60, Outside Dhaka = 120). p_delivery_charge is ignored,
--     so a tampered client can no longer set its own delivery fee.
--  2. Order IDs use 6 random hex characters (MC-YYMMDD-XXXXXX) and are re-rolled
--     until unique, instead of 4 characters with no collision check.
--  3. orders.order_no is filled with the order ID so tracking and staff tools
--     can find the order by either column.
-- Also backfills order_no for existing orders that were created without it.
-- ==============================================================================

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_no TEXT;

UPDATE public.orders
SET order_no = id::text
WHERE order_no IS NULL;

CREATE OR REPLACE FUNCTION public.place_order(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_shipping_address TEXT,
    p_district TEXT DEFAULT 'Inside Dhaka',
    p_payment_method TEXT DEFAULT 'cod',
    p_sender_number TEXT DEFAULT NULL,
    p_trx_id TEXT DEFAULT NULL,
    p_items JSONB DEFAULT '[]'::jsonb,
    p_delivery_charge INTEGER DEFAULT 60,
    p_customer_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_clean_phone TEXT;
    v_clean_trx_id TEXT;
    v_clean_sender TEXT;
    v_payment_method TEXT;
    v_item RECORD;
    v_item_id TEXT;
    v_qty INTEGER;
    v_product RECORD;
    v_stock_count INTEGER;
    v_is_one_of_a_kind BOOLEAN;
    v_new_stock INTEGER;
    v_line_total INTEGER;
    v_calculated_subtotal INTEGER := 0;
    v_verified_items JSONB := '[]'::jsonb;
    v_customer_id UUID;
    v_order_id TEXT;
    v_status TEXT;
    v_total_amount INTEGER;
    v_district TEXT;
    v_delivery_charge INTEGER;
BEGIN
    -- -------------------------------------------------------------------------
    -- Step 1: Input Validation & Sanitization
    -- -------------------------------------------------------------------------
    IF p_customer_name IS NULL OR length(trim(p_customer_name)) < 2 THEN
        RAISE EXCEPTION 'INVALID_NAME: Customer full name is required (min 2 characters).'
            USING ERRCODE = 'P0001';
    END IF;

    -- Clean phone number (strip whitespace, dashes, parens)
    v_clean_phone := regexp_replace(trim(p_customer_phone), '[\s\-\(\)\.]', '', 'g');
    IF v_clean_phone ~ '^\+?8801' THEN
        v_clean_phone := regexp_replace(v_clean_phone, '^\+?88', '');
    END IF;

    IF v_clean_phone !~ '^01[3-9]\d{8}$' THEN
        RAISE EXCEPTION 'INVALID_PHONE: Valid 11-digit Bangladeshi mobile number is required (013 - 019).'
            USING ERRCODE = 'P0001';
    END IF;

    IF p_shipping_address IS NULL OR length(trim(p_shipping_address)) < 5 THEN
        RAISE EXCEPTION 'INVALID_ADDRESS: Full delivery address is required (min 5 characters).'
            USING ERRCODE = 'P0001';
    END IF;

    -- Authoritative delivery charge (client-sent p_delivery_charge is ignored)
    IF lower(trim(coalesce(p_district, ''))) IN ('inside dhaka', 'dhaka') THEN
        v_district := 'Inside Dhaka';
        v_delivery_charge := 60;
    ELSIF lower(trim(coalesce(p_district, ''))) IN ('outside dhaka', 'outside') THEN
        v_district := 'Outside Dhaka';
        v_delivery_charge := 120;
    ELSE
        RAISE EXCEPTION 'INVALID_DISTRICT: Delivery district must be Inside Dhaka or Outside Dhaka.'
            USING ERRCODE = 'P0001';
    END IF;

    v_payment_method := lower(trim(coalesce(p_payment_method, 'cod')));
    IF v_payment_method NOT IN ('cod', 'mfs') THEN
        RAISE EXCEPTION 'INVALID_PAYMENT_METHOD: Payment method must be either "cod" or "mfs".'
            USING ERRCODE = 'P0001';
    END IF;

    -- SAFEGUARD 1: Sanitize trx_id (treat whitespace or empty strings as NULL)
    v_clean_trx_id := nullif(upper(trim(coalesce(p_trx_id, ''))), '');
    v_clean_sender := nullif(trim(coalesce(p_sender_number, '')), '');

    IF v_payment_method = 'mfs' THEN
        IF v_clean_trx_id IS NULL THEN
            RAISE EXCEPTION 'MFS_REQUIRES_TRX_ID: TrxID is required for MFS Send Money payments.'
                USING ERRCODE = 'P0001';
        END IF;

        IF v_clean_sender IS NULL THEN
            RAISE EXCEPTION 'MFS_REQUIRES_SENDER: Sender mobile number is required for MFS payments.'
                USING ERRCODE = 'P0001';
        END IF;

        -- Check duplicate TrxID upfront before taking locks
        IF EXISTS (
            SELECT 1 FROM public.orders 
            WHERE trx_id = v_clean_trx_id
        ) THEN
            RAISE EXCEPTION 'DUPLICATE_TRX_ID: This TrxID has already been submitted for another order.'
                USING ERRCODE = '23505';
        END IF;
    END IF;

    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'EMPTY_CART: Cart must contain at least one item.'
            USING ERRCODE = 'P0001';
    END IF;

    -- -------------------------------------------------------------------------
    -- SAFEGUARD 2: Deadlock Prevention via Deterministic Lock Ordering
    -- Acquire exclusive row locks (FOR UPDATE) on all cart products sorted by id ASC
    -- -------------------------------------------------------------------------
    PERFORM id 
    FROM public.products 
    WHERE id IN (
        SELECT DISTINCT coalesce(item->>'product_id', item->>'id')::text 
        FROM jsonb_array_elements(p_items) AS item
    )
    ORDER BY id ASC
    FOR UPDATE;

    -- -------------------------------------------------------------------------
    -- SAFEGUARD 4 & Inventory Deduction:
    -- Verify stock and compute authoritative pricing strictly from products table
    -- -------------------------------------------------------------------------
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_item_id := coalesce(v_item.value->>'product_id', v_item.value->>'id');
        v_qty := coalesce((v_item.value->>'quantity')::int, (v_item.value->>'qty')::int, 1);

        IF v_item_id IS NULL OR length(trim(v_item_id)) = 0 THEN
            RAISE EXCEPTION 'INVALID_ITEM: Each cart item must have a valid product_id.'
                USING ERRCODE = 'P0001';
        END IF;

        IF v_qty <= 0 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY: Quantity for product % must be at least 1.', v_item_id
                USING ERRCODE = 'P0001';
        END IF;

        -- Query locked product
        SELECT id, sku, name_en, name_bn, price_bdt, inventory
        INTO v_product
        FROM public.products
        WHERE id = v_item_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'PRODUCT_NOT_FOUND: Product "%" was not found in catalog.', v_item_id
                USING ERRCODE = 'P0002';
        END IF;

        v_stock_count := coalesce((v_product.inventory->>'stock_count')::int, 0);
        v_is_one_of_a_kind := coalesce((v_product.inventory->>'is_one_of_a_kind')::boolean, false);

        -- Guard: 1-of-1 Handloom Piece
        IF v_is_one_of_a_kind AND v_stock_count <= 0 THEN
            RAISE EXCEPTION 'ONE_OF_A_KIND_SOLD_OUT: "%" is a 1-of-1 handloom piece and has already been acquired by another patron.', v_product.name_en
                USING ERRCODE = 'P0003';
        END IF;

        -- Guard: Insufficient Stock
        IF v_stock_count < v_qty THEN
            RAISE EXCEPTION 'INSUFFICIENT_STOCK: Insufficient stock for "%" (Requested: %, Available: %).', v_product.name_en, v_qty, v_stock_count
                USING ERRCODE = 'P0003';
        END IF;

        -- Atomically deduct inventory
        v_new_stock := v_stock_count - v_qty;
        UPDATE public.products
        SET inventory = jsonb_set(inventory, '{stock_count}', to_jsonb(v_new_stock))
        WHERE id = v_item_id;

        -- Authoritative price calculation (ignoring client-sent prices)
        v_line_total := v_product.price_bdt * v_qty;
        v_calculated_subtotal := v_calculated_subtotal + v_line_total;

        -- Record verified line item
        v_verified_items := v_verified_items || jsonb_build_object(
            'product_id', v_product.id,
            'sku', v_product.sku,
            'title', v_product.name_en,
            'title_bn', v_product.name_bn,
            'quantity', v_qty,
            'unit_price_bdt', v_product.price_bdt,
            'total_price_bdt', v_line_total
        );
    END LOOP;

    -- -------------------------------------------------------------------------
    -- Step 3: Atomic Customer Upsert (keyed on phone)
    -- -------------------------------------------------------------------------
    INSERT INTO public.customers (phone, name, address, district, updated_at)
    VALUES (v_clean_phone, trim(p_customer_name), trim(p_shipping_address), v_district, NOW())
    ON CONFLICT (phone) DO UPDATE SET
        name = EXCLUDED.name,
        address = EXCLUDED.address,
        district = EXCLUDED.district,
        updated_at = NOW()
    RETURNING id INTO v_customer_id;

    -- -------------------------------------------------------------------------
    -- Step 4: Generate Unique Order ID & Insert Order Record
    -- Format: MC-YYMMDD-XXXXXX (e.g. MC-260908-7K9M2A), re-rolled until unique
    -- -------------------------------------------------------------------------
    -- gen_random_uuid() is built into PostgreSQL 13+, so no extension schema is needed
    LOOP
        v_order_id := 'MC-' || to_char(NOW() AT TIME ZONE 'Asia/Dhaka', 'YYMMDD') || '-'
            || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
        EXIT WHEN NOT EXISTS (
            SELECT 1 FROM public.orders WHERE id::text = v_order_id OR order_no = v_order_id
        );
    END LOOP;
    v_total_amount := v_calculated_subtotal + v_delivery_charge;
    v_status := CASE WHEN v_payment_method = 'cod' THEN 'confirmed' ELSE 'pending_verification' END;

    INSERT INTO public.orders (
        id,
        customer_id,
        items,
        subtotal_bdt,
        delivery_charge_bdt,
        total_amount_bdt,
        payment_method,
        sender_number,
        trx_id,
        status,
        shipping_address,
        order_no,
        customer_notes,
        created_at
    ) VALUES (
        v_order_id,
        v_customer_id,
        v_verified_items,
        v_calculated_subtotal,
        v_delivery_charge,
        v_total_amount,
        v_payment_method,
        v_clean_sender,
        v_clean_trx_id,
        v_status,
        trim(p_shipping_address),
        v_order_id,
        nullif(trim(p_customer_notes), ''),
        NOW()
    );

    -- -------------------------------------------------------------------------
    -- Step 5: Return Structured JSON Order Summary
    -- -------------------------------------------------------------------------
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'customer_id', v_customer_id,
        'customer_name', trim(p_customer_name),
        'customer_phone', v_clean_phone,
        'subtotal_bdt', v_calculated_subtotal,
        'delivery_charge_bdt', v_delivery_charge,
        'total_amount_bdt', v_total_amount,
        'payment_method', v_payment_method,
        'trx_id', v_clean_trx_id,
        'status', v_status,
        'items_count', jsonb_array_length(v_verified_items),
        'items', v_verified_items,
        'created_at', NOW()
    );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.place_order FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.place_order TO service_role;
