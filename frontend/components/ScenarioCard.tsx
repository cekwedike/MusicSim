import React from 'react';
import type { Scenario, Choice } from '../types';

interface ScenarioCardProps {
    scenario: Scenario;
    onChoiceSelect: (choice: Choice) => void;
    disabled: boolean;
}

const ChoiceButton: React.FC<{ choice: Choice; onClick: () => void; disabled: boolean }> = ({ choice, onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full text-left p-4 bg-gray-700 hover:bg-violet-600 border border-gray-600 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
            <p className="font-semibold">{choice.text}</p>
        </button>
    );
};

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onChoiceSelect, disabled }) => {
    return (
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-violet-300 mb-4">{scenario.title}</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">{scenario.description}</p>
            <div className="space-y-4">
                {scenario.choices.map((choice, index) => (
                    <ChoiceButton 
                        key={index} 
                        choice={choice} 
                        onClick={() => onChoiceSelect(choice)}
                        disabled={disabled}
                    />
                ))}
            </div>
        </div>
    );
};

export default ScenarioCard;
