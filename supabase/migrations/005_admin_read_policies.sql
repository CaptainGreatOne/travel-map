-- Migration: 005_admin_read_policies
-- Description: Add read policies for admin to view all suggestions and reminders
-- Phase: 05-admin-panel

-- ============================================================================
-- SUGGESTIONS READ POLICY (for admin moderation)
-- ============================================================================

-- Allow authenticated users to read all suggestions (admin access controlled at UI level)
CREATE POLICY "suggestions_auth_read" ON suggestions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- REMINDERS READ POLICY (for admin viewing)
-- ============================================================================

-- Allow authenticated users to read all reminders (admin access controlled at UI level)
CREATE POLICY "reminders_auth_read" ON reminders
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete reminders (admin can clean up spam)
CREATE POLICY "reminders_auth_delete" ON reminders
  FOR DELETE
  USING (auth.role() = 'authenticated');
