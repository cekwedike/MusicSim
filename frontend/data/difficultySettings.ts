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
    randomEvents: false,

    timeScaling: {
      enabled: false,
      decayIncrease: 0,
      costIncrease: 0,
      incomeDecrease: 0
    },

    marketVolatility: {
      enabled: false,
      cashSwingRange: [0, 0],
      fameVolatility: 0,
      hypeVolatility: 0
    },

    competition: {
      enabled: false,
      fameDrain: 0,
      hypeDrain: 0,
      frequencyMultiplier: 0
    },

    economicPressure: {
      inflation: 0,
      recoupmentPressure: false,
      minimumCashFlow: 0,
      taxRate: 0
    },

    performanceScaling: {
      enabled: false,
      successPenalty: 0,
      failureRelief: 0,
      threshold: 0
    }
  },

  realistic: {
    name: 'Realistic Mode',
    description: 'The true music industry experience. Market conditions evolve, competition heats up, and costs increase over time. Dynamic difficulty that reflects real-world challenges.',
    startingCash: 500,
    gracePeriodWeeks: 6,
    mistakeForgiveness: false,
    scenarioHints: false,
    statsDecayRate: 1.0,
    salaryMultiplier: 1.0,
    advanceMultiplier: 1.0,
    debtInterest: false,
    randomEvents: true,

    timeScaling: {
      enabled: true,
      decayIncrease: 0.08, // +8% decay every 6 months
      costIncrease: 0.05, // +5% costs every 6 months
      incomeDecrease: 0.03 // -3% income every 6 months (market saturation)
    },

    marketVolatility: {
      enabled: true,
      cashSwingRange: [-0.15, 0.15], // ±15% variance on cash events
      fameVolatility: 0.2, // 20% variance on fame gains/losses
      hypeVolatility: 0.25 // 25% variance on hype
    },

    competition: {
      enabled: true,
      fameDrain: 0.5, // Lose 0.5 fame per week to competition
      hypeDrain: 1, // Lose 1 hype per week to competition
      frequencyMultiplier: 1.0 // Normal competitive event frequency
    },

    economicPressure: {
      inflation: 0.002, // 0.2% weekly inflation (realistic)
      recoupmentPressure: true,
      minimumCashFlow: 50, // Minimum $50/week expenses
      taxRate: 0.15 // 15% tax on positive income
    },

    performanceScaling: {
      enabled: true,
      successPenalty: 0.1, // +10% difficulty when career progress > threshold
      failureRelief: 0.15, // -15% difficulty when struggling
      threshold: 60 // Threshold at 60 career progress
    }
  },

  hardcore: {
    name: 'Hardcore Mode',
    description: 'Brutal, ever-evolving difficulty. Aggressive market forces, ruthless competition, and unforgiving economic pressure. Success breeds harder challenges. Only for masochists.',
    startingCash: 200,
    gracePeriodWeeks: 3,
    mistakeForgiveness: false,
    scenarioHints: false,
    statsDecayRate: 1.5,
    salaryMultiplier: 1.3,
    advanceMultiplier: 0.7,
    debtInterest: true,
    randomEvents: true,

    timeScaling: {
      enabled: true,
      decayIncrease: 0.15, // +15% decay every 6 months
      costIncrease: 0.10, // +10% costs every 6 months
      incomeDecrease: 0.08 // -8% income every 6 months
    },

    marketVolatility: {
      enabled: true,
      cashSwingRange: [-0.30, 0.20], // -30% to +20% (skewed negative)
      fameVolatility: 0.35, // 35% variance on fame
      hypeVolatility: 0.40 // 40% variance on hype
    },

    competition: {
      enabled: true,
      fameDrain: 1.2, // Lose 1.2 fame per week to competition
      hypeDrain: 2, // Lose 2 hype per week to competition
      frequencyMultiplier: 1.5 // 50% more competitive events
    },

    economicPressure: {
      inflation: 0.005, // 0.5% weekly inflation (aggressive)
      recoupmentPressure: true,
      minimumCashFlow: 150, // Minimum $150/week expenses
      taxRate: 0.25 // 25% tax on positive income
    },

    performanceScaling: {
      enabled: true,
      successPenalty: 0.25, // +25% difficulty when doing well
      failureRelief: 0.10, // Only -10% relief when struggling
      threshold: 50 // Lower threshold at 50 career progress
    }
  }
};

// Helper function to get settings
export const getDifficultySettings = (difficulty: Difficulty): DifficultySettings => {
  return difficultySettings[difficulty];
};

// Calculate dynamic difficulty modifiers based on game state
export const calculateDynamicModifiers = (
  settings: DifficultySettings,
  weeksPlayed: number,
  careerProgress: number,
  currentCash: number
) => {
  let decayMultiplier = settings.statsDecayRate;
  let costMultiplier = settings.salaryMultiplier;
  let incomeMultiplier = settings.advanceMultiplier;

  // Time-based scaling (every 26 weeks = ~6 months)
  if (settings.timeScaling.enabled) {
    const sixMonthPeriods = Math.floor(weeksPlayed / 26);
    decayMultiplier *= (1 + settings.timeScaling.decayIncrease * sixMonthPeriods);
    costMultiplier *= (1 + settings.timeScaling.costIncrease * sixMonthPeriods);
    incomeMultiplier *= (1 - settings.timeScaling.incomeDecrease * sixMonthPeriods);
  }

  // Performance-based scaling
  if (settings.performanceScaling.enabled) {
    if (careerProgress >= settings.performanceScaling.threshold) {
      // Success penalty - make it harder when doing well
      const excessProgress = (careerProgress - settings.performanceScaling.threshold) / 40; // Normalize to 0-1
      decayMultiplier *= (1 + settings.performanceScaling.successPenalty * excessProgress);
      costMultiplier *= (1 + settings.performanceScaling.successPenalty * excessProgress);
    } else if (careerProgress < settings.performanceScaling.threshold * 0.6) {
      // Failure relief - make it easier when struggling
      const deficit = 1 - (careerProgress / (settings.performanceScaling.threshold * 0.6));
      decayMultiplier *= (1 - settings.performanceScaling.failureRelief * deficit);
      costMultiplier *= (1 - settings.performanceScaling.failureRelief * deficit);
    }
  }

  return {
    decayMultiplier: Math.max(0.3, decayMultiplier), // Floor at 30% of original
    costMultiplier: Math.max(0.5, costMultiplier), // Floor at 50% of original
    incomeMultiplier: Math.max(0.4, incomeMultiplier), // Floor at 40% of original
    inflationMultiplier: 1 + (settings.economicPressure.inflation * weeksPlayed)
  };
};

// Apply market volatility to a value
export const applyVolatility = (
  value: number,
  volatility: number,
  type: 'cash' | 'fame' | 'hype'
): number => {
  if (volatility === 0) return value;

  const variance = (Math.random() - 0.5) * 2 * volatility; // Random variance from -volatility to +volatility
  return Math.floor(value * (1 + variance));
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
      return '';
    case 'realistic':
      return '';
    case 'hardcore':
      return '';
    default:
      return '';
  }
};