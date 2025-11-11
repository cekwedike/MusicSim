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
  // Start collapsed for all views - let players choose to expand
  const [isExpanded, setIsExpanded] = useState(false);

  const [isMobileCollapsed, setIsMobileCollapsed] = useState(true);
  const showCount = 2;

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
  <div className="game-history bg-gray-800 rounded-lg border border-gray-700 mb-4 md:mb-6 mt-3 md:mt-6">
      {/* Mobile: Collapsed button */}
      <div className="lg:hidden">
        {isMobileCollapsed ? (
          <button
            onClick={() => setIsMobileCollapsed(false)}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-bold text-white">History</span>
              <span className="text-xs text-gray-400">({logs.length})</span>
            </div>
            <ChevronDown className="w-4 h-4 text-violet-400" />
          </button>
        ) : (
          <div className="p-2 sm:p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">History</h3>
                <span className="text-xs text-gray-400">({logs.length})</span>
              </div>
              <button
                onClick={() => setIsMobileCollapsed(true)}
                className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
              >
                <span>Hide</span>
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className={`space-y-2 overflow-y-auto ${isExpanded ? 'max-h-48 sm:max-h-64 md:max-h-96' : 'max-h-32 sm:max-h-48'}`}>
              {sortedLogs.length === 0 ? (
                <div className="text-gray-500 text-center py-6 text-sm">
                  No history yet. Start making decisions!
                </div>
              ) : (
                sortedLogs.map((log, index) => (
                  <div
                    key={`${log.timestamp.getTime()}-${index}`}
                    className={`border-l-4 rounded p-2 ${getLogColor(log.type)} transition-all`}
                  >
                    <div className="flex items-start gap-2">
                      {log.icon && (
                        <span className="text-base leading-none mt-0.5 flex-shrink-0">{log.icon}</span>
                      )}
                      <p className="text-xs font-medium leading-relaxed break-words flex-1">{log.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!isExpanded && logs.length > showCount && (
              <div className="mt-2 text-center">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
                >
                  + {logs.length - showCount} more events
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop: Always visible */}
      <div className="hidden lg:block p-2 sm:p-3 md:p-4">
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
                <span>Show Less</span>
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
              </>
            ) : (
              <>
                <span>Show All</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Collapsed: fixed height for 2 items so layout doesn't shift; Expanded: allow larger max height */}
      <div className={
        `space-y-2 overflow-y-auto ${isExpanded ? 'max-h-96' : 'h-24 sm:h-32'}`
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
    </div>
  );
};

export default GameHistory;