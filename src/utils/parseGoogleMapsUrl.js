/**
 * Country name to ISO code mapping for common countries.
 * Used to convert extracted country names to 2-character codes.
 */
const COUNTRY_CODE_MAP = {
  // Common full names
  'United States': 'US',
  'United States of America': 'US',
  'USA': 'US',
  'United Kingdom': 'GB',
  'UK': 'GB',
  'Great Britain': 'GB',
  'Japan': 'JP',
  'France': 'FR',
  'Germany': 'DE',
  'Italy': 'IT',
  'Spain': 'ES',
  'Portugal': 'PT',
  'Netherlands': 'NL',
  'Belgium': 'BE',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Australia': 'AU',
  'New Zealand': 'NZ',
  'Canada': 'CA',
  'Mexico': 'MX',
  'Brazil': 'BR',
  'Argentina': 'AR',
  'Chile': 'CL',
  'China': 'CN',
  'South Korea': 'KR',
  'Korea': 'KR',
  'Taiwan': 'TW',
  'Thailand': 'TH',
  'Vietnam': 'VN',
  'Indonesia': 'ID',
  'Malaysia': 'MY',
  'Singapore': 'SG',
  'Philippines': 'PH',
  'India': 'IN',
  'Russia': 'RU',
  'Turkey': 'TR',
  'Greece': 'GR',
  'Egypt': 'EG',
  'South Africa': 'ZA',
  'Morocco': 'MA',
  'Kenya': 'KE',
  'Ireland': 'IE',
  'Scotland': 'GB',
  'Wales': 'GB',
  'England': 'GB',
  'Poland': 'PL',
  'Czech Republic': 'CZ',
  'Czechia': 'CZ',
  'Hungary': 'HU',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Iceland': 'IS',
  'Croatia': 'HR',
  'Slovenia': 'SI',
  'Slovakia': 'SK',
  'Romania': 'RO',
  'Bulgaria': 'BG',
  'Serbia': 'RS',
  'Ukraine': 'UA',
  'Israel': 'IL',
  'United Arab Emirates': 'AE',
  'UAE': 'AE',
  'Saudi Arabia': 'SA',
  'Qatar': 'QA',
  'Peru': 'PE',
  'Colombia': 'CO',
  'Ecuador': 'EC',
  'Cuba': 'CU',
  'Jamaica': 'JM',
  'Costa Rica': 'CR',
  'Panama': 'PA',
  'Puerto Rico': 'PR',
  'Hawaii': 'US',
  'Alaska': 'US',
};

/**
 * Extracts country from a Google Maps place name.
 * Place names often follow patterns like:
 * - "Location, City, Country"
 * - "Location, Country"
 * - "Location, City, State, Country"
 *
 * @param {string} placeName - The place name extracted from URL
 * @returns {{country: string, countryCode: string|null}|null} - Country info or null
 */
export function parseGoogleMapsCountry(placeName) {
  if (!placeName || typeof placeName !== 'string') {
    return null;
  }

  // Split by comma and get the last segment (typically the country)
  const segments = placeName.split(',').map(s => s.trim());

  if (segments.length < 2) {
    // No comma-separated segments, unlikely to have country info
    return null;
  }

  // Get the last segment as potential country
  const lastSegment = segments[segments.length - 1];

  // Check if it looks like a country (not a number, not too short)
  if (!lastSegment || lastSegment.length < 2 || /^\d+$/.test(lastSegment)) {
    return null;
  }

  // Try to find a matching country code
  const countryCode = COUNTRY_CODE_MAP[lastSegment] || null;

  return {
    country: lastSegment,
    countryCode
  };
}

/**
 * Extracts location name from a full Google Maps URL.
 * Matches multiple patterns in URLs:
 * - /place/[location]/ pattern: https://www.google.com/maps/place/Location+Name/...
 * - /search/[term] pattern: https://www.google.com/maps/search/Eiffel+Tower
 *
 * @param {string} url - The Google Maps URL
 * @returns {string|null} - Extracted location name or null if not found
 */
export function parseGoogleMapsUrl(url) {
  try {
    // Pattern 1: /place/[location]/ format
    const placeMatch = url.match(/place\/([^/]+)/);
    if (placeMatch) {
      // Decode URI component and replace + with spaces
      const decoded = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return decoded;
    }

    // Pattern 2: /search/[term] format - may have @ coordinates after
    const searchMatch = url.match(/search\/([^/@]+)/);
    if (searchMatch) {
      // Decode URI component and replace + with spaces
      const decoded = decodeURIComponent(searchMatch[1].replace(/\+/g, ' '));
      return decoded;
    }

    return null;
  } catch {
    // Return null on any parsing error
    return null;
  }
}

/**
 * Extracts latitude and longitude from a Google Maps URL.
 * Handles multiple URL formats:
 * - https://www.google.com/maps/place/Location+Name/@40.7128,-74.0060,15z (@ is map VIEW, not place!)
 * - https://www.google.com/maps/...!3d40.7128!4d-74.0060 (actual place coordinates)
 * - https://www.google.com/maps/...!8m2!3d40.7128!4d-74.0060 (place marker coordinates)
 * - https://maps.google.com/?ll=40.7128,-74.0060
 *
 * IMPORTANT: The @ coordinates are the MAP VIEW CENTER, not the place location!
 * The !3d and !4d values (especially after !8m2) are the actual place coordinates.
 * When multiple places appear in URL, we use the LAST one (main destination).
 *
 * @param {string} url - The Google Maps URL
 * @returns {{lat: number, lng: number}|null} - Coordinates or null if not found
 */
export function parseGoogleMapsCoordinates(url) {
  try {
    let lat, lng;

    // Pattern 1 (HIGHEST PRIORITY): !8m2!3d...!4d format - this is the place marker
    // Use matchAll to get ALL matches, then take the LAST one (main destination)
    // Example: !8m2!3d50.6949825!4d-2.243119
    const placeMarkerMatches = [...url.matchAll(/!8m2!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/g)];
    if (placeMarkerMatches.length > 0) {
      const lastMatch = placeMarkerMatches[placeMarkerMatches.length - 1];
      lat = parseFloat(lastMatch[1]);
      lng = parseFloat(lastMatch[2]);
    }

    // Pattern 2: General !3d and !4d format (embedded coordinates) - also get last match
    if (!lat || !lng) {
      const embeddedMatches = [...url.matchAll(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/g)];
      if (embeddedMatches.length > 0) {
        const lastMatch = embeddedMatches[embeddedMatches.length - 1];
        lat = parseFloat(lastMatch[1]);
        lng = parseFloat(lastMatch[2]);
      }
    }

    // Pattern 3: ll= query parameter
    if (!lat || !lng) {
      const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (llMatch) {
        lat = parseFloat(llMatch[1]);
        lng = parseFloat(llMatch[2]);
      }
    }

    // Pattern 4: q= query parameter with coordinates
    if (!lat || !lng) {
      const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qMatch) {
        lat = parseFloat(qMatch[1]);
        lng = parseFloat(qMatch[2]);
      }
    }

    // Pattern 5 (LOWEST PRIORITY): @lat,lng format - this is the MAP VIEW, not place!
    // Only use this as a last resort when no place coordinates are found
    if (!lat || !lng) {
      const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        lat = parseFloat(atMatch[1]);
        lng = parseFloat(atMatch[2]);
      }
    }

    // Validate coordinates are in valid ranges
    if (lat && lng && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Checks if a URL is a short Google Maps URL that needs expansion.
 *
 * @param {string} url - The URL to check
 * @returns {boolean} - True if URL is a short maps.app.goo.gl link
 */
export function isShortGoogleMapsUrl(url) {
  return url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps');
}

/**
 * Gets the Edge Function URL for expanding short URLs.
 * @returns {string} The Edge Function URL
 */
function getExpandUrlEndpoint() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    return null;
  }
  return `${supabaseUrl}/functions/v1/expand-url`;
}

/**
 * Attempts to expand a short Google Maps URL using the Edge Function.
 * @param {string} shortUrl - The short URL to expand
 * @returns {Promise<string|null>} The expanded URL or null if expansion failed
 */
async function tryExpandShortUrl(shortUrl) {
  const endpoint = getExpandUrlEndpoint();
  if (!endpoint) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: shortUrl }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.expandedUrl || null;
  } catch {
    clearTimeout(timeoutId);
    // Network error, timeout, or Edge Function unavailable
    return null;
  }
}

/**
 * Result object from parseGoogleMapsUrlAsync.
 * @typedef {Object} ParseResult
 * @property {string|null} name - Extracted location name or null
 * @property {number|null} lat - Latitude or null
 * @property {number|null} lng - Longitude or null
 * @property {string|null} country - Extracted country name or null
 * @property {string|null} countryCode - ISO country code (e.g., 'US', 'JP') or null
 * @property {boolean} isShortUrl - Whether the URL is a short URL that can't be auto-parsed
 * @property {boolean} expanded - Whether the URL was expanded from a short URL
 */

/**
 * Parse any Google Maps URL format.
 * For full URLs, extracts the location name and coordinates.
 * For short URLs, attempts to expand via Edge Function, then parses.
 * Falls back to isShortUrl flag if expansion fails.
 *
 * @param {string} url - The Google Maps URL (short or full)
 * @returns {Promise<ParseResult>} - Result with name, coordinates, expanded flag, and/or short URL indicator
 */
export async function parseGoogleMapsUrlAsync(url) {
  try {
    // First try to parse directly (works for full URLs)
    const name = parseGoogleMapsUrl(url);
    const coords = parseGoogleMapsCoordinates(url);

    if (name || coords) {
      const countryInfo = name ? parseGoogleMapsCountry(name) : null;
      return {
        name,
        lat: coords?.lat || null,
        lng: coords?.lng || null,
        country: countryInfo?.country || null,
        countryCode: countryInfo?.countryCode || null,
        isShortUrl: false,
        expanded: false
      };
    }

    // If it's a short URL, try to expand it via Edge Function
    if (isShortGoogleMapsUrl(url)) {
      const expandedUrl = await tryExpandShortUrl(url);

      if (expandedUrl) {
        // Successfully expanded - parse the expanded URL
        const expandedName = parseGoogleMapsUrl(expandedUrl);
        const expandedCoords = parseGoogleMapsCoordinates(expandedUrl);
        const expandedCountryInfo = expandedName ? parseGoogleMapsCountry(expandedName) : null;

        return {
          name: expandedName,
          lat: expandedCoords?.lat || null,
          lng: expandedCoords?.lng || null,
          country: expandedCountryInfo?.country || null,
          countryCode: expandedCountryInfo?.countryCode || null,
          isShortUrl: false,
          expanded: true
        };
      }

      // Edge Function unavailable or failed - fall back to hint
      return { name: null, lat: null, lng: null, country: null, countryCode: null, isShortUrl: true, expanded: false };
    }

    return { name: null, lat: null, lng: null, country: null, countryCode: null, isShortUrl: false, expanded: false };
  } catch {
    return { name: null, lat: null, lng: null, country: null, countryCode: null, isShortUrl: false, expanded: false };
  }
}
