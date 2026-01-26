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
-- Rate Limiting Functions
-- ============================================================================

-- Check and enforce suggestion limit (1 per month)
CREATE OR REPLACE FUNCTION check_suggestion_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_month text;
  current_count integer;
BEGIN
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

-- Check and enforce reminder limit (3 per month)
CREATE OR REPLACE FUNCTION check_reminder_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_month text;
  current_count integer;
BEGIN
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
-- Triggers
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
