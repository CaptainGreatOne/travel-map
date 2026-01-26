import React from 'react';
import { RefreshCw } from 'lucide-react';

function DefaultFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium text-gray-700 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-500 mb-6">
          Try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultFallback />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
