import React from 'react';
import type { RecordLabel } from '../types';
import { X, FileText, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface SignedContractViewerProps {
  label: RecordLabel;
  contractStartDate: Date;
  currentDate: Date;
  onClose: () => void;
}

export const SignedContractViewer: React.FC<SignedContractViewerProps> = ({
  label,
  contractStartDate,
  currentDate,
  onClose
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate contract duration
  const contractLengthYears = label.terms.contractLength;
  const expiryDate = new Date(contractStartDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + contractLengthYears);

  const timeRemaining = expiryDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
  const monthsRemaining = Math.ceil(daysRemaining / 30);
  const yearsRemaining = Math.floor(monthsRemaining / 12);

  const isExpired = timeRemaining <= 0;
  const isExpiringSoon = monthsRemaining <= 3 && monthsRemaining > 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1A0A0F] to-[#2D1115] rounded-xl border border-gray-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1A0A0F] to-[#2D1115] border-b border-gray-800 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Your Contract</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Label Info */}
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <h3 className="text-2xl font-bold text-blue-300 mb-2">{label.name}</h3>
            <p className="text-sm text-gray-300">{label.description}</p>
          </div>

          {/* Contract Duration Status */}
          <div className={`rounded-lg p-4 border ${
            isExpired
              ? 'bg-red-900/20 border-red-600/50'
              : isExpiringSoon
                ? 'bg-yellow-900/20 border-yellow-600/50'
                : 'bg-green-900/20 border-green-600/50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`w-5 h-5 ${
                isExpired ? 'text-red-400' : isExpiringSoon ? 'text-yellow-400' : 'text-green-400'
              }`} />
              <h4 className="font-bold text-white">Contract Duration</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Signed On</div>
                <div className="text-white font-semibold">
                  {contractStartDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Expires On</div>
                <div className="text-white font-semibold">
                  {expiryDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-400">Time Remaining</div>
                <div className={`text-lg font-bold ${
                  isExpired ? 'text-red-400' : isExpiringSoon ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {isExpired
                    ? 'CONTRACT EXPIRED'
                    : yearsRemaining > 0
                      ? `${yearsRemaining} year${yearsRemaining > 1 ? 's' : ''} ${monthsRemaining % 12} month${monthsRemaining % 12 !== 1 ? 's' : ''}`
                      : `${monthsRemaining} month${monthsRemaining !== 1 ? 's' : ''}`
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Contract Terms */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Contract Terms</h4>

            {/* Advance */}
            <div className="bg-[#2D1115] border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-white">Advance Payment</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(label.terms.advance)}
              </div>
              <p className="text-xs text-gray-400 mt-1">Paid upfront upon signing</p>
            </div>

            {/* Royalty Rate */}
            <div className="bg-[#2D1115] border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">Royalty Rate</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {label.terms.royaltyRate}%
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Your share of streaming revenue after recoupment
              </p>
            </div>

            {/* Marketing Budget */}
            <div className="bg-[#2D1115] border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-white">Marketing Budget</span>
                  <div className="text-lg font-bold text-purple-400 mt-1">
                    {formatCurrency(label.terms.marketingBudget)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Label investment in promoting your music
              </p>
            </div>

            {/* Creative Control */}
            <div className="bg-[#2D1115] border border-gray-700 rounded-lg p-4">
              <span className="font-semibold text-white">Creative Control</span>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Your Control</span>
                  <span className="text-yellow-400 font-semibold">{label.terms.creativeControl}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${label.terms.creativeControl}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {label.terms.creativeControl >= 70
                  ? 'High creative freedom'
                  : label.terms.creativeControl >= 50
                    ? 'Moderate creative freedom'
                    : 'Limited creative freedom'}
              </p>
            </div>

            {/* Contract Length */}
            <div className="bg-[#2D1115] border border-gray-700 rounded-lg p-4">
              <span className="font-semibold text-white">Contract Length</span>
              <div className="text-lg font-bold text-gray-300 mt-1">
                {label.terms.contractLength} year{label.terms.contractLength > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Recoupment Info */}
          <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
            <h4 className="font-semibold text-orange-300 mb-2">⚠️ Recoupment Terms</h4>
            <p className="text-sm text-gray-300">
              You must earn back the {formatCurrency(label.terms.advance)} advance through your {label.terms.royaltyRate}%
              royalty share before receiving additional payments. All streaming revenue goes to the label until the advance
              is recouped.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignedContractViewer;
