import React, { useState, useEffect } from 'react';
import type { Difficulty } from '../types';
import { getDifficultyColor, getDifficultyIcon } from '../data/difficultySettings';
import { getAutosaveAge } from '../services/storageService';
import AudioControls from './AudioControls';

interface HeaderProps {
    artistName?: string;
    difficulty?: Difficulty;
}


const Header: React.FC<HeaderProps> = ({ artistName, difficulty }) => {
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
        <header className="py-3 px-2 sm:px-4 md:px-6 lg:px-8 text-center border-b border-gray-700/50 relative">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MusicSim
            </h1>
            {artistName ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 md:gap-3 mt-1">
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
                <p className="text-gray-400 mt-1 text-xs sm:text-sm md:text-base">A Music Business Simulation</p>
            )}

            {/* Autosave Indicator */}
            {artistName && (
                <div className="absolute top-2 sm:top-4 left-1 sm:left-4 flex items-center gap-1 sm:gap-2">
                    {justSaved && (
                        <div className="bg-green-500/20 border border-green-500 rounded-lg px-2 sm:px-3 py-1 text-green-300 text-xs sm:text-sm animate-fade-in">
                            ✓ Saved
                        </div>
                    )}

                    {autosaveAge !== null && autosaveAge > 0 && (
                        <div className={`text-xs sm:text-sm ${autosaveAge >= 8 ? 'text-yellow-400' : 'text-gray-400'} hidden sm:block`}>
                            Autosave: {autosaveAge}m ago
                            {autosaveAge >= 8 && ' ⚠️'}
                        </div>
                    )}
                </div>
            )}

            {artistName && (
                <div className="absolute top-1/2 right-20 -translate-y-1/2">
                    <AudioControls />
                </div>
            )}
        </header>
    );
};

export default Header;