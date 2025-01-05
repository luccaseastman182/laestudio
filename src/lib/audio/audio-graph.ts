import type { AudioGraphConfig } from '@/lib/types/audio'

export class AudioGraph {
  private readonly context: AudioContext
  private readonly source: AudioBufferSourceNode
  private readonly gainNode: GainNode
  private readonly panNode: StereoPannerNode
  private effectNodes: AudioNode[]

  constructor(context: AudioContext, config: AudioGraphConfig) {
    this.context = context
    this.effectNodes = []

    // Create nodes
    this.source = context.createBufferSource()
    this.source.buffer = config.source
    
    this.gainNode = context.createGain()
    this.panNode = context.createStereoPanner()

    // Create initial connection chain
    this.source
      .connect(this.panNode)
      .connect(this.gainNode)
      .connect(config.masterGain)
  }

  getPanNode(): StereoPannerNode {
    return this.panNode
  }

  getGainNode(): GainNode {
    return this.gainNode
  }

  getSource(): AudioBufferSourceNode {
    return this.source
  }

  connectEffects(effects: AudioNode[]): void {
    // Disconnect existing effects
    this.disconnect()

    // Create new effect chain
    this.effectNodes = effects
    if (effects.length === 0) {
      this.source
        .connect(this.panNode)
        .connect(this.gainNode)
        .connect(this.context.destination)
      return
    }

    // Connect source to first effect
    this.source.connect(effects[0])

    // Connect effects in chain
    for (let i = 0; i < effects.length - 1; i++) {
      effects[i].connect(effects[i + 1])
    }

    // Connect last effect to output chain
    effects[effects.length - 1]
      .connect(this.panNode)
      .connect(this.gainNode)
      .connect(this.context.destination)
  }

  disconnect(): void {
    this.source.disconnect()
    this.effectNodes.forEach(node => node.disconnect())
    this.panNode.disconnect()
    this.gainNode.disconnect()
  }

  addEffectNode(node: AudioNode): void {
    this.effectNodes.push(node)
    this.reconnectChain()
  }

  removeEffectNode(node: AudioNode): void {
    this.effectNodes = this.effectNodes.filter(effectNode => effectNode !== node)
    this.reconnectChain()
  }

  private reconnectChain(): void {
    this.disconnect()
    this.connectEffects(this.effectNodes)
  }

  updateEffectNode(oldNode: AudioNode, newNode: AudioNode): void {
    const index = this.effectNodes.indexOf(oldNode)
    if (index !== -1) {
      this.effectNodes[index] = newNode
      this.reconnectChain()
    }
  }
}

export function createAudioGraph(
  context: AudioContext,
  config: AudioGraphConfig
): AudioGraph {
  return new AudioGraph(context, config)
}
