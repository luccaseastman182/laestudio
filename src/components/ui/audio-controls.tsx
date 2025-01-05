'use client'

import { useAudioStore } from '@/lib/store/audio-store'
import { useAudio } from '@/providers/audio-provider'
import { Slider } from './slider'
import { Button } from './button'
import { Volume2, VolumeX, RotateCw, Play, Pause, Stop, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AudioControlsProps {
    className?: string
}

export function AudioControls({ className }: AudioControlsProps) {
    const { masterGainNode } = useAudio()
    const {
        masterVolume,
        setMasterVolume,
        masterPan,
        setMasterPan,
        isPlaying,
        setIsPlaying,
        currentTime,
        setCurrentTime
    } = useAudioStore()

    const toggleMute = () => {
        if (masterVolume === 0) {
            setMasterVolume(1)
        } else {
            setMasterVolume(0)
        }
    }

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const handleStop = () => {
        setIsPlaying(false)
        setCurrentTime(0)
    }

    const handleRecord = () => {
        // Placeholder for recording functionality
    }

    return (
        <div className={cn('flex items-center space-x-4', className)}>
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
            >
                {masterVolume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                ) : (
                    <Volume2 className="h-4 w-4" />
                )}
            </Button>

            <div className="w-32">
                <Slider
                    value={[masterVolume]}
                    max={1}
                    step={0.01}
                    onValueChange={(value) => {
                        setMasterVolume(value[0])
                        masterGainNode.gain.value = value[0]
                    }}
                />
            </div>

            <div className="w-32">
                <Slider
                    value={[masterPan]}
                    min={-1}
                    max={1}
                    step={0.01}
                    onValueChange={(value) => setMasterPan(value[0])}
                />
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
            >
                {isPlaying ? (
                    <Pause className="h-4 w-4" />
                ) : (
                    <Play className="h-4 w-4" />
                )}
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={handleStop}
            >
                <Stop className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={handleRecord}
            >
                <Mic className="h-4 w-4" />
            </Button>
        </div>
    )
}
