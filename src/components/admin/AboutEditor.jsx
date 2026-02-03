import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { fetchAboutContent, updateAboutContent } from '../../services/aboutService';
import { fetchLocationCount, fetchCountryCount } from '../../services/locationService';

/**
 * Extract YouTube video ID from various URL formats or return as-is if already an ID
 * Supports:
 * - youtube.com/watch?v=ID
 * - youtu.be/ID
 * - youtube.com/embed/ID
 * - Just the ID (11 character alphanumeric string)
 */
function extractYouTubeVideoId(input) {
  if (!input) return '';

  const trimmed = input.trim();

  // If it looks like a URL, try to extract the video ID
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    try {
      const url = new URL(trimmed);

      // Handle youtube.com/watch?v=ID
      if (url.hostname.includes('youtube.com') && url.pathname === '/watch') {
        const videoId = url.searchParams.get('v');
        if (videoId) return videoId;
      }

      // Handle youtube.com/embed/ID
      if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/embed/')) {
        const videoId = url.pathname.replace('/embed/', '').split('/')[0];
        if (videoId) return videoId;
      }

      // Handle youtu.be/ID
      if (url.hostname === 'youtu.be') {
        const videoId = url.pathname.slice(1).split('/')[0];
        if (videoId) return videoId;
      }
    } catch {
      // URL parsing failed, return as-is
      return trimmed;
    }
  }

  // Not a URL or extraction failed, return as-is (assume it's already an ID)
  return trimmed;
}

/**
 * AboutEditor - Admin component for editing About page content
 * Provides form for editing bio, video, and social links
 */
function AboutEditor() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dbCounts, setDbCounts] = useState({ locations: null, countries: null });
  const [youtubeInput, setYoutubeInput] = useState('');
  const [extractedVideoId, setExtractedVideoId] = useState('');

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      const [data, locationCount, countryCount] = await Promise.all([
        fetchAboutContent(),
        fetchLocationCount(),
        fetchCountryCount()
      ]);
      if (data) {
        setContent(data);
        // Initialize youtube input with the stored video ID
        setYoutubeInput(data.youtube_video_id || '');
        setExtractedVideoId(data.youtube_video_id || '');
      } else {
        setError('Failed to load content');
      }
      setDbCounts({ locations: locationCount, countries: countryCount });
      setLoading(false);
    }
    loadContent();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await updateAboutContent({
      youtube_video_id: content.youtube_video_id,
      bio_paragraph_1: content.bio_paragraph_1,
      bio_paragraph_2: content.bio_paragraph_2,
      bio_paragraph_3: content.bio_paragraph_3,
      youtube_url: content.youtube_url,
      instagram_url: content.instagram_url,
      location_count: content.location_count,
      video_count: content.video_count,
      country_count: content.country_count,
      subscriber_count: content.subscriber_count,
      instagram_widget_type: content.instagram_widget_type,
      instagram_widget_code: content.instagram_widget_code,
      instagram_username: content.instagram_username
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Failed to save');
    }

    setSaving(false);
  }

  function handleChange(field, value) {
    setContent(prev => ({ ...prev, [field]: value }));
  }

  function handleYoutubeInputChange(value) {
    setYoutubeInput(value);
    const extracted = extractYouTubeVideoId(value);
    setExtractedVideoId(extracted);
    // Store the extracted ID, not the full URL
    setContent(prev => ({ ...prev, youtube_video_id: extracted }));
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading content...</div>;
  }

  if (!content) {
    return <div className="text-center py-8 text-red-500">{error || 'Failed to load'}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">About Page Editor</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Changes saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* YouTube Video URL or ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Video URL or ID
          </label>
          <input
            type="text"
            value={youtubeInput}
            onChange={(e) => handleYoutubeInputChange(e.target.value)}
            placeholder="e.g., https://youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
          <p className="mt-1 text-sm text-gray-500">
            Paste a full YouTube URL or just the video ID. Supported formats: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, or just the ID.
          </p>
          {youtubeInput && youtubeInput !== extractedVideoId && extractedVideoId && (
            <p className="mt-1 text-sm text-green-600">
              Extracted video ID: <strong>{extractedVideoId}</strong>
            </p>
          )}
        </div>

        {/* Bio Paragraphs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio - Paragraph 1
          </label>
          <textarea
            value={content.bio_paragraph_1 || ''}
            onChange={(e) => handleChange('bio_paragraph_1', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio - Paragraph 2
          </label>
          <textarea
            value={content.bio_paragraph_2 || ''}
            onChange={(e) => handleChange('bio_paragraph_2', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio - Paragraph 3
          </label>
          <textarea
            value={content.bio_paragraph_3 || ''}
            onChange={(e) => handleChange('bio_paragraph_3', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-y"
          />
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Channel URL
            </label>
            <input
              type="url"
              value={content.youtube_url || ''}
              onChange={(e) => handleChange('youtube_url', e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              value={content.instagram_url || ''}
              onChange={(e) => handleChange('instagram_url', e.target.value)}
              placeholder="https://instagram.com/yourhandle"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Instagram Feed */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Instagram Feed</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Widget Type
              </label>
              <select
                value={content.instagram_widget_type || 'none'}
                onChange={(e) => handleChange('instagram_widget_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="none">None (link only)</option>
                <option value="lightwidget">LightWidget (third-party)</option>
                <option value="official">Official Embed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Username
              </label>
              <input
                type="text"
                value={content.instagram_username || ''}
                onChange={(e) => handleChange('instagram_username', e.target.value)}
                placeholder="username (without @)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <p className="mt-1 text-sm text-gray-500">
                Used for mobile app deep links
              </p>
            </div>

            {content.instagram_widget_type && content.instagram_widget_type !== 'none' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Widget Embed Code
                </label>
                <textarea
                  value={content.instagram_widget_code || ''}
                  onChange={(e) => handleChange('instagram_widget_code', e.target.value)}
                  rows={5}
                  placeholder={
                    content.instagram_widget_type === 'lightwidget'
                      ? 'Paste your LightWidget embed code from lightwidget.com'
                      : 'Paste Instagram embed code'
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-y font-mono text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {content.instagram_widget_type === 'lightwidget'
                    ? 'Paste your LightWidget embed code from lightwidget.com'
                    : 'Paste Instagram embed code'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Count
              </label>
              <input
                type="number"
                min="0"
                value={content.location_count ?? ''}
                onChange={(e) => handleChange('location_count', e.target.value ? parseInt(e.target.value, 10) : null)}
                placeholder="Enter count or leave blank for dynamic"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
              {dbCounts.locations !== null && (
                <p className="mt-1 text-sm text-gray-500">
                  DB shows: {dbCounts.locations} locations
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Count
              </label>
              <input
                type="number"
                min="0"
                value={content.country_count ?? ''}
                onChange={(e) => handleChange('country_count', e.target.value ? parseInt(e.target.value, 10) : null)}
                placeholder="Enter count or leave blank for dynamic"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
              {dbCounts.countries !== null && (
                <p className="mt-1 text-sm text-gray-500">
                  DB shows: {dbCounts.countries} countries
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Count
              </label>
              <input
                type="number"
                min="0"
                value={content.video_count ?? ''}
                onChange={(e) => handleChange('video_count', e.target.value ? parseInt(e.target.value, 10) : null)}
                placeholder="Enter count"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscriber Count
              </label>
              <input
                type="number"
                min="0"
                value={content.subscriber_count ?? ''}
                onChange={(e) => handleChange('subscriber_count', e.target.value ? parseInt(e.target.value, 10) : null)}
                placeholder="YouTube subscribers"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          {content.stats_updated_at && (
            <p className="mt-3 text-sm text-gray-500">
              Stats last updated: {new Date(content.stats_updated_at).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Last updated: {content.updated_at ? new Date(content.updated_at).toLocaleString() : 'Never'}
      </p>
    </div>
  );
}

export default AboutEditor;
