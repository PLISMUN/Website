"use client"
import { useEffect, useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DOCUMENT_DESCRIPTION_MAX_LENGTH,
    DOCUMENT_MAX_SIZE_MB,
    DOCUMENT_TITLE_MAX_LENGTH,
    documentGroups,
    type DocumentEntry,
    type DocumentGroup,
} from '@/config/documents'

const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`

const setDocument = async (body: object) => {
    const res = await fetch('/api/modify/setDocument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.message || 'Failed to save the document')
}

export default function DocumentsAdmin() {
    const [documents, setDocuments] = useState<DocumentEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Only one upload or deletion runs at a time
    const [busyId, setBusyId] = useState<number | null>(null)
    const [progress, setProgress] = useState<number | null>(null)
    const [actionError, setActionError] = useState<{ id: number, message: string } | null>(null)
    const [deleting, setDeleting] = useState<DocumentEntry | null>(null)

    const [creatingIn, setCreatingIn] = useState<DocumentGroup | null>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    const fileInput = useRef<HTMLInputElement>(null)
    const uploadTarget = useRef<DocumentEntry | null>(null)

    const fetchDocuments = async () => {
        try {
            const res = await fetch('/api/retrieve/getDocuments', { method: 'POST' })
            const data = await res.json().catch(() => null)
            if (!res.ok) throw new Error(data?.message || 'Failed to fetch documents')
            setDocuments(data.documents)
            setError(null)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [])

    const openCreate = (group: DocumentGroup) => {
        setTitle('')
        setDescription('')
        setFormError(null)
        setCreatingIn(group)
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!creatingIn) return

        setSaving(true)
        setFormError(null)
        try {
            await setDocument({ action: 'create', groupId: creatingIn.id, title, description })
            await fetchDocuments()
            setCreatingIn(null)
        } catch (err: any) {
            setFormError(err.message)
        }
        setSaving(false)
    }

    const pickFile = (doc: DocumentEntry) => {
        uploadTarget.current = doc
        fileInput.current?.click()
    }

    const runAction = async (id: number, action: () => Promise<unknown>) => {
        setBusyId(id)
        setActionError(null)
        try {
            await action()
        } catch (err: any) {
            setActionError({ id, message: err.message })
        } finally {
            await fetchDocuments()
        }
        setBusyId(null)
        setProgress(null)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        // Otherwise picking the same file again after a failure wouldn't fire this
        e.target.value = ''
        const doc = uploadTarget.current
        if (!file || !doc) return

        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            return setActionError({ id: doc.id, message: 'Please choose a PDF file' })
        }
        if (file.size > DOCUMENT_MAX_SIZE_MB * 1024 * 1024) {
            return setActionError({ id: doc.id, message: `The file must be ${DOCUMENT_MAX_SIZE_MB} MB or smaller` })
        }

        runAction(doc.id, async () => {
            setProgress(0)
            await upload(doc.path, file, {
                access: 'public',
                handleUploadUrl: '/api/modify/uploadDocument',
                contentType: 'application/pdf',
                onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
            })
            await setDocument({ action: 'publish', id: doc.id })
        })
    }

    const handleDelete = () => {
        if (!deleting) return
        const { id } = deleting
        setDeleting(null)
        runAction(id, () => setDocument({ action: 'delete', id }))
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-600">{error}</div>

    return (
    <section className="bg-muted">
        <input ref={fileInput} type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleFileChange} />

        <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen space-y-4">
            <p className="text-sm text-muted-foreground">
                Create a document, then upload its PDF (up to {DOCUMENT_MAX_SIZE_MB} MB). Until then it shows as unavailable on the public Documents page, and sections with no documents are hidden. Replacing a PDF keeps its link.
            </p>
            {documentGroups.map(group => {
                const groupDocuments = documents.filter(doc => doc.groupId === group.id)
                return (
                    <div key={group.id} className="@container lg:col-span-3">
                        <Card className="p-8 sm:p-12">
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="text-xl font-semibold">{group.heading}</h3>
                                <Button onClick={() => openCreate(group)}>New document</Button>
                            </div>
                            {groupDocuments.length ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-200 rounded">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="px-2 py-1 border">Document</th>
                                                <th className="px-2 py-1 border">Status</th>
                                                <th className="px-2 py-1 border">Uploaded</th>
                                                <th className="px-2 py-1 border">Size</th>
                                                <th className="px-2 py-1 border"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupDocuments.map(doc => (
                                                <tr key={doc.id} className="border-t">
                                                    <td className="px-2 py-1 border">
                                                        <div>{doc.title}</div>
                                                        <div className="text-xs text-muted-foreground">{doc.description}</div>
                                                        {actionError?.id === doc.id && (
                                                            <p className="text-red-600 text-sm">{actionError.message}</p>
                                                        )}
                                                    </td>
                                                    <td className={`px-2 py-1 border ${doc.url ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {doc.url ? 'Live' : 'Not uploaded'}
                                                    </td>
                                                    <td className="px-2 py-1 border">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString() : ''}</td>
                                                    <td className="px-2 py-1 border whitespace-nowrap">{doc.size !== null ? formatSize(doc.size) : ''}</td>
                                                    <td className="px-2 py-1 border whitespace-nowrap">
                                                        <Button size="sm" disabled={busyId !== null} onClick={() => pickFile(doc)}>
                                                            {busyId === doc.id && progress !== null
                                                                ? `Uploading ${progress}%`
                                                                : doc.url ? 'Replace' : 'Upload'}
                                                        </Button>
                                                        {doc.url && (
                                                            <Button size="sm" variant="outline" asChild>
                                                                <a href={doc.url} target="_blank" rel="noopener noreferrer">View</a>
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="ghost" disabled={busyId !== null} onClick={() => setDeleting(doc)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm">No documents yet.</p>
                            )}
                        </Card>
                    </div>
                )
            })}
        </div>

        <Dialog open={!!creatingIn} onOpenChange={open => { if (!open && !saving) setCreatingIn(null) }}>
            <DialogContent>
                {creatingIn && (
                    <form onSubmit={handleCreate} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>New document</DialogTitle>
                            <DialogDescription>In {creatingIn.heading}. You can upload the PDF once it&apos;s created.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                            <Label htmlFor="document-title">Title</Label>
                            <Input
                                required
                                id="document-title"
                                maxLength={DOCUMENT_TITLE_MAX_LENGTH}
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="document-description">Description</Label>
                            <Input
                                required
                                id="document-description"
                                maxLength={DOCUMENT_DESCRIPTION_MAX_LENGTH}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        {formError && <p className="text-red-600 text-sm">{formError}</p>}
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setCreatingIn(null)} disabled={saving}>Cancel</Button>
                            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create'}</Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleting} onOpenChange={open => { if (!open) setDeleting(null) }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {deleting?.title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        It disappears from the public Documents page and any uploaded PDF is deleted, so links to it stop working.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </section>
    )
}
