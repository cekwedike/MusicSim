import { useEffect, useRef } from 'react';

interface KeyboardShortcutConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  handler: () => void;
  description?: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcutConfig[]) => {
  // Store shortcuts in ref to avoid recreating listener on every render
  const shortcutsRef = useRef(shortcuts);
  
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Guard against undefined key (some browsers/scenarios)
      if (!event.key) return;
      
      for (const shortcut of shortcutsRef.current) {
        const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === event.ctrlKey || shortcut.ctrl === event.metaKey;
        const altMatch = shortcut.alt === undefined || shortcut.alt === event.altKey;
        const shiftMatch = shortcut.shift === undefined || shortcut.shift === event.shiftKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
          // Always prevent default for modifier key combinations to avoid browser shortcuts
          if (shortcut.ctrl || shortcut.alt || shortcut.shift) {
            event.preventDefault();
          }
          shortcut.handler();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
