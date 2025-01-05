'use client'

import { useAudioStore } from '@/lib/store/audio-store'
import { Slider } from './slider'
import { cn } from '@/lib/utils'
import type { AudioTrack } from '@/lib/types/audio'

interface TrackFaderProps {
    track: AudioTrack
    onVolumeChange: (value: number) => void
    onPanChange: (value: number) => void
}

function TrackFader({ track, onVolumeChange, onPanChange }: TrackFaderProps) {
    return (
        <div className="flex flex-col items-center space-y-2 w-24">
            <div className="h-32">
                <Slider
                    orientation="vertical"
                    value={[track.volume]}
                    max={1}
                    step={0.01}
                    onValueChange={([value]) => onVolumeChange(value)}
                />
            </div>
            <div className="w-full">
                <Slider
                    value={[track.pan]}
                    min={-1}
                    max={1}
                    step={0.01}
                    onValueChange={([value]) => onPanChange(value)}
                />
            </div>
            <span className="text-xs text-muted-foreground truncate w-full text-center">
                {track.name}
            </span>
        </div>
    )
}

export function MixerView() {
    const { tracks, setTrackVolume, setTrackPan } = useAudioStore()

    return (
        <div className="p-4">
            <div className="flex items-end space-x-4 overflow-x-auto pb-4">
                {Array.from(tracks.entries()).map(([id, track]) => (
                    <TrackFader
                        key={id}
                        track={track}
                        onVolumeChange={(value) => setTrackVolume(id, value)}
                        onPanChange={(value) => setTrackPan(id, value)}
                    />
                ))}
            </div>
        </div>
    )
} 