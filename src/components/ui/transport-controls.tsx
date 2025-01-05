'use client'

import { useCallback } from 'react'
import { useAudioStore } from '@/lib/store/audio-store'
import { useAudio } from '@/providers/audio-provider'
import { Button } from './button'
import { Slider } from './slider'
import {
    Play,
    Pause,
    Stop,
    SkipBack,
    SkipForward
} from 'lucide-react'

export function TransportControls() {
    const { audioContext } = useAudio()
    const {
        isPlaying,
        currentTime,
        setIsPlaying,
        setCurrentTime
    } = useAudioStore()

    const handlePlayPause = useCallback(() => {
        if (audioContext.state === 'suspended') {
            audioContext.resume()
        }
        setIsPlaying(!isPlaying)
    }, [audioContext, isPlaying, setIsPlaying])

    const handleStop = useCallback(() => {
        setIsPlaying(false)
        setCurrentTime(0)
    }, [setIsPlaying, setCurrentTime])

    return (
        <div className="flex items-center space-x-4">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}
            >
                <SkipBack className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
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
                onClick={() => setCurrentTime(currentTime + 5)}
            >
                <SkipForward className="h-4 w-4" />
            </Button>

            <div className="w-96">
                <Slider
                    value={[currentTime]}
                    max={audioContext.length || 100}
                    step={0.1}
                    onValueChange={(value) => setCurrentTime(value[0])}
                />
            </div>
        </div>
    )
} 