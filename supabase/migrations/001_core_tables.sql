-- Core Tables Migration
-- Creates: categories, locations, videos, location_videos
-- Phase: 04-database-schema-redesign

-- =============================================================================
-- 1. CATEGORIES TABLE
-- =============================================================================

CREATE TABLE categories (
  id text PRIMARY KEY,                    -- e.g., 'nature', 'city', 'food'
  name text NOT NULL,                     -- Display name
  icon text,                              -- Emoji icon
  color_hex text,                         -- e.g., '#4CAF50'
  color_name text,                        -- e.g., 'green'
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);

-- =============================================================================
-- 2. LOCATIONS TABLE
-- =============================================================================

CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,              -- URL-friendly identifier
  name text NOT NULL,
  latitude decimal NOT NULL,
  longitude decimal NOT NULL,
  category_id text REFERENCES categories(id),
  has_visited boolean DEFAULT false,
  date_visited date,                      -- Nullable
  short_description text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "locations_public_read" ON locations
  FOR SELECT USING (true);

-- Indexes
CREATE INDEX locations_category_id_idx ON locations(category_id);
CREATE INDEX locations_has_visited_idx ON locations(has_visited);

-- =============================================================================
-- 3. VIDEOS TABLE
-- =============================================================================

CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id text UNIQUE NOT NULL,        -- The video ID from YouTube URL
  title text NOT NULL,
  description text,
  thumbnail_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "videos_public_read" ON videos
  FOR SELECT USING (true);

-- =============================================================================
-- 4. LOCATION_VIDEOS JUNCTION TABLE
-- =============================================================================

CREATE TABLE location_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,        -- For ordering (0-2)
  created_at timestamptz DEFAULT now(),
  UNIQUE(location_id, video_id)
);

-- Enable RLS
ALTER TABLE location_videos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "location_videos_public_read" ON location_videos
  FOR SELECT USING (true);

-- Indexes
CREATE INDEX location_videos_location_id_idx ON location_videos(location_id);
CREATE INDEX location_videos_video_id_idx ON location_videos(video_id);

-- =============================================================================
-- 5. MAX 3 VIDEOS PER LOCATION CONSTRAINT (Trigger)
-- =============================================================================

CREATE OR REPLACE FUNCTION check_max_videos_per_location()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM location_videos WHERE location_id = NEW.location_id) >= 3 THEN
    RAISE EXCEPTION 'A location can have a maximum of 3 videos';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_videos_per_location
  BEFORE INSERT ON location_videos
  FOR EACH ROW
  EXECUTE FUNCTION check_max_videos_per_location();

-- =============================================================================
-- 6. UPDATED_AT TRIGGER FOR LOCATIONS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
