-- Seed data for Travel Map application
-- Run this after migrations to populate initial data
-- Generated from src/data/sampleData.js

-- =============================================================================
-- 1. SEED CATEGORIES
-- =============================================================================

INSERT INTO categories (id, name, icon, color_hex, color_name) VALUES
  ('nature', 'Nature & Outdoors', '🌲', '#4CAF50', 'green'),
  ('city', 'Cities & Towns', '🏙️', '#2196F3', 'blue'),
  ('food', 'Food & Dining', '🍴', '#F44336', 'red'),
  ('culture', 'Culture & History', '🎨', '#9C27B0', 'violet'),
  ('beach', 'Beaches & Islands', '🏖️', '#FFC107', 'yellow')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. SEED LOCATIONS
-- =============================================================================

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
