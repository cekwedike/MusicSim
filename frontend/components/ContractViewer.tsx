import React, { useState } from 'react';
import type { RecordLabel } from '../types';

interface ContractViewerProps {
  label: RecordLabel;
  onSign: () => void;
  onDecline: () => void;
}

export const ContractViewer: React.FC<ContractViewerProps> = ({ label, onSign, onDecline }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [expectedStreams, setExpectedStreams] = useState(100000);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAdvanceColor = (advance: number) => {
    if (advance > 100000) return 'text-green-400';
    if (advance >= 10000) return 'text-yellow-400';
    return 'text-white';
  };

  const getRoyaltyComparison = (rate: number) => {
    if (rate >= 15) return 'text-green-400';
    if (rate >= 12) return 'text-yellow-400';
    return 'text-red-400';
  };

  const calculateRecoupment = () => {
    const streamRevenue = expectedStreams * 0.004; // $0.004 per stream average
    const artistShare = streamRevenue * (label.terms.royaltyRate / 100);
    const monthlyStreams = expectedStreams / 12; // Assume yearly streams spread over 12 months
    const monthlyRevenue = monthlyStreams * 0.004 * (label.terms.royaltyRate / 100);
    const monthsToRecoup = label.terms.advance / monthlyRevenue;
    return {
      streamRevenue,
      artistShare,
      monthsToRecoup: Math.ceil(monthsToRecoup),
      lifetimeEarnings: artistShare - label.terms.advance
    };
  };

  const calculation = calculateRecoupment();

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {label.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  label.type === 'indie' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {label.type === 'indie' ? 'Independent Label' : 'Major Label'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Reputation:</span>
                  <span className="text-white font-semibold">{label.reputation}/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* The Pitch */}
          <section>
            <h2 className="text-xl font-bold text-violet-300 mb-4">Their Offer</h2>
            <blockquote className="bg-gray-700/50 border-l-4 border-violet-500 pl-6 py-4 italic text-gray-300 leading-relaxed">
              "{label.description}"
            </blockquote>
          </section>

          {/* Financial Terms */}
          <section>
            <h2 className="text-xl font-bold text-violet-300 mb-4">The Money</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💰</span>
                  <h3 className="font-semibold text-white">Advance</h3>
                </div>
                <p className={`text-2xl font-bold ${getAdvanceColor(label.terms.advance)}`}>
                  {formatCurrency(label.terms.advance)}
                </p>
                <p className="text-sm text-gray-400">Upfront payment (must be recouped)</p>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-semibold text-white">Royalty Rate</h3>
                </div>
                <p className={`text-2xl font-bold ${getRoyaltyComparison(label.terms.royaltyRate)}`}>
                  {label.terms.royaltyRate}%
                </p>
                <p className="text-sm text-gray-400">Industry average: 12-15%</p>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📈</span>
                  <h3 className="font-semibold text-white">Marketing Budget</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(label.terms.marketingBudget)}
                </p>
                <p className="text-sm text-gray-400">Per album promotion</p>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎤</span>
                  <h3 className="font-semibold text-white">Tour Support</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(label.terms.tourSupport)}
                </p>
                <p className="text-sm text-gray-400">Live performance funding</p>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💿</span>
                  <h3 className="font-semibold text-white">Album Commitment</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {label.terms.albumCommitment}
                </p>
                <p className="text-sm text-gray-400">Albums you must deliver</p>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⏰</span>
                  <h3 className="font-semibold text-white">Contract Length</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {label.terms.contractLength} years
                </p>
                <p className="text-sm text-gray-400">Duration of agreement</p>
              </div>
            </div>
          </section>

          {/* Deal Structure */}
          <section>
            <h2 className="text-xl font-bold text-violet-300 mb-4">Contract Terms</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">Creative Control</h3>
                  <span className="text-lg font-bold text-white">{label.terms.creativeControl}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${label.terms.creativeControl}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">How much say you have in your music, image, and career decisions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-semibold text-white mb-2">Recoupment Rate</h3>
                  <p className="text-lg font-bold text-white">{label.terms.recoupmentRate}%</p>
                  <p className="text-sm text-gray-400">Percentage of your earnings that go toward paying back the advance and costs</p>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-semibold text-white mb-2">Territories</h3>
                  <p className="text-lg font-bold text-white">{label.terms.territories.join(', ')}</p>
                  <p className="text-sm text-gray-400">Where the label can distribute your music</p>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-semibold text-white mb-2">Cross-Collateralized</h3>
                  <p className={`text-lg font-bold ${label.terms.crossCollateralized ? 'text-red-400' : 'text-green-400'}`}>
                    {label.terms.crossCollateralized ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {label.terms.crossCollateralized 
                      ? 'If one album flops, future albums must pay back its costs too'
                      : 'Each album stands alone financially'
                    }
                  </p>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-semibold text-white mb-2">Option Clause</h3>
                  <p className={`text-lg font-bold ${label.terms.optionClause ? 'text-red-400' : 'text-green-400'}`}>
                    {label.terms.optionClause ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {label.terms.optionClause 
                      ? 'They can extend your contract; you cannot easily leave'
                      : 'Clean exit when contract expires'
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Analysis */}
          <section>
            <h2 className="text-xl font-bold text-violet-300 mb-4">Deal Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Green Flags */}
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  What's Good About This Deal
                </h3>
                <div className="space-y-3">
                  {label.greenFlags.map((flag, index) => (
                    <div key={index} className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
                      <p className="text-green-100 text-sm leading-relaxed">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags */}
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  Red Flags to Watch
                </h3>
                <div className="space-y-3">
                  {label.redFlags.map((flag, index) => (
                    <div key={index} className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                      <p className="text-red-100 text-sm leading-relaxed">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Deal Breakers */}
          {label.dealBreakers && label.dealBreakers.length > 0 && (
            <section>
              <div className="bg-red-500/20 border border-red-500 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🚨</span>
                  MAJOR CONCERNS
                </h3>
                <div className="space-y-2">
                  {label.dealBreakers.map((breaker, index) => (
                    <p key={index} className="text-red-100 font-medium leading-relaxed">
                      • {breaker}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Calculator */}
          <section>
            <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Earnings Calculator</h3>
                <button 
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="text-violet-400 hover:text-violet-300 text-sm"
                >
                  {showCalculator ? 'Hide' : 'Show'} Calculator
                </button>
              </div>
              
              {showCalculator && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Expected annual streams:
                    </label>
                    <input
                      type="number"
                      value={expectedStreams}
                      onChange={(e) => setExpectedStreams(Number(e.target.value))}
                      className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                      min="0"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Revenue from streams:</p>
                      <p className="text-white font-semibold">{formatCurrency(calculation.streamRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Your share ({label.terms.royaltyRate}%):</p>
                      <p className="text-white font-semibold">{formatCurrency(calculation.artistShare)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Months to recoup:</p>
                      <p className="text-white font-semibold">
                        {calculation.monthsToRecoup > 120 ? '10+ years' : `${calculation.monthsToRecoup} months`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-600">
                    <p className="text-gray-400">Lifetime earnings after recoupment:</p>
                    <p className={`font-bold text-lg ${calculation.lifetimeEarnings > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(calculation.lifetimeEarnings)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Actions */}
          <section className="flex flex-col gap-4">
            <button
              onClick={onSign}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200"
            >
              Sign This Contract
            </button>
            <button
              onClick={onDecline}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200"
            >
              Walk Away
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};