-- Create an admin user for /admin/login
-- Run in Supabase SQL Editor AFTER 001_schema.sql
--
-- 1. Change admin_email and admin_password below before running
-- 2. Run this script once
-- 3. Sign in at /admin/login
-- 4. Change the password after first login (recommended)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  admin_user_id uuid := gen_random_uuid();
  admin_email text := 'admin@buchan.com';
  admin_password text := 'BuchanAdmin2026!';
  admin_display_name text := 'Admin';
BEGIN
  IF admin_password = 'BuchanAdmin2026!' THEN
    RAISE NOTICE 'Using default password. Change admin_password in this script before production use.';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    RAISE NOTICE 'User already exists: %. Promoting profile to admin.', admin_email;

    UPDATE profiles
    SET role = 'admin',
        display_name = admin_display_name
    WHERE id = (SELECT id FROM auth.users WHERE email = admin_email);

    RETURN;
  END IF;

  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    admin_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('display_name', admin_display_name),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    admin_user_id,
    jsonb_build_object(
      'sub', admin_user_id::text,
      'email', admin_email,
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    admin_email,
    NOW(),
    NOW(),
    NOW()
  );

  -- handle_new_user trigger usually creates an editor profile; ensure admin role
  INSERT INTO profiles (id, display_name, role)
  VALUES (admin_user_id, admin_display_name, 'admin')
  ON CONFLICT (id) DO UPDATE
  SET display_name = EXCLUDED.display_name,
      role = 'admin';

  RAISE NOTICE 'Admin user created: %', admin_email;
END $$;
