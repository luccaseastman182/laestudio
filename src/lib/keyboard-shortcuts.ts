import { useEffect } from 'react'
import { useAudioStore } from './store/audio-store'

type ShortcutAction = 
  | 'play'
  | 'stop'
  | 'record'
  | 'undo'
  | 'redo'
  | 'delete'
  | 'save'
  | 'load'
  | 'zoomIn'
  | 'zoomOut'
  | 'nextTrack'
  | 'prevTrack'

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: ShortcutAction
}

const DEFAULT_SHORTCUTS: ShortcutConfig[] = [
  { key: ' ', action: 'play' },
  { key: 'Escape', action: 'stop' },
  { key: 'r', action: 'record' },
  { key: 'z', ctrl: true, action: 'undo' },
  { key: 'z', ctrl: true, shift: true, action: 'redo' },
  { key: 'Delete', action: 'delete' },
  { key: 's', ctrl: true, action: 'save' },
  { key: 'o', ctrl: true, action: 'load' },
  { key: '=', ctrl: true, action: 'zoomIn' },
  { key: '-', ctrl: true, action: 'zoomOut' },
  { key: 'Tab', action: 'nextTrack' },
  { key: 'Tab', shift: true, action: 'prevTrack' },
]

export function useKeyboardShortcuts() {
  const {
    isPlaying,
    setIsPlaying,
    undo,
    redo,
    activeTrackId,
    tracks,
    setActiveTrack,
  } = useAudioStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return
      }

      const matchingShortcut = DEFAULT_SHORTCUTS.find(shortcut => 
        shortcut.key === event.key &&
        !!shortcut.ctrl === event.ctrlKey &&
        !!shortcut.shift === event.shiftKey &&
        !!shortcut.alt === event.altKey
      )

      if (!matchingShortcut) return

      event.preventDefault()

      switch (matchingShortcut.action) {
        case 'play':
          setIsPlaying(!isPlaying)
          break
        case 'stop':
          setIsPlaying(false)
          break
        case 'undo':
          undo()
          break
        case 'redo':
          redo()
          break
        case 'nextTrack':
          if (activeTrackId) {
            const trackIds = Array.from(tracks.keys())
            const currentIndex = trackIds.indexOf(activeTrackId)
            const nextIndex = (currentIndex + 1) % trackIds.length
            setActiveTrack(trackIds[nextIndex])
          }
          break
        case 'prevTrack':
          if (activeTrackId) {
            const trackIds = Array.from(tracks.keys())
            const currentIndex = trackIds.indexOf(activeTrackId)
            const prevIndex = (currentIndex - 1 + trackIds.length) % trackIds.length
            setActiveTrack(trackIds[prevIndex])
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, setIsPlaying, undo, redo, activeTrackId, tracks, setActiveTrack])
} 