-- 012 · Admin-only access
-- Before this migration, every signed-in account had full CMS rights, so anyone
-- who signed up through the public Supabase auth endpoint could read leads,
-- edit pages and delete media. This migration limits CMS rights to accounts
-- whose profile role is 'admin', and stops users from promoting themselves.
--
-- Run in Supabase -> SQL Editor. Safe to run more than once.
-- STEP 0 (recommended): Authentication -> Sign In / Providers -> turn OFF "Allow new users to sign up".

-- 1. Helper: is the current user an approved admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 2. Keep the existing seeded admin account working.
UPDATE public.profiles p
SET role = 'admin'
FROM auth.users u
WHERE p.id = u.id
  AND lower(u.email) IN ('admin@buchan.com', 'mischellem@buchan.com');
-- To grant another staff member access, add their email above (they must already
-- have an account), or run:
--   UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE lower(email) = 'name@buchan.com');

-- 3. Profiles: users may read their own profile; only admins can change roles.
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins manage profiles" ON profiles;
CREATE POLICY "Admins manage profiles" ON profiles
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Content tables: replace "any signed-in user" with "approved admin".
DROP POLICY IF EXISTS "Authenticated users full access posts" ON posts;
DROP POLICY IF EXISTS "Admins full access posts" ON posts;
CREATE POLICY "Admins full access posts" ON posts
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users full access properties" ON properties;
DROP POLICY IF EXISTS "Admins full access properties" ON properties;
CREATE POLICY "Admins full access properties" ON properties
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users full access submissions" ON submissions;
DROP POLICY IF EXISTS "Admins full access submissions" ON submissions;
CREATE POLICY "Admins full access submissions" ON submissions
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users full access site pages" ON site_pages;
DROP POLICY IF EXISTS "Admins full access site pages" ON site_pages;
CREATE POLICY "Admins full access site pages" ON site_pages
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- hub_pages only exists if migration 004 was applied
DO $do$
BEGIN
  IF to_regclass('public.hub_pages') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users full access hub pages" ON hub_pages';
    EXECUTE 'DROP POLICY IF EXISTS "Admins full access hub pages" ON hub_pages';
    EXECUTE 'CREATE POLICY "Admins full access hub pages" ON hub_pages FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())';
  END IF;
END
$do$;

-- 5. Chatbot tables.
DROP POLICY IF EXISTS "Authenticated manage chatbot settings" ON chatbot_settings;
DROP POLICY IF EXISTS "Admins manage chatbot settings" ON chatbot_settings;
CREATE POLICY "Admins manage chatbot settings" ON chatbot_settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated manage knowledge sources" ON knowledge_sources;
DROP POLICY IF EXISTS "Admins manage knowledge sources" ON knowledge_sources;
CREATE POLICY "Admins manage knowledge sources" ON knowledge_sources
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated read chat logs" ON chat_logs;
DROP POLICY IF EXISTS "Admins read chat logs" ON chat_logs;
CREATE POLICY "Admins read chat logs" ON chat_logs
  FOR SELECT USING (public.is_admin());

-- 6. Media storage: public can still view images; only admins can change them.
DROP POLICY IF EXISTS "Authenticated upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete media" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admins update media" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete media" ON storage.objects;
CREATE POLICY "Admins upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins update media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins delete media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND public.is_admin());

-- 7. Review who has admin access now. Anyone listed as 'editor' has NO CMS rights.
SELECT u.email, p.role, u.created_at, u.last_sign_in_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY p.role, u.created_at;
