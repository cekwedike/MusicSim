import React, { useState } from 'react';
import type { LearningModule, PlayerKnowledge } from '../types';
import learningModules from '../data/learningModules';

interface LearningPanelProps {
  onOpenModule: (module: LearningModule) => void;
  playerKnowledge: PlayerKnowledge;
}

const LearningPanel: React.FC<LearningPanelProps> = ({ onOpenModule, playerKnowledge }) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Calculate player level and XP
  const totalXP = playerKnowledge.completedModules.length * 100 +
                  Object.values(playerKnowledge.moduleScores).reduce((sum: number, score) => sum + score, 0);
  const playerLevel = Math.floor(totalXP / 300) + 1;
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
        return 'bg-blue-500';
      case 'revenue':
        return 'bg-green-500';
      case 'rights':
        return 'bg-purple-500';
      case 'marketing':
        return 'bg-pink-500';
      case 'legal':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isModuleUnlocked = (module: LearningModule): boolean => {
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

  const toggleExpand = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="h-full overflow-y-auto -mx-4 px-4 space-y-4">
      {/* Header */}
      <div className="sticky top-0 bg-gray-800/95 backdrop-blur-md -mx-4 px-4 py-3 border-b border-purple-500/30 z-10">
        <p className="text-gray-300 text-xs leading-relaxed">
          Master the business side of music through interactive learning
        </p>
      </div>

      {/* Level & Progress */}
      <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-lg p-3 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {playerLevel}
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-sm">Level {playerLevel}</div>
            <div className="text-purple-300 text-xs">{totalXP} Total XP</div>
          </div>
        </div>
        <div className="w-full bg-purple-900/50 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500 shadow-sm shadow-yellow-500/50"
            style={{ width: `${levelProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-lg p-2.5 text-center transform hover:scale-105 transition-transform duration-200">
          <div className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            {playerKnowledge.completedModules.length}
          </div>
          <div className="text-purple-200 text-xs">Done</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-2.5 text-center transform hover:scale-105 transition-transform duration-200">
          <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            {playerKnowledge.conceptsMastered.length}
          </div>
          <div className="text-green-200 text-xs">Skills</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-2.5 text-center transform hover:scale-105 transition-transform duration-200">
          <div className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {Math.round(
              (Object.values(playerKnowledge.moduleScores) as number[]).reduce((sum, score) => sum + score, 0) /
              Math.max(Object.keys(playerKnowledge.moduleScores).length, 1)
            )}%
          </div>
          <div className="text-yellow-200 text-xs">Score</div>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold text-sm px-1 mb-2">Available Courses</h3>
        {learningModules.map((module) => {
          const isUnlocked = isModuleUnlocked(module);
          const isCompleted = isModuleCompleted(module.id);
          const score = getModuleScore(module.id);
          const isExpanded = expandedModule === module.id;

          return (
            <div
              key={module.id}
              className={`
                relative border rounded-lg overflow-hidden transition-all duration-300
                ${isUnlocked
                  ? 'border-purple-500/30 bg-gradient-to-br from-gray-700/50 to-gray-800/50 hover:border-purple-500/60 cursor-pointer'
                  : 'border-gray-700 bg-gray-800/30 opacity-60'
                }
                ${isCompleted ? 'ring-2 ring-green-500/40' : ''}
                ${isExpanded ? 'shadow-lg shadow-purple-500/20' : ''}
              `}
            >
              {/* Main Content */}
              <div
                className="p-3"
                onClick={() => isUnlocked && toggleExpand(module.id)}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-2xl flex-shrink-0">{module.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm leading-tight mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                      {module.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className={`${getCategoryColor(module.category)} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                        {module.category}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getDifficultyColor(module.difficulty)} text-white font-medium`}>
                        {module.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-col gap-1 items-end">
                    {isCompleted && (
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {score}%
                      </div>
                    )}
                    {!isUnlocked && (
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {module.estimatedMinutes}min
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    {module.quiz.length} quiz
                  </div>
                </div>

                {/* Expand Indicator */}
                {isUnlocked && (
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 text-xs font-medium">
                      {isCompleted ? 'Review' : 'Start'}
                    </span>
                    <svg
                      className={`w-4 h-4 text-purple-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && isUnlocked && (
                <div className="border-t border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-violet-900/20 p-3 space-y-3 animate-slideDown">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {module.content.introduction.substring(0, 150)}...
                  </p>

                  {module.prerequisites && module.prerequisites.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold text-purple-300 mb-1">Prerequisites:</h5>
                      <div className="space-y-0.5">
                        {module.prerequisites.map(prereq => {
                          const prereqModule = learningModules.find(m => m.id === prereq);
                          return (
                            <div key={prereq} className="text-xs text-gray-400 flex items-center gap-1">
                              <svg className="w-2.5 h-2.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              {prereqModule?.title || prereq}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModule(module);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {isCompleted ? 'Review Module' : 'Start Learning'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Info */}
      <div className="bg-gradient-to-br from-violet-600/10 to-purple-600/10 border border-violet-500/30 rounded-lg p-3 mt-4">
        <h3 className="text-white font-bold text-xs mb-1">Why Learn?</h3>
        <p className="text-purple-200 text-xs leading-relaxed">
          Knowledge is power. Understanding the business side helps you make better decisions and build a sustainable career.
        </p>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        /* Scrollbar Styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
};

export default LearningPanel;
