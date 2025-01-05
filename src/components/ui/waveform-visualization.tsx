'use client'

import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface WaveformVisualizationProps {
    audioUrl?: string
}

export function WaveformVisualization({ audioUrl }: WaveformVisualizationProps) {
    const waveformRef = useRef<HTMLDivElement>(null)
    const wavesurfer = useRef<WaveSurfer | null>(null)

    useEffect(() => {
        if (waveformRef.current && audioUrl) {
            wavesurfer.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'rgb(var(--foreground))',
                progressColor: 'rgb(var(--primary))',
                cursorColor: 'rgb(var(--primary))',
                barWidth: 2,
                barGap: 3,
                height: 100,
                responsive: true,
            })

            wavesurfer.current.load(audioUrl)

            return () => {
                wavesurfer.current?.destroy()
            }
        }
    }, [audioUrl])

    return <div ref={waveformRef} className="w-full" />
} 