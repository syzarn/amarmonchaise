-- ==============================================================================
-- MON CHAISE (মঞ্চাইছে) - STAFF AUDIT TRAIL & NAMED ACCOUNTABILITY SCHEMA
-- Migration: 03_staff_audit_trail.sql
-- ==============================================================================
-- 1. Creates public.staff_members for named credential authentication
-- 2. Creates public.order_audit_logs for end-to-end operational accountability
-- 3. Adds last_modified_by column to public.orders
-- ==============================================================================

-- 1. Staff Members Table
CREATE TABLE IF NOT EXISTS public.staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE,
    pin TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'manager', 'dispatcher', 'operator')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on staff name for fast case-insensitive lookup
CREATE INDEX IF NOT EXISTS idx_staff_members_name_lower 
ON public.staff_members (lower(trim(name)));

-- Pre-seed authorized staff members (idempotent ON CONFLICT DO NOTHING)
INSERT INTO public.staff_members (name, phone, pin, role, is_active)
VALUES
    ('Sara', '01700000001', '23111997', 'manager', true),
    ('Antar', '01700000002', '30062002', 'dispatcher', true),
    ('Operations 1', '01700000003', '1234', 'operator', true)
ON CONFLICT (phone) DO UPDATE 
SET pin = EXCLUDED.pin,
    role = EXCLUDED.role,
    is_active = true;

-- 2. Order Audit Logs Table (Decoupled from orders.id data type)
CREATE TABLE IF NOT EXISTS public.order_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL,
    staff_name TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('payment_verified', 'dispatched', 'cancelled', 'status_override', 'note_added', 'courier_updated')),
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast lookup index on order_id
CREATE INDEX IF NOT EXISTS idx_order_audit_logs_order_id 
ON public.order_audit_logs (order_id, created_at DESC);

-- 3. Add order_no and last_modified_by to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_no TEXT,
ADD COLUMN IF NOT EXISTS last_modified_by TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_order_no 
ON public.orders (order_no) 
WHERE order_no IS NOT NULL;

-- 4. Idempotent Schema Alignment & Legacy Parcels Backfill
-- Ensures total_amount_bdt, subtotal_bdt, delivery_charge_bdt exist on orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS total_amount_bdt INTEGER,
ADD COLUMN IF NOT EXISTS subtotal_bdt INTEGER,
ADD COLUMN IF NOT EXISTS delivery_charge_bdt INTEGER;

-- Backfill order_no and amounts from legacy columns for existing parcels
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='client_order_id') THEN
        UPDATE public.orders 
        SET order_no = COALESCE(order_no, client_order_id)
        WHERE order_no IS NULL AND client_order_id IS NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='total_amount') THEN
        UPDATE public.orders 
        SET total_amount_bdt = COALESCE(total_amount_bdt, total_amount),
            subtotal_bdt = COALESCE(subtotal_bdt, subtotal),
            delivery_charge_bdt = COALESCE(delivery_charge_bdt, delivery_charge)
        WHERE total_amount_bdt IS NULL;
    END IF;
END $$;

-- Comments for database documentation
COMMENT ON TABLE public.staff_members IS 'Authorized operational staff members for Mon Chaise fulfillment';
COMMENT ON TABLE public.order_audit_logs IS 'Immutable audit trail recording which staff member performed each order update';
COMMENT ON COLUMN public.orders.order_no IS 'Customer-facing alphanumeric order code (e.g. MC-MTR643A1)';
COMMENT ON COLUMN public.orders.last_modified_by IS 'Name of the staff member who executed the most recent status or courier transition';

