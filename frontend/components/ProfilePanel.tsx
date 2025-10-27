import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePanelProps {
  isGuestMode: boolean;
  onExitGuest: () => void;
  onClose?: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ isGuestMode, onExitGuest, onClose }) => {
  const { user, logout, isLoading } = useAuth();

  const handleLogoutClick = async () => {
    if (isGuestMode) {
      // For guest mode, call the parent's handler to reset to landing
      onExitGuest();
      if (onClose) onClose();
      return;
    }

    // For authenticated users, call auth logout then trigger parent reset
    await logout();
    if (onExitGuest) onExitGuest();
    if (onClose) onClose();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Profile</h3>
        <p className="text-sm text-gray-400">Manage your account, settings and notifications</p>
      </div>

      <div className="bg-gray-700/40 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xl">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'G'}
          </div>
          <div>
            <div className="text-white font-semibold">{user?.username ?? 'Guest'}</div>
            <div className="text-gray-400 text-sm">{user?.email ?? (isGuestMode ? 'Guest session' : 'Not available')}</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-300">
          <p>Player stats, membership, and linked accounts will appear here.</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-200 mb-2">Settings</h4>
        <div className="bg-gray-700/30 p-3 rounded-lg space-y-2 text-sm text-gray-300">
          <div className="flex items-center justify-between">
            <div>Dark Mode</div>
            <div className="text-xs text-gray-400">Enabled</div>
          </div>
          <div className="flex items-center justify-between">
            <div>Notifications</div>
            <div className="text-xs text-gray-400">On</div>
          </div>
          <div className="flex items-center justify-between">
            <div>Language</div>
            <div className="text-xs text-gray-400">English</div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex-1">
        <h4 className="text-sm font-semibold text-gray-200 mb-2">Notifications</h4>
        <div className="bg-gray-700/30 p-3 rounded-lg h-40 overflow-y-auto text-sm text-gray-300">
          <p className="text-gray-400">No notifications</p>
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={handleLogoutClick}
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          {isGuestMode ? 'Exit Guest Mode' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePanel;
