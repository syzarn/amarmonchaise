-- ==============================================================================
-- MON CHAISE (মঞ্চাইছে) - ORDER TRACKING SCHEMA MIGRATION
-- Migration: 02_order_tracking.sql
-- ==============================================================================
-- Adds idempotent courier delivery partner and consignment tracking fields:
--  1. courier_name (e.g. 'Pathao', 'Steadfast', 'Paperfly', 'RedX')
--  2. tracking_code (e.g. 'PTH-982134', 'SF-108294')
-- ==============================================================================

-- 1. Add columns idempotently to public.orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS courier_name TEXT,
ADD COLUMN IF NOT EXISTS tracking_code TEXT;

-- 2. Create index on tracking_code for fast courier webhook and administrative lookups
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code 
ON public.orders (tracking_code) 
WHERE tracking_code IS NOT NULL AND trim(tracking_code) <> '';

-- 3. Update comments for documentation
COMMENT ON COLUMN public.orders.courier_name IS 'Assigned third-party logistics courier (e.g. Pathao, Steadfast)';
COMMENT ON COLUMN public.orders.tracking_code IS 'Unique consignment tracking code or AWB number issued by the courier partner';
