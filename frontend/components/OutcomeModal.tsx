import React from 'react';
import type { ChoiceOutcome } from '../types';
import { AudioPlayer } from '../src/components/AudioPlayer';
import AudioErrorBoundary from './AudioErrorBoundary';

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
        <div className={`flex justify-between items-center p-1.5 sm:p-2 rounded-md bg-gray-700/50`}>
            <span className="text-gray-300 text-xs sm:text-sm">{label}</span>
            <span className={`font-bold ${color} text-xs sm:text-sm`}>{sign}{label === 'Cash' ? '$' : ''}{value.toLocaleString()}</span>
        </div>
    );
};

const OutcomeModal: React.FC<OutcomeModalProps> = ({ outcome, onClose }) => {
    const hasLesson = outcome.lesson;

    return (
        <div className="outcome-modal fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-3 sm:p-4 z-[60] animate-fade-in">
            <div className={`bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-3 sm:p-4 w-full ${hasLesson ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
                <h3 className="text-base sm:text-lg font-bold text-red-300 mb-2">Outcome</h3>
                <p className="text-gray-300 mb-2.5 sm:mb-3 leading-snug text-sm sm:text-base">{outcome.text}</p>

                {/* Outcome voiceover player (play/replay) */}
                {outcome.audioFile && (
                    <div className="mb-2">
                        <AudioErrorBoundary>
                            <AudioPlayer audioSrc={outcome.audioFile} autoPlay={!!outcome.autoPlayAudio} />
                        </AudioErrorBoundary>
                    </div>
                )}

                <div className="space-y-1 sm:space-y-1.5 mb-3">
                    <StatChange label="Cash" value={outcome.cash} />
                    <StatChange label="Fame" value={outcome.fame} />
                    <StatChange label="Hype" value={outcome.hype} />
                    <StatChange label="Well-Being" value={outcome.wellBeing} />
                    <StatChange label="Career Progress" value={outcome.careerProgress} />
                </div>

                {/* Educational Lesson Section */}
                {hasLesson && (
                    <div className="bg-gradient-to-r from-blue-900 to-red-900 rounded-lg p-2.5 sm:p-3 mb-3 border border-blue-700">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                            <h4 className="text-sm sm:text-base font-bold text-blue-200">{outcome.lesson.title}</h4>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                            {/* Why this happened */}
                            <div>
                                <h5 className="font-semibold text-blue-300 mb-1 text-xs sm:text-sm">Why This Happened:</h5>
                                <p className="text-blue-100 text-xs sm:text-sm leading-snug">
                                    {outcome.lesson.explanation}
                                </p>
                            </div>

                            {/* Real world example - hidden on mobile */}
                            {outcome.lesson.realWorldExample && (
                                <div className="hidden sm:block bg-blue-800/50 rounded-md p-2">
                                    <h5 className="font-semibold text-blue-300 mb-1 text-xs sm:text-sm">Real-World Example:</h5>
                                    <p className="text-blue-100 text-xs sm:text-sm italic leading-snug">
                                        {outcome.lesson.realWorldExample}
                                    </p>
                                </div>
                            )}

                            {/* Tip for future */}
                            <div className="bg-gradient-to-r from-yellow-800 to-orange-800 rounded-md p-2">
                                <h5 className="font-semibold text-yellow-200 mb-1 text-xs sm:text-sm">Tip for Future:</h5>
                                <p className="text-yellow-100 text-xs sm:text-sm leading-snug">
                                    {outcome.lesson.tipForFuture}
                                </p>
                            </div>

                            {/* Concept taught link */}
                            {outcome.lesson.conceptTaught && (
                                <div className="text-center">
                                    <p className="text-blue-300 text-xs mb-1">
                                        Learn more about this concept:
                                    </p>
                                    <span className="inline-block bg-red-700 text-red-200 px-2 py-0.5 rounded-full text-xs font-medium">
                                        {outcome.lesson.conceptTaught}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base min-h-[44px]"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default OutcomeModal;
