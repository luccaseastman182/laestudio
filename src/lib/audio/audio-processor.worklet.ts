class AudioProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{
      name: 'gain',
      defaultValue: 1.0,
      minValue: 0,
      maxValue: 1
    }]
  }

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean {
    const input = inputs[0]
    const output = outputs[0]
    const gain = parameters.gain

    if (!input || !output) return true

    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel]
      const outputChannel = output[channel]

      for (let i = 0; i < inputChannel.length; i++) {
        outputChannel[i] = inputChannel[i] * gain[0]
      }
    }

    return true
  }
}

registerProcessor('audio-processor', AudioProcessor) 