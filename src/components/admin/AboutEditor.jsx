import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { fetchAboutContent, updateAboutContent } from '../../services/aboutService';

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

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      const data = await fetchAboutContent();
      if (data) {
        setContent(data);
      } else {
        setError('Failed to load content');
      }
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
      instagram_url: content.instagram_url
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
        {/* YouTube Video ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Video ID
          </label>
          <input
            type="text"
            value={content.youtube_video_id || ''}
            onChange={(e) => handleChange('youtube_video_id', e.target.value)}
            placeholder="e.g., dQw4w9WgXcQ"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
          <p className="mt-1 text-sm text-gray-500">
            The ID from the YouTube URL (e.g., youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>)
          </p>
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
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Last updated: {content.updated_at ? new Date(content.updated_at).toLocaleString() : 'Never'}
      </p>
    </div>
  );
}

export default AboutEditor;
