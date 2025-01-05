import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Dynamic imports for client components
const AudioControls = dynamic(() =>
    import('@/components/ui/audio-controls').then(mod => mod.AudioControls),
    { ssr: false }
)
const TrackList = dynamic(() =>
    import('@/components/ui/track-list').then(mod => mod.TrackList),
    { ssr: false }
)
const MixerView = dynamic(() =>
    import('@/components/ui/mixer-view').then(mod => mod.MixerView),
    { ssr: false }
)
const PluginRack = dynamic(() =>
    import('@/components/ui/plugin-rack').then(mod => mod.PluginRack),
    { ssr: false }
)
const MeterBridge = dynamic(() =>
    import('@/components/ui/meter-bridge').then(mod => mod.MeterBridge),
    { ssr: false }
)
const StatusBar = dynamic(() =>
    import('@/components/ui/status-bar').then(mod => mod.StatusBar),
    { ssr: false }
)

export const metadata: Metadata = {
    title: 'Music Editor - Professional Audio Tools',
    description: 'Edit and process audio files with studio-quality tools and effects',
}

export default async function HomePage() {
    return (
        <main className="flex min-h-screen flex-col">
            <div className="flex-1 flex">
                {/* Left sidebar */}
                <div className="w-64 border-r bg-muted/50">
                    <TrackList />
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col">
                    {/* Top bar */}
                    <div className="h-16 border-b flex items-center px-4">
                        <AudioControls />
                    </div>

                    {/* Center content */}
                    <div className="flex-1 flex">
                        {/* Timeline and tracks */}
                        <div className="flex-1">
                            <MeterBridge />
                            <MixerView />
                        </div>

                        {/* Right sidebar */}
                        <div className="w-80 border-l">
                            <PluginRack />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <StatusBar />
        </main>
    )
}
