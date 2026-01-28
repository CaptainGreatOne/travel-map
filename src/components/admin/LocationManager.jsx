import React, { useState, useEffect } from 'react';
import { fetchLocations, fetchCategories } from '../../services/locationService';
import { createLocation, updateLocation, deleteLocation } from '../../services/adminService';
import { parseGoogleMapsCoordinates, parseGoogleMapsUrl, parseGoogleMapsUrlAsync } from '../../utils/parseGoogleMapsUrl';

/**
 * LocationManager - Admin component for managing locations
 * Provides full CRUD operations for the locations table
 */
function LocationManager() {
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState(getEmptyFormData());
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // Get empty form data template
  function getEmptyFormData() {
    return {
      name: '',
      slug: '',
      google_maps_url: '',
      latitude: '',
      longitude: '',
      category_id: '',
      country: '',
      country_code: '',
      has_visited: false,
      date_visited: '',
      short_description: '',
      notes: ''
    };
  }

  // Generate slug from name
  function generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Load locations and categories on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [locationsData, categoriesData] = await Promise.all([
          fetchLocations(),
          fetchCategories()
        ]);
        setLocations(locationsData || []);
        setCategories(categoriesData || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load locations. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Refresh locations list
  async function refreshLocations() {
    const data = await fetchLocations();
    setLocations(data || []);
  }

  // Show success message briefly
  function showSuccess(message) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  }

  // Compute unique countries from locations for dropdown
  // Creates array of { code, name } objects, preferring name for display but using code for filtering
  const uniqueCountries = locations
    .filter(loc => loc.country_code != null)
    .reduce((acc, loc) => {
      if (!acc.find(c => c.code === loc.country_code)) {
        acc.push({ code: loc.country_code, name: loc.country || loc.country_code });
      }
      return acc;
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filter locations by search query and country code
  const filteredLocations = locations.filter(loc => {
    const matchesSearch = !searchQuery || loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = !countryFilter || loc.country_code === countryFilter;
    return matchesSearch && matchesCountry;
  });

  // Handle form field changes
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };

      // Auto-generate slug when name changes (only if not editing or slug is empty)
      if (name === 'name' && (!editingLocation || !prev.slug)) {
        updated.slug = generateSlug(value);
      }

      // Clear date_visited if has_visited is unchecked
      if (name === 'has_visited' && !checked) {
        updated.date_visited = '';
      }

      // Parse Google Maps URL for coordinates and name (sync, immediate feedback)
      if (name === 'google_maps_url' && value) {
        const coords = parseGoogleMapsCoordinates(value);
        if (coords) {
          updated.latitude = coords.lat.toString();
          updated.longitude = coords.lng.toString();
        }
        // Also try to extract location name if name field is empty
        const extractedName = parseGoogleMapsUrl(value);
        if (!prev.name && extractedName) {
          updated.name = extractedName;
          updated.slug = generateSlug(extractedName);
        }
      }

      return updated;
    });

    // Async: Fetch country info via reverse geocoding when Google Maps URL is pasted
    if (name === 'google_maps_url' && value) {
      parseGoogleMapsUrlAsync(value).then(result => {
        if (result.country || result.countryCode) {
          setFormData(prev => ({
            ...prev,
            country: result.country || prev.country,
            country_code: result.countryCode || prev.country_code
          }));
        }
      });
    }
  }

  // Open form for adding new location
  function handleAdd() {
    setEditingLocation(null);
    setFormData(getEmptyFormData());
    setIsFormOpen(true);
  }

  // Open form for editing existing location
  function handleEdit(location) {
    setEditingLocation(location);
    setFormData({
      name: location.name || '',
      slug: location.slug || '',
      google_maps_url: '',
      latitude: location.latitude?.toString() || '',
      longitude: location.longitude?.toString() || '',
      category_id: location.category_id || '',
      country: location.country || '',
      country_code: location.country_code || '',
      has_visited: location.has_visited || false,
      date_visited: location.date_visited || '',
      short_description: location.short_description || '',
      notes: location.notes || ''
    });
    setIsFormOpen(true);
  }

  // Close form
  function handleCancel() {
    setIsFormOpen(false);
    setEditingLocation(null);
    setFormData(getEmptyFormData());
  }

  // Handle form submission (create or update)
  async function handleSubmit(e) {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.latitude || isNaN(parseFloat(formData.latitude))) {
      setError('Valid latitude is required');
      return;
    }
    if (!formData.longitude || isNaN(parseFloat(formData.longitude))) {
      setError('Valid longitude is required');
      return;
    }
    if (!formData.category_id) {
      setError('Category is required (locations without a category won\'t appear on the map)');
      return;
    }

    setSubmitting(true);
    setError(null);

    const locationData = {
      name: formData.name.trim(),
      slug: formData.slug || generateSlug(formData.name),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      category_id: formData.category_id,
      country: formData.country || null,
      country_code: formData.country_code || null,
      has_visited: formData.has_visited,
      date_visited: formData.has_visited && formData.date_visited ? formData.date_visited : null,
      short_description: formData.short_description.trim() || null,
      notes: formData.notes.trim() || null
    };

    try {
      let result;
      if (editingLocation) {
        result = await updateLocation(editingLocation.id, locationData);
      } else {
        result = await createLocation(locationData);
      }

      if (result.success) {
        await refreshLocations();
        handleCancel();
        showSuccess(editingLocation ? 'Location updated successfully' : 'Location created successfully');
      } else {
        setError(result.error || 'Operation failed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  // Handle delete with confirmation
  async function handleDelete(id) {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await deleteLocation(id);
      if (result.success) {
        await refreshLocations();
        showSuccess('Location deleted successfully');
      } else {
        setError(result.error || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
      setDeleteConfirm(null);
    }
  }

  // Cancel delete confirmation
  function cancelDelete() {
    setDeleteConfirm(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading locations...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Add button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Manage Locations</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          + New Location
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
        />

        {/* Country Filter */}
        {uniqueCountries.length > 0 && (
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="">All Countries</option>
            {uniqueCountries.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        )}

        {/* Filter count */}
        {(searchQuery || countryFilter) && (
          <span className="text-sm text-gray-500">
            Showing {filteredLocations.length} of {locations.length} locations
          </span>
        )}
      </div>

      {/* Locations Table */}
      {locations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No locations found. Click "New Location" to add one.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Country</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Visited</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLocations.map(location => (
                <tr key={location.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{location.name}</div>
                    <div className="text-xs text-gray-400">{location.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    {location.category ? (
                      <span className="inline-flex items-center gap-1 text-sm">
                        {location.category.icon && <span>{location.category.icon}</span>}
                        {location.category.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {(location.country || location.country_code) ? (
                      <span className="text-sm text-gray-700">
                        {location.country || location.country_code}
                        {location.country && location.country_code && (
                          <span className="text-gray-400 text-xs ml-1">({location.country_code})</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {location.has_visited ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Yes
                        {location.date_visited && (
                          <span className="ml-1 text-green-600">({location.date_visited})</span>
                        )}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(location)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                    >
                      Edit
                    </button>
                    {deleteConfirm === location.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(location.id)}
                          disabled={submitting}
                          className="text-red-600 hover:text-red-800 text-sm font-medium mr-2"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDelete(location.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto mx-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingLocation ? 'Edit Location' : 'Add Location'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="auto-generated-from-name"
                />
              </div>

              {/* Google Maps URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  name="google_maps_url"
                  value={formData.google_maps_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Paste Google Maps link to auto-fill coordinates"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Paste a full Google Maps URL to auto-fill name and coordinates
                </p>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., 48.8566"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., 2.3522"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Required for location to appear on map</p>
              </div>

              {/* Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., France"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country Code
                  </label>
                  <input
                    type="text"
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., FR"
                    maxLength={2}
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Auto-filled when you paste a Google Maps URL, or enter manually
              </p>

              {/* Visited */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="has_visited"
                    checked={formData.has_visited}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Visited</span>
                </label>

                {formData.has_visited && (
                  <div className="flex-1">
                    <input
                      type="date"
                      name="date_visited"
                      value={formData.date_visited}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Brief description for display"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  placeholder="Additional notes..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingLocation ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationManager;
