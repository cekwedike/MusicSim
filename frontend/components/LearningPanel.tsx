import React from 'react';
import type { LearningModule, PlayerKnowledge } from '../types';
import learningModules from '../data/learningModules';

interface LearningPanelProps {
  onOpenModule: (module: LearningModule) => void;
  playerKnowledge: PlayerKnowledge;
}

const LearningPanel: React.FC<LearningPanelProps> = ({ onOpenModule, playerKnowledge }) => {
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

  return (
    <div className="h-full overflow-y-auto -mx-4 px-4">
      {/* Subtitle */}
      <p className="text-gray-400 text-sm mb-4">
        Learn the business side of music to make smarter career decisions
      </p>

      {/* Progress Stats */}
      <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-violet-400">
              {playerKnowledge.completedModules.length}
            </div>
            <div className="text-gray-300 text-xs">Completed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">
              {playerKnowledge.conceptsMastered.length}
            </div>
            <div className="text-gray-300 text-xs">Concepts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">
              {Math.round(
                (Object.values(playerKnowledge.moduleScores) as number[]).reduce((sum, score) => sum + score, 0) /
                Math.max(Object.keys(playerKnowledge.moduleScores).length, 1)
              )}%
            </div>
            <div className="text-gray-300 text-xs">Avg Score</div>
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-3">
        {learningModules.map((module) => {
          const isUnlocked = isModuleUnlocked(module);
          const isCompleted = isModuleCompleted(module.id);
          const score = getModuleScore(module.id);

          return (
            <div
              key={module.id}
              className={`
                relative border rounded-lg p-3 transition-all duration-200
                ${isUnlocked
                  ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700 cursor-pointer hover:border-violet-500'
                  : 'border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed'
                }
                ${isCompleted ? 'ring-1 ring-green-500' : ''}
              `}
              onClick={() => isUnlocked && onOpenModule(module)}
            >
              {/* Status Indicators */}
              <div className="absolute top-2 right-2 flex gap-1">
                {isCompleted && (
                  <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                    ✓ {score}%
                  </div>
                )}
                {!isUnlocked && (
                  <div className="bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                    🔒
                  </div>
                )}
              </div>

              {/* Module Content */}
              <div className="mb-2">
                <div className="flex items-start gap-2 mb-2 pr-16">
                  <span className="text-xl flex-shrink-0">{module.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-gray-500'} line-clamp-2`}>
                      {module.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getCategoryColor(module.category)} text-white`}>
                        {module.category}
                      </span>
                      <span className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-gray-400 text-xs mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span>⏱️ {module.estimatedMinutes}min</span>
                  <span>📊 {module.quiz.length} quiz</span>
                </div>

                {module.prerequisites && module.prerequisites.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <strong>Requires:</strong> {module.prerequisites.map(prereq => {
                      const prereqModule = learningModules.find(m => m.id === prereq);
                      return prereqModule?.title || prereq;
                    }).join(', ')}
                  </div>
                )}
              </div>

              {/* Preview of content */}
              <p className={`text-xs ${isUnlocked ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                {module.content.introduction.substring(0, 100)}...
              </p>

              {/* Action indicator */}
              {isUnlocked && (
                <div className="mt-2 text-violet-400 text-xs font-medium">
                  {isCompleted ? '🔄 Review' : '▶️ Start'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Info */}
      <div className="mt-4 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-600/30 rounded-lg p-3">
        <h3 className="text-white font-bold text-sm mb-1">💡 Why Learn?</h3>
        <p className="text-violet-200 text-xs leading-relaxed">
          Knowledge is power in the music industry. Understanding contracts, rights, and revenue streams
          helps you make better decisions and build a sustainable career.
        </p>
      </div>
    </div>
  );
};

export default LearningPanel;
