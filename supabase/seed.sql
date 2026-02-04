-- Travel Map Database Schema
-- Generated from migrations for fresh deployment
-- Run this in Supabase SQL Editor for new projects
--
-- This file consolidates all migrations (001-016) into a single setup script.
-- For incremental updates to existing databases, see supabase/migrations/

-- ============================================
-- 001_core_tables.sql
-- ============================================

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

-- ============================================
-- 002_suggestions_and_rate_limiting.sql
-- ============================================

-- Migration: 002_suggestions_and_rate_limiting
-- Description: Create suggestions, reminders, and rate limiting infrastructure
-- Phase: 04-database-schema-redesign

-- ============================================================================
-- SUGGESTIONS TABLE (new location requests from users)
-- ============================================================================

CREATE TABLE suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_name text NOT NULL,
  google_maps_url text, -- User may not provide, nullable
  latitude decimal, -- Extracted from URL if possible
  longitude decimal, -- Extracted from URL if possible
  reason text, -- Why they want this location
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text, -- For admin to track decisions
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

-- Indexes for suggestions
CREATE INDEX idx_suggestions_user_id ON suggestions(user_id);
CREATE INDEX idx_suggestions_status ON suggestions(status);
CREATE INDEX idx_suggestions_created_at ON suggestions(created_at);

-- ============================================================================
-- REMINDERS TABLE (reminders for existing locations)
-- ============================================================================

CREATE TABLE reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  message text, -- Optional message from user
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, location_id) -- One reminder per user per location
);

-- Indexes for reminders
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_location_id ON reminders(location_id);

-- ============================================================================
-- RATE LIMITING INFRASTRUCTURE
-- ============================================================================

-- ============================================================================
-- Counting Tables
-- ============================================================================

-- Track monthly suggestion counts per user
CREATE TABLE user_suggestion_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year_month text NOT NULL, -- Format: 'YYYY-MM'
  suggestion_count integer DEFAULT 0,
  UNIQUE(user_id, year_month)
);

-- Track monthly reminder counts per user
CREATE TABLE user_reminder_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year_month text NOT NULL, -- Format: 'YYYY-MM'
  reminder_count integer DEFAULT 0,
  UNIQUE(user_id, year_month)
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_suggestion_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reminder_counts ENABLE ROW LEVEL SECURITY;

-- Suggestions policies
CREATE POLICY "Users can view their own suggestions"
  ON suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own suggestions"
  ON suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Reminders policies
CREATE POLICY "Users can view their own reminders"
  ON reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own reminders"
  ON reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Counting tables policies (read-only for users, managed by triggers)
CREATE POLICY "Users can view their own suggestion counts"
  ON user_suggestion_counts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reminder counts"
  ON user_reminder_counts FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 003_rate_limit_whitelist.sql
-- ============================================

-- Migration: 003_rate_limit_whitelist
-- Description: Add whitelist table for accounts exempt from rate limits
-- Phase: 04-database-schema-redesign

-- ============================================================================
-- WHITELIST TABLE
-- ============================================================================

CREATE TABLE rate_limit_whitelist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text, -- Why this user is whitelisted (e.g., 'test account', 'admin')
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Index for fast lookup
CREATE INDEX idx_whitelist_user_id ON rate_limit_whitelist(user_id);

-- ============================================================================
-- RATE LIMITING FUNCTIONS (with whitelist check)
-- ============================================================================

-- Check and enforce suggestion limit (1 per month) - with whitelist bypass
CREATE OR REPLACE FUNCTION check_suggestion_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_month text;
  current_count integer;
  is_whitelisted boolean;
BEGIN
  -- Check if user is whitelisted
  SELECT EXISTS(
    SELECT 1 FROM rate_limit_whitelist WHERE user_id = NEW.user_id
  ) INTO is_whitelisted;

  -- Skip limit check for whitelisted users
  IF is_whitelisted THEN
    RETURN NEW;
  END IF;

  current_month := to_char(now(), 'YYYY-MM');

  SELECT suggestion_count INTO current_count
  FROM user_suggestion_counts
  WHERE user_id = NEW.user_id AND year_month = current_month;

  IF current_count IS NOT NULL AND current_count >= 1 THEN
    RAISE EXCEPTION 'Monthly suggestion limit reached (1 per month)';
  END IF;

  -- Upsert the count
  INSERT INTO user_suggestion_counts (user_id, year_month, suggestion_count)
  VALUES (NEW.user_id, current_month, 1)
  ON CONFLICT (user_id, year_month)
  DO UPDATE SET suggestion_count = user_suggestion_counts.suggestion_count + 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check and enforce reminder limit (3 per month) - with whitelist bypass
CREATE OR REPLACE FUNCTION check_reminder_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_month text;
  current_count integer;
  is_whitelisted boolean;
BEGIN
  -- Check if user is whitelisted
  SELECT EXISTS(
    SELECT 1 FROM rate_limit_whitelist WHERE user_id = NEW.user_id
  ) INTO is_whitelisted;

  -- Skip limit check for whitelisted users
  IF is_whitelisted THEN
    RETURN NEW;
  END IF;

  current_month := to_char(now(), 'YYYY-MM');

  SELECT reminder_count INTO current_count
  FROM user_reminder_counts
  WHERE user_id = NEW.user_id AND year_month = current_month;

  IF current_count IS NOT NULL AND current_count >= 3 THEN
    RAISE EXCEPTION 'Monthly reminder limit reached (3 per month)';
  END IF;

  -- Upsert the count
  INSERT INTO user_reminder_counts (user_id, year_month, reminder_count)
  VALUES (NEW.user_id, current_month, 1)
  ON CONFLICT (user_id, year_month)
  DO UPDATE SET reminder_count = user_reminder_counts.reminder_count + 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS FOR RATE LIMITING
-- ============================================================================

CREATE TRIGGER enforce_suggestion_limit
  BEFORE INSERT ON suggestions
  FOR EACH ROW
  EXECUTE FUNCTION check_suggestion_limit();

CREATE TRIGGER enforce_reminder_limit
  BEFORE INSERT ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION check_reminder_limit();

-- ============================================================================
-- ROW LEVEL SECURITY (admin-only access to whitelist)
-- ============================================================================

ALTER TABLE rate_limit_whitelist ENABLE ROW LEVEL SECURITY;

-- No public policies - whitelist is managed via service role / SQL Editor only
-- This prevents users from adding themselves to the whitelist

-- ============================================
-- 004_admin_write_policies.sql
-- ============================================

-- Migration: 004_admin_write_policies
-- Description: Add write policies for admin operations
-- Phase: 05-admin-panel

-- ============================================================================
-- LOCATIONS WRITE POLICIES
-- ============================================================================

-- Allow authenticated users to insert locations
CREATE POLICY "locations_auth_insert" ON locations
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update locations
CREATE POLICY "locations_auth_update" ON locations
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete locations
CREATE POLICY "locations_auth_delete" ON locations
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- VIDEOS WRITE POLICIES
-- ============================================================================

CREATE POLICY "videos_auth_insert" ON videos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "videos_auth_update" ON videos
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "videos_auth_delete" ON videos
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- LOCATION_VIDEOS WRITE POLICIES
-- ============================================================================

CREATE POLICY "location_videos_auth_insert" ON location_videos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "location_videos_auth_delete" ON location_videos
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- SUGGESTIONS UPDATE POLICY (for admin moderation)
-- ============================================================================

CREATE POLICY "suggestions_auth_update" ON suggestions
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 005_admin_read_policies.sql
-- ============================================

-- Migration: 005_admin_read_policies
-- Description: Add read policies for admin to view all suggestions and reminders
-- Phase: 05-admin-panel

-- ============================================================================
-- SUGGESTIONS READ POLICY (for admin moderation)
-- ============================================================================

-- Allow authenticated users to read all suggestions (admin access controlled at UI level)
CREATE POLICY "suggestions_auth_read" ON suggestions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- REMINDERS READ POLICY (for admin viewing)
-- ============================================================================

-- Allow authenticated users to read all reminders (admin access controlled at UI level)
CREATE POLICY "reminders_auth_read" ON reminders
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete reminders (admin can clean up spam)
CREATE POLICY "reminders_auth_delete" ON reminders
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 006_add_country_to_locations.sql
-- ============================================

-- Add Country to Locations Migration
-- Adds country_code column to locations table for country tracking
-- Phase: 08-country-field

-- =============================================================================
-- 1. ADD COUNTRY_CODE COLUMN
-- =============================================================================

ALTER TABLE locations
ADD COLUMN country_code text;

-- Column is nullable - existing locations won't have country
-- Text type for flexibility (most are 2-char ISO codes like 'US', 'JP', 'GB')

-- =============================================================================
-- 2. INDEX FOR EFFICIENT FILTERING
-- =============================================================================

CREATE INDEX locations_country_code_idx ON locations(country_code);

-- Index enables efficient admin filtering by country

-- ============================================
-- 007_add_country_to_suggestions.sql
-- ============================================

-- Migration: 007_add_country_to_suggestions
-- Description: Add country_code column to suggestions table
-- Phase: 08-country-field (fix)

-- =============================================================================
-- 1. ADD COUNTRY_CODE COLUMN TO SUGGESTIONS
-- =============================================================================

ALTER TABLE suggestions
ADD COLUMN country_code text;

-- Column is nullable - country extraction from URLs is best-effort
-- Most URLs won't contain parseable country information

-- ============================================
-- 008_add_country_name.sql
-- ============================================

-- Migration: 008_add_country_name
-- Description: Add country column (full name) to suggestions and locations tables
-- Phase: 08-country-field (enhancement)

-- =============================================================================
-- 1. ADD COUNTRY COLUMN TO SUGGESTIONS
-- =============================================================================

ALTER TABLE suggestions
ADD COLUMN country text;

-- =============================================================================
-- 2. ADD COUNTRY COLUMN TO LOCATIONS
-- =============================================================================

ALTER TABLE locations
ADD COLUMN country text;

-- Both columns are nullable - country extraction is best-effort
-- country stores the full name (e.g., "France")
-- country_code stores the ISO code (e.g., "FR")

-- ============================================
-- 009_photos_table.sql
-- ============================================

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

-- ============================================
-- 010_photos_storage_bucket.sql
-- ============================================

-- Create photos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to photos
CREATE POLICY "Photos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete photos
CREATE POLICY "Authenticated users can delete photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- ============================================
-- 011_photos_write_policies.sql
-- ============================================

-- Migration: 011_photos_write_policies
-- Description: Add write policies for photos table (admin operations)

-- Allow authenticated users to insert photos
CREATE POLICY "photos_auth_insert" ON photos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update photos
CREATE POLICY "photos_auth_update" ON photos
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete photos
CREATE POLICY "photos_auth_delete" ON photos
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 012_about_content_table.sql
-- ============================================

-- About page content (single row table)
CREATE TABLE IF NOT EXISTS about_content (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  youtube_video_id TEXT,
  bio_paragraph_1 TEXT,
  bio_paragraph_2 TEXT,
  bio_paragraph_3 TEXT,
  youtube_url TEXT,
  instagram_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "About content is publicly viewable"
  ON about_content FOR SELECT
  USING (true);

-- Authenticated users can update
CREATE POLICY "about_content_auth_update" ON about_content
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Seed with placeholder values
INSERT INTO about_content (
  youtube_video_id,
  bio_paragraph_1,
  bio_paragraph_2,
  bio_paragraph_3,
  youtube_url,
  instagram_url
) VALUES (
  'YOUR_VIDEO_ID',
  'Hi, I''m A BITCHIN MOOSE! I''m a travel enthusiast documenting my adventures around the globe. This interactive map showcases over 600 locations I''ve either visited or dream of exploring.',
  'Through my YouTube channel, I share travel vlogs, guides, and tips to help you plan your own adventures. Each video is linked to specific locations on the map, making it easy to discover places and learn from my experiences.',
  'Whether you''re planning your next trip or just dreaming about future destinations, I hope this map inspires you to explore the world!',
  'https://youtube.com/@yourchannel',
  'https://instagram.com/capt_gr8_1'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 013_about_content_write_policies.sql
-- ============================================

-- Allow authenticated users to insert about
CREATE POLICY "about_auth_insert" ON about_content
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete about
CREATE POLICY "about_auth_delete" ON about_content
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 014_about_content_stats.sql
-- ============================================

-- Add stats columns to about_content table
ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS location_count INTEGER,
  ADD COLUMN IF NOT EXISTS video_count INTEGER,
  ADD COLUMN IF NOT EXISTS country_count INTEGER,
  ADD COLUMN IF NOT EXISTS subscriber_count INTEGER,
  ADD COLUMN IF NOT EXISTS stats_updated_at TIMESTAMPTZ;

-- All columns nullable (optional manual overrides)
-- No RLS changes needed - same policies apply

-- ============================================
-- 015_instagram_widget_settings.sql
-- ============================================

-- Add Instagram widget configuration columns to about_content table
ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS instagram_widget_type TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS instagram_widget_code TEXT,
  ADD COLUMN IF NOT EXISTS instagram_username TEXT;

-- instagram_widget_type options:
--   'none': No widget displayed (just the existing profile link button)
--   'lightwidget': Third-party LightWidget embed (works without API)
--   'official': Instagram official embed (requires Meta API setup)

-- instagram_widget_code: The embed code/script from widget provider
--   For LightWidget: The iframe/script snippet from lightwidget.com
--   For official: The Instagram embed code

-- instagram_username: Username (without @) for deep links
--   Used to construct app deep link: instagram://user?username=X
--   Extracted from instagram_url if not set

-- All columns nullable. No RLS changes needed - same policies apply

-- ============================================
-- 016_social_links.sql
-- ============================================

-- Add social_links column to about_content table for additional social platforms
-- Stores array of objects: [{platform: 'tiktok', url: 'https://...', label: 'TikTok'}, ...]

ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb;

-- social_links structure:
--   platform: 'tiktok' | 'twitter' | 'facebook' | 'website' | 'other'
--   url: full URL to the social profile
--   label: display label (defaults to platform name if not set)

-- Example data:
-- [
--   {"platform": "tiktok", "url": "https://tiktok.com/@user", "label": "TikTok"},
--   {"platform": "twitter", "url": "https://x.com/user", "label": "X (Twitter)"}
-- ]

-- No RLS changes needed - same policies apply

-- ============================================
-- SEED DATA
-- ============================================

-- Seed Categories
INSERT INTO categories (id, name, icon, color_hex, color_name) VALUES
  ('nature', 'Nature & Outdoors', '🌲', '#4CAF50', 'green'),
  ('city', 'Cities & Towns', '🏙️', '#2196F3', 'blue'),
  ('food', 'Food & Dining', '🍴', '#F44336', 'red'),
  ('culture', 'Culture & History', '🎨', '#9C27B0', 'violet'),
  ('beach', 'Beaches & Islands', '🏖️', '#FFC107', 'yellow')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Locations (optional - remove if importing your own data)
INSERT INTO locations (slug, name, latitude, longitude, category_id, has_visited, date_visited, short_description, notes) VALUES
  ('reykjavik-iceland', 'Reykjavik, Iceland', 64.1466, -21.9426, 'city', true, '2024-06-15', 'Vibrant capital with northern lights and hot springs', 'Amazing northern lights and geothermal pools'),
  ('kyoto-japan', 'Kyoto, Japan', 35.0116, 135.7681, 'culture', true, '2023-03-20', 'Ancient temples and traditional Japanese culture', 'Beautiful temples and traditional culture'),
  ('patagonia-argentina', 'Patagonia, Argentina', -50.3375, -72.2489, 'nature', false, NULL, 'Epic hiking trails and massive glaciers', 'Epic hiking and glaciers - bucket list!'),
  ('santorini-greece', 'Santorini, Greece', 36.3932, 25.4615, 'beach', false, NULL, 'Stunning sunsets and white-washed buildings', 'Sunset views and white-washed buildings'),
  ('banff-canada', 'Banff National Park, Canada', 51.4968, -115.9281, 'nature', true, '2024-08-10', 'Turquoise mountain lakes and wildlife', 'Stunning mountain lakes and wildlife'),
  ('tokyo-tsukiji', 'Tsukiji Fish Market, Tokyo', 35.6654, 139.7707, 'food', true, '2023-03-18', 'World-famous fish market and sushi', 'Fresh sushi breakfast at 5am - incredible!'),
  ('machu-picchu', 'Machu Picchu, Peru', -13.1631, -72.5450, 'culture', false, NULL, 'Ancient Incan citadel in the mountains', 'Must do the Inca Trail hike'),
  ('bali-beaches', 'Seminyak Beach, Bali', -8.6905, 115.1669, 'beach', true, '2024-02-10', 'Perfect surfing and beach sunsets', 'Best sunset beach in Bali'),
  ('yosemite', 'Yosemite National Park, USA', 37.8651, -119.5383, 'nature', true, '2023-07-04', 'Iconic granite cliffs and waterfalls', 'Half Dome hike was challenging but worth it'),
  ('paris-louvre', 'Louvre Museum, Paris', 48.8606, 2.3376, 'culture', false, NULL, 'World''s largest art museum', 'Need at least 2 full days to see everything')
ON CONFLICT (slug) DO NOTHING;
