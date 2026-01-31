import React, { useState, useEffect } from 'react';
import { fetchDashboardMetrics } from '../services/adminService';
import LocationManager from '../components/admin/LocationManager';
import SuggestionModerator from '../components/admin/SuggestionModerator';
import VideoManager from '../components/admin/VideoManager';
import PhotoManager from '../components/admin/PhotoManager';
import RemindersViewer from '../components/admin/RemindersViewer';
import AboutEditor from '../components/admin/AboutEditor';

/**
 * AdminPage - Main admin dashboard with metrics and tab navigation
 * Protected by AdminGuard wrapper in routing
 */
function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await fetchDashboardMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
        setError('Failed to load metrics. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (activeTab === 'dashboard') {
      loadMetrics();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'locations', label: 'Locations' },
    { id: 'suggestions', label: 'Suggestions' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'videos', label: 'Videos' },
    { id: 'photos', label: 'Photos' },
    { id: 'about', label: 'About' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">Loading metrics...</div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-red-500">{error}</div>
                </div>
              ) : metrics ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Total Locations Card */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Locations</h3>
                    <p className="text-3xl font-bold text-secondary">{metrics.totalLocations}</p>
                  </div>

                  {/* Pending Suggestions Card */}
                  <div className={`bg-white p-6 rounded-lg shadow border ${
                    metrics.pendingSuggestions > 0 ? 'border-amber-200 bg-amber-50' : 'border-gray-100'
                  }`}>
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Suggestions</h3>
                    <p className={`text-3xl font-bold ${
                      metrics.pendingSuggestions > 0 ? 'text-amber-600' : 'text-secondary'
                    }`}>
                      {metrics.pendingSuggestions}
                    </p>
                    {metrics.pendingSuggestions > 0 && (
                      <p className="text-xs text-amber-600 mt-2">Requires attention</p>
                    )}
                  </div>

                  {/* Total Reminders Card */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Reminders</h3>
                    <p className="text-3xl font-bold text-secondary">{metrics.totalReminders}</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Locations Tab */}
          {activeTab === 'locations' && <LocationManager />}

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && <SuggestionModerator />}

          {/* Reminders Tab */}
          {activeTab === 'reminders' && <RemindersViewer />}

          {/* Videos Tab */}
          {activeTab === 'videos' && <VideoManager />}

          {/* Photos Tab */}
          {activeTab === 'photos' && <PhotoManager />}

          {/* About Tab */}
          {activeTab === 'about' && <AboutEditor />}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
