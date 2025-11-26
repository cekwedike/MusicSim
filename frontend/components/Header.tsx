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

    // Update autosave age and brief saved indicator when lastSaveTime changes
    useEffect(() => {
        if (!isNewSystem) {
            setAutosaveAge(null);
            return;
        }

        if (autoSaveStatus?.lastSaveTime != null) {
            setAutosaveAge(getAutosaveAge());

            // briefly show "Saved" indicator when a new save timestamp appears
            setJustSaved(true);
            const t = setTimeout(() => setJustSaved(false), 2000);
            return () => clearTimeout(t);
        } else {
            setAutosaveAge(null);
        }
    }, [isNewSystem, autoSaveStatus?.lastSaveTime]);

    return (
        <header className="py-2 sm:py-3 px-4 sm:px-4 md:px-6 lg:px-8 text-center bg-gradient-to-r from-red-900 via-rose-900 to-red-900 relative backdrop-blur-sm">
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
                <h1 className="text-lg sm:text-xl font-bold text-white drop-shadow">MusicSim</h1>
            </div>

            {/* Autosave / status overlay for the new system */}
            {isNewSystem && (
                <div className="absolute top-2 sm:top-3 left-2 sm:left-4 flex items-center gap-1 sm:gap-2">
                    {/* Saving in Progress */}
                    {autoSaveStatus?.isInProgress && (
                        <div className="bg-blue-500/20 border border-blue-500 rounded-lg px-2 sm:px-3 py-1 text-blue-400 text-xs sm:text-sm animate-pulse">
                            Saving...
                        </div>
                    )}

                    {/* Save Success */}
                    {justSaved && !autoSaveStatus?.isInProgress && (
                        <div className="bg-semantic-success/20 border border-semantic-success rounded-lg px-2 sm:px-3 py-1 text-semantic-success text-xs sm:text-sm animate-fade-in">
                            Saved
                        </div>
                    )}

                    {/* Save Error */}
                    {autoSaveStatus?.error && (
                        <div
                            className="bg-semantic-error/20 border border-semantic-error rounded-lg px-2 sm:px-3 py-1 text-semantic-error text-xs sm:text-sm cursor-pointer"
                            title={`Save Error: ${autoSaveStatus.error}`}
                        >
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
