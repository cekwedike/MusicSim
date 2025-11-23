import React, { useState } from 'react';
import type { PlayerStats, Project, GameDate } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StatDisplayProps {
    label: string;
    value: number | string;
    color: 'green' | 'yellow' | 'sky' | 'red' | 'pink';
    maxValue?: number;
    isDate?: boolean;
}

const colorClasses = {
    green: { text: 'text-green-400', from: 'from-green-500', to: 'to-green-400' },
    yellow: { text: 'text-yellow-400', from: 'from-yellow-500', to: 'to-yellow-400' },
    sky: { text: 'text-sky-400', from: 'from-sky-500', to: 'to-sky-400' },
    red: { text: 'text-red-400', from: 'from-red-500', to: 'to-red-400' },
    pink: { text: 'text-pink-400', from: 'from-pink-500', to: 'to-pink-400' },
};


const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, color, maxValue = 100, isDate = false }) => {
    const classes = colorClasses[color];
    const containerClass = isDate ? "date-display bg-[#2D1115]/50 backdrop-blur-sm rounded-lg p-2 flex flex-col justify-between shadow-lg border border-[#3D1820]/50"
                                  : "bg-[#2D1115]/50 backdrop-blur-sm rounded-lg p-2 flex flex-col justify-between shadow-lg border border-[#3D1820]/50";

    return (
        <div className={containerClass}>
            <div className="flex items-center space-x-1.5 mb-1">
                <span className="font-bold text-gray-300 text-xs sm:text-sm">{label}</span>
            </div>
            {label === 'Cash' ? (
                 <p className={`text-xs sm:text-base md:text-lg font-bold text-right ${classes.text} break-all`}>${Number(value).toLocaleString()}</p>
            ) : isDate ? (
                 <p className={`text-xs sm:text-sm md:text-base font-bold text-right ${classes.text} break-words`}>{value}</p>
            ) : (
                <div>
                    <p className={`text-xs sm:text-base md:text-lg font-bold text-right ${classes.text}`}>{value}/{maxValue}</p>
                    <div className="w-full bg-[#3D1820] rounded-full h-1 sm:h-1.5 mt-0.5 overflow-hidden">
                        <div
                            className={`bg-gradient-to-r ${classes.from} ${classes.to} h-1 sm:h-1.5 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${Math.max(0, Math.min(100, (Number(value) / maxValue) * 100))}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}

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
        <div className="mb-1.5 md:mb-2 mt-1.5">
            {/* Mobile: Collapsible view */}
            <div className="lg:hidden bg-[#2D1115] rounded-lg border border-[#3D1820]">
                {isMobileCollapsed ? (
                    <button
                        onClick={() => setIsMobileCollapsed(false)}
                        className="w-full flex items-center justify-between p-2 hover:bg-[#3D1820]/50 transition-colors rounded-lg"
                    >
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">Stats</span>
                            <span className="text-xs text-green-400">${stats.cash.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">|</span>
                            <span className="text-xs text-yellow-400">Fame: {stats.fame}</span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-red-400" />
                    </button>
                ) : (
                    <div className="p-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white">Player Stats</span>
                            <button
                                onClick={() => setIsMobileCollapsed(true)}
                                className="flex items-center gap-0.5 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                            >
                                <span>Hide</span>
                                <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="player-stats grid grid-cols-2 gap-2">
                            <StatDisplay label="Cash" value={stats.cash} color="green" />
                            <StatDisplay label="Fame" value={stats.fame} color="yellow" />
                            <StatDisplay label="Well-Being" value={stats.wellBeing} color="sky" />
                            <StatDisplay label="Hype" value={stats.hype} color="pink" />
                            <div className="col-span-2">
                                <StatDisplay label="Date" value={displayDate} color="red" isDate={true} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop: Always visible */}
            <div className="hidden lg:block">
                <div className="player-stats grid grid-cols-3 lg:grid-cols-5 gap-2">
                    <StatDisplay label="Cash" value={stats.cash} color="green" />
                    <StatDisplay label="Fame" value={stats.fame} color="yellow" />
                    <StatDisplay label="Well-Being" value={stats.wellBeing} color="sky" />
                    <StatDisplay label="Hype" value={stats.hype} color="pink" />
                    <StatDisplay label="Date" value={displayDate} color="red" isDate={true} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
