import React, { useState } from 'react';
import { BookIcon, ChartIcon, QuestionMarkIcon, SaveIcon, BriefcaseIcon, MusicNoteIcon, UserIcon } from './icons/Icons';

export type SidebarView = 'profile' | 'achievements' | 'learning' | 'statistics' | 'tutorial' | 'saveload' | 'audio' | null;

interface SidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  hasUnseenAchievements?: boolean;
  children?: React.ReactNode;
}

interface SidebarButton {
  id: SidebarView;
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
  badge?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, hasUnseenAchievements = false, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const buttons: SidebarButton[] = [
    {
      id: 'profile',
      icon: <UserIcon />,
      label: 'Profile',
      ariaLabel: 'User Profile'
    },
    {
      id: 'achievements',
      icon: <BriefcaseIcon />,
      label: 'Management Hub',
      ariaLabel: 'Show Management Hub',
      badge: hasUnseenAchievements
    },
    {
      id: 'learning',
      icon: <BookIcon />,
      label: 'Learning Hub',
      ariaLabel: 'Learning Hub'
    },
    {
      id: 'statistics',
      icon: <ChartIcon />,
      label: 'Career Analytics',
      ariaLabel: 'Career Statistics'
    },
    {
      id: 'tutorial',
      icon: <QuestionMarkIcon />,
      label: 'Tutorial',
      ariaLabel: 'Tutorial'
    },
    {
      id: 'saveload',
      icon: <SaveIcon />,
      label: 'Save & Load',
      ariaLabel: 'Save/Load Game'
    }
    ,
    {
      id: 'audio',
      icon: <MusicNoteIcon />, 
      label: 'Audio',
      ariaLabel: 'Audio Settings'
    }
  ];

  const handleButtonClick = (id: SidebarView) => {
    if (activeView === id) {
      // Clicking active button closes the panel
      onViewChange(null);
      setIsExpanded(false);
    } else {
      // Clicking new button opens that panel
      onViewChange(id);
      setIsExpanded(true);
    }
  };

  return (
    // Increased z-index so the sidebar controls sit above the app header
    <div className={`fixed right-0 top-0 h-full z-60 flex transition-transform ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Icon Bar */}
  <div className="bg-gray-800/95 backdrop-blur-sm border-l border-gray-700 w-16 flex flex-col items-center py-4 gap-4 shadow-xl">
        {/* Sidebar visibility toggle */}
        <button
          onClick={() => setIsVisible(v => !v)}
          className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          aria-label={isVisible ? 'Collapse sidebar' : 'Open sidebar'}
          title={isVisible ? 'Collapse' : 'Open'}
        >
          <svg className={`w-5 h-5 transition-transform ${isVisible ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button.id)}
            className={`
              relative p-3 rounded-lg transition-all duration-200 group
              ${activeView === button.id
                ? 'bg-violet-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }
            `}
            aria-label={button.ariaLabel}
            title={button.label}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {button.icon}
            </div>

            {/* Badge for unseen achievements */}
            {button.badge && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}

            {/* Hover tooltip - hidden on mobile */}
            <div className="
              hidden lg:block
              absolute left-[-8px] top-1/2 -translate-y-1/2 -translate-x-full
              bg-gray-900 text-white text-sm px-3 py-2 rounded-lg
              whitespace-nowrap opacity-0 group-hover:opacity-100
              pointer-events-none transition-opacity duration-200
              shadow-lg
            ">
              {button.label}
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
            </div>
          </button>
        ))}
        {/* Spacer to push any future controls toward center */}
        <div className="flex-1" />
      </div>

      {/* Expanded Panel */}
      <div
        className={`
          bg-gray-800/98 backdrop-blur-md border-l border-gray-700
          transition-all duration-300 ease-in-out
          ${isExpanded && activeView ? 'w-[28rem]' : 'w-0'}
          overflow-hidden shadow-2xl
        `}
        style={{ willChange: 'width' }}
      >
        {activeView && isExpanded && (
          <div className="w-96 h-full flex flex-col p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-violet-300">
                {buttons.find(b => b.id === activeView)?.label}
              </h2>
              <button
                onClick={() => {
                  onViewChange(null);
                  setIsExpanded(false);
                }}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                aria-label="Close panel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
