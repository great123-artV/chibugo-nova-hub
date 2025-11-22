-- Ensure the has_role function exists and is correct
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Drop and recreate admin policies for products (idempotent approach)
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop and recreate admin policies for properties
DROP POLICY IF EXISTS "Admins can manage all properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can manage properties" ON public.properties;

CREATE POLICY "Admins can manage properties"
ON public.properties
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Ensure public viewing policies exist
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;

CREATE POLICY "Products are viewable by everyone"
ON public.products
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can view properties" ON public.properties;
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;

CREATE POLICY "Properties are viewable by everyone"
ON public.properties
FOR SELECT
TO anon, authenticated
USING (true);

-- IMPORTANT: After this migration, sign up with chibugocomputertech@gmail.com
-- Then run this SQL to grant admin role:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ((SELECT id FROM auth.users WHERE email = 'chibugocomputertech@gmail.com'), 'admin');