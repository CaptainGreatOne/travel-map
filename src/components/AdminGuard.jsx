import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * AdminGuard - Protects admin routes with email whitelist
 * Only allows access if user is logged in AND email is in VITE_ADMIN_EMAILS
 */
const AdminGuard = ({ children }) => {
  const { user, loading } = useAuth();

  // Get admin emails from env var (comma-separated list)
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 0);

  // Check if user is admin
  const isAdmin = user && adminEmails.includes(user.email?.toLowerCase());

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            {!user
              ? 'You must be logged in to access this page.'
              : 'You do not have permission to access the admin panel.'}
          </p>
          <Link
            to="/"
            className="inline-block bg-primary hover:bg-primary-hover text-white font-medium px-6 py-2 rounded-md transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Render children if admin
  return children;
};

export default AdminGuard;
