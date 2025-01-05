'use client'

import { useState } from 'react'
import { useAudioStore } from '@/lib/store/audio-store'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

interface ProjectDialogProps {
    mode: 'save' | 'load'
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ProjectDialog({ mode, open, onOpenChange }: ProjectDialogProps) {
    const [projectName, setProjectName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const { saveProject, loadProject } = useAudioStore()

    const handleAction = async () => {
        try {
            setError(null)
            if (mode === 'save') {
                await saveProject(projectName)
            } else {
                await loadProject(projectName)
            }
            onOpenChange(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'save' ? 'Save Project' : 'Load Project'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'save'
                            ? 'Enter a name for your project'
                            : 'Enter the name of the project to load'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input
                            id="projectName"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="My Project"
                        />
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAction}>
                        {mode === 'save' ? 'Save' : 'Load'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 