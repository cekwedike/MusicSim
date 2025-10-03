import React, { useReducer, useCallback, useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginModal } from './components/LoginModal';
import type { GameState, Action, Choice, Scenario, PlayerStats, Project, GameDate, Staff, RecordLabel, LearningModule, CareerHistory, Difficulty } from './types';
import { getNewScenario } from './services/scenarioService';
import { autoSave, loadGame, isStorageAvailable } from './services/storageService';
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
        careerLog: [],
        date: { week: 1, month: 1, year: 1 },
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
    const totalWeeks = (state.date.year - 1) * 48 + (state.date.month - 1) * 4 + state.date.week;
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
                careerLog: [{date: state.date, description: `The artist '${action.payload.name}' (${action.payload.genre}) is born!`}]
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
                careerLog: [...state.careerLog, { date: state.date, description: outcome.text }],
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
            
            // 5. Update Date
            let newDate = { ...state.date };
            newDate.week++;
            if (newDate.week > 4) {
                newDate.week = 1;
                newDate.month++;
            }
            if (newDate.month > 12) {
                newDate.month = 1;
                newDate.year++;
            }
            
            // Record historical data point every 4 weeks
            const totalWeeks = (newDate.year - 1) * 48 + (newDate.month - 1) * 4 + newDate.week;
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

            // Update statistics
            let newStatistics = updateStatistics({...state, playerStats: newStats, date: newDate}, state.statistics);

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
                    majorEvents: state.careerLog.map(e => e.description).slice(0, 10),
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
            const newCareerLog = eventsThisWeek.length > 0 ? [...state.careerLog, { date: newDate, description: eventsThisWeek.join(' ') }] : state.careerLog;

            return {
                ...state,
                status: newStatus,
                lastOutcome: null,
                currentScenario: null,
                playerStats: newStats,
                date: newDate,
                currentProject: newProject,
                careerLog: newCareerLog,
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
            if (state.artistName && state.date.week > 1) {
                const totalWeeks = (state.date.year - 1) * 48 + (state.date.month - 1) * 4 + state.date.week;
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
                    majorEvents: state.careerLog.map(e => e.description).slice(0, 10),
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
                careerLog: [...state.careerLog, { 
                    date: state.date, 
                    description: `Signed with ${state.currentLabelOffer.name}! Received $${state.currentLabelOffer.terms.advance.toLocaleString()} advance.` 
                }]
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
                careerLog: [...state.careerLog, { 
                    date: state.date, 
                    description: `Declined the contract offer from ${state.currentLabelOffer?.name || 'the record label'}. Sometimes the best deal is no deal.` 
                }]
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

const GameApp: React.FC = () => {
    const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
    const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);
    const [showMistakeWarning, setShowMistakeWarning] = useState(false);
    const { status, playerStats, currentScenario, lastOutcome, artistName, careerLog, achievements, currentProject, unseenAchievements, modal, date, staff, gameOverReason } = state;

    const fetchNextScenario = useCallback(async (currentState: GameState) => {
        const scenario = getNewScenario(currentState);
        setTimeout(() => {
            dispatch({ type: 'SCENARIO_LOADED', payload: scenario });
        }, 500);

    }, []);
    
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

    // Initial load check
    const [initialLoadChecked, setInitialLoadChecked] = useState(false);
    useEffect(() => {
        const checkInitialLoad = async () => {
            if (!initialLoadChecked && status === 'start' && isStorageAvailable()) {
                try {
                    const autoSaveData = await loadGame('auto');
                    if (autoSaveData && autoSaveData.artistName) {
                        const shouldLoad = window.confirm(
                            `Found a saved game for "${autoSaveData.artistName}" (${autoSaveData.artistGenre}). Do you want to continue?`
                        );
                        if (shouldLoad) {
                            dispatch({ type: 'LOAD_GAME', payload: autoSaveData });
                        }
                    }
                } catch (error) {
                    console.warn('Failed to load auto-save:', error);
                }
                setInitialLoadChecked(true);
            }
        };
        checkInitialLoad();
    }, [status, initialLoadChecked]);

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
        // Check for bad choices in beginner mode
        if (state.difficulty === 'beginner' && isBadChoice(choice.outcome, state.difficulty)) {
            setPendingChoice(choice);
            setShowMistakeWarning(true);
        } else {
            dispatch({ type: 'SELECT_CHOICE', payload: choice });
        }
    };

    const handleMistakeProceed = () => {
        if (pendingChoice) {
            dispatch({ type: 'SELECT_CHOICE', payload: pendingChoice });
            setPendingChoice(null);
        }
        setShowMistakeWarning(false);
    };

    const handleMistakeReconsider = () => {
        setPendingChoice(null);
        setShowMistakeWarning(false);
    };
    const handleContinue = () => dispatch({ type: 'DISMISS_OUTCOME' });
    const handleStartGame = () => dispatch({ type: 'START_SETUP' });
    const handleRestart = () => dispatch({ type: 'RESTART' });
    const handleSetupSubmit = (name: string, genre: string, difficulty: Difficulty) => dispatch({ type: 'SUBMIT_SETUP', payload: { name, genre, difficulty } });
    const handleShowManagementHub = () => dispatch({ type: 'VIEW_MANAGEMENT_HUB' });
    const handleShowSaveLoad = () => dispatch({ type: 'VIEW_SAVE_LOAD' });
    const handleShowLearningHub = () => dispatch({ type: 'VIEW_LEARNING_HUB' });
    const handleShowStatistics = () => dispatch({ type: 'VIEW_STATISTICS' });
    const handleOpenModule = (module: LearningModule) => dispatch({ type: 'OPEN_MODULE', payload: module });
    const handleCompleteModule = (moduleId: string, score: number, conceptsMastered: string[]) => 
        dispatch({ type: 'COMPLETE_MODULE', payload: { moduleId, score, conceptsMastered } });
    const handleCloseModule = () => dispatch({ type: 'CLOSE_MODULE' });
    const handleCloseModal = () => dispatch({ type: 'CLOSE_MODAL' });
    const handleLoadGame = (gameState: GameState) => dispatch({ type: 'LOAD_GAME', payload: gameState });
    const handleViewContract = () => dispatch({ type: 'VIEW_CONTRACT' });
    const handleSignContract = () => dispatch({ type: 'SIGN_CONTRACT' });
    const handleDeclineContract = () => dispatch({ type: 'DECLINE_CONTRACT' });
    const handleStartTutorial = () => dispatch({ type: 'START_TUTORIAL' });
    const handleNextTutorialStep = () => dispatch({ type: 'NEXT_TUTORIAL_STEP' });
    const handleSkipTutorial = () => dispatch({ type: 'SKIP_TUTORIAL' });
    const handleCompleteTutorial = () => dispatch({ type: 'COMPLETE_TUTORIAL' });

    const renderGameContent = () => {
        switch (status) {
            case 'start':
                return <GameScreen onStart={handleStartGame} title="Welcome to MusicSim" message="Your journey in the music industry starts now. Make wise decisions to build a legendary career." buttonText="Start Your Career" />;
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
                {showDashboard && <Dashboard stats={playerStats} project={currentProject} date={date} />}
                
                <main className="flex-grow flex items-center justify-center mt-6">
                    {renderGameContent()}
                </main>
            </div>

            {lastOutcome && <OutcomeModal outcome={lastOutcome} onClose={handleContinue} />}
            {modal === 'management' && <ManagementModal achievements={achievements} events={careerLog} staff={staff} onClose={handleCloseModal}/>}
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
    const { isAuthenticated, isLoading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Show login modal on first load if not authenticated
    useEffect(() => {
        if (!isLoading && !isInitialized) {
            setIsInitialized(true);
            if (!isAuthenticated) {
                // Don't automatically show login modal, let user choose
                // setShowLoginModal(true);
            }
        }
    }, [isLoading, isAuthenticated, isInitialized]);

    const handleOpenLoginModal = () => setShowLoginModal(true);
    const handleCloseLoginModal = () => setShowLoginModal(false);

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

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header with user info */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold text-yellow-400">MusicSim</h1>
                        {!isAuthenticated && (
                            <span className="text-sm text-yellow-300 bg-yellow-900/30 px-2 py-1 rounded">
                                Playing as Guest
                            </span>
                        )}
                    </div>
                    <UserProfile onOpenLoginModal={handleOpenLoginModal} />
                </div>
            </div>

            {/* Game content */}
            <GameApp />

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={handleCloseLoginModal}
                initialMode="login"
            />
        </div>
    );
};

// Main App component with authentication provider
const App: React.FC = () => {
    return (
        <AuthProvider>
            <AuthenticatedApp />
        </AuthProvider>
    );
};

export default App;