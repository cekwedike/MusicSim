import React from 'react';
import { BriefcaseIcon, SaveIcon, BookIcon, ChartIcon, QuestionMarkIcon } from './icons/Icons';

interface HeaderProps {
    artistName?: string;
    onShowManagementHub: () => void;
    onShowSaveLoad: () => void;
    onShowLearningHub: () => void;
    onShowStatistics: () => void;
    onStartTutorial: () => void;
    hasUnseenAchievements: boolean;
}


const Header: React.FC<HeaderProps> = ({ artistName, onShowManagementHub, onShowSaveLoad, onShowLearningHub, onShowStatistics, onStartTutorial, hasUnseenAchievements }) => {
    return (
        <header className="py-4 px-6 md:px-8 text-center border-b border-gray-700/50 relative">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MusicSim
            </h1>
            {artistName ? (
                <p className="text-yellow-400 mt-2 text-lg font-semibold tracking-wider">Artist: {artistName}</p>
            ) : (
                <p className="text-gray-400 mt-1">A Business Simulation Game</p>
            )}

            {artistName && (
                <div className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 flex gap-2">
                    <button 
                        onClick={onShowLearningHub}
                        className="learning-button text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
                        aria-label="Learning Hub"
                    >
                        <BookIcon />
                    </button>
                    
                    <button 
                        onClick={onStartTutorial}
                        className="tutorial-button text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
                        aria-label="Tutorial"
                    >
                        <QuestionMarkIcon />
                    </button>
                    
                    <button 
                        onClick={onShowStatistics}
                        className="stats-button text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
                        aria-label="Career Statistics"
                    >
                        <ChartIcon />
                    </button>
                    
                    <button 
                        onClick={onShowSaveLoad}
                        className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
                        aria-label="Save/Load Game"
                    >
                        <SaveIcon />
                    </button>
                    
                    <button 
                        onClick={onShowManagementHub}
                        className="achievements-button management-button text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700 relative"
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