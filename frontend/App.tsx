import React, { useReducer, useCallback, useEffect, useState } from 'react';
import type { GameState, Action, Choice, Scenario, PlayerStats, Project, GameDate, Staff, RecordLabel } from './types';
import { getNewScenario } from './services/scenarioService';
import { autoSave, loadGame, isStorageAvailable } from './services/storageService';
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

const GRACE_PERIOD_WEEKS = 8;

const generateInitialState = (artistName = '', artistGenre = ''): GameState => {
    const startingCash = Math.floor(Math.random() * 16) + 5; // Random number between 5 and 20
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
        consecutiveFallbackCount: 0,
        staff: [],
        currentLabel: null,
        debtTurns: 0,
        burnoutTurns: 0,
        gameOverReason: null,
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
            if(outcome.signLabel) {
                const labelTemplate = allLabels.find(l => l.id === outcome.signLabel);
                if(labelTemplate) {
                    newLabel = labelTemplate;
                    const signAchievement = updatedAchievements.find(a => a.id === `SIGNED_${labelTemplate.id}`);
                    if (signAchievement && !signAchievement.unlocked) {
                        signAchievement.unlocked = true;
                        newUnseenAchievements = [...newUnseenAchievements, signAchievement.id];
                    }
                }
            }

            const milestoneCheck = checkAchievements({...state, staff: newStaff}, newStats);
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

            // 2. Pay staff salaries
            const totalSalary = newStaff.reduce((sum, s) => sum + s.salary, 0);
            newStats.cash -= totalSalary;
            if (totalSalary > 0) eventsThisWeek.push(`Paid $${totalSalary.toLocaleString()} in staff salaries.`);
            
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

            // 4. Update Stats
            newStats.fame = Math.min(100, Math.max(0, newStats.fame + bonusFame));
            newStats.hype = Math.min(100, Math.max(0, newStats.hype + bonusHype - 2)); // Hype decay
            
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
            
            // 6. Update Staff Contracts
            newStaff.forEach(s => s.contractLength--);
            const expiredStaff = newStaff.find(s => s.contractLength === 0);
            if(expiredStaff) {
                 eventsThisWeek.push(`${expiredStaff.name}'s contract has expired! You'll need to decide whether to renew.`);
            }
            
            // 7. Check Game Over Grace Period
            let newDebtTurns = newStats.cash < 0 ? state.debtTurns + 1 : 0;
            let newBurnoutTurns = newStats.wellBeing <= 0 ? state.burnoutTurns + 1 : 0;
            let newStatus: GameState['status'] = 'loading';
            let newGameOverReason: GameState['gameOverReason'] = null;

            if (newDebtTurns > GRACE_PERIOD_WEEKS) {
                newStatus = 'gameOver';
                newGameOverReason = 'debt';
            } else if (newBurnoutTurns > GRACE_PERIOD_WEEKS) {
                newStatus = 'gameOver';
                newGameOverReason = 'burnout';
            } else if (newStats.careerProgress >= 100) {
                newStatus = 'gameWon';
            }


            const milestoneCheck = checkAchievements({...state, achievements: updatedAchievements}, newStats);
            const newCareerLog = eventsThisWeek.length > 0 ? [...state.careerLog, { date: newDate, description: eventsThisWeek.join(' ') }] : state.careerLog;

            return {
                ...state,
                status: newStatus,
                lastOutcome: null,
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
            };
        }
        case 'RESTART': {
             const newState = generateInitialState(state.artistName, state.artistGenre);
             return {
                 ...newState,
                 status: 'loading',
             };
        }
        case 'VIEW_MANAGEMENT_HUB':
            return { ...state, modal: 'management', unseenAchievements: [] };
        case 'CLOSE_MODAL':
            return { ...state, modal: 'none' };
        case 'LOAD_GAME':
            return { ...action.payload, status: 'playing' };
        default:
            return state;
    }
}


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

const App: React.FC = () => {
    const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
    const { status, playerStats, currentScenario, lastOutcome, artistName, careerLog, achievements, currentProject, unseenAchievements, modal, date, staff, gameOverReason } = state;

    const fetchNextScenario = useCallback(async (currentState: GameState) => {
        const scenario = getNewScenario(currentState);
        setTimeout(() => {
            dispatch({ type: 'SCENARIO_LOADED', payload: scenario });
        }, 500);

    }, []);
    
    useEffect(() => {
        if (status === 'loading' && artistName) {
            fetchNextScenario(state);
        }
    }, [status, artistName, fetchNextScenario, state]);

    // Auto-save effect
    useEffect(() => {
        if (status === 'playing' && isStorageAvailable()) {
            autoSave(state);
        }
    }, [state.date, state.playerStats, status]); // Auto-save when date or stats change

    // Initial load check
    const [initialLoadChecked, setInitialLoadChecked] = useState(false);
    useEffect(() => {
        if (!initialLoadChecked && status === 'start' && isStorageAvailable()) {
            const autoSaveData = loadGame('auto');
            if (autoSaveData && autoSaveData.artistName) {
                const shouldLoad = window.confirm(
                    `Found a saved game for "${autoSaveData.artistName}" (${autoSaveData.artistGenre}). Do you want to continue?`
                );
                if (shouldLoad) {
                    dispatch({ type: 'LOAD_GAME', payload: autoSaveData });
                }
            }
            setInitialLoadChecked(true);
        }
    }, [status, initialLoadChecked]);

    const handleChoiceSelect = (choice: Choice) => dispatch({ type: 'SELECT_CHOICE', payload: choice });
    const handleContinue = () => dispatch({ type: 'DISMISS_OUTCOME' });
    const handleStartGame = () => dispatch({ type: 'START_SETUP' });
    const handleRestart = () => dispatch({ type: 'RESTART' });
    const handleSetupSubmit = (name: string, genre: string) => dispatch({ type: 'SUBMIT_SETUP', payload: { name, genre } });
    const handleShowManagementHub = () => dispatch({ type: 'VIEW_MANAGEMENT_HUB' });
    const handleCloseModal = () => dispatch({ type: 'CLOSE_MODAL' });

    const renderGameContent = () => {
        switch (status) {
            case 'start':
                return <GameScreen onStart={handleStartGame} title="Welcome to MusicSim" message="Your journey in the music industry starts now. Make wise decisions to build a legendary career." buttonText="Start Your Career" />;
            case 'setup':
                return <ArtistSetup onSubmit={handleSetupSubmit} />;
            case 'gameOver':
                const gameOverMessage = gameOverReason === 'debt'
                    ? `After ${GRACE_PERIOD_WEEKS} weeks in debt, you've gone bankrupt. The show can't go on.`
                    : `After ${GRACE_PERIOD_WEEKS} weeks of pushing yourself too hard, you've suffered a complete burnout. You need to step away from the industry.`;
                return <GameScreen onStart={handleRestart} title="Game Over" message={gameOverMessage} buttonText="Play Again" />;
            case 'gameWon':
                return <GameScreen onStart={handleRestart} title="You're a MusicSim Master!" message="Congratulations! You've become a true legend. Your legacy is secure!" buttonText="Play Again" />;
            case 'loading':
                return <div className="flex-grow flex items-center justify-center"><Loader text="Setting the stage..." /></div>;
            case 'playing':
                if (!currentScenario) return <div className="flex-grow flex items-center justify-center"><Loader text="Loading..." /></div>;
                return <ScenarioCard scenario={currentScenario} onChoiceSelect={handleChoiceSelect} disabled={!!lastOutcome} />;
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
                hasUnseenAchievements={unseenAchievements.length > 0}
            />
            
            <div className="flex-grow w-full max-w-4xl mx-auto p-4 lg:p-6 flex flex-col">
                {showDashboard && <Dashboard stats={playerStats} project={currentProject} date={date} />}
                
                <main className="flex-grow flex items-center justify-center mt-6">
                    {renderGameContent()}
                </main>
            </div>

            {lastOutcome && <OutcomeModal outcome={lastOutcome} onClose={handleContinue} />}
            {modal === 'management' && <ManagementModal achievements={achievements} events={careerLog} staff={staff} onClose={handleCloseModal}/>}

            <footer className="text-center p-4 text-gray-500 text-sm">
                A Music Industry Simulation
            </footer>
        </div>
    );
};

export default App;