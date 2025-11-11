import React, { useState } from 'react';
import type { GameState } from '../types';
import { MiniChart } from './MiniChart';
import { toGameDate } from '../src/utils/dateUtils';
import { loadCareerHistories, formatDuration, formatTimestamp } from '../services/statisticsService';

interface StatisticsPanelProps {
  state: GameState;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ state }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'alltime' | 'history' | 'patterns'>('current');
  const careers = loadCareerHistories();
  const stats = state.statistics;

  const gd = toGameDate(state.currentDate, state.startDate);
  const currentWeeks = (gd.year - 1) * 48 + (gd.month - 1) * 4 + gd.week;
  const currentDuration = formatDuration(currentWeeks);

  const cashTrend = state.currentHistory
    .slice(-10)
    .map(h => h.cash)
    .concat([state.playerStats.cash]);

  const renderCurrentTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Career Duration</h3>
        <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{currentDuration}</p>
        <p className="text-gray-400 text-xs sm:text-sm">Week {gd.week}, Month {gd.month}, Year {gd.year}</p>
      </div>

      <div className="bg-gray-700/30 p-3 sm:p-4 rounded-lg border border-gray-600">
        <h4 className="font-semibold text-sm sm:text-base text-white mb-2 sm:mb-3">Cash Trend (Recent)</h4>
        {cashTrend.length > 1 ? <MiniChart data={cashTrend} color="#10b981" width={320} height={80} showPositiveNegative={true} /> : <p className="text-xs sm:text-sm text-gray-400">Not enough data yet.</p>}
      </div>
    </div>
  );

  return (
    <div className="text-gray-300">
      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
        <button onClick={() => setActiveTab('current')} className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${activeTab === 'current' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Current</button>
        <button onClick={() => setActiveTab('alltime')} className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${activeTab === 'alltime' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'}`}>All-time</button>
        <button onClick={() => setActiveTab('history')} className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${activeTab === 'history' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'}`}>History</button>
        <button onClick={() => setActiveTab('patterns')} className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${activeTab === 'patterns' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Patterns</button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {activeTab === 'current' && renderCurrentTab()}

        {activeTab === 'alltime' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Total Careers</div>
                <div className="text-xl sm:text-2xl font-bold text-violet-400">{stats.totalGamesPlayed}</div>
              </div>
              <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Total Weeks</div>
                <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.totalWeeksPlayed}</div>
              </div>
              <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Peak Cash</div>
                <div className="text-lg sm:text-xl font-bold text-green-400">${stats.highestCash.toLocaleString()}</div>
              </div>
              <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Peak Fame</div>
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.highestFameReached}</div>
              </div>
              <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Achievements</div>
                <div className="text-xl sm:text-2xl font-bold text-purple-400">{stats.achievementsUnlocked}</div>
              </div>
              <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Projects</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-400">{stats.projectsReleased}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-4">
            <div className="bg-gray-700/30 p-3 sm:p-4 rounded-lg border border-gray-600">
              <h4 className="font-semibold text-sm sm:text-base text-white mb-3">Decision Patterns</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Decisions</span>
                  <span className="text-white font-semibold">{stats.totalDecisionsMade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Contracts Signed</span>
                  <span className="text-white font-semibold">{stats.contractsSigned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Projects Released</span>
                  <span className="text-white font-semibold">{stats.projectsReleased}</span>
                </div>
              </div>
            </div>
            <div className="text-center text-gray-400 text-sm py-4">
              <p>More detailed pattern analysis coming soon!</p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-2 sm:space-y-3">
            {careers.length === 0 ? (
              <div className="text-center text-gray-400 py-6 sm:py-8 text-sm">No completed careers yet.</div>
            ) : (
              careers.slice().reverse().map(career => (
                <div key={career.gameId} className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm sm:text-base text-white truncate">{career.artistName}</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">{career.genre}</p>
                    </div>
                    <div className="text-left sm:text-right text-xs text-gray-400 flex-shrink-0">Played {formatTimestamp(career.startDate)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-300">
                    <div className="truncate">Duration: {formatDuration(career.weeksPlayed)}</div>
                    <div className="truncate">Peak Cash: ${career.highestCash.toLocaleString()}</div>
                    <div className="truncate">Peak Fame: {career.peakFame}</div>
                    <div className="truncate">Achievements: {career.achievementsEarned.length}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPanel;
