import React from 'react';
import type { ChoiceOutcome } from '../types';

interface OutcomeModalProps {
    outcome: ChoiceOutcome;
    onClose: () => void;
}

const StatChange: React.FC<{ label: string, value: number }> = ({ label, value }) => {
    if (value === 0) return null;
    const isPositive = value > 0;
    const color = isPositive ? 'text-green-400' : 'text-red-400';
    const sign = isPositive ? '+' : '';

    return (
        <div className={`flex justify-between items-center p-2 rounded-md bg-gray-700/50`}>
            <span className="text-gray-300">{label}</span>
            <span className={`font-bold ${color}`}>{sign}{label === 'Cash' ? '$' : ''}{value.toLocaleString()}</span>
        </div>
    );
};

const OutcomeModal: React.FC<OutcomeModalProps> = ({ outcome, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md">
                <h3 className="text-2xl font-bold text-violet-300 mb-4">Outcome</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{outcome.text}</p>

                <div className="space-y-2 mb-6">
                    <StatChange label="Cash" value={outcome.cash} />
                    <StatChange label="Fame" value={outcome.fame} />
                    <StatChange label="Hype" value={outcome.hype} />
                    <StatChange label="Well-Being" value={outcome.wellBeing} />
                    <StatChange label="Career Progress" value={outcome.careerProgress} />
                </div>
                
                <button
                    onClick={onClose}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default OutcomeModal;