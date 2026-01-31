import { supabase } from '../utils/supabaseClient';

/**
 * Fetch about page content
 * @returns {Promise<Object|null>} About content or null on error
 */
export async function fetchAboutContent() {
  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching about content:', error);
    return null;
  }

  return data;
}

/**
 * Update about page content
 * @param {Object} updates - Fields to update
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function updateAboutContent(updates) {
  const { data, error } = await supabase
    .from('about_content')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();

  if (error) {
    console.error('Error updating about content:', error);
    return { success: false, error: 'Failed to update content' };
  }

  return { success: true, data };
}
