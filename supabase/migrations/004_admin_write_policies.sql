-- Migration: 004_admin_write_policies
-- Description: Add write policies for admin operations
-- Phase: 05-admin-panel

-- ============================================================================
-- LOCATIONS WRITE POLICIES
-- ============================================================================

-- Allow authenticated users to insert locations
CREATE POLICY "locations_auth_insert" ON locations
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update locations
CREATE POLICY "locations_auth_update" ON locations
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete locations
CREATE POLICY "locations_auth_delete" ON locations
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- VIDEOS WRITE POLICIES
-- ============================================================================

CREATE POLICY "videos_auth_insert" ON videos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "videos_auth_update" ON videos
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "videos_auth_delete" ON videos
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- LOCATION_VIDEOS WRITE POLICIES
-- ============================================================================

CREATE POLICY "location_videos_auth_insert" ON location_videos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "location_videos_auth_delete" ON location_videos
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- SUGGESTIONS UPDATE POLICY (for admin moderation)
-- ============================================================================

CREATE POLICY "suggestions_auth_update" ON suggestions
  FOR UPDATE
  USING (auth.role() = 'authenticated');
