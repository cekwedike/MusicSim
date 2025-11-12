import React, { useState } from 'react';
import type { LearningModule, PlayerKnowledge, GameState } from '../types';
import learningModules from '../data/learningModules';

interface LearningHubProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModule: (module: LearningModule) => void;
  playerKnowledge: PlayerKnowledge;
  gameState: GameState;
}

interface DraggedCard {
  moduleId: string;
  fromIndex: number;
}

const LearningHub: React.FC<LearningHubProps> = ({ isOpen, onClose, onOpenModule, playerKnowledge, gameState }) => {
  const [moduleOrder, setModuleOrder] = useState<string[]>(learningModules.map(m => m.id));
  const [draggedCard, setDraggedCard] = useState<DraggedCard | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Calculate player level and XP
  const totalXP = playerKnowledge.completedModules.length * 100 +
                  (Object.values(playerKnowledge.moduleScores) as number[]).reduce((sum: number, score: number) => sum + score, 0);
  const playerLevel = Math.floor(totalXP / 300) + 1;
  const xpToNextLevel = 300 - (totalXP % 300);
  const levelProgress = ((totalXP % 300) / 300) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'from-green-500 to-emerald-600';
      case 'intermediate':
        return 'from-yellow-500 to-orange-600';
      case 'advanced':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contracts':
        return 'from-blue-500 to-cyan-600';
      case 'revenue':
        return 'from-green-500 to-teal-600';
      case 'rights':
        return 'from-red-500 to-indigo-600';
      case 'marketing':
        return 'from-rose-500 to-rose-600';
      case 'legal':
        return 'from-red-500 to-orange-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const checkMilestoneUnlock = (module: LearningModule): boolean => {
    if (!module.unlockRequirement) return true;

    const req = module.unlockRequirement;

    switch (req.type) {
      case 'always':
        return true;
      case 'fame':
        return gameState.playerStats.fame >= (req.value || 0);
      case 'cash':
        return gameState.playerStats.cash >= (req.value || 0);
      case 'careerProgress':
        return gameState.playerStats.careerProgress >= (req.value || 0);
      case 'hype':
        return gameState.playerStats.hype >= (req.value || 0);
      case 'decisions':
        return gameState.statistics.totalDecisionsMade >= (req.value || 0);
      case 'contractViewed':
        return gameState.contractsViewed.length >= (req.value || 0);
      case 'projectsReleased':
        return gameState.statistics.projectsReleased >= (req.value || 0);
      default:
        return true;
    }
  };

  const isModuleUnlocked = (module: LearningModule): boolean => {
    // Check milestone requirements first
    if (!checkMilestoneUnlock(module)) return false;

    // Then check prerequisites
    if (!module.prerequisites) return true;
    return module.prerequisites.every(prereq =>
      playerKnowledge.completedModules.includes(prereq)
    );
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    return playerKnowledge.completedModules.includes(moduleId);
  };

  const getModuleScore = (moduleId: string): number => {
    return playerKnowledge.moduleScores[moduleId] || 0;
  };

  const handleDragStart = (e: React.DragEvent, moduleId: string, index: number) => {
    setDraggedCard({ moduleId, fromIndex: index });
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedCard(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();

    if (!draggedCard) return;

    const newOrder = [...moduleOrder];
    const [movedItem] = newOrder.splice(draggedCard.fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);

    setModuleOrder(newOrder);
    setDraggedCard(null);
  };

  const toggleCardFlip = (moduleId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(moduleId)) {
      newFlipped.delete(moduleId);
    } else {
      newFlipped.add(moduleId);
    }
    setFlippedCards(newFlipped);
  };

  const orderedModules = moduleOrder.map(id => learningModules.find(m => m.id === id)!);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-xl sm:rounded-2xl w-full max-w-7xl max-h-[98vh] sm:max-h-[95vh] overflow-hidden border border-red-500/30 shadow-2xl shadow-red-500/20 flex flex-col">

        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-red-600 via-red-600 to-rose-600 p-4 sm:p-5 md:p-6 lg:p-8 flex-shrink-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
                  Music Business Academy
                </h2>
                <p className="text-red-100 text-xs sm:text-sm md:text-base">
                  Master the business side of music through interactive learning
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-red-200 hover:text-white transition-all duration-200 hover:rotate-90 text-2xl sm:text-3xl min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-full flex-shrink-0"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Player Stats & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Level & XP */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                      {playerLevel}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm sm:text-base md:text-lg">Level {playerLevel}</div>
                      <div className="text-red-200 text-xs">{xpToNextLevel} XP to next level</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300">{totalXP}</div>
                    <div className="text-red-200 text-xs">Total XP</div>
                  </div>
                </div>
                <div className="w-full bg-red-900/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-yellow-500/50"
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                  <div className="transform hover:scale-110 transition-transform duration-200">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 to-red-400 bg-clip-text text-transparent">
                      {playerKnowledge.completedModules.length}
                    </div>
                    <div className="text-red-200 text-xs mt-1">Completed</div>
                  </div>
                  <div className="transform hover:scale-110 transition-transform duration-200">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {playerKnowledge.conceptsMastered.length}
                    </div>
                    <div className="text-red-200 text-xs mt-1">Concepts</div>
                  </div>
                  <div className="transform hover:scale-110 transition-transform duration-200">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      {Math.round(
                        (Object.values(playerKnowledge.moduleScores) as number[]).reduce((sum, score) => sum + score, 0) /
                        Math.max(Object.keys(playerKnowledge.moduleScores).length, 1)
                      )}%
                    </div>
                    <div className="text-red-200 text-xs mt-1">Avg Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drag Instruction */}
        <div className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pb-2 flex-shrink-0">
          <div className="bg-gradient-to-r from-blue-500/10 to-red-500/10 border border-blue-500/30 rounded-lg p-2 sm:p-3">
            <p className="text-xs sm:text-sm text-blue-200 text-center">
              <span className="font-semibold">Tip:</span> <span className="hidden sm:inline">Drag and drop course cards to organize them by priority. Tap cards to flip and reveal details.</span><span className="sm:hidden">Tap cards to flip and see details.</span>
            </p>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {orderedModules.map((module, index) => {
              const isUnlocked = isModuleUnlocked(module);
              const isCompleted = isModuleCompleted(module.id);
              const score = getModuleScore(module.id);
              const isFlipped = flippedCards.has(module.id);
              const isHovered = hoveredCard === module.id;

              return (
                <div
                  key={module.id}
                  draggable={isUnlocked}
                  onDragStart={(e) => isUnlocked && handleDragStart(e, module.id, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onMouseEnter={() => setHoveredCard(module.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="perspective-1000"
                  style={{ minHeight: '320px' }}
                >
                  <div
                    className={`relative w-full h-full transition-all duration-500 transform-style-3d cursor-pointer ${
                      isFlipped ? 'rotate-y-180' : ''
                    } ${isHovered && isUnlocked ? 'scale-105' : 'scale-100'}`}
                    onClick={() => isUnlocked && toggleCardFlip(module.id)}
                  >
                    {/* Front of Card */}
                    <div
                      className={`absolute inset-0 backface-hidden rounded-xl border-2 overflow-hidden shadow-xl transition-all duration-300 ${
                        isUnlocked
                          ? `bg-gradient-to-br ${getCategoryColor(module.category)} border-transparent hover:shadow-2xl hover:shadow-red-500/30`
                          : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 opacity-60'
                      } ${isCompleted ? 'ring-4 ring-green-400/50' : ''}`}
                    >
                      {/* Card Content */}
                      <div className="relative h-full p-3 sm:p-4 md:p-6 flex flex-col">
                        {/* Status Badge */}
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 flex flex-col gap-2 items-end">
                          {isCompleted && (
                            <div className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-slideInRight">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {score}%
                            </div>
                          )}
                          {!isUnlocked && (
                            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                              Locked
                            </div>
                          )}
                        </div>

                        {/* Icon & Title */}
                        <div className="flex-1">
                          <div className="text-3xl sm:text-4xl md:text-5xl mb-3 md:mb-4 filter drop-shadow-lg">{module.icon}</div>
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 md:mb-3 leading-tight line-clamp-2">
                            {module.title}
                          </h3>

                          {/* Category Badge */}
                          <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full mb-3 md:mb-4 border border-white/30">
                            {module.category.toUpperCase()}
                          </div>

                          {/* Module Info */}
                          <div className="space-y-1.5 sm:space-y-2 text-white/90 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span>{module.estimatedMinutes} minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                              </svg>
                              <span>{module.quiz.length} quiz questions</span>
                            </div>
                            <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(module.difficulty)} text-white text-xs font-semibold`}>
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {module.difficulty}
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        {isUnlocked && (
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenModule(module);
                              }}
                              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 border border-white/30 hover:border-white/50 flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                              {isCompleted ? 'Review Module' : 'Start Learning'}
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </button>
                            {/* Flip Indicator - Below button instead of overlaying */}
                            <div className="mt-2 text-center text-white/60 text-xs flex items-center justify-center gap-1">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span className="hidden sm:inline">Tap to flip</span>
                              <span className="sm:hidden">Flip card</span>
                            </div>
                          </div>
                        )}

                        {/* Unlock Requirement */}
                        {!isUnlocked && module.unlockRequirement && (
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                            <div className="bg-red-900/40 border border-red-500/30 rounded-lg p-2 sm:p-3">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <h4 className="text-red-300 font-semibold text-xs mb-1">Unlock Requirement</h4>
                                  <p className="text-red-200 text-xs leading-relaxed">{module.unlockRequirement.message}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div
                      className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 overflow-hidden shadow-xl ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-red-500/50'
                          : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'
                      }`}
                    >
                      <div className="h-full p-3 sm:p-4 md:p-6 overflow-y-auto">
                        <div className="text-white">
                          <h4 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-red-300">Module Overview</h4>
                          <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                            {module.content.introduction}
                          </p>

                          {module.prerequisites && module.prerequisites.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <h5 className="font-semibold text-xs sm:text-sm text-red-300 mb-2">Prerequisites:</h5>
                              <div className="space-y-1">
                                {module.prerequisites.map(prereq => {
                                  const prereqModule = learningModules.find(m => m.id === prereq);
                                  return (
                                    <div key={prereq} className="text-xs text-gray-400 flex items-center gap-2">
                                      <svg className="w-3 h-3 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                      {prereqModule?.title || prereq}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                            <h5 className="font-semibold text-xs sm:text-sm text-red-300 mb-2">What you'll learn:</h5>
                            <ul className="space-y-1.5 sm:space-y-2">
                              {module.content.keyTakeaways.slice(0, 3).map((takeaway, idx) => (
                                <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  <span>{takeaway}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardFlip(module.id);
                            }}
                            className="mt-4 sm:mt-5 md:mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Flip Back
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="bg-gradient-to-r from-red-600/20 via-red-600/20 to-rose-600/20 border-t border-red-500/30 p-3 sm:p-4 md:p-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-white font-bold mb-1 text-sm md:text-base">Why Learn Music Business?</h3>
              <p className="text-red-200 text-xs md:text-sm leading-relaxed">
                Knowledge is power in the music industry. Understanding contracts, rights, and revenue streams
                helps you make better decisions, avoid predatory deals, and build a sustainable career.
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white font-semibold px-6 md:px-8 py-2.5 sm:py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap min-w-[100px] sm:min-w-[120px] text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Scrollbar Styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
};

export default LearningHub;
