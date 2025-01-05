import { AudioNode, GainNode } from 'web-audio-api'

export interface AudioEffect {
  id: string
  type: 'compressor' | 'equalizer' | 'reverb' | 'delay' | 'chorus' | 'flanger'
  node: AudioNode
  params: { [key: string]: number }
  bypass: boolean
}

export interface EffectChainConfig {
  effects: AudioEffect[]
  inputNode: AudioNode
  outputNode: GainNode
}

export class EffectChain {
  private effects: AudioEffect[]
  private inputNode: AudioNode
  private outputNode: GainNode

  constructor(config: EffectChainConfig) {
    this.effects = config.effects
    this.inputNode = config.inputNode
    this.outputNode = config.outputNode
    this.connectEffects()
  }

  private connectEffects() {
    if (this.effects.length === 0) {
      this.inputNode.connect(this.outputNode)
      return
    }

    let previousNode = this.inputNode
    this.effects.forEach((effect) => {
      if (!effect.bypass) {
        previousNode.connect(effect.node)
        previousNode = effect.node
      }
    })
    previousNode.connect(this.outputNode)
  }

  public addEffect(effect: AudioEffect) {
    this.effects.push(effect)
    this.reconnectChain()
  }

  public removeEffect(effectId: string) {
    this.effects = this.effects.filter(effect => effect.id !== effectId)
    this.reconnectChain()
  }

  public updateEffect(effectId: string, params: { [key: string]: number }) {
    const effect = this.effects.find(e => e.id === effectId)
    if (effect) {
      Object.entries(params).forEach(([key, value]) => {
        const param = (effect.node as any)[key]
        if (param instanceof AudioParam) {
          param.value = value
        }
      })
    }
  }

  public toggleBypass(effectId: string) {
    const effect = this.effects.find(e => e.id === effectId)
    if (effect) {
      effect.bypass = !effect.bypass
      this.reconnectChain()
    }
  }

  private reconnectChain() {
    this.disconnectAll()
    this.connectEffects()
  }

  private disconnectAll() {
    this.inputNode.disconnect()
    this.effects.forEach(effect => effect.node.disconnect())
  }

  public destroy() {
    this.disconnectAll()
  }
}
