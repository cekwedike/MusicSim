import type { DifficultySettings, Difficulty } from '../types';

export const difficultySettings: Record<Difficulty, DifficultySettings> = {
  beginner: {
    name: 'Beginner Mode',
    description: 'Learn the game with extra resources and forgiveness. Perfect for first-time players who want to understand music business concepts without excessive pressure.',
    startingCash: 2000,
    gracePeriodWeeks: 12,
    mistakeForgiveness: true,
    scenarioHints: true,
    statsDecayRate: 0.5,
    salaryMultiplier: 0.7,
    advanceMultiplier: 1.5,
    debtInterest: false,
    randomEvents: false
  },
  realistic: {
    name: 'Realistic Mode',
    description: 'The true music industry experience. Balanced difficulty that reflects real-world challenges faced by independent African artists.',
    startingCash: 500,
    gracePeriodWeeks: 6,
    mistakeForgiveness: false,
    scenarioHints: false,
    statsDecayRate: 1.0,
    salaryMultiplier: 1.0,
    advanceMultiplier: 1.0,
    debtInterest: false,
    randomEvents: true
  },
  hardcore: {
    name: 'Hardcore Mode',
    description: 'Brutal realism. Debt accumulates interest. Random crises occur. Staff demand raises. Only for players who want the full harsh reality of the music business.',
    startingCash: 200,
    gracePeriodWeeks: 3,
    mistakeForgiveness: false,
    scenarioHints: false,
    statsDecayRate: 1.5,
    salaryMultiplier: 1.3,
    advanceMultiplier: 0.7,
    debtInterest: true,
    randomEvents: true
  }
};

// Helper function to get settings
export const getDifficultySettings = (difficulty: Difficulty): DifficultySettings => {
  return difficultySettings[difficulty];
};

// Helper function to get difficulty color for UI
export const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-400';
    case 'realistic':
      return 'text-yellow-400';
    case 'hardcore':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

// Helper function to get difficulty icon
export const getDifficultyIcon = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'beginner':
      return '🎓';
    case 'realistic':
      return '⚖️';
    case 'hardcore':
      return '💀';
    default:
      return '⚖️';
  }
};