import React, { useState, useEffect } from 'react';
import { fetchVideos, createVideo, deleteVideo, linkVideoToLocation } from '../../services/adminService';
import { fetchLocations } from '../../services/locationService';

/**
 * VideoManager - Component for managing videos and linking them to locations
 * Allows adding, deleting videos and linking them to locations
 */
function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [linkingVideo, setLinkingVideo] = useState(null); // Video being linked
  const [selectedLocation, setSelectedLocation] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); // Video ID to confirm delete
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    youtube_id: '',
    title: '',
    description: ''
  });
  const [formError, setFormError] = useState(null);
  const [fetchingTitle, setFetchingTitle] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [videosData, locationsData] = await Promise.all([
        fetchVideos(),
        fetchLocations()
      ]);

      if (videosData) {
        setVideos(videosData);
      } else {
        setError('Failed to load videos');
      }

      if (locationsData) {
        setLocations(locationsData);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  // Validate YouTube ID (11 characters, alphanumeric + dash/underscore)
  function validateYoutubeId(id) {
    const pattern = /^[a-zA-Z0-9_-]{11}$/;
    return pattern.test(id);
  }

  // Extract YouTube ID from URL or return the input if already an ID
  function extractYoutubeId(input) {
    if (!input) return '';
    const trimmed = input.trim();

    // If it's already a valid ID, return it
    if (validateYoutubeId(trimmed)) {
      return trimmed;
    }

    // Try to extract ID from various URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match && match[1] && validateYoutubeId(match[1])) {
        return match[1];
      }
    }

    // Return original input if no ID found (let validation handle it)
    return trimmed;
  }

  // Fetch video title from YouTube via noembed API
  async function fetchYoutubeTitle(youtubeId) {
    try {
      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${youtubeId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.title || null;
    } catch (err) {
      console.warn('Failed to fetch YouTube title:', err);
      return null;
    }
  }

  // Handle YouTube URL/ID input change with auto-fetch title
  async function handleYoutubeIdChange(value) {
    const extractedId = extractYoutubeId(value);
    setFormData(prev => ({ ...prev, youtube_id: extractedId }));

    // If valid YouTube ID, try to fetch the title
    if (validateYoutubeId(extractedId)) {
      setFetchingTitle(true);
      const title = await fetchYoutubeTitle(extractedId);
      if (title) {
        setFormData(prev => ({ ...prev, title: prev.title || title }));
      }
      setFetchingTitle(false);
    }
  }

  async function handleAddVideo(e) {
    e.preventDefault();
    setFormError(null);

    // Validate
    if (!formData.youtube_id.trim()) {
      setFormError('YouTube ID is required');
      return;
    }
    if (!validateYoutubeId(formData.youtube_id.trim())) {
      setFormError('Invalid YouTube ID format (must be 11 characters)');
      return;
    }
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }

    setActionLoading(true);
    const thumbnail_url = `https://img.youtube.com/vi/${formData.youtube_id.trim()}/mqdefault.jpg`;

    const result = await createVideo({
      youtube_id: formData.youtube_id.trim(),
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      thumbnail_url
    });

    if (result.success) {
      // Add to local state with empty location_videos
      setVideos(prev => [{ ...result.data, location_videos: [] }, ...prev]);
      setFormData({ youtube_id: '', title: '', description: '' });
      setIsFormOpen(false);
    } else {
      setFormError(result.error || 'Failed to add video');
    }
    setActionLoading(false);
  }

  async function handleDelete(id) {
    if (confirmDelete !== id) {
      // First click - ask for confirmation
      setConfirmDelete(id);
      return;
    }

    // Second click - actually delete
    setActionLoading(true);
    const result = await deleteVideo(id);
    if (result.success) {
      setVideos(prev => prev.filter(v => v.id !== id));
    } else {
      alert(`Failed to delete: ${result.error}`);
    }
    setConfirmDelete(null);
    setActionLoading(false);
  }

  async function handleLinkToLocation() {
    if (!linkingVideo || !selectedLocation) return;

    setActionLoading(true);
    const result = await linkVideoToLocation(selectedLocation, linkingVideo.id);
    if (result.success) {
      // Update local state to reflect the link
      setVideos(prev =>
        prev.map(v =>
          v.id === linkingVideo.id
            ? { ...v, location_videos: [...(v.location_videos || []), { location_id: selectedLocation }] }
            : v
        )
      );
      setLinkingVideo(null);
      setSelectedLocation('');
    } else {
      alert(`Failed to link: ${result.error}`);
    }
    setActionLoading(false);
  }

  // Get location names for linked locations
  function getLinkedLocationNames(video) {
    if (!video.location_videos || video.location_videos.length === 0) return [];
    return video.location_videos
      .map(lv => {
        const loc = locations.find(l => l.id === lv.location_id);
        return loc ? loc.name : 'Unknown';
      })
      .filter(Boolean);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadData}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {videos.length} Video{videos.length !== 1 ? 's' : ''}
        </h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
        >
          Add Video
        </button>
      </div>

      {/* Add Video Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Add New Video</h3>
            <form onSubmit={handleAddVideo}>
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                  {formError}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube URL or ID *
                </label>
                <input
                  type="text"
                  value={formData.youtube_id}
                  onChange={(e) => handleYoutubeIdChange(e.target.value)}
                  placeholder="Paste YouTube URL or video ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste a full YouTube URL or just the 11-character ID (title auto-fills)
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                  {fetchingTitle && <span className="ml-2 text-xs text-gray-400">(fetching...)</span>}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={fetchingTitle ? 'Fetching title...' : 'Video title'}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              {/* Thumbnail Preview */}
              {formData.youtube_id && validateYoutubeId(formData.youtube_id) && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Preview
                  </label>
                  <img
                    src={`https://img.youtube.com/vi/${formData.youtube_id}/mqdefault.jpg`}
                    alt="Thumbnail preview"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormData({ youtube_id: '', title: '', description: '' });
                    setFormError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Adding...' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link to Location Modal */}
      {linkingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Link Video to Location</h3>
            <p className="text-gray-600 mb-4">
              Linking: <span className="font-medium">{linkingVideo.title}</span>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Choose a location...</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setLinkingVideo(null);
                  setSelectedLocation('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleLinkToLocation}
                disabled={!selectedLocation || actionLoading}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Linking...' : 'Link Video'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No videos yet. Click "Add Video" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(video => (
            <div key={video.id} className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                alt={video.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate" title={video.title}>
                  {video.title}
                </h3>
                <p className="text-gray-500 text-sm">ID: {video.youtube_id}</p>

                {/* Linked Locations */}
                {getLinkedLocationNames(video).length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Linked to:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getLinkedLocationNames(video).map((name, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setLinkingVideo(video)}
                    className="text-primary text-sm hover:underline"
                  >
                    Link to Location
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className={`text-sm ${confirmDelete === video.id ? 'text-white bg-red-500 px-2 py-1 rounded' : 'text-red-500 hover:underline'}`}
                    disabled={actionLoading}
                  >
                    {confirmDelete === video.id ? 'Confirm Delete' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoManager;
