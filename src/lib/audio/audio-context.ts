import { createContext } from 'react'

interface AudioContextState {
  audioContext: AudioContext
  masterGainNode: GainNode
  analyserNode: AnalyserNode
}

export const AudioContext = createContext<AudioContextState | null>(null)

export function createAudioContext(): AudioContextState {
  const audioContext = new AudioContext()
  const masterGainNode = audioContext.createGain()
  const analyserNode = audioContext.createAnalyser()

  masterGainNode.connect(analyserNode)
  analyserNode.connect(audioContext.destination)

  return {
    audioContext,
    masterGainNode,
    analyserNode,
  }
} 