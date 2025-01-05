'use client'

import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './alert'
import { Button } from './button'

interface ErrorBoundaryProps {
    error: Error
    reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
    return (
        <div className="p-4 space-y-4">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error.message}
                </AlertDescription>
            </Alert>
            <div className="flex justify-end">
                <Button onClick={reset} variant="outline">
                    Try again
                </Button>
            </div>
        </div>
    )
} 