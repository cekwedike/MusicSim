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
  const showCount = 5;

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
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-bold text-white">History</h3>
          <span className="text-sm text-gray-400">({logs.length} events)</span>
        </div>
        
        {logs.length > showCount && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show All <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedLogs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No history yet. Start making decisions to see your story unfold!
          </div>
        ) : (
          sortedLogs.map((log, index) => (
            <div
              key={`${log.timestamp.getTime()}-${index}`}
              className={`border-l-4 rounded p-3 ${getLogColor(log.type)} transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1">
                  {log.icon && (
                    <span className="text-lg leading-none mt-0.5">{log.icon}</span>
                  )}
                  <p className="text-sm font-medium leading-relaxed">{log.message}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap mt-1">
                  {formatDate(log.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {!isExpanded && logs.length > showCount && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
          >
            + {logs.length - showCount} more events
          </button>
        </div>
      )}
    </div>
  );
};

export default GameHistory;