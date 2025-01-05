import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools, persist } from 'zustand/middleware'

interface Track {
  id: string
  name: string
  audioBuffer: AudioBuffer | null
  volume: number
  pan: number
  solo: boolean
  mute: boolean
  effects: AudioEffect[]
}

interface AudioState {
  tracks: Map<string, Track>
  activeTrackId: string | null
  isPlaying: boolean
  currentTime: number
  masterVolume: number
  masterPan: number
  effectsChain: AudioEffect[]
  regions: Map<string, { start: number; end: number }>
  history: Array<{ tracks: Map<string, Track>; timestamp: number }>
  historyIndex: number
}

interface AudioActions {
  addTrack: (track: Track) => void
  removeTrack: (id: string) => void
  setTrackVolume: (id: string, volume: number) => void
  setTrackPan: (id: string, pan: number) => void
  toggleTrackSolo: (id: string) => void
  toggleTrackMute: (id: string) => void
  setActiveTrack: (id: string | null) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentTime: (time: number) => void
  setMasterVolume: (volume: number) => void
  setMasterPan: (pan: number) => void
  addRegion: (id: string, start: number, end: number) => void
  removeRegion: (id: string) => void
  undo: () => void
  redo: () => void
}

export const useAudioStore = create<AudioState & AudioActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        tracks: new Map(),
        activeTrackId: null,
        isPlaying: false,
        currentTime: 0,
        masterVolume: 1,
        masterPan: 0,
        effectsChain: [],
        regions: new Map(),
        history: [],
        historyIndex: -1,

        addTrack: (track) =>
          set((state) => {
            state.tracks.set(track.id, track)
            state.history.push({
              tracks: new Map(state.tracks),
              timestamp: Date.now(),
            })
            state.historyIndex++
          }),

        removeTrack: (id) =>
          set((state) => {
            state.tracks.delete(id)
            if (state.activeTrackId === id) {
              state.activeTrackId = null
            }
            state.history.push({
              tracks: new Map(state.tracks),
              timestamp: Date.now(),
            })
            state.historyIndex++
          }),

        setTrackVolume: (id, volume) =>
          set((state) => {
            const track = state.tracks.get(id)
            if (track) {
              track.volume = volume
            }
          }),

        setTrackPan: (id, pan) =>
          set((state) => {
            const track = state.tracks.get(id)
            if (track) {
              track.pan = pan
            }
          }),

        toggleTrackSolo: (id) =>
          set((state) => {
            const track = state.tracks.get(id)
            if (track) {
              track.solo = !track.solo
            }
          }),

        toggleTrackMute: (id) =>
          set((state) => {
            const track = state.tracks.get(id)
            if (track) {
              track.mute = !track.mute
            }
          }),

        setActiveTrack: (id) => set({ activeTrackId: id }),
        setIsPlaying: (isPlaying) => set({ isPlaying }),
        setCurrentTime: (time) => set({ currentTime: time }),
        setMasterVolume: (volume) => set({ masterVolume: volume }),
        setMasterPan: (pan) => set({ masterPan: pan }),

        addRegion: (id, start, end) =>
          set((state) => {
            state.regions.set(id, { start, end })
          }),

        removeRegion: (id) =>
          set((state) => {
            state.regions.delete(id)
          }),

        undo: () =>
          set((state) => {
            if (state.historyIndex > 0) {
              state.historyIndex--
              state.tracks = new Map(
                state.history[state.historyIndex].tracks
              )
            }
          }),

        redo: () =>
          set((state) => {
            if (state.historyIndex < state.history.length - 1) {
              state.historyIndex++
              state.tracks = new Map(
                state.history[state.historyIndex].tracks
              )
            }
          }),
      })),
      {
        name: 'audio-store',
        partialize: (state) => ({
          masterVolume: state.masterVolume,
          masterPan: state.masterPan,
        }),
      }
    )
  )
)
