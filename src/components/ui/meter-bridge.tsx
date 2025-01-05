'use client'

import { useEffect, useRef } from 'react'
import { useAudioStore } from '@/lib/store/audio-store'
import { useAudio } from '@/providers/audio-provider'
import { cn } from '@/lib/utils'

interface MeterProps {
    value: number
    peak: number
    className?: string
}

function Meter({ value, peak, className }: MeterProps) {
    const height = `${Math.max(0, Math.min(100, value * 100))}%`
    const peakHeight = `${Math.max(0, Math.min(100, peak * 100))}%`

    return (
        <div className={cn('relative h-32 w-4 bg-muted', className)}>
            <div
                className="absolute bottom-0 left-0 right-0 bg-primary transition-all duration-100"
                style={{ height }}
            />
            <div
                className="absolute h-[2px] left-0 right-0 bg-destructive transition-all duration-300"
                style={{ bottom: peakHeight }}
            />
        </div>
    )
}

function updateMeterLevels(
    analyser: AnalyserNode,
    dataArray: Float32Array,
    currentPeak: number,
    peakDecay: number
): { level: number; peak: number } {
    analyser.getFloatTimeDomainData(dataArray)

    // Calculate RMS value
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i]
    }
    const rms = Math.sqrt(sum / dataArray.length)

    // Update peak
    const level = Math.min(1, rms)
    const peak = level > currentPeak ? level : currentPeak - peakDecay

    return { level, peak }
}

export function MeterBridge() {
    const { audioContext } = useAudio()
    const { tracks } = useAudioStore()
    const analyserNodes = useRef(new Map<string, AnalyserNode>())
    const rafId = useRef<number>()
    const dataArrays = useRef(new Map<string, Float32Array>())
    const peakLevels = useRef(new Map<string, number>())
    const peakHoldTime = 2000 // 2 seconds
    const peakDecay = 0.01

    useEffect(() => {
        // Create analyzer nodes for each track
        tracks.forEach((track, id) => {
            if (!analyserNodes.current.has(id)) {
                const analyser = audioContext.createAnalyser()
                analyser.fftSize = 2048
                analyserNodes.current.set(id, analyser)
                dataArrays.current.set(id, new Float32Array(analyser.frequencyBinCount))
                peakLevels.current.set(id, 0)
            }
        })

        // Cleanup unused analyzers
        Array.from(analyserNodes.current.keys()).forEach((id) => {
            if (!tracks.has(id)) {
                analyserNodes.current.delete(id)
                dataArrays.current.delete(id)
                peakLevels.current.delete(id)
            }
        })

        function animate() {
            rafId.current = requestAnimationFrame(animate)

            tracks.forEach((track, id) => {
                const analyser = analyserNodes.current.get(id)
                const dataArray = dataArrays.current.get(id)
                const currentPeak = peakLevels.current.get(id) || 0

                if (analyser && dataArray) {
                    const { level, peak } = updateMeterLevels(
                        analyser,
                        dataArray,
                        currentPeak,
                        peakDecay
                    )
                    peakLevels.current.set(id, peak)

                    // Update meter component
                    const meterElement = document.querySelector(`[data-meter-id="${id}"]`)
                    if (meterElement) {
                        const levelBar = meterElement.querySelector('[data-level]')
                        const peakBar = meterElement.querySelector('[data-peak]')
                        if (levelBar && peakBar) {
                            levelBar.style.height = `${level * 100}%`
                            peakBar.style.bottom = `${peak * 100}%`
                        }
                    }
                }
            })
        }

        animate()

        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current)
            }
        }
    }, [tracks, audioContext, peakDecay])

    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-end space-x-1 p-2">
                {Array.from(tracks.entries()).map(([id, track]) => (
                    <div key={id} className="flex flex-col items-center space-y-1">
                        <div
                            data-meter-id={id}
                            className="relative h-32 w-4 bg-muted overflow-hidden"
                        >
                            <div
                                data-level
                                className="absolute bottom-0 left-0 right-0 bg-primary transition-all duration-100"
                            />
                            <div
                                data-peak
                                className="absolute h-[2px] left-0 right-0 bg-destructive transition-all duration-300"
                            />
                        </div>
                        <span className="text-xs text-muted-foreground truncate max-w-[4rem]">
                            {track.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
} 
