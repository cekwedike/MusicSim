import React, { useState } from 'react';
import type { Achievement, HiredStaff, PlayerStats, ContractDuration, Difficulty } from '../types';
import { TrophyIcon, BriefcaseIcon } from './icons/Icons';
import { getAvailableStaff, staffTemplates } from '../data/staff';
import TerminationConfirmModal from './TerminationConfirmModal';

interface TerminationConfirmation {
  staff: HiredStaff;
  staffIndex: number;
}

interface ManagementPanelProps {
  achievements: Achievement[];
  staff: HiredStaff[];
  playerStats: PlayerStats;
  staffHiringUnlocked: boolean;
  difficulty: Difficulty;
  onHireStaff: (templateId: string, contractDuration: ContractDuration) => void;
  onTerminateStaff: (staffIndex: number) => void;
  onExtendContract: (staffIndex: number, additionalMonths: ContractDuration) => void;
  isGuestMode?: boolean;
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'entry': return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    case 'professional': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    case 'expert': return 'text-red-400 border-red-500/30 bg-red-500/10';
    case 'elite': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
  }
};

const getTierBadge = (tier: string) => {
  switch (tier) {
    case 'entry': return 'bg-[#4D1F2A] text-white';
    case 'professional': return 'bg-blue-600 text-white';
    case 'expert': return 'bg-red-600 text-white';
    case 'elite': return 'bg-yellow-600 text-black';
    default: return 'bg-[#4D1F2A] text-white';
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
  onExtendContract,
  isGuestMode = false
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'staff'>('achievements');
  const [hiringView, setHiringView] = useState<'current' | 'hire'>('current');
  const [selectedContractDuration, setSelectedContractDuration] = useState<Record<string, ContractDuration>>({});
  const [terminationPending, setTerminationPending] = useState<TerminationConfirmation | null>(null);

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
      <div className="flex gap-2 mb-3 sm:mb-4 border-b border-[#3D1820] pb-2">
        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-t text-xs sm:text-base font-semibold transition-colors ${
            activeTab === 'achievements'
              ? 'bg-red-600 text-white'
              : 'bg-[#3D1820] text-gray-300 hover:bg-[#4D1F2A]'
          }`}
        >
          <span className="hidden xs:inline">Achievements</span>
          <span className="xs:hidden">Achieve</span>
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-t text-xs sm:text-base font-semibold transition-colors ${
            activeTab === 'staff'
              ? 'bg-red-600 text-white'
              : 'bg-[#3D1820] text-gray-300 hover:bg-[#4D1F2A]'
          }`}
        >
          <span className="hidden sm:inline">Staff Management</span>
          <span className="sm:hidden">Staff</span>
        </button>
      </div>

      {/* ACHIEVEMENTS TAB */}
      {activeTab === 'achievements' && (
        <div>
          {unlockedCount === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <TrophyIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2 px-4">No Achievements Yet</h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto px-4">
                Keep playing to unlock achievements! Reach milestones, complete projects, and make smart decisions to earn your first trophy.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-gray-400 mb-3">Unlocked: {unlockedCount}/{totalCount}</p>
              <ul className="space-y-2 sm:space-y-3">
                {achievements.filter(a => a.unlocked).map(ach => (
                  <li key={ach.id} className="p-3 rounded-lg border border-yellow-500 bg-yellow-500/10">
                    <h4 className="font-bold text-sm sm:text-base text-yellow-400">{ach.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">{ach.description}</p>
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
          {!staffHiringUnlocked && (
            <div className="text-center py-8 sm:py-12 px-4">
              <BriefcaseIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2">Staff Hiring Locked</h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
                Reach <span className="text-yellow-400 font-bold">{unlockThresholds[difficulty]} Fame</span> to unlock the ability to hire professional staff.
              </p>
              <div className="mt-3 sm:mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 sm:p-3 max-w-md mx-auto">
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
              <div className="flex gap-2 mb-3 sm:mb-4">
                <button
                  onClick={() => setHiringView('current')}
                  className={`flex-1 px-2 sm:px-3 py-2 rounded text-sm sm:text-base font-medium transition-colors ${
                    hiringView === 'current'
                      ? 'bg-sky-600 text-white'
                      : 'bg-[#3D1820] text-gray-300 hover:bg-[#4D1F2A]'
                  }`}
                >
                  <span className="hidden sm:inline">Current Staff ({staff.length}/3)</span>
                  <span className="sm:hidden">Current ({staff.length}/3)</span>
                </button>
                <button
                  onClick={() => setHiringView('hire')}
                  className={`flex-1 px-2 sm:px-3 py-2 rounded text-sm sm:text-base font-medium transition-colors ${
                    hiringView === 'hire'
                      ? 'bg-green-600 text-white'
                      : 'bg-[#3D1820] text-gray-300 hover:bg-[#4D1F2A]'
                  }`}
                >
                  <span className="hidden sm:inline">Hire New Staff</span>
                  <span className="sm:hidden">Hire New</span>
                </button>
              </div>

              {/* CURRENT STAFF VIEW */}
              {hiringView === 'current' && (
                <div className="space-y-3 sm:space-y-4">
                  {staff.length > 0 ? (
                    staff.map((member, index) => (
                      <div
                        key={index}
                        className={`p-3 sm:p-4 rounded-lg border ${getTierColor(member.tier)}`}
                      >
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-base sm:text-lg truncate">{member.name}</h4>
                            <p className="text-xs sm:text-sm opacity-80">{member.role}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase flex-shrink-0 ${getTierBadge(member.tier)}`}>
                            {member.tier}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 my-2 sm:my-3 text-xs sm:text-sm">
                          <div>
                            <p className="text-gray-400">Monthly Salary</p>
                            <p className="font-semibold">${member.salary.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Contract Remaining</p>
                            <p className={`font-semibold ${member.monthsRemaining <= 1 ? 'text-red-400' : 'text-green-400'}`}>
                              {member.monthsRemaining} <span className="hidden sm:inline">{member.monthsRemaining === 1 ? 'month' : 'months'}</span><span className="sm:hidden">mo</span>
                            </p>
                          </div>
                        </div>

                        {/* Bonuses */}
                        <div className="mb-2 sm:mb-3 pt-2 border-t border-current border-opacity-20">
                          <h5 className="font-semibold text-xs sm:text-sm mb-1">Weekly Bonuses:</h5>
                          <ul className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm opacity-90">
                            {member.bonuses.map((bonus, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-green-400 flex-shrink-0">✓</span>
                                <span>{bonus.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:pt-3 border-t border-current border-opacity-20">
                          {member.monthsRemaining <= 2 && (
                            <div className="flex gap-2 flex-1">
                              <button
                                onClick={() => onExtendContract(index, 6)}
                                disabled={playerStats.cash < member.salary}
                                className={`flex-1 px-2 sm:px-3 py-2 rounded font-medium text-xs sm:text-sm transition-colors ${
                                  playerStats.cash >= member.salary
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-[#4D1F2A] text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <span className="hidden sm:inline">Extend +6mo (${member.salary.toLocaleString()})</span>
                                <span className="sm:hidden">+6mo</span>
                              </button>
                              <button
                                onClick={() => onExtendContract(index, 12)}
                                disabled={playerStats.cash < member.salary}
                                className={`flex-1 px-2 sm:px-3 py-2 rounded font-medium text-xs sm:text-sm transition-colors ${
                                  playerStats.cash >= member.salary
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-[#4D1F2A] text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <span className="hidden sm:inline">Extend +12mo (${member.salary.toLocaleString()})</span>
                                <span className="sm:hidden">+12mo</span>
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setTerminationPending({ staff: member, staffIndex: index });
                            }}
                            className="px-2 sm:px-3 py-2 rounded font-medium text-xs sm:text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 transition-colors"
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
                    <div className="text-center py-8 sm:py-12 bg-[#2D1115]/30 rounded-lg border border-[#3D1820] px-4">
                      <BriefcaseIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-600" />
                      <p className="text-sm text-gray-400 mb-3">No staff hired yet.</p>
                      <button
                        onClick={() => setHiringView('hire')}
                        className="mt-2 sm:mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors text-sm"
                      >
                        Browse Available Staff
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* HIRE NEW STAFF VIEW */}
              {hiringView === 'hire' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Info Banner */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-blue-300">
                      <strong>Cash Capacity Required:</strong> You need 3 months of salary available to hire staff. Monthly payments are automatic.
                    </p>
                  </div>

                  {/* Current Cash Display */}
                  <div className="bg-[#2D1115]/50 rounded-lg p-3 border border-[#3D1820]">
                    <p className="text-xs sm:text-sm text-gray-400">Your Cash</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-400">${playerStats.cash.toLocaleString()}</p>
                  </div>

                  {/* Staff by Role */}
                  {(['Manager', 'Booker', 'Promoter'] as const).map(role => (
                    <div key={role} className="space-y-2 sm:space-y-3">
                      <h3 className="text-base sm:text-lg font-bold text-gray-200 flex items-center gap-2 flex-wrap">
                        <span>{role}s</span>
                        {hasRole(role) && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Already Hired</span>
                        )}
                      </h3>

                      {groupedAvailableStaff[role].length > 0 ? (
                        <div className="grid gap-2 sm:gap-3">
                          {groupedAvailableStaff[role].map(template => {
                            const alreadyHired = hasRole(template.role);
                            const affordable = canAfford(template.salary);
                            const canHire = !alreadyHired && affordable;
                            const selectedDuration = selectedContractDuration[template.id] || 12;
                            const minimumRequired = template.salary * 3;

                            return (
                              <div
                                key={template.id}
                                className={`p-3 sm:p-4 rounded-lg border ${getTierColor(template.tier)} ${
                                  !canHire ? 'opacity-60' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2 gap-2">
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-sm sm:text-base">{template.name}</h4>
                                    <p className="text-xs opacity-80">{template.description}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase flex-shrink-0 ${getTierBadge(template.tier)}`}>
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
                                <div className="my-2 grid grid-cols-2 gap-2 text-xs sm:text-sm">
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
                                <div className="mb-2 sm:mb-3 py-2 border-t border-current border-opacity-20">
                                  <h5 className="font-semibold text-xs mb-1">Weekly Bonuses:</h5>
                                  <ul className="space-y-0.5 text-xs opacity-90">
                                    {template.bonuses.map((bonus, i) => (
                                      <li key={i} className="flex items-start gap-1">
                                        <span className="text-green-400 flex-shrink-0">✓</span>
                                        <span>{bonus.description}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Contract Duration Selection */}
                                {!alreadyHired && (
                                  <div className="mb-2 sm:mb-3">
                                    <label className="block text-xs text-gray-400 mb-1">Contract Duration</label>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleSetDuration(template.id, 6)}
                                        className={`flex-1 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                                          selectedDuration === 6
                                            ? 'bg-red-600 text-white'
                                            : 'bg-[#3D1820] text-gray-300 hover:bg-[#4D1F2A]'
                                        }`}
                                      >
                                        <span className="hidden sm:inline">6 Months</span>
                                        <span className="sm:hidden">6mo</span>
                                      </button>
                                      <button
                                        onClick={() => handleSetDuration(template.id, 12)}
                                        className={`flex-1 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                                          selectedDuration === 12
                                            ? 'bg-red-600 text-white'
                                            : 'bg-[#3D1820] text-gray-300 hover:bg-[#4D1F2A]'
                                        }`}
                                      >
                                        <span className="hidden sm:inline">12 Months</span>
                                        <span className="sm:hidden">12mo</span>
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Hire Button */}
                                {alreadyHired ? (
                                  <div className="p-2 bg-[#3D1820]/50 rounded text-center">
                                    <p className="text-xs sm:text-sm text-gray-400">Already hired this role</p>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleHire(template.id)}
                                    disabled={!canHire}
                                    className={`w-full px-3 sm:px-4 py-2 rounded text-xs sm:text-sm font-bold transition-colors ${
                                      canHire
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-[#4D1F2A] text-gray-400 cursor-not-allowed'
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
                        <div className="p-4 bg-[#2D1115]/30 rounded-lg border border-[#3D1820]">
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

      {/* Termination Confirmation Modal */}
      {terminationPending && (
        <TerminationConfirmModal
          staff={terminationPending.staff}
          onConfirm={() => {
            onTerminateStaff(terminationPending.staffIndex);
            setTerminationPending(null);
          }}
          onCancel={() => setTerminationPending(null)}
        />
      )}
    </div>
  );
};

export default ManagementPanel;
