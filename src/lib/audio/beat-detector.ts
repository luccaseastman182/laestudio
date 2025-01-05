import { FFT } from './fft'

interface BeatDetectionConfig {
  sampleRate: number
  bufferSize: number
  minTempo: number
  maxTempo: number
  energyThreshold: number
  decayRate: number
}

export class BeatDetector {
  private readonly fft: FFT
  private readonly config: BeatDetectionConfig
  private readonly energyHistory: Float32Array
  private readonly tempoBuffer: Float32Array
  private readonly spectralFlux: Float32Array
  private energyIndex: number = 0
  private lastEnergy: number = 0

  constructor(config: BeatDetectionConfig) {
    this.config = config
    this.fft = new FFT(config.bufferSize)
    this.energyHistory = new Float32Array(config.bufferSize)
    this.tempoBuffer = new Float32Array(config.bufferSize)
    this.spectralFlux = new Float32Array(config.bufferSize / 2)
  }

  detectBeat(audioData: Float32Array): {
    isBeat: boolean
    tempo: number
    energy: number
    confidence: number
  } {
    const real = new Float32Array(this.config.bufferSize)
    const imag = new Float32Array(this.config.bufferSize)

    // Copy audio data and apply Hann window
    for (let i = 0; i < this.config.bufferSize; i++) {
      real[i] = audioData[i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / this.config.bufferSize))
    }

    // Perform FFT
    this.fft.transform(real, imag)

    // Calculate spectral flux
    let currentEnergy = 0
    for (let i = 0; i < this.config.bufferSize / 2; i++) {
      const magnitude = Math.sqrt(real[i] * real[i] + imag[i] * imag[i])
      const flux = Math.max(0, magnitude - this.spectralFlux[i])
      currentEnergy += flux
      this.spectralFlux[i] = magnitude
    }

    // Update energy history
    this.energyHistory[this.energyIndex] = currentEnergy
    this.energyIndex = (this.energyIndex + 1) % this.config.bufferSize

    // Calculate local energy average
    let averageEnergy = 0
    for (let i = 0; i < this.config.bufferSize; i++) {
      averageEnergy += this.energyHistory[i]
    }
    averageEnergy /= this.config.bufferSize

    // Detect beat using adaptive threshold
    const isBeat = currentEnergy > averageEnergy * this.config.energyThreshold &&
                  currentEnergy > this.lastEnergy

    // Calculate tempo using autocorrelation
    let tempo = 0
    let confidence = 0

    if (isBeat) {
      const correlation = this.calculateAutoCorrelation()
      const { bpm, beatConfidence } = this.findTempo(correlation)
      tempo = bpm
      confidence = beatConfidence
    }

    this.lastEnergy = currentEnergy * this.config.decayRate

    return {
      isBeat,
      tempo,
      energy: currentEnergy,
      confidence
    }
  }

  private calculateAutoCorrelation(): Float32Array {
    const correlation = new Float32Array(this.config.bufferSize)
    
    for (let lag = 0; lag < this.config.bufferSize; lag++) {
      let sum = 0
      for (let i = 0; i < this.config.bufferSize - lag; i++) {
        sum += this.energyHistory[i] * this.energyHistory[i + lag]
      }
      correlation[lag] = sum
    }

    return correlation
  }

  private findTempo(correlation: Float32Array): { bpm: number; beatConfidence: number } {
    const minPeriod = Math.floor(60 * this.config.sampleRate / 
                                (this.config.bufferSize * this.config.maxTempo))
    const maxPeriod = Math.ceil(60 * this.config.sampleRate / 
                               (this.config.bufferSize * this.config.minTempo))

    let maxCorrelation = 0
    let period = 0

    for (let i = minPeriod; i <= maxPeriod; i++) {
      if (correlation[i] > maxCorrelation) {
        maxCorrelation = correlation[i]
        period = i
      }
    }

    const bpm = 60 * this.config.sampleRate / (this.config.bufferSize * period)
    const beatConfidence = maxCorrelation / correlation[0]

    return { bpm, beatConfidence }
  }
} 