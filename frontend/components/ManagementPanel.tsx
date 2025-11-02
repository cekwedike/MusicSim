import React, { useState } from 'react';
import type { Achievement, HiredStaff, PlayerStats, ContractDuration, Difficulty } from '../types';
import { TrophyIcon, BriefcaseIcon } from './icons/Icons';
import { getAvailableStaff, staffTemplates } from '../data/staff';

interface ManagementPanelProps {
  achievements: Achievement[];
  staff: HiredStaff[];
  playerStats: PlayerStats;
  staffHiringUnlocked: boolean;
  difficulty: Difficulty;
  onHireStaff: (templateId: string, contractDuration: ContractDuration) => void;
  onTerminateStaff: (staffIndex: number) => void;
  onExtendContract: (staffIndex: number, additionalMonths: ContractDuration) => void;
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'entry': return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    case 'professional': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    case 'expert': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    case 'elite': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
  }
};

const getTierBadge = (tier: string) => {
  switch (tier) {
    case 'entry': return 'bg-gray-600 text-white';
    case 'professional': return 'bg-blue-600 text-white';
    case 'expert': return 'bg-purple-600 text-white';
    case 'elite': return 'bg-yellow-600 text-black';
    default: return 'bg-gray-600 text-white';
  }
};

const ManagementPanel: React.FC<ManagementPanelProps> = ({
  achievements,
  staff,
  playerStats,
  staffHiringUnlocked,
  difficulty,
  onHireStaff,
  onTerminateStaff,
  onExtendContract
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'staff'>('achievements');
  const [hiringView, setHiringView] = useState<'current' | 'hire'>('current');
  const [selectedContractDuration, setSelectedContractDuration] = useState<Record<string, ContractDuration>>({});

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  // Get available staff templates based on player fame
  const availableStaffTemplates = getAvailableStaff(playerStats.fame, staffHiringUnlocked);

  // Group staff by role
  const groupedAvailableStaff = {
    Manager: availableStaffTemplates.filter(s => s.role === 'Manager'),
    Booker: availableStaffTemplates.filter(s => s.role === 'Booker'),
    Promoter: availableStaffTemplates.filter(s => s.role === 'Promoter')
  };

  // Check if player already has a role
  const hasRole = (role: string) => staff.some(s => s.role === role);

  // Check if player can afford to hire (3 months minimum)
  const canAfford = (salary: number) => playerStats.cash >= (salary * 3);

  // Get unlock thresholds for current difficulty
  const unlockThresholds = {
    beginner: 20,
    realistic: 35,
    hardcore: 50
  };

  const handleHire = (templateId: string) => {
    const duration = selectedContractDuration[templateId] || 12;
    onHireStaff(templateId, duration);
    // Reset selection
    setSelectedContractDuration(prev => ({ ...prev, [templateId]: 12 }));
  };

  const handleSetDuration = (templateId: string, duration: ContractDuration) => {
    setSelectedContractDuration(prev => ({ ...prev, [templateId]: duration }));
  };

  return (
    <div className="text-gray-300">
      <div className="flex gap-2 mb-4 border-b border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-t font-semibold transition-colors ${
            activeTab === 'achievements'
              ? 'bg-violet-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-t font-semibold transition-colors ${
            activeTab === 'staff'
              ? 'bg-violet-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Staff Management
        </button>
      </div>

      {/* ACHIEVEMENTS TAB */}
      {activeTab === 'achievements' && (
        <div>
          {unlockedCount === 0 ? (
            <div className="text-center py-12">
              <TrophyIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No Achievements Yet</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                Keep playing to unlock achievements! Reach milestones, complete projects, and make smart decisions to earn your first trophy.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-3">Unlocked: {unlockedCount}/{totalCount}</p>
              <ul className="space-y-3">
                {achievements.filter(a => a.unlocked).map(ach => (
                  <li key={ach.id} className="p-3 rounded-lg border border-yellow-500 bg-yellow-500/10">
                    <h4 className="font-bold text-yellow-400">{ach.name}</h4>
                    <p className="text-sm text-gray-400">{ach.description}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* STAFF TAB */}
      {activeTab === 'staff' && (
        <div>
          {/* Staff Hiring Locked */}
          {!staffHiringUnlocked && (
            <div className="text-center py-12">
              <BriefcaseIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Staff Hiring Locked</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                Reach <span className="text-yellow-400 font-bold">{unlockThresholds[difficulty]} Fame</span> to unlock the ability to hire professional staff.
              </p>
              <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 max-w-md mx-auto">
                <p className="text-xs text-blue-300">
                  Tip: <strong>Hiring staff gives you powerful weekly bonuses but requires monthly salary payments. Build your fame first!</strong>
                </p>
              </div>
            </div>
          )}

          {/* Staff Hiring Unlocked */}
          {staffHiringUnlocked && (
            <>
              {/* Sub-navigation */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setHiringView('current')}
                  className={`flex-1 px-3 py-2 rounded font-medium transition-colors ${
                    hiringView === 'current'
                      ? 'bg-sky-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Current Staff ({staff.length}/3)
                </button>
                <button
                  onClick={() => setHiringView('hire')}
                  className={`flex-1 px-3 py-2 rounded font-medium transition-colors ${
                    hiringView === 'hire'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Hire New Staff
                </button>
              </div>

              {/* CURRENT STAFF VIEW */}
              {hiringView === 'current' && (
                <div className="space-y-4">
                  {staff.length > 0 ? (
                    staff.map((member, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${getTierColor(member.tier)}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lg">{member.name}</h4>
                            <p className="text-sm opacity-80">{member.role}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getTierBadge(member.tier)}`}>
                            {member.tier}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 my-3 text-sm">
                          <div>
                            <p className="text-gray-400">Monthly Salary</p>
                            <p className="font-semibold">${member.salary.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Contract Remaining</p>
                            <p className={`font-semibold ${member.monthsRemaining <= 1 ? 'text-red-400' : 'text-green-400'}`}>
                              {member.monthsRemaining} {member.monthsRemaining === 1 ? 'month' : 'months'}
                            </p>
                          </div>
                        </div>

                        {/* Bonuses */}
                        <div className="mb-3 pt-2 border-t border-current border-opacity-20">
                          <h5 className="font-semibold text-sm mb-1">Weekly Bonuses:</h5>
                          <ul className="space-y-1 text-sm opacity-90">
                            {member.bonuses.map((bonus, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-green-400">✓</span>
                                <span>{bonus.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-3 border-t border-current border-opacity-20">
                          {member.monthsRemaining <= 2 && (
                            <>
                              <button
                                onClick={() => onExtendContract(index, 6)}
                                disabled={playerStats.cash < member.salary}
                                className={`flex-1 px-3 py-2 rounded font-medium text-sm transition-colors ${
                                  playerStats.cash >= member.salary
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                Extend +6mo (${member.salary.toLocaleString()})
                              </button>
                              <button
                                onClick={() => onExtendContract(index, 12)}
                                disabled={playerStats.cash < member.salary}
                                className={`flex-1 px-3 py-2 rounded font-medium text-sm transition-colors ${
                                  playerStats.cash >= member.salary
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                Extend +12mo (${member.salary.toLocaleString()})
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm(`Terminate ${member.name}? This will cost $${(member.salary * 2).toLocaleString()} in severance and reduce your well-being.`)) {
                                onTerminateStaff(index);
                              }
                            }}
                            className="px-3 py-2 rounded font-medium text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 transition-colors"
                          >
                            Terminate
                          </button>
                        </div>

                        {playerStats.cash < member.salary && member.monthsRemaining <= 2 && (
                          <p className="text-xs text-red-400 mt-2">Insufficient funds to extend contract</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
                      <BriefcaseIcon className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                      <p className="text-gray-400">No staff hired yet.</p>
                      <button
                        onClick={() => setHiringView('hire')}
                        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
                      >
                        Browse Available Staff
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* HIRE NEW STAFF VIEW */}
              {hiringView === 'hire' && (
                <div className="space-y-6">
                  {/* Info Banner */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-sm text-blue-300">
                      <strong>Cash Capacity Required:</strong> You need 3 months of salary available to hire staff. Monthly payments are automatic.
                    </p>
                  </div>

                  {/* Current Cash Display */}
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <p className="text-sm text-gray-400">Your Cash</p>
                    <p className="text-2xl font-bold text-green-400">${playerStats.cash.toLocaleString()}</p>
                  </div>

                  {/* Staff by Role */}
                  {(['Manager', 'Booker', 'Promoter'] as const).map(role => (
                    <div key={role} className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                        <span>{role}s</span>
                        {hasRole(role) && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Already Hired</span>
                        )}
                      </h3>

                      {groupedAvailableStaff[role].length > 0 ? (
                        <div className="grid gap-3">
                          {groupedAvailableStaff[role].map(template => {
                            const alreadyHired = hasRole(template.role);
                            const affordable = canAfford(template.salary);
                            const canHire = !alreadyHired && affordable;
                            const selectedDuration = selectedContractDuration[template.id] || 12;
                            const minimumRequired = template.salary * 3;

                            return (
                              <div
                                key={template.id}
                                className={`p-4 rounded-lg border ${getTierColor(template.tier)} ${
                                  !canHire ? 'opacity-60' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-bold">{template.name}</h4>
                                    <p className="text-xs opacity-80">{template.description}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getTierBadge(template.tier)}`}>
                                    {template.tier}
                                  </span>
                                </div>

                                {/* Unlock Requirement */}
                                {template.unlockRequirement.type === 'fame' && playerStats.fame < (template.unlockRequirement.value || 0) && (
                                  <div className="mb-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
                                    <p className="text-xs text-red-400">
                                      {template.unlockRequirement.message}
                                    </p>
                                  </div>
                                )}

                                {/* Pricing */}
                                <div className="my-2 grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="text-gray-400 text-xs">Monthly Salary</p>
                                    <p className="font-semibold">${template.salary.toLocaleString()}/mo</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-xs">Min. Cash Required</p>
                                    <p className={`font-semibold ${affordable ? 'text-green-400' : 'text-red-400'}`}>
                                      ${minimumRequired.toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                {/* Bonuses */}
                                <div className="mb-3 py-2 border-t border-current border-opacity-20">
                                  <h5 className="font-semibold text-xs mb-1">Weekly Bonuses:</h5>
                                  <ul className="space-y-0.5 text-xs opacity-90">
                                    {template.bonuses.map((bonus, i) => (
                                      <li key={i} className="flex items-start gap-1">
                                        <span className="text-green-400">✓</span>
                                        <span>{bonus.description}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Contract Duration Selection */}
                                {!alreadyHired && (
                                  <div className="mb-3">
                                    <label className="block text-xs text-gray-400 mb-1">Contract Duration</label>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleSetDuration(template.id, 6)}
                                        className={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                                          selectedDuration === 6
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                      >
                                        6 Months
                                      </button>
                                      <button
                                        onClick={() => handleSetDuration(template.id, 12)}
                                        className={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                                          selectedDuration === 12
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                      >
                                        12 Months
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Hire Button */}
                                {alreadyHired ? (
                                  <div className="p-2 bg-gray-700/50 rounded text-center">
                                    <p className="text-sm text-gray-400">Already hired this role</p>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleHire(template.id)}
                                    disabled={!canHire}
                                    className={`w-full px-4 py-2 rounded font-bold transition-colors ${
                                      canHire
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                  >
                                    {!affordable
                                      ? `Need $${(minimumRequired - playerStats.cash).toLocaleString()} more`
                                      : `Hire for ${selectedDuration} months`}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                          <p className="text-sm text-gray-400">
                            No {role.toLowerCase()}s available at your current fame level.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagementPanel;
