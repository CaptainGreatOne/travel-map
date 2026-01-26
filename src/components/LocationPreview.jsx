import React from 'react';
import { CheckCircle, AlertTriangle, MapPin, Loader2 } from 'lucide-react';

/**
 * LocationPreview - Shows parsed location data from Google Maps URL.
 * Provides instant visual feedback as users paste URLs into SuggestForm.
 *
 * @param {Object} props
 * @param {string|null} props.name - Extracted location name
 * @param {number|null} props.lat - Latitude
 * @param {number|null} props.lng - Longitude
 * @param {string|null} props.countryCode - ISO country code (e.g., 'US', 'JP')
 * @param {boolean} props.loading - Whether URL is being parsed
 * @param {string|null} props.error - Error message to display
 * @param {boolean} props.isShortUrl - Whether URL is a short URL being expanded
 * @param {boolean} props.shortUrlFallback - Whether short URL couldn't be expanded (not an error)
 */
function LocationPreview({ name, lat, lng, countryCode, loading, error, isShortUrl, shortUrlFallback }) {
  // Loading state - parsing URL
  if (loading && !isShortUrl) {
    return (
      <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 text-gray-600 text-sm transition-all duration-200">
        <Loader2 size={16} className="animate-spin" />
        <span>Parsing URL...</span>
      </div>
    );
  }

  // Short URL expanding state
  if (loading && isShortUrl) {
    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-700 text-sm transition-all duration-200">
        <Loader2 size={16} className="animate-spin" />
        <span>Expanding short URL...</span>
      </div>
    );
  }

  // Short URL fallback - couldn't expand but link is still valid
  if (shortUrlFallback) {
    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm transition-all duration-200">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>Short link detected</span>
        </div>
        <div className="mt-1 ml-6 text-blue-600 text-xs">
          Enter the location name below to submit your suggestion
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm transition-all duration-200">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Success with name + coords - full success
  if (name && lat !== null && lng !== null) {
    return (
      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm transition-all duration-200">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} />
          <span className="font-medium">{name}</span>
          {countryCode && (
            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
              {countryCode}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 ml-6 text-green-600 text-xs">
          <MapPin size={12} />
          <span>{lat.toFixed(4)}, {lng.toFixed(4)}</span>
        </div>
      </div>
    );
  }

  // Success with name only - partial success
  if (name && (lat === null || lng === null)) {
    return (
      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm transition-all duration-200">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} />
          <span className="font-medium">{name}</span>
          {countryCode && (
            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
              {countryCode}
            </span>
          )}
        </div>
        <div className="mt-1 ml-6 text-green-600 text-xs">
          Coordinates not found in URL
        </div>
      </div>
    );
  }

  // Success with coords only - hint to enter name
  if (!name && lat !== null && lng !== null) {
    return (
      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm transition-all duration-200">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>Coordinates found: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
        </div>
        <div className="mt-1 ml-6 text-amber-600 text-xs">
          Tip: Enter a location name manually below
        </div>
      </div>
    );
  }

  // No preview to show
  return null;
}

export default LocationPreview;
