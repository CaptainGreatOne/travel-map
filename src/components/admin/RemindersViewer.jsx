import React, { useState, useEffect } from 'react';
import { fetchReminders, deleteReminder } from '../../services/adminService';

/**
 * RemindersViewer - Component for viewing user reminders
 * Shows which locations users want the creator to visit
 */
function RemindersViewer() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  async function loadReminders() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReminders();
      if (data) {
        setReminders(data);
      } else {
        setError('Failed to load reminders');
      }
    } catch (err) {
      console.error('Error loading reminders:', err);
      setError('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    setActionLoading(true);
    const result = await deleteReminder(id);
    if (result.success) {
      setReminders(prev => prev.filter(r => r.id !== id));
    } else {
      alert(`Failed to delete: ${result.error}`);
    }
    setDeleteConfirm(null);
    setActionLoading(false);
  }

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

  // Group reminders by location
  const remindersByLocation = reminders.reduce((acc, reminder) => {
    const locationId = reminder.location?.id || 'unknown';
    if (!acc[locationId]) {
      acc[locationId] = {
        location: reminder.location,
        reminders: []
      };
    }
    acc[locationId].reminders.push(reminder);
    return acc;
  }, {});

  const groupedReminders = Object.values(remindersByLocation).sort(
    (a, b) => b.reminders.length - a.reminders.length
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading reminders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadReminders}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">User Reminders</h2>
        <p className="text-gray-500 text-sm">
          {reminders.length} reminder{reminders.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No reminders yet. Users can send reminders for locations they want you to visit.
        </div>
      ) : (
        <div className="space-y-6">
          {groupedReminders.map(group => (
            <div key={group.location?.id || 'unknown'} className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
              {/* Location Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    {group.location?.name || 'Unknown Location'}
                  </h3>
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {group.reminders.length} reminder{group.reminders.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Reminders List */}
              <div className="divide-y divide-gray-100">
                {group.reminders.map(reminder => (
                  <div key={reminder.id} className="px-4 py-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {reminder.message ? (
                          <p className="text-gray-700">{reminder.message}</p>
                        ) : (
                          <p className="text-gray-400 italic">No message</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(reminder.created_at)} &bull; User: {reminder.user_id.slice(0, 8)}...
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        disabled={actionLoading}
                        className={`ml-4 text-sm ${
                          deleteConfirm === reminder.id
                            ? 'bg-red-500 text-white px-2 py-1 rounded'
                            : 'text-red-500 hover:underline'
                        }`}
                      >
                        {deleteConfirm === reminder.id ? 'Confirm' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RemindersViewer;
