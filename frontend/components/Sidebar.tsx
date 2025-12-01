import React, { useState, useEffect } from 'react';
import { BookIcon, ChartIcon, QuestionMarkIcon, SaveIcon, BriefcaseIcon, MusicNoteIcon, UserIcon } from './icons/Icons';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X, Music } from 'lucide-react';
import type { Difficulty } from '../types';
import { getDifficultyColor, getDifficultyIcon } from '../data/difficultySettings';

export type SidebarView = 'profile' | 'achievements' | 'learning' | 'statistics' | 'tutorial' | 'saveload' | 'audio' | null;

interface SidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  hasUnseenAchievements?: boolean;
  children?: React.ReactNode;
  isMobileOpen?: boolean;
  onMobileToggle?: (open: boolean) => void;
  artistName?: string;
  difficulty?: Difficulty;
}

interface SidebarButton {
  id: SidebarView;
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
  badge?: boolean;
  shortcut?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, hasUnseenAchievements = false, children, isMobileOpen = false, onMobileToggle, artistName, difficulty }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      if (sidebar && !sidebar.contains(e.target as Node) && !menuButton?.contains(e.target as Node)) {
        onMobileToggle?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen, onMobileToggle]);

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
      ariaLabel: 'Save/Load Game',
      shortcut: 'Ctrl+S'
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
      // Also close mobile sidebar on mobile when closing the panel
      if (window.innerWidth < 1024) {
        onMobileToggle?.(false);
      }
    } else {
      // Clicking new button opens that panel
      onViewChange(id);
      setIsExpanded(true);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => onMobileToggle?.(false)}
        />
      )}

      {/* Sidebar - Compact width on mobile, always visible on desktop */}
      <div
        id="mobile-sidebar"
        className={`
          fixed right-0 top-16 bottom-0 z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Icon Bar and Expanded Panel Container */}
        <div className="flex flex-row flex-1 overflow-hidden">
        {/* Compact Sidebar with Icons + Labels on mobile, Icon-only on desktop */}
        <div className="bg-[#2D1115]/95 backdrop-blur-sm border-l border-[#3D1820] w-40 sm:w-44 lg:w-16 flex flex-col py-4 gap-2 shadow-xl overflow-y-auto">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button.id)}
            className={`
              relative px-2 py-2 lg:p-3 rounded-lg transition-all duration-200 group
              flex lg:justify-center items-center gap-2 lg:gap-0 mx-1 lg:mx-0
              ${activeView === button.id
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#3D1820]'
              }
            `}
            aria-label={button.ariaLabel}
            title={button.label}
          >
            <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center flex-shrink-0">
              {button.icon}
            </div>

            {/* Label text - visible on mobile, hidden on desktop */}
            <span className="lg:hidden text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {button.label}
            </span>

            {/* Badge for unseen achievements */}
            {button.badge && (
              <span className="absolute top-1 right-1 lg:-top-1 lg:-right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}

            {/* Hover tooltip - hidden on mobile, visible on desktop hover */}
            <div className="
              hidden lg:block
              absolute left-[-8px] top-1/2 -translate-y-1/2 -translate-x-full
              bg-[#1A0A0F] text-white text-sm px-3 py-2 rounded-lg
              whitespace-nowrap opacity-0 group-hover:opacity-100
              pointer-events-none transition-opacity duration-200
              shadow-lg
            ">
              <div className="flex items-center gap-2">
                <span>{button.label}</span>
                {button.shortcut && (
                  <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded font-mono text-gray-300">
                    {button.shortcut}
                  </span>
                )}
              </div>
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[#1A0A0F]"></div>
            </div>
          </button>
        ))}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="px-2 py-2 lg:p-3 rounded-lg transition-all duration-200 group text-gray-400 hover:text-white hover:bg-[#3D1820] flex lg:justify-center items-center gap-2 lg:gap-0 mx-1 lg:mx-0"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center flex-shrink-0">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>

          {/* Label text - visible on mobile, hidden on desktop */}
          <span className="lg:hidden text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>

          {/* Hover tooltip - hidden on mobile, visible on desktop */}
          <div className="
            hidden lg:block
            absolute left-[-8px] top-1/2 -translate-y-1/2 -translate-x-full
            bg-[#1A0A0F] text-white text-sm px-3 py-2 rounded-lg
            whitespace-nowrap opacity-0 group-hover:opacity-100
            pointer-events-none transition-opacity duration-200
            shadow-lg
          ">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[#1A0A0F]"></div>
          </div>
        </button>

        {/* Spacer to push shortcuts button to bottom */}
        <div className="flex-1" />

        {/* Keyboard Shortcuts Button */}
        <button
          onClick={() => setShowShortcutsModal(true)}
          className="px-2 py-2 lg:p-3 rounded-lg transition-all duration-200 group text-gray-400 hover:text-white hover:bg-[#3D1820] flex lg:justify-center items-center gap-2 lg:gap-0 mx-1 lg:mx-0"
          aria-label="View keyboard shortcuts"
          title="Keyboard Shortcuts"
        >
          <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>

          {/* Label text - visible on mobile, hidden on desktop */}
          <span className="lg:hidden text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            Shortcuts
          </span>

          {/* Hover tooltip - hidden on mobile, visible on desktop */}
          <div className="
            hidden lg:block
            absolute left-[-8px] top-1/2 -translate-y-1/2 -translate-x-full
            bg-[#1A0A0F] text-white text-sm px-3 py-2 rounded-lg
            whitespace-nowrap opacity-0 group-hover:opacity-100
            pointer-events-none transition-opacity duration-200
            shadow-lg
          ">
            Keyboard Shortcuts
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[#1A0A0F]"></div>
          </div>
        </button>
      </div>

      {/* Expanded Panel */}
      <div
        className={`
          bg-[#2D1115]/98 backdrop-blur-md border-l border-[#3D1820]
          transition-all duration-300 ease-in-out
          ${isExpanded && activeView ? 'w-[calc(100vw-10rem)] sm:w-80 md:w-96 lg:w-[26rem]' : 'w-0'}
          overflow-hidden shadow-2xl
        `}
        style={{ willChange: 'width' }}
      >
        {activeView && isExpanded && (
          <div className="w-full h-full flex flex-col p-3 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-red-300">
                {buttons.find(b => b.id === activeView)?.label}
              </h2>
              <button
                onClick={() => {
                  onViewChange(null);
                  setIsExpanded(false);
                  // Also close mobile sidebar when closing panel on mobile
                  if (window.innerWidth < 1024) {
                    onMobileToggle?.(false);
                  }
                }}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#3D1820] rounded-lg"
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
    </div>

    {/* Keyboard Shortcuts Modal */}
    {showShortcutsModal && (
      <>
        <div 
          className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" 
          onClick={() => setShowShortcutsModal(false)}
        />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2D1115] border border-[#4D1F2A] rounded-lg shadow-2xl p-4 min-w-[300px] z-[70]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-base">⌨️ Keyboard Shortcuts</h3>
            <button 
              onClick={() => setShowShortcutsModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-300">Quick Save</span>
              <kbd className="bg-[#4D1F2A] px-3 py-1.5 rounded font-mono text-gray-200 border border-[#5D2F3A]">Ctrl+S</kbd>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-300">Close Modals/Panels</span>
              <kbd className="bg-[#4D1F2A] px-3 py-1.5 rounded font-mono text-gray-200 border border-[#5D2F3A]">Esc</kbd>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#4D1F2A] text-xs text-gray-400 text-center">
            Game auto-saves every 5 minutes & when closing
          </div>
        </div>
      </>
    )}
    </>
  );
};

export default Sidebar;
