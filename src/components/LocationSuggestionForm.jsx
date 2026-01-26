import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { submitReminder } from '../services/suggestionService';

function LocationSuggestionForm({ location, onCancel, onSuccess }) {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await submitReminder(user.id, location.id, reason);

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Success!
      if (onSuccess) onSuccess();
    } catch {
      setError('Unable to submit reminder. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-slideIn"
    >
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <h4 className="m-0 mb-4 text-base text-secondary font-semibold">
        Why should I visit {location.name}?
      </h4>

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm mb-3">
          {error}
        </div>
      )}

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
        rows={4}
        placeholder="The sunsets are incredible, the food is amazing..."
        className="w-full p-2 rounded-md border border-gray-300 text-sm font-sans resize-none mb-3 box-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />

      <input
        type="text"
        value={submitterName}
        onChange={(e) => setSubmitterName(e.target.value)}
        placeholder={`Your name (optional, default: ${user.email.split('@')[0]})`}
        className="w-full p-2 rounded-md border border-gray-300 text-sm mb-3 box-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2 px-3 bg-gray-100 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !reason.trim()}
          className="flex-1 py-2 px-3 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default LocationSuggestionForm;
