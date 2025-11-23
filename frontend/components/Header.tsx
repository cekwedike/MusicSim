import React, { useState, useEffect } from 'react';
import type { Difficulty } from '../types';
import { getDifficultyColor, getDifficultyIcon } from '../data/difficultySettings';
import { getAutosaveAge } from '../services/storageService';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export interface AutoSaveStatus {
    isInProgress: boolean;
    lastSaveTime: number | null;
    error: string | null;
}

interface HeaderProps {
    artistName?: string;
    difficulty?: Difficulty;
    onMenuClick?: () => void;
    showMenuButton?: boolean;
    autoSaveStatus?: AutoSaveStatus;
}


const Header: React.FC<HeaderProps> = ({ artistName, difficulty, onMenuClick, showMenuButton = false, autoSaveStatus }) => {
    const [autosaveAge, setAutosaveAge] = useState<number | null>(null);
    const [justSaved, setJustSaved] = useState(false);

    // Use new autosave status if provided, otherwise fall back to old system
    const isNewSystem = !!autoSaveStatus;

    useEffect(() => {
        if (isNewSystem) {
            // Use new autosave status
            if (autoSaveStatus?.lastSaveTime) {
                const ageMinutes = Math.floor((Date.now() - autoSaveStatus.lastSaveTime) / (1000 * 60));
                setAutosaveAge(ageMinutes);

                // Show "Saved!" indicator for new saves
                if (ageMinutes === 0) {
                    setJustSaved(true);
                    setTimeout(() => setJustSaved(false), 2000);
                }
            }
        } else {
            // Fall back to old system
            const updateAutosaveAge = () => {
                const age = getAutosaveAge();
                setAutosaveAge(age);
            };

            updateAutosaveAge();
            const interval = setInterval(updateAutosaveAge, 10000);
            return () => clearInterval(interval);
        }
    }, [isNewSystem, autoSaveStatus?.lastSaveTime]);

    // Show brief "Saved!" indicator when autosave happens (old system)
    useEffect(() => {
        if (!isNewSystem && autosaveAge === 0) {
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2000);
        }
    }, [autosaveAge, isNewSystem]);

    return (
        <header className="py-2 sm:py-3 px-4 sm:px-4 md:px-6 lg:px-8 text-center relative bg-primary/95 backdrop-blur-sm">
            {/* Mobile Menu Button */}
            {showMenuButton && (
                <button
                    onClick={onMenuClick}
                    className="absolute top-2 sm:top-3 right-2 sm:right-4 lg:hidden p-2 rounded-lg bg-[#2D1115]/60 hover:bg-[#3D1820]/70 border border-gray-600/50 hover:border-gray-500 text-gray-300 hover:text-white transition-all duration-200 z-10"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}

            {/* Autosave Indicator */}
            {artistName && (
                <div className="absolute top-2 sm:top-3 left-2 sm:left-4 flex items-center gap-1 sm:gap-2">
                    {/* Saving in Progress */}
                    {autoSaveStatus?.isInProgress && (
                        <div className="bg-blue-500/20 border border-blue-500 rounded-lg px-2 sm:px-3 py-1 text-blue-400 text-xs sm:text-sm animate-pulse">
                            Saving...
                        </div>
                    )}

                    {/* Save Success */}
                    {justSaved && (
                        <div className="bg-semantic-success/20 border border-semantic-success rounded-lg px-2 sm:px-3 py-1 text-semantic-success text-xs sm:text-sm animate-fade-in">
                            Saved
                        </div>
                    )}

                    {/* Save Error */}
                    {autoSaveStatus?.error && (
                        <div className="bg-semantic-error/20 border border-semantic-error rounded-lg px-2 sm:px-3 py-1 text-semantic-error text-xs sm:text-sm cursor-pointer"
                             title={`Save Error: ${autoSaveStatus.error}`}>
                            Save Failed
                        </div>
                    )}

                    {/* Last Save Time */}
                    {autosaveAge !== null && autosaveAge > 0 && !autoSaveStatus?.isInProgress && !autoSaveStatus?.error && (
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
