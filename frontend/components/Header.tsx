import React, { useState, useEffect } from 'react';
import { BriefcaseIcon, SaveIcon, BookIcon, ChartIcon, QuestionMarkIcon } from './icons/Icons';
import type { Difficulty } from '../types';
import { getDifficultyColor, getDifficultyIcon } from '../data/difficultySettings';
import { getAutosaveAge } from '../services/storageService';

interface HeaderProps {
    artistName?: string;
    onShowManagementHub: () => void;
    onShowSaveLoad: () => void;
    onShowLearningHub: () => void;
    onShowStatistics: () => void;
    onStartTutorial: () => void;
    hasUnseenAchievements: boolean;
    difficulty?: Difficulty;
}


const Header: React.FC<HeaderProps> = ({ artistName, onShowManagementHub, onShowSaveLoad, onShowLearningHub, onShowStatistics, onStartTutorial, hasUnseenAchievements, difficulty }) => {
    const [autosaveAge, setAutosaveAge] = useState<number | null>(null);
    const [justSaved, setJustSaved] = useState(false);

    useEffect(() => {
        const updateAutosaveAge = () => {
            const age = getAutosaveAge();
            setAutosaveAge(age);
        };
        
        updateAutosaveAge();
        const interval = setInterval(updateAutosaveAge, 10000);
        return () => clearInterval(interval);
    }, []);

    // Show brief "Saved!" indicator when autosave happens
    useEffect(() => {
        if (autosaveAge === 0) {
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2000);
        }
    }, [autosaveAge]);

    return (
        <header className="py-4 px-4 md:px-6 lg:px-8 text-center border-b border-gray-700/50 relative">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MusicSim
            </h1>
            {artistName ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-1">
                    <p className="text-yellow-400 text-base md:text-lg font-semibold tracking-wider">Artist: {artistName}</p>
                    {difficulty && (
                        <span 
                            className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(difficulty)} bg-gray-800/50 border border-current`}
                            title={`Playing on ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty`}
                        >
                            {getDifficultyIcon(difficulty)} {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </span>
                    )}
                </div>
            ) : (
                <p className="text-gray-400 mt-1 text-sm md:text-base">A Music Business Simulation</p>
            )}

            {/* Autosave Indicator */}
            {artistName && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    {justSaved && (
                        <div className="bg-green-500/20 border border-green-500 rounded-lg px-3 py-1 text-green-300 text-sm animate-fade-in">
                            ✓ Saved
                        </div>
                    )}
                    
                    {autosaveAge !== null && autosaveAge > 0 && (
                        <div className={`text-sm ${autosaveAge >= 8 ? 'text-yellow-400' : 'text-gray-400'}`}>
                            Autosave: {autosaveAge}m ago
                            {autosaveAge >= 8 && ' ⚠️'}
                        </div>
                    )}
                </div>
            )}

            {artistName && (
                <div className="absolute top-1/2 right-2 md:right-4 lg:right-6 -translate-y-1/2 flex gap-1 md:gap-2">
                    <button 
                        onClick={onShowLearningHub}
                        className="learning-button text-gray-400 hover:text-white transition-colors duration-200 p-1.5 md:p-2 rounded-full hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Learning Hub"
                    >
                        <BookIcon />
                    </button>
                    
                    <button 
                        onClick={onStartTutorial}
                        className="tutorial-button text-gray-400 hover:text-white transition-colors duration-200 p-1.5 md:p-2 rounded-full hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Tutorial"
                    >
                        <QuestionMarkIcon />
                    </button>
                    
                    <button 
                        onClick={onShowStatistics}
                        className="stats-button text-gray-400 hover:text-white transition-colors duration-200 p-1.5 md:p-2 rounded-full hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Career Statistics"
                    >
                        <ChartIcon />
                    </button>
                    
                    <button 
                        onClick={onShowSaveLoad}
                        className="text-gray-400 hover:text-white transition-colors duration-200 p-1.5 md:p-2 rounded-full hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Save/Load Game"
                    >
                        <SaveIcon />
                    </button>
                    
                    <button 
                        onClick={onShowManagementHub}
                        className="achievements-button management-button text-gray-400 hover:text-white transition-colors duration-200 p-1.5 md:p-2 rounded-full hover:bg-gray-700 relative min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Show Management Hub"
                    >
                        <BriefcaseIcon />
                        {hasUnseenAchievements && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        )}
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;