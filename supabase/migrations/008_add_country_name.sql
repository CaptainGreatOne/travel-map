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
