-- Hub pages CMS for IA / marketing routes
-- Run after 002_site_pages.sql

CREATE TABLE IF NOT EXISTS hub_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS hub_pages_updated_at ON hub_pages;
CREATE TRIGGER hub_pages_updated_at BEFORE UPDATE ON hub_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE hub_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read hub pages" ON hub_pages;
CREATE POLICY "Public can read hub pages" ON hub_pages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users full access hub pages" ON hub_pages;
CREATE POLICY "Authenticated users full access hub pages" ON hub_pages
  FOR ALL USING (auth.role() = 'authenticated');
