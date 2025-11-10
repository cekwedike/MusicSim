import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  message,
  onClose,
  type = 'info',
  confirmText = 'OK'
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle,
      iconBg: 'bg-green-600',
      border: 'border-green-600/50',
      button: 'bg-green-600 hover:bg-green-700'
    },
    error: {
      icon: AlertCircle,
      iconBg: 'bg-red-600',
      border: 'border-red-600/50',
      button: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-yellow-600',
      border: 'border-yellow-600/50',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-600',
      border: 'border-blue-600/50',
      button: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className={`bg-gray-800 border ${config.border} rounded-lg shadow-2xl max-w-md w-full animate-scale-in`}>
          <style>{`
            @keyframes scale-in {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .animate-scale-in {
              animation: scale-in 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
            }
          `}</style>

          {/* Header */}
          <div className="flex items-start gap-3 p-5 pb-0">
            <div className={`${config.iconBg} rounded-full p-2 flex-shrink-0`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-5 justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-2 ${config.button} text-white rounded-lg font-medium transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertDialog;
