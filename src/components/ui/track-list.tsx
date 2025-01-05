'use client'

import { useAudioStore } from '@/lib/store/audio-store'
import { Button } from './button'
import { ScrollArea } from './scroll-area'
import { cn } from '@/lib/utils'
import { Waveform, Volume2, Mic } from 'lucide-react'

interface TrackItemProps {
    id: string
    name: string
    isActive: boolean
    isSolo: boolean
    isMute: boolean
    onSelect: () => void
    onSoloToggle: () => void
    onMuteToggle: () => void
}

function TrackItem({
    id,
    name,
    isActive,
    isSolo,
    isMute,
    onSelect,
    onSoloToggle,
    onMuteToggle,
}: TrackItemProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-between p-2 rounded-lg',
                isActive && 'bg-accent',
                isMute && 'opacity-50'
            )}
            onClick={onSelect}
        >
            <div className="flex items-center space-x-2">
                <Waveform className="h-4 w-4" />
                <span className="font-medium">{name}</span>
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant={isSolo ? 'default' : 'ghost'}
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation()
                        onSoloToggle()
                    }}
                >
                    <Mic className="h-4 w-4" />
                </Button>
                <Button
                    variant={isMute ? 'default' : 'ghost'}
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation()
                        onMuteToggle()
                    }}
                >
                    <Volume2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export function TrackList() {
    const {
        tracks,
        activeTrackId,
        setActiveTrack,
        toggleTrackSolo,
        toggleTrackMute,
    } = useAudioStore()

    return (
        <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="space-y-2 p-4">
                {Array.from(tracks.entries()).map(([id, track]) => (
                    <TrackItem
                        key={id}
                        id={id}
                        name={track.name}
                        isActive={id === activeTrackId}
                        isSolo={track.solo}
                        isMute={track.mute}
                        onSelect={() => setActiveTrack(id)}
                        onSoloToggle={() => toggleTrackSolo(id)}
                        onMuteToggle={() => toggleTrackMute(id)}
                    />
                ))}
            </div>
        </ScrollArea>
    )
} 