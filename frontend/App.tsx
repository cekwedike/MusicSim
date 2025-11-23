import React, { useReducer, useCallback, useEffect, useState, useRef, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { AudioProvider } from './contexts/AudioContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginModal } from './components/LoginModal';
import GuestDataMergeModal from './components/GuestDataMergeModal';
import LandingPage from './components/LandingPage';
import type { GameState, Action, Choice, Scenario, PlayerStats, Project, GameDate, Staff, HiredStaff, StaffTemplate, ContractDuration, RecordLabel, LearningModule, CareerHistory, Difficulty, LogEntry, SaveSlot } from './types';
import { getNewScenario } from './services/scenarioService';
import { createLog, appendLogToArray } from './src/utils/logUtils';
import { toGameDate } from './src/utils/dateUtils';
import { autoSave, loadGame, isStorageAvailable, saveGame, cleanupExpiredAutosaves, hasValidAutosave, getAutosaveAge, deleteSave, getAllSaveSlots, deserializeGameState, getGuestData, clearGuestData } from './services/storageService';
import authServiceSupabase from './services/authService.supabase';
import { useAutoSave } from './hooks/useAutoSave';
import { loadStatistics, saveStatistics, updateStatistics, recordGameEnd, saveCareerHistory, recordDecision } from './services/statisticsService';
import { startModule, completeModule } from './services/learningProgressService';
import { getGenreLabel } from './constants/genres';
import { getDifficultySettings, calculateDynamicModifiers, applyVolatility } from './data/difficultySettings';
import { achievements as allAchievements } from './data/achievements';
import { projects as allProjects } from './data/projects';
import { staffTemplates, getStaffTemplate, getAvailableStaff } from './data/staff';
import { labels as allLabels } from './data/labels';
import learningModules from './data/learningModules';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScenarioCard from './components/ScenarioCard';
import OutcomeModal from './components/OutcomeModal';
import StaffTerminationModal from './components/StaffTerminationModal';
import Loader from './components/Loader';
import ArtistSetup from './components/ArtistSetup';
import AudioUnlockPrompt from './components/AudioUnlockPrompt';

// Lazy load heavy components that aren't always needed
const LearningHub = lazy(() => import('./components/LearningHub'));
const LearningPanel = lazy(() => import('./components/LearningPanel'));
const ModuleViewer = lazy(() => import('./components/ModuleViewer'));
// ContractViewer exports a named component; map it to `default` for React.lazy typing
const ContractViewer = lazy(() => import('./components/ContractViewer').then(mod => ({ default: (mod as any).ContractViewer }))) as React.LazyExoticComponent<React.ComponentType<{ label: RecordLabel; onSign: () => void; onDecline: () => void }>>;
import ManagementPanel from './components/ManagementPanel';
import StatisticsPanel from './components/StatisticsPanel';
import SidebarAudioSettings from './components/SidebarAudioSettings';
// SaveLoadPanel already used inside the sidebar
import { TutorialOverlay } from './components/TutorialOverlay';
import { MistakeWarning } from './components/MistakeWarning';
import WelcomeBackDialog from './components/WelcomeBackDialog';
import GameHistory from './components/GameHistory';
import { useOnlineStatus } from './src/hooks/useOnlineStatus';
import OfflineBanner from './src/components/OfflineBanner';
import InstallBanner from './src/components/InstallBanner';
import { useAudio } from './contexts/AudioContext';
import Sidebar, { SidebarView } from './components/Sidebar';
import ProfilePanel from './components/ProfilePanel';
import SaveLoadPanel from './components/SaveLoadPanel';
import { AudioPlayer } from './src/components/AudioPlayer';
import UnlockNotification from './components/UnlockNotification';
import ParallaxBackground from './components/ParallaxBackground';

const generateInitialState = (artistName = '', artistGenre = '', difficulty: Difficulty = 'realistic'): GameState => {
    const settings = getDifficultySettings(difficulty);
    const startingCash = settings.startingCash;
    return {
        status: 'start',
        playerStats: {
            cash: startingCash,
            fame: 0,
            wellBeing: 50,
            careerProgress: 0,
            hype: 0,
        },
        artistName,
        artistGenre,
        currentScenario: null,
        lastOutcome: null,
    // legacy careerLog removed; use `logs` (Date-based) instead
    logs: [createLog('Your music career begins today!', 'success', new Date(), '')],
        date: { week: 1, month: 1, year: 1 },
        currentDate: new Date(),
        startDate: new Date(),
        usedScenarioTitles: [],
        achievements: allAchievements.map(a => ({ ...a, unlocked: false })),
        currentProject: null,
        unseenAchievements: [],
        modal: 'none',
        currentModule: null,
        playerKnowledge: {
            completedModules: [],
            moduleScores: {},
            quizAttempts: {},
            conceptsMastered: []
        },
        lessonsViewed: [],
        consecutiveFallbackCount: 0,
        staff: [],
        staffHiringUnlocked: false, // Unlocked at 10 fame or via scenario
        lastStaffPaymentDate: new Date(),
        currentLabel: null,
        currentLabelOffer: null,
        contractsViewed: [],
        debtTurns: 0,
        burnoutTurns: 0,
        gameOverReason: null,
        unlocksShown: [],
        statistics: loadStatistics(),
        currentHistory: [],
        sessionStartTime: Date.now(),
        tutorial: {
            active: false,
            currentStep: 0,
            completed: false,
            skipped: false,
            stepsCompleted: []
        },
        difficulty,
        mistakesMade: 0,
        lastMistakeWeek: 0,
        fameThresholdWeeks: 0,
        contractEligibilityUnlocked: false,
    };
};

const INITIAL_STATE = generateInitialState();

// Log helpers moved to src/utils/logUtils.ts (createLog, appendLogToArray)

/**
 * Helper function to create a HiredStaff from a StaffTemplate
 */
function hireStaffFromTemplate(template: StaffTemplate, contractDuration: ContractDuration, hiredDate: Date = new Date()): HiredStaff {
    const contractExpiresDate = new Date(hiredDate);
    contractExpiresDate.setMonth(contractExpiresDate.getMonth() + contractDuration);

    return {
        templateId: template.id,
        name: template.name,
        role: template.role,
        tier: template.tier,
        salary: template.salary,
        bonuses: [...template.bonuses],
        hiredDate: new Date(hiredDate),
        contractDuration,
        contractExpiresDate,
        monthsRemaining: contractDuration
    };
}

/**
 * Update monthsRemaining for all hired staff based on current date
 */
function updateStaffContractTime(staff: HiredStaff[], currentDate: Date): HiredStaff[] {
    return staff.map(s => {
        const monthsRemaining = Math.max(0, Math.ceil(
            (s.contractExpiresDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
        ));
        return { ...s, monthsRemaining };
    });
}

function checkAchievements(state: GameState, newStats: PlayerStats): { achievements: GameState['achievements'], unseenAchievements: string[] } {
    const unlockedAchievements = [...state.achievements];
    const newUnseen = [...state.unseenAchievements];

    const checkAndUnlock = (id: string, condition: boolean) => {
        const achievement = unlockedAchievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked && condition) {
            achievement.unlocked = true;
            if(!newUnseen.includes(id)) {
                newUnseen.push(id);
            }
        }
    };
    
    // Milestones - Cash
    checkAndUnlock('CASH_10K', newStats.cash >= 10000);
    checkAndUnlock('CASH_100K', newStats.cash >= 100000);
    checkAndUnlock('CASH_1M', newStats.cash >= 1000000);

    // Milestones - Fame
    checkAndUnlock('FAME_25', newStats.fame >= 25);
    checkAndUnlock('FAME_50', newStats.fame >= 50);
    checkAndUnlock('FAME_100', newStats.fame >= 100);

    // Milestones - Hype
    checkAndUnlock('HYPE_50', newStats.hype >= 50);
    checkAndUnlock('HYPE_100', newStats.hype >= 100);

    // Milestones - Career Progress
    checkAndUnlock('CAREER_50', newStats.careerProgress >= 50);
    checkAndUnlock('CAREER_100', newStats.careerProgress >= 100);

    // Staff Achievements
    const hasManager = state.staff.some(s => s.role === 'Manager');
    const hasBooker = state.staff.some(s => s.role === 'Booker');
    const hasPromoter = state.staff.some(s => s.role === 'Promoter');
    checkAndUnlock('STAFF_MANAGER', hasManager);
    checkAndUnlock('STAFF_BOOKER', hasBooker);
    checkAndUnlock('STAFF_PROMOTER', hasPromoter);
    checkAndUnlock('STAFF_FULL_TEAM', hasManager && hasBooker && hasPromoter);
    
    // Learning Achievements
    checkAndUnlock('EAGER_STUDENT', state.lessonsViewed.length >= 10);
    checkAndUnlock('KNOWLEDGE_SEEKER', state.lessonsViewed.length >= 25);
    
    // Tutorial Achievements
    checkAndUnlock('FIRST_STEPS', state.tutorial.completed);
    checkAndUnlock('WISE_STUDENT', state.tutorial.completed && state.lessonsViewed.length >= 25);
    
    // Statistics Achievements
    const currentGameDate = toGameDate(state.currentDate, state.startDate);
    const totalWeeks = (currentGameDate.year - 1) * 48 + (currentGameDate.month - 1) * 4 + currentGameDate.week;
    checkAndUnlock('SURVIVOR', totalWeeks >= 52);
    checkAndUnlock('PERSISTENT', totalWeeks >= 104);
    checkAndUnlock('LEGENDARY_CAREER', totalWeeks >= 208);
    checkAndUnlock('VETERAN', state.statistics.totalGamesPlayed >= 10);
    
    // Difficulty-specific achievements
    if (state.difficulty === 'realistic') {
        checkAndUnlock('REALISTIC_SURVIVOR', totalWeeks >= 52);
    } else if (state.difficulty === 'hardcore') {
        checkAndUnlock('HARDCORE_SURVIVOR', totalWeeks >= 26);
        checkAndUnlock('HARDCORE_LEGEND', totalWeeks >= 52);
    }
    
    // Check for Difficulty Master achievement
    const beginnerCareers = state.statistics.careersByDifficulty.beginner;
    const realisticCareers = state.statistics.careersByDifficulty.realistic;
    const hardcoreCareers = state.statistics.careersByDifficulty.hardcore;
    checkAndUnlock('DIFFICULTY_MASTER', beginnerCareers > 0 && realisticCareers > 0 && hardcoreCareers > 0);

    return { achievements: unlockedAchievements, unseenAchievements: newUnseen };
}

function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case 'START_SETUP':
            return { ...generateInitialState(), status: 'setup' };
        case 'SUBMIT_SETUP':
            return {
                ...state,
                status: 'loading',
                artistName: action.payload.name,
                artistGenre: action.payload.genre,
                difficulty: action.payload.difficulty,
                // legacy careerLog entry removed; add Date-based log in logs
                logs: appendLogToArray(state.logs, createLog(`The artist '${action.payload.name}' (${action.payload.genre}) is born!`, 'success', new Date(state.currentDate || new Date()), ''))
            };
        case 'SCENARIO_LOADING':
            return { ...state, status: 'loading' };
        case 'SCENARIO_LOADED': {
            const isFallback = action.payload.title === "An Uneventful Week";
            let newUsedTitles = state.usedScenarioTitles;
            if(action.payload.once){
                newUsedTitles = [...state.usedScenarioTitles, action.payload.title];
            }

            return {
                ...state,
                status: 'playing',
                currentScenario: action.payload,
                usedScenarioTitles: newUsedTitles,
                consecutiveFallbackCount: isFallback ? state.consecutiveFallbackCount + 1 : 0,
            };
        }
        case 'SELECT_CHOICE': {
            const { outcome } = action.payload;
            
            // Track decision in statistics
            const updatedStatistics = recordDecision(state.statistics, action.payload.text);
            
            const newStats: PlayerStats = {
                cash: Math.round(state.playerStats.cash + outcome.cash),
                fame: Math.round(Math.min(100, Math.max(0, state.playerStats.fame + outcome.fame))),
                wellBeing: Math.round(Math.min(100, Math.max(0, state.playerStats.wellBeing + outcome.wellBeing))),
                careerProgress: Math.round(Math.min(100, Math.max(0, state.playerStats.careerProgress + outcome.careerProgress))),
                hype: Math.round(Math.min(100, Math.max(0, state.playerStats.hype + outcome.hype))),
            };

            // Projects have been removed - no project handling needed

            let updatedAchievements = [...state.achievements];
            let newUnseenAchievements = [...state.unseenAchievements];

            // Handle Staff changes
            let newStaff = [...state.staff];
            let staffHiringUnlocked = state.staffHiringUnlocked;

            if (outcome.hireStaff) {
                // Scenario-based hiring: unlock staff feature and hire entry-level staff
                const existingStaff = newStaff.find(s => s.role === outcome.hireStaff);
                if (!existingStaff) {
                    // Find entry-level template for this role
                    const templateId = `${outcome.hireStaff.toUpperCase()}_ENTRY`;
                    const staffTemplate = getStaffTemplate(templateId);

                    if (staffTemplate) {
                        // Unlock staff hiring feature
                        staffHiringUnlocked = true;

                        // Hire the staff member with a 12-month contract
                        const hiredStaff = hireStaffFromTemplate(staffTemplate, 12, new Date(state.currentDate));
                        newStaff.push(hiredStaff);

                        // Check staff hiring achievements
                        const staffAchievementId = `STAFF_${outcome.hireStaff.toUpperCase()}`;
                        const staffAchievement = updatedAchievements.find(a => a.id === staffAchievementId);
                        if (staffAchievement && !staffAchievement.unlocked) {
                            staffAchievement.unlocked = true;
                            newUnseenAchievements = [...newUnseenAchievements, staffAchievement.id];
                        }
                    }
                }
            }

            // Note: fireStaff and renewStaff from outcomes are now handled through the new UI
            // These outcome properties are deprecated but kept for backward compatibility
            
            // Handle Label signing
            let newLabel: RecordLabel | null = state.currentLabel;
            let newLabelOffer: RecordLabel | null = state.currentLabelOffer;
            let newContractsViewed = [...state.contractsViewed];
            
            if(outcome.viewContract) {
                const labelTemplate = allLabels.find(l => l.name === outcome.viewContract);
                if(labelTemplate) {
                    newLabelOffer = labelTemplate;
                    if (!newContractsViewed.includes(labelTemplate.name)) {
                        newContractsViewed.push(labelTemplate.name);
                        
                        // First contract review achievement
                        if (newContractsViewed.length === 1) {
                            const firstContractAchievement = updatedAchievements.find(a => a.id === 'CONTRACT_REVIEWER');
                            if (firstContractAchievement && !firstContractAchievement.unlocked) {
                                firstContractAchievement.unlocked = true;
                                newUnseenAchievements = [...newUnseenAchievements, firstContractAchievement.id];
                            }
                        }
                        
                        // Expert contract reviewer achievement
                        if (newContractsViewed.length === 3) {
                            const expertAchievement = updatedAchievements.find(a => a.id === 'CONTRACT_EXPERT');
                            if (expertAchievement && !expertAchievement.unlocked) {
                                expertAchievement.unlocked = true;
                                newUnseenAchievements = [...newUnseenAchievements, expertAchievement.id];
                            }
                        }
                    }
                }
            }
            
            if(outcome.signLabel) {
                const labelTemplate = allLabels.find(l => l.id === outcome.signLabel);
                if(labelTemplate) {
                    newLabel = labelTemplate;
                    const signAchievement = updatedAchievements.find(a => a.id === `SIGNED_${labelTemplate.name.replace(/\s+/g, '_').toUpperCase()}`);
                    if (signAchievement && !signAchievement.unlocked) {
                        signAchievement.unlocked = true;
                        newUnseenAchievements = [...newUnseenAchievements, signAchievement.id];
                    }
                }
            }

            // Track lesson viewing
            let newLessonsViewed = [...state.lessonsViewed];
            if (outcome.lesson && !newLessonsViewed.includes(outcome.lesson.title)) {
                newLessonsViewed.push(outcome.lesson.title);
            }

            // Check for event-based achievements
            if (outcome.achievementId) {
                const eventAchievement = updatedAchievements.find(a => a.id === outcome.achievementId);
                if (eventAchievement && !eventAchievement.unlocked) {
                    eventAchievement.unlocked = true;
                    newUnseenAchievements = [...newUnseenAchievements, eventAchievement.id];
                }
            }

            const milestoneCheck = checkAchievements({...state, staff: newStaff, lessonsViewed: newLessonsViewed}, newStats);
            updatedAchievements = milestoneCheck.achievements;
            newUnseenAchievements = [...new Set([...newUnseenAchievements, ...milestoneCheck.unseenAchievements])];

            return {
                ...state,
                playerStats: newStats,
                lastOutcome: outcome,
                // legacy careerLog append removed; message added to Date-based logs instead
                logs: appendLogToArray(state.logs, createLog(outcome.text, 'info', new Date(state.currentDate || new Date()))),
                achievements: updatedAchievements,
                unseenAchievements: newUnseenAchievements,
                staff: newStaff,
                staffHiringUnlocked,
                currentLabel: newLabel,
                currentLabelOffer: newLabelOffer,
                contractsViewed: newContractsViewed,
                lessonsViewed: newLessonsViewed,
                modal: state.modal, // Let OutcomeModal handle contract viewing via button
                statistics: updatedStatistics,
            };
        }
        case 'DISMISS_OUTCOME': {
            if (state.status !== 'playing') return { ...state, lastOutcome: null };

            // --- Weekly Processing ---
            let newStats = { ...state.playerStats };
            let newStaff = [...state.staff];
            let eventsThisWeek: string[] = [];

            // Calculate total weeks played
            const currentGameDate = toGameDate(state.currentDate, state.startDate);
            const totalWeeksPlayed = (currentGameDate.year - 1) * 48 + (currentGameDate.month - 1) * 4 + currentGameDate.week;

            // Get base difficulty settings and calculate dynamic modifiers
            const settings = getDifficultySettings(state.difficulty);
            const dynamicMods = calculateDynamicModifiers(
                settings,
                totalWeeksPlayed,
                state.playerStats.careerProgress,
                state.playerStats.cash
            );

            // 1. Apply staff bonuses (weekly)
            let bonusFame = 0;
            let bonusHype = 0;
            let cashModifier = 1.0;
            newStaff.forEach(s => {
                s.bonuses.forEach(b => {
                    if (b.stat === 'fame') bonusFame += b.value;
                    if (b.stat === 'hype') bonusHype += b.value;
                    if (b.stat === 'cash') cashModifier += b.value / 100;
                });
            });
            newStats.cash = Math.floor(newStats.cash * cashModifier);

            // Advance current date by random 3-7 days
            const daysToAdvance = Math.floor(Math.random() * 5) + 3; // 3-7 days
            const newCurrentDate = new Date(state.currentDate);
            newCurrentDate.setDate(newCurrentDate.getDate() + daysToAdvance);

            // 2. Pay staff salaries MONTHLY (not weekly)
            let lastStaffPaymentDate = new Date(state.lastStaffPaymentDate);
            let shouldPayStaff = false;
            const daysSinceLastPayment = Math.floor(
                (newCurrentDate.getTime() - lastStaffPaymentDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            // Pay staff every 30 days
            if (daysSinceLastPayment >= 30 && newStaff.length > 0) {
                shouldPayStaff = true;
                lastStaffPaymentDate = new Date(newCurrentDate);

                const totalSalary = Math.floor(
                    newStaff.reduce((sum, s) => sum + s.salary, 0) *
                    dynamicMods.costMultiplier *
                    dynamicMods.inflationMultiplier
                );
                newStats.cash -= totalSalary;
                eventsThisWeek.push(`Monthly staff salaries paid: $${totalSalary.toLocaleString()}`);

                // Update staff contract time (recalculate monthsRemaining based on the advanced date)
                newStaff = updateStaffContractTime(newStaff, newCurrentDate);

                // Check for expiring contracts (< 1 month remaining)
                newStaff.forEach(s => {
                    if (s.monthsRemaining === 1) {
                        eventsThisWeek.push(`${s.name}'s contract expires in 1 month! Consider extending or replacing them.`);
                    } else if (s.monthsRemaining === 0) {
                        eventsThisWeek.push(`${s.name}'s contract has expired! They will leave unless extended.`);
                    }
                });

                // Remove staff with expired contracts
                const expiredStaff = newStaff.filter(s => s.monthsRemaining === 0);
                if (expiredStaff.length > 0) {
                    expiredStaff.forEach(s => {
                        eventsThisWeek.push(`${s.name} has left your team. Their contract expired.`);
                    });
                    newStaff = newStaff.filter(s => s.monthsRemaining > 0);
                }
            }

            // Apply minimum cash flow (living expenses) - scales with wealth
            if (settings.economicPressure.minimumCashFlow > 0) {
                // Base living expense
                const baseLivingExpense = settings.economicPressure.minimumCashFlow;

                // Calculate wealth tier and progressive multiplier
                // As you get richer, your lifestyle expands (better housing, studio, equipment, team, etc.)
                let wealthMultiplier = 1;
                let lifestyleLabel = "Basic";

                if (newStats.cash > 100000) {
                    wealthMultiplier = 20; // Superstar: $1,000/week (mansion, luxury cars, entourage)
                    lifestyleLabel = "Superstar";
                } else if (newStats.cash > 50000) {
                    wealthMultiplier = 12; // Elite: $600/week (nice house, good car, small team)
                    lifestyleLabel = "Elite";
                } else if (newStats.cash > 20000) {
                    wealthMultiplier = 7; // Established: $350/week (decent apartment, used car, basic gear)
                    lifestyleLabel = "Established";
                } else if (newStats.cash > 10000) {
                    wealthMultiplier = 4; // Rising: $200/week (better place, some equipment)
                    lifestyleLabel = "Rising";
                } else if (newStats.cash > 5000) {
                    wealthMultiplier = 2.5; // Growing: $125/week (modest upgrade)
                    lifestyleLabel = "Growing";
                } else if (newStats.cash > 2000) {
                    wealthMultiplier = 1.5; // Entry: $75/week (shared apartment)
                    lifestyleLabel = "Entry";
                }
                // else stay at base $50/week for struggling artists (living with parents/friends)

                const livingExpenses = Math.floor(baseLivingExpense * wealthMultiplier * dynamicMods.inflationMultiplier);
                newStats.cash = Math.round(newStats.cash - livingExpenses);

                // Show lifestyle tier when expenses are significant
                if (livingExpenses >= 100) {
                    eventsThisWeek.push(`Living expenses (${lifestyleLabel} lifestyle): -$${livingExpenses.toLocaleString()}`);
                } else if (livingExpenses > 0) {
                    eventsThisWeek.push(`Living expenses: -$${livingExpenses.toLocaleString()}`);
                }
            }

            // Apply debt interest (hardcore only)
            if (settings.debtInterest && newStats.cash < 0) {
                const interest = Math.floor(Math.abs(newStats.cash) * 0.03); // 3% weekly interest (reduced from 5%)
                newStats.cash -= interest;
                if (interest > 0) {
                    eventsThisWeek.push(`Debt interest: -$${interest.toLocaleString()}`);
                }
            }
            
            // Random events (realistic and hardcore) with competition frequency multiplier
            const eventChance = 0.15 * (settings.competition.enabled ? settings.competition.frequencyMultiplier : 1.0);
            if (settings.randomEvents && Math.random() < eventChance) {
                const randomEvents = state.difficulty === 'hardcore' ? [
                    // Hardcore events - more severe
                    {
                        description: 'Equipment breakdown! Emergency repair needed.',
                        cash: -800,
                        wellBeing: -8
                    },
                    {
                        description: 'Viral social media moment! Unexpected hype boost.',
                        hype: 12,
                        fame: 4
                    },
                    {
                        description: 'Show cancelled - venue went bankrupt!',
                        cash: -500,
                        wellBeing: -12
                    },
                    {
                        description: 'Radio DJ demands payment to play your song.',
                        cash: -400,
                        hype: -8
                    },
                    {
                        description: 'Tax audit - unexpected expense.',
                        cash: -1200
                    },
                    {
                        description: 'Streaming platform featuring boost!',
                        cash: 300,
                        fame: 4,
                        hype: 8
                    },
                    {
                        description: 'Staff member quits unexpectedly!',
                        wellBeing: -10,
                        hype: -5
                    },
                    {
                        description: 'Piracy hits hard - album leaked early.',
                        cash: -600,
                        hype: -10
                    },
                    {
                        description: 'Power outage ruins studio session.',
                        cash: -400,
                        wellBeing: -8
                    },
                    {
                        description: 'Influencer shares your music organically!',
                        fame: 8,
                        hype: 15
                    },
                    {
                        description: 'Rival artist releases competing album same day!',
                        fame: -6,
                        hype: -12,
                        wellBeing: -10
                    },
                    {
                        description: 'Label pressures you for faster recoupment!',
                        cash: -700,
                        wellBeing: -15
                    }
                ] : [
                    // Realistic events - balanced
                    {
                        description: 'Equipment breakdown! Emergency repair needed.',
                        cash: -500,
                        wellBeing: -5
                    },
                    {
                        description: 'Viral social media moment! Unexpected hype boost.',
                        hype: 15,
                        fame: 5
                    },
                    {
                        description: 'Show cancelled last minute due to venue issues.',
                        cash: -300,
                        wellBeing: -10
                    },
                    {
                        description: 'Local radio spontaneously plays your song!',
                        fame: 10,
                        hype: 10
                    },
                    {
                        description: 'Tax audit - unexpected expense.',
                        cash: -800
                    },
                    {
                        description: 'Streaming platform featuring boost!',
                        cash: 400,
                        fame: 5,
                        hype: 10
                    },
                    {
                        description: 'Small festival invites you last minute!',
                        cash: 600,
                        fame: 5,
                        wellBeing: -5
                    },
                    {
                        description: 'Blogger writes positive review!',
                        fame: 8,
                        hype: 12
                    },
                    {
                        description: 'Unexpected medical expense.',
                        cash: -400,
                        wellBeing: -8
                    },
                    {
                        description: 'Friend hooks you up with free studio time!',
                        cash: 300,
                        wellBeing: 5
                    },
                    {
                        description: 'Another artist drops surprise album - stealing spotlight!',
                        fame: -3,
                        hype: -8
                    },
                    {
                        description: 'Collaborative opportunity with rising star!',
                        fame: 7,
                        hype: 10,
                        cash: -200
                    }
                ];

                const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
                eventsThisWeek.push(randomEvent.description);

                // Apply volatility to event impacts
                let eventCash = randomEvent.cash || 0;
                let eventFame = randomEvent.fame || 0;
                let eventHype = randomEvent.hype || 0;

                if (settings.marketVolatility.enabled) {
                    if (eventCash !== 0) {
                        const [minSwing, maxSwing] = settings.marketVolatility.cashSwingRange;
                        const swing = minSwing + Math.random() * (maxSwing - minSwing);
                        eventCash = Math.floor(eventCash * (1 + swing));
                    }
                    if (eventFame !== 0) {
                        const swing = (Math.random() - 0.5) * 2 * settings.marketVolatility.fameVolatility;
                        eventFame = Math.floor(eventFame * (1 + swing));
                    }
                    if (eventHype !== 0) {
                        const swing = (Math.random() - 0.5) * 2 * settings.marketVolatility.hypeVolatility;
                        eventHype = Math.floor(eventHype * (1 + swing));
                    }
                }

                newStats.cash = Math.round(newStats.cash + eventCash);
                newStats.fame = Math.round(newStats.fame + eventFame);
                newStats.wellBeing = Math.round(newStats.wellBeing + (randomEvent.wellBeing || 0));
                newStats.hype = Math.round(newStats.hype + eventHype);
            }
            
            // 3. Projects removed - no project completion logic needed
            let updatedAchievements = [...state.achievements];
            let newUnseenAchievements = [...state.unseenAchievements];

            // 4. Update Stats with dynamic difficulty modifiers
            newStats.fame = Math.round(Math.min(100, Math.max(0, newStats.fame + bonusFame)));

            // Apply stat decay with dynamic difficulty modifiers
            const hypeDecay = Math.floor(2 * dynamicMods.decayMultiplier);
            const fameDecay = Math.floor(1 * dynamicMods.decayMultiplier);
            const wellBeingDecay = Math.floor(1 * dynamicMods.decayMultiplier);

            // Apply competition pressure (fame and hype drain)
            const competitionFameLoss = settings.competition.enabled ? settings.competition.fameDrain : 0;
            const competitionHypeLoss = settings.competition.enabled ? settings.competition.hypeDrain : 0;

            newStats.hype = Math.round(Math.min(100, Math.max(0, newStats.hype + bonusHype - hypeDecay - competitionHypeLoss)));
            newStats.fame = Math.round(Math.min(100, Math.max(0, newStats.fame - fameDecay - competitionFameLoss)));
            newStats.wellBeing = Math.round(Math.min(100, Math.max(0, newStats.wellBeing - wellBeingDecay)));
            newStats.careerProgress = Math.round(Math.min(100, Math.max(0, newStats.careerProgress)));

            // Log if significant competition impact
            if (totalWeeksPlayed > 10 && settings.competition.enabled && (competitionFameLoss + competitionHypeLoss) > 2) {
                eventsThisWeek.push(`Competition from other artists is heating up! (-${competitionFameLoss.toFixed(1)} fame, -${competitionHypeLoss.toFixed(1)} hype)`);
            }
            
            // newCurrentDate was advanced earlier before salary/payment logic

            // Determine game-week derived from newCurrentDate
            const newGameDate = toGameDate(newCurrentDate, state.startDate);
            let newHistory = [...state.currentHistory];
            if (totalWeeksPlayed % 4 === 0) {
                newHistory.push({
                    week: totalWeeksPlayed,
                    cash: newStats.cash,
                    fame: newStats.fame,
                    wellBeing: newStats.wellBeing,
                    hype: newStats.hype,
                    careerProgress: newStats.careerProgress,
                    eventDescription: eventsThisWeek.join(' ')
                });
            }

            // Update statistics (pass through a derived legacy date for calculation where needed)
            let newStatistics = updateStatistics({...state, playerStats: newStats, date: newGameDate as any}, state.statistics);

            // 6. Update Staff Contracts - monthsRemaining already updated earlier when we advanced the date
            const soonToExpire = newStaff.find(s => s.monthsRemaining === 0);
            if (soonToExpire) {
                eventsThisWeek.push(`${soonToExpire.name}'s contract has expired! You'll need to decide whether to renew.`);
            }
            
            // 7. Check Game Over Grace Period
            const gracePeriod = settings.gracePeriodWeeks;
            
            let newDebtTurns = newStats.cash < 0 ? state.debtTurns + 1 : 0;
            let newBurnoutTurns = newStats.wellBeing <= 0 ? state.burnoutTurns + 1 : 0;
            let newStatus: GameState['status'] = 'playing';
            let newGameOverReason: GameState['gameOverReason'] = null;

            if (newDebtTurns > gracePeriod) {
                newStatus = 'gameOver';
                newGameOverReason = 'debt';
            } else if (newBurnoutTurns > gracePeriod) {
                newStatus = 'gameOver';
                newGameOverReason = 'burnout';
            }

            // Handle game end
            if (newStatus === 'gameOver' && newGameOverReason) {
                // Determine outcome
                const outcome = newGameOverReason === 'debt' ? 'debt' : 'burnout';

                // Record game end
                newStatistics = recordGameEnd(
                    {...state, playerStats: newStats, status: 'gameOver', gameOverReason: newGameOverReason},
                    newStatistics,
                    outcome
                );

                // Save career history
                const careerHistory: CareerHistory = {
                    gameId: `game_${Date.now()}`,
                    artistName: state.artistName,
                    genre: state.artistGenre,
                    difficulty: state.difficulty,
                    startDate: state.sessionStartTime,
                    endDate: Date.now(),
                    finalStats: newStats,
                    weeksPlayed: totalWeeksPlayed,
                    outcome: outcome,
                    historicalData: newHistory,
                    majorEvents: (state.logs && state.logs.length > 0) ? state.logs.slice(-10).reverse().map(l => ({ message: l.message, timestamp: l.timestamp.getTime() })) : [],
                    achievementsEarned: state.achievements.filter(a => a.unlocked).map(a => a.name),
                    lessonsLearned: state.lessonsViewed,
                    contractsSigned: state.currentLabel ? [state.currentLabel.name] : [],
                    highestCash: Math.max(...newHistory.map(h => h.cash), state.playerStats.cash),
                    lowestCash: Math.min(...newHistory.map(h => h.cash), state.playerStats.cash),
                    peakFame: Math.max(...newHistory.map(h => h.fame), state.playerStats.fame),
                    peakCareerProgress: Math.max(...newHistory.map(h => h.careerProgress), state.playerStats.careerProgress)
                };
                saveCareerHistory(careerHistory);
            }

            // Save statistics after each turn
            saveStatistics(newStatistics);

            const milestoneCheck = checkAchievements({...state, achievements: updatedAchievements}, newStats);
            const finalUnseenAchievements = [...new Set([...newUnseenAchievements, ...milestoneCheck.unseenAchievements])];

            // Auto-unlock staff hiring based on difficulty level
            let staffHiringUnlocked = state.staffHiringUnlocked;
            if (!staffHiringUnlocked) {
                const unlockThresholds = {
                    beginner: 20,
                    realistic: 35,
                    hardcore: 50
                };
                const threshold = unlockThresholds[state.difficulty];

                    if (newStats.fame >= threshold) {
                    staffHiringUnlocked = true;
                    eventsThisWeek.push(`You've reached ${threshold} Fame! You can now hire professional staff from the Management Hub!`);
                }
            }

            // Track fame threshold for contract eligibility (3 weeks at minimum fame)
            let fameThresholdWeeks = state.fameThresholdWeeks;
            let contractEligibilityUnlocked = state.contractEligibilityUnlocked;

            if (!contractEligibilityUnlocked) {
                const contractFameThresholds = {
                    beginner: 40,  // Lower threshold for beginner
                    realistic: 50, // Lower threshold for realistic (was 75)
                    hardcore: 65   // Lower threshold for hardcore (was 90)
                };
                const requiredFame = contractFameThresholds[state.difficulty];
                const requiredWeeks = 3; // Must maintain for 3 consecutive weeks

                // Increment counter if fame is at or above threshold
                if (newStats.fame >= requiredFame) {
                    fameThresholdWeeks++;

                    // Unlock after maintaining threshold for required weeks
                    if (fameThresholdWeeks >= requiredWeeks) {
                        contractEligibilityUnlocked = true;
                        eventsThisWeek.push(`🎵 You've maintained ${requiredFame}+ Fame for ${requiredWeeks} weeks! Record labels are starting to notice you...`);
                    }
                } else {
                    // Reset counter if fame drops below threshold
                    fameThresholdWeeks = 0;
                }
            }

            const newLogs = eventsThisWeek.length > 0 ? appendLogToArray(state.logs, createLog(eventsThisWeek.join(' '), 'info', new Date(newCurrentDate))) : state.logs;

            return {
                ...state,
                status: newStatus,
                lastOutcome: null,
                currentScenario: null,
                playerStats: newStats,
                // legacy `date` removed; `currentDate` represents actual timeline
                currentDate: newCurrentDate,
                // careerLog removed; preserve only Date-based logs
                logs: newLogs,
                achievements: milestoneCheck.achievements,
                unseenAchievements: finalUnseenAchievements,
                staff: newStaff,
                staffHiringUnlocked,
                lastStaffPaymentDate,
                debtTurns: newDebtTurns,
                burnoutTurns: newBurnoutTurns,
                gameOverReason: newGameOverReason,
                statistics: newStatistics,
                currentHistory: newHistory,
                fameThresholdWeeks,
                contractEligibilityUnlocked,
            };
        }
        case 'RESTART': {
            // Record abandoned career if there was an active game
            if (state.artistName) {
                const gd = toGameDate(state.currentDate, state.startDate);
                const totalWeeks = (gd.year - 1) * 48 + (gd.month - 1) * 4 + gd.week;
                const updatedStats = recordGameEnd(state, state.statistics, 'abandoned');
                
                const careerHistory: CareerHistory = {
                    gameId: `game_${Date.now()}`,
                    artistName: state.artistName,
                    genre: state.artistGenre,
                    difficulty: state.difficulty,
                    startDate: state.sessionStartTime,
                    endDate: Date.now(),
                    finalStats: state.playerStats,
                    weeksPlayed: totalWeeks,
                    outcome: 'abandoned',
                    historicalData: state.currentHistory,
                    majorEvents: (state.logs && state.logs.length > 0) ? state.logs.slice(-10).reverse().map(l => ({ message: l.message, timestamp: l.timestamp.getTime() })) : [],
                    
                    achievementsEarned: state.achievements.filter(a => a.unlocked).map(a => a.name),
                    lessonsLearned: state.lessonsViewed,
                    contractsSigned: state.currentLabel ? [state.currentLabel.name] : [],
                    highestCash: Math.max(...state.currentHistory.map(h => h.cash), state.playerStats.cash),
                    lowestCash: Math.min(...state.currentHistory.map(h => h.cash), state.playerStats.cash),
                    peakFame: Math.max(...state.currentHistory.map(h => h.fame), state.playerStats.fame),
                    peakCareerProgress: Math.max(...state.currentHistory.map(h => h.careerProgress), state.playerStats.careerProgress)
                };
                saveCareerHistory(careerHistory);
                saveStatistics(updatedStats);
            }

            const newState = generateInitialState(state.artistName, state.artistGenre);
            return {
                ...newState,
                status: 'loading',
                statistics: state.statistics // Preserve statistics across restarts
            };
        }
        case 'RESET_TO_LANDING': {
            // Reset to landing page after logout (don't record as abandoned since we saved before logout)
            const freshState = generateInitialState();
            return {
                ...freshState,
                status: 'start', // Go to start screen, not setup
                statistics: state.statistics // Preserve statistics across resets
            };
        }
        case 'VIEW_MANAGEMENT_HUB':
            // Don't clear unseenAchievements immediately - let notifications show first
            return { ...state, modal: 'management' };
        case 'VIEW_SAVE_LOAD':
            return { ...state, modal: 'saveload' };
        case 'VIEW_LEARNING_HUB':
            return { ...state, modal: 'learning' };
        case 'VIEW_STATISTICS':
            return { ...state, modal: 'statistics' };
        case 'OPEN_MODULE':
            return { ...state, modal: 'moduleViewer', currentModule: action.payload };
        case 'COMPLETE_MODULE': {
            const { moduleId, score, conceptsMastered } = action.payload;
            const newKnowledge = { ...state.playerKnowledge };
            
            // Add to completed modules if not already there
            if (!newKnowledge.completedModules.includes(moduleId)) {
                newKnowledge.completedModules.push(moduleId);
            }
            
            // Update score (keep the highest score)
            const currentScore = newKnowledge.moduleScores[moduleId] || 0;
            newKnowledge.moduleScores[moduleId] = Math.max(currentScore, score);
            
            // Update quiz attempts
            newKnowledge.quizAttempts[moduleId] = (newKnowledge.quizAttempts[moduleId] || 0) + 1;
            
            // Add new concepts mastered
            conceptsMastered.forEach(concept => {
                if (!newKnowledge.conceptsMastered.includes(concept)) {
                    newKnowledge.conceptsMastered.push(concept);
                }
            });
            
            return { 
                ...state, 
                playerKnowledge: newKnowledge,
                modal: 'learning',
                currentModule: null
            };
        }
        case 'CLOSE_MODULE':
            return { ...state, modal: 'learning', currentModule: null };
        case 'CLOSE_MODAL':
            return { ...state, modal: 'none', currentModule: null };
        case 'VIEW_CONTRACT':
            return { ...state, modal: 'contract' };
        case 'SIGN_CONTRACT': {
            if (!state.currentLabelOffer) return state;

            // Calculate dynamic modifiers for contract
            const currentGameDate = toGameDate(state.currentDate, state.startDate);
            const totalWeeksPlayed = (currentGameDate.year - 1) * 48 + (currentGameDate.month - 1) * 4 + currentGameDate.week;
            const settings = getDifficultySettings(state.difficulty);
            const dynamicMods = calculateDynamicModifiers(
                settings,
                totalWeeksPlayed,
                state.playerStats.careerProgress,
                state.playerStats.cash
            );
            const adjustedAdvance = Math.floor(state.currentLabelOffer.terms.advance * dynamicMods.incomeMultiplier);

            const newStats = { ...state.playerStats };
            newStats.cash += adjustedAdvance;
            newStats.fame += 10;
            newStats.hype += 15;
            newStats.careerProgress += 15;

            let updatedAchievements = [...state.achievements];
            let newUnseenAchievements = [...state.unseenAchievements];

            const signAchievement = updatedAchievements.find(a => a.id === `SIGNED_${state.currentLabelOffer.name.replace(/\s+/g, '_').toUpperCase()}`);
            if (signAchievement && !signAchievement.unlocked) {
                signAchievement.unlocked = true;
                newUnseenAchievements = [...newUnseenAchievements, signAchievement.id];
            }

            // Create an outcome to show what happened
            const signOutcome = {
                text: `You've signed with ${state.currentLabelOffer.name}! You received a $${adjustedAdvance.toLocaleString()} advance. Your fame, hype, and career progress have all increased significantly.`,
                cash: adjustedAdvance,
                fame: 10,
                wellBeing: 0,
                careerProgress: 15,
                hype: 15
            };

            return {
                ...state,
                playerStats: newStats,
                currentLabel: state.currentLabelOffer,
                currentLabelOffer: null,
                modal: 'none',
                achievements: updatedAchievements,
                unseenAchievements: newUnseenAchievements,
                lastOutcome: signOutcome,
                // legacy careerLog append removed; Date-based log added instead
                logs: appendLogToArray(state.logs, createLog(`Signed with ${state.currentLabelOffer.name}! Received $${adjustedAdvance.toLocaleString()} advance.`, 'success', new Date(state.currentDate || new Date())))
            };
        }
        case 'DECLINE_CONTRACT': {
            let updatedAchievements = [...state.achievements];
            let newUnseenAchievements = [...state.unseenAchievements];

            // Walk away achievement
            const walkAwayAchievement = updatedAchievements.find(a => a.id === 'WALKED_AWAY');
            if (walkAwayAchievement && !walkAwayAchievement.unlocked) {
                walkAwayAchievement.unlocked = true;
                newUnseenAchievements = [...newUnseenAchievements, walkAwayAchievement.id];
            }

            // Create an outcome to show what happened
            const declineOutcome = {
                text: `You declined the contract offer from ${state.currentLabelOffer?.name || 'the record label'}. Sometimes the best deal is no deal. You maintain full control of your career.`,
                cash: 0,
                fame: 0,
                wellBeing: 5,
                careerProgress: 0,
                hype: 0
            };

            return {
                ...state,
                currentLabelOffer: null,
                modal: 'none',
                achievements: updatedAchievements,
                unseenAchievements: newUnseenAchievements,
                lastOutcome: declineOutcome,
                // legacy careerLog append removed; Date-based log added instead
                logs: appendLogToArray(state.logs, createLog(`Declined the contract offer from ${state.currentLabelOffer?.name || 'the record label'}. Sometimes the best deal is no deal.`, 'info', new Date(state.currentDate || new Date())))
            };
        }
        case 'LOAD_GAME':
            return { ...action.payload, status: 'playing' };
        case 'START_TUTORIAL':
            // Mark tutorial as seen in localStorage (persistent)
            // This ensures even if user closes browser mid-tutorial, it won't show again
            try {
                localStorage.setItem('musicsim_tutorial_seen', 'true');
            } catch (e) {
                console.error('Failed to save tutorial seen flag:', e);
            }
            return {
                ...state,
                tutorial: {
                    active: true,
                    currentStep: 0,
                    completed: false,
                    skipped: false,
                    stepsCompleted: [],
                    startTime: Date.now()
                }
            };
        case 'NEXT_TUTORIAL_STEP':
            return {
                ...state,
                tutorial: {
                    ...state.tutorial,
                    currentStep: state.tutorial.currentStep + 1,
                    stepsCompleted: [...state.tutorial.stepsCompleted, state.tutorial.currentStep.toString()]
                }
            };
        case 'PREVIOUS_TUTORIAL_STEP':
            return {
                ...state,
                tutorial: {
                    ...state.tutorial,
                    currentStep: Math.max(0, state.tutorial.currentStep - 1)
                }
            };
        case 'SKIP_TUTORIAL':
            // Mark tutorial as seen in localStorage (persistent)
            try {
                localStorage.setItem('musicsim_tutorial_seen', 'true');
            } catch (e) {
                console.error('Failed to save tutorial seen flag:', e);
            }
            return {
                ...state,
                tutorial: {
                    ...state.tutorial,
                    active: false,
                    skipped: true
                }
            };
        case 'COMPLETE_TUTORIAL': {
            // Mark tutorial as seen in localStorage (persistent)
            try {
                localStorage.setItem('musicsim_tutorial_seen', 'true');
            } catch (e) {
                console.error('Failed to save tutorial seen flag:', e);
            }

            const updatedStatistics = updateStatistics(state, state.statistics);

            // Check for tutorial achievements
            const completionTime = state.tutorial.startTime ? Date.now() - state.tutorial.startTime : 0;
            const { achievements: updatedAchievements, unseenAchievements: newUnseenAchievements } =
                checkAchievements({
                    ...state,
                    tutorial: {
                        ...state.tutorial,
                        completed: true
                    }
                }, state.playerStats);

            // Additional check for EAGER_LEARNER (complete in under 5 minutes)
            let finalAchievements = updatedAchievements;
            let finalUnseen = newUnseenAchievements;

            if (completionTime < 5 * 60 * 1000) { // 5 minutes in milliseconds
                const eagerLearnerAchievement = finalAchievements.find(a => a.id === 'EAGER_LEARNER');
                if (eagerLearnerAchievement && !eagerLearnerAchievement.unlocked) {
                    eagerLearnerAchievement.unlocked = true;
                    if (!finalUnseen.includes('EAGER_LEARNER')) {
                        finalUnseen = [...finalUnseen, 'EAGER_LEARNER'];
                    }
                }
            }

            return {
                ...state,
                tutorial: {
                    ...state.tutorial,
                    active: false,
                    completed: true
                },
                statistics: updatedStatistics,
                achievements: finalAchievements,
                unseenAchievements: [...state.unseenAchievements, ...finalUnseen]
            };
        }
        case 'CLEAR_UNSEEN_ACHIEVEMENTS':
            return { ...state, unseenAchievements: [] };

        case 'UNLOCK_STAFF_HIRING':
            return {
                ...state,
                staffHiringUnlocked: true,
                logs: appendLogToArray(state.logs, createLog('You can now hire professional staff to boost your career!', 'success', new Date(state.currentDate || new Date()), ''))
            };

        case 'HIRE_STAFF': {
            const { templateId, contractDuration } = action.payload;
            const template = getStaffTemplate(templateId);

            if (!template) {
                return state; // Template not found
            }

            // Cash capacity check: Must be able to afford 3 months of salary minimum
            // This ensures financial stability and prevents immediate bankruptcy
            const minimumCashRequired = template.salary * 3;
            if (state.playerStats.cash < minimumCashRequired) {
                return state; // Can't afford - UI should prevent this
            }

            // Check if player already has this role
            const hasRole = state.staff.some(s => s.role === template.role);
            if (hasRole) {
                return state; // Already has this role - UI should prevent this
            }

            // Hire the staff - deduct first month's salary immediately
            const hiredStaff = hireStaffFromTemplate(template, contractDuration, new Date(state.currentDate));
            const newStats = { ...state.playerStats, cash: state.playerStats.cash - template.salary };
            // Construct an outcome modal payload that mirrors the old scenario-based outcome
            const hireOutcome = (() => {
                if (template.role === 'Manager') {
                    return {
                        text: `You put out feelers and a respected local manager agrees to take you on. Their services aren't cheap, but the relief is immediate.`,
                        cash: 0,
                        fame: 0,
                        wellBeing: 10,
                        careerProgress: 0,
                        hype: 0,
                        audioFile: '/audio/scenarios/first-staff-hire.m4a',
                        autoPlayAudio: true,
                        lesson: {
                            title: 'The Value of Professional Management',
                            explanation: "A good manager handles business so you can focus on creativity. They take 10-20% of your income but often increase your earnings by far more through better deals and opportunities.",
                            realWorldExample: "Davido's manager helped negotiate his Sony Music deal and international collaborations. The 15% management fee paid for itself through better contract terms and global opportunities.",
                            tipForFuture: 'Look for managers with industry connections and a track record of growing artists\' careers. Their network and experience are worth the commission.',
                            conceptTaught: 'Contract Basics'
                        }
                    };
                }

                if (template.role === 'Booker') {
                    return {
                        text: 'You connect with a local booker who has connections to all the best venues. Gigs start rolling in almost immediately.',
                        cash: 0,
                        fame: 0,
                        wellBeing: 5,
                        careerProgress: 0,
                        hype: 0,
                        lesson: {
                            title: 'The Power of Industry Connections',
                            explanation: "Bookers have relationships that take years to build. Their network and reputation can open doors that would remain closed to new artists trying to book directly.",
                            realWorldExample: 'Successful booking agents in Lagos and Johannesburg often represent multiple artists, giving them leverage when negotiating with venues and festivals.',
                            tipForFuture: 'Invest in people who have the relationships you need. Their connections are often worth more than their fees.',
                            conceptTaught: 'Revenue Streams'
                        }
                    };
                }

                // Promoter
                return {
                    text: 'You bring on a savvy promoter who immediately starts getting your name out there. Blog posts and radio interviews follow.',
                    cash: 0,
                    fame: 0,
                    wellBeing: 5,
                    careerProgress: 0,
                    hype: 0,
                    lesson: {
                        title: 'Professional Promotion vs DIY Marketing',
                        explanation: "Promoters have relationships with playlist curators, radio DJs, and influencers that take years to develop. Their credibility can get your music heard by the right people.",
                        realWorldExample: 'Many Afrobeats artists gained international recognition through promoters who had connections with global playlist curators and international radio stations.',
                        tipForFuture: 'Good promotion is an investment, not an expense. The right promoter can multiply your reach far beyond what you could achieve alone.',
                        conceptTaught: 'Branding and Image'
                    }
                };
            })();

            return {
                ...state,
                staff: [...state.staff, hiredStaff],
                playerStats: newStats,
                // Keep a concise log entry and also surface the hire outcome as the lastOutcome so the OutcomeModal shows
                logs: appendLogToArray(
                    state.logs,
                    createLog(
                        `Hired ${hiredStaff.name} as your ${hiredStaff.role} for ${contractDuration} months! First month's salary: $${template.salary.toLocaleString()}. (Minimum cash capacity: $${minimumCashRequired.toLocaleString()})`,
                        'success',
                        new Date(state.currentDate || new Date()),
                        ''
                    )
                ),
                lastOutcome: hireOutcome as any
            };
        }

        case 'TERMINATE_STAFF': {
            const { staffIndex } = action.payload;

            if (staffIndex < 0 || staffIndex >= state.staff.length) {
                return state; // Invalid index
            }

            const terminatedStaff = state.staff[staffIndex];
            const newStaff = state.staff.filter((_, i) => i !== staffIndex);

            // Base termination penalty: pay 2 months salary
            const basePenalty = terminatedStaff.salary * 2;
            let severance = basePenalty;
            let wellBeingLoss = 5;
            const additionalEffects: { stat: string; value: number; label: string }[] = [];

            // Generate varied outcomes based on staff tier and role
            const outcomeRoll = Math.random();
            let outcomeMessage = '';

            if (terminatedStaff.tier === 'elite') {
                // Elite staff terminations have bigger consequences
                if (outcomeRoll < 0.3) {
                    // Bad outcome: Industry backlash
                    outcomeMessage = `${terminatedStaff.name} didn't take the termination well. Word spreads in the industry about your decision, damaging your reputation.`;
                    wellBeingLoss = 10;
                    additionalEffects.push({ stat: 'fame', value: -3, label: 'Industry Reputation' });
                } else if (outcomeRoll < 0.6) {
                    // Neutral outcome
                    outcomeMessage = `${terminatedStaff.name} understood it was business. They move on professionally, but the separation still stings.`;
                    wellBeingLoss = 7;
                } else {
                    // Good outcome: Mutual respect
                    outcomeMessage = `${terminatedStaff.name} appreciated your honesty. They leave on good terms and even recommend you to their network before departing.`;
                    wellBeingLoss = 4;
                    additionalEffects.push({ stat: 'fame', value: 1, label: 'Professional Respect' });
                }
            } else if (terminatedStaff.tier === 'expert') {
                // Expert staff terminations
                if (outcomeRoll < 0.25) {
                    // Bad outcome: Legal complications
                    outcomeMessage = `${terminatedStaff.name} disputes the termination terms. Legal complications increase the severance cost.`;
                    severance = basePenalty * 1.5;
                    wellBeingLoss = 8;
                } else if (outcomeRoll < 0.6) {
                    // Neutral outcome
                    outcomeMessage = `${terminatedStaff.name} accepts the termination. It's awkward but professional. You feel the weight of the decision.`;
                    wellBeingLoss = 6;
                } else {
                    // Good outcome: Grateful exit
                    outcomeMessage = `${terminatedStaff.name} thanks you for the opportunity and leaves gracefully. You feel relieved it went smoothly.`;
                    wellBeingLoss = 3;
                }
            } else if (terminatedStaff.tier === 'professional') {
                // Professional staff terminations
                if (outcomeRoll < 0.3) {
                    // Bad outcome: Team morale hit
                    outcomeMessage = `${terminatedStaff.name} was well-liked. Their termination creates tension and affects team morale.`;
                    wellBeingLoss = 7;
                    additionalEffects.push({ stat: 'hype', value: -2, label: 'Team Morale Impact' });
                } else if (outcomeRoll < 0.7) {
                    // Neutral outcome
                    outcomeMessage = `${terminatedStaff.name} takes the news professionally. The termination is clean, but you still feel guilty about it.`;
                    wellBeingLoss = 5;
                } else {
                    // Good outcome: Amicable split
                    outcomeMessage = `${terminatedStaff.name} saw it coming and already had backup plans. The split is amicable and stress-free.`;
                    wellBeingLoss = 2;
                }
            } else {
                // Entry level staff terminations
                if (outcomeRoll < 0.35) {
                    // Bad outcome: Emotional reaction
                    outcomeMessage = `${terminatedStaff.name} is devastated by the news. Their emotional reaction weighs heavily on your conscience.`;
                    wellBeingLoss = 8;
                } else if (outcomeRoll < 0.7) {
                    // Neutral outcome
                    outcomeMessage = `${terminatedStaff.name} is disappointed but understands. You pay the severance and part ways professionally.`;
                    wellBeingLoss = 5;
                } else {
                    // Good outcome: New opportunities
                    outcomeMessage = `${terminatedStaff.name} actually thanks you - they just got a better offer elsewhere! The severance helps them transition smoothly.`;
                    wellBeingLoss = 1;
                    additionalEffects.push({ stat: 'wellBeing', value: 2, label: 'Good Deed Bonus' });
                }
            }

            // Apply stat changes
            const newStats = {
                ...state.playerStats,
                cash: state.playerStats.cash - severance,
                wellBeing: Math.max(0, state.playerStats.wellBeing - wellBeingLoss)
            };

            // Apply additional effects
            additionalEffects.forEach(effect => {
                if (effect.stat === 'fame') {
                    newStats.fame = Math.max(0, newStats.fame + effect.value);
                } else if (effect.stat === 'hype') {
                    newStats.hype = Math.max(0, newStats.hype + effect.value);
                } else if (effect.stat === 'wellBeing') {
                    newStats.wellBeing = Math.min(100, newStats.wellBeing + effect.value);
                }
            });

            // Create termination outcome
            const terminationOutcome = {
                type: 'termination' as const,
                staff: terminatedStaff,
                message: outcomeMessage,
                severance,
                wellBeingLoss,
                additionalEffects
            };

            return {
                ...state,
                staff: newStaff,
                playerStats: newStats,
                logs: appendLogToArray(
                    state.logs,
                    createLog(
                        `Terminated ${terminatedStaff.name}'s contract. Severance pay: $${severance.toLocaleString()}. Well-being -${wellBeingLoss}.`,
                        'warning',
                        new Date(state.currentDate || new Date()),
                        '⚠️'
                    )
                ),
                lastOutcome: terminationOutcome as any
            };
        }

        case 'EXTEND_STAFF_CONTRACT': {
            const { staffIndex, additionalMonths } = action.payload;

            if (staffIndex < 0 || staffIndex >= state.staff.length) {
                return state; // Invalid index
            }

            const staffMember = state.staff[staffIndex];

            // Extension bonus: pay 1 month upfront
            const extensionFee = staffMember.salary;
            if (state.playerStats.cash < extensionFee) {
                return state; // Can't afford - UI should prevent this
            }

            // Extend the contract
            const newExpiresDate = new Date(staffMember.contractExpiresDate);
            newExpiresDate.setMonth(newExpiresDate.getMonth() + additionalMonths);

            const updatedStaff = [...state.staff];
            updatedStaff[staffIndex] = {
                ...staffMember,
                contractExpiresDate: newExpiresDate,
                monthsRemaining: staffMember.monthsRemaining + additionalMonths
            };

            const newStats = {
                ...state.playerStats,
                cash: state.playerStats.cash - extensionFee,
                wellBeing: Math.min(100, state.playerStats.wellBeing + 3) // Positive morale boost
            };

            return {
                ...state,
                staff: updatedStaff,
                playerStats: newStats,
                logs: appendLogToArray(
                    state.logs,
                    createLog(
                        `Extended ${staffMember.name}'s contract by ${additionalMonths} months! Extension fee: $${extensionFee.toLocaleString()}. Your team appreciates your commitment.`,
                        'success',
                        new Date(state.currentDate || new Date()),
                        ''
                    )
                )
            };
        }

        case 'MARK_UNLOCKS_SHOWN':
            return {
                ...state,
                unlocksShown: [...state.unlocksShown, ...action.unlockIds]
            };

        default:
            return state;
    }
}

// Helper function to detect bad choices for beginner mode
const isBadChoice = (outcome: any, difficulty: Difficulty): boolean => {
    if (difficulty !== 'beginner') return false;
    
    // Define what constitutes a "bad" choice for warnings
    if (outcome.cash < -1000) return true;
    if (outcome.wellBeing < -20) return true;
    if (outcome.fame < -10) return true;
    if (outcome.careerProgress < -5) return true;
    
    return false;
};

const getPredictedOutcome = (outcome: any): string => {
    const negativeEffects = [];
    if (outcome.cash < -500) negativeEffects.push(`lose $${Math.abs(outcome.cash).toLocaleString()}`);
    if (outcome.wellBeing < -10) negativeEffects.push(`lose ${Math.abs(outcome.wellBeing)} well-being`);
    if (outcome.fame < -5) negativeEffects.push(`lose ${Math.abs(outcome.fame)} fame`);
    if (outcome.careerProgress < -3) negativeEffects.push(`lose ${Math.abs(outcome.careerProgress)} career progress`);
    
    if (negativeEffects.length === 0) return "This choice might have unexpected negative consequences.";
    return `This choice will likely make you ${negativeEffects.join(", ")}.`;
};

const StartScreen: React.FC<{ onStart: () => void, onContinue: (save: GameState) => void }> = ({ onStart, onContinue }) => {
    const [autosaveExists, setAutosaveExists] = useState(false);
    const [autosaveAge, setAutosaveAge] = useState<number | null>(null);
    const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
    const [loadingSaves, setLoadingSaves] = useState(true);
    const [loadingSlotId, setLoadingSlotId] = useState<string | null>(null);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    useEffect(() => {
        const checkAutosave = () => {
            setAutosaveExists(hasValidAutosave());
            setAutosaveAge(getAutosaveAge());
        };

        checkAutosave();

        // Update every 10 seconds
        const interval = setInterval(checkAutosave, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const loadSaves = async () => {
            setLoadingSaves(true);
            try {
                const slots = await getAllSaveSlots();
                // Filter out autosave from the list
                setSaveSlots(slots.filter(slot => slot.id !== 'auto'));
            } catch (error) {
                console.error('Failed to load save slots:', error);
                setSaveSlots([]);
            } finally {
                setLoadingSaves(false);
            }
        };

        loadSaves();
    }, []);

    const handleContinue = async () => {
        if (loadingSlotId) return; // Prevent double-clicking
        
        setLoadingSlotId('auto');
        setLoadingError(null);
        
        try {
            const save = await loadGame('auto');
            if (save) {
                onContinue(save);
            } else {
                setLoadingError('Autosave has expired or does not exist');
            }
        } catch (error) {
            console.error('Failed to load autosave:', error);
            setLoadingError('Failed to load autosave');
        } finally {
            setLoadingSlotId(null);
        }
    };

    const handleLoadSave = async (slotId: string) => {
        if (loadingSlotId) return; // Prevent double-clicking
        
        setLoadingSlotId(slotId);
        setLoadingError(null);
        
        try {
            console.log(`Loading save: ${slotId}`);
            const save = await loadGame(slotId);
            if (save) {
                console.log(`Successfully loaded: ${slotId}`);
                onContinue(save);
            } else {
                console.error(`Failed to load save: ${slotId} - No save data returned`);
                setLoadingError('Failed to load save - save data may be corrupted');
            }
        } catch (error) {
            console.error(`Failed to load save: ${slotId}`, error);
            setLoadingError(`Failed to load save: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoadingSlotId(null);
        }
    };

    return (
        <div className="text-center p-4 sm:p-6 flex flex-col items-center justify-center h-full animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500 mb-2">Welcome to MusicSim</h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-md mb-4">Your journey in the music industry starts now. Make wise decisions to build a legendary career.</p>

            <div className="space-y-4 w-full max-w-2xl">
                {/* Error Display */}
                {loadingError && (
                    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4">
                        <p className="text-red-400 text-sm">{loadingError}</p>
                        <button 
                            onClick={() => setLoadingError(null)}
                            className="text-red-300 hover:text-red-200 text-xs mt-2 underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {autosaveExists && (
                    <button
                        onClick={handleContinue}
                        disabled={loadingSlotId === 'auto'}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative"
                    >
                        {loadingSlotId === 'auto' ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <>
                                Continue Game
                                {autosaveAge !== null && (
                                    <span className="block text-xs mt-0.5 opacity-75">
                                        Last saved {autosaveAge} {autosaveAge === 1 ? 'minute' : 'minutes'} ago
                                        {autosaveAge >= 8 && ' (expires soon!)'}
                                    </span>
                                )}
                            </>
                        )}
                    </button>
                )}

                {/* Existing Save Slots */}
                {!loadingSaves && saveSlots.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-base font-semibold text-gray-300 mb-3 flex items-center justify-between">
                            <span>Your Careers ({saveSlots.length}/5)</span>
                            <div className="hidden sm:flex text-xs text-gray-500">
                                <span>Click to continue</span>
                            </div>
                        </h3>

                        {/* Desktop/Tablet Grid Layout */}
                        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {saveSlots.map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() => handleLoadSave(slot.id)}
                                    disabled={loadingSlotId === slot.id}
                                    className="bg-gray-800/60 border border-gray-700 hover:border-red-400 hover:bg-gray-800/80 text-left p-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/10 group disabled:opacity-60 disabled:cursor-not-allowed relative"
                                >
                                    {/* Loading Overlay */}
                                    {loadingSlotId === slot.id && (
                                        <div className="absolute inset-0 bg-gray-900/80 rounded-xl flex items-center justify-center">
                                            <div className="flex items-center gap-2 text-red-300">
                                                <div className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-sm font-medium">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="space-y-2">
                                        {/* Header with artist name and genre */}
                                        <div className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs text-gray-500 mb-0.5">
                                                    {slot.slotName}
                                                </div>
                                                <div className="font-bold text-sm text-red-300 truncate group-hover:text-red-200 transition-colors">
                                                    {slot.artistName}
                                                </div>
                                                <div className="text-xs text-gray-400 capitalize">
                                                    {getGenreLabel(slot.genre)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="space-y-0.5">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Progress</span>
                                                <span className="text-red-300 font-medium">{slot.careerProgress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-1">
                                                <div
                                                    className="bg-gradient-to-r from-red-700 to-rose-500 h-1 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(slot.careerProgress, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Stats row */}
                                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                                            <div className="bg-gray-900/50 rounded p-1.5">
                                                <div className="text-gray-500 text-[10px]">Cash</div>
                                                <div className="text-green-400 font-mono font-semibold text-xs">${slot.stats.cash.toLocaleString()}</div>
                                            </div>
                                            <div className="bg-gray-900/50 rounded p-1.5">
                                                <div className="text-gray-500 text-[10px]">Fame</div>
                                                <div className="text-yellow-400 font-semibold text-xs">{Math.round(slot.stats.fame)}</div>
                                            </div>
                                        </div>

                                        {/* Date info */}
                                        <div className="flex justify-between items-center pt-0.5">
                                            <div className="text-[10px] text-gray-500">
                                                Y{slot.date.year}, W{slot.date.week}
                                            </div>
                                            <div className="text-[10px] text-gray-400">
                                                {new Date(slot.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Mobile List Layout */}
                        <div className="md:hidden space-y-2">
                            {saveSlots.map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() => handleLoadSave(slot.id)}
                                    disabled={loadingSlotId === slot.id}
                                    className="w-full bg-gray-800/60 border border-gray-700 hover:border-red-400 hover:bg-gray-800/80 text-left p-3 rounded-lg transition-all duration-200 active:scale-[0.98] group disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none relative"
                                >
                                    {/* Loading Overlay */}
                                    {loadingSlotId === slot.id && (
                                        <div className="absolute inset-0 bg-gray-900/80 rounded-xl flex items-center justify-center">
                                            <div className="flex items-center gap-2 text-red-300">
                                                <div className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-sm font-medium">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="space-y-3">
                                        {/* Header */}
                                        <div className="flex justify-between items-start">
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs text-gray-500 mb-1">
                                                    {slot.slotName}
                                                </div>
                                                <div className="font-bold text-red-300 group-hover:text-red-200 transition-colors">
                                                    {slot.artistName}
                                                </div>
                                                <div className="text-sm text-gray-400 capitalize">
                                                    {getGenreLabel(slot.genre)}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end text-xs text-gray-500">
                                                <div>Y{slot.date.year} W{slot.date.week}</div>
                                                <div>{new Date(slot.timestamp).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        
                                        {/* Progress bar */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Career Progress</span>
                                                <span className="text-red-300 font-medium">{slot.careerProgress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-red-700 to-rose-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(slot.careerProgress, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        {/* Stats */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Cash: </span>
                                                    <span className="text-green-400 font-mono font-semibold">${slot.stats.cash.toLocaleString()}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Fame: </span>
                                                    <span className="text-yellow-400 font-semibold">{Math.round(slot.stats.fame)}</span>
                                                </div>
                                            </div>
                                            <div className="text-red-400 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={onStart}
                    className="w-full bg-gradient-to-r from-red-700 to-rose-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
                >
                    Start New Career
                </button>

                {saveSlots.length >= 5 && (
                    <p className="text-yellow-400 text-sm mt-2">
                        Maximum save slots reached. Delete a career to create a new one.
                    </p>
                )}
            </div>
        </div>
    );
};

const GameScreen: React.FC<{ onStart: () => void, title: string, message: string, buttonText: string, gameOverReason?: 'debt' | 'burnout' | null }> = ({ onStart, title, message, buttonText, gameOverReason }) => {
    // Determine audio file based on game over reason
    const audioFile = gameOverReason === 'debt'
        ? '/audio/scenarios/game-over-debt.m4a'
        : gameOverReason === 'burnout'
        ? '/audio/scenarios/game-over-burnout.m4a'
        : null;

    return (
        <div className="text-center p-8 flex flex-col items-center justify-center h-full animate-fade-in">
            {/* Audio Player for game over */}
            {audioFile && (
                <div className="mb-6">
                    <AudioPlayer
                        audioSrc={audioFile}
                        autoPlay={true}
                    />
                </div>
            )}

            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500 mb-4">{title}</h2>
            <p className="text-gray-300 max-w-md mb-8">{message}</p>
            <button
                onClick={onStart}
                className="bg-gradient-to-r from-red-700 to-rose-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
            >
                {buttonText}
            </button>
        </div>
    );
};

const GameApp: React.FC<{ isGuestMode: boolean; onResetToLanding: () => void }> = ({ isGuestMode, onResetToLanding }) => {
    const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
    const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);
    const [showMistakeWarning, setShowMistakeWarning] = useState(false);

    // Initialize autosave hook with 5-second debounce
    const { autoSave: debouncedAutoSave, saveNow, status: autoSaveStatus, clearError: clearAutoSaveError } = useAutoSave(5000);

    // Sidebar state
    const [activeSidebarView, setActiveSidebarView] = useState<SidebarView>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [saveLoadPanelKey, setSaveLoadPanelKey] = useState(0);

    // Welcome dialog state
    const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
    const [welcomeArtistName, setWelcomeArtistName] = useState('');
    const [hasAutoLoaded, setHasAutoLoaded] = useState(false); // Prevent double-loading

    // Login modal state for guest registration
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Audio unlock prompt state
    const [showAudioUnlock, setShowAudioUnlock] = useState(false);
    const [hasShownAudioPrompt, setHasShownAudioPrompt] = useState(() => {
        // Check if user has already seen the prompt
        return localStorage.getItem('audioPromptShown') === 'true';
    });

    // Unlock notification state
    interface UnlockNotif {
        id: string;
        title: string;
        description: string;
        icon?: React.ReactNode;
    }
    const [unlockNotifications, setUnlockNotifications] = useState<UnlockNotif[]>([]);

    const { status, playerStats, currentScenario, lastOutcome, artistName, achievements, unseenAchievements, modal, date, staff, gameOverReason, logs } = state;

    // Auth context
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    // Audio context
    const audioManager = useAudio();

    // PWA functionality
    const isOnline = useOnlineStatus();

    const fetchNextScenario = useCallback(async (currentState: GameState) => {
        const scenario = getNewScenario(currentState);
        setTimeout(() => {
            dispatch({ type: 'SCENARIO_LOADED', payload: scenario });
        }, 500);

    }, []);

    // Background music management - random rotation handled by useAudioManager
    useEffect(() => {
        // Random background music (bg1, bg2, bg3) is automatically queued and rotates
        // Only override for game over state
        if (status === 'gameOver') {
            audioManager.playMusic('gameOver');
            audioManager.playSound('gameOver');
        }
    }, [status, audioManager]);

    // Play achievement unlock sound when new achievements are unlocked
    // Play special audio for first achievement
    const firstAchievementAudioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        if (unseenAchievements.length > 0) {
            // Check if this is the player's first achievement ever in this career
            const totalUnlockedAchievements = achievements.filter(a => a.unlocked).length;
            const isFirstAchievement = totalUnlockedAchievements === 1;

            if (isFirstAchievement) {
                // Play first achievement audio
                if (!firstAchievementAudioRef.current) {
                    firstAchievementAudioRef.current = new Audio('/audio/scenarios/first-achievement.m4a');
                }
                firstAchievementAudioRef.current.volume = audioManager.audioState.sfxVolume;
                firstAchievementAudioRef.current.muted = audioManager.audioState.isSfxMuted;
                firstAchievementAudioRef.current.play().catch(err => {
                    console.warn('[First Achievement Audio] Playback failed:', err);
                });
            } else {
                // Play regular achievement unlock sound
                audioManager.playSound('achievementUnlock');
            }

            // Clear unseen achievements after playing sound
            dispatch({ type: 'CLEAR_UNSEEN_ACHIEVEMENTS' });
        }
    }, [unseenAchievements.length, audioManager, achievements]);


    // Play one year milestone audio at 48 weeks
    const hasPlayedMilestoneAudioRef = useRef(false);
    const milestoneAudioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        if (status === 'playing' && state.currentDate && state.startDate) {
            const currentGameDate = toGameDate(state.currentDate, state.startDate);
            const totalWeeks = (currentGameDate.year - 1) * 48 + (currentGameDate.month - 1) * 4 + currentGameDate.week;

            // Check if player just reached 48 weeks (1 year milestone)
            if (totalWeeks === 48 && !hasPlayedMilestoneAudioRef.current) {
                hasPlayedMilestoneAudioRef.current = true;

                // Play one year milestone audio
                if (!milestoneAudioRef.current) {
                    milestoneAudioRef.current = new Audio('/audio/scenarios/one-year-milestone.m4a');
                }
                milestoneAudioRef.current.volume = audioManager.audioState.sfxVolume;
                milestoneAudioRef.current.muted = audioManager.audioState.isSfxMuted;
                milestoneAudioRef.current.play().catch(err => {
                    console.warn('[One Year Milestone Audio] Playback failed:', err);
                });
            }
        }
    }, [status, state.currentDate, state.startDate, audioManager]);

    // Generate scenario when loaded game has no current scenario
    useEffect(() => {
        if (status === 'playing' && !currentScenario && state.artistName) {
            console.log('[App] Game loaded but no current scenario - generating new scenario');
            fetchNextScenario(state);
        }
    }, [status, currentScenario, state, fetchNextScenario]);

    // Track previous stats to detect changes and play appropriate sounds
    const prevStatsRef = useRef(playerStats);
    const isInitialRenderRef = useRef(true);
    useEffect(() => {
        // Skip sound on first render
        if (isInitialRenderRef.current) {
            isInitialRenderRef.current = false;
            prevStatsRef.current = playerStats;
            return;
        }

        const prevStats = prevStatsRef.current;
        const currentStats = playerStats;

        // Only play sounds during gameplay and for significant changes
        if (status === 'playing' && lastOutcome) {
            // Cash changes (only for significant amounts)
            const cashDiff = currentStats.cash - prevStats.cash;
            if (cashDiff >= 100) {
                audioManager.playSound('cashGain');
            } else if (cashDiff <= -100) {
                audioManager.playSound('buttonClick'); // Neutral sound for cash loss
            }

            // Fame/Hype increases (only for increases of 5+)
            const fameDiff = currentStats.fame - prevStats.fame;
            const hypeDiff = currentStats.hype - prevStats.hype;
            if (fameDiff >= 5 || hypeDiff >= 5) {
                audioManager.playSound('achievementUnlock'); // Achievement sound for fame/hype increase
            }
        }

        prevStatsRef.current = currentStats;
    }, [playerStats, status, lastOutcome, audioManager]);
    
    useEffect(() => {
        if ((status === 'loading' || (status === 'playing' && !currentScenario)) && artistName) {
            fetchNextScenario(state);
        }
    }, [status, artistName, fetchNextScenario, state, currentScenario]);

    // Auto-save effect with debouncing
    useEffect(() => {
        // Only autosave during active gameplay
        if (status === 'playing' && isStorageAvailable()) {
            debouncedAutoSave(state);
        }
    }, [state.date, state.playerStats, status, debouncedAutoSave]); // Auto-save when date or stats change (debounced)

    // Immediate save for important game events (no debounce)
    useEffect(() => {
        if (status === 'playing' && isStorageAvailable() && lastOutcome) {
            // Save immediately after making a choice and seeing the outcome
            saveNow(state);
        }
    }, [lastOutcome, status, saveNow, state]);

    // Clean up expired autosaves on mount
    useEffect(() => {
        const cleanup = async () => {
            await cleanupExpiredAutosaves();
        };
        cleanup();
    }, []);

    // Check for new unlocks and show notifications
    useEffect(() => {
        if (status !== 'playing') return;

        const newUnlocks: UnlockNotif[] = [];

        // Check staff management unlock
        if (playerStats.careerProgress >= 40 && !state.unlocksShown.includes('staff_management')) {
            newUnlocks.push({
                id: 'staff_management',
                title: 'Staff Management Unlocked!',
                description: 'You can now hire managers, bookers, and promoters to boost your career.',
                icon: (
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                )
            });
        }

        // Check learning module unlocks
        const modules = learningModules;
        modules.forEach(module => {
            const unlockKey = `module_${module.id}`;
            if (!state.unlocksShown.includes(unlockKey)) {
                // Check if module just unlocked
                const req = module.unlockRequirement;
                if (req) {
                    let justUnlocked = false;
                    switch (req.type) {
                        case 'fame':
                            justUnlocked = playerStats.fame >= (req.value || 0);
                            break;
                        case 'careerProgress':
                            justUnlocked = playerStats.careerProgress >= (req.value || 0);
                            break;
                        case 'hype':
                            justUnlocked = playerStats.hype >= (req.value || 0);
                            break;
                        case 'contractViewed':
                            justUnlocked = state.contractsViewed.length >= (req.value || 0);
                            break;
                    }

                    if (justUnlocked) {
                        newUnlocks.push({
                            id: unlockKey,
                            title: 'New Course Unlocked!',
                            description: `You can now access "${module.title}" in the Learning Hub.`,
                            icon: (
                                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                            )
                        });
                    }
                }
            }
        });

        // Add notifications and update unlocksShown
        if (newUnlocks.length > 0) {
            setUnlockNotifications(prev => [...prev, ...newUnlocks]);
            dispatch({
                type: 'MARK_UNLOCKS_SHOWN',
                unlockIds: newUnlocks.map(u => u.id)
            });
        }
    }, [playerStats, state.unlocksShown, state.contractsViewed, status]);

    // Auto-save every 5 minutes during gameplay
    useEffect(() => {
        if (status !== 'playing') return;

        const autoSaveInterval = setInterval(async () => {
            await saveGame(state, 'auto');
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(autoSaveInterval);
    }, [status, state]);

    // Clean up old autosaves only during active gameplay
    useEffect(() => {
        if (status !== 'playing') return; // Only cleanup during gameplay

        const cleanupInterval = setInterval(async () => {
            await cleanupExpiredAutosaves();
        }, 60 * 1000); // 1 minute

        return () => clearInterval(cleanupInterval);
    }, [status]); // Add status dependency

    // Don't auto-load game on login - let user choose from Start screen
    // (removed auto-load logic - user should manually click Continue Game)

    // Reset game state when returning to landing (logout/exit guest mode)
    useEffect(() => {
        const handleReset = async () => {
            if (!isAuthenticated && !isGuestMode && status !== 'start') {
                // Save the current game state before resetting
                if (status === 'playing' && state.artistName && isStorageAvailable()) {
                    try {
                        await saveGame(state, 'auto');
                    } catch (error) {
                        console.error('Failed to save game before logout:', error);
                    }
                }

                dispatch({ type: 'RESET_TO_LANDING' });
            }
        };

        handleReset();
    }, [isAuthenticated, isGuestMode, status, state]);

    // Auto-start tutorial for brand new players (only once ever, on their first gameplay)
    useEffect(() => {
        // Check localStorage to see if tutorial was ever seen
        const TUTORIAL_SEEN_KEY = 'musicsim_tutorial_seen';
        const tutorialEverSeen = localStorage.getItem(TUTORIAL_SEEN_KEY) === 'true';

        // Only show tutorial if:
        // 1. Never seen before (not in localStorage)
        // 2. No games played yet (brand new user)
        // 3. Currently playing (not just logged in - actually started playing)
        // 4. Tutorial not already active
        // 5. Has an artist name (started a career)
        const isNewPlayer = !tutorialEverSeen &&
                           state.statistics.totalGamesPlayed === 0 &&
                           status === 'playing' &&
                           !state.tutorial.active &&
                           state.artistName.trim() !== '';

        if (isNewPlayer) {
            localStorage.setItem(TUTORIAL_SEEN_KEY, 'true');

            // Delay tutorial start to let the game render first
            setTimeout(() => {
                dispatch({ type: 'START_TUTORIAL' });
            }, 1000);
        }
    }, [status, state.statistics.totalGamesPlayed, state.tutorial.active, state.artistName]);

    const handleChoiceSelect = (choice: Choice) => {
        audioManager.playSound('buttonClick');

        // Check for bad choices in beginner mode
        if (state.difficulty === 'beginner' && isBadChoice(choice.outcome, state.difficulty)) {
            setPendingChoice(choice);
            setShowMistakeWarning(true);
        } else {
            // Let the OutcomeModal handle autoplay/replay of any outcome-specific audio.
            // This avoids duplicate playback and centralizes playback controls to the modal.
            dispatch({ type: 'SELECT_CHOICE', payload: choice });
        }
    };

    const handleMistakeProceed = () => {
        // No sound - choice selection already has sound
        if (pendingChoice) {
            dispatch({ type: 'SELECT_CHOICE', payload: pendingChoice });
            setPendingChoice(null);
        }
        setShowMistakeWarning(false);
    };

    const handleMistakeReconsider = () => {
        // No sound - just canceling
        setPendingChoice(null);
        setShowMistakeWarning(false);
    };

    const handleContinue = () => {
        audioManager.playSound('buttonClick'); // Transition sound for advancing week
        dispatch({ type: 'DISMISS_OUTCOME' });
        
        // Save immediately after advancing to next week
        if (status === 'playing' && isStorageAvailable()) {
            saveNow(state);
        }
    };

    const handleStartGame = () => {
        // Show audio unlock prompt if not shown before
        if (!hasShownAudioPrompt) {
            setShowAudioUnlock(true);
        } else {
            audioManager.playSound('buttonClick');
            dispatch({ type: 'START_SETUP' });
        }
    };

    const handleAudioUnlock = async () => {
        setShowAudioUnlock(false);
        setHasShownAudioPrompt(true);
        localStorage.setItem('audioPromptShown', 'true');

        // Unlock audio system - this enables user interaction flag
        audioManager.unlockAudio();

        // Try to play a sound to unlock audio context
        try {
            await audioManager.playSound('buttonClick');
        } catch (error) {
            console.log('Audio unlock attempt:', error);
        }

        // Check if we have a pending game load
        const pendingLoad = sessionStorage.getItem('pendingLoadGame');
        if (pendingLoad) {
            sessionStorage.removeItem('pendingLoadGame');
            const parsedState = JSON.parse(pendingLoad);
            const gameState = deserializeGameState(parsedState);
            dispatch({ type: 'LOAD_GAME', payload: gameState });
        } else {
            dispatch({ type: 'START_SETUP' });
        }
    };

    const handleAudioSkip = () => {
        setShowAudioUnlock(false);
        setHasShownAudioPrompt(true);
        localStorage.setItem('audioPromptShown', 'true');

        // Mute audio if user skips
        audioManager.setMusicMuted(true);
        audioManager.setSfxMuted(true);

        // Check if we have a pending game load
        const pendingLoad = sessionStorage.getItem('pendingLoadGame');
        if (pendingLoad) {
            sessionStorage.removeItem('pendingLoadGame');
            const parsedState = JSON.parse(pendingLoad);
            const gameState = deserializeGameState(parsedState);
            dispatch({ type: 'LOAD_GAME', payload: gameState });
        } else {
            dispatch({ type: 'START_SETUP' });
        }
    };

    const handleContinueFromAutosave = (gameState: GameState) => {
        // Show audio unlock prompt if not shown before
        if (!hasShownAudioPrompt) {
            setShowAudioUnlock(true);
            // Store the game state to load after audio unlock
            sessionStorage.setItem('pendingLoadGame', JSON.stringify(gameState));
        } else {
            audioManager.playSound('buttonClick');
            dispatch({ type: 'LOAD_GAME', payload: gameState });
        }
    };

    const handleRestart = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'RESTART' });
    };

    const handleSetupSubmit = (name: string, genre: string, difficulty: Difficulty) => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'SUBMIT_SETUP', payload: { name, genre, difficulty } });
    };

    const handleShowManagementHub = () => {
        // No sound - just opening a menu
        dispatch({ type: 'VIEW_MANAGEMENT_HUB' });
    };

    const handleShowSaveLoad = () => {
        // No sound - just opening a menu
        dispatch({ type: 'VIEW_SAVE_LOAD' });
    };

    const handleShowLearningHub = () => {
        // No sound - just opening a menu
        dispatch({ type: 'VIEW_LEARNING_HUB' });
    };

    const handleShowStatistics = () => {
        // No sound - just opening a menu
        dispatch({ type: 'VIEW_STATISTICS' });
    };

    const handleOpenModule = (module: LearningModule) => {
        // No sound - just opening content
        dispatch({ type: 'OPEN_MODULE', payload: module });
        // Track module start in database
        startModule(module.id, module.title).catch(console.error);
    };

    const handleCompleteModule = (moduleId: string, score: number, conceptsMastered: string[]) => {
        audioManager.playSound('lessonComplete');
        dispatch({ type: 'COMPLETE_MODULE', payload: { moduleId, score, conceptsMastered } });
        // Track module completion in database
        completeModule(moduleId, score).catch(console.error);
    };

    const handleCloseModule = () => {
        // No sound - just closing
        dispatch({ type: 'CLOSE_MODULE' });
    };

    const handleCloseModal = () => {
        // No sound - just closing
        dispatch({ type: 'CLOSE_MODAL' });
    };

    const handleLoadGame = (gameState: GameState) => {
        // Show audio unlock prompt if not shown before on new devices
        if (!hasShownAudioPrompt) {
            // Close the save/load panel immediately
            setActiveSidebarView(null);
            setShowAudioUnlock(true);
            // Store the game state to load after audio unlock
            sessionStorage.setItem('pendingLoadGame', JSON.stringify(gameState));
        } else {
            audioManager.playSound('buttonClick');
            dispatch({ type: 'LOAD_GAME', payload: gameState });
        }
    };

    const handleViewContract = () => {
        // No sound - just viewing
        // Ensure there is a current label offer to view; the action expects a RecordLabel payload.
        if (!state.currentLabelOffer) {
            // Nothing to view, bail out.
            return;
        }
        dispatch({ type: 'VIEW_CONTRACT', payload: state.currentLabelOffer });
    };

    const handleSignContract = () => {
        // First dispatch the sign so game state updates immediately
        dispatch({ type: 'SIGN_CONTRACT' });

        // Then play a short label executive voiceover followed by an excited manager clip.
        try {
            const execAudio = new Audio('/audio/scenarios/contract-signing.m4a');
            execAudio.preload = 'auto';
            execAudio.muted = !!audioManager.audioState?.isSfxMuted;
            execAudio.volume = audioManager.audioState?.sfxVolume ?? 1;
            // Duck background music while voiceover plays
            try { audioManager.duckMusic(); } catch (e) { /* ignore */ }
            execAudio.play().catch(err => {
                console.warn('[Sign Contract] Exec voiceover play failed:', err);
            });
            execAudio.addEventListener('ended', () => {
                // Play manager excited follow-up
                try { audioManager.unduckMusic(); } catch (e) { /* ignore */ }
                try {
                    const managerAudio = new Audio('/audio/scenarios/first-record-deal.m4a');
                    managerAudio.preload = 'auto';
                    managerAudio.muted = !!audioManager.audioState?.isSfxMuted;
                    managerAudio.volume = audioManager.audioState?.sfxVolume ?? 1;
                    try { audioManager.duckMusic(); } catch (e) { /* ignore */ }
                    managerAudio.play().catch(err => {
                        console.warn('[Sign Contract] Manager voiceover play failed:', err);
                    });
                    managerAudio.addEventListener('ended', () => {
                        try { audioManager.unduckMusic(); } catch (e) { /* ignore */ }
                    });
                } catch (err) {
                    console.error('[Sign Contract] Failed to play manager audio:', err);
                }
            });
        } catch (err) {
            console.error('[Sign Contract] Failed to play sign voiceovers:', err);
        }
    };

    const handleDeclineContract = () => {
        // No sound - just declining
        dispatch({ type: 'DECLINE_CONTRACT' });
    };

    const handleStartTutorial = () => {
        // No sound - just starting tutorial
        dispatch({ type: 'START_TUTORIAL' });
    };

    const handleNextTutorialStep = () => {
        // No sound - tutorial navigation is frequent
        dispatch({ type: 'NEXT_TUTORIAL_STEP' });
    };

    const handlePreviousTutorialStep = () => {
        // No sound - tutorial navigation is frequent
        dispatch({ type: 'PREVIOUS_TUTORIAL_STEP' });
    };

    const handleSkipTutorial = () => {
        // No sound
        dispatch({ type: 'SKIP_TUTORIAL' });
    };

    const handleCompleteTutorial = () => {
        audioManager.playSound('lessonComplete');
        dispatch({ type: 'COMPLETE_TUTORIAL' });
    };

    // Sidebar view change handler
    const handleSidebarViewChange = (view: SidebarView) => {
        // Special handling for tutorial - launch overlay and close sidebar
        if (view === 'tutorial') {
            dispatch({ type: 'START_TUTORIAL' });
            setActiveSidebarView(null);
            return;
        }

        // Increment save/load panel key to force refresh when opened
        if (view === 'saveload') {
            setSaveLoadPanelKey((prev: number) => prev + 1);
        }

        setActiveSidebarView(view);

        // Map sidebar views to modal states (for modals that still exist)
        if (view === 'learning') {
            // Close any existing modal when opening learning panel
            dispatch({ type: 'CLOSE_MODAL' });
        } else if (view === null) {
            // Close all modals when sidebar is closed
            dispatch({ type: 'CLOSE_MODAL' });
        }
    };

    // Manual save logic - Delete autosave when manual save happens
    const handleManualSave = async (slotName: string) => {
        try {
            // First, delete the autosave
            await deleteSave('auto');

            // Then save to the new slot
            await saveGame(state, slotName);

            // Also create a new autosave that's a copy of this manual save
            await saveGame(state, 'auto');

            alert(`Game saved successfully to "${slotName}"!`);
        } catch (error) {
            console.error('Error saving game:', error);
            alert('Failed to save game. Please try again.');
        }
    };

    const renderGameContent = () => {
        switch (status) {
            case 'start':
                return <StartScreen onStart={handleStartGame} onContinue={handleContinueFromAutosave} />;
            case 'setup':
                return <ArtistSetup onSubmit={handleSetupSubmit} />;
            case 'gameOver':
                const settings = getDifficultySettings(state.difficulty);
                const gameOverMessage = gameOverReason === 'debt'
                    ? `After ${settings.gracePeriodWeeks} weeks in debt, you've gone bankrupt. The show can't go on.`
                    : `After ${settings.gracePeriodWeeks} weeks of pushing yourself too hard, you've suffered a complete burnout. You need to step away from the industry.`;
                return <GameScreen onStart={handleRestart} title="Game Over" message={gameOverMessage} buttonText="Play Again" gameOverReason={gameOverReason} />;
            case 'loading':
                return <div className="flex-grow flex items-center justify-center"><Loader text="Setting the stage..." /></div>;
            case 'playing':
                if (!currentScenario) return <div className="flex-grow flex items-center justify-center"><Loader text="Preparing your next scenario..." /></div>;
                return <ScenarioCard scenario={currentScenario} onChoiceSelect={handleChoiceSelect} disabled={!!lastOutcome} difficulty={state.difficulty} />;
            default:
                return null;
        }
    }

    const showDashboard = !['start', 'setup'].includes(status);
    
    return (
        <div className="relative min-h-screen max-h-screen overflow-hidden flex flex-col bg-gray-900">
            {/* Parallax Background */}
            <ParallaxBackground speed={0.2} opacity={0.15} />

             <style>{`.bg-grid-gray-800\\/\\[0\\.2\\] { background-image: linear-gradient(to right, rgba(55, 65, 81, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(55, 65, 81, 0.4) 1px, transparent 1px); background-size: 2.5rem 2.5rem; } .animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            {/* PWA Components */}
            <OfflineBanner isOnline={isOnline} />
            <InstallBanner />
            <Header
                artistName={artistName || undefined}
                difficulty={status === 'playing' ? state.difficulty : undefined}
                onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                showMenuButton={!!artistName}
                autoSaveStatus={autoSaveStatus}
            />

            {/* Sidebar - only show when game has started */}
            {artistName && (
                <Sidebar
                    activeView={activeSidebarView}
                    onViewChange={handleSidebarViewChange}
                    hasUnseenAchievements={unseenAchievements.length > 0}
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileToggle={setIsMobileSidebarOpen}
                    artistName={artistName}
                    difficulty={status === 'playing' ? state.difficulty : undefined}
                >
                    {/* Render content based on active view */}
                    {activeSidebarView === 'saveload' && (
                        <SaveLoadPanel
                            key={saveLoadPanelKey}
                            onLoadGame={handleLoadGame}
                            currentGameState={state}
                            onClose={() => setActiveSidebarView(null)}
                            onSaveComplete={() => {
                                setSaveLoadPanelKey((prev: number) => prev + 1);
                            }}
                        />
                    )}

                    {activeSidebarView === 'profile' && (
                        <ProfilePanel
                            isGuestMode={isGuestMode}
                            onExitGuest={onResetToLanding}
                            onClose={() => setActiveSidebarView(null)}
                            statistics={state.statistics}
                            artistName={state.artistName}
                            difficulty={state.difficulty}
                            onOpenAuth={() => setShowLoginModal(true)}
                        />
                    )}

                    {activeSidebarView === 'achievements' && (
                        <ManagementPanel
                            achievements={achievements}
                            staff={staff}
                            playerStats={playerStats}
                            staffHiringUnlocked={state.staffHiringUnlocked}
                            difficulty={state.difficulty}
                            onHireStaff={(templateId, contractDuration) => {
                                dispatch({ type: 'HIRE_STAFF', payload: { templateId, contractDuration } });
                            }}
                            onTerminateStaff={(staffIndex) => {
                                dispatch({ type: 'TERMINATE_STAFF', payload: { staffIndex } });
                            }}
                            onExtendContract={(staffIndex, additionalMonths) => {
                                dispatch({ type: 'EXTEND_STAFF_CONTRACT', payload: { staffIndex, additionalMonths } });
                            }}
                            isGuestMode={isGuestMode}
                        />
                    )}

                    {activeSidebarView === 'learning' && (
                        <Suspense fallback={<Loader text="Loading learning panel..." />}>
                            <LearningPanel
                                onOpenModule={handleOpenModule}
                                playerKnowledge={state.playerKnowledge}
                                gameState={state}
                            />
                        </Suspense>
                    )}

                    {activeSidebarView === 'statistics' && (
                        <StatisticsPanel state={state} />
                    )}

                    {activeSidebarView === 'audio' && (
                        <SidebarAudioSettings />
                    )}
                </Sidebar>
            )}

            <div className={`relative z-10 flex-1 w-full max-w-[1400px] mx-auto px-3 sm:px-4 py-1.5 sm:py-2 flex flex-col transition-all duration-300 overflow-y-auto min-h-0 ${artistName ? 'lg:pr-20' : 'lg:px-6'} ${activeSidebarView ? 'lg:pr-[28rem]' : ''}`}>
                {showDashboard && <Dashboard stats={playerStats} project={null} date={date} currentDate={state.currentDate} />}

                {/* History section right after stats */}
                {showDashboard && <GameHistory logs={state.logs || []} />}

                <main className="flex justify-center mt-1 sm:mt-1.5 mb-2 sm:mb-3 flex-shrink-0">
                    {renderGameContent()}
                </main>
            </div>

            {lastOutcome && (
                (lastOutcome as any).type === 'termination' ? (
                    <StaffTerminationModal
                        staff={(lastOutcome as any).staff}
                        outcome={{
                            message: (lastOutcome as any).message,
                            severance: (lastOutcome as any).severance,
                            wellBeingLoss: (lastOutcome as any).wellBeingLoss,
                            additionalEffects: (lastOutcome as any).additionalEffects
                        }}
                        onClose={handleContinue}
                    />
                ) : (
                    <OutcomeModal outcome={lastOutcome} onClose={handleContinue} onViewContract={handleViewContract} />
                )
            )}
            {modal === 'learning' && (
                <Suspense fallback={<Loader text="Loading learning hub..." />}>
                    <LearningHub isOpen={true} onClose={handleCloseModal} onOpenModule={handleOpenModule} playerKnowledge={state.playerKnowledge} gameState={state} isGuestMode={isGuestMode} />
                </Suspense>
            )}
            {modal === 'moduleViewer' && state.currentModule && (
                <Suspense fallback={<Loader text="Loading module..." />}>
                    <ModuleViewer 
                        module={state.currentModule} 
                        onComplete={handleCompleteModule}
                        onClose={handleCloseModule}
                    />
                </Suspense>
            )}
            {modal === 'contract' && state.currentLabelOffer && (
                <Suspense fallback={<Loader text="Loading contract..." />}>
                    <ContractViewer 
                        label={state.currentLabelOffer}
                        onSign={handleSignContract}
                        onDecline={handleDeclineContract}
                    />
                </Suspense>
            )}
            {/* Management, Save/Load and Statistics are now available in the Sidebar panels. */}

            {showMistakeWarning && pendingChoice && currentScenario && (
                <MistakeWarning
                    scenarioTitle={currentScenario.title}
                    choiceText={pendingChoice.text}
                    predictedOutcome={getPredictedOutcome(pendingChoice.outcome)}
                    onProceed={handleMistakeProceed}
                    onReconsider={handleMistakeReconsider}
                />
            )}

            <TutorialOverlay
                currentStep={state.tutorial.currentStep}
                onNext={handleNextTutorialStep}
                onBack={handlePreviousTutorialStep}
                onSkip={handleSkipTutorial}
                onComplete={handleCompleteTutorial}
                isActive={state.tutorial.active}
            />

            {/* Welcome Back Dialog */}
            {showWelcomeDialog && (
                <WelcomeBackDialog
                    artistName={welcomeArtistName}
                    onClose={() => setShowWelcomeDialog(false)}
                />
            )}

            {/* Login/Register Modal for guests */}
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />
            )}

            {/* Audio Unlock Prompt */}
            {showAudioUnlock && (
                <AudioUnlockPrompt
                    onUnlock={handleAudioUnlock}
                    onSkip={handleAudioSkip}
                />
            )}

            {/* Unlock Notifications */}
            {unlockNotifications.map(notif => (
                <UnlockNotification
                    key={notif.id}
                    title={notif.title}
                    description={notif.description}
                    icon={notif.icon}
                    onClose={() => {
                        setUnlockNotifications(prev => prev.filter(n => n.id !== notif.id));
                    }}
                />
            ))}

            <footer className="text-center p-4 text-gray-500 text-sm">
                A Music Industry Simulation
            </footer>
        </div>
    );
};

// User profile component
const UserProfile: React.FC<{ onOpenLoginModal: () => void }> = ({ onOpenLoginModal }) => {
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Guest Mode</span>
                <button
                    onClick={onOpenLoginModal}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                    Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm">Welcome, {user.username}!</span>
            <button
                onClick={handleLogout}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
            >
                Logout
            </button>
        </div>
    );
};

// Main authenticated app wrapper
const AuthenticatedApp: React.FC = () => {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const [guestMode, setGuestMode] = useState(false);
    const [wasGuestMode, setWasGuestMode] = useState(false);
    const [showGuestDataModal, setShowGuestDataModal] = useState(false);
    const [guestDataInfo, setGuestDataInfo] = useState<{ saveCount: number; hasCloudData: boolean } | null>(null);
    // Start with landing hidden if user is already authenticated (persistent login)
    const [showLanding, setShowLanding] = useState(!isAuthenticated);

    // Detect guest-to-authenticated transition and check for guest data
    useEffect(() => {
        const checkGuestDataOnLogin = async () => {
            // If user just logged in and was previously in guest mode
            if (isAuthenticated && wasGuestMode) {
                const guestData = getGuestData();

                if (guestData && guestData.saves.length > 0) {
                    // Check if user has cloud saves
                    try {
                        const cloudSlots = await getAllSaveSlots();
                        // Some backends may not include an `isLocal` property on SaveSlot.
                        // Use a safe runtime check and treat missing `isLocal` as cloud data.
                        const hasCloudData = cloudSlots.some(slot => ('isLocal' in slot) ? !(slot as any).isLocal : true);

                        setGuestDataInfo({
                            saveCount: guestData.saves.length,
                            hasCloudData
                        });
                        setShowGuestDataModal(true);
                    } catch (error) {
                        console.error('[App] Error checking cloud data:', error);
                        // If error checking cloud, assume no cloud data and show modal anyway
                        setGuestDataInfo({
                            saveCount: guestData.saves.length,
                            hasCloudData: false
                        });
                        setShowGuestDataModal(true);
                    }
                }

                // Reset wasGuestMode flag
                setWasGuestMode(false);
            }
        };

        checkGuestDataOnLogin();
    }, [isAuthenticated, wasGuestMode]);

    // Hide landing page once user is authenticated or playing as guest.
    // Delay hiding the landing page briefly when the user authenticates so
    // any success banners in the Login/Register modal have time to render
    // before the landing page (and modal) unmounts.
    useEffect(() => {
        if (isAuthenticated) {
            const t = setTimeout(() => setShowLanding(false), 700);
            return () => clearTimeout(t);
        }

        if (guestMode) {
            // Guest mode can proceed immediately
            setShowLanding(false);
        }
    }, [isAuthenticated, guestMode]);

    // Handle guest mode
    const handlePlayAsGuest = () => {
        setGuestMode(true);
        setWasGuestMode(true); // Track that user was in guest mode
        setShowLanding(false);
    };

    // Handle logout
    const handleLogout = async () => {
        await logout();
        setGuestMode(false);
        setWasGuestMode(false);
        setShowLanding(true);
        // Game state will be reset by GameApp component
    };

    // Handle guest data merge choice
    const handleGuestDataChoice = async (choice: 'merge' | 'cloud' | 'both') => {
        const guestData = getGuestData();

        if (!guestData) {
            console.warn('[App] No guest data found');
            return;
        }

        try {
            if (choice === 'merge') {
                // Merge: Sync guest data to cloud and clear localStorage
                console.log('[App] Merging guest data to cloud...');
                const result = await authServiceSupabase.syncGuestData(guestData);

                if (!result.success) {
                    throw new Error(result.message);
                }

                // Clear guest data from localStorage after successful sync
                clearGuestData(true, false); // Clear saves but keep statistics
                console.log('[App] Guest data merged successfully');

            } else if (choice === 'cloud') {
                // Cloud: Discard guest data and load cloud saves
                console.log('[App] Discarding guest data...');
                clearGuestData(true, true); // Clear both saves and statistics
                console.log('[App] Guest data cleared');

            } else if (choice === 'both') {
                // Both: Keep guest data in localStorage AND sync statistics
                console.log('[App] Keeping both guest and cloud data...');
                // Only sync statistics, not saves
                const statsOnly = { statistics: guestData.statistics };
                const result = await authServiceSupabase.syncGuestData(statsOnly);

                if (!result.success) {
                    throw new Error(result.message);
                }

                console.log('[App] Statistics synced, guest saves preserved in localStorage');
            }

            // Reset guest mode state
            setGuestMode(false);

        } catch (error) {
            console.error('[App] Error handling guest data choice:', error);
            throw error; // Let modal handle the error display
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading MusicSim...</p>
                </div>
            </div>
        );
    }

    // Show landing page if not authenticated and not guest
    if (showLanding && !isAuthenticated && !guestMode) {
        return (
            <div>
                <InstallBanner />
                <LandingPage onPlayAsGuest={handlePlayAsGuest} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* PWA Install Banner - shows across all pages */}
            <InstallBanner />

            {/* Header with user info - only show when not on landing page */}

            {/* Only show a single header, styled to match the app's color scheme */}
            {!showLanding && (isAuthenticated || guestMode) && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-white drop-shadow">MusicSim</h1>
                            {guestMode && (
                                <span className="text-xs bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded border border-yellow-400/30 font-semibold tracking-wide">
                                    Guest Mode
                                </span>
                            )}
                            {isAuthenticated && user && (
                                <span className="text-sm text-gray-200 font-medium">
                                    {user.username}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Game content with proper padding when header is visible */}
            <div className={`${!showLanding ? 'pt-16' : ''}`}>
                <GameApp isGuestMode={guestMode} onResetToLanding={handleLogout} />
            </div>

            {/* Guest Data Merge Modal */}
            {guestDataInfo && (
                <GuestDataMergeModal
                    isOpen={showGuestDataModal}
                    onClose={() => setShowGuestDataModal(false)}
                    onChoice={handleGuestDataChoice}
                    guestSaveCount={guestDataInfo.saveCount}
                    hasCloudData={guestDataInfo.hasCloudData}
                />
            )}
        </div>
    );
};

// Main App component with authentication provider
const App: React.FC = () => {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <AudioProvider>
                        <AuthenticatedApp />
                    </AudioProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;
