import React, { useState, useEffect } from 'react';
import type { Scenario, Choice, Difficulty } from '../types';
import { getDifficultySettings } from '../data/difficultySettings';
import { AudioPlayer } from '../src/components/AudioPlayer';
import AudioErrorBoundary from './AudioErrorBoundary';

interface ScenarioCardProps {
    scenario: Scenario;
    onChoiceSelect: (choice: Choice) => void;
    disabled: boolean;
    difficulty: Difficulty;
}

// Helper function to get hint for a choice
const getChoiceHint = (choice: Choice): 'safe' | 'risky' | 'dangerous' => {
    const outcome = choice.outcome;
    let score = 0;
    
    // Calculate overall impact score
    score += outcome.cash / 100; // Normalize cash impact
    score += outcome.fame * 2; // Fame is important
    score += outcome.wellBeing * 1.5; // Well-being is critical
    score += outcome.careerProgress * 3; // Career progress is very important
    score += outcome.hype * 1; // Hype is nice but not critical
    
    // Check for major negative impacts
    if (outcome.cash < -1000 || outcome.wellBeing < -15 || outcome.fame < -8) {
        return 'dangerous';
    }
    
    if (score > 5) return 'safe';
    if (score > -5) return 'risky';
    return 'dangerous';
};

const getHintColor = (hint: 'safe' | 'risky' | 'dangerous'): string => {
    switch (hint) {
        case 'safe': return 'bg-green-500';
        case 'risky': return 'bg-yellow-500';
        case 'dangerous': return 'bg-red-500';
    }
};

const getHintTooltip = (hint: 'safe' | 'risky' | 'dangerous'): string => {
    switch (hint) {
        case 'safe': return 'Generally safe choice with positive or minimal negative outcomes';
        case 'risky': return 'Mixed outcomes - could pay off but has risks';
        case 'dangerous': return 'Likely to hurt your career significantly';
    }
};

const ChoiceButton: React.FC<{
    choice: Choice;
    onClick: () => void;
    disabled: boolean;
    showHints: boolean;
}> = ({ choice, onClick, disabled, showHints }) => {
    const hint = showHints ? getChoiceHint(choice) : null;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full text-left p-3 sm:p-4 bg-gray-700 hover:bg-violet-600 border border-gray-600 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] sm:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative min-h-[44px] sm:min-h-[56px]"
        >
            <p className="font-semibold pr-8 sm:pr-8 text-sm sm:text-base leading-relaxed">{choice.text}</p>
            {hint && (
                <div
                    className={`absolute top-3 sm:top-4 right-3 sm:right-4 w-3 h-3 sm:w-3 sm:h-3 rounded-full ${getHintColor(hint)}`}
                    title={getHintTooltip(hint)}
                />
            )}
        </button>
    );
};

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onChoiceSelect, disabled, difficulty }) => {
    const [showHints, setShowHints] = useState(true);
    const [showAudio, setShowAudio] = useState(true);
    const settings = getDifficultySettings(difficulty);
    const hintsAvailable = settings.scenarioHints;

    useEffect(() => {
        // Reset audio visibility when scenario changes
        setShowAudio(true);
    }, [scenario.title]);

    return (
        <div className="scenario-card bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl p-3 sm:p-6 md:p-8 w-full max-w-2xl animate-fade-in">
            <h2 className="text-base sm:text-2xl md:text-3xl font-bold text-violet-300 mb-2 sm:mb-4 leading-tight">{scenario.title}</h2>
            {/* Scenario voice-over player (if provided) */}
            {scenario.audioFile && showAudio && (
                <div className="mb-3 sm:mb-5">
                    <AudioErrorBoundary>
                        <AudioPlayer audioSrc={scenario.audioFile} autoPlay={!!scenario.autoPlayAudio} />
                    </AudioErrorBoundary>
                </div>
            )}
            <p className="text-gray-300 mb-3 sm:mb-6 leading-relaxed text-sm sm:text-base">{scenario.description}</p>

            {hintsAvailable && (
                <div className="mb-2 sm:mb-4 hidden sm:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
                            Safe
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500"></div>
                            Risky
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500"></div>
                            Dangerous
                        </span>
                    </div>
                    <button
                        onClick={() => setShowHints(!showHints)}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors whitespace-nowrap"
                    >
                        {showHints ? 'Hide Hints' : 'Show Hints'}
                    </button>
                </div>
            )}

            <div className="choice-buttons space-y-2 sm:space-y-4 mt-1">
                {scenario.choices.map((choice, index) => (
                    <ChoiceButton
                        key={index}
                        choice={choice}
                        onClick={() => {
                            // stop scenario audio immediately when user makes a choice
                            setShowAudio(false);
                            onChoiceSelect(choice);
                        }}
                        disabled={disabled}
                        showHints={hintsAvailable && showHints}
                    />
                ))}
            </div>
        </div>
    );
};

export default ScenarioCard;
