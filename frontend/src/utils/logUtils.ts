import type { LogEntry } from '../../types';

export const createLog = (
  message: string,
  type: 'info' | 'success' | 'warning' | 'danger' = 'info',
  timestamp?: Date,
  icon?: string
): LogEntry => {
  const getIconForType = (logType: string): string => {
    switch (logType) {
      case 'success': return '';
      case 'warning': return '';
      case 'danger': return '';
      default: return '';
    }
  };

  return {
    message,
    type,
    timestamp: timestamp || new Date(),
    icon: icon || getIconForType(type),
  };
};

export const appendLogToArray = (existing: LogEntry[] | undefined, log: LogEntry): LogEntry[] => {
  return [ ...(existing || []), log ];
};
