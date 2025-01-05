// New file for AudioWorklet processing
export function useAudioWorklet(processorName: string, processorUrl: string) {
  const audioContext = new AudioContext()
  
  return async () => {
    try {
      await audioContext.audioWorklet.addModule(processorUrl)
      return new AudioWorkletNode(audioContext, processorName)
    } catch (error) {
      console.error('Error loading audio worklet:', error)
      return null
    }
  }
} 