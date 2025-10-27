import React, { useReducer, useCallback, useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { AudioProvider } from './contexts/AudioContext';
import { LoginModal } from './components/LoginModal';
import LandingPage from './components/LandingPage';
import type { GameState, Action, Choice, Scenario, PlayerStats, Project, GameDate, Staff, RecordLabel, LearningModule, CareerHistory, Difficulty, LogEntry } from './types';
import { getNewScenario } from './services/scenarioService';
import { createLog, appendLogToArray } from './src/utils/logUtils';
import { toGameDate } from './src/utils/dateUtils';
import { autoSave, loadGame, isStorageAvailable, saveGame, cleanupExpiredAutosaves, hasValidAutosave, getAutosaveAge, deleteSave } from './services/storageService';
import { loadStatistics, saveStatistics, updateStatistics, recordGameEnd, saveCareerHistory, recordDecision } from './services/statisticsService';
import { getDifficultySettings } from './data/difficultySettings';
import { achievements as allAchievements } from './data/achievements';
import { projects as allProjects } from './data/projects';
import { staff as allStaff } from './data/staff';
import { labels as allLabels } from './data/labels';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScenarioCard from './components/ScenarioCard';
import OutcomeModal from './components/OutcomeModal';
import Loader from './components/Loader';
import ArtistSetup from './components/ArtistSetup';
import ManagementModal from './components/ManagementModal';
import SaveLoadModal from './components/SaveLoadModal';
import LearningHub from './components/LearningHub';
import ModuleViewer from './components/ModuleViewer';
import { ContractViewer } from './components/ContractViewer';
import { StatisticsModal } from './components/StatisticsModal';
import { TutorialOverlay } from './components/TutorialOverlay';
import { MistakeWarning } from './components/MistakeWarning';
import WelcomeBackDialog from './components/WelcomeBackDialog';
import GameHistory from './components/GameHistory';
import { useOnlineStatus } from './src/hooks/useOnlineStatus';
import OfflineBanner from './src/components/OfflineBanner';
import InstallBanner from './src/components/InstallBanner';
import { useAudio } from './contexts/AudioContext';

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
        logs: [createLog('Your music career begins today!', 'success', new Date(2025, 9, 14), '🎵')],
        date: { week: 1, month: 1, year: 1 },
        currentDate: new Date(2025, 9, 14), // October 14, 2025
        startDate: new Date(2025, 9, 14),
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
        currentLabel: null,
        currentLabelOffer: null,
        contractsViewed: [],
        debtTurns: 0,
        burnoutTurns: 0,
        gameOverReason: null,
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
    };
};

const INITIAL_STATE = generateInitialState();

// Log helpers moved to src/utils/logUtils.ts (createLog, appendLogToArray)

function checkAchievements(state: GameState, newStats: PlayerStats): { achievements: GameState['achievements'], unseenAchievements: string[] } {
    const unlockedAchievements = [...state.achievements];
    const newUnseen = [...state.unseenAchievements];

    const checkAndUnlock = (id: string, condition: boolean) => {
        const achievement = unlockedAchievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked && condition) {
            achievement.unlocked = true;
            if(!newUnseen.includes(id)) newUnseen.push(id);
        }
    };
    
    // Milestones
    checkAndUnlock('CASH_10K', newStats.cash >= 10000);
    checkAndUnlock('FAME_50', newStats.fame >= 50);
    checkAndUnlock('HYPE_50', newStats.hype >= 50);
    checkAndUnlock('CAREER_50', newStats.careerProgress >= 50);
    checkAndUnlock('STAFF_FULL_TEAM', state.staff.length === 3);
    
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
                logs: appendLogToArray(state.logs, createLog(`The artist '${action.payload.name}' (${action.payload.genre}) is born!`, 'success', new Date(state.currentDate || new Date()), '🎵'))
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
                cash: state.playerStats.cash + outcome.cash,
                fame: Math.min(100, Math.max(0, state.playerStats.fame + outcome.fame)),
                wellBeing: Math.min(100, Math.max(0, state.playerStats.wellBeing + outcome.wellBeing)),
                careerProgress: Math.min(100, Math.max(0, state.playerStats.careerProgress + outcome.careerProgress)),
                hype: Math.min(100, Math.max(0, state.playerStats.hype + outcome.hype)),
            };

            let newProject = state.currentProject;
            if (outcome.startProject && !newProject) {
                const projectTemplate = allProjects.find(p => p.id === outcome.startProject);
                if (projectTemplate) {
                    newProject = { ...projectTemplate, progress: 0, quality: 0 };
                }
            }
            if (outcome.progressProject && newProject) {
                newProject.progress += outcome.progressProject;
                newProject.quality += Math.floor(Math.random() * 5 + outcome.fame / 20);
            }
            
            let updatedAchievements = [...state.achievements];
            let newUnseenAchievements = [...state.unseenAchievements];

            // Handle Staff changes
            let newStaff = [...state.staff];
            if (outcome.hireStaff) {
                const existingStaff = newStaff.find(s => s.role === outcome.hireStaff);
                if (!existingStaff) {
                    const staffTemplate = allStaff.find(s => s.role === outcome.hireStaff);
                    if (staffTemplate) newStaff.push({ ...staffTemplate });
                }
            }
             if (outcome.fireStaff) {
                newStaff = newStaff.filter(s => s.role !== outcome.fireStaff);
            }
            if (outcome.renewStaff) {
                const staffToRenew = newStaff.find(s => s.role === outcome.renewStaff);
                const staffTemplate = allStaff.find(s => s.role === outcome.renewStaff);
                if(staffToRenew && staffTemplate) {
                    staffToRenew.contractLength = staffTemplate.contractLength;
                }
            }
            
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

            const milestoneCheck = checkAchievements({...state, staff: newStaff, lessonsViewed: newLessonsViewed}, newStats);
            updatedAchievements = milestoneCheck.achievements;
            newUnseenAchievements = [...new Set([...newUnseenAchievements, ...milestoneCheck.unseenAchievements])];

            return {
                ...state,
                playerStats: newStats,
                lastOutcome: outcome,
                currentProject: newProject,
                // legacy careerLog append removed; message added to Date-based logs instead
                logs: appendLogToArray(state.logs, createLog(outcome.text, 'info', new Date(state.currentDate || new Date()))),
                achievements: updatedAchievements,
                unseenAchievements: newUnseenAchievements,
                staff: newStaff,
                currentLabel: newLabel,
                currentLabelOffer: newLabelOffer,
                contractsViewed: newContractsViewed,
                lessonsViewed: newLessonsViewed,
                modal: outcome.viewContract ? 'contract' : state.modal,
                statistics: updatedStatistics,
            };
        }
        case 'DISMISS_OUTCOME': {
            if (state.status !== 'playing') return { ...state, lastOutcome: null };
            
            // --- Weekly Processing ---
            let newStats = { ...state.playerStats };
            let newStaff = [...state.staff];
            let eventsThisWeek: string[] = [];

            // 1. Apply staff bonuses
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

            // 2. Apply difficulty modifiers and pay staff salaries
            const settings = getDifficultySettings(state.difficulty);
            const totalSalary = Math.floor(newStaff.reduce((sum, s) => sum + s.salary, 0) * settings.salaryMultiplier);
            newStats.cash -= totalSalary;
            if (totalSalary > 0) eventsThisWeek.push(`Paid $${totalSalary.toLocaleString()} in staff salaries.`);

            // Apply debt interest (hardcore only)
            if (settings.debtInterest && newStats.cash < 0) {
                const interest = Math.floor(Math.abs(newStats.cash) * 0.05); // 5% weekly interest
                newStats.cash -= interest;
                if (interest > 0) {
                    eventsThisWeek.push(`Debt interest: -$${interest.toLocaleString()}`);
                }
            }
            
            // Random events (realistic and hardcore)
            if (settings.randomEvents && Math.random() < 0.1) { // 10% chance each week
                const randomEvents = [
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
                    }
                ];
                
                const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
                eventsThisWeek.push(randomEvent.description);
                newStats.cash += randomEvent.cash || 0;
                newStats.fame += randomEvent.fame || 0;
                newStats.wellBeing += randomEvent.wellBeing || 0;
                newStats.hype += randomEvent.hype || 0;
            }
            
            // 3. Project Release Check
            let newProject = state.currentProject;
            let updatedAchievements = [...state.achievements];
            let newUnseenAchievements = [...state.unseenAchievements];
            if (newProject && newProject.progress >= newProject.requiredProgress) {
                const qualityBonus = Math.floor(newProject.quality / 10);
                const hypeBonus = Math.floor(newProject.quality / 5 + state.playerStats.hype / 10);
                const fameBonus = 5 + qualityBonus;
                const careerBonus = 10 + qualityBonus;
                newStats.fame += fameBonus;
                newStats.hype += hypeBonus;
                newStats.careerProgress += careerBonus;
                eventsThisWeek.push(`You released '${newProject.name}'! It gained ${fameBonus} Fame, ${hypeBonus} Hype, and ${careerBonus} Career Progress.`);
                const projectAchievement = updatedAchievements.find(a => a.id === `PROJECT_${newProject?.id}`);
                if(projectAchievement && !projectAchievement.unlocked){
                    projectAchievement.unlocked = true;
                    newUnseenAchievements.push(projectAchievement.id);
                }
                newProject = null;
            }

            // 4. Update Stats with difficulty modifiers
            newStats.fame = Math.min(100, Math.max(0, newStats.fame + bonusFame));
            
            // Apply hype decay with difficulty modifier
            const hypeDecay = Math.floor(2 * settings.statsDecayRate);
            newStats.hype = Math.min(100, Math.max(0, newStats.hype + bonusHype - hypeDecay));
            
            // Advance current date by random 3-7 days
            const daysToAdvance = Math.floor(Math.random() * 5) + 3; // 3-7 days
            const newCurrentDate = new Date(state.currentDate);
            newCurrentDate.setDate(newCurrentDate.getDate() + daysToAdvance);
            
            // Determine game-week derived from newCurrentDate
            const newGameDate = toGameDate(newCurrentDate, state.startDate);
            // Record historical data point every 4 weeks (using totalWeeks derived from newGameDate)
            const totalWeeks = (newGameDate.year - 1) * 48 + (newGameDate.month - 1) * 4 + newGameDate.week;
            let newHistory = [...state.currentHistory];
            if (totalWeeks % 4 === 0) {
                newHistory.push({
                    week: totalWeeks,
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

            // 6. Update Staff Contracts
            newStaff.forEach(s => s.contractLength--);
            const expiredStaff = newStaff.find(s => s.contractLength === 0);
            if(expiredStaff) {
                 eventsThisWeek.push(`${expiredStaff.name}'s contract has expired! You'll need to decide whether to renew.`);
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
                    startDate: state.sessionStartTime,
                    endDate: Date.now(),
                    finalStats: newStats,
                    weeksPlayed: totalWeeks,
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
            const newLogs = eventsThisWeek.length > 0 ? appendLogToArray(state.logs, createLog(eventsThisWeek.join(' '), 'info', new Date(newCurrentDate))) : state.logs;

            return {
                ...state,
                status: newStatus,
                lastOutcome: null,
                currentScenario: null,
                playerStats: newStats,
                // legacy `date` removed; `currentDate` represents actual timeline
                currentDate: newCurrentDate,
                currentProject: newProject,
                // careerLog removed; preserve only Date-based logs
                logs: newLogs,
                achievements: milestoneCheck.achievements,
                unseenAchievements: [...new Set([...newUnseenAchievements, ...milestoneCheck.unseenAchievements])],
                staff: newStaff,
                debtTurns: newDebtTurns,
                burnoutTurns: newBurnoutTurns,
                gameOverReason: newGameOverReason,
                statistics: newStatistics,
                currentHistory: newHistory,
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
        case 'VIEW_MANAGEMENT_HUB':
            return { ...state, modal: 'management', unseenAchievements: [] };
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
            
            const settings = getDifficultySettings(state.difficulty);
            const adjustedAdvance = Math.floor(state.currentLabelOffer.terms.advance * settings.advanceMultiplier);
            
            const newStats = { ...state.playerStats };
            newStats.cash += adjustedAdvance;
            newStats.fame += 10;
            newStats.hype += 15;
            newStats.careerProgress += 10;
            
            let updatedAchievements = [...state.achievements];
            let newUnseenAchievements = [...state.unseenAchievements];
            
            const signAchievement = updatedAchievements.find(a => a.id === `SIGNED_${state.currentLabelOffer.name.replace(/\s+/g, '_').toUpperCase()}`);
            if (signAchievement && !signAchievement.unlocked) {
                signAchievement.unlocked = true;
                newUnseenAchievements = [...newUnseenAchievements, signAchievement.id];
            }
            
            return {
                ...state,
                playerStats: newStats,
                currentLabel: state.currentLabelOffer,
                currentLabelOffer: null,
                modal: 'none',
                achievements: updatedAchievements,
                unseenAchievements: newUnseenAchievements,
                // legacy careerLog append removed; Date-based log added instead
                logs: appendLogToArray(state.logs, createLog(`Signed with ${state.currentLabelOffer.name}! Received $${state.currentLabelOffer.terms.advance.toLocaleString()} advance.`, 'success', new Date(state.currentDate || new Date())))
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
            
            return { 
                ...state, 
                currentLabelOffer: null, 
                modal: 'none',
                achievements: updatedAchievements,
                unseenAchievements: newUnseenAchievements,
                // legacy careerLog append removed; Date-based log added instead
                logs: appendLogToArray(state.logs, createLog(`Declined the contract offer from ${state.currentLabelOffer?.name || 'the record label'}. Sometimes the best deal is no deal.`, 'info', new Date(state.currentDate || new Date())))
            };
        }
        case 'LOAD_GAME':
            return { ...action.payload, status: 'playing' };
        case 'START_TUTORIAL':
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
        case 'SKIP_TUTORIAL':
            return {
                ...state,
                tutorial: {
                    ...state.tutorial,
                    active: false,
                    skipped: true
                }
            };
        case 'COMPLETE_TUTORIAL': {
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

    const handleContinue = async () => {
        const save = await loadGame('auto');
        if (save) {
            onContinue(save);
        } else {
            alert('Autosave has expired or does not exist');
        }
    };

    return (
        <div className="text-center p-8 flex flex-col items-center justify-center h-full animate-fade-in">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 mb-4">Welcome to MusicSim</h2>
            <p className="text-gray-300 max-w-md mb-8">Your journey in the music industry starts now. Make wise decisions to build a legendary career.</p>
            
            <div className="space-y-4 w-full max-w-sm">
                {autosaveExists && (
                    <button
                        onClick={handleContinue}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-lg hover:scale-105 transition-transform text-lg shadow-lg"
                    >
                        Continue Game
                        {autosaveAge !== null && (
                            <span className="block text-sm mt-1 opacity-75">
                                Last saved {autosaveAge} {autosaveAge === 1 ? 'minute' : 'minutes'} ago
                                {autosaveAge >= 8 && ' (expires soon!)'}
                            </span>
                        )}
                    </button>
                )}
                
                <button
                    onClick={onStart}
                    className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
                >
                    Start New Career
                </button>
            </div>
        </div>
    );
};

const GameScreen: React.FC<{ onStart: () => void, title: string, message: string, buttonText: string }> = ({ onStart, title, message, buttonText }) => (
    <div className="text-center p-8 flex flex-col items-center justify-center h-full animate-fade-in">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 mb-4">{title}</h2>
        <p className="text-gray-300 max-w-md mb-8">{message}</p>
        <button
            onClick={onStart}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
        >
            {buttonText}
        </button>
    </div>
);

const GameApp: React.FC<{ isGuestMode: boolean; onResetToLanding: () => void }> = ({ isGuestMode, onResetToLanding }) => {
    const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
    const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);
    const [showMistakeWarning, setShowMistakeWarning] = useState(false);

    // Welcome dialog state
    const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
    const [welcomeArtistName, setWelcomeArtistName] = useState('');
    const [hasAutoLoaded, setHasAutoLoaded] = useState(false); // Prevent double-loading

    const { status, playerStats, currentScenario, lastOutcome, artistName, achievements, currentProject, unseenAchievements, modal, date, staff, gameOverReason, logs } = state;

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

    // Background music management based on game status
    useEffect(() => {
        if (status === 'start' || status === 'setup') {
            audioManager.playMusic('menu');
        } else if (status === 'playing') {
            audioManager.playMusic('gameplay');
        } else if (status === 'gameOver') {
            audioManager.playMusic('gameOver');
            audioManager.playSound('gameOver');
        }
    }, [status, audioManager]);

    // Play achievement unlock sound when new achievements are unlocked
    useEffect(() => {
        if (unseenAchievements.length > 0) {
            audioManager.playSound('achievementUnlock');
        }
    }, [unseenAchievements.length, audioManager]);

    // Track previous stats to detect changes and play appropriate sounds
    const prevStatsRef = useRef(playerStats);
    useEffect(() => {
        const prevStats = prevStatsRef.current;
        const currentStats = playerStats;

        // Only play sounds during gameplay
        if (status === 'playing') {
            // Cash changes
            if (currentStats.cash > prevStats.cash) {
                audioManager.playSound('cashGain');
            } else if (currentStats.cash < prevStats.cash) {
                audioManager.playSound('cashLoss');
            }

            // Fame/Hype increases (only play for positive changes)
            if (currentStats.fame > prevStats.fame || currentStats.hype > prevStats.hype) {
                audioManager.playSound('fameIncrease');
            }
        }

        prevStatsRef.current = currentStats;
    }, [playerStats, status, audioManager]);
    
    useEffect(() => {
        if ((status === 'loading' || (status === 'playing' && !currentScenario)) && artistName) {
            fetchNextScenario(state);
        }
    }, [status, artistName, fetchNextScenario, state, currentScenario]);

    // Auto-save effect
    useEffect(() => {
        if (status === 'playing' && isStorageAvailable()) {
            autoSave(state);
        }
    }, [state.date, state.playerStats, status]); // Auto-save when date or stats change

    // Clean up expired autosaves on mount
    useEffect(() => {
        const cleanup = async () => {
            await cleanupExpiredAutosaves();
        };
        cleanup();
    }, []);

    // Auto-save every 2 minutes during gameplay
    useEffect(() => {
        if (status !== 'playing') return;

        const autoSaveInterval = setInterval(async () => {
            console.log('Auto-saving game...');
            await saveGame(state, 'auto');
        }, 2 * 60 * 1000); // 2 minutes

        return () => clearInterval(autoSaveInterval);
    }, [status, state]);

    // Clean up old autosaves only during active gameplay
    useEffect(() => {
        if (status !== 'playing') return; // Only cleanup during gameplay

        const cleanupInterval = setInterval(async () => {
            console.log('Checking for expired autosaves...');
            await cleanupExpiredAutosaves();
        }, 60 * 1000); // 1 minute

        return () => clearInterval(cleanupInterval);
    }, [status]); // Add status dependency

    // Auto-load user's autosave when authenticated (not guest mode)
    useEffect(() => {
        const autoLoadGame = async () => {
            // Prevent multiple calls
            if (hasAutoLoaded) return;
            
            // Only run if user just logged in and game hasn't started, and not in guest mode
            if (isAuthenticated && !authLoading && status === 'start' && !isGuestMode) {
                try {
                    console.log('Checking for autosave...');
                    const savedState = await loadGame('auto');
                    
                    if (savedState) {
                        console.log(`Auto-resuming game for ${savedState.artistName}`);
                        
                        // Mark as loaded to prevent duplicate
                        setHasAutoLoaded(true);
                        
                        // Load the game
                        dispatch({ type: 'LOAD_GAME', payload: savedState });
                        
                        // Show welcome dialog
                        setWelcomeArtistName(savedState.artistName);
                        setShowWelcomeDialog(true);
                    } else {
                        console.log('No autosave found. User can start new game.');
                    }
                } catch (error) {
                    console.error('Error loading autosave:', error);
                }
            }
        };

        autoLoadGame();
    }, [isAuthenticated, authLoading, status, isGuestMode, hasAutoLoaded]);

    // Reset hasAutoLoaded when user logs out
    useEffect(() => {
        if (!isAuthenticated) {
            setHasAutoLoaded(false);
        }
    }, [isAuthenticated]);

    // Reset game state when returning to landing (logout/exit guest mode)
    useEffect(() => {
        const handleReset = () => {
            if (!isAuthenticated && !isGuestMode && status !== 'start') {
                console.log('Resetting game state...');
                dispatch({ type: 'RESTART' });
            }
        };

        handleReset();
    }, [isAuthenticated, isGuestMode, status]);

    // Auto-start tutorial for new players
    useEffect(() => {
        // Check if this is a brand new player (no previous statistics or tutorial completion)
        const isNewPlayer = state.statistics.totalGamesPlayed === 0 && 
                           !state.tutorial.completed && 
                           !state.tutorial.skipped &&
                           status === 'playing' &&
                           !state.tutorial.active;
        
        if (isNewPlayer) {
            // Delay tutorial start to let the game render first
            setTimeout(() => {
                dispatch({ type: 'START_TUTORIAL' });
            }, 1000);
        }
    }, [status, state.statistics.totalGamesPlayed, state.tutorial.completed, state.tutorial.skipped, state.tutorial.active]);

    const handleChoiceSelect = (choice: Choice) => {
        audioManager.playSound('buttonClick');

        // Check for bad choices in beginner mode
        if (state.difficulty === 'beginner' && isBadChoice(choice.outcome, state.difficulty)) {
            setPendingChoice(choice);
            setShowMistakeWarning(true);
        } else {
            dispatch({ type: 'SELECT_CHOICE', payload: choice });
        }
    };

    const handleMistakeProceed = () => {
        audioManager.playSound('buttonClick');
        if (pendingChoice) {
            dispatch({ type: 'SELECT_CHOICE', payload: pendingChoice });
            setPendingChoice(null);
        }
        setShowMistakeWarning(false);
    };

    const handleMistakeReconsider = () => {
        audioManager.playSound('buttonClick');
        setPendingChoice(null);
        setShowMistakeWarning(false);
    };

    const handleContinue = () => {
        audioManager.playSound('weekAdvance');
        dispatch({ type: 'DISMISS_OUTCOME' });
    };

    const handleStartGame = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'START_SETUP' });
    };

    const handleContinueFromAutosave = (gameState: GameState) => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'LOAD_GAME', payload: gameState });
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
        audioManager.playSound('buttonClick');
        dispatch({ type: 'VIEW_MANAGEMENT_HUB' });
    };

    const handleShowSaveLoad = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'VIEW_SAVE_LOAD' });
    };

    const handleShowLearningHub = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'VIEW_LEARNING_HUB' });
    };

    const handleShowStatistics = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'VIEW_STATISTICS' });
    };

    const handleOpenModule = (module: LearningModule) => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'OPEN_MODULE', payload: module });
    };

    const handleCompleteModule = (moduleId: string, score: number, conceptsMastered: string[]) => {
        audioManager.playSound('lessonComplete');
        dispatch({ type: 'COMPLETE_MODULE', payload: { moduleId, score, conceptsMastered } });
    };

    const handleCloseModule = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'CLOSE_MODULE' });
    };

    const handleCloseModal = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'CLOSE_MODAL' });
    };

    const handleLoadGame = (gameState: GameState) => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'LOAD_GAME', payload: gameState });
    };

    const handleViewContract = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'VIEW_CONTRACT' });
    };

    const handleSignContract = () => {
        audioManager.playSound('contractSign');
        dispatch({ type: 'SIGN_CONTRACT' });
    };

    const handleDeclineContract = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'DECLINE_CONTRACT' });
    };

    const handleStartTutorial = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'START_TUTORIAL' });
    };

    const handleNextTutorialStep = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'NEXT_TUTORIAL_STEP' });
    };

    const handleSkipTutorial = () => {
        audioManager.playSound('buttonClick');
        dispatch({ type: 'SKIP_TUTORIAL' });
    };

    const handleCompleteTutorial = () => {
        audioManager.playSound('lessonComplete');
        dispatch({ type: 'COMPLETE_TUTORIAL' });
    };

    // Manual save logic - Delete autosave when manual save happens
    const handleManualSave = async (slotName: string) => {
        try {
            // First, delete the autosave
            console.log('Manual save triggered. Deleting autosave...');
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
                return <GameScreen onStart={handleRestart} title="Game Over" message={gameOverMessage} buttonText="Play Again" />;
            case 'loading':
                return <div className="flex-grow flex items-center justify-center"><Loader text="Setting the stage..." /></div>;
            case 'playing':
                if (!currentScenario) return <div className="flex-grow flex items-center justify-center"><Loader text="Loading..." /></div>;
                return <ScenarioCard scenario={currentScenario} onChoiceSelect={handleChoiceSelect} disabled={!!lastOutcome} difficulty={state.difficulty} />;
            default:
                return null;
        }
    }

    const showDashboard = !['start', 'setup'].includes(status);
    
    return (
        <div className="min-h-screen flex flex-col bg-gray-900 bg-grid-gray-800/[0.2]">
             <style>{`.bg-grid-gray-800\\/\\[0\\.2\\] { background-image: linear-gradient(to right, rgba(55, 65, 81, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(55, 65, 81, 0.4) 1px, transparent 1px); background-size: 2.5rem 2.5rem; } .animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            {/* PWA Components */}
            <OfflineBanner isOnline={isOnline} />
            <InstallBanner />
            <Header 
                artistName={artistName || undefined} 
                onShowManagementHub={handleShowManagementHub}
                onShowSaveLoad={handleShowSaveLoad}
                onShowLearningHub={handleShowLearningHub}
                onShowStatistics={handleShowStatistics}
                onStartTutorial={handleStartTutorial}
                hasUnseenAchievements={unseenAchievements.length > 0}
                difficulty={status === 'playing' ? state.difficulty : undefined}
            />
            
            <div className="flex-grow w-full max-w-4xl mx-auto p-4 lg:p-6 flex flex-col">
                {showDashboard && <Dashboard stats={playerStats} project={currentProject} date={date} currentDate={state.currentDate} />}
                
                {/* History section right after stats */}
                {showDashboard && <GameHistory logs={state.logs || []} />}
                
                <main className="flex-grow flex items-center justify-center mt-6">
                    {renderGameContent()}
                </main>
            </div>

            {lastOutcome && <OutcomeModal outcome={lastOutcome} onClose={handleContinue} />}
            {modal === 'management' && <ManagementModal achievements={achievements} logs={logs} staff={staff} onClose={handleCloseModal}/>}
            {modal === 'saveload' && <SaveLoadModal isOpen={true} onClose={handleCloseModal} onLoadGame={handleLoadGame} currentGameState={state} />}
            {modal === 'learning' && <LearningHub isOpen={true} onClose={handleCloseModal} onOpenModule={handleOpenModule} playerKnowledge={state.playerKnowledge} />}
            {modal === 'moduleViewer' && state.currentModule && (
                <ModuleViewer 
                    module={state.currentModule} 
                    onComplete={handleCompleteModule}
                    onClose={handleCloseModule}
                />
            )}
            {modal === 'contract' && state.currentLabelOffer && (
                <ContractViewer 
                    label={state.currentLabelOffer}
                    onSign={handleSignContract}
                    onDecline={handleDeclineContract}
                />
            )}
            {modal === 'statistics' && <StatisticsModal state={state} onClose={handleCloseModal} />}

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

            <footer className="text-center p-4 text-gray-500 text-sm">
                A Music Industry Simulation
            </footer>
        </div>
    );
};

// User profile component
const UserProfile: React.FC<{ onOpenLoginModal: () => void }> = ({ onOpenLoginModal }) => {
    const { user, logout, isAuthenticated } = useAuth();

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
                onClick={logout}
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
    const [showLanding, setShowLanding] = useState(true);

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
        setShowLanding(false);
    };

    // Handle logout
    const handleLogout = async () => {
        await logout();
        setGuestMode(false);
        setShowLanding(true);
        // Game state will be reset by GameApp component
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
            {!showLanding && (isAuthenticated || guestMode) && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-violet-300">MusicSim</h1>
                            {guestMode && (
                                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30">
                                    Guest Mode
                                </span>
                            )}
                            {isAuthenticated && user && (
                                <span className="text-sm text-gray-400">
                                    {user.username}
                                </span>
                            )}
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-400 hover:text-red-300 font-medium"
                        >
                            {guestMode ? 'Exit Guest Mode' : 'Logout'}
                        </button>
                    </div>
                </div>
            )}

            {/* Game content with proper padding when header is visible */}
            <div className={`${!showLanding ? 'pt-16' : ''}`}>
                <GameApp isGuestMode={guestMode} onResetToLanding={handleLogout} />
            </div>
        </div>
    );
};

// Main App component with authentication provider
const App: React.FC = () => {
    return (
        <ToastProvider>
            <AuthProvider>
                <AudioProvider>
                    <AuthenticatedApp />
                </AudioProvider>
            </AuthProvider>
        </ToastProvider>
    );
};

export default App;