import type { GameStatistics, GameState, CareerHistory } from '../types';

export const loadStatistics = (): GameStatistics => {
  const saved = localStorage.getItem('musicsim_statistics');
  if (!saved) {
    return getDefaultStatistics();
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load statistics:', error);
    return getDefaultStatistics();
  }
};

const getDefaultStatistics = (): GameStatistics => {
  return {
    totalWeeksPlayed: 0,
    totalGamesPlayed: 0,
    longestCareerWeeks: 0,
    averageCareerLength: 0,
    totalCashEarned: 0,
    totalCashSpent: 0,
    highestCash: 0,
    lowestCash: 0,
    timesInDebt: 0,
    totalDecisionsMade: 0,
    choiceDistribution: {},
    achievementsUnlocked: 0,
    modulesCompleted: 0,
    averageQuizScore: 0,
    lessonsViewed: 0,
    conceptsMastered: [],
    gamesLostToDebt: 0,
    gamesLostToBurnout: 0,
    careersAbandoned: 0,
    highestFameReached: 0,
    highestHypeReached: 0,
    highestCareerProgressReached: 0,
    projectsReleased: 0,
    firstGameDate: Date.now(),
    lastGameDate: Date.now(),
    favoriteGenre: '',
    totalPlayTimeMinutes: 0
  };
};

export const saveStatistics = (stats: GameStatistics): void => {
  try {
    localStorage.setItem('musicsim_statistics', JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save statistics:', error);
  }
};

export const updateStatistics = (state: GameState, stats: GameStatistics): GameStatistics => {
  const updated = { ...stats };
  
  updated.totalWeeksPlayed = (state.date.year - 1) * 48 + (state.date.month - 1) * 4 + state.date.week;
  updated.lastGameDate = Date.now();
  updated.highestCash = Math.max(updated.highestCash, state.playerStats.cash);
  updated.highestFameReached = Math.max(updated.highestFameReached, state.playerStats.fame);
  updated.highestHypeReached = Math.max(updated.highestHypeReached, state.playerStats.hype);
  updated.highestCareerProgressReached = Math.max(updated.highestCareerProgressReached, state.playerStats.careerProgress);
  updated.lessonsViewed = state.lessonsViewed.length;
  updated.achievementsUnlocked = state.achievements.filter(a => a.unlocked).length;
  
  if (state.playerStats.cash < 0) {
    updated.timesInDebt++;
  }
  
  return updated;
};

export const recordGameEnd = (state: GameState, stats: GameStatistics, outcome: 'debt' | 'burnout' | 'abandoned'): GameStatistics => {
  const updated = { ...stats };
  
  updated.totalGamesPlayed++;
  
  const weeksPlayed = (state.date.year - 1) * 48 + (state.date.month - 1) * 4 + state.date.week;
  updated.longestCareerWeeks = Math.max(updated.longestCareerWeeks, weeksPlayed);
  updated.averageCareerLength = Math.floor(
    (updated.averageCareerLength * (updated.totalGamesPlayed - 1) + weeksPlayed) / updated.totalGamesPlayed
  );
  
  if (outcome === 'debt') {
    updated.gamesLostToDebt++;
  } else if (outcome === 'burnout') {
    updated.gamesLostToBurnout++;
  } else if (outcome === 'abandoned') {
    updated.careersAbandoned++;
  }
  
  return updated;
};

export const loadCareerHistories = (): CareerHistory[] => {
  const saved = localStorage.getItem('musicsim_careers');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load career histories:', error);
    return [];
  }
};

export const saveCareerHistory = (career: CareerHistory): void => {
  try {
    const histories = loadCareerHistories();
    histories.push(career);
    // Keep only last 20 careers to manage storage
    const recent = histories.slice(-20);
    localStorage.setItem('musicsim_careers', JSON.stringify(recent));
  } catch (error) {
    console.error('Failed to save career history:', error);
  }
};

export const recordDecision = (stats: GameStatistics, choiceText: string): GameStatistics => {
  const updated = { ...stats };
  updated.totalDecisionsMade++;
  updated.choiceDistribution[choiceText] = (updated.choiceDistribution[choiceText] || 0) + 1;
  return updated;
};

export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const formatDuration = (weeks: number): string => {
  if (weeks < 4) return `${weeks} weeks`;
  if (weeks < 48) {
    const months = Math.floor(weeks / 4);
    const remainingWeeks = weeks % 4;
    if (remainingWeeks === 0) return `${months} months`;
    return `${months} months, ${remainingWeeks} weeks`;
  }
  
  const years = Math.floor(weeks / 48);
  const remainingWeeks = weeks % 48;
  const months = Math.floor(remainingWeeks / 4);
  const finalWeeks = remainingWeeks % 4;
  
  let result = `${years} year${years > 1 ? 's' : ''}`;
  if (months > 0) result += `, ${months} month${months > 1 ? 's' : ''}`;
  if (finalWeeks > 0) result += `, ${finalWeeks} week${finalWeeks > 1 ? 's' : ''}`;
  
  return result;
};
