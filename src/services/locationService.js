import { supabase } from '../utils/supabaseClient';

/**
 * Fetches all locations with their category info
 * Returns: Array of location objects
 * Falls back to sampleData if DB query fails (for development)
 */
export async function fetchLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      category:categories(*)
    `)
    .order('name');

  if (error) {
    console.warn('Failed to fetch locations from DB, using sample data:', error.message);
    return null; // Caller should fall back to sampleData
  }

  return data;
}

/**
 * Fetches all categories
 * Returns: Array of category objects
 */
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.warn('Failed to fetch categories from DB:', error.message);
    return null;
  }

  return data;
}

/**
 * Fetches a single location with its linked videos
 * Returns: Location object with videos array
 */
export async function fetchLocationWithVideos(locationId) {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      category:categories(*),
      videos:location_videos(
        display_order,
        video:videos(*)
      )
    `)
    .eq('id', locationId)
    .single();

  if (error) {
    console.error('Failed to fetch location:', error.message);
    return null;
  }

  // Flatten the videos array and sort by display_order
  if (data?.videos) {
    data.videos = data.videos
      .sort((a, b) => a.display_order - b.display_order)
      .map(lv => lv.video);
  }

  return data;
}
