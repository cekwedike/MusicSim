import React, { useState } from 'react';
import type { Scenario, Choice, Difficulty } from '../types';
import { getDifficultySettings } from '../data/difficultySettings';

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
            className="w-full text-left p-4 bg-gray-700 hover:bg-violet-600 border border-gray-600 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative"
        >
            <p className="font-semibold pr-8">{choice.text}</p>
            {hint && (
                <div 
                    className={`absolute top-4 right-4 w-3 h-3 rounded-full ${getHintColor(hint)}`}
                    title={getHintTooltip(hint)}
                />
            )}
        </button>
    );
};

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onChoiceSelect, disabled, difficulty }) => {
    const [showHints, setShowHints] = useState(true);
    const settings = getDifficultySettings(difficulty);
    const hintsAvailable = settings.scenarioHints;
    
    return (
        <div className="scenario-card bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-violet-300 mb-4">{scenario.title}</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">{scenario.description}</p>
            
            {hintsAvailable && (
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Safe
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            Risky
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            Dangerous
                        </span>
                    </div>
                    <button
                        onClick={() => setShowHints(!showHints)}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        {showHints ? 'Hide Hints' : 'Show Hints'}
                    </button>
                </div>
            )}
            
            <div className="choice-buttons space-y-4">
                {scenario.choices.map((choice, index) => (
                    <ChoiceButton 
                        key={index} 
                        choice={choice} 
                        onClick={() => onChoiceSelect(choice)}
                        disabled={disabled}
                        showHints={hintsAvailable && showHints}
                    />
                ))}
            </div>
        </div>
    );
};

export default ScenarioCard;
