import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: 'bg-red-600',
      button: 'bg-red-600 hover:bg-red-700',
      border: 'border-red-600/50'
    },
    warning: {
      icon: 'bg-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      border: 'border-yellow-600/50'
    },
    info: {
      icon: 'bg-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      border: 'border-blue-600/50'
    }
  };

  const styles = typeStyles[type];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className={`bg-[#2D1115] border ${styles.border} rounded-lg shadow-2xl max-w-md w-full animate-scale-in`}>
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
            <div className={`${styles.icon} rounded-full p-2 flex-shrink-0`}>
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-gray-300">{message}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-5 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-[#3D1820] hover:bg-[#4D1F2A] text-white rounded-lg font-medium transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 ${styles.button} text-white rounded-lg font-medium transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
