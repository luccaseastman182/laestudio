import { useAudio } from '@/providers/audio-provider'
import { useAudioStore } from '@/lib/store/audio-store'
import { useCallback, useRef } from 'react'
import { createAudioGraph } from '@/lib/audio/audio-graph'
import type { AudioGraph } from '@/lib/audio/audio-graph'

export function useAudioProcessor() {
  const { audioContext, masterGainNode } = useAudio()
  const { volume, pan, effectsChain } = useAudioStore()
  const audioGraphRef = useRef<AudioGraph>()

  const processAudio = useCallback(
    async (audioData: ArrayBuffer) => {
      try {
        const audioBuffer = await audioContext.decodeAudioData(audioData)
        
        // Create or update audio graph
        if (!audioGraphRef.current) {
          audioGraphRef.current = createAudioGraph(audioContext, {
            source: audioBuffer,
            effects: effectsChain,
            masterGain: masterGainNode
          })
        }

        // Configure real-time parameters
        const panNode = audioGraphRef.current.getPanNode()
        const gainNode = audioGraphRef.current.getGainNode()
        
        if (panNode) panNode.pan.value = pan
        if (gainNode) gainNode.gain.value = volume

        // Connect effect chain if present
        if (effectsChain.length > 0) {
          audioGraphRef.current.connectEffects(effectsChain)
        }

        return audioGraphRef.current.getSource()
      } catch (error) {
        console.error('Error processing audio:', error)
        return null
      }
    },
    [audioContext, masterGainNode, pan, volume, effectsChain]
  )

  const stopProcessing = useCallback(() => {
    if (audioGraphRef.current) {
      audioGraphRef.current.disconnect()
      audioGraphRef.current = undefined
    }
  }, [])

  return { 
    processAudio,
    stopProcessing,
    getAudioGraph: () => audioGraphRef.current
  }
}
