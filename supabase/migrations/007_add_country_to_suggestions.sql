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
