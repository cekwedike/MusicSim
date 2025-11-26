import React from 'react';
import type { PendingContractOffer } from '../types';

interface OffersModalProps {
    pendingOffer: PendingContractOffer;
    currentWeek: number;
    onViewContract: () => void;
    onDecline: () => void;
    onClose: () => void;
}

const OffersModal: React.FC<OffersModalProps> = ({
    pendingOffer,
    currentWeek,
    onViewContract,
    onDecline,
    onClose
}) => {
    const weeksRemaining = Math.max(0, pendingOffer.expiresWeek - currentWeek);
    const isExpiringSoon = weeksRemaining <= 4;
    const isExpired = weeksRemaining === 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-[#2D1115] border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-red-300">Pending Contract Offer</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="bg-[#3D1820]/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white">{pendingOffer.label.name}</h3>
                        <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">
                            PENDING
                        </span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Advance:</span>
                            <span className="text-green-400 font-bold">${(pendingOffer.label.advance || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Royalty Rate:</span>
                            <span className="text-blue-400 font-bold">{pendingOffer.label.royaltyRate || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Contract Length:</span>
                            <span className="text-purple-400 font-bold">{pendingOffer.label.contractLength || 0} years</span>
                        </div>
                    </div>
                </div>

                {isExpired ? (
                    <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 mb-4">
                        <p className="text-red-300 text-sm font-semibold">
                            This offer has expired! The label has withdrawn their interest.
                        </p>
                    </div>
                ) : (
                    <div className={`${isExpiringSoon ? 'bg-yellow-900/30 border-yellow-700' : 'bg-blue-900/30 border-blue-700'} border rounded-lg p-3 mb-4`}>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                                <p className={`text-sm font-semibold ${isExpiringSoon ? 'text-yellow-300' : 'text-blue-300'}`}>
                                    {isExpiringSoon ? 'Expires Soon!' : 'Time Remaining'}
                                </p>
                                <p className={`text-xs ${isExpiringSoon ? 'text-yellow-200' : 'text-blue-200'}`}>
                                    {weeksRemaining} week{weeksRemaining !== 1 ? 's' : ''} to decide
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!isExpired && (
                    <div className="text-center text-gray-400 text-xs mb-4">
                        <p>You can review the full contract details or decline this offer.</p>
                        <p className="mt-1">If you don't decide within {weeksRemaining} weeks, the offer will be automatically withdrawn.</p>
                    </div>
                )}

                <div className="space-y-2">
                    {!isExpired && (
                        <>
                            <button
                                onClick={onViewContract}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                Review Contract Details
                            </button>
                            <button
                                onClick={onDecline}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Decline Offer
                            </button>
                        </>
                    )}
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        {isExpired ? 'Close' : 'Decide Later'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OffersModal;
