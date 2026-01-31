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
