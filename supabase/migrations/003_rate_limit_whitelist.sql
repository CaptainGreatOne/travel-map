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
-- UPDATED RATE LIMITING FUNCTIONS (with whitelist check)
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
-- ROW LEVEL SECURITY (admin-only access to whitelist)
-- ============================================================================

ALTER TABLE rate_limit_whitelist ENABLE ROW LEVEL SECURITY;

-- No public policies - whitelist is managed via service role / SQL Editor only
-- This prevents users from adding themselves to the whitelist
