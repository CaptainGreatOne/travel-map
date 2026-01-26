import React, { useState } from 'react';
import { MapPin, Camera, Info, PlusCircle, User, LogOut, X, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

// Get admin emails from env var (comma-separated list)
const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(e => e.length > 0);

function Sidebar({ activeView, onNavigate, children, isOpen, onClose }) {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if user is admin
  const isAdmin = user && adminEmails.includes(user.email?.toLowerCase());

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-secondary text-gray-100 flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.15)] overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:w-[280px] lg:min-w-[280px]
      `}>
      <div className="p-6 flex flex-col h-full">

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted hover:text-gray-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="m-0 text-2xl font-semibold text-primary flex items-center gap-2">
            <MapPin size={28} />
            Wanderlog
          </h1>
          <p className="mt-1 mb-0 text-sm text-muted font-light">
            Your travel journey
          </p>
        </div>

        {/* Navigation */}
        <nav className="mb-8">
          <NavItem
            icon={<MapPin size={20} />}
            label="Map View"
            active={activeView === 'map'}
            onClick={() => onNavigate('map')}
          />
          <NavItem
            icon={<Camera size={20} />}
            label="Photography"
            active={activeView === 'photography'}
            onClick={() => onNavigate('photography')}
          />
          <NavItem
            icon={<Info size={20} />}
            label="About"
            active={activeView === 'about'}
            onClick={() => onNavigate('about')}
          />
          <NavItem
            icon={<PlusCircle size={20} />}
            label="Suggest Location"
            active={activeView === 'suggest'}
            onClick={() => onNavigate('suggest')}
          />
          {isAdmin && (
            <NavItem
              icon={<Settings size={20} />}
              label="Admin"
              active={activeView === 'admin'}
              onClick={() => onNavigate('admin')}
            />
          )}
        </nav>

        {/* Optional children (for filters, etc.) */}
        {children}

        {/* User section at bottom */}
        <div className="mt-auto pt-4 border-t border-white/10">
          {!user ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-primary text-white border-none rounded-lg cursor-pointer text-[0.95rem] font-medium transition-colors duration-200 hover:bg-primary-hover"
            >
              <User size={20} />
              Sign In
            </button>
          ) : (
            <>
              <div className="p-3 bg-primary/10 rounded-lg mb-3">
                <p className="m-0 mb-1 text-sm text-muted font-medium">
                  Signed in as:
                </p>
                <p className="m-0 text-[0.9rem] text-primary font-semibold break-words">
                  {user.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/10 text-muted border-none rounded-lg cursor-pointer text-[0.95rem] font-medium transition-colors duration-200 hover:bg-white/15 hover:text-gray-100"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </div>
    </>
  );
}

// Navigation Item Component
function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-3 px-4 mb-2 border-none rounded-lg cursor-pointer text-[0.95rem] transition-all duration-200 ${
        active
          ? 'bg-primary/15 text-primary font-medium border-l-[3px] border-l-primary'
          : 'bg-transparent text-muted font-normal border-l-[3px] border-l-transparent hover:bg-white/5 hover:text-gray-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default Sidebar;
