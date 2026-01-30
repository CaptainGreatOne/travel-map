import React, { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import LocationSuggestionForm from './LocationSuggestionForm';

/**
 * MarkerPopup component - renders the content inside map marker popups.
 *
 * @param {Object} props
 * @param {Object} props.location - The location object
 * @param {Object} props.categoryInfo - Category data for this location
 * @param {Array} props.videos - Array of video objects linked to this location
 * @param {boolean} props.isShowingForm - Whether the suggestion form is visible
 * @param {boolean} props.isSuccess - Whether a suggestion was just submitted successfully
 * @param {Object|null} props.user - Auth user object (null if not logged in)
 * @param {Function} props.onShowForm - Callback when "Remind Me" clicked
 * @param {Function} props.onCancelForm - Callback when form cancelled
 * @param {Function} props.onSuccess - Callback when suggestion submitted
 * @param {Function} props.onShare - Callback when share button clicked
 */
function MarkerPopup({
  location,
  categoryInfo,
  videos = [],
  isShowingForm,
  isSuccess,
  user,
  onShowForm,
  onCancelForm,
  onSuccess,
  onShare
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (onShare) {
      onShare();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-w-[220px] font-sans">
      {/* Header with location name and share button */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="m-0 text-lg text-secondary font-semibold">
          {location.name}
        </h3>
        <button
          onClick={handleShare}
          className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded transition-colors"
          title={copied ? "Copied!" : "Copy link to location"}
          aria-label="Share location"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} />}
        </button>
      </div>

      {/* Status badge */}
      <span className={`inline-block px-2.5 py-1 ${location.has_visited ? 'bg-green-400' : 'bg-blue-400'} text-white rounded text-xs font-medium mb-2`}>
        {location.has_visited ? '✓ Visited' : '⭐ Want to Visit'}
        {location.date_visited && `: ${location.date_visited}`}
      </span>

      {/* Success message */}
      {isSuccess && (
        <div className="p-3 bg-green-100 border border-green-200 rounded-md text-green-800 text-sm mt-3 animate-pulse">
          ✓ Thanks for your suggestion!
        </div>
      )}

      {/* Show suggestion form OR location details */}
      {isShowingForm ? (
        <div className="mt-3">
          <LocationSuggestionForm
            location={location}
            onCancel={onCancelForm}
            onSuccess={onSuccess}
          />
        </div>
      ) : !isSuccess ? (
        <>
          {/* Category badge */}
          {categoryInfo && (
            <div className="flex items-center gap-2 my-3 p-2 bg-gray-50 rounded-md transition-opacity duration-300">
              <span className="text-xl">{categoryInfo.icon}</span>
              <span className="text-sm text-gray-600 font-medium">
                {categoryInfo.name}
              </span>
            </div>
          )}

          {/* Description */}
          {location.short_description && (
            <p className="my-3 text-sm text-gray-600 leading-relaxed transition-opacity duration-300">
              {location.short_description}
            </p>
          )}

          {/* Videos section for visited locations */}
          {location.has_visited && videos.length > 0 && (
            <div className="my-3 p-2 bg-gray-50 rounded-md">
              <h4 className="m-0 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {videos.length === 1 ? 'Watch the Video' : 'Watch the Videos'}
              </h4>
              <div className="flex flex-col gap-2">
                {videos.map(video => (
                  <a
                    key={video.id}
                    href={`https://youtube.com/watch?v=${video.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-1 rounded hover:bg-gray-100 transition-colors no-underline"
                  >
                    <img
                      src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/default.jpg`}
                      alt={video.title}
                      className="w-16 h-12 object-cover rounded flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 line-clamp-2 leading-tight">
                      {video.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action for unvisited locations */}
          {!location.has_visited && (
            <>
              {/* Show button if user is logged in, otherwise show message */}
              {user ? (
                <button
                  onClick={onShowForm}
                  className="w-full p-2.5 mt-2 bg-primary text-white border-none rounded-md text-sm font-semibold cursor-pointer hover:bg-primary/90 transition-colors duration-200"
                >
                  💬 Remind Me to Visit
                </button>
              ) : (
                <p className="my-4 text-sm text-gray-600 italic text-center p-3 bg-gray-50 rounded-md transition-opacity duration-300">
                  I will visit, I promise.
                </p>
              )}
            </>
          )}
        </>
      ) : null}
    </div>
  );
}

export default MarkerPopup;
