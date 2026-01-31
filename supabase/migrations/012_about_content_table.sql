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

-- Seed with current hardcoded values
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
