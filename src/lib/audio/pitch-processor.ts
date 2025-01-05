export class PitchProcessor extends AudioWorkletProcessor {
  private static readonly BUFFER_SIZE = 2048
  private static readonly HOP_SIZE = 512
  private static readonly MIN_FREQ = 50
  private static readonly MAX_FREQ = 1000

  private inputBuffer: Float32Array[]
  private outputBuffer: Float32Array[]
  private phase: number
  private lastPitch: number

  constructor() {
    super()
    this.inputBuffer = []
    this.outputBuffer = []
    this.phase = 0
    this.lastPitch = 0
  }

  static get parameterDescriptors(): AudioParamDescriptor[] {
    return [
      {
        name: 'correction',
        defaultValue: 1.0,
        minValue: 0,
        maxValue: 1
      },
      {
        name: 'scale',
        defaultValue: 0, // 0 = chromatic
        minValue: 0,
        maxValue: 11
      }
    ]
  }

  private detectPitch(buffer: Float32Array): number {
    const correlations = new Float32Array(PitchProcessor.BUFFER_SIZE)
    
    // Autocorrelation
    for (let lag = 0; lag < PitchProcessor.BUFFER_SIZE; lag++) {
      let sum = 0
      for (let i = 0; i < PitchProcessor.BUFFER_SIZE - lag; i++) {
        sum += buffer[i] * buffer[i + lag]
      }
      correlations[lag] = sum
    }

    // Find peaks
    let maxCorrelation = 0
    let foundPitch = 0
    
    for (let i = Math.floor(sampleRate / PitchProcessor.MAX_FREQ);
         i < Math.floor(sampleRate / PitchProcessor.MIN_FREQ);
         i++) {
      if (correlations[i] > maxCorrelation) {
        maxCorrelation = correlations[i]
        foundPitch = sampleRate / i
      }
    }

    return foundPitch
  }

  private correctPitch(pitch: number, scale: number): number {
    const semitone = 12 * Math.log2(pitch / 440)
    const roundedSemitone = Math.round(semitone)
    
    if (scale === 0) { // Chromatic
      return 440 * Math.pow(2, roundedSemitone / 12)
    }

    // Scale-based correction
    const scaleNotes = MUSICAL_SCALES[scale]
    const octave = Math.floor(roundedSemitone / 12)
    const note = roundedSemitone % 12
    const correctedNote = scaleNotes.includes(note) ? note :
      scaleNotes.reduce((prev, curr) => 
        Math.abs(curr - note) < Math.abs(prev - note) ? curr : prev
      )

    return 440 * Math.pow(2, (octave * 12 + correctedNote) / 12)
  }

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean {
    const input = inputs[0][0]
    const output = outputs[0][0]
    
    if (!input || !output) return true

    // Buffer management
    this.inputBuffer.push(new Float32Array(input))
    
    while (this.inputBuffer.length >= PitchProcessor.BUFFER_SIZE) {
      const buffer = new Float32Array(PitchProcessor.BUFFER_SIZE)
      for (let i = 0; i < PitchProcessor.BUFFER_SIZE; i++) {
        buffer[i] = this.inputBuffer[0][i]
      }
      this.inputBuffer.shift()

      // Pitch detection and correction
      const detectedPitch = this.detectPitch(buffer)
      const correctedPitch = this.correctPitch(
        detectedPitch,
        parameters.scale[0]
      )
      
      // Apply correction
      const pitchRatio = correctedPitch / detectedPitch
      const correctionAmount = parameters.correction[0]
      const finalRatio = 1 + (pitchRatio - 1) * correctionAmount

      // Phase vocoder processing
      const processed = this.processFrame(buffer, finalRatio)
      this.outputBuffer.push(processed)
    }

    // Output
    if (this.outputBuffer.length > 0) {
      const outputFrame = this.outputBuffer.shift()
      for (let i = 0; i < output.length; i++) {
        output[i] = outputFrame![i % outputFrame!.length]
      }
    }

    return true
  }

  private processFrame(frame: Float32Array, pitchRatio: number): Float32Array {
    const output = new Float32Array(frame.length)
    const phaseIncrement = 2 * Math.PI * pitchRatio
    
    for (let i = 0; i < frame.length; i++) {
      this.phase += phaseIncrement
      output[i] = Math.sin(this.phase) * frame[i]
    }
    
    // Normalize phase
    this.phase = this.phase % (2 * Math.PI)
    
    return output
  }
}

registerProcessor('pitch-processor', PitchProcessor) 
