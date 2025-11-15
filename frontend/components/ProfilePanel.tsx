import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { GameStatistics, Difficulty } from '../types';
import ConfirmDialog from './ConfirmDialog';
import AlertDialog from './AlertDialog';
import { loadStatistics } from '../services/statisticsService';
import authServiceSupabase from '../services/authService.supabase';

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
	const [alertDialog, setAlertDialog] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
		isOpen: false,
		title: '',
		message: '',
		type: 'info'
	});
	const [isEditingUsername, setIsEditingUsername] = useState(false);
	const [editedUsername, setEditedUsername] = useState('');
	const [usernameError, setUsernameError] = useState('');
	const [guestName, setGuestName] = useState(() => {
		return localStorage.getItem('guestPlayerName') || 'Guest Player';
	});
	const [isEditingGuestName, setIsEditingGuestName] = useState(false);
	const [editedGuestName, setEditedGuestName] = useState('');
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
		setAlertDialog({ isOpen: true, title, message, type });
	};

	const handleLogout = async () => {
		console.log('[ProfilePanel] Logging out...');
		try {
			// Close the profile panel first
			if (onClose) onClose();
			
			// Perform logout if authenticated
			if (isAuthenticated && logout) {
				await logout();
			}
			
			// Always return to landing page
			onExitGuest();
		} catch (e) {
			console.error('Logout failed:', e);
			// Even if logout fails, still exit to landing
			onExitGuest();
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

				console.log('[ProfilePanel] Delete account result:', result);

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
			showAlert('Error', 'Failed to delete account. Please try again.', 'error');
		}
	};

	const handleStartEditGuestName = () => {
		setEditedGuestName(guestName);
		setIsEditingGuestName(true);
	};

	const handleSaveGuestName = () => {
		if (!editedGuestName.trim()) {
			showAlert('Invalid Name', 'Name cannot be empty', 'warning');
			return;
		}

		localStorage.setItem('guestPlayerName', editedGuestName.trim());
		setGuestName(editedGuestName.trim());
		setIsEditingGuestName(false);
	};

	const handleCancelEditGuestName = () => {
		setIsEditingGuestName(false);
		setEditedGuestName('');
	};

	const handleStartEditUsername = () => {
		setEditedUsername(user?.username || '');
		setUsernameError('');
		setIsEditingUsername(true);
	};

	const handleSaveUsername = async () => {
		if (!editedUsername.trim()) {
			setUsernameError('Username cannot be empty');
			return;
		}

		if (editedUsername.trim().length < 3 || editedUsername.trim().length > 20) {
			setUsernameError('Username must be between 3 and 20 characters');
			return;
		}

		try {
			// Use updateProfile from AuthContext for instant optimistic updates
			const success = await updateProfile({ username: editedUsername.trim() });

			if (!success) {
				setUsernameError('Failed to update username. Please try again.');
				return;
			}

			setIsEditingUsername(false);
			setUsernameError('');
			console.log('[ProfilePanel] Username updated successfully');
		} catch (error: any) {
			console.error('Error updating username:', error);
			const errorMessage = error?.message || 'Failed to update username. Please try again.';
			setUsernameError(errorMessage);
		}
	};

	const handleCancelEditUsername = () => {
		setIsEditingUsername(false);
		setEditedUsername('');
		setUsernameError('');
	};

	const handleImageClick = () => {
		if (!isGuestMode && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsUploadingImage(true);

		try {
			const result = await authServiceSupabase.uploadProfileImage(file);

			if (!result.success) {
				showAlert('Upload Failed', result.error || 'Failed to upload image. Please try again.', 'error');
				return;
			}

			// Image uploaded successfully, profile will update via AuthContext
			showAlert('Success!', 'Profile image updated successfully!', 'success');
		} catch (error) {
			console.error('Error uploading image:', error);
			showAlert('Upload Failed', 'Failed to upload image. Please try again.', 'error');
		} finally {
			setIsUploadingImage(false);
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
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
			<div className="bg-gradient-to-br from-red-600/20 to-red-700/20 border border-red-600/30 rounded-lg p-3 sm:p-4 mb-4">
				{isAuthenticated && user ? (
					<div className="flex items-center gap-2 sm:gap-3">
						<div
							className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg overflow-hidden flex-shrink-0 ${!user.profileImage ? 'bg-gradient-to-br from-red-500 to-red-600' : ''} ${!isUploadingImage ? 'cursor-pointer hover:ring-2 hover:ring-red-400 transition-all' : 'opacity-50'} group`}
							onClick={handleImageClick}
							title="Click to change profile image"
						>
							{isUploadingImage ? (
								<div className="text-sm">⏳</div>
							) : user.profileImage ? (
								<>
									<img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
									<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<span className="text-xs">📷 Change</span>
									</div>
								</>
							) : (
								<>
									{user.username.charAt(0).toUpperCase()}
									<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<span className="text-xs">📷 Upload</span>
									</div>
								</>
							)}
						</div>
						<div className="flex-1">
							{isEditingUsername ? (
								<div>
									<div className="flex items-center gap-2">
										<input
											type="text"
											value={editedUsername}
											onChange={(e) => setEditedUsername(e.target.value)}
											className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm"
											placeholder="Username"
											maxLength={30}
											autoFocus
										/>
										<button
											onClick={handleSaveUsername}
											className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
										>
											Save
										</button>
										<button
											onClick={handleCancelEditUsername}
											className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
										>
											Cancel
										</button>
									</div>
									{usernameError && (
										<div className="text-xs text-red-400 mt-1">{usernameError}</div>
									)}
								</div>
							) : (
								<div className="flex items-center gap-2">
									<div className="font-bold text-base sm:text-lg text-white truncate">{user.username}</div>
									<button
										onClick={handleStartEditUsername}
										className="text-red-300 hover:text-red-200 text-xs flex-shrink-0"
										title="Edit username"
									>
										✏️
									</button>
								</div>
							)}
							<div className="text-xs text-red-200/70 mt-0.5 truncate">{user.email}</div>
							<div className="flex flex-wrap items-center gap-2 mt-1">
								<span className="text-xs bg-red-600/50 text-red-200 px-2 py-0.5 rounded">
									Signed In
								</span>
							</div>
						</div>
					</div>
				) : (
					<div className="flex items-center gap-2 sm:gap-3">
						<div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
							🎮
						</div>
						<div className="flex-1">
							{isEditingGuestName ? (
								<div className="flex items-center gap-2 mb-1">
									<input
										type="text"
										value={editedGuestName}
										onChange={(e) => setEditedGuestName(e.target.value)}
										className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm"
										placeholder="Guest name"
										autoFocus
									/>
									<button
										onClick={handleSaveGuestName}
										className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
									>
										Save
									</button>
									<button
										onClick={handleCancelEditGuestName}
										className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
									>
										Cancel
									</button>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<div className="font-bold text-lg text-white">{guestName}</div>
									<button
										onClick={handleStartEditGuestName}
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
						Current Session
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
						Career Statistics
					</h3>
					<div className="grid grid-cols-2 gap-3">
						<div className="bg-gray-800/50 rounded-lg p-3">
							<div className="text-xs text-gray-400 mb-1">Total Careers</div>
							<div className="text-xl font-bold text-red-400">{statistics.totalGamesPlayed}</div>
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
						Personal Records
					</h3>
					<div className="space-y-2 text-sm">
						{statistics.highestCash > 0 && (
							<div className="flex justify-between items-center">
								<span className="text-gray-400">Peak Wealth</span>
								<span className="font-semibold text-green-400">{formatCurrency(statistics.highestCash)}</span>
							</div>
						)}
						{statistics.highestFameReached > 0 && (
							<div className="flex justify-between items-center">
								<span className="text-gray-400">Peak Fame</span>
								<span className="font-semibold text-yellow-400">{statistics.highestFameReached}</span>
							</div>
						)}
						{statistics.longestCareerWeeks > 0 && (
							<div className="flex justify-between items-center">
								<span className="text-gray-400">Longest Career</span>
								<span className="font-semibold text-red-400">{statistics.longestCareerWeeks} weeks</span>
							</div>
						)}
						{statistics.totalCashEarned > 0 && (
							<div className="flex justify-between items-center">
								<span className="text-gray-400">Total Earned</span>
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
						Learning Progress
					</h3>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between items-center">
							<span className="text-gray-400">Modules Completed</span>
							<span className="font-semibold text-red-400">{statistics.modulesCompleted}</span>
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
							className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
						>
							<span></span>
							Register / Login
						</button>
						<div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3">
							<div>
								<h4 className="text-sm font-semibold text-blue-300 mb-1">Save Your Progress!</h4>
								<p className="text-xs text-blue-200 leading-relaxed">
									Register now to keep all your current stats, achievements, and game history. Don't lose your progress!
								</p>
							</div>
						</div>
					</>
				)}

				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						isGuestMode ? handleExitGuest() : handleLogout();
					}}
					className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
				>
					{isGuestMode ? 'Exit Guest Mode' : 'Logout'}
				</button>

				{/* Delete Profile Button */}
				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setShowDeleteDialog(true);
					}}
					className="w-full bg-gray-700 hover:bg-gray-600 text-red-400 hover:text-red-300 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-gray-600"
				>
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

			{/* Alert Dialog */}
			<AlertDialog
				isOpen={alertDialog.isOpen}
				title={alertDialog.title}
				message={alertDialog.message}
				type={alertDialog.type}
				onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
			/>
		</div>
	);
};

export default ProfilePanel;
