-- 013 · Brand copy fixes for content already stored in the CMS
-- Brings live page text in line with the JBH brand book and house rules:
--   * "Seattle Eastside" -> "Bellevue and the Greater Eastside"
--   * founding year is 1961 everywhere (some pages said 1960)
--   * removes unverified claims ("4,000+ homes built", "Three generations")
--   * "since 1961" no longer repeated in the home hero and marquee
--   * replaces the sample featured testimonial with a real client review
-- Safe to run more than once. Run in Supabase -> SQL Editor (or via npm run deploy:fixes).

CREATE OR REPLACE FUNCTION pg_temp.jbh_fix(t text) RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
      t,
      'on the Seattle Eastside, Bellevue, Clyde Hill', 'in Bellevue, Clyde Hill'),
      'the greater Seattle Eastside', 'the Greater Eastside'),
      'across the Seattle Eastside', 'across Bellevue and the Greater Eastside'),
      'on the Seattle Eastside', 'in Bellevue and the Greater Eastside'),
      'Building since 1961 · Seattle Eastside', 'Custom Homes & Renovations · Bellevue & the Greater Eastside'),
      'Seattle Eastside', 'Greater Eastside'),
      'since 1960', 'since 1961'),
      'Three generations of Buchan craftsmen building in Bellevue and the Greater Eastside since 1961', 'Family-owned John Buchan Homes, building in Bellevue and the Greater Eastside since 1961'),
      'Three generations of Buchan craftsmen, building on the Eastside since 1961.', 'Family-owned and building on the Eastside since 1961.'),
      'Three generations, one standard, yours.', 'One family, one standard, yours.'),
      'Three generations, one standard — yours.', 'One family, one standard — yours.'),
      'Three generations of hands-on building standards.', 'Hands-on building standards, held for 65 years.'),
      'Serving Bellevue and the Eastside', 'Serving Bellevue & the Greater Eastside'),
      'Celebrating 65 Years · Family-owned since 1961 · ', 'Celebrating 65 Years · Family-owned · '),
    '\{"label"\s*:\s*"4,000\+ homes built"\}\s*,?', '', 'g'),
    '\s*[·|]\s*4,000\+ homes built', '', 'g'),
    '"4,000\+ homes built"\s*,?', '', 'g'),
    ',(\s*)\]', '\1]', 'g');
$$;

UPDATE site_pages
SET content = pg_temp.jbh_fix(content::text)::jsonb,
    meta_title = pg_temp.jbh_fix(meta_title),
    meta_description = pg_temp.jbh_fix(meta_description),
    updated_at = now()
WHERE content::text ~ '(Seattle Eastside|since 1960|4,000\+ homes|Three generations|Family-owned since 1961 · |Building since 1961 · )'
   OR meta_title ~ '(Seattle Eastside|since 1960)'
   OR meta_description ~ '(Seattle Eastside|since 1960|Three generations)';

-- Timeline entries store the founding year on its own ("year": "1960").
UPDATE site_pages
SET content = regexp_replace(content::text, '"year"\s*:\s*"1960"', '"year": "1961"', 'g')::jsonb,
    updated_at = now()
WHERE content::text ~ '"year"\s*:\s*"1960"';

-- hub_pages only exists if migration 004 was applied
DO $do$
BEGIN
  IF to_regclass('public.hub_pages') IS NOT NULL THEN
    UPDATE hub_pages
    SET content = pg_temp.jbh_fix(content::text)::jsonb,
        meta_title = pg_temp.jbh_fix(meta_title),
        meta_description = pg_temp.jbh_fix(meta_description),
        updated_at = now()
    WHERE content::text ~ '(Seattle Eastside|since 1960|4,000\+ homes|Three generations)'
       OR meta_title ~ '(Seattle Eastside|since 1960)'
       OR meta_description ~ '(Seattle Eastside|since 1960|Three generations)';
  END IF;
END
$do$;

-- Featured testimonial: the "Harmon Family" quote came from the sample seed data.
UPDATE site_pages
SET content = jsonb_set(
      content,
      '{featured}',
      (content->'featured') || jsonb_build_object(
        'quote', 'John Buchan Homes has always been our family''s first choice builder. The difference in quality is noticeable immediately.',
        'cite', 'Carl Nicholson · Medina'
      )
    ),
    updated_at = now()
WHERE slug = 'testimonials' AND content->'featured'->>'cite' ILIKE '%Harmon%';

-- Check: should return no rows.
SELECT slug FROM site_pages
WHERE content::text ~ '(Seattle Eastside|since 1960|4,000\+ homes|Three generations)';
