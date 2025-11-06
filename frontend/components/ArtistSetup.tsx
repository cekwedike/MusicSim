import React, { useState, useEffect } from 'react';
import type { Difficulty } from '../types';
import { difficultySettings, getDifficultyIcon } from '../data/difficultySettings';
import { useAuth } from '../contexts/AuthContext';

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
            <h2 className="text-3xl font-bold text-violet-300 mb-4">Create Your Artist</h2>
            <p className="text-gray-400 mb-8">Define your musical identity and choose your challenge level.</p>
            
            <form onSubmit={handleSubmit} className="w-full space-y-8">
                {/* Difficulty Selection */}
                <div>
                    <h3 className="text-xl font-bold text-gray-300 mb-4">Choose Difficulty</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(Object.keys(difficultySettings) as Difficulty[]).map((diffKey) => {
                            const settings = difficultySettings[diffKey];
                            const isSelected = difficulty === diffKey;
                            
                            return (
                                <div
                                    key={diffKey}
                                    onClick={() => setDifficulty(diffKey)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                                        isSelected 
                                            ? 'border-violet-500 bg-violet-500/10' 
                                            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">{getDifficultyIcon(diffKey)}</div>
                                        <h4 className={`text-lg font-bold mb-2 ${isSelected ? 'text-violet-300' : 'text-gray-300'}`}>
                                            {settings.name}
                                        </h4>
                                        <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                                            {settings.description}
                                        </p>
                                        <div className="text-xs text-gray-500 space-y-1">
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
                        <label htmlFor="artist-name" className="block text-left text-gray-300 font-medium mb-2">
                            Artist / Band Name
                            {isAuthenticated && (
                                <span className="text-xs text-violet-400 ml-2">(Using your account name)</span>
                            )}
                        </label>
                        <input
                            id="artist-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={isAuthenticated ? user?.username : "e.g., The Cosmic Drifters"}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                            required
                            readOnly={isAuthenticated}
                            title={isAuthenticated ? "Artist name is linked to your account username. Edit it in your profile settings." : "Enter your artist or band name"}
                        />
                        {isAuthenticated && (
                            <p className="text-xs text-gray-400 mt-1">
                                To change this, update your profile name in settings
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="artist-genre" className="block text-left text-gray-300 font-medium mb-2">Genre</label>
                        <input
                            id="artist-genre"
                            type="text"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            placeholder="e.g., Psychedelic Rock"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full max-w-md mx-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!name.trim() || !genre.trim()}
                >
                    Begin Journey ({difficultySettings[difficulty].name})
                </button>
            </form>
        </div>
    );
};

export default ArtistSetup;
