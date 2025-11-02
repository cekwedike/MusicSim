import React, { useState, useEffect } from 'react';
import type { Difficulty } from '../types';
import { getDifficultyColor, getDifficultyIcon } from '../data/difficultySettings';
import { getAutosaveAge } from '../services/storageService';
import { Menu } from 'lucide-react';

interface HeaderProps {
    artistName?: string;
    difficulty?: Difficulty;
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}


const Header: React.FC<HeaderProps> = ({ artistName, difficulty, onMenuClick, showMenuButton = false }) => {
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
        <header className="py-4 px-4 sm:px-4 md:px-6 lg:px-8 text-center border-b border-gray-700/50 relative">
            {/* Hide title on mobile (< lg) */}
            <h1 className="hidden lg:block text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MusicSim
            </h1>
            {artistName ? (
                <div className="hidden lg:flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 md:gap-3 mt-1">
                    <p className="text-yellow-400 text-sm sm:text-base md:text-lg font-semibold tracking-wider truncate max-w-[200px] sm:max-w-none">Artist: {artistName}</p>
                    {difficulty && (
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(difficulty)} bg-gray-800/50 border border-current whitespace-nowrap`}
                            title={`Playing on ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty`}
                        >
                            {getDifficultyIcon(difficulty)} {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </span>
                    )}
                </div>
            ) : (
                <p className="hidden lg:block text-gray-400 mt-1 text-xs sm:text-sm md:text-base">A Music Business Simulation</p>
            )}

            {/* Autosave Indicator */}
            {artistName && (
                <div className="absolute top-3 sm:top-4 left-2 sm:left-4 flex items-center gap-1 sm:gap-2">
                    {justSaved && (
                        <div className="bg-green-500/20 border border-green-500 rounded-lg px-2 sm:px-3 py-1 text-green-300 text-xs sm:text-sm animate-fade-in">
                            Saved
                        </div>
                    )}

                    {autosaveAge !== null && autosaveAge > 0 && (
                        <div className={`text-xs sm:text-sm ${autosaveAge >= 8 ? 'text-yellow-400' : 'text-gray-400'} hidden sm:block`}>
                            Autosave: {autosaveAge}m ago
                        </div>
                    )}
                </div>
            )}

            {/* Mobile Menu Button */}
            {showMenuButton && (
                <button
                    id="mobile-menu-button"
                    onClick={onMenuClick}
                    className="absolute top-3 sm:top-4 right-2 sm:right-4 lg:hidden p-2 rounded-lg bg-gray-800/80 border border-gray-700 hover:bg-gray-700 transition-colors z-10"
                    aria-label="Toggle menu"
                >
                    <Menu className="w-5 h-5 text-gray-300" />
                </button>
            )}
        </header>
    );
};

export default Header;