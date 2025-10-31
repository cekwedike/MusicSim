import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { GameStatistics, Difficulty } from '../types';
import ConfirmDialog from './ConfirmDialog';
import { loadStatistics } from '../services/statisticsService';

interface ProfilePanelProps {
	isGuestMode: boolean;
	onExitGuest: () => void;
	onClose?: () => void;
	statistics?: GameStatistics;
	artistName?: string;
	difficulty?: Difficulty;
	onOpenAuth?: () => void; // Callback to open login/register modal
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
	isGuestMode,
	onExitGuest,
	onClose,
	statistics,
	artistName,
	difficulty,
	onOpenAuth
}) => {
	const { user, isAuthenticated, logout, deleteAccount, updateProfile } = useAuth();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isEditingName, setIsEditingName] = useState(false);
	const [editedName, setEditedName] = useState('');
	const [guestName, setGuestName] = useState(() => {
		return localStorage.getItem('guestPlayerName') || 'Guest Player';
	});
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleLogout = async () => {
		console.log('[ProfilePanel] Logging out...');
		try {
			// Always use onExitGuest to properly return to landing page
			if (onClose) onClose();
			onExitGuest(); // This handles both logout and returning to landing
		} catch (e) {
			console.error('Logout failed:', e);
		}
	};

	const handleExitGuest = () => {
		console.log('[ProfilePanel] Exiting guest mode...');
		if (onClose) onClose();
		onExitGuest();
	};

	const handleDeleteProfile = async () => {
		console.log('[ProfilePanel] Starting profile deletion...');

		try {
			if (isAuthenticated) {
				// Delete account from backend (also clears localStorage)
				console.log('[ProfilePanel] Deleting account from backend...');
				const result = await deleteAccount();

				if (!result.success) {
					throw new Error(result.message || 'Failed to delete account');
				}

				console.log('[ProfilePanel] Account deleted from backend successfully');
			} else {
				// Guest mode - just clear localStorage
				console.log('[ProfilePanel] Guest mode - clearing localStorage...');
				localStorage.clear();
			}

			console.log('[ProfilePanel] Profile deletion completed');

			// Close the dialog
			setShowDeleteDialog(false);

			// Close the panel
			if (onClose) onClose();

			// Return to landing page by triggering logout/exit guest flow
			console.log('[ProfilePanel] Returning to landing page...');
			onExitGuest();
		} catch (error) {
			console.error('[ProfilePanel] Error deleting profile:', error);
			setShowDeleteDialog(false);
			alert('Failed to delete account. Please try again.');
		}
	};

	const handleStartEditName = () => {
		if (isGuestMode) {
			setEditedName(guestName);
		} else {
			setEditedName(user?.displayName || user?.username || '');
		}
		setIsEditingName(true);
	};

	const handleSaveName = async () => {
		if (!editedName.trim()) {
			alert('Name cannot be empty');
			return;
		}

		if (isGuestMode) {
			// Save guest name to localStorage
			localStorage.setItem('guestPlayerName', editedName.trim());
			setGuestName(editedName.trim());
		} else {
			// Update registered user's name
			try {
				const success = await updateProfile({ displayName: editedName.trim() });
				if (!success) {
					alert('Failed to update name. Please try again.');
					return;
				}
			} catch (error) {
				console.error('Error updating name:', error);
				alert('Failed to update name. Please try again.');
				return;
			}
		}

		setIsEditingName(false);
	};

	const handleCancelEditName = () => {
		setIsEditingName(false);
		setEditedName('');
	};

	const handleImageClick = () => {
		if (!isGuestMode && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			alert('Please select an image file');
			return;
		}

		// Validate file size (max 2MB)
		if (file.size > 2 * 1024 * 1024) {
			alert('Image size must be less than 2MB');
			return;
		}

		setIsUploadingImage(true);

		try {
			// Convert to base64
			const reader = new FileReader();
			reader.onload = async (e) => {
				const base64 = e.target?.result as string;

				try {
					const success = await updateProfile({ profileImage: base64 });
					if (!success) {
						alert('Failed to upload image. Please try again.');
					}
				} catch (error) {
					console.error('Error uploading image:', error);
					alert('Failed to upload image. Please try again.');
				} finally {
					setIsUploadingImage(false);
				}
			};
			reader.readAsDataURL(file);
		} catch (error) {
			console.error('Error reading file:', error);
			alert('Failed to read image file');
			setIsUploadingImage(false);
		}
	};

	const handleOpenAuthModal = () => {
		if (onOpenAuth) {
			if (onClose) onClose();
			onOpenAuth();
		}
	};

	const formatPlayTime = (minutes: number) => {
		if (minutes < 60) return `${minutes}m`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	const formatCurrency = (amount: number) => {
		if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
		if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
		return `$${amount}`;
	};

	return (
		<div className="h-full overflow-y-auto -mx-4 px-4">
			{/* Hidden file input for image upload */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleImageUpload}
				className="hidden"
			/>

			{/* Account Header */}
			<div className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-600/30 rounded-lg p-4 mb-4">
				{isAuthenticated && user ? (
					<div className="flex items-center gap-3">
						<div
							className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden ${!user.profileImage ? 'bg-gradient-to-br from-violet-500 to-purple-600' : ''} ${!isUploadingImage ? 'cursor-pointer hover:opacity-80' : 'opacity-50'}`}
							onClick={handleImageClick}
							title="Click to change profile image"
						>
							{isUploadingImage ? (
								<div className="text-sm">⏳</div>
							) : user.profileImage ? (
								<img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
							) : (
								user.username.charAt(0).toUpperCase()
							)}
						</div>
						<div className="flex-1">
							{isEditingName ? (
								<div className="flex items-center gap-2 mb-1">
									<input
										type="text"
										value={editedName}
										onChange={(e) => setEditedName(e.target.value)}
										className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm"
										placeholder="Display name"
										autoFocus
									/>
									<button
										onClick={handleSaveName}
										className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
									>
										Save
									</button>
									<button
										onClick={handleCancelEditName}
										className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
									>
										Cancel
									</button>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<div className="font-bold text-lg text-white">{user.displayName || user.username}</div>
									<button
										onClick={handleStartEditName}
										className="text-violet-300 hover:text-violet-200 text-xs"
										title="Edit name"
									>
										✏️
									</button>
								</div>
							)}
							<div className="text-sm text-violet-200">{user.email}</div>
							<div className="flex items-center gap-2 mt-1">
								<span className="text-xs bg-violet-600/50 text-violet-200 px-2 py-0.5 rounded">
									Signed In
								</span>
							</div>
						</div>
					</div>
				) : (
					<div className="flex items-center gap-3">
						<div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
							👤
						</div>
						<div className="flex-1">
							{isEditingName ? (
								<div className="flex items-center gap-2 mb-1">
									<input
										type="text"
										value={editedName}
										onChange={(e) => setEditedName(e.target.value)}
										className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm"
										placeholder="Guest name"
										autoFocus
									/>
									<button
										onClick={handleSaveName}
										className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
									>
										Save
									</button>
									<button
										onClick={handleCancelEditName}
										className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
									>
										Cancel
									</button>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<div className="font-bold text-lg text-white">{guestName}</div>
									<button
										onClick={handleStartEditName}
										className="text-gray-300 hover:text-white text-xs"
										title="Edit name"
									>
										✏️
									</button>
								</div>
							)}
							<div className="text-sm text-gray-300">Playing without an account</div>
							<div className="flex items-center gap-2 mt-1">
								<span className="text-xs bg-yellow-600/50 text-yellow-200 px-2 py-0.5 rounded">
									Guest Mode
								</span>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Current Session */}
			{artistName && (
				<div className="bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-600">
					<h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
						<span>🎵</span> Current Session
					</h3>
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-xs text-gray-400">Artist</span>
							<span className="text-sm font-medium text-yellow-400">{artistName}</span>
						</div>
						{difficulty && (
							<div className="flex justify-between items-center">
								<span className="text-xs text-gray-400">Difficulty</span>
								<span className="text-sm font-medium text-white capitalize">{difficulty}</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Career Statistics */}
			{statistics && (
				<div className="bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-600">
					<h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
						<span>📊</span> Career Statistics
					</h3>
					<div className="grid grid-cols-2 gap-3">
						<div className="bg-gray-800/50 rounded-lg p-3">
							<div className="text-xs text-gray-400 mb-1">Total Careers</div>
							<div className="text-xl font-bold text-violet-400">{statistics.totalGamesPlayed}</div>
						</div>
						<div className="bg-gray-800/50 rounded-lg p-3">
							<div className="text-xs text-gray-400 mb-1">Total Weeks</div>
							<div className="text-xl font-bold text-green-400">{statistics.totalWeeksPlayed}</div>
						</div>
						<div className="bg-gray-800/50 rounded-lg p-3">
							<div className="text-xs text-gray-400 mb-1">Play Time</div>
							<div className="text-xl font-bold text-blue-400">
								{formatPlayTime(statistics.totalPlayTimeMinutes || 0)}
							</div>
						</div>
						<div className="bg-gray-800/50 rounded-lg p-3">
							<div className="text-xs text-gray-400 mb-1">Achievements</div>
							<div className="text-xl font-bold text-yellow-400">{statistics.achievementsUnlocked}</div>
						</div>
					</div>
				</div>
			)}

			{/* Milestones */}
			{statistics && (statistics.highestCash > 0 || statistics.highestFameReached > 0) && (
				<div className="bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-600">
					<h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
						<span>🏆</span> Personal Records
					</h3>
					<div className="space-y-2 text-sm">
						{statistics.highestCash > 0 && (
							<div className="flex justify-between items-center">
								<span className="text-gray-400">💰 Peak Wealth</span>
								<span className="font-semibold text-green-400">{formatCurrency(statistics.highestCash)}</span>
							</div>
						)}
						{statistics.highestFameReached > 0 && (
							<div className="flex justify-between items-center">
								<span className="text-gray-400">⭐ Peak Fame</span>
								<span className="font-semibold text-yellow-400">{statistics.highestFameReached}</span>
							</div>
						)}
						{statistics.longestCareerWeeks > 0 && (
							<div className="flex justify-between items-center">
								<span className="text-gray-400">📅 Longest Career</span>
								<span className="font-semibold text-violet-400">{statistics.longestCareerWeeks} weeks</span>
							</div>
						)}
						{statistics.totalCashEarned > 0 && (
							<div className="flex justify-between items-center">
								<span className="text-gray-400">💵 Total Earned</span>
								<span className="font-semibold text-green-400">{formatCurrency(statistics.totalCashEarned)}</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Learning Progress */}
			{statistics && statistics.modulesCompleted > 0 && (
				<div className="bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-600">
					<h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
						<span>📚</span> Learning Progress
					</h3>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between items-center">
							<span className="text-gray-400">Modules Completed</span>
							<span className="font-semibold text-violet-400">{statistics.modulesCompleted}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-400">Average Quiz Score</span>
							<span className="font-semibold text-green-400">{Math.round(statistics.averageQuizScore)}%</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-400">Concepts Mastered</span>
							<span className="font-semibold text-yellow-400">{statistics.conceptsMastered?.length || 0}</span>
						</div>
					</div>
				</div>
			)}

			{/* Actions */}
			<div className="space-y-3 mb-4">
				{isGuestMode && onOpenAuth && (
					<>
						<button
							onClick={handleOpenAuthModal}
							className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
						>
							<span>✨</span>
							Register / Login
						</button>
						<div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3">
							<div className="flex items-start gap-2">
								<span className="text-lg">💡</span>
								<div>
									<h4 className="text-sm font-semibold text-blue-300 mb-1">Save Your Progress!</h4>
									<p className="text-xs text-blue-200 leading-relaxed">
										Register now to keep all your current stats, achievements, and game history. Don't lose your progress!
									</p>
								</div>
							</div>
						</div>
					</>
				)}

				<button
					onClick={isGuestMode ? handleExitGuest : handleLogout}
					className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
				>
					<span>{isGuestMode ? '🚪' : '👋'}</span>
					{isGuestMode ? 'Exit Guest Mode' : 'Logout'}
				</button>

				{/* Delete Profile Button */}
				<button
					onClick={() => setShowDeleteDialog(true)}
					className="w-full bg-gray-700 hover:bg-gray-600 text-red-400 hover:text-red-300 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-gray-600"
				>
					<span>🗑️</span>
					Delete All Data
				</button>
			</div>

			{/* Delete Confirmation Dialog */}
			<ConfirmDialog
				isOpen={showDeleteDialog}
				title="Delete All Data?"
				message="This will permanently delete all your saved games, statistics, and progress. This action cannot be undone."
				confirmText="Delete Everything"
				cancelText="Cancel"
				type="danger"
				onConfirm={handleDeleteProfile}
				onCancel={() => setShowDeleteDialog(false)}
			/>
		</div>
	);
};

export default ProfilePanel;
