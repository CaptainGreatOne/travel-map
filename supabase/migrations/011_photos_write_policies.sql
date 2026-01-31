-- Migration: 011_photos_write_policies
-- Description: Add write policies for photos table (admin operations)

-- Allow authenticated users to insert photos
CREATE POLICY "photos_auth_insert" ON photos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update photos
CREATE POLICY "photos_auth_update" ON photos
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete photos
CREATE POLICY "photos_auth_delete" ON photos
  FOR DELETE
  USING (auth.role() = 'authenticated');
