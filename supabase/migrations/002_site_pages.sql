-- Site pages CMS + property featured columns
-- Safe to run even if 001_schema.sql was not applied (includes shared trigger function).

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS site_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS site_pages_updated_at ON site_pages;
CREATE TRIGGER site_pages_updated_at BEFORE UPDATE ON site_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site pages" ON site_pages;
CREATE POLICY "Public can read site pages" ON site_pages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users full access site pages" ON site_pages;
CREATE POLICY "Authenticated users full access site pages" ON site_pages
  FOR ALL USING (auth.role() = 'authenticated');

-- Property featured columns (only if 001_schema.sql has been applied)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'properties'
  ) THEN
    ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured_order INT NOT NULL DEFAULT 0;
  END IF;
END $$;
