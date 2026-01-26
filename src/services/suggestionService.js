import { supabase } from '../utils/supabaseClient';

/**
 * Submits a new location suggestion
 * data: { locationName, googleMapsUrl, latitude, longitude, reason, countryCode }
 * Returns: { success: boolean, error?: string }
 */
export async function submitSuggestion(userId, data) {
  const { error } = await supabase
    .from('suggestions')
    .insert({
      user_id: userId,
      location_name: data.locationName,
      google_maps_url: data.googleMapsUrl || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      reason: data.reason,
      country_code: data.countryCode || null
    });

  if (error) {
    // Check for rate limit error from trigger
    if (error.message.includes('limit reached')) {
      return { success: false, error: 'You have reached your monthly suggestion limit (1 per month).' };
    }
    console.error('Suggestion submission error:', error);
    return { success: false, error: 'Unable to submit suggestion. Please try again later.' };
  }

  return { success: true };
}

/**
 * Submits a reminder for an existing location
 * Returns: { success: boolean, error?: string }
 */
export async function submitReminder(userId, locationId, message = null) {
  const { error } = await supabase
    .from('reminders')
    .insert({
      user_id: userId,
      location_id: locationId,
      message: message
    });

  if (error) {
    // Check for rate limit error
    if (error.message.includes('limit reached')) {
      return { success: false, error: 'You have reached your monthly reminder limit (3 per month).' };
    }
    // Check for duplicate
    if (error.code === '23505') {
      return { success: false, error: 'You have already reminded about this location.' };
    }
    console.error('Reminder submission error:', error);
    return { success: false, error: 'Unable to submit reminder. Please try again later.' };
  }

  return { success: true };
}

/**
 * Gets current month's suggestion and reminder counts for a user
 * Returns: { suggestionsUsed: number, remindersUsed: number }
 */
export async function getUserLimits(userId) {
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

  const [suggestionRes, reminderRes] = await Promise.all([
    supabase
      .from('user_suggestion_counts')
      .select('suggestion_count')
      .eq('user_id', userId)
      .eq('year_month', currentMonth)
      .single(),
    supabase
      .from('user_reminder_counts')
      .select('reminder_count')
      .eq('user_id', userId)
      .eq('year_month', currentMonth)
      .single()
  ]);

  return {
    suggestionsUsed: suggestionRes.data?.suggestion_count || 0,
    remindersUsed: reminderRes.data?.reminder_count || 0
  };
}
