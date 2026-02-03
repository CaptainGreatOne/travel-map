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
