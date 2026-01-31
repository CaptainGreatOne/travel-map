import React, { useState, useEffect } from 'react';
import { Upload, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { fetchPhotos, uploadPhoto, deletePhoto, reorderPhotos } from '../../services/photoService';

/**
 * PhotoManager - Admin component for managing photos on the Photography page
 * Provides upload, reorder, and delete functionality
 */
function PhotoManager() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    async function loadPhotos() {
      setLoading(true);
      setError(null);
      const data = await fetchPhotos();
      if (data) {
        setPhotos(data);
      } else {
        setError('Failed to load photos');
      }
      setLoading(false);
    }
    loadPhotos();
  }, []);

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 7 files
    const MAX_FILES = 7;
    if (files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} photos can be uploaded at once`);
      e.target.value = '';
      return;
    }

    // Validate all files are images
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Please select only image files');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError(null);

    const uploadedPhotos = [];
    const errors = [];

    for (const file of files) {
      const result = await uploadPhoto(file);
      if (result.success) {
        uploadedPhotos.push(result.data);
      } else {
        errors.push(file.name);
      }
    }

    if (uploadedPhotos.length > 0) {
      setPhotos(prev => [...prev, ...uploadedPhotos]);
    }

    if (errors.length > 0) {
      setError(`Failed to upload: ${errors.join(', ')}`);
    }

    setUploading(false);
    // Reset file input
    e.target.value = '';
  }

  async function handleDelete(photo) {
    if (confirmDelete !== photo.id) {
      setConfirmDelete(photo.id);
      return;
    }

    const result = await deletePhoto(photo.id, photo.storage_path);

    if (result.success) {
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
    } else {
      setError(result.error || 'Failed to delete photo');
    }

    setConfirmDelete(null);
  }

  async function handleMoveUp(index) {
    if (index === 0) return;

    const result = await reorderPhotos(photos, index, index - 1);

    if (result.success) {
      const reordered = [...photos];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(index - 1, 0, moved);
      setPhotos(reordered);
    } else {
      setError(result.error || 'Failed to reorder');
    }
  }

  async function handleMoveDown(index) {
    if (index === photos.length - 1) return;

    const result = await reorderPhotos(photos, index, index + 1);

    if (result.success) {
      const reordered = [...photos];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(index + 1, 0, moved);
      setPhotos(reordered);
    } else {
      setError(result.error || 'Failed to reorder');
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading photos...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Photo Manager</h2>
        <label className={`flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Upload size={18} />
          {uploading ? 'Uploading...' : 'Upload Photos'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {photos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No photos yet. Upload your first photo above.
        </div>
      ) : (
        <div className="space-y-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* Thumbnail */}
              <img
                src={photo.url}
                alt={photo.title || 'Photo'}
                className="w-20 h-14 object-cover rounded flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {photo.title || 'Untitled'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {photo.location || 'No location'}
                </p>
              </div>

              {/* Order indicator */}
              <span className="text-sm text-gray-400 w-8 text-center">
                #{index + 1}
              </span>

              {/* Reorder buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                  title="Move up"
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === photos.length - 1}
                  className={`p-1 rounded ${index === photos.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                  title="Move down"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(photo)}
                className={`p-2 rounded transition-colors ${
                  confirmDelete === photo.id
                    ? 'bg-red-500 text-white'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
                title={confirmDelete === photo.id ? 'Click again to confirm' : 'Delete photo'}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500">
        {photos.length} photo{photos.length !== 1 ? 's' : ''} - Use arrows to reorder
      </p>
    </div>
  );
}

export default PhotoManager;
