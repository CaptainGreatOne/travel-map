import React from 'react';
import LocationSuggestionForm from './LocationSuggestionForm';

/**
 * MarkerPopup component - renders the content inside map marker popups.
 *
 * @param {Object} props
 * @param {Object} props.location - The location object
 * @param {Object} props.categoryInfo - Category data for this location
 * @param {boolean} props.isShowingForm - Whether the suggestion form is visible
 * @param {boolean} props.isSuccess - Whether a suggestion was just submitted successfully
 * @param {Object|null} props.user - Auth user object (null if not logged in)
 * @param {Function} props.onShowForm - Callback when "Remind Me" clicked
 * @param {Function} props.onCancelForm - Callback when form cancelled
 * @param {Function} props.onSuccess - Callback when suggestion submitted
 */
function MarkerPopup({
  location,
  categoryInfo,
  isShowingForm,
  isSuccess,
  user,
  onShowForm,
  onCancelForm,
  onSuccess
}) {
  return (
    <div className="min-w-[220px] font-sans">
      {/* Location name */}
      <h3 className="m-0 mb-2 text-lg text-secondary font-semibold">
        {location.name}
      </h3>

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
