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
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Career Duration</h3>
        <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{currentDuration}</p>
        <p className="text-gray-400 text-sm">Week {gd.week}, Month {gd.month}, Year {gd.year}</p>
      </div>

      <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
        <h4 className="font-semibold text-white mb-3">Cash Trend (Recent)</h4>
        {cashTrend.length > 1 ? <MiniChart data={cashTrend} color="#10b981" width={320} height={80} showPositiveNegative={true} /> : <p className="text-sm text-gray-400">Not enough data yet.</p>}
      </div>
    </div>
  );

  return (
    <div className="text-gray-300">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('current')} className={`px-3 py-1 rounded ${activeTab === 'current' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Current</button>
        <button onClick={() => setActiveTab('alltime')} className={`px-3 py-1 rounded ${activeTab === 'alltime' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'}`}>All-time</button>
        <button onClick={() => setActiveTab('history')} className={`px-3 py-1 rounded ${activeTab === 'history' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'}`}>History</button>
        <button onClick={() => setActiveTab('patterns')} className={`px-3 py-1 rounded ${activeTab === 'patterns' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Patterns</button>
      </div>

      <div className="space-y-4">
        {activeTab === 'current' && renderCurrentTab()}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {careers.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No completed careers yet.</div>
            ) : (
              careers.slice().reverse().map(career => (
                <div key={career.gameId} className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{career.artistName}</h4>
                      <p className="text-gray-400 text-sm">{career.genre}</p>
                    </div>
                    <div className="text-right text-xs text-gray-400">Played {formatTimestamp(career.startDate)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                    <div>Duration: {formatDuration(career.weeksPlayed)}</div>
                    <div>Peak Cash: ${career.highestCash.toLocaleString()}</div>
                    <div>Peak Fame: {career.peakFame}</div>
                    <div>Achievements: {career.achievementsEarned.length}</div>
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
