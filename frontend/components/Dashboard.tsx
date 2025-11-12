import React, { useState } from 'react';
import type { PlayerStats, Project, GameDate } from '../types';
import { CashIcon, FameIcon, WellBeingIcon, CalendarIcon, HypeIcon } from './icons/Icons';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StatDisplayProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: 'cash' | 'fame' | 'wellbeing' | 'career' | 'hype';
    maxValue?: number;
    isDate?: boolean;
}

const colorClasses = {
    cash: { 
        text: 'text-status-cash', 
        bg: 'bg-status-cash/10', 
        border: 'border-status-cash/30',
        gradient: 'from-status-cash to-green-400' 
    },
    fame: { 
        text: 'text-status-fame', 
        bg: 'bg-status-fame/10', 
        border: 'border-status-fame/30',
        gradient: 'from-status-fame to-yellow-400' 
    },
    wellbeing: { 
        text: 'text-status-wellbeing', 
        bg: 'bg-status-wellbeing/10', 
        border: 'border-status-wellbeing/30',
        gradient: 'from-status-wellbeing to-blue-400' 
    },
    career: { 
        text: 'text-status-career', 
        bg: 'bg-status-career/10', 
        border: 'border-status-career/30',
        gradient: 'from-status-career to-pink-400' 
    },
    hype: { 
        text: 'text-status-hype', 
        bg: 'bg-status-hype/10', 
        border: 'border-status-hype/30',
        gradient: 'from-status-hype to-status-hype/80' 
    },
};


const StatDisplay: React.FC<StatDisplayProps> = ({ icon, label, value, color, maxValue = 100, isDate = false }) => {
    const classes = colorClasses[color];
    const baseClasses = "card-elevated transition-all duration-200 hover:scale-[1.02]";
    const containerClass = isDate 
        ? `${baseClasses} date-display` 
        : `${baseClasses} ${classes.bg} ${classes.border}`;

    return (
        <div className={containerClass}>
            <div className="flex items-center space-x-2 mb-2">
                <div className={`${classes.text} w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0`}>{icon}</div>
                <span className="font-semibold text-secondary text-xs sm:text-sm md:text-base">{label}</span>
            </div>
            {label === 'Cash' ? (
                 <p className={`text-xs sm:text-lg md:text-xl lg:text-2xl font-bold text-right ${classes.text} break-all`}>
                     ${Number(value).toLocaleString()}
                 </p>
            ) : isDate ? (
                 <p className={`text-xs sm:text-base md:text-lg lg:text-xl font-bold text-right ${classes.text} break-words`}>
                     {value}
                 </p>
            ) : (
                <div>
                    <p className={`text-xs sm:text-lg md:text-xl lg:text-2xl font-bold text-right ${classes.text}`}>
                        {value}/{maxValue}
                    </p>
                    <div className="w-full bg-secondary rounded-full h-1.5 sm:h-2.5 mt-2 overflow-hidden">
                        <div
                            className={`bg-gradient-to-r ${classes.gradient} h-full rounded-full transition-all duration-500 ease-out`}
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
        <div className="current-project mt-3 card">
            <h3 className="text-sm sm:text-lg font-bold text-status-career mb-2">
                Current Project: {project.name}
            </h3>
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-full bg-secondary rounded-full h-3 sm:h-4 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%`}}
                    >
                    </div>
                </div>
                <span className="font-bold text-primary text-xs sm:text-base">
                    {Math.floor(progressPercentage)}%
                </span>
            </div>
            <p className="text-xs sm:text-sm text-muted mt-1">Quality: {project.quality}</p>
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
            <div className="lg:hidden bg-secondary rounded-lg border border-default">
                {isMobileCollapsed ? (
                    <button
                        onClick={() => setIsMobileCollapsed(false)}
                        className="btn-ghost w-full justify-between p-3 rounded-lg"
                    >
                        <div className="flex items-center gap-2">
                            <CashIcon />
                            <span className="text-sm font-bold text-primary">Stats</span>
                            <span className="text-xs text-status-cash">${stats.cash.toLocaleString()}</span>
                            <span className="text-xs text-muted">|</span>
                            <span className="text-xs text-status-fame">Fame: {stats.fame}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-brand-primary" />
                    </button>
                ) : (
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-primary">Player Stats</span>
                            <button
                                onClick={() => setIsMobileCollapsed(true)}
                                className="flex items-center gap-1 text-brand-primary hover:text-brand-secondary text-xs font-medium transition-colors"
                            >
                                <span>Hide</span>
                                <ChevronUp className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="player-stats grid grid-cols-2 gap-2.5">
                            <StatDisplay icon={<CashIcon />} label="Cash" value={stats.cash} color="cash" />
                            <StatDisplay icon={<FameIcon />} label="Fame" value={stats.fame} color="fame" />
                            <StatDisplay icon={<WellBeingIcon />} label="Well-Being" value={stats.wellBeing} color="wellbeing" />
                            <StatDisplay icon={<HypeIcon />} label="Hype" value={stats.hype} color="hype" />
                            <div className="col-span-2">
                                <StatDisplay icon={<CalendarIcon />} label="Date" value={displayDate} color="career" isDate={true} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop: Always visible */}
            <div className="hidden lg:block">
                <div className="player-stats grid grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
                    <StatDisplay icon={<CashIcon />} label="Cash" value={stats.cash} color="cash" />
                    <StatDisplay icon={<FameIcon />} label="Fame" value={stats.fame} color="fame" />
                    <StatDisplay icon={<WellBeingIcon />} label="Well-Being" value={stats.wellBeing} color="wellbeing" />
                    <StatDisplay icon={<HypeIcon />} label="Hype" value={stats.hype} color="hype" />
                    <StatDisplay icon={<CalendarIcon />} label="Date" value={displayDate} color="career" isDate={true} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;