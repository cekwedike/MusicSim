import React, { useState } from 'react';
import type { GameState } from '../types';
import { loadCareerHistories, formatTimestamp, formatDuration } from '../services/statisticsService';
import { MiniChart } from './MiniChart';
import { toGameDate } from '../src/utils/dateUtils';

interface StatisticsModalProps {
  state: GameState;
  onClose: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({ state, onClose }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'alltime' | 'history' | 'patterns'>('current');
  const careers = loadCareerHistories();
  const stats = state.statistics;

  const tabs = [
    { id: 'current' as const, label: 'Current Career', icon: '' },
    { id: 'alltime' as const, label: 'All-Time Stats', icon: '' },
    { id: 'history' as const, label: 'Career History', icon: '' },
    { id: 'patterns' as const, label: 'Patterns', icon: '' },
  ];

  const gd = toGameDate(state.currentDate, state.startDate);
  const currentWeeks = (gd.year - 1) * 48 + (gd.month - 1) * 4 + gd.week;
  const currentDuration = formatDuration(currentWeeks);

  // Get cash trend for current career (last 10 data points)
  const cashTrend = state.currentHistory
    .slice(-10)
    .map(h => h.cash)
    .concat([state.playerStats.cash]);

  // Calculate survival metrics
  const totalCareers = stats.totalGamesPlayed;
  const avgSurvival = stats.averageCareerLength;
  const debtPercentage = totalCareers > 0 ? Math.round((stats.gamesLostToDebt / totalCareers) * 100) : 0;
  const burnoutPercentage = totalCareers > 0 ? Math.round((stats.gamesLostToBurnout / totalCareers) * 100) : 0;
  const abandonedPercentage = totalCareers > 0 ? Math.round((stats.careersAbandoned / totalCareers) * 100) : 0;

  // Calculate patterns
  const cashManagementScore = Math.max(0, 100 - (stats.timesInDebt * 5));
  const learningEngagement = state.achievements.length > 0 
    ? Math.round((stats.lessonsViewed / state.achievements.length) * 100) 
    : 0;
  const achievementProgress = state.achievements.length > 0 
    ? Math.round((stats.achievementsUnlocked / state.achievements.length) * 100) 
    : 0;

  // Determine most common ending
  const mostCommonEnding = stats.gamesLostToDebt >= stats.gamesLostToBurnout && stats.gamesLostToDebt >= stats.careersAbandoned
    ? 'Debt'
    : stats.gamesLostToBurnout >= stats.careersAbandoned
    ? 'Burnout' 
    : 'Abandoned';

  const renderCurrentTab = () => (
    <div className="space-y-6">
      {/* Career Duration */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Career Duration</h3>
        <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {currentDuration}
        </p>
          <p className="text-gray-400 text-sm">Week {gd.week}, Month {gd.month}, Year {gd.year}</p>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
          <p className="text-lg font-bold text-white">${state.playerStats.cash.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Cash</p>
        </div>
        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
          <p className="text-lg font-bold text-white">{state.playerStats.fame}</p>
          <p className="text-sm text-gray-400">Fame</p>
        </div>
        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
          <p className="text-lg font-bold text-white">{state.playerStats.wellBeing}</p>
          <p className="text-sm text-gray-400">Well-Being</p>
        </div>
        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
          <p className="text-lg font-bold text-white">{state.playerStats.hype}</p>
          <p className="text-sm text-gray-400">Hype</p>
        </div>
        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
          <p className="text-lg font-bold text-white">{state.playerStats.careerProgress}</p>
          <p className="text-sm text-gray-400">Career Progress</p>
        </div>
        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
          <p className="text-lg font-bold text-white">{state.achievements.filter(a => a.unlocked).length}</p>
          <p className="text-sm text-gray-400">Achievements</p>
        </div>
      </div>

      {/* Cash Trend */}
      {cashTrend.length > 1 && (
        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
          <h4 className="font-semibold text-white mb-3">Cash Trend (Recent)</h4>
          <MiniChart 
            data={cashTrend} 
            color="#10b981" 
            width={280} 
            height={80} 
            showPositiveNegative={true}
          />
        </div>
      )}

      {/* Recent Events */}
      <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
        <h4 className="font-semibold text-white mb-3">Recent Events</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {state.logs && state.logs.length > 0 ? (
            state.logs.slice(-5).reverse().map((log, index) => (
              <div key={index} className="text-sm text-gray-300 border-l-2 border-purple-500 pl-3">
                <p className="text-gray-400 text-xs">{new Date(log.timestamp).toLocaleDateString('en-GB')}</p>
                <p>{log.message}</p>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm text-center py-3">No recent events yet.</div>
          )}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 rounded-lg border border-purple-500/30">
        <p className="text-white font-semibold">Keep going - this career continues until debt or burnout!</p>
        <p className="text-gray-300 text-sm mt-1">{state.lessonsViewed.length} lessons learned so far</p>
      </div>
    </div>
  );

  const renderAllTimeTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
        <p className="text-xl font-bold text-white">{stats.totalGamesPlayed}</p>
        <p className="text-sm text-gray-400">Total Careers Played</p>
      </div>

      <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
        <p className="text-xl font-bold text-white">{formatDuration(stats.longestCareerWeeks)}</p>
        <p className="text-sm text-gray-400">Longest Career</p>
      </div>

      <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
        <p className="text-xl font-bold text-white">{formatDuration(stats.averageCareerLength)}</p>
        <p className="text-sm text-gray-400">Average Career Length</p>
      </div>

      <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/50">
        <p className="text-xl font-bold text-red-300">{stats.gamesLostToDebt} ({debtPercentage}%)</p>
        <p className="text-sm text-gray-400">Ended by Debt</p>
      </div>

      <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-500/50">
        <p className="text-xl font-bold text-orange-300">{stats.gamesLostToBurnout} ({burnoutPercentage}%)</p>
        <p className="text-sm text-gray-400">Ended by Burnout</p>
      </div>

      <div className="bg-gray-500/20 p-4 rounded-lg border border-gray-500/50">
        <p className="text-xl font-bold text-gray-300">{stats.careersAbandoned} ({abandonedPercentage}%)</p>
        <p className="text-sm text-gray-400">Abandoned</p>
      </div>

      <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/50">
        <p className="text-xl font-bold text-green-300">${stats.highestCash.toLocaleString()}</p>
        <p className="text-sm text-gray-400">Highest Cash Ever</p>
      </div>

      <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/50">
        <p className="text-xl font-bold text-purple-300">{stats.highestFameReached}</p>
        <p className="text-sm text-gray-400">Highest Fame Ever</p>
      </div>

      <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/50">
        <p className="text-xl font-bold text-blue-300">{stats.highestCareerProgressReached}</p>
        <p className="text-sm text-gray-400">Highest Career Progress</p>
      </div>

      <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-500/50">
        <p className="text-xl font-bold text-yellow-300">{stats.lessonsViewed}</p>
        <p className="text-sm text-gray-400">Total Lessons Viewed</p>
      </div>

      <div className="bg-indigo-500/20 p-4 rounded-lg border border-indigo-500/50">
        <p className="text-xl font-bold text-indigo-300">{stats.achievementsUnlocked} / {state.achievements.length}</p>
        <p className="text-sm text-gray-400">Achievements Unlocked</p>
      </div>

      <div className="bg-pink-500/20 p-4 rounded-lg border border-pink-500/50">
        <p className="text-xl font-bold text-pink-300">{stats.projectsReleased}</p>
        <p className="text-sm text-gray-400">Projects Released</p>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      {careers.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <p>No completed careers yet.</p>
          <p className="text-sm mt-1">Your career history will appear here after you complete your first career.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm mb-4">Showing your last {careers.length} careers</p>
          {careers.slice().reverse().map((career, index) => (
            <div key={career.gameId} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-white">{career.artistName}</h4>
                  <p className="text-gray-400 text-sm">{career.genre}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    career.outcome === 'debt' ? 'bg-red-500/20 text-red-300' :
                    career.outcome === 'burnout' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {career.outcome === 'debt' ? 'Went Bankrupt' :
                     career.outcome === 'burnout' ? 'Burned Out' :
                     'Career Abandoned'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-sm font-medium text-white">{formatDuration(career.weeksPlayed)}</p>
                  {career.weeksPlayed === stats.longestCareerWeeks && (
                    <span className="text-xs text-yellow-400">Longest</span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-400">Peak Cash</p>
                  <p className="text-sm font-medium text-green-300">${career.highestCash.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Peak Fame</p>
                  <p className="text-sm font-medium text-purple-300">{career.peakFame}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Achievements</p>
                  <p className="text-sm font-medium text-blue-300">{career.achievementsEarned.length}</p>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Played {formatTimestamp(career.startDate)}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );

  const renderPatternsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Survival Metrics */}
        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
          <h4 className="font-semibold text-white mb-4">Survival Metrics</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Average Survival</span>
                <span className="text-white font-medium">{formatDuration(avgSurvival)}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Most Common Ending</span>
                <span className="text-white font-medium">{mostCommonEnding}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Longest Streak</span>
                <span className="text-white font-medium">{formatDuration(stats.longestCareerWeeks)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Scores */}
        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
          <h4 className="font-semibold text-white mb-4">Performance Scores</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Cash Management</span>
                <span className="text-white font-medium">{cashManagementScore}/100</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${cashManagementScore >= 80 ? 'bg-green-500' : cashManagementScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${cashManagementScore}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Learning Engagement</span>
                <span className="text-white font-medium">{learningEngagement}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${learningEngagement >= 80 ? 'bg-green-500' : learningEngagement >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${learningEngagement}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Achievement Progress</span>
                <span className="text-white font-medium">{achievementProgress}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${achievementProgress >= 80 ? 'bg-green-500' : achievementProgress >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${achievementProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
        <h4 className="font-semibold text-white mb-3">Insights</h4>
        <div className="space-y-2 text-sm text-gray-300">
          {debtPercentage > 50 && (
            <p className="text-red-300">You lose to debt {debtPercentage}% of the time - focus on cash management and steady income.</p>
          )}
          {burnoutPercentage > 50 && (
            <p className="text-orange-300">You lose to burnout {burnoutPercentage}% of the time - prioritize well-being and take breaks.</p>
          )}
          {learningEngagement < 50 && (
            <p className="text-blue-300">Try reading more lessons to improve your music industry knowledge.</p>
          )}
          {stats.longestCareerWeeks >= 104 && (
            <p className="text-green-300">Impressive! You've survived over 2 years in your longest career.</p>
          )}
          {achievementProgress >= 80 && (
            <p className="text-yellow-300">You're an achievement hunter with {achievementProgress}% completion!</p>
          )}
          {stats.totalGamesPlayed >= 10 && (
            <p className="text-purple-300">Experienced player with {stats.totalGamesPlayed} careers completed!</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[60]">
      <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Career Statistics
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-gray-700/30'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'current' && renderCurrentTab()}
          {activeTab === 'alltime' && renderAllTimeTab()}
          {activeTab === 'history' && renderHistoryTab()}
          {activeTab === 'patterns' && renderPatternsTab()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};