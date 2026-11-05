-- 015 · Support for content imported from the old WordPress site (buchan.com)
-- Keeps every old URL working on the new site. Safe to run more than once.

-- 1. Blog: allow the old categories and remember each post's original URL path
--    (e.g. /company-updates/why-john-buchan-homes/).
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_category_check;
ALTER TABLE posts ADD CONSTRAINT posts_category_check
  CHECK (category IN ('Company Updates', 'Industry News', 'Lifestyle', 'Custom Homes'));
ALTER TABLE posts ADD COLUMN IF NOT EXISTS path TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS posts_path_key ON posts (path) WHERE path IS NOT NULL;

-- 2. Portfolio: optional floor plan / brochure PDF per property.
ALTER TABLE properties ADD COLUMN IF NOT EXISTS brochure_url TEXT NOT NULL DEFAULT '';

-- 3. Pages from the old site that have no direct equivalent on the new site
--    (floor plans, legal pages, landing pages). Served at their original path.
CREATE TABLE IF NOT EXISTS legacy_pages (
  path TEXT PRIMARY KEY,                -- exact old path, with trailing slash
  kind TEXT NOT NULL DEFAULT 'page',    -- page | floorplan | media
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',        -- sanitized HTML
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  file_urls TEXT[] NOT NULL DEFAULT '{}',
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE legacy_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read legacy pages" ON legacy_pages;
CREATE POLICY "Public can read legacy pages" ON legacy_pages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage legacy pages" ON legacy_pages;
CREATE POLICY "Admins manage legacy pages" ON legacy_pages
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Two projects already existed on the new site under new slugs; give them back
--    their original buchan.com URLs (their photos and text are kept).
UPDATE properties SET slug = 'ascension-at-clyde-hill' WHERE slug = '8830-ne-28th-st'
  AND NOT EXISTS (SELECT 1 FROM properties WHERE slug = 'ascension-at-clyde-hill');
UPDATE properties SET slug = '1578-103rd-ct-se' WHERE slug = '13411-179th-ave-ne'
  AND NOT EXISTS (SELECT 1 FROM properties WHERE slug = '1578-103rd-ct-se');

-- 5. The template's sample articles are not real Buchan posts: hide them (not deleted).
UPDATE posts SET status = 'Draft'
WHERE slug IN ('best-of-houzz', 'building-on-your-lot', 'next-generation', 'hand-chosen-lumber',
               'clyde-hill-framing-to-finish', 'built-for-the-rain')
  AND path IS NULL;

SELECT (SELECT count(*) FROM legacy_pages) AS legacy_pages,
       (SELECT string_agg(slug, ', ') FROM properties) AS property_slugs;

-- 6. Old site marks some homes "Pending" (under contract).
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE properties ADD CONSTRAINT properties_status_check
  CHECK (status IN ('Available', 'Coming Soon', 'Pending', 'Sold', 'Draft'));
