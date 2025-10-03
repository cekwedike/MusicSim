import React, { useState, useRef, useEffect } from 'react';
import type { Achievement, GameEvent, Staff } from '../types';
import { TrophyIcon, LogIcon, BriefcaseIcon } from './icons/Icons';

interface ManagementModalProps {
    achievements: Achievement[];
    events: GameEvent[];
    staff: Staff[];
    onClose: () => void;
}

const ManagementModal: React.FC<ManagementModalProps> = ({ achievements, events, staff, onClose }) => {
    const [activeTab, setActiveTab] = useState('achievements');
    const logEndRef = useRef<HTMLDivElement>(null);

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;

    useEffect(() => {
        if(activeTab === 'log') {
            logEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeTab, events]);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <div className="flex justify-around">
                         <button 
                            onClick={() => setActiveTab('achievements')}
                            className={`flex-1 text-center py-2 font-bold flex items-center justify-center gap-2 ${activeTab === 'achievements' ? 'text-violet-300 border-b-2 border-violet-400' : 'text-gray-400 hover:text-white'}`}
                         >
                            <TrophyIcon /> Achievements
                        </button>
                         <button 
                            onClick={() => setActiveTab('staff')}
                            className={`flex-1 text-center py-2 font-bold flex items-center justify-center gap-2 ${activeTab === 'staff' ? 'text-violet-300 border-b-2 border-violet-400' : 'text-gray-400 hover:text-white'}`}
                         >
                            <BriefcaseIcon /> Staff
                        </button>
                         <button 
                            onClick={() => setActiveTab('log')}
                            className={`career-log-button flex-1 text-center py-2 font-bold flex items-center justify-center gap-2 ${activeTab === 'log' ? 'text-violet-300 border-b-2 border-violet-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            <LogIcon /> Log
                        </button>
                    </div>
                </div>

                <div className="p-4 md:p-6 overflow-y-auto">
                    {activeTab === 'achievements' && (
                        <div>
                            <p className="text-center mb-4 text-gray-400">Unlocked: {unlockedCount}/{totalCount}</p>
                            <ul className="space-y-3">
                                {achievements.map(ach => (
                                    <li key={ach.id} className={`p-3 rounded-lg border transition-opacity ${ach.unlocked ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-gray-700 bg-gray-900/50 opacity-60'}`}>
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
                                <div key={member.role} className="p-4 rounded-lg border border-sky-500/50 bg-sky-500/10">
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
                    {activeTab === 'log' && (
                         <ul className="space-y-3 text-sm">
                            {events.slice().reverse().map((event, index) => (
                                <li key={`${event.date.year}-${event.date.month}-${event.date.week}-${index}`} className="text-gray-400 border-l-2 border-violet-500 pl-3 leading-relaxed">
                                    <p><span className="font-semibold text-gray-300">Y{event.date.year} M{event.date.month} W{event.date.week}:</span> {event.description}</p>
                                </li>
                            ))}
                            <div ref={logEndRef} />
                        </ul>
                    )}
                </div>

                 <div className="p-4 border-t border-gray-700 mt-auto">
                    <button
                        onClick={onClose}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagementModal;