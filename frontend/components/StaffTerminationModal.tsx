import React from 'react';
import { X, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';
import type { HiredStaff } from '../types';

interface TerminationOutcome {
  message: string;
  severance: number;
  wellBeingLoss: number;
  additionalEffects?: {
    stat: string;
    value: number;
    label: string;
  }[];
}

interface StaffTerminationModalProps {
  staff: HiredStaff;
  outcome: TerminationOutcome;
  onClose: () => void;
}

const StaffTerminationModal: React.FC<StaffTerminationModalProps> = ({
  staff,
  outcome,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-[#2D1115] rounded-lg max-w-lg w-full border-2 border-red-600/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-3 sm:p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <h2 className="text-lg sm:text-xl font-bold text-white">Contract Terminated</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Staff Info */}
          <div className="bg-[#3D1820]/50 rounded-lg p-3 border border-gray-600">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">{staff.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400">{staff.role} • {staff.tier}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Monthly Salary</p>
                <p className="text-sm sm:text-base font-bold text-green-400">${staff.salary.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Outcome Message */}
          <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-3">
            <p className="text-sm sm:text-base text-gray-200 leading-snug">{outcome.message}</p>
          </div>

          {/* Financial Impact */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-red-400" />
              Financial Impact
            </h4>
            <div className="grid gap-2">
              <div className="bg-[#3D1820]/50 rounded-lg p-2.5 border border-red-600/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-300">Severance Payment</span>
                  <span className="text-sm sm:text-base font-bold text-red-400">-${outcome.severance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Well-being Impact */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-yellow-400" />
              Emotional Impact
            </h4>
            <div className="bg-[#3D1820]/50 rounded-lg p-2.5 border border-yellow-600/30">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-300">Well-being Loss</span>
                <span className="text-sm sm:text-base font-bold text-yellow-400">-{outcome.wellBeingLoss}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Terminating staff causes guilt and stress</p>
            </div>
          </div>

          {/* Additional Effects */}
          {outcome.additionalEffects && outcome.additionalEffects.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Additional Effects</h4>
              <div className="grid gap-2">
                {outcome.additionalEffects.map((effect, index) => (
                  <div
                    key={index}
                    className="bg-[#3D1820]/50 rounded-lg p-2.5 border border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-300">{effect.label}</span>
                      <span className={`text-sm sm:text-base font-bold ${
                        effect.value > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {effect.value > 0 ? '+' : ''}{effect.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-sm sm:text-base"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffTerminationModal;
