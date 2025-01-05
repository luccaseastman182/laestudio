'use client'

import { useAudioStore } from '@/lib/store/audio-store'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Slider } from './slider'
import { Switch } from './switch'
import { Plus } from 'lucide-react'
import type { AudioEffect } from '@/lib/types/audio'

interface EffectControlsProps {
    effect: AudioEffect
    onParameterChange: (param: string, value: number) => void
    onBypassToggle: () => void
    onWetDryChange: (value: number) => void
}

function EffectControls({
    effect,
    onParameterChange,
    onBypassToggle,
    onWetDryChange,
}: EffectControlsProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {effect.type}
                </CardTitle>
                <Switch
                    checked={!effect.bypass}
                    onCheckedChange={() => onBypassToggle()}
                />
            </CardHeader>
            <CardContent className="space-y-4">
                {Object.entries(effect.parameters).map(([param, value]) => (
                    <div key={param} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                {param}
                            </span>
                            <span className="text-xs tabular-nums">
                                {value.toFixed(2)}
                            </span>
                        </div>
                        <Slider
                            value={[value]}
                            min={0}
                            max={1}
                            step={0.01}
                            onValueChange={([newValue]) => onParameterChange(param, newValue)}
                        />
                    </div>
                ))}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            Wet/Dry
                        </span>
                        <span className="text-xs tabular-nums">
                            {effect.wetDry.toFixed(2)}
                        </span>
                    </div>
                    <Slider
                        value={[effect.wetDry]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={([value]) => onWetDryChange(value)}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export function PluginRack() {
    const { activeTrackId, tracks, updateEffect } = useAudioStore()
    const activeTrack = activeTrackId ? tracks.get(activeTrackId) : null

    if (!activeTrack) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
                <p>Select a track to view and edit effects</p>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Effects</h2>
                <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Effect
                </Button>
            </div>
            <div className="space-y-4">
                {activeTrack.effects.map((effect) => (
                    <EffectControls
                        key={effect.id}
                        effect={effect}
                        onParameterChange={(param, value) =>
                            updateEffect(activeTrackId, effect.id, {
                                ...effect,
                                parameters: { ...effect.parameters, [param]: value },
                            })
                        }
                        onBypassToggle={() =>
                            updateEffect(activeTrackId, effect.id, {
                                ...effect,
                                bypass: !effect.bypass,
                            })
                        }
                        onWetDryChange={(value) =>
                            updateEffect(activeTrackId, effect.id, {
                                ...effect,
                                wetDry: value,
                            })
                        }
                    />
                ))}
            </div>
        </div>
    )
} 