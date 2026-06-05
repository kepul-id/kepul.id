CREATE OR REPLACE FUNCTION public.ensure_kepul_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  current_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
BEGIN
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;

  IF current_email <> 'kepul@kepul.id' THEN
    RETURN false;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (current_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_kepul_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_kepul_admin() TO authenticated;