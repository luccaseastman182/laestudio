export class FFT {
  private readonly size: number
  private readonly cosTable: Float32Array
  private readonly sinTable: Float32Array
  private readonly reverseBits: Uint32Array

  constructor(size: number) {
    this.size = size
    this.cosTable = new Float32Array(size / 2)
    this.sinTable = new Float32Array(size / 2)
    this.reverseBits = new Uint32Array(size)

    // Precompute twiddle factors
    for (let i = 0; i < size / 2; i++) {
      const angle = (-2 * Math.PI * i) / size
      this.cosTable[i] = Math.cos(angle)
      this.sinTable[i] = Math.sin(angle)
    }

    // Precompute bit reversal table
    for (let i = 0; i < size; i++) {
      this.reverseBits[i] = this.reverseBitsFor(i, Math.log2(size))
    }
  }

  private reverseBitsFor(x: number, bits: number): number {
    let y = 0
    for (let i = 0; i < bits; i++) {
      y = (y << 1) | (x & 1)
      x >>= 1
    }
    return y
  }

  transform(real: Float32Array, imag: Float32Array, inverse = false): void {
    const n = this.size

    // Bit reversal
    for (let i = 0; i < n; i++) {
      const j = this.reverseBits[i]
      if (j > i) {
        [real[i], real[j]] = [real[j], real[i]]
        [imag[i], imag[j]] = [imag[j], imag[i]]
      }
    }

    // Cooley-Tukey FFT
    for (let size = 2; size <= n; size *= 2) {
      const halfsize = size / 2
      const tablestep = n / size

      for (let i = 0; i < n; i += size) {
        for (let j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
          const tpre = real[j + halfsize] * this.cosTable[k] + 
                      imag[j + halfsize] * this.sinTable[k]
          const tpim = -real[j + halfsize] * this.sinTable[k] + 
                      imag[j + halfsize] * this.cosTable[k]

          real[j + halfsize] = real[j] - tpre
          imag[j + halfsize] = imag[j] - tpim
          real[j] += tpre
          imag[j] += tpim
        }
      }
    }

    // Scaling for inverse transform
    if (inverse) {
      for (let i = 0; i < n; i++) {
        real[i] /= n
        imag[i] /= n
      }
    }
  }
} 