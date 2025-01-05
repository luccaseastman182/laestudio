import { createImageBitmap } from 'canvas'

interface WaveformConfig {
  width: number
  height: number
  resolution: number
  color: string
  backgroundColor: string
  waveColor: string
  progressColor: string
  cursorColor: string
  gridColor: string
  timeScale: number
}

export class WaveformRenderer {
  private readonly canvas: OffscreenCanvas
  private readonly ctx: OffscreenCanvasRenderingContext2D
  private readonly config: WaveformConfig
  private audioData: Float32Array | null = null
  private peakCache: Float32Array | null = null
  private bitmap: ImageBitmap | null = null
  private markers: { time: number; label: string }[] = []
  private regions: { start: number; end: number; label: string }[] = []

  constructor(config: WaveformConfig) {
    this.canvas = new OffscreenCanvas(config.width, config.height)
    this.ctx = this.canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    }) as OffscreenCanvasRenderingContext2D
    this.config = config
  }

  async setAudioData(audioData: Float32Array): Promise<void> {
    this.audioData = audioData
    this.peakCache = this.computePeaks()
    await this.renderWaveform()
  }

  private computePeaks(): Float32Array {
    if (!this.audioData) return new Float32Array(0)

    const peaksLength = Math.ceil(this.config.width * this.config.resolution)
    const sampleSize = Math.floor(this.audioData.length / peaksLength)
    const peaks = new Float32Array(peaksLength)

    for (let i = 0; i < peaksLength; i++) {
      const start = i * sampleSize
      const end = start + sampleSize
      let max = 0

      for (let j = start; j < end; j++) {
        const absolute = Math.abs(this.audioData[j])
        if (absolute > max) max = absolute
      }

      peaks[i] = max
    }

    return peaks
  }

  private async renderWaveform(): Promise<void> {
    if (!this.peakCache) return

    const { width, height } = this.canvas
    const middle = height / 2
    const scaleY = height / 2

    this.ctx.fillStyle = this.config.backgroundColor
    this.ctx.fillRect(0, 0, width, height)

    this.ctx.beginPath()
    this.ctx.strokeStyle = this.config.waveColor
    this.ctx.lineWidth = 1

    const step = width / this.peakCache.length

    for (let i = 0; i < this.peakCache.length; i++) {
      const x = i * step
      const peak = this.peakCache[i] * scaleY

      this.ctx.moveTo(x, middle - peak)
      this.ctx.lineTo(x, middle + peak)
    }

    this.ctx.stroke()
    this.bitmap = await createImageBitmap(this.canvas)
  }

  drawTimeGrid(ctx: CanvasRenderingContext2D, currentTime: number): void {
    const { width, height } = this.canvas
    const timeScale = this.config.timeScale
    const gridSpacing = width / (timeScale * 10)

    ctx.strokeStyle = this.config.gridColor
    ctx.lineWidth = 1
    ctx.beginPath()

    for (let i = 0; i <= timeScale * 10; i++) {
      const x = i * gridSpacing
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }

    ctx.stroke()
  }

  drawMarkers(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.canvas
    ctx.fillStyle = this.config.cursorColor
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'

    this.markers.forEach(marker => {
      const x = (marker.time / 100) * width
      ctx.fillRect(x - 1, 0, 2, height)
      ctx.fillText(marker.label, x, height - 10)
    })
  }

  drawRegions(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.canvas
    ctx.fillStyle = 'rgba(255, 85, 0, 0.3)'

    this.regions.forEach(region => {
      const startX = (region.start / 100) * width
      const endX = (region.end / 100) * width
      ctx.fillRect(startX, 0, endX - startX, height)
    })
  }

  draw(ctx: CanvasRenderingContext2D, currentTime: number, progress: number): void {
    if (!this.bitmap) return

    ctx.drawImage(this.bitmap, 0, 0)
    this.drawTimeGrid(ctx, currentTime)
    this.drawMarkers(ctx)
    this.drawRegions(ctx)

    const x = this.canvas.width * progress
    ctx.strokeStyle = this.config.cursorColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, this.canvas.height)
    ctx.stroke()
  }

  addMarker(time: number, label: string): void {
    this.markers.push({ time, label })
  }

  addRegion(start: number, end: number, label: string): void {
    this.regions.push({ start, end, label })
  }

  destroy(): void {
    this.bitmap?.close()
    this.audioData = null
    this.peakCache = null
    this.markers = []
    this.regions = []
  }
}
