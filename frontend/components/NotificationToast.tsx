import React, { useEffect, useState } from 'react';
import { TrophyIcon, XMarkIcon, SparklesIcon, FireIcon } from './icons/Icons';

export type NotificationType = 'achievement' | 'milestone' | 'event' | 'warning' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  duration?: number; // milliseconds, default 5000
}

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss }) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log('[NotificationToast] Notifications prop changed:', notifications);

    // Show new notifications with slide-in animation
    const newIds = notifications.map(n => n.id);
    setVisibleNotifications(new Set(newIds));

    // Auto-dismiss notifications after duration
    const timers = notifications.map(notification => {
      const duration = notification.duration || 5000;
      return setTimeout(() => {
        console.log('[NotificationToast] Auto-dismissing:', notification.id);
        onDismiss(notification.id);
      }, duration);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, onDismiss]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'achievement':
        return <TrophyIcon className="w-6 h-6 text-yellow-400" />;
      case 'milestone':
        return <SparklesIcon className="w-6 h-6 text-violet-400" />;
      case 'event':
        return <FireIcon className="w-6 h-6 text-blue-400" />;
      case 'warning':
        return <span className="text-2xl">⚠️</span>;
      case 'success':
        return <span className="text-2xl">✨</span>;
    }
  };

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case 'achievement':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'milestone':
        return 'border-violet-500/50 bg-violet-500/10';
      case 'event':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'warning':
        return 'border-red-500/50 bg-red-500/10';
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
    }
  };

  console.log('[NotificationToast] Rendering, notifications.length:', notifications.length);

  if (notifications.length === 0) {
    console.log('[NotificationToast] No notifications, returning null');
    return null;
  }

  console.log('[NotificationToast] Rendering notifications component');

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            pointer-events-auto
            bg-gray-800/95 backdrop-blur-sm border rounded-lg shadow-xl
            ${getStyles(notification.type)}
            transform transition-all duration-300 ease-out
            ${visibleNotifications.has(notification.id) ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          `}
        >
          <div className="p-4 flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-100 text-sm mb-0.5">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-300">
                {notification.description}
              </p>
            </div>
            <button
              onClick={() => onDismiss(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Dismiss notification"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-gray-700/50 overflow-hidden rounded-b-lg">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
              style={{
                animation: `shrink ${notification.duration || 5000}ms linear forwards`
              }}
            />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
