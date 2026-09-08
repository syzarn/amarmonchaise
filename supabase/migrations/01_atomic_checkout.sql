-- ==============================================================================
-- MON CHAISE (মঞ্চাইছে) - TRANSACTIONAL ACID CHECKOUT MIGRATION
-- Migration: 01_atomic_checkout.sql
-- ==============================================================================
-- Production Features & Safeguards:
--  1. Partial Unique Index on trx_id (prevents duplicate MFS TrxIDs while allowing COD empty/nulls)
--  2. Deterministic Row-Level Locking (SELECT ... FOR UPDATE ORDER BY id ASC) to prevent deadlocks
--  3. Strict RPC Privileges (SECURITY DEFINER, revoked from PUBLIC/anon, granted to service_role)
--  4. Authoritative Database Pricing (all subtotals calculated server-side against products table)
--  5. 1-of-1 Handloom Piece Guard (fails atomic transaction if sold out or insufficient stock)
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------------------------
-- 1. CUSTOMERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    district TEXT DEFAULT 'Inside Dhaka',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);


-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,                       -- e.g. 'amc-100'
    sku TEXT UNIQUE NOT NULL,                  -- e.g. 'AMC-WEV-THM-01'
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    price_bdt INTEGER NOT NULL CHECK (price_bdt >= 0),
    inventory JSONB NOT NULL DEFAULT '{"stock_count": 10, "is_one_of_a_kind": false}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for product lookup and inventory checks
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);


-- ------------------------------------------------------------------------------
-- 3. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,                       -- e.g. 'MC-260908-7K9M'
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    items JSONB NOT NULL,                      -- Verified array of { product_id, sku, title, quantity, unit_price_bdt, total_price_bdt }
    subtotal_bdt INTEGER NOT NULL CHECK (subtotal_bdt >= 0),
    delivery_charge_bdt INTEGER NOT NULL CHECK (delivery_charge_bdt >= 0),
    total_amount_bdt INTEGER NOT NULL CHECK (total_amount_bdt >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'mfs')),
    sender_number TEXT,
    trx_id TEXT,                               -- Handled via partial unique index below (no table-level unique!)
    status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'confirmed', 'verified', 'dispatched', 'delivered', 'cancelled')),
    shipping_address TEXT NOT NULL,
    customer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SAFEGUARD 1: Partial Unique Index on trx_id (Allows unlimited COD nulls/empty strings, enforces unique MFS TrxIDs)
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_unique_trx_id 
    ON public.orders (trx_id) 
    WHERE trx_id IS NOT NULL AND trim(trx_id) <> '';

-- Fast lookup indexes for administrative dashboard & reporting
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);


-- ------------------------------------------------------------------------------
-- 4. AUTOMATIC UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_customers_updated_at ON public.customers;
CREATE TRIGGER tr_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_products_updated_at ON public.products;
CREATE TRIGGER tr_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_orders_updated_at ON public.orders;
CREATE TRIGGER tr_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();


-- ------------------------------------------------------------------------------
-- 5. SEED INITIAL PRODUCTS (From Mon Chaise Catalog)
-- ------------------------------------------------------------------------------
INSERT INTO public.products (id, sku, name_en, name_bn, price_bdt, inventory) VALUES
    ('amc-100', 'AMC-WEV-THM-01', 'Traditional Handloom Thami (Chakma Weave)', 'ঐতিহ্যবাহী হাতে বোনা থামি', 1850, '{"stock_count": 1, "is_one_of_a_kind": true}'::jsonb),
    ('amc-101', 'AMC-BAG-TOT-01', 'Gamcha Everyday Tote Bag', 'গামছা দৈনন্দিন টোট ব্যাগ', 850, '{"stock_count": 15, "is_one_of_a_kind": false}'::jsonb),
    ('amc-102', 'AMC-CST-WOD-01', 'Dhaka Rickshaw Art Wooden Coaster Set', 'রিকশা আর্ট কাঠের কোস্টার সেট', 450, '{"stock_count": 25, "is_one_of_a_kind": false}'::jsonb),
    ('amc-103', 'AMC-KCP-CLY-01', 'Clay Chai Cup Artisan Keycap', 'মাটির চা কাপ কি-ক্যাপ', 650, '{"stock_count": 8, "is_one_of_a_kind": false}'::jsonb),
    ('amc-104', 'AMC-LMP-RET-01', 'Upcycled Mixtape Ambient Lamp', 'আপসাইকেল্ড ক্যাসেট বাতি', 1200, '{"stock_count": 5, "is_one_of_a_kind": false}'::jsonb),
    ('amc-105', 'AMC-TEA-SMK-01', 'Sylhet Wild-Harvest Smoked Tea (50g)', 'সিলেটের বুনো ধোঁয়া চা', 380, '{"stock_count": 30, "is_one_of_a_kind": false}'::jsonb),
    ('amc-106', 'AMC-CAP-NKC-01', 'Nakshi Kantha Patterned Dad Cap', 'নকশী কাঁথা প্যাটার্ন ক্যাপ', 950, '{"stock_count": 12, "is_one_of_a_kind": false}'::jsonb),
    ('amc-107', 'AMC-CND-MST-01', 'Mustard Flower Beeswax Candle', 'সরিষা ফুলের মোমবাতি', 490, '{"stock_count": 20, "is_one_of_a_kind": false}'::jsonb),
    ('amc-108', 'AMC-PIN-HIL-01', 'Vintage Hilsa Enamel Pin', 'রূপালী ইলিশ এনামেল পিন', 250, '{"stock_count": 40, "is_one_of_a_kind": false}'::jsonb),
    ('amc-109', 'AMC-USB-MON-01', 'Monsoon Sounds of Bengal Cassette USB (16GB)', 'বর্ষার শব্দ ক্যাসেট ড্রাইভ', 390, '{"stock_count": 18, "is_one_of_a_kind": false}'::jsonb),
    ('amc-110', 'AMC-AST-BRS-01', 'Brass Pocket Astrolabe (Handcrafted Replica)', 'পিতলের পকেট অ্যাস্ট্রোল্যাব', 1550, '{"stock_count": 1, "is_one_of_a_kind": true}'::jsonb),
    ('amc-111', 'AMC-BMK-JMD-01', 'Handloom Jamdani Weave Bookmark', 'জামদানি বুনন বুকমার্ক', 180, '{"stock_count": 50, "is_one_of_a_kind": false}'::jsonb),
    ('amc-112', 'AMC-ZIN-KSH-01', 'Kishor Shoili Micro Comic Zine Issue #1', 'কিশোর শৈলী মিনি কমিক জিন', 280, '{"stock_count": 25, "is_one_of_a_kind": false}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    sku = EXCLUDED.sku,
    name_en = EXCLUDED.name_en,
    name_bn = EXCLUDED.name_bn,
    price_bdt = EXCLUDED.price_bdt;


-- ------------------------------------------------------------------------------
-- 6. ATOMIC TRANSACTION STORED PROCEDURE: place_order
-- ------------------------------------------------------------------------------
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
    VALUES (v_clean_phone, trim(p_customer_name), trim(p_shipping_address), coalesce(p_district, 'Inside Dhaka'), NOW())
    ON CONFLICT (phone) DO UPDATE SET
        name = EXCLUDED.name,
        address = EXCLUDED.address,
        district = EXCLUDED.district,
        updated_at = NOW()
    RETURNING id INTO v_customer_id;

    -- -------------------------------------------------------------------------
    -- Step 4: Generate Unique Order ID & Insert Order Record
    -- Format: MC-YYMMDD-XXXX (e.g. MC-260908-7K9M)
    -- -------------------------------------------------------------------------
    v_order_id := 'MC-' || to_char(NOW(), 'YYMMDD') || '-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
    v_total_amount := v_calculated_subtotal + coalesce(p_delivery_charge, 0);
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
        customer_notes,
        created_at
    ) VALUES (
        v_order_id,
        v_customer_id,
        v_verified_items,
        v_calculated_subtotal,
        coalesce(p_delivery_charge, 0),
        v_total_amount,
        v_payment_method,
        v_clean_sender,
        v_clean_trx_id,
        v_status,
        trim(p_shipping_address),
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
        'delivery_charge_bdt', coalesce(p_delivery_charge, 0),
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


-- ------------------------------------------------------------------------------
-- SAFEGUARD 3: Strict RPC Execution Privileges (Cloudflare Edge Only)
-- Revoke direct execution from public/anon users; grant exclusively to service_role
-- ------------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.place_order FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.place_order TO service_role;


-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Products: Public catalog reading
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products
    FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

-- Products: Service role full management
DROP POLICY IF EXISTS "Service role manages products" ON public.products;
CREATE POLICY "Service role manages products" ON public.products
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Customers & Orders: Strict backend service role isolation
DROP POLICY IF EXISTS "Service role manages customers" ON public.customers;
CREATE POLICY "Service role manages customers" ON public.customers
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages orders" ON public.orders;
CREATE POLICY "Service role manages orders" ON public.orders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
