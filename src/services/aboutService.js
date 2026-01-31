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

/**
 * Update stats fields in about_content
 * @param {Object} stats - Stats to update (location_count, video_count, country_count, subscriber_count)
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function updateAboutStats(stats) {
  // Filter out undefined values to allow partial updates
  const validStats = {};
  if (stats.location_count !== undefined) validStats.location_count = stats.location_count;
  if (stats.video_count !== undefined) validStats.video_count = stats.video_count;
  if (stats.country_count !== undefined) validStats.country_count = stats.country_count;
  if (stats.subscriber_count !== undefined) validStats.subscriber_count = stats.subscriber_count;

  const { data, error } = await supabase
    .from('about_content')
    .update({
      ...validStats,
      stats_updated_at: new Date().toISOString()
    })
    .eq('id', 1)
    .select()
    .single();

  if (error) {
    console.error('Error updating about stats:', error);
    return { success: false, error: 'Failed to update stats' };
  }

  return { success: true, data };
}
