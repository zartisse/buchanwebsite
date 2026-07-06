-- Buchan Homes schema

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('editor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Company Updates', 'Industry News')),
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Portfolio properties
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Sold', 'Draft')),
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  beds TEXT NOT NULL DEFAULT '',
  baths TEXT NOT NULL DEFAULT '',
  sqft TEXT NOT NULL DEFAULT '',
  lot TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  gallery_urls TEXT[] NOT NULL DEFAULT '{}',
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  featured_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), 'editor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: users read own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Posts: public read published, authenticated full access
CREATE POLICY "Public can read published posts" ON posts
  FOR SELECT USING (status = 'Published');

CREATE POLICY "Authenticated users full access posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Properties: public read non-draft, authenticated full access
CREATE POLICY "Public can read non-draft properties" ON properties
  FOR SELECT USING (status != 'Draft');

CREATE POLICY "Authenticated users full access properties" ON properties
  FOR ALL USING (auth.role() = 'authenticated');

-- Submissions: public insert, authenticated full access
CREATE POLICY "Public can insert submissions" ON submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users full access submissions" ON submissions
  FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated update media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
