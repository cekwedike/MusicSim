import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { HiredStaff } from '../types';

interface TerminationConfirmModalProps {
  staff: HiredStaff;
  onConfirm: () => void;
  onCancel: () => void;
}

const TerminationConfirmModal: React.FC<TerminationConfirmModalProps> = ({
  staff,
  onConfirm,
  onCancel
}) => {
  const severanceCost = staff.salary * 2;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full border-2 border-red-600/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-3 sm:p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <h2 className="text-lg sm:text-xl font-bold text-white">Confirm Termination</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">{staff.name}</h3>
            <p className="text-xs sm:text-sm text-gray-400">{staff.role} • {staff.tier}</p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-3">
            <p className="text-sm text-gray-200 leading-snug">
              Are you sure you want to terminate this staff member's contract?
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gray-700/30 rounded-lg p-2.5">
              <span className="text-xs sm:text-sm text-gray-300">Severance Cost</span>
              <span className="text-sm sm:text-base font-bold text-red-400">
                ${severanceCost.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-700/30 rounded-lg p-2.5">
              <span className="text-xs sm:text-sm text-gray-300">Well-being Impact</span>
              <span className="text-sm sm:text-base font-bold text-yellow-400">
                Reduced
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            The outcome of this decision will be revealed after you confirm.
          </p>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-700 flex gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-sm sm:text-base"
          >
            Terminate Contract
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminationConfirmModal;
