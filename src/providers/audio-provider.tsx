'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AudioContextState {
    audioContext: AudioContext
    masterGainNode: GainNode
    isReady: boolean
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

        document.addEventListener('visibilitychange', handleVisibilityChange)

        setState({
            audioContext: ctx,
            masterGainNode: masterGain,
            isReady: true
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
