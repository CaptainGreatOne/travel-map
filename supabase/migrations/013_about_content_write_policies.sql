
-- Allow authenticated users to insert about
CREATE POLICY "about_auth_insert" ON about_content
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update about
CREATE POLICY "about_auth_update" ON about_content
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete about
CREATE POLICY "about_auth_delete" ON about_content
  FOR DELETE
  USING (auth.role() = 'authenticated');