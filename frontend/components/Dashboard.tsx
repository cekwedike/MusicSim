import React from 'react';
import type { PlayerStats, Project, GameDate } from '../types';
import { CashIcon, FameIcon, WellBeingIcon, CalendarIcon, HypeIcon } from './icons/Icons';

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
            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                <div className={`${classes.text} w-4 h-4 sm:w-5 sm:h-5`}>{icon}</div>
                <span className="font-bold text-gray-300 text-xs sm:text-sm md:text-base">{label}</span>
            </div>
            {label === 'Cash' ? (
                 <p className={`text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-right ${classes.text} break-all`}>${Number(value).toLocaleString()}</p>
            ) : isDate ? (
                 <p className={`text-xs sm:text-base md:text-lg lg:text-xl font-bold text-right ${classes.text} break-words`}>{value}</p>
            ) : (
                <div>
                    <p className={`text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-right ${classes.text}`}>{value}/{maxValue}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 sm:h-2.5 mt-1.5 overflow-hidden">
                        <div
                            className={`bg-gradient-to-r ${classes.from} ${classes.to} h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out`}
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
        <div className="current-project mt-4 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-700/50">
            <h3 className="text-lg font-bold text-violet-300 mb-2">Current Project: {project.name}</h3>
            <div className="flex items-center gap-4">
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-4 rounded-full transition-all duration-500 ease-out text-right"
                        style={{ width: `${progressPercentage}%`}}
                    >
                    </div>
                </div>
                <span className="font-bold text-gray-200">{Math.floor(progressPercentage)}%</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Quality: {project.quality}</p>
        </div>
    );
};


const Dashboard: React.FC<{ stats: PlayerStats, project: Project | null, date: GameDate, currentDate?: Date }> = ({ stats, project, date, currentDate }) => {
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const displayDate = currentDate ? formatDate(currentDate) : `Y${date.year} M${date.month} W${date.week}`;

    return (
        <div className="mb-4 md:mb-0 mt-2">
            {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 5 columns */}
            <div className="player-stats grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-4">
                <StatDisplay icon={<CashIcon />} label="Cash" value={stats.cash} color="green" />
                <StatDisplay icon={<FameIcon />} label="Fame" value={stats.fame} color="yellow" />
                <StatDisplay icon={<WellBeingIcon />} label="Well-Being" value={stats.wellBeing} color="sky" />
                <StatDisplay icon={<HypeIcon />} label="Hype" value={stats.hype} color="pink" />
                {/* Date spans full width on mobile */}
                <div className="col-span-2 md:col-span-1">
                    <StatDisplay icon={<CalendarIcon />} label="Date" value={displayDate} color="violet" isDate={true} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;