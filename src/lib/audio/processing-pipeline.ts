import { nanoid } from 'nanoid'

interface ProcessingNode {
  id: string
  process: (input: Float32Array) => Float32Array
  bypass: boolean
}

export class ProcessingPipeline {
  private nodes: ProcessingNode[] = []
  private bufferSize: number
  private sampleRate: number

  constructor(bufferSize = 2048, sampleRate = 44100) {
    this.bufferSize = bufferSize
    this.sampleRate = sampleRate
  }

  addNode(processor: (input: Float32Array) => Float32Array): string {
    const id = nanoid()
    this.nodes.push({
      id,
      process: processor,
      bypass: false
    })
    return id
  }

  removeNode(id: string) {
    this.nodes = this.nodes.filter(node => node.id !== id)
  }

  toggleBypass(id: string) {
    const node = this.nodes.find(n => n.id === id)
    if (node) {
      node.bypass = !node.bypass
    }
  }

  process(inputBuffer: Float32Array): Float32Array {
    return this.nodes.reduce((audio, node) => {
      if (node.bypass) return audio
      return node.process(audio)
    }, inputBuffer)
  }

  async processStream(
    stream: ReadableStream<Float32Array>
  ): Promise<ReadableStream<Float32Array>> {
    return stream.pipeThrough(
      new TransformStream({
        transform: (chunk, controller) => {
          const processed = this.process(chunk)
          controller.enqueue(processed)
        }
      })
    )
  }
}
