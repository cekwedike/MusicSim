import React, { useState } from 'react';

interface GuestDataMergeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChoice: (choice: 'merge' | 'cloud' | 'both') => Promise<void>;
    guestSaveCount: number;
    hasCloudData: boolean;
}

export const GuestDataMergeModal: React.FC<GuestDataMergeModalProps> = ({
    isOpen,
    onClose,
    onChoice,
    guestSaveCount,
    hasCloudData
}) => {
    const [selectedChoice, setSelectedChoice] = useState<'merge' | 'cloud' | 'both'>('merge');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            await onChoice(selectedChoice);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process your choice');
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[100] animate-fade-in">
            <div className="bg-[#2D1115] border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-red-300 mb-4">Welcome Back!</h2>

                <p className="text-gray-300 mb-6">
                    We found <strong className="text-yellow-300">{guestSaveCount} game save{guestSaveCount !== 1 ? 's' : ''}</strong> from your guest session.
                    {hasCloudData && <span className="block mt-2">You also have existing cloud data on your account.</span>}
                </p>

                <div className="space-y-4 mb-6">
                    {/* Option 1: Merge Guest Progress */}
                    <label className={`block p-4 border rounded-lg cursor-pointer transition ${
                        selectedChoice === 'merge'
                            ? 'border-green-500 bg-green-900/20'
                            : 'border-gray-600 hover:border-gray-500'
                    }`}>
                        <input
                            type="radio"
                            name="mergeChoice"
                            value="merge"
                            checked={selectedChoice === 'merge'}
                            onChange={(e) => setSelectedChoice(e.target.value as 'merge')}
                            className="mr-3"
                        />
                        <div className="inline-block">
                            <div className="font-bold text-green-300 text-lg">Keep Guest Progress</div>
                            <div className="text-sm text-gray-400 mt-1">
                                Merge your guest statistics with your account and transfer all guest saves to the cloud.
                                {hasCloudData && ' Your existing cloud saves will be preserved.'}
                            </div>
                            <div className="text-xs text-green-400 mt-2">
                                ✓ All guest saves transferred to cloud<br />
                                ✓ Statistics merged (games played, achievements, etc.)<br />
                                ✓ No data lost
                            </div>
                        </div>
                    </label>

                    {/* Option 2: Load Cloud Data */}
                    {hasCloudData && (
                        <label className={`block p-4 border rounded-lg cursor-pointer transition ${
                            selectedChoice === 'cloud'
                                ? 'border-blue-500 bg-blue-900/20'
                                : 'border-gray-600 hover:border-gray-500'
                        }`}>
                            <input
                                type="radio"
                                name="mergeChoice"
                                value="cloud"
                                checked={selectedChoice === 'cloud'}
                                onChange={(e) => setSelectedChoice(e.target.value as 'cloud')}
                                className="mr-3"
                            />
                            <div className="inline-block">
                                <div className="font-bold text-blue-300 text-lg">Load My Cloud Data</div>
                                <div className="text-sm text-gray-400 mt-1">
                                    Start fresh with your existing cloud saves. Guest progress will be discarded.
                                </div>
                                <div className="text-xs text-yellow-400 mt-2">
                                    ⚠ Guest saves will be permanently deleted<br />
                                    ✓ Cloud data remains unchanged
                                </div>
                            </div>
                        </label>
                    )}

                    {/* Option 3: Keep Both */}
                    <label className={`block p-4 border rounded-lg cursor-pointer transition ${
                        selectedChoice === 'both'
                            ? 'border-purple-500 bg-purple-900/20'
                            : 'border-gray-600 hover:border-gray-500'
                    }`}>
                        <input
                            type="radio"
                            name="mergeChoice"
                            value="both"
                            checked={selectedChoice === 'both'}
                            onChange={(e) => setSelectedChoice(e.target.value as 'both')}
                            className="mr-3"
                        />
                        <div className="inline-block">
                            <div className="font-bold text-purple-300 text-lg">Keep Both Separately</div>
                            <div className="text-sm text-gray-400 mt-1">
                                Keep guest saves in local storage and access cloud saves independently.
                                Statistics are merged.
                            </div>
                            <div className="text-xs text-purple-400 mt-2">
                                ✓ Guest saves remain in browser storage<br />
                                ✓ Cloud saves accessible from Save/Load menu<br />
                                ✓ Statistics merged
                            </div>
                        </div>
                    </label>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-[#4D1F2A] disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        {isProcessing ? 'Processing...' : 'Confirm Choice'}
                    </button>

                    {!isProcessing && (
                        <button
                            onClick={onClose}
                            className="px-6 bg-[#4D1F2A] hover:bg-[#3D1820] text-white font-bold py-3 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                    This choice is permanent and cannot be undone.
                </p>
            </div>
        </div>
    );
};

export default GuestDataMergeModal;
