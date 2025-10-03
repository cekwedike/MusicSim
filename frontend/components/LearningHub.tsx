import React from 'react';
import type { LearningModule, PlayerKnowledge } from '../types';
import learningModules from '../data/learningModules';

interface LearningHubProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModule: (module: LearningModule) => void;
  playerKnowledge: PlayerKnowledge;
}

const LearningHub: React.FC<LearningHubProps> = ({ isOpen, onClose, onOpenModule, playerKnowledge }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contracts':
        return 'bg-blue-600';
      case 'revenue':
        return 'bg-green-600';
      case 'rights':
        return 'bg-purple-600';
      case 'marketing':
        return 'bg-pink-600';
      case 'legal':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Music Business Academy</h2>
            <p className="text-gray-300">Learn the business side of music to make smarter career decisions</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Progress Stats */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-violet-400">
                {playerKnowledge.completedModules.length}
              </div>
              <div className="text-gray-300 text-sm">Modules Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {playerKnowledge.conceptsMastered.length}
              </div>
              <div className="text-gray-300 text-sm">Concepts Mastered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(
                  (Object.values(playerKnowledge.moduleScores) as number[]).reduce((sum, score) => sum + score, 0) / 
                  Math.max(Object.keys(playerKnowledge.moduleScores).length, 1)
                )}%
              </div>
              <div className="text-gray-300 text-sm">Average Score</div>
            </div>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningModules.map((module) => {
            const isUnlocked = isModuleUnlocked(module);
            const isCompleted = isModuleCompleted(module.id);
            const score = getModuleScore(module.id);
            
            return (
              <div
                key={module.id}
                className={`
                  relative border rounded-lg p-6 transition-all duration-200
                  ${isUnlocked 
                    ? 'border-gray-600 bg-gray-700 hover:bg-gray-650 cursor-pointer hover:border-violet-500' 
                    : 'border-gray-700 bg-gray-800 opacity-50 cursor-not-allowed'
                  }
                  ${isCompleted ? 'ring-2 ring-green-500' : ''}
                `}
                onClick={() => isUnlocked && onOpenModule(module)}
              >
                {/* Status Indicators */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {isCompleted && (
                    <div className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      ✓ {score}%
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                      🔒 Locked
                    </div>
                  )}
                </div>

                {/* Module Content */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{module.icon}</span>
                    <div>
                      <h3 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(module.category)} text-white`}>
                          {module.category.toUpperCase()}
                        </span>
                        <span className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-gray-300 text-sm mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span>⏱️ {module.estimatedMinutes} minutes</span>
                    <span>📊 {module.quiz.length} quiz questions</span>
                  </div>
                  
                  {module.prerequisites && module.prerequisites.length > 0 && (
                    <div className="text-xs text-gray-400">
                      <strong>Prerequisites:</strong> {module.prerequisites.map(prereq => {
                        const prereqModule = learningModules.find(m => m.id === prereq);
                        return prereqModule?.title || prereq;
                      }).join(', ')}
                    </div>
                  )}
                </div>

                {/* Preview of content */}
                <p className={`text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                  {module.content.introduction.substring(0, 120)}...
                </p>

                {/* Action indicator */}
                {isUnlocked && (
                  <div className="mt-4 text-violet-400 text-sm font-medium">
                    {isCompleted ? '🔄 Review Module' : '▶️ Start Learning'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="mt-6 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg p-4">
          <h3 className="text-white font-bold mb-2">💡 Why Learn Music Business?</h3>
          <p className="text-violet-100 text-sm">
            Knowledge is power in the music industry. Understanding contracts, rights, and revenue streams 
            helps you make better decisions, avoid predatory deals, and build a sustainable career. 
            Each module teaches real-world concepts with African music industry context.
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningHub;