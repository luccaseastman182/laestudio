'use client'

import { useAudioStore } from '@/lib/store/audio-store'
import { useAudio } from '@/providers/audio-provider'
import { formatTime } from '@/lib/utils'

export function StatusBar() {
    const { audioContext } = useAudio()
    const { currentTime, isPlaying, activeTrackId, tracks } = useAudioStore()
    const activeTrack = activeTrackId ? tracks.get(activeTrackId) : null

    return (
        <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/50">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div>
                    {isPlaying ? 'Playing' : 'Stopped'} |{' '}
                    {formatTime(currentTime)}
                </div>
                <div>
                    {activeTrack
                        ? `Track: ${activeTrack.name}`
                        : 'No track selected'}
                </div>
            </div>
            <div className="text-sm text-muted-foreground">
                {audioContext.state === 'running'
                    ? `Sample Rate: ${audioContext.sampleRate}Hz`
                    : 'Audio Suspended'}
            </div>
        </div>
    )
} 