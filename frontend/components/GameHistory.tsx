import React, { useState } from 'react';
import { History, ChevronDown, ChevronUp } from 'lucide-react';

interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  timestamp: Date;
  icon?: string;
}

interface GameHistoryProps {
  logs: LogEntry[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ logs }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showCount = 3;

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-500/10 text-green-300';
      case 'warning':
        return 'border-yellow-500 bg-yellow-500/10 text-yellow-300';
      case 'danger':
        return 'border-red-500 bg-red-500/10 text-red-300';
      default:
        return 'border-blue-500 bg-blue-500/10 text-blue-300';
    }
  };

  const displayLogs = isExpanded ? logs : logs.slice(-showCount);
  const sortedLogs = [...displayLogs].reverse(); // Show most recent first

  return (
  <div className="game-history bg-gray-800 rounded-lg border border-gray-700 p-2 sm:p-3 md:p-4 mb-4 md:mb-6 mt-3 md:mt-6">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <History className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">History</h3>
          <span className="text-xs sm:text-sm text-gray-400">({logs.length})</span>
        </div>

        {logs.length > showCount && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-xs sm:text-sm font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                <span className="hidden xs:inline">Show Less</span>
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
              </>
            ) : (
              <>
                <span className="hidden xs:inline">Show All</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Collapsed: fixed height for 3 items so layout doesn't shift; Expanded: allow larger max height */}
      <div className={
        `space-y-2 overflow-y-auto ${isExpanded ? 'max-h-96' : 'h-36 sm:h-48'}`
      }>
        {sortedLogs.length === 0 ? (
          <div className="text-gray-500 text-center py-6 sm:py-8 text-sm">
            No history yet. Start making decisions to see your story unfold!
          </div>
        ) : (
          sortedLogs.map((log, index) => (
            <div
              key={`${log.timestamp.getTime()}-${index}`}
              className={`border-l-4 rounded p-2 sm:p-3 ${getLogColor(log.type)} transition-all hover:scale-[1.01] sm:hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex items-start gap-1 sm:gap-2 flex-1 min-w-0">
                  {log.icon && (
                    <span className="text-base sm:text-lg leading-none mt-0.5 flex-shrink-0">{log.icon}</span>
                  )}
                  <p className="text-xs sm:text-sm font-medium leading-relaxed break-words">{log.message}</p>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap mt-1 flex-shrink-0 hidden sm:block">
                  {formatDate(log.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {!isExpanded && logs.length > showCount && (
        <div className="mt-2 sm:mt-3 text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-violet-400 hover:text-violet-300 text-xs sm:text-sm font-medium transition-colors"
          >
            + {logs.length - showCount} more events
          </button>
        </div>
      )}
    </div>
  );
};

export default GameHistory;