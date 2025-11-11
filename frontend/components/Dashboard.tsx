import React, { useState } from 'react';
import type { PlayerStats, Project, GameDate } from '../types';
import { CashIcon, FameIcon, WellBeingIcon, CalendarIcon, HypeIcon } from './icons/Icons';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StatDisplayProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: 'green' | 'yellow' | 'sky' | 'violet' | 'pink';
    maxValue?: number;
    isDate?: boolean;
}

const colorClasses = {
    green: { text: 'text-green-400', from: 'from-green-500', to: 'to-green-400' },
    yellow: { text: 'text-yellow-400', from: 'from-yellow-500', to: 'to-yellow-400' },
    sky: { text: 'text-sky-400', from: 'from-sky-500', to: 'to-sky-400' },
    violet: { text: 'text-violet-400', from: 'from-violet-500', to: 'to-violet-400' },
    pink: { text: 'text-pink-400', from: 'from-pink-500', to: 'to-pink-400' },
};


const StatDisplay: React.FC<StatDisplayProps> = ({ icon, label, value, color, maxValue = 100, isDate = false }) => {
    const classes = colorClasses[color];
    const containerClass = isDate ? "date-display bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-3 md:p-4 flex flex-col justify-between shadow-lg border border-gray-700/50"
                                  : "bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-3 md:p-4 flex flex-col justify-between shadow-lg border border-gray-700/50";

    return (
        <div className={containerClass}>
            <div className="flex items-center space-x-2 sm:space-x-2 mb-1 sm:mb-2">
                <div className={`${classes.text} w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0`}>{icon}</div>
                <span className="font-bold text-gray-300 text-xs sm:text-sm md:text-base">{label}</span>
            </div>
            {label === 'Cash' ? (
                 <p className={`text-xs sm:text-lg md:text-xl lg:text-2xl font-bold text-right ${classes.text} break-all`}>${Number(value).toLocaleString()}</p>
            ) : isDate ? (
                 <p className={`text-xs sm:text-base md:text-lg lg:text-xl font-bold text-right ${classes.text} break-words`}>{value}</p>
            ) : (
                <div>
                    <p className={`text-xs sm:text-lg md:text-xl lg:text-2xl font-bold text-right ${classes.text}`}>{value}/{maxValue}</p>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2.5 mt-1 overflow-hidden">
                        <div
                            className={`bg-gradient-to-r ${classes.from} ${classes.to} h-1.5 sm:h-2.5 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${Math.max(0, Math.min(100, (Number(value) / maxValue) * 100))}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}

const ProjectTracker: React.FC<{ project: Project | null }> = ({ project }) => {
    if (!project) return null;

    const progressPercentage = (project.progress / project.requiredProgress) * 100;

    return (
        <div className="current-project mt-3 bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 sm:p-4 shadow-lg border border-gray-700/50">
            <h3 className="text-sm sm:text-lg font-bold text-violet-300 mb-1 sm:mb-2">Current Project: {project.name}</h3>
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-3 sm:h-4 rounded-full transition-all duration-500 ease-out text-right"
                        style={{ width: `${progressPercentage}%`}}
                    >
                    </div>
                </div>
                <span className="font-bold text-gray-200 text-xs sm:text-base">{Math.floor(progressPercentage)}%</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Quality: {project.quality}</p>
        </div>
    );
};


const Dashboard: React.FC<{ stats: PlayerStats, project: Project | null, date: GameDate, currentDate?: Date }> = ({ stats, project, date, currentDate }) => {
    const [isMobileCollapsed, setIsMobileCollapsed] = useState(true);

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const displayDate = currentDate ? formatDate(currentDate) : `Y${date.year} M${date.month} W${date.week}`;

    return (
        <div className="mb-3 md:mb-4 mt-4 sm:mt-5">
            {/* Mobile: Collapsible view */}
            <div className="lg:hidden bg-gray-800 rounded-lg border border-gray-700">
                {isMobileCollapsed ? (
                    <button
                        onClick={() => setIsMobileCollapsed(false)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors rounded-lg"
                    >
                        <div className="flex items-center gap-2">
                            <CashIcon />
                            <span className="text-sm font-bold text-white">Stats</span>
                            <span className="text-xs text-green-400">${stats.cash.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">|</span>
                            <span className="text-xs text-yellow-400">Fame: {stats.fame}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-violet-400" />
                    </button>
                ) : (
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-white">Player Stats</span>
                            <button
                                onClick={() => setIsMobileCollapsed(true)}
                                className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
                            >
                                <span>Hide</span>
                                <ChevronUp className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="player-stats grid grid-cols-2 gap-2.5">
                            <StatDisplay icon={<CashIcon />} label="Cash" value={stats.cash} color="green" />
                            <StatDisplay icon={<FameIcon />} label="Fame" value={stats.fame} color="yellow" />
                            <StatDisplay icon={<WellBeingIcon />} label="Well-Being" value={stats.wellBeing} color="sky" />
                            <StatDisplay icon={<HypeIcon />} label="Hype" value={stats.hype} color="pink" />
                            <div className="col-span-2">
                                <StatDisplay icon={<CalendarIcon />} label="Date" value={displayDate} color="violet" isDate={true} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop: Always visible */}
            <div className="hidden lg:block">
                <div className="player-stats grid grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
                    <StatDisplay icon={<CashIcon />} label="Cash" value={stats.cash} color="green" />
                    <StatDisplay icon={<FameIcon />} label="Fame" value={stats.fame} color="yellow" />
                    <StatDisplay icon={<WellBeingIcon />} label="Well-Being" value={stats.wellBeing} color="sky" />
                    <StatDisplay icon={<HypeIcon />} label="Hype" value={stats.hype} color="pink" />
                    <StatDisplay icon={<CalendarIcon />} label="Date" value={displayDate} color="violet" isDate={true} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;