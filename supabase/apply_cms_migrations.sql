-- Apply CMS migrations 003–006 in one run (if 001–002 already applied)
-- Paste into Supabase → SQL Editor → Run

-- 003: Coming Soon property status
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE properties ADD CONSTRAINT properties_status_check
  CHECK (status IN ('Available', 'Coming Soon', 'Sold', 'Draft'));

-- 004: Hub pages table
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

-- 005: Post featured flag
ALTER TABLE posts ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

-- 006: Property portfolio type
ALTER TABLE properties ADD COLUMN IF NOT EXISTS portfolio_type TEXT NOT NULL DEFAULT 'custom-homes';

-- Media storage bucket (from 001 — safe to re-run)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;
