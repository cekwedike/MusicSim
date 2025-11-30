import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the scenario bank to keep tests deterministic and focused
vi.mock('../data/scenarioBank', () => {
  const makeChoice = () => ({ text: 'ok', outcome: { text: 't', cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: 0 } });
  const fallback = {
    title: 'An Uneventful Week',
    description: 'fallback',
    choices: [makeChoice()],
  };
  const bank = [
    {
      title: 'A Needs Manager',
      description: 'req staff',
      conditions: { requiresStaff: ['Manager'] },
      choices: [makeChoice()],
    },
    {
      title: 'B Fame Gate',
      description: 'min fame by difficulty',
      conditions: { minFameByDifficulty: { beginner: 10, realistic: 20, hardcore: 30 } },
      choices: [makeChoice()],
    },
    {
      title: 'C Once Only',
      description: 'once-only',
      once: true,
      choices: [makeChoice()],
    },
    {
      title: 'NonFitting',
      description: 'min fame too high',
      conditions: { minFame: 1000 },
      choices: [makeChoice()],
    },
    {
      title: 'X Recently Seen',
      description: 'for weighting test',
      conditions: { minCash: 10000 },
      choices: [makeChoice()],
    },
    {
      title: 'Y Fresh',
      description: 'for weighting test',
      conditions: { minCash: 10000 },
      choices: [makeChoice()],
    },
  ];
  return { scenarioBank: bank, fallbackScenario: fallback };
});

import { getNewScenario } from './scenarioService';
import type { GameState, HiredStaff } from '../types';

const baseState = (): GameState => ({
  status: 'playing',
  playerStats: { cash: 0, fame: 0, wellBeing: 50, careerProgress: 0, hype: 0 },
  artistName: 'Test',
  artistGenre: 'afrobeats',
  currentScenario: null,
  lastOutcome: null,
  logs: [],
  date: { week: 1, month: 1, year: 1 },
  currentDate: new Date('2025-01-01'),
  startDate: new Date('2025-01-01'),
  usedScenarioTitles: [],
  achievements: [],
  currentProject: null,
  unseenAchievements: [],
  modal: 'none',
  currentModule: null,
  playerKnowledge: { completedModules: [], moduleScores: {}, quizAttempts: {}, conceptsMastered: [] },
  lessonsViewed: [],
  currentLabelOffer: null,
  contractsViewed: [],
  consecutiveFallbackCount: 0,
  staff: [],
  staffHiringUnlocked: true,
  lastStaffPaymentDate: new Date('2025-01-01'),
  currentLabel: null,
  debtTurns: 0,
  burnoutTurns: 0,
  gameOverReason: null,
  statistics: {
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
    contractsSigned: 0,
    firstGameDate: 0,
    lastGameDate: 0,
    favoriteGenre: 'afrobeats',
    totalPlayTimeMinutes: 0,
    careersByDifficulty: { beginner: 0, realistic: 0, hardcore: 0 },
    longestCareerByDifficulty: { beginner: 0, realistic: 0, hardcore: 0 },
  },
  currentHistory: [],
  sessionStartTime: Date.now(),
  tutorial: { active: false, currentStep: 0, completed: false, skipped: true, stepsCompleted: [] },
  difficulty: 'beginner',
  mistakesMade: 0,
  lastMistakeWeek: 0,
  unlocksShown: [],
  contractStartDate: null,
  pendingContractOffers: [],
  fameThresholdWeeks: 0,
  contractEligibilityUnlocked: false,
});

const makeStaff = (role: HiredStaff['role']): HiredStaff => ({
  templateId: 'TMP1',
  name: role,
  role,
  tier: 'entry',
  salary: 1000,
  bonuses: [],
  hiredDate: new Date('2025-01-01'),
  contractDuration: 6,
  contractExpiresDate: new Date('2025-07-01'),
  monthsRemaining: 6,
});

let mathSpy: ReturnType<typeof vi.spyOn> | undefined;

beforeEach(() => {
  mathSpy = vi.spyOn(Math, 'random');
});

afterEach(() => {
  mathSpy?.mockRestore();
});

describe('scenarioService.getNewScenario', () => {
  it('selects a staff-restricted scenario when requirements are met', async () => {
    mathSpy!.mockReturnValue(0.0);
    const state = baseState();
    state.staff = [makeStaff('Manager')];
    const s = await getNewScenario(state);
    expect(s.title).toBe('A Needs Manager');
  });

  it('respects minFameByDifficulty gating and returns fallback when not met', async () => {
    mathSpy!.mockReturnValue(0.0);
    const state = baseState();
    state.playerStats.fame = 5; // below beginner 10
    // Exclude once-only so nothing fits
    state.usedScenarioTitles = ['C Once Only'];
    let s = await getNewScenario(state);
    expect(s.title).toBe('An Uneventful Week');
    state.playerStats.fame = 15; // meets beginner 10
    s = await getNewScenario(state);
    expect(s.title).toBe('B Fame Gate');
  });

  it('filters out once-only scenarios that were already used', async () => {
    mathSpy!.mockReturnValue(0.0);
    const state = baseState();
    state.usedScenarioTitles = ['C Once Only'];
    const s = await getNewScenario(state);
    // With once-only excluded and no other fitting scenarios by default, expect fallback
    expect(s.title).toBe('An Uneventful Week');
  });

  it('de-prioritizes very recently seen scenarios via weighted selection', async () => {
    // Arrange used history so first candidate has very low weight
    // Bank order ensures 'X Recently Seen' precedes 'Y Fresh'
    const state = baseState();
    state.usedScenarioTitles = ['Z', 'X Recently Seen']; // makes X very recent
    // Satisfy cash conditions so both X and Y fit
    state.playerStats.cash = 10000;
    // total weight ~= 0.05 (X) + 1.0 (Y) = 1.05
    // Set random just above first weight to land in Y's region
    mathSpy!.mockReturnValue(0.9 / 1.05); // scale into [0,1) domain
    const s = await getNewScenario(state);
    expect(s.title).toBe('Y Fresh');
  });

  it('forces a non-fallback scenario after repeated fallbacks', async () => {
    // No fitting scenarios; after >=3 fallbacks, should pick a non-fitting available scenario
    const state = baseState();
    state.playerStats.fame = 0; // ensure 'NonFitting' does not fit
    state.consecutiveFallbackCount = 3;
    // Push random low so selection picks first non-fallback available ('A Needs Manager')
    mathSpy!.mockReturnValue(0.0);
    const s = await getNewScenario(state);
    expect(s.title).not.toBe('An Uneventful Week');
  });
});
