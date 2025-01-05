'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AudioContextState {
    audioContext: AudioContext
    masterGainNode: GainNode
    isReady: boolean
    cropAudio: (start: number, end: number) => void
    resumeContext: () => void
    suspendContext: () => void
}

const AudioContext = createContext<AudioContextState | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AudioContextState | null>(null)

    useEffect(() => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const masterGain = ctx.createGain()
        masterGain.connect(ctx.destination)

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                ctx.suspend()
            } else {
                ctx.resume()
            }
        }

        const cropAudio = (start: number, end: number) => {
            const source = ctx.createBufferSource()
            const buffer = ctx.createBuffer(2, end - start, ctx.sampleRate)
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const data = buffer.getChannelData(channel)
                for (let i = start; i < end; i++) {
                    data[i - start] = source.buffer!.getChannelData(channel)[i]
                }
            }
            source.buffer = buffer
            source.connect(masterGain)
            source.start()
        }

        const resumeContext = () => {
            ctx.resume()
        }

        const suspendContext = () => {
            ctx.suspend()
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        setState({
            audioContext: ctx,
            masterGainNode: masterGain,
            isReady: true,
            cropAudio,
            resumeContext,
            suspendContext
        })

        return () => {
            ctx.close()
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    if (!state) return null

    return (
        <AudioContext.Provider value={state}>
            {children}
        </AudioContext.Provider>
    )
}

export function useAudio() {
    const context = useContext(AudioContext)
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider')
    }
    return context
}
