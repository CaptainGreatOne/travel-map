import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import MapPage from './pages/MapPage';
import PhotographyPage from './pages/PhotographyPage';
import AboutPage from './pages/AboutPage';
import SuggestPage from './pages/SuggestPage';
import AdminPage from './pages/AdminPage';
import AdminGuard from './components/AdminGuard';

// LAYOUT COMPONENT
// Wraps all pages with the sidebar
function Layout({ children, sidebarContent }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen m-0 p-0 overflow-hidden font-sans">
      {/* Mobile Header with Hamburger */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center h-14 px-4 bg-secondary lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-100 hover:text-primary"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <span className="ml-3 text-lg font-semibold text-primary">Wanderlog</span>
      </div>

      <LayoutContent
        sidebarContent={sidebarContent}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        {children}
      </LayoutContent>
    </div>
  );
}

// Map page route component - properly re-renders when auth changes
function MapPageRoute() {
  const mapPage = MapPage();
  return (
    <Layout sidebarContent={mapPage.filters}>
      {mapPage.content}
    </Layout>
  );
}

// Separate component for content that uses router hooks
function LayoutContent({ children, sidebarContent, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  // Determine which page we're on based on current URL
  const getCurrentView = () => {
    const path = window.location.pathname;
    if (path === '/') return 'map';
    if (path === '/photography') return 'photography';
    if (path === '/about') return 'about';
    if (path === '/suggest') return 'suggest';
    if (path === '/admin') return 'admin';
    return 'map';
  };

  return (
    <>
      <Sidebar
        activeView={getCurrentView()}
        onNavigate={(view) => {
          const routes = {
            map: '/',
            photography: '/photography',
            about: '/about',
            suggest: '/suggest',
            admin: '/admin'
          };
          navigate(routes[view]);
          setSidebarOpen(false); // Close sidebar on mobile after navigation
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        {sidebarContent}
      </Sidebar>
      {/* Main content area with padding for mobile header */}
      <div className="flex-1 pt-14 lg:pt-0 overflow-auto">
        {children}
      </div>
    </>
  );
}

// APP CONTENT COMPONENT
// Handles loading state before showing routes
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Map page (home) */}
        <Route path="/" element={
          <MapPageRoute />
        } />

        {/* Photography page */}
        <Route path="/photography" element={
          <Layout>
            <PhotographyPage />
          </Layout>
        } />

        {/* About page */}
        <Route path="/about" element={
          <Layout>
            <AboutPage />
          </Layout>
        } />

        {/* Suggest location page (placeholder for now) */}
        <Route path="/suggest" element={
          <Layout>
            <SuggestPage />
          </Layout>
        } />

        {/* Admin page - protected by AdminGuard */}
        <Route path="/admin" element={
          <Layout>
            <AdminGuard>
              <AdminPage />
            </AdminGuard>
          </Layout>
        } />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// MAIN APP COMPONENT
function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;