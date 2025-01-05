import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AudioProvider } from '@/providers/audio-provider'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Music Editor - Professional Audio Tools',
    description: 'Edit and process audio files with studio-quality tools and effects',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(
                'min-h-screen bg-background font-sans antialiased',
                inter.className
            )}>
                <AudioProvider>
                    {children}
                </AudioProvider>
            </body>
        </html>
    )
}
