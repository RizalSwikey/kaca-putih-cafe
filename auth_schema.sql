-- ==============================================================================
-- Kaca Putih Cafe & Kitchen - Auth & RBAC Schema (Supabase / PostgreSQL)
-- File: auth_schema.sql
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    phone_number TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'cashier', 'kitchen', 'admin')),
    loyalty_tier TEXT NOT NULL DEFAULT 'Bronze' CHECK (loyalty_tier IN ('Bronze', 'Silver', 'Gold')),
    loyalty_points INTEGER NOT NULL DEFAULT 0 CHECK (loyalty_points >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for role lookup performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. HELPER FUNCTIONS FOR RBAC IN RLS
-- Security definer avoids recursive RLS evaluation
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 3. TRIGGER FUNCTION: AUTO-POPULATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    assigned_role TEXT;
    extracted_name TEXT;
    extracted_phone TEXT;
BEGIN
    -- Extract role from metadata, default to 'customer'
    assigned_role := COALESCE(
        NEW.raw_user_meta_data->>'role',
        NEW.raw_app_meta_data->>'role',
        'customer'
    );

    -- Enforce valid roles only
    IF assigned_role NOT IN ('customer', 'cashier', 'kitchen', 'admin') THEN
        assigned_role := 'customer';
    END IF;

    extracted_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    extracted_phone := COALESCE(
        NEW.raw_user_meta_data->>'phone_number',
        NEW.phone
    );

    INSERT INTO public.profiles (id, full_name, phone_number, role, loyalty_tier, loyalty_points)
    VALUES (
        NEW.id,
        extracted_name,
        extracted_phone,
        assigned_role,
        'Bronze',
        0
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number),
        updated_at = now();

    RETURN NEW;
END;
$$;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. RLS POLICIES: PROFILES
-- Customers read own profile; Staff/Admin can view profiles for operations/CRM
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (
        id = auth.uid() 
        OR public.current_user_role() IN ('admin', 'cashier')
    );

-- Customers can only update their own personal info (cannot elevate role or modify points directly)
CREATE POLICY "profiles_update_own_policy" ON public.profiles
    FOR UPDATE USING (
        id = auth.uid() OR public.current_user_role() = 'admin'
    )
    WITH CHECK (
        -- Regular users cannot self-escalate role or points
        (id = auth.uid() AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()) AND loyalty_points = (SELECT p.loyalty_points FROM public.profiles p WHERE p.id = auth.uid()))
        OR public.current_user_role() = 'admin'
    );

-- 5. ELEVATED RLS POLICIES FOR OPERATIONAL TABLES

-- Table: cashier_shifts (Admin & Cashier only)
DROP POLICY IF EXISTS "Allow public read cashier_shifts" ON public.cashier_shifts;
DROP POLICY IF EXISTS "Allow public insert and update cashier_shifts" ON public.cashier_shifts;

CREATE POLICY "cashier_shifts_select" ON public.cashier_shifts
    FOR SELECT USING (
        public.current_user_role() IN ('admin', 'cashier')
    );

CREATE POLICY "cashier_shifts_modify" ON public.cashier_shifts
    FOR ALL USING (
        public.current_user_role() IN ('admin', 'cashier')
    );

-- Table: orders
DROP POLICY IF EXISTS "Allow public read own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admin manage orders" ON public.orders;

-- Public/Customer can read own order via ID or tracking code
CREATE POLICY "orders_select_policy" ON public.orders
    FOR SELECT USING (
        public.current_user_role() IN ('admin', 'cashier', 'kitchen')
        OR customer_phone = (SELECT phone_number FROM public.profiles WHERE id = auth.uid())
        OR id::text = current_setting('request.headers', true)::json->>'x-order-id'
    );

-- Kitchen can update status ('preparing', 'ready'); Cashier/Admin full write
CREATE POLICY "orders_update_policy" ON public.orders
    FOR UPDATE USING (
        public.current_user_role() IN ('admin', 'cashier', 'kitchen')
    );

-- Table: products / categories (Menu items)
DROP POLICY IF EXISTS "Allow admin manage products" ON public.products;
CREATE POLICY "products_staff_manage" ON public.products
    FOR ALL USING (
        public.current_user_role() IN ('admin', 'cashier')
    );

DROP POLICY IF EXISTS "Allow admin manage categories" ON public.categories;
CREATE POLICY "categories_admin_manage" ON public.categories
    FOR ALL USING (
        public.current_user_role() = 'admin'
    );
