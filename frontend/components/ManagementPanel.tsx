import React, { useState } from 'react';
import type { Achievement, LogEntry, Staff } from '../types';
import { TrophyIcon, BriefcaseIcon } from './icons/Icons';

interface ManagementPanelProps {
  achievements: Achievement[];
  logs?: LogEntry[];
  staff: Staff[];
  onClose?: () => void;
}

const ManagementPanel: React.FC<ManagementPanelProps> = ({ achievements, staff }) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'staff'>('achievements');

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="text-gray-300">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('achievements')} className={`px-3 py-1 rounded ${activeTab === 'achievements' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Achievements</button>
        <button onClick={() => setActiveTab('staff')} className={`px-3 py-1 rounded ${activeTab === 'staff' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Staff</button>
      </div>

      {activeTab === 'achievements' && (
        <div>
          <p className="text-sm text-gray-400 mb-3">Unlocked: {unlockedCount}/{totalCount}</p>
          <ul className="space-y-3">
            {achievements.map(ach => (
              <li key={ach.id} className={`p-3 rounded-lg border ${ach.unlocked ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-700 bg-gray-900/50'}`}>
                <h4 className={`font-bold ${ach.unlocked ? 'text-yellow-400' : 'text-gray-300'}`}>{ach.name}</h4>
                <p className="text-sm text-gray-400">{ach.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="space-y-4">
          {staff.length > 0 ? staff.map(member => (
            <div key={member.role} className="p-4 rounded-lg border border-sky-500/30 bg-sky-500/10">
              <h4 className="font-bold text-sky-300 text-lg">{member.name} - <span className="text-base font-medium">{member.role}</span></h4>
              <p className="text-sm text-gray-300 mt-1">Salary: ${member.salary.toLocaleString()}/week</p>
              <p className="text-sm text-gray-400">Contract Ends: {member.contractLength} weeks</p>
              <div className="mt-2 pt-2 border-t border-sky-500/20">
                <h5 className="font-semibold text-gray-300 text-sm">Bonuses:</h5>
                <ul className="list-disc list-inside text-sm text-gray-400">
                  {member.bonuses.map(bonus => (
                    <li key={bonus.stat}>{bonus.description}</li>
                  ))}
                </ul>
              </div>
            </div>
          )) : <p className="text-center text-gray-400">You haven't hired any staff yet.</p>}
        </div>
      )}
    </div>
  );
};

export default ManagementPanel;
