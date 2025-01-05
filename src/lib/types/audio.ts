// Core audio types
export interface AudioEffect {
  id: string
  type: string
  parameters: Record<string, number>
  bypass: boolean
  wetDry: number
}

export interface AudioTrack {
  id: string
  name: string
  audioBuffer: AudioBuffer | null
  volume: number
  pan: number
  solo: boolean
  mute: boolean
  effects: AudioEffect[]
}

export interface AudioRegion {
  id: string
  start: number
  end: number
  trackId: string
}

export interface AudioProcessorConfig {
  sampleRate: number
  bufferSize: number
  channels: number
}

export interface AudioGraphConfig {
  source: AudioBuffer
  effects: AudioEffect[]
  masterGain: GainNode
} 