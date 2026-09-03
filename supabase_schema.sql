-- ==============================================================================
-- MON CHAISE (মঞ্চাইছে) - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project and navigate to the "SQL Editor" in the left sidebar.
-- 3. Paste this entire script and click "Run".
-- ==============================================================================

-- 1. CUSTOMERS TABLE
-- Stores unique customer profiles keyed by their 11-digit Bangladeshi mobile number.
-- Supports automatic upsert on repeat orders.
CREATE TABLE IF NOT EXISTS public.customers (
    id BIGSERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant phone number lookups and upsert conflicts
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);


-- 2. ORDERS TABLE
-- Stores customer orders, cart items in JSONB, payment details, and TrxID.
-- Enforces UNIQUE constraint on trx_id to prevent duplicate payment transaction abuse.
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES public.customers(id) ON DELETE SET NULL,
    client_order_id VARCHAR(50) UNIQUE NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_charge NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cod', 'mfs')),
    sender_number VARCHAR(20),
    trx_id VARCHAR(50) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_verification',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning-fast queries and dashboard filtering
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_client_order_id ON public.orders(client_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_trx_id ON public.orders(trx_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);


-- 3. AUTOMATIC UPDATED_AT TRIGGER
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

DROP TRIGGER IF EXISTS tr_orders_updated_at ON public.orders;
CREATE TRIGGER tr_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();


-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS for database safety
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow service_role full unrestricted access (Used by Cloudflare Pages Edge Function with SUPABASE_SERVICE_ROLE_KEY)
DROP POLICY IF EXISTS "Service Role Full Access Customers" ON public.customers;
CREATE POLICY "Service Role Full Access Customers" ON public.customers
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role Full Access Orders" ON public.orders;
CREATE POLICY "Service Role Full Access Orders" ON public.orders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Fail-safe Policies: Also allow anon and authenticated roles to insert orders and upsert their customer profile
-- (Prevents RLS 42501 permission denied errors even if the public anon key is configured)
DROP POLICY IF EXISTS "Allow Insert Customers" ON public.customers;
CREATE POLICY "Allow Insert Customers" ON public.customers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Update Customers" ON public.customers;
CREATE POLICY "Allow Update Customers" ON public.customers
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Insert Orders" ON public.orders;
CREATE POLICY "Allow Insert Orders" ON public.orders
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
