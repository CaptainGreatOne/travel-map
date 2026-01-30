-- Photos table for Photography page
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  location TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering
CREATE INDEX idx_photos_display_order ON photos(display_order);

-- RLS policies
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Photos are publicly viewable"
  ON photos FOR SELECT
  USING (true);

-- No public write - admin only via service role
