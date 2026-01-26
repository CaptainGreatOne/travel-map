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
