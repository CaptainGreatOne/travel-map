import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthPrompt from '../components/AuthPrompt';
import SuggestForm from '../components/SuggestForm';

function SuggestPage() {
  const { user } = useAuth();

  // Not logged in - show login prompt
  if (!user) {
    return (
      <AuthPrompt
        message="You need to be signed in to suggest locations. This helps us prevent spam and keep suggestions organized."
      />
    );
  }

  // Logged in - show suggestion form
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Page Header */}
      <div className="py-8 md:py-12 px-4 md:px-16 pb-6 md:pb-8 bg-gradient-to-br from-secondary to-secondary/80 text-white">
        <h1 className="m-0 mb-2 text-2xl md:text-4xl font-bold">
          Suggest a Location
        </h1>
        <p className="m-0 text-base md:text-lg opacity-90 font-light">
          Know an amazing place I should visit? Let me know!
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-[700px] mx-auto py-6 md:py-12 px-4 md:px-8">
        <SuggestForm user={user} />
      </div>
    </div>
  );
}

export default SuggestPage;
