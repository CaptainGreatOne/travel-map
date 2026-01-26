import { supabase } from '../utils/supabaseClient';

// ============================================================================
// Location Operations
// ============================================================================

/**
 * Create a new location
 * @param {Object} data - { slug, name, latitude, longitude, category_id, country_code, has_visited, date_visited, short_description, notes }
 * @returns {{ success: boolean, data?: Object, error?: string }}
 */
export async function createLocation(data) {
  const { data: location, error } = await supabase
    .from('locations')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Failed to create location:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: location };
}

/**
 * Update an existing location
 * @param {string} id - Location UUID
 * @param {Object} data - Fields to update (including country_code)
 * @returns {{ success: boolean, data?: Object, error?: string }}
 */
export async function updateLocation(id, data) {
  const { data: location, error } = await supabase
    .from('locations')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update location:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: location };
}

/**
 * Delete a location
 * @param {string} id - Location UUID
 * @returns {{ success: boolean, error?: string }}
 */
export async function deleteLocation(id) {
  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete location:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================================================
// Video Operations
// ============================================================================

/**
 * Create a new video
 * @param {Object} data - { youtube_id, title, description, thumbnail_url }
 * @returns {{ success: boolean, data?: Object, error?: string }}
 */
export async function createVideo(data) {
  const { data: video, error } = await supabase
    .from('videos')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Failed to create video:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: video };
}

/**
 * Delete a video
 * @param {string} id - Video UUID
 * @returns {{ success: boolean, error?: string }}
 */
export async function deleteVideo(id) {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete video:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Fetch all videos with their linked locations
 * @returns {Array|null} - Array of videos with location_videos data or null on error
 */
export async function fetchVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*, location_videos(location_id)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch videos:', error);
    return null;
  }

  return data;
}

/**
 * Link a video to a location
 * @param {string} locationId - Location UUID
 * @param {string} videoId - Video UUID
 * @param {number} displayOrder - Order for display (default: 0)
 * @returns {{ success: boolean, error?: string }}
 */
export async function linkVideoToLocation(locationId, videoId, displayOrder = 0) {
  const { error } = await supabase
    .from('location_videos')
    .insert({
      location_id: locationId,
      video_id: videoId,
      display_order: displayOrder
    });

  if (error) {
    // Check for max videos constraint
    if (error.message.includes('Maximum')) {
      return { success: false, error: 'Maximum 3 videos per location allowed.' };
    }
    console.error('Failed to link video to location:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Unlink a video from a location
 * @param {string} locationId - Location UUID
 * @param {string} videoId - Video UUID
 * @returns {{ success: boolean, error?: string }}
 */
export async function unlinkVideoFromLocation(locationId, videoId) {
  const { error } = await supabase
    .from('location_videos')
    .delete()
    .eq('location_id', locationId)
    .eq('video_id', videoId);

  if (error) {
    console.error('Failed to unlink video from location:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================================================
// Suggestion Operations
// ============================================================================

/**
 * Fetch all suggestions, optionally filtered by status
 * @param {string|null} status - Filter by status ('pending', 'approved', 'rejected') or null for all
 * @returns {Array|null} - Array of suggestions or null on error
 */
export async function fetchSuggestions(status = null) {
  let query = supabase
    .from('suggestions')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch suggestions:', error);
    return null;
  }

  return data;
}

/**
 * Update suggestion status with optional admin notes
 * @param {string} id - Suggestion UUID
 * @param {string} status - New status ('approved' | 'rejected')
 * @param {string|null} adminNotes - Optional admin notes
 * @returns {{ success: boolean, data?: Object, error?: string }}
 */
export async function updateSuggestionStatus(id, status, adminNotes = null) {
  const updateData = {
    status,
    reviewed_at: new Date().toISOString()
  };

  if (adminNotes !== null) {
    updateData.admin_notes = adminNotes;
  }

  const { data, error } = await supabase
    .from('suggestions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update suggestion status:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// ============================================================================
// Reminder Operations
// ============================================================================

/**
 * Fetch all reminders with location info
 * @returns {Array|null} - Array of reminders with location data or null on error
 */
export async function fetchReminders() {
  const { data, error } = await supabase
    .from('reminders')
    .select(`
      *,
      location:locations(id, name, slug)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch reminders:', error);
    return null;
  }

  return data;
}

/**
 * Delete a reminder
 * @param {string} id - Reminder UUID
 * @returns {{ success: boolean, error?: string }}
 */
export async function deleteReminder(id) {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete reminder:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================================================
// Dashboard Metrics
// ============================================================================

/**
 * Fetch dashboard metrics: total locations, pending suggestions, total reminders
 * @returns {{ totalLocations: number, pendingSuggestions: number, totalReminders: number }}
 */
export async function fetchDashboardMetrics() {
  const [locationsRes, suggestionsRes, remindersRes] = await Promise.all([
    supabase.from('locations').select('id', { count: 'exact', head: true }),
    supabase.from('suggestions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reminders').select('id', { count: 'exact', head: true })
  ]);

  if (locationsRes.error) {
    console.error('Failed to count locations:', locationsRes.error);
  }
  if (suggestionsRes.error) {
    console.error('Failed to count suggestions:', suggestionsRes.error);
  }
  if (remindersRes.error) {
    console.error('Failed to count reminders:', remindersRes.error);
  }

  return {
    totalLocations: locationsRes.count || 0,
    pendingSuggestions: suggestionsRes.count || 0,
    totalReminders: remindersRes.count || 0
  };
}
