import React, { useEffect } from 'react';

type KeyboardShortcutsProps = {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onUndo: () => void;
  onRedo: () => void;
};

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onPlay, onPause, onStop, onUndo, onRedo }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          onPlay();
          break;
        case 'p':
          event.preventDefault();
          onPause();
          break;
        case 's':
          event.preventDefault();
          onStop();
          break;
        case 'z':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onUndo();
          }
          break;
        case 'y':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onRedo();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPlay, onPause, onStop, onUndo, onRedo]);

  return null;
};

export default KeyboardShortcuts;
