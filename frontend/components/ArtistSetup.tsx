import React, { useState } from 'react';

interface ArtistSetupProps {
    onSubmit: (name: string, genre: string) => void;
}

const ArtistSetup: React.FC<ArtistSetupProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [genre, setGenre] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && genre.trim()) {
            onSubmit(name.trim(), genre.trim());
        }
    };

    return (
        <div className="text-center p-8 flex flex-col items-center justify-center h-full animate-fade-in max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-violet-300 mb-4">Create Your Artist</h2>
            <p className="text-gray-400 mb-8">Define your musical identity to begin your journey to stardom.</p>
            
            <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div>
                    <label htmlFor="artist-name" className="block text-left text-gray-300 font-medium mb-2">Artist / Band Name</label>
                    <input
                        id="artist-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., The Cosmic Drifters"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                        required
                    />
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

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!name.trim() || !genre.trim()}
                >
                    Begin Journey
                </button>
            </form>
        </div>
    );
};

export default ArtistSetup;
