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
        <div className={`flex justify-between items-center p-2 rounded-md bg-gray-700/50`}>
            <span className="text-gray-300">{label}</span>
            <span className={`font-bold ${color}`}>{sign}{label === 'Cash' ? '$' : ''}{value.toLocaleString()}</span>
        </div>
    );
};

const OutcomeModal: React.FC<OutcomeModalProps> = ({ outcome, onClose }) => {
    const hasLesson = outcome.lesson;

    return (
        <div className="outcome-modal fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className={`bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 md:p-6 lg:p-8 w-full ${hasLesson ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
                <h3 className="text-xl md:text-2xl font-bold text-violet-300 mb-4">Outcome</h3>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm md:text-base">{outcome.text}</p>

                {/* Outcome voiceover player (play/replay) */}
                {outcome.audioFile && (
                    <div className="mb-4">
                        <AudioErrorBoundary>
                            <AudioPlayer audioSrc={outcome.audioFile} autoPlay={!!outcome.autoPlayAudio} />
                        </AudioErrorBoundary>
                    </div>
                )}

                <div className="space-y-2 mb-6">
                    <StatChange label="Cash" value={outcome.cash} />
                    <StatChange label="Fame" value={outcome.fame} />
                    <StatChange label="Hype" value={outcome.hype} />
                    <StatChange label="Well-Being" value={outcome.wellBeing} />
                    <StatChange label="Career Progress" value={outcome.careerProgress} />
                </div>

                {/* Educational Lesson Section */}
                {hasLesson && (
                    <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 mb-6 border border-blue-700">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🎓</span>
                            <h4 className="text-xl font-bold text-blue-200">{outcome.lesson.title}</h4>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Why this happened */}
                            <div>
                                <h5 className="font-semibold text-blue-300 mb-2">📚 Why This Happened:</h5>
                                <p className="text-blue-100 text-sm leading-relaxed">
                                    {outcome.lesson.explanation}
                                </p>
                            </div>

                            {/* Real world example */}
                            {outcome.lesson.realWorldExample && (
                                <div className="bg-blue-800/50 rounded-md p-3">
                                    <h5 className="font-semibold text-blue-300 mb-2">🌍 Real-World Example:</h5>
                                    <p className="text-blue-100 text-sm italic">
                                        {outcome.lesson.realWorldExample}
                                    </p>
                                </div>
                            )}

                            {/* Tip for future */}
                            <div className="bg-gradient-to-r from-yellow-800 to-orange-800 rounded-md p-3">
                                <h5 className="font-semibold text-yellow-200 mb-2">💡 Tip for Future:</h5>
                                <p className="text-yellow-100 text-sm">
                                    {outcome.lesson.tipForFuture}
                                </p>
                            </div>

                            {/* Concept taught link */}
                            {outcome.lesson.conceptTaught && (
                                <div className="text-center">
                                    <p className="text-blue-300 text-xs mb-1">
                                        📖 Learn more about this concept:
                                    </p>
                                    <span className="inline-block bg-purple-700 text-purple-200 px-3 py-1 rounded-full text-xs font-medium">
                                        {outcome.lesson.conceptTaught}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
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