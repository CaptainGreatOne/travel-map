import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';

/**
 * InstagramFeed - Displays Instagram widget or feed on About page
 *
 * Props:
 * - widgetType: 'none' | 'lightwidget' | 'official'
 * - widgetCode: string (the embed HTML)
 * - username: string (for profile deep link)
 * - profileUrl: string (full Instagram URL from instagram_url)
 */
function InstagramFeed({ widgetType, widgetCode, username, profileUrl }) {
  // Don't render anything if widget type is 'none'
  if (widgetType === 'none' || !widgetType) {
    return null;
  }

  // Check if device is mobile/touch
  function isTouchDevice() {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // Handle profile link click with mobile deep link support
  function handleProfileClick(e) {
    // Only attempt deep link on mobile with username
    if (isTouchDevice() && username) {
      e.preventDefault();

      // Try Instagram app deep link
      const deepLink = `instagram://user?username=${username}`;

      // Set a timeout to fallback to web URL if app doesn't open
      const fallbackTimer = setTimeout(() => {
        window.open(profileUrl || 'https://instagram.com', '_blank', 'noopener,noreferrer');
      }, 500);

      // Try to open the app
      window.location.href = deepLink;

      // Clear timeout if we successfully navigated (page will be hidden)
      window.addEventListener('visibilitychange', function onVisibilityChange() {
        if (document.visibilityState === 'hidden') {
          clearTimeout(fallbackTimer);
        }
        window.removeEventListener('visibilitychange', onVisibilityChange);
      }, { once: true });
    }
    // Desktop: let default link behavior handle it
  }

  return (
    <div className="bg-white p-4 md:p-10 rounded-xl shadow-md mt-8 md:mt-12">
      <h2 className="m-0 mb-4 md:mb-6 text-2xl md:text-3xl text-secondary font-semibold text-center">
        Follow on Instagram
      </h2>

      {/* Widget Container */}
      {widgetCode && (
        <div
          className="mb-6"
          dangerouslySetInnerHTML={{ __html: widgetCode }}
        />
      )}

      {/* View Profile Button */}
      <div className="text-center">
        <a
          href={profileUrl || 'https://instagram.com'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleProfileClick}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white no-underline rounded-lg text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          <Instagram size={20} />
          View Profile
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}

export default InstagramFeed;
