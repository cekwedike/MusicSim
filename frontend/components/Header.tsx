import React from 'react';
import { BriefcaseIcon, SaveIcon, BookIcon, ChartIcon, QuestionMarkIcon } from './icons/Icons';
import type { Difficulty } from '../types';
import { getDifficultyColor, getDifficultyIcon } from '../data/difficultySettings';

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
                <p className="text-gray-400 mt-1 text-sm md:text-base">A Business Simulation Game</p>
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