import React, { useState } from 'react';
import { MapPin, Link as LinkIcon } from 'lucide-react';
import { parseGoogleMapsUrlAsync, isValidGoogleMapsUrl } from '../utils/parseGoogleMapsUrl';
import { validateRequired, getUsernameFromEmail } from '../utils/validation';
import { submitSuggestion } from '../services/suggestionService';
import LocationPreview from './LocationPreview';

/**
 * SuggestForm - Form component for suggesting new locations.
 * Handles form state, Google Maps URL parsing, and submission to Supabase.
 *
 * @param {Object} props
 * @param {Object} props.user - Current authenticated user object
 */
function SuggestForm({ user }) {
  const [locationName, setLocationName] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [reason, setReason] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [previewData, setPreviewData] = useState(null);

  const handleGoogleMapsLinkChange = async (e) => {
    const url = e.target.value;
    setGoogleMapsLink(url);
    setFieldErrors(prev => ({ ...prev, googleMapsLink: undefined }));

    // Clear preview when URL is emptied
    if (!url) {
      setPreviewData(null);
      return;
    }

    // Validate URL format and domain using security utility
    const validation = isValidGoogleMapsUrl(url);
    if (!validation.valid) {
      // Show validation error via fieldErrors for consistent UX
      setFieldErrors(prev => ({ ...prev, googleMapsLink: validation.error }));
      setPreviewData(null);
      return;
    }

    // Check if it's a short URL that needs expansion
    const isShortUrl = url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps');

    // Set loading state immediately
    setPreviewData({
      name: null,
      lat: null,
      lng: null,
      loading: true,
      error: null,
      isShortUrl: isShortUrl,
      shortUrlFallback: false
    });

    try {
      const result = await parseGoogleMapsUrlAsync(url);

      // Update preview with result
      if (result.name || result.lat !== null) {
        setPreviewData({
          name: result.name,
          lat: result.lat,
          lng: result.lng,
          country: result.country,
          countryCode: result.countryCode,
          loading: false,
          error: null,
          isShortUrl: false,
          shortUrlFallback: false
        });

        // Auto-fill location name if extracted
        if (result.name) {
          setLocationName(result.name);
          setFieldErrors(prev => ({ ...prev, locationName: undefined }));
        }
      } else if (result.isShortUrl) {
        // Short URL couldn't be expanded - show as info, not error
        // The link is still valid and useful for admin to check
        setPreviewData({
          name: null,
          lat: null,
          lng: null,
          loading: false,
          error: null,
          isShortUrl: true,
          shortUrlFallback: true
        });
      } else {
        // URL parsed but nothing extracted
        setPreviewData({
          name: null,
          lat: null,
          lng: null,
          loading: false,
          error: "We couldn't extract location information from this URL. Try copying a different Google Maps link.",
          isShortUrl: false,
          shortUrlFallback: false
        });
      }
    } catch {
      setPreviewData({
        name: null,
        lat: null,
        lng: null,
        loading: false,
        error: "Something went wrong while parsing the URL. Please try again.",
        isShortUrl: false,
        shortUrlFallback: false
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    const nameResult = validateRequired(locationName, 'Location name');
    if (!nameResult.valid) errors.locationName = nameResult.message;

    const reasonResult = validateRequired(reason, 'Reason');
    if (!reasonResult.valid) errors.reason = reasonResult.message;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parse coordinates and country from Google Maps URL if provided
      let latitude = null;
      let longitude = null;
      let country = null;
      let countryCode = null;
      if (googleMapsLink) {
        const parsed = await parseGoogleMapsUrlAsync(googleMapsLink);
        if (parsed.lat && parsed.lng) {
          latitude = parsed.lat;
          longitude = parsed.lng;
        }
        if (parsed.country) {
          country = parsed.country;
        }
        if (parsed.countryCode) {
          countryCode = parsed.countryCode;
        }
      }

      const result = await submitSuggestion(user.id, {
        locationName,
        googleMapsUrl: googleMapsLink || null,
        latitude,
        longitude,
        reason,
        country,
        countryCode
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(true);
      setLocationName('');
      setGoogleMapsLink('');
      setReason('');
      setSubmitterName('');
      setPreviewData(null);

      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError('Unable to submit suggestion. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success && (
        <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-green-800 mb-8 text-base">
          Your suggestion has been submitted! Thank you for sharing.
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-200 rounded-lg text-red-800 mb-8 text-base">
          Error: {error}
        </div>
      )}

      <div className="bg-white p-4 md:p-10 rounded-xl shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 md:mb-8">
            <label className="flex items-center gap-2 mb-2 md:mb-3 text-sm md:text-base text-secondary font-semibold">
              <LinkIcon size={20} />
              Google Maps Link (Optional)
            </label>
            <input
              type="url"
              value={googleMapsLink}
              onChange={handleGoogleMapsLinkChange}
              placeholder="https://www.google.com/maps/..."
              className="w-full p-3 rounded-lg border border-gray-300 text-base"
            />
            <small className="block mt-2 text-gray-600 text-sm">
              Paste a Google Maps share link and we'll auto-fill the location name
            </small>
            {fieldErrors.googleMapsLink && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.googleMapsLink}</p>
            )}
            {googleMapsLink && previewData && (
              <LocationPreview
                name={previewData.name}
                lat={previewData.lat}
                lng={previewData.lng}
                country={previewData.country}
                countryCode={previewData.countryCode}
                loading={previewData.loading}
                error={previewData.error}
                isShortUrl={previewData.isShortUrl}
                shortUrlFallback={previewData.shortUrlFallback}
              />
            )}
          </div>

          <div className="mb-6 md:mb-8">
            <label className="flex items-center gap-2 mb-2 md:mb-3 text-sm md:text-base text-secondary font-semibold">
              <MapPin size={20} />
              Location Name *
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => {
                setLocationName(e.target.value);
                setFieldErrors(prev => ({ ...prev, locationName: undefined }));
              }}
              required
              placeholder="e.g., Santorini, Greece"
              className="w-full p-2.5 md:p-3 rounded-lg border border-gray-300 text-sm md:text-base"
            />
            {fieldErrors.locationName && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.locationName}</p>
            )}
          </div>

          <div className="mb-6 md:mb-8">
            <label className="block mb-2 md:mb-3 text-sm md:text-base text-secondary font-semibold">
              Why should I visit? *
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setFieldErrors(prev => ({ ...prev, reason: undefined }));
              }}
              required
              rows={4}
              placeholder="Tell me what makes this place special..."
              className="w-full p-2.5 md:p-3 rounded-lg border border-gray-300 text-sm md:text-base font-sans resize-y"
            />
            {fieldErrors.reason && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.reason}</p>
            )}
          </div>

          <div className="mb-6 md:mb-8">
            <label className="block mb-2 md:mb-3 text-sm md:text-base text-secondary font-semibold">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              placeholder={getUsernameFromEmail(user.email)}
              className="w-full p-2.5 md:p-3 rounded-lg border border-gray-300 text-sm md:text-base"
            />
            <small className="block mt-2 text-gray-600 text-xs md:text-sm">
              Leave blank to use: {getUsernameFromEmail(user.email)}
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 md:p-4 ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary cursor-pointer hover:bg-primary/90'} text-white border-none rounded-lg text-base md:text-lg font-semibold transition-colors duration-200`}
          >
            {loading ? 'Submitting...' : 'Submit Suggestion'}
          </button>
        </form>
      </div>
    </>
  );
}

export default SuggestForm;
