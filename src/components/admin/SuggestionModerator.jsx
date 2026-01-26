import React, { useState, useEffect } from 'react';
import { fetchSuggestions, updateSuggestionStatus, createLocation } from '../../services/adminService';
import { fetchCategories } from '../../services/locationService';

/**
 * SuggestionModerator - Component for viewing and moderating user suggestions
 * Displays suggestions with filtering by status and approve/reject actions
 */
function SuggestionModerator() {
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Track which suggestion is being actioned
  const [adminNotes, setAdminNotes] = useState({}); // Track notes per suggestion

  // Approval modal state
  const [approvalModal, setApprovalModal] = useState(null); // Suggestion being approved
  const [approvalForm, setApprovalForm] = useState({
    category_id: '',
    has_visited: false,
    date_visited: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [suggestionsData, categoriesData] = await Promise.all([
        fetchSuggestions(),
        fetchCategories()
      ]);
      if (suggestionsData) {
        setSuggestions(suggestionsData);
      } else {
        setError('Failed to load suggestions');
      }
      if (categoriesData) {
        setCategories(categoriesData);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }

  // Generate URL-friendly slug from name
  function generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Open approval modal instead of immediately approving
  function handleApprove(id) {
    const suggestion = suggestions.find(s => s.id === id);
    if (!suggestion) return;

    setApprovalModal(suggestion);
    setApprovalForm({
      category_id: '',
      has_visited: false,
      date_visited: ''
    });
  }

  // Close approval modal
  function closeApprovalModal() {
    setApprovalModal(null);
    setApprovalForm({ category_id: '', has_visited: false, date_visited: '' });
  }

  // Confirm approval and create location
  async function confirmApproval() {
    if (!approvalModal) return;
    if (!approvalForm.category_id) {
      alert('Please select a category');
      return;
    }

    const id = approvalModal.id;
    setActionLoading(id);
    const notes = adminNotes[id] || null;

    const result = await updateSuggestionStatus(id, 'approved', notes);
    if (result.success) {
      // Create location with category and visited status
      if (approvalModal.latitude && approvalModal.longitude) {
        const locationData = {
          name: approvalModal.location_name,
          slug: generateSlug(approvalModal.location_name),
          latitude: parseFloat(approvalModal.latitude),
          longitude: parseFloat(approvalModal.longitude),
          category_id: approvalForm.category_id,
          has_visited: approvalForm.has_visited,
          date_visited: approvalForm.has_visited && approvalForm.date_visited ? approvalForm.date_visited : null,
          short_description: approvalModal.reason || null,
          notes: `Created from approved suggestion. Google Maps: ${approvalModal.google_maps_url || 'N/A'}`
        };

        const locationResult = await createLocation(locationData);
        if (!locationResult.success) {
          console.warn('Failed to create location:', locationResult.error);
          alert(`Suggestion approved but failed to create location: ${locationResult.error}`);
        }
      }

      // Update local state
      setSuggestions(prev =>
        prev.map(s => s.id === id ? { ...s, status: 'approved', reviewed_at: new Date().toISOString(), admin_notes: notes } : s)
      );
      // Clear notes for this suggestion
      setAdminNotes(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      closeApprovalModal();
    } else {
      alert(`Failed to approve: ${result.error}`);
    }
    setActionLoading(null);
  }

  async function handleReject(id) {
    setActionLoading(id);
    const notes = adminNotes[id] || null;
    const result = await updateSuggestionStatus(id, 'rejected', notes);
    if (result.success) {
      // Update local state
      setSuggestions(prev =>
        prev.map(s => s.id === id ? { ...s, status: 'rejected', reviewed_at: new Date().toISOString(), admin_notes: notes } : s)
      );
      // Clear notes for this suggestion
      setAdminNotes(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
      alert(`Failed to reject: ${result.error}`);
    }
    setActionLoading(null);
  }

  function handleNotesChange(id, value) {
    setAdminNotes(prev => ({ ...prev, [id]: value }));
  }

  // Status colors for badges
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  // Filter suggestions based on selected filter
  const filteredSuggestions = filter === 'all'
    ? suggestions
    : suggestions.filter(s => s.status === filter);

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading suggestions...</div>
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
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded transition-colors ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && suggestions.filter(s => s.status === 'pending').length > 0 && (
              <span className="ml-2 bg-white text-primary px-2 py-0.5 rounded-full text-xs">
                {suggestions.filter(s => s.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Suggestions Count */}
      <p className="text-gray-600 text-sm mb-4">
        Showing {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? 's' : ''}
      </p>

      {/* Suggestions List */}
      {filteredSuggestions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No suggestions found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map(suggestion => (
            <div key={suggestion.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{suggestion.location_name}</h3>
                  <p className="text-gray-500 text-sm">Submitted: {formatDate(suggestion.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[suggestion.status]}`}>
                  {suggestion.status}
                </span>
              </div>

              {/* Reason */}
              {suggestion.reason && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 font-medium">Reason:</p>
                  <p className="text-gray-700 mt-1">{suggestion.reason}</p>
                </div>
              )}

              {/* Google Maps Link */}
              {suggestion.google_maps_url && (
                <div className="mb-3">
                  <a
                    href={suggestion.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                  >
                    View on Google Maps
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Coordinates */}
              {(suggestion.latitude || suggestion.longitude) && (
                <div className="mb-3 text-sm text-gray-600">
                  <span className="font-medium">Coordinates:</span> {suggestion.latitude}, {suggestion.longitude}
                </div>
              )}

              {/* User ID */}
              <div className="mb-3 text-sm text-gray-500">
                User ID: {suggestion.user_id}
              </div>

              {/* Review info for non-pending */}
              {suggestion.status !== 'pending' && suggestion.reviewed_at && (
                <div className="mb-3 text-sm text-gray-500">
                  Reviewed: {formatDate(suggestion.reviewed_at)}
                  {suggestion.admin_notes && (
                    <span className="ml-2">| Notes: {suggestion.admin_notes}</span>
                  )}
                </div>
              )}

              {/* Moderation Actions (only for pending) */}
              {suggestion.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Admin Notes Input */}
                  <div className="mb-3">
                    <label className="text-sm text-gray-600 block mb-1">Admin Notes (optional):</label>
                    <input
                      type="text"
                      value={adminNotes[suggestion.id] || ''}
                      onChange={(e) => handleNotesChange(suggestion.id, e.target.value)}
                      placeholder="Add notes about your decision..."
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      disabled={actionLoading === suggestion.id}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(suggestion.id)}
                      disabled={actionLoading === suggestion.id}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === suggestion.id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(suggestion.id)}
                      disabled={actionLoading === suggestion.id}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === suggestion.id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {approvalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Approve & Create Location</h3>

            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">{approvalModal.location_name}</p>
              {approvalModal.latitude && approvalModal.longitude ? (
                <div className="mt-1">
                  <p className="text-sm text-gray-500">
                    Coordinates: {approvalModal.latitude}, {approvalModal.longitude}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${approvalModal.latitude},${approvalModal.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Verify on Google Maps →
                  </a>
                </div>
              ) : (
                <p className="text-sm text-red-500 mt-1">
                  ⚠️ No coordinates - location won't appear on map
                </p>
              )}
              {approvalModal.google_maps_url && (
                <a
                  href={approvalModal.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:underline block mt-1"
                >
                  Original Google Maps link
                </a>
              )}
            </div>

            {/* Category Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={approvalForm.category_id}
                onChange={(e) => setApprovalForm(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Required for location to appear on map</p>
            </div>

            {/* Visited Toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={approvalForm.has_visited}
                  onChange={(e) => setApprovalForm(prev => ({
                    ...prev,
                    has_visited: e.target.checked,
                    date_visited: e.target.checked ? prev.date_visited : ''
                  }))}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Already visited</span>
              </label>

              {approvalForm.has_visited && (
                <div className="mt-2">
                  <input
                    type="date"
                    value={approvalForm.date_visited}
                    onChange={(e) => setApprovalForm(prev => ({ ...prev, date_visited: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeApprovalModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={actionLoading === approvalModal.id}
              >
                Cancel
              </button>
              <button
                onClick={confirmApproval}
                disabled={actionLoading === approvalModal.id || !approvalForm.category_id}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {actionLoading === approvalModal.id ? 'Creating...' : 'Approve & Create Location'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuggestionModerator;
