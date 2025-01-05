'use client'

import { useCallback, useState } from 'react'
import { useAudioStore } from '@/lib/store/audio-store'
import { useAudio } from '@/providers/audio-provider'
import { Button } from './button'
import { Slider } from './slider'
import {
    Play,
    Pause,
    Stop,
    SkipBack,
    SkipForward,
    Mic,
    Clock,
    Tempo
} from 'lucide-react'

export function TransportControls() {
    const { audioContext } = useAudio()
    const {
        isPlaying,
        currentTime,
        setIsPlaying,
        setCurrentTime,
        transportState,
        setTransportState
    } = useAudioStore()
    const [isRecording, setIsRecording] = useState(false)
    const [tempo, setTempo] = useState(120)

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

    const handleRecord = useCallback(() => {
        setIsRecording(!isRecording)
    }, [isRecording])

    const handleTempoChange = useCallback((value: number) => {
        setTempo(value)
    }, [])

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

            <Button
                variant="ghost"
                size="icon"
                onClick={handleRecord}
            >
                <Mic className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(currentTime * 1000).toISOString().substr(11, 8)}</span>
            </div>

            <div className="flex items-center space-x-2">
                <Tempo className="h-4 w-4" />
                <Slider
                    value={[tempo]}
                    min={40}
                    max={240}
                    step={1}
                    onValueChange={(value) => handleTempoChange(value[0])}
                />
                <span>{tempo} BPM</span>
            </div>

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
