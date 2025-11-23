import React, { useState } from 'react';
import type { Project, PlayerStats } from '../types';
import { projects as allProjects } from '../data/projects';
import { Music, Disc, Album, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProjectsPanelProps {
  currentProject: Project | null;
  playerStats: PlayerStats;
  onStartProject: (projectId: string) => void;
}

const ProjectsPanel: React.FC<ProjectsPanelProps> = ({
  currentProject,
  playerStats,
  onStartProject
}) => {
  const [confirmingProject, setConfirmingProject] = useState<string | null>(null);

  const getProjectIcon = (projectId: string) => {
    if (projectId.includes('SINGLE')) return <Music className="w-8 h-8 sm:w-10 sm:h-10" />;
    if (projectId.includes('EP')) return <Disc className="w-8 h-8 sm:w-10 sm:h-10" />;
    if (projectId.includes('ALBUM')) return <Album className="w-8 h-8 sm:w-10 sm:h-10" />;
    return <Music className="w-8 h-8 sm:w-10 sm:h-10" />;
  };

  const getProjectCost = (projectId: string): number => {
    if (projectId.includes('SINGLE')) return 100;
    if (projectId.includes('EP')) return 300;
    if (projectId === 'ALBUM_1') return 2500;
    if (projectId === 'ALBUM_2') return 5000;
    return 0;
  };

  const getProjectColor = (projectId: string): string => {
    if (projectId.includes('SINGLE')) return 'from-blue-600 to-cyan-600';
    if (projectId.includes('EP')) return 'from-purple-600 to-pink-600';
    if (projectId.includes('ALBUM')) return 'from-red-600 to-orange-600';
    return 'from-gray-600 to-gray-700';
  };

  const getProjectDescription = (projectId: string): string => {
    if (projectId === 'SINGLE_1') return 'Your first track. Quick to produce, perfect for testing the waters.';
    if (projectId === 'EP_1') return 'A collection of 4-6 songs. More substantial than a single, builds your catalog.';
    if (projectId === 'ALBUM_1') return 'Full-length album (10-14 tracks). Major career milestone, significant investment.';
    if (projectId === 'ALBUM_2') return 'Sophomore album. Push boundaries, evolve your sound, cement your legacy.';
    return '';
  };

  const canAfford = (cost: number) => playerStats.cash >= cost;

  const handleStartProject = (projectId: string) => {
    const cost = getProjectCost(projectId);
    if (canAfford(cost)) {
      onStartProject(projectId);
      setConfirmingProject(null);
    }
  };

  return (
    <div className="projects-panel h-full flex flex-col bg-[#1A0A0F] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-rose-700 p-3 sm:p-4 border-b border-red-500/30">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          Projects
        </h2>
        <p className="text-xs sm:text-sm text-red-100 mt-1">
          Create music to build your career and earn income
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Current Project */}
        {currentProject && (
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-2 border-green-500/50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-green-400">
                {getProjectIcon(currentProject.id)}
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-white">{currentProject.name}</h3>
                <p className="text-xs text-green-300">Currently Working On</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-white font-bold">
                    {Math.floor((currentProject.progress / currentProject.requiredProgress) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#3D1820] rounded-full h-2 sm:h-2.5">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 sm:h-2.5 rounded-full transition-all"
                    style={{ width: `${(currentProject.progress / currentProject.requiredProgress) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-300">Quality</span>
                <span className="text-yellow-400 font-bold">{currentProject.quality}/100</span>
              </div>
            </div>
          </div>
        )}

        {/* No Project Active */}
        {!currentProject && (
          <div className="bg-yellow-900/20 border border-yellow-500/40 rounded-lg p-3 sm:p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-yellow-200 font-medium">No active project</p>
            <p className="text-xs text-yellow-300/70 mt-1">
              Start a project below to begin creating music
            </p>
          </div>
        )}

        {/* Available Projects */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Available Projects</h3>

          {allProjects.map((project) => {
            const cost = getProjectCost(project.id);
            const affordable = canAfford(cost);
            const isConfirming = confirmingProject === project.id;

            return (
              <div
                key={project.id}
                className={`rounded-lg border-2 overflow-hidden transition-all ${
                  currentProject
                    ? 'opacity-50 border-gray-600'
                    : affordable
                    ? 'border-gray-600 hover:border-red-500/50'
                    : 'border-red-600/50 opacity-70'
                }`}
              >
                <div className={`bg-gradient-to-r ${getProjectColor(project.id)} p-3`}>
                  <div className="flex items-center gap-2">
                    <div className="text-white">
                      {getProjectIcon(project.id)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-bold text-white">{project.name}</h4>
                      <p className="text-xs text-white/80">{project.requiredProgress} progress needed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2D1115] p-3 space-y-2">
                  <p className="text-xs sm:text-sm text-gray-300">
                    {getProjectDescription(project.id)}
                  </p>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-400">Cost:</span>
                    <span className={`font-bold ${affordable ? 'text-green-400' : 'text-red-400'}`}>
                      ${cost.toLocaleString()}
                    </span>
                  </div>

                  {isConfirming ? (
                    <div className="space-y-2">
                      <p className="text-xs text-yellow-300 bg-yellow-900/30 border border-yellow-500/30 rounded p-2">
                        Starting this project will cost ${cost.toLocaleString()}. Are you sure?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartProject(project.id)}
                          className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-colors text-xs sm:text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmingProject(null)}
                          className="flex-1 py-2 bg-[#4D1F2A] hover:bg-[#3D1820] text-white font-bold rounded transition-colors text-xs sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => currentProject ? null : setConfirmingProject(project.id)}
                      disabled={currentProject !== null || !affordable}
                      className={`w-full py-2 rounded font-bold transition-colors text-xs sm:text-sm ${
                        currentProject
                          ? 'bg-[#3D1820] text-gray-500 cursor-not-allowed'
                          : affordable
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-900/50 text-red-400 cursor-not-allowed'
                      }`}
                    >
                      {currentProject
                        ? 'Complete current project first'
                        : affordable
                        ? 'Start Project'
                        : 'Insufficient Funds'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
          <h4 className="text-xs sm:text-sm font-bold text-blue-300 mb-1">How Projects Work</h4>
          <ul className="text-xs text-blue-200 space-y-1">
            <li>• Make choices each week to increase progress & quality</li>
            <li>• Higher quality = more income when released</li>
            <li>• Only one project can be active at a time</li>
            <li>• Projects auto-release when progress is complete</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPanel;
