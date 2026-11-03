-- 014 · Remove sample leads that came from supabase/seed.sql
-- These were invented test inquiries (555 phone numbers). Real leads are untouched:
-- a row is only deleted if BOTH its email and its 555 phone match the sample data.
-- Safe to run more than once.

DELETE FROM submissions
WHERE (email, phone) IN (
  ('a.coletti@gmail.com', '206-555-0142'),
  ('mwhitfield@whitfieldcap.com', '425-555-0199'),
  ('levyhome@icloud.com', '206-555-0177')
)
OR phone ~ '^\(?[0-9]{3}\)?[-. ]555-01[0-9]{2}$';

-- Check: should return no rows.
SELECT name, email, phone FROM submissions WHERE phone LIKE '%555-01%';
