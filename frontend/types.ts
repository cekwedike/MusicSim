
export type StaffRole = 'Manager' | 'Booker' | 'Promoter';
export type StaffTier = 'entry' | 'professional' | 'expert' | 'elite';
export type ContractDuration = 6 | 12; // in months

export interface StaffBonus {
    stat: 'cash' | 'fame' | 'hype';
    value: number; // For cash, it's a percentage modifier. For others, it's a flat bonus per week.
    description: string;
}

/**
 * Staff Template - The blueprint for hiring staff
 * These are the available staff that players can hire
 */
export interface StaffTemplate {
    id: string; // e.g., "MANAGER_PROFESSIONAL"
    name: string;
    role: StaffRole;
    tier: StaffTier;
    salary: number; // per month
    description: string;
    bonuses: StaffBonus[];
    unlockRequirement: {
        type: 'feature' | 'fame' | 'careerProgress';
        value?: number;
        message: string;
    };
}

/**
 * Hired Staff - An active staff member working for the player
 * This represents a staff member that has been hired from a template
 */
export interface HiredStaff {
    templateId: string; // Reference to StaffTemplate.id
    name: string;
    role: StaffRole;
    tier: StaffTier;
    salary: number; // per month
    bonuses: StaffBonus[];
    hiredDate: Date; // When they were hired
    contractDuration: ContractDuration; // 6 or 12 months
    contractExpiresDate: Date; // When contract expires
    monthsRemaining: number; // Calculated field for display
}

/**
 * Legacy Staff interface - kept for backward compatibility
 * @deprecated Use HiredStaff instead
 */
export interface Staff {
    name: string;
    role: StaffRole;
    salary: number; // per week (legacy)
    contractLength: number; // in weeks (legacy)
    bonuses: StaffBonus[];
}

export interface PlayerStats {
  cash: number;
  fame: number;
  wellBeing: number;
  careerProgress: number;
  hype: number;
}

export interface Project {
    id: string;
    name: string;
    progress: number;
    requiredProgress: number;
    quality: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
}

export interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  timestamp: Date;
  icon?: string;
}

// Deprecated legacy week/month/year representation — retained for compatibility with a few modules.
export interface GameDate {
  week: number;
  month: number;
  year: number;
}

export interface TutorialStep {
  id: string;
  title: string;
  message: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'highlight' | 'pulse' | 'block';
  nextTrigger?: 'click' | 'auto';
  delay?: number;
  musicBusinessLesson?: string;
  audioSrc?: string; // Optional audio for this tutorial step
}

export interface TutorialState {
  active: boolean;
  currentStep: number;
  completed: boolean;
  skipped: boolean;
  stepsCompleted: string[];
  startTime?: number;
}

export type Difficulty = 'beginner' | 'realistic' | 'hardcore';

export interface DifficultySettings {
  name: string;
  description: string;
  startingCash: number;
  gracePeriodWeeks: number;
  mistakeForgiveness: boolean;
  scenarioHints: boolean;
  statsDecayRate: number;
  salaryMultiplier: number;
  advanceMultiplier: number;
  debtInterest: boolean;
  randomEvents: boolean;

  // Dynamic difficulty modifiers
  timeScaling: {
    enabled: boolean;
    decayIncrease: number; // How much decay increases per 26 weeks (0.1 = +10% every 6 months)
    costIncrease: number; // How much costs increase over time
    incomeDecrease: number; // How much income decreases over time
  };

  marketVolatility: {
    enabled: boolean;
    cashSwingRange: [number, number]; // Random % swing in cash events
    fameVolatility: number; // How volatile fame gains/losses are
    hypeVolatility: number; // How volatile hype is
  };

  competition: {
    enabled: boolean;
    fameDrain: number; // Passive fame loss due to other artists
    hypeDrain: number; // Passive hype loss due to competition
    frequencyMultiplier: number; // How often competitive events occur
  };

  economicPressure: {
    inflation: number; // Weekly cost increase %
    recoupmentPressure: boolean; // Labels demand faster recoupment
    minimumCashFlow: number; // Minimum weekly expenses
    taxRate: number; // Percentage tax on income
  };

  performanceScaling: {
    enabled: boolean;
    successPenalty: number; // When doing well, difficulty increases
    failureRelief: number; // When struggling, difficulty decreases
    threshold: number; // Career progress threshold for scaling
  };
}

export interface RecordLabel {
    id: string;
    name: string;
    type: 'indie' | 'major';
    reputation: number;
    description: string;
    terms: {
        advance: number;
        royaltyRate: number;
        albumCommitment: number;
        contractLength: number;
        creativeControl: number;
        recoupmentRate: number;
        crossCollateralized: boolean;
        optionClause: boolean;
        advanceRecoupable: boolean;
        marketingBudget: number;
        tourSupport: number;
        territories: string[];
    };
    redFlags: string[];
    greenFlags: string[];
    dealBreakers?: string[];
}

export interface SaveSlot {
  id: string;
  slotName: string; // The name/identifier of the save slot (e.g., "Slot 1", "Slot 2")
  artistName: string;
  genre: string;
  date: GameDate;
  currentDate: Date; // Real in-game date
  stats: PlayerStats;
  timestamp: number; // When the save was created
  careerProgress: number;
}

export interface LearningModule {
  id: string;
  title: string;
  category: 'contracts' | 'revenue' | 'rights' | 'marketing' | 'legal' | 'culture' | 'business' | 'wellness' | 'collaboration' | 'registration';
  icon: string; // Icon name or emoji
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  prerequisites?: string[]; // Other module IDs
  unlockRequirement?: {
    type: 'always' | 'fame' | 'cash' | 'careerProgress' | 'decisions' | 'hype' | 'contractViewed' | 'projectsReleased';
    value?: number;
    message: string;
  };
  content: {
    introduction: string;
    sections: ModuleSection[];
    keyTakeaways: string[];
    culturalContext?: string; // African music industry specific info
    commonPitfalls: string[];
  };
  quiz: QuizQuestion[];
}

export interface ModuleSection {
  heading: string;
  content: string;
  examples?: string[];
  tip?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PlayerKnowledge {
  completedModules: string[];
  moduleScores: Record<string, number>; // 0-100
  quizAttempts: Record<string, number>;
  conceptsMastered: string[];
}

export interface GameStatistics {
  totalWeeksPlayed: number;
  totalGamesPlayed: number;
  longestCareerWeeks: number;
  averageCareerLength: number;
  totalCashEarned: number;
  totalCashSpent: number;
  highestCash: number;
  lowestCash: number;
  timesInDebt: number;
  totalDecisionsMade: number;
  choiceDistribution: Record<string, number>;
  achievementsUnlocked: number;
  modulesCompleted: number;
  averageQuizScore: number;
  lessonsViewed: number;
  conceptsMastered: string[];
  gamesLostToDebt: number;
  gamesLostToBurnout: number;
  careersAbandoned: number;
  highestFameReached: number;
  highestHypeReached: number;
  highestCareerProgressReached: number;
  projectsReleased: number;
  firstGameDate: number;
  lastGameDate: number;
  favoriteGenre: string;
  totalPlayTimeMinutes: number;
  careersByDifficulty: {
    beginner: number;
    realistic: number;
    hardcore: number;
  };
  longestCareerByDifficulty: {
    beginner: number;
    realistic: number;
    hardcore: number;
  };
}

export interface HistoricalDataPoint {
  week: number;
  cash: number;
  fame: number;
  wellBeing: number;
  hype: number;
  careerProgress: number;
  eventDescription?: string;
}

export interface CareerEvent {
  message: string;
  timestamp: number;
}

export interface CareerHistory {
  gameId: string;
  artistName: string;
  genre: string;
  difficulty: Difficulty;
  startDate: number;
  endDate: number;
  finalStats: PlayerStats;
  weeksPlayed: number;
  outcome: 'debt' | 'burnout' | 'abandoned';
  historicalData: HistoricalDataPoint[];
  majorEvents: CareerEvent[];
  achievementsEarned: string[];
  lessonsLearned: string[];
  contractsSigned: string[];
  highestCash: number;
  lowestCash: number;
  peakFame: number;
  peakCareerProgress: number;
}

export interface GameState {
  status: 'start' | 'setup' | 'playing' | 'loading' | 'gameOver';
  playerStats: PlayerStats;
  artistName: string;
  artistGenre: string;
  currentScenario: Scenario | null;
  lastOutcome: ChoiceOutcome | null;
  logs: LogEntry[];
  date: GameDate;
  currentDate: Date;
  startDate: Date;
  usedScenarioTitles: string[];
  achievements: Achievement[];
  currentProject: Project | null;
  unseenAchievements: string[];
  modal: 'none' | 'management' | 'saveload' | 'learning' | 'moduleViewer' | 'contract' | 'statistics';
  currentModule: LearningModule | null;
  playerKnowledge: PlayerKnowledge;
  lessonsViewed: string[];
  currentLabelOffer: RecordLabel | null;
  contractsViewed: string[];
  consecutiveFallbackCount: number;
  staff: HiredStaff[];
  staffHiringUnlocked: boolean; // Whether player has unlocked the ability to hire staff
  lastStaffPaymentDate: Date; // Track when we last paid staff (monthly)
  currentLabel: RecordLabel | null;
  debtTurns: number;
  burnoutTurns: number;
  gameOverReason: 'debt' | 'burnout' | null;
  statistics: GameStatistics;
  currentHistory: HistoricalDataPoint[];
  sessionStartTime: number;
  tutorial: TutorialState;
  difficulty: Difficulty;
  mistakesMade: number;
  lastMistakeWeek: number;
  unlocksShown: string[]; // Track which unlock notifications have been shown
}

export interface ChoiceOutcome {
  text: string;
  cash: number;
  fame: number;
  wellBeing: number;
  careerProgress: number;
  hype: number;
  // Optional audio to play when this outcome occurs (e.g., a voiceover that should play only if this outcome is selected)
  audioFile?: string;
  // If true, attempt to auto-play the outcome audio when the choice is selected (honors autoplay rules and preferences)
  autoPlayAudio?: boolean;
  startProject?: string; // ID of the project to start
  progressProject?: number; // Amount to progress the current project
  hireStaff?: StaffRole; // Role of staff to hire
  fireStaff?: StaffRole;
  renewStaff?: StaffRole;
  signLabel?: string; // ID of the label to sign with
  viewContract?: string; // ID of the label contract to view
  achievementId?: string; // ID of achievement to unlock (for event-based achievements)
  lesson?: {
    title: string;
    explanation: string; // WHY this outcome happened
    realWorldExample?: string; // Real artist/industry example
    tipForFuture: string;
    conceptTaught?: string; // Links to learning module
  };
}

export interface Choice {
  text: string;
  outcome: ChoiceOutcome;
}

export interface ScenarioConditions {
  minFame?: number;
  maxFame?: number;
  minCash?: number;
  maxCash?: number;
  minWellBeing?: number;
  maxWellBeing?: number;
  requiredGenre?: string[];
  minCareerProgress?: number;
  minHype?: number;
  maxHype?: number;
  requiredAchievementId?: string;
  projectRequired?: boolean; // True if a project must be active
  noProjectRequired?: boolean; // True if no project should be active
  requiresStaff?: StaffRole[]; // Must have these staff roles
  missingStaff?: StaffRole[]; // Must NOT have these staff roles
}

export interface Scenario {
  title: string;
  description: string;
  choices: Choice[];
  conditions?: ScenarioConditions;
  once?: boolean; // If true, this scenario can only appear once
  // Optional audio to play when this scenario is shown. Path is relative to public/.
  audioFile?: string;
  // If true, attempt to auto-play the audio when the scenario appears (honors browser autoplay rules and user audio preferences).
  autoPlayAudio?: boolean;
}

// Reducer Action Types
export type Action =
  | { type: 'START_SETUP' }
  | { type: 'SUBMIT_SETUP'; payload: { name: string; genre: string; difficulty: Difficulty } }
  | { type: 'SCENARIO_LOADING' }
  | { type: 'SCENARIO_LOADED'; payload: Scenario }
  | { type: 'SELECT_CHOICE'; payload: Choice }
  | { type: 'DISMISS_OUTCOME' }
  | { type: 'RESTART' }
  | { type: 'RESET_TO_LANDING' }
  | { type: 'VIEW_MANAGEMENT_HUB' }
  | { type: 'VIEW_SAVE_LOAD' }
  | { type: 'VIEW_LEARNING_HUB' }
  | { type: 'OPEN_MODULE'; payload: LearningModule }
  | { type: 'COMPLETE_MODULE'; payload: { moduleId: string; score: number; conceptsMastered: string[] } }
  | { type: 'CLOSE_MODULE' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'VIEW_CONTRACT'; payload: RecordLabel }
  | { type: 'SIGN_CONTRACT' }
  | { type: 'DECLINE_CONTRACT' }
  | { type: 'VIEW_STATISTICS' }
  | { type: 'LOAD_GAME'; payload: GameState }
  | { type: 'START_TUTORIAL' }
  | { type: 'NEXT_TUTORIAL_STEP' }
  | { type: 'PREVIOUS_TUTORIAL_STEP' }
  | { type: 'SKIP_TUTORIAL' }
  | { type: 'COMPLETE_TUTORIAL' }
  | { type: 'CLEAR_UNSEEN_ACHIEVEMENTS' }
  | { type: 'UNLOCK_STAFF_HIRING' } // Unlock the staff hiring feature
  | { type: 'HIRE_STAFF'; payload: { templateId: string; contractDuration: ContractDuration } }
  | { type: 'TERMINATE_STAFF'; payload: { staffIndex: number } }
  | { type: 'EXTEND_STAFF_CONTRACT'; payload: { staffIndex: number; additionalMonths: ContractDuration } }
  | { type: 'MARK_UNLOCKS_SHOWN'; unlockIds: string[] }
  | { type: 'CHEAT_MAX_STATS' }; // For debugging