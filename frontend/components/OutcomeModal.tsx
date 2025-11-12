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
    const color = isPositive ? 'text-semantic-success' : 'text-semantic-error';
    const sign = isPositive ? '+' : '';

    return (
        <div className={`flex justify-between items-center p-2 sm:p-3 rounded-md bg-secondary/50`}>
            <span className="text-secondary text-xs sm:text-sm md:text-base">{label}</span>
            <span className={`font-bold ${color} text-xs sm:text-sm md:text-base`}>{sign}{label === 'Cash' ? '$' : ''}{value.toLocaleString()}</span>
        </div>
    );
};

const OutcomeModal: React.FC<OutcomeModalProps> = ({ outcome, onClose }) => {
    const hasLesson = outcome.lesson;

    return (
        <div className="outcome-modal modal-overlay flex items-center justify-center p-4 z-[60] animate-fade-in">
            <div className={`modal-content ${hasLesson ? 'max-w-2xl' : 'max-w-md'} max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-5 md:p-6 lg:p-8 w-full`}>
                <h3 className="text-base sm:text-lg md:text-2xl font-bold text-brand-primary mb-3 sm:mb-4">Outcome</h3>
                <p className="text-secondary mb-4 sm:mb-6 leading-relaxed text-sm md:text-base">{outcome.text}</p>

                {/* Outcome voiceover player (play/replay) */}
                {outcome.audioFile && (
                    <div className="mb-3 sm:mb-4">
                        <AudioErrorBoundary>
                            <AudioPlayer audioSrc={outcome.audioFile} autoPlay={!!outcome.autoPlayAudio} />
                        </AudioErrorBoundary>
                    </div>
                )}

                <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                    <StatChange label="Cash" value={outcome.cash} />
                    <StatChange label="Fame" value={outcome.fame} />
                    <StatChange label="Hype" value={outcome.hype} />
                    <StatChange label="Well-Being" value={outcome.wellBeing} />
                    <StatChange label="Career Progress" value={outcome.careerProgress} />
                </div>

                {/* Educational Lesson Section */}
                {hasLesson && (
                    <div className="bg-gradient-to-r from-semantic-info/20 to-brand-primary/20 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-semantic-info/30">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <h4 className="text-sm sm:text-base md:text-xl font-bold text-semantic-info">{outcome.lesson.title}</h4>
                        </div>

                        <div className="space-y-2 sm:space-y-3 md:space-y-4">
                            {/* Why this happened */}
                            <div>
                                <h5 className="font-semibold text-semantic-info mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Why This Happened:</h5>
                                <p className="text-primary text-xs sm:text-sm leading-relaxed">
                                    {outcome.lesson.explanation}
                                </p>
                            </div>

                            {/* Real world example - hidden on mobile */}
                            {outcome.lesson.realWorldExample && (
                                <div className="hidden sm:block bg-secondary/50 rounded-md p-2 sm:p-3">
                                    <h5 className="font-semibold text-semantic-info mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Real-World Example:</h5>
                                    <p className="text-secondary text-xs sm:text-sm italic">
                                        {outcome.lesson.realWorldExample}
                                    </p>
                                </div>
                            )}

                            {/* Tip for future */}
                            <div className="bg-gradient-to-r from-semantic-warning/20 to-brand-secondary/20 rounded-md p-2 sm:p-3 border border-semantic-warning/30">
                                <h5 className="font-semibold text-semantic-warning mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Tip for Future:</h5>
                                <p className="text-primary text-xs sm:text-sm">
                                    {outcome.lesson.tipForFuture}
                                </p>
                            </div>

                            {/* Concept taught link */}
                            {outcome.lesson.conceptTaught && (
                                <div className="text-center">
                                    <p className="text-semantic-info text-xs mb-1">
                                        Learn more about this concept:
                                    </p>
                                    <span className="inline-block bg-brand-highlight/20 text-brand-highlight px-2 sm:px-3 py-1 rounded-full text-xs font-medium border border-brand-highlight/30">
                                        {outcome.lesson.conceptTaught}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <button
                    onClick={onClose}
                    className="btn-primary w-full text-base sm:text-base min-h-[48px]"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default OutcomeModal;