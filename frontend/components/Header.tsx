import React, { useState, useEffect } from 'react';
import type { Difficulty } from '../types';
import { getDifficultyColor, getDifficultyIcon } from '../data/difficultySettings';
import { getAutosaveAge } from '../services/storageService';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

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
        <header className="py-2 sm:py-3 px-4 sm:px-4 md:px-6 lg:px-8 text-center border-b border-default/50 relative bg-primary/95 backdrop-blur-sm">
            {/* Mobile Menu Button */}
            {showMenuButton && (
                <button
                    onClick={onMenuClick}
                    className="absolute top-2 sm:top-3 right-2 sm:right-4 lg:hidden p-2 rounded-lg bg-gray-800/60 hover:bg-gray-700/70 border border-gray-600/50 hover:border-gray-500 text-gray-300 hover:text-white transition-all duration-200 z-10"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}

            {/* Mobile Header - Show on small screens */}
            <div className="lg:hidden flex items-center justify-center">
                <h1 className="text-lg sm:text-xl font-bold text-gradient">
                    MusicSim
                </h1>
            </div>

            {/* Desktop Header - Show on large screens */}
            <h1 className="hidden lg:block text-lg sm:text-xl md:text-2xl font-bold text-gradient">
                MusicSim
            </h1>
            {artistName ? (
                <div className="hidden lg:flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 md:gap-2 mt-0.5">
                    <p className="text-status-fame text-xs sm:text-sm md:text-base font-semibold tracking-wider truncate max-w-[200px] sm:max-w-none">Artist: {artistName}</p>
                    {difficulty && (
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(difficulty)} bg-secondary/50 border border-current whitespace-nowrap`}
                            title={`Playing on ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty`}
                        >
                            {getDifficultyIcon(difficulty)} {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </span>
                    )}
                </div>
            ) : (
                <p className="hidden lg:block text-muted mt-0.5 text-xs sm:text-sm md:text-sm">A Music Business Simulation</p>
            )}

            {/* Autosave Indicator */}
            {artistName && (
                <div className="absolute top-2 sm:top-3 left-2 sm:left-4 flex items-center gap-1 sm:gap-2">
                    {justSaved && (
                        <div className="bg-semantic-success/20 border border-semantic-success rounded-lg px-2 sm:px-3 py-1 text-semantic-success text-xs sm:text-sm animate-fade-in">
                            Saved
                        </div>
                    )}

                    {autosaveAge !== null && autosaveAge > 0 && (
                        <div className={`text-xs sm:text-sm ${autosaveAge >= 8 ? 'text-semantic-warning' : 'text-muted'} hidden sm:block`}>
                            Autosave: {autosaveAge}m ago
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
