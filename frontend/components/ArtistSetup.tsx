import React, { useState, useEffect } from 'react';
import type { Difficulty } from '../types';
import { difficultySettings, getDifficultyIcon } from '../data/difficultySettings';
import { useAuth } from '../contexts/AuthContext';
import { MUSIC_GENRES } from '../constants/genres';

interface ArtistSetupProps {
    onSubmit: (name: string, genre: string, difficulty: Difficulty) => void;
}

const ArtistSetup: React.FC<ArtistSetupProps> = ({ onSubmit }) => {
    const { user, isAuthenticated } = useAuth();
    const [name, setName] = useState('');
    const [genre, setGenre] = useState('');
    const [difficulty, setDifficulty] = useState<Difficulty>('realistic');

    // Pre-populate artist name with username when user is authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            const defaultName = user.username;
            setName(defaultName);
        }
    }, [isAuthenticated, user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && genre.trim()) {
            onSubmit(name.trim(), genre.trim(), difficulty);
        }
    };

    return (
        <div className="text-center p-8 flex flex-col items-center justify-center h-full animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-brand-primary mb-4">Create Your Artist</h2>
            <p className="text-muted mb-8">Define your musical identity and choose your challenge level.</p>
            
            <form onSubmit={handleSubmit} className="w-full space-y-8">
                {/* Difficulty Selection */}
                <div>
                    <h3 className="text-xl font-bold text-primary mb-4">Choose Difficulty</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(Object.keys(difficultySettings) as Difficulty[]).map((diffKey) => {
                            const settings = difficultySettings[diffKey];
                            const isSelected = difficulty === diffKey;
                            
                            return (
                                <div
                                    key={diffKey}
                                    onClick={() => setDifficulty(diffKey)}
                                    className={`card transition-all duration-200 hover:scale-105 cursor-pointer ${
                                        isSelected 
                                            ? 'border-brand-primary bg-brand-primary/10 shadow-theme-lg' 
                                            : 'hover:border-brand-primary/50'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">{getDifficultyIcon(diffKey)}</div>
                                        <h4 className={`text-lg font-bold mb-2 ${isSelected ? 'text-brand-primary' : 'text-primary'}`}>
                                            {settings.name}
                                        </h4>
                                        <p className="text-sm text-muted mb-3 line-clamp-3">
                                            {settings.description}
                                        </p>
                                        <div className="text-xs text-disabled space-y-1">
                                            <div>Starting: ${settings.startingCash.toLocaleString()}</div>
                                            <div>Grace: {settings.gracePeriodWeeks} weeks</div>
                                            <div>Hints: {settings.scenarioHints ? 'Yes' : 'No'}</div>
                                            <div>Forgiving: {settings.mistakeForgiveness ? 'Yes' : 'No'}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Artist Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <div>
                        <label htmlFor="artist-name" className="block text-left text-primary font-medium mb-2">
                            Artist / Band Name
                            {isAuthenticated && (
                                <span className="text-xs text-brand-primary ml-2">(Using your account name)</span>
                            )}
                        </label>
                        <input
                            id="artist-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={isAuthenticated ? user?.username : "e.g., The Cosmic Drifters"}
                            className="w-full p-3 bg-overlay border border-input rounded-lg text-primary placeholder:text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                            required
                            readOnly={isAuthenticated}
                            title={isAuthenticated ? "Artist name is linked to your account username. Edit it in your profile settings." : "Enter your artist or band name"}
                        />
                        {isAuthenticated && (
                            <p className="text-xs text-muted mt-1">
                                To change this, update your profile name in settings
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="artist-genre" className="block text-left text-primary font-medium mb-2">Genre</label>
                        <select
                            id="artist-genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="w-full p-3 bg-overlay border border-input rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                            required
                        >
                            <option value="">Select a genre...</option>
                            {MUSIC_GENRES.map((g) => (
                                <option key={g.value} value={g.value}>
                                    {g.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full max-w-md mx-auto font-bold py-3 px-8 rounded-full shadow-theme-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!name.trim() || !genre.trim()}
                >
                    Begin Journey ({difficultySettings[difficulty].name})
                </button>
            </form>
        </div>
    );
};

export default ArtistSetup;
