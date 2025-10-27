import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePanelProps {
	isGuestMode: boolean;
	onExitGuest: () => void;
	onClose?: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ isGuestMode, onExitGuest, onClose }) => {
	const { user, isAuthenticated, logout } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
		} catch (e) {
			console.error('Logout failed:', e);
		}
		if (onClose) onClose();
	};

	const handleExitGuest = () => {
		onExitGuest();
		if (onClose) onClose();
	};

	return (
		<div className="text-gray-200">
			<div className="mb-4">
				<h3 className="text-2xl font-bold text-violet-300">Profile</h3>
				<p className="text-sm text-gray-400">Account & session settings</p>
			</div>

			<div className="bg-gray-900/50 p-4 rounded-lg mb-4 border border-gray-700">
				{isAuthenticated && user ? (
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-xl text-violet-300">{user.username.charAt(0).toUpperCase()}</div>
						<div>
							<div className="font-semibold">{user.username}</div>
							<div className="text-xs text-gray-400">{user.email}</div>
						</div>
					</div>
				) : (
					<div className="text-sm text-gray-400">You are currently in Guest Mode.</div>
				)}
			</div>

			<div className="space-y-3">
				<button
					onClick={isGuestMode ? handleExitGuest : handleLogout}
					className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
				>
					{isGuestMode ? 'Exit Guest Mode' : 'Logout'}
				</button>

				<div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
					<h4 className="text-sm font-semibold text-gray-300 mb-2">Preferences</h4>
					<p className="text-xs text-gray-400">Theme, notifications and other account settings will go here.</p>
				</div>

				<div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
					<h4 className="text-sm font-semibold text-gray-300 mb-2">Notifications</h4>
					<p className="text-xs text-gray-400">Placeholder for notification toggles and recent messages.</p>
				</div>
			</div>
		</div>
	);
};

export default ProfilePanel;
