import React, { useState } from 'react';
import { User } from 'lucide-react';
import AuthModal from './AuthModal';

/**
 * AuthPrompt - Reusable authentication prompt component.
 * Displays a centered prompt encouraging users to sign in,
 * with an integrated AuthModal for the sign-in flow.
 *
 * @param {Object} props
 * @param {React.ComponentType} [props.icon=User] - Lucide icon component to display
 * @param {string} [props.title="Sign In Required"] - Heading text
 * @param {string} props.message - Explanation text shown below the title
 * @param {string} [props.buttonText="Sign In to Continue"] - Button label
 * @param {Function} [props.onSignIn] - Optional callback when button is clicked
 */
function AuthPrompt({
  // eslint-disable-next-line no-unused-vars -- IconComponent is used in JSX below
  icon: IconComponent = User,
  title = "Sign In Required",
  message,
  buttonText = "Sign In to Continue",
  onSignIn
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleButtonClick = () => {
    if (onSignIn) {
      onSignIn();
    }
    setShowAuthModal(true);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background p-4">
      <div className="text-center p-6 md:p-12 bg-white rounded-xl shadow-md max-w-[500px] w-full">
        <IconComponent size={64} className="text-primary mb-4 md:mb-6 mx-auto" />
        <h2 className="m-0 mb-3 md:mb-4 text-2xl md:text-3xl text-secondary">
          {title}
        </h2>
        <p className="m-0 mb-6 md:mb-8 text-base md:text-lg text-gray-600 leading-relaxed">
          {message}
        </p>
        <button
          onClick={handleButtonClick}
          className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 bg-primary text-white border-none rounded-lg text-base md:text-lg font-semibold cursor-pointer shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
        >
          {buttonText}
        </button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default AuthPrompt;
