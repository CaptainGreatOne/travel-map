import { supabase } from '../utils/supabaseClient';

/**
 * Fetches all locations with their category info and linked videos
 * Returns: Array of location objects with videos array
 * Falls back to null if DB query fails
 */
export async function fetchLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      category:categories(*),
      videos:location_videos(
        display_order,
        video:videos(id, youtube_id, title, thumbnail_url)
      )
    `)
    .order('name');

  if (error) {
    console.warn('Failed to fetch locations from DB:', error.message);
    return null;
  }

  // Flatten videos array for each location
  return data.map(location => ({
    ...location,
    videos: location.videos
      ? location.videos
          .sort((a, b) => a.display_order - b.display_order)
          .map(lv => lv.video)
      : []
  }));
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

/**
 * Fetches total count of all locations
 * @returns {Promise<number|null>} Location count or null on error
 */
export async function fetchLocationCount() {
  const { count, error } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.warn('Failed to fetch location count:', error.message);
    return null;
  }

  return count;
}

/**
 * Fetches count of unique countries from locations
 * @returns {Promise<number|null>} Country count or null on error
 */
export async function fetchCountryCount() {
  const { data, error } = await supabase
    .from('locations')
    .select('country')
    .not('country', 'is', null)
    .neq('country', '');

  if (error) {
    console.warn('Failed to fetch country count:', error.message);
    return null;
  }

  // Count unique non-empty countries
  const uniqueCountries = new Set(data.map(loc => loc.country).filter(Boolean));
  return uniqueCountries.size;
}
