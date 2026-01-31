-- Add stats columns to about_content table
ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS location_count INTEGER,
  ADD COLUMN IF NOT EXISTS video_count INTEGER,
  ADD COLUMN IF NOT EXISTS country_count INTEGER,
  ADD COLUMN IF NOT EXISTS subscriber_count INTEGER,
  ADD COLUMN IF NOT EXISTS stats_updated_at TIMESTAMPTZ;

-- All columns nullable (optional manual overrides)
-- No RLS changes needed - same policies apply
