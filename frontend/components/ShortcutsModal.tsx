import React from 'react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string;
  description: string;
  category: string;
}

const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts: Shortcut[] = [
    { keys: 'Ctrl + S', description: 'Quick Save', category: 'Game' },
    { keys: 'Ctrl + L', description: 'Open Save & Load', category: 'Navigation' },
    { keys: 'Ctrl + P', description: 'Open Profile', category: 'Navigation' },
    { keys: 'Ctrl + M', description: 'Open Management Hub', category: 'Navigation' },
    { keys: 'Ctrl + H', description: 'Open Learning Hub', category: 'Navigation' },
    { keys: 'Ctrl + T', description: 'Open Tutorial', category: 'Navigation' },
    { keys: 'Ctrl + A', description: 'Open Audio Settings', category: 'Navigation' },
    { keys: 'Ctrl + K', description: 'Open Career Analytics', category: 'Navigation' },
    { keys: 'Space', description: 'Advance Time (1 week)', category: 'Game' },
    { keys: 'Escape', description: 'Close modals/panels', category: 'General' },
    { keys: '?', description: 'Show Keyboard Shortcuts', category: 'General' },
  ];

  const categories = ['Game', 'Navigation', 'General'];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-[#2D1115] to-[#1A0A0F] border-2 border-[#4D1F2A] rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/30 to-rose-800/30 border-b border-[#4D1F2A] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Keyboard Shortcuts
            </h2>
            <p className="text-gray-400 text-sm mt-1">Master these shortcuts to play like a pro</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#3D1820] rounded-lg"
            aria-label="Close shortcuts modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {categories.map((category) => {
            const categoryShortcuts = shortcuts.filter(s => s.category === category);
            if (categoryShortcuts.length === 0) return null;

            return (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2">
                  {category === 'Game' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {category === 'Navigation' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  )}
                  {category === 'General' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#1A0A0F]/50 border border-[#3D1820] rounded-lg p-3 hover:bg-[#1A0A0F]/70 transition-colors group"
                    >
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {shortcut.description}
                      </span>
                      <kbd className="px-3 py-1.5 bg-gradient-to-br from-[#3D1820] to-[#2D1115] border border-[#4D1F2A] rounded text-red-300 font-mono text-sm shadow-lg group-hover:border-red-500 transition-colors whitespace-nowrap">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-red-900/20 to-rose-800/20 border-t border-[#4D1F2A] p-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/20"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
