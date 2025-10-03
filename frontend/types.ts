
export type StaffRole = 'Manager' | 'Booker' | 'Promoter';

export interface StaffBonus {
    stat: 'cash' | 'fame' | 'hype';
    value: number; // For cash, it's a percentage modifier. For others, it's a flat bonus per week.
    description: string;
}

export interface Staff {
    name: string;
    role: StaffRole;
    salary: number; // per week
    contractLength: number; // in weeks
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

export interface GameDate {
  week: number;
  month: number;
  year: number;
}

export interface GameEvent {
  date: GameDate;
  description: string;
}

export interface RecordLabel {
    id: string;
    name: string;
    advance: number;
    royalties: number; // as percentage, e.g., 15 for 15%
    creativeControl: number; // 0-100, higher is more freedom
}

export interface SaveSlot {
  id: string;
  artistName: string;
  genre: string;
  date: GameDate;
  stats: PlayerStats;
  timestamp: number;
  careerProgress: number;
}

export interface GameState {
  status: 'start' | 'setup' | 'playing' | 'loading' | 'gameOver' | 'gameWon';
  playerStats: PlayerStats;
  artistName: string;
  artistGenre: string;
  currentScenario: Scenario | null;
  lastOutcome: ChoiceOutcome | null;
  careerLog: GameEvent[];
  date: GameDate;
  usedScenarioTitles: string[];
  achievements: Achievement[];
  currentProject: Project | null;
  unseenAchievements: string[];
  modal: 'none' | 'management';
  consecutiveFallbackCount: number;
  staff: Staff[];
  currentLabel: RecordLabel | null;
  debtTurns: number;
  burnoutTurns: number;
  gameOverReason: 'debt' | 'burnout' | null;
}

export interface ChoiceOutcome {
  text: string;
  cash: number;
  fame: number;
  wellBeing: number;
  careerProgress: number;
  hype: number;
  startProject?: string; // ID of the project to start
  progressProject?: number; // Amount to progress the current project
  hireStaff?: StaffRole; // Role of staff to hire
  fireStaff?: StaffRole;
  renewStaff?: StaffRole;
  signLabel?: string; // ID of the label to sign with
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
}

// Reducer Action Types
export type Action =
  | { type: 'START_SETUP' }
  | { type: 'SUBMIT_SETUP'; payload: { name: string; genre: string } }
  | { type: 'SCENARIO_LOADING' }
  | { type: 'SCENARIO_LOADED'; payload: Scenario }
  | { type: 'SELECT_CHOICE'; payload: Choice }
  | { type: 'DISMISS_OUTCOME' }
  | { type: 'RESTART' }
  | { type: 'VIEW_MANAGEMENT_HUB' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'CHEAT_MAX_STATS' }; // For debugging