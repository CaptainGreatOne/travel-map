import React from 'react';
import { MapPinOff } from 'lucide-react';

function MapFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100">
      <div className="text-center max-w-sm px-4">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
          <MapPinOff className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-lg font-medium text-gray-600 mb-2">
          Couldn't load the map
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

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MapErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <MapFallback />;
    }
    return this.props.children;
  }
}

export default MapErrorBoundary;
