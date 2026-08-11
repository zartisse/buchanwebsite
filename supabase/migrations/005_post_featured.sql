-- Post featured flag for blog hero
ALTER TABLE posts ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;
