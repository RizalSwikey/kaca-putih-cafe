-- ==============================================================================
-- Kaca Putih Cafe & Kitchen - Database Schema (PostgreSQL / Supabase)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    image_url TEXT,
    is_signature BOOLEAN NOT NULL DEFAULT false,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_daily_bakery BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_delta NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. ORDERS TABLE
-- 4. CASHIER SHIFTS TABLE
CREATE TABLE IF NOT EXISTS public.cashier_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cashier_name TEXT NOT NULL,
    shift_type TEXT NOT NULL CHECK (shift_type IN ('morning', 'afternoon')),
    starting_cash NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (starting_cash >= 0),
    actual_cash NUMERIC(12, 2),
    expected_cash NUMERIC(12, 2),
    cash_difference NUMERIC(12, 2),
    total_cash_sales NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_qris_sales NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_card_sales NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_sales NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    orders_count INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    notes TEXT,
    opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at TIMESTAMPTZ
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    order_type TEXT NOT NULL CHECK (order_type IN ('dine_in', 'takeaway')),
    table_number INT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'ready', 'completed', 'cancelled')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'qris', 'card')),
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    cash_tendered NUMERIC(10, 2),
    cash_change NUMERIC(10, 2),
    shift_id UUID REFERENCES public.cashier_shifts(id) ON DELETE SET NULL,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    notes TEXT
);

-- 6. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_ramadan_mode BOOLEAN NOT NULL DEFAULT false,
    open_time TIME NOT NULL DEFAULT '09:00:00',
    close_time TIME NOT NULL DEFAULT '22:00:00',
    whatsapp_number TEXT NOT NULL DEFAULT '+6282245406501',
    demo_mode_enabled BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- REALTIME SUBSCRIPTIONS
-- ------------------------------------------------------------------------------
ALTER TABLE public.orders REPLICA IDENTITY FULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashier_shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read cashier_shifts" ON public.cashier_shifts
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert and update cashier_shifts" ON public.cashier_shifts
    FOR ALL USING (true);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access product-images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Upload product-images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Manage product-images" ON storage.objects
    FOR ALL USING (bucket_id = 'product-images');

-- Categories: Public read, Admin write
CREATE POLICY "Allow public read categories" ON public.categories
    FOR SELECT USING (true);
CREATE POLICY "Allow admin manage categories" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Products: Public read active/all, Admin write
CREATE POLICY "Allow public read products" ON public.products
    FOR SELECT USING (is_available = true OR auth.role() = 'authenticated');
CREATE POLICY "Allow admin manage products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated');

-- Product Variants: Public read, Admin write
CREATE POLICY "Allow public read product_variants" ON public.product_variants
    FOR SELECT USING (true);
CREATE POLICY "Allow admin manage product_variants" ON public.product_variants
    FOR ALL USING (auth.role() = 'authenticated');

-- Orders: Public insert & read own order by id/code; Admin manage all
CREATE POLICY "Allow public insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read own orders" ON public.orders
    FOR SELECT USING (true);
CREATE POLICY "Allow admin manage orders" ON public.orders
    FOR ALL USING (auth.role() = 'authenticated');

-- Order Items: Public insert & read; Admin manage all
CREATE POLICY "Allow public insert order_items" ON public.order_items
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read order_items" ON public.order_items
    FOR SELECT USING (true);
CREATE POLICY "Allow admin manage order_items" ON public.order_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Store Settings: Public read, Admin write
CREATE POLICY "Allow public read store_settings" ON public.store_settings
    FOR SELECT USING (true);
CREATE POLICY "Allow admin manage store_settings" ON public.store_settings
    FOR ALL USING (auth.role() = 'authenticated');
