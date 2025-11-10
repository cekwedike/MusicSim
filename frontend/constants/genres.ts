/**
 * Music Genre Options
 * Includes Nigerian, Rwandan, and popular international genres
 */

export const MUSIC_GENRES = [
  // Nigerian Genres
  { value: 'afrobeats', label: 'Afrobeats', region: 'Nigerian' },
  { value: 'afropop', label: 'Afropop', region: 'Nigerian' },
  { value: 'highlife', label: 'Highlife', region: 'Nigerian' },
  { value: 'juju', label: 'Juju', region: 'Nigerian' },
  { value: 'fuji', label: 'Fuji', region: 'Nigerian' },
  { value: 'apala', label: 'Apala', region: 'Nigerian' },

  // Rwandan Genres
  { value: 'afrobeat-rwanda', label: 'Rwandan Afrobeat', region: 'Rwandan' },
  { value: 'traditional-rwanda', label: 'Rwandan Traditional', region: 'Rwandan' },
  { value: 'gospel-rwanda', label: 'Rwandan Gospel', region: 'Rwandan' },

  // Pan-African
  { value: 'afro-fusion', label: 'Afro-Fusion', region: 'African' },
  { value: 'afro-soul', label: 'Afro-Soul', region: 'African' },
  { value: 'afro-jazz', label: 'Afro-Jazz', region: 'African' },

  // International Popular
  { value: 'hip-hop', label: 'Hip-Hop', region: 'International' },
  { value: 'pop', label: 'Pop', region: 'International' },
  { value: 'rnb', label: 'R&B', region: 'International' },
  { value: 'reggae', label: 'Reggae', region: 'International' },
  { value: 'dancehall', label: 'Dancehall', region: 'International' },
  { value: 'gospel', label: 'Gospel', region: 'International' },
  { value: 'jazz', label: 'Jazz', region: 'International' },
  { value: 'electronic', label: 'Electronic', region: 'International' }
] as const;

export type GenreValue = typeof MUSIC_GENRES[number]['value'];

export const getGenreLabel = (value: string): string => {
  const genre = MUSIC_GENRES.find(g => g.value === value);
  return genre?.label || value;
};

export const getGenresByRegion = (region: string) => {
  return MUSIC_GENRES.filter(g => g.region === region);
};
