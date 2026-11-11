"use client"
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApiRequestError, errorMessage } from '@/lib/api-client'
import { describeConference } from '@/lib/conference'
import { cn } from '@/lib/utils'
import { getSiteConfigSections, resetSiteConfigSection, saveSiteConfigSection } from './api'
import { FieldEditor } from './field-editor'
import { describePath, SECTION_FORMS, type SectionForm } from './fields'
import { parseSection, type ConfigIssue, type SectionId, type SiteConfig } from './schema'
import type { SiteConfigSection } from './types'

type Sections = { [Id in SectionId]: SiteConfigSection<Id> }
const isDifferent = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b)

export default function SiteConfigAdmin() {
    const router = useRouter()
    const [sections, setSections] = useState<Sections | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)
    // Edits that haven't been saved yet, kept while switching between sections
    const [drafts, setDrafts] = useState<Partial<Record<SectionId, unknown>>>({})
    const [active, setActive] = useState<SectionId>(SECTION_FORMS[0].id)

    const load = useCallback(async () => {
        try {
            setSections((await getSiteConfigSections()).sections)
            setLoadError(null)
        } catch (err) {
            setLoadError(errorMessage(err))
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const unsaved = (id: SectionId) => !!sections && id in drafts && isDifferent(drafts[id], sections[id].value)
    const anyUnsaved = SECTION_FORMS.some((form) => unsaved(form.id))

    useEffect(() => {
        if (!anyUnsaved) return
        const warn = (e: BeforeUnloadEvent) => e.preventDefault()
        window.addEventListener('beforeunload', warn)
        return () => window.removeEventListener('beforeunload', warn)
    }, [anyUnsaved])

    const discard = (id: SectionId) =>
        setDrafts((current) => {
            const next = { ...current }
            delete next[id]
            return next
        })

    // After a save or reset: show what's stored now, and refresh the rest of the portal, which reads the settings on the server
    const reloadAfterChange = async (id: SectionId) => {
        await load()
        discard(id)
        router.refresh()
    }

    if (loadError) {
        return (
            <Shell>
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>The settings couldn’t be loaded</AlertTitle>
                    <AlertDescription>{loadError}</AlertDescription>
                </Alert>
            </Shell>
        )
    }

    if (!sections) {
        return (
            <Shell>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-96 w-full" />
            </Shell>
        )
    }

    return (
        <Shell>
            <p className="text-sm text-muted-foreground">
                Everything here starts out as the defaults in <code>src/config</code>. A change shows on the site as soon as it&apos;s saved. <em>Reset to default</em> goes back to what&apos;s in <code>src/config</code>.
            </p>

            <Tabs value={active} onValueChange={(value) => setActive(value as SectionId)} className="gap-4 lg:flex-row lg:items-start">
                <TabsList className="h-auto w-full flex-wrap justify-start gap-1 lg:sticky lg:top-4 lg:w-52 lg:shrink-0 lg:flex-col lg:items-stretch">
                    {SECTION_FORMS.map((form) => (
                        <TabsTrigger key={form.id} value={form.id} className="flex-none justify-between gap-2 px-3 lg:w-full">
                            {form.title}
                            {unsaved(form.id) ? (
                                <span className="size-2 rounded-full bg-amber-500" title="Unsaved changes" aria-label="Unsaved changes" />
                            ) : sections[form.id].updatedAt ? (
                                <span className="size-2 rounded-full bg-sky-600" title="Changed from the default" aria-label="Changed from the default" />
                            ) : null}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {SECTION_FORMS.map((form) => (
                    <TabsContent key={form.id} value={form.id} className="min-w-0">
                        <SectionEditor
                            form={form}
                            section={sections[form.id]}
                            value={form.id in drafts ? drafts[form.id] : sections[form.id].value}
                            unsaved={unsaved(form.id)}
                            onChange={(value) => setDrafts((current) => ({ ...current, [form.id]: value }))}
                            onDiscard={() => discard(form.id)}
                            onChanged={() => reloadAfterChange(form.id)}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </Shell>
    )
}

function Shell({ children }: { children: ReactNode }) {
    return (
        <section className="bg-muted">
            <div className="mx-auto min-h-screen max-w-6xl space-y-4 px-4 py-4 lg:px-6">{children}</div>
        </section>
    )
}

function SectionEditor({
    form,
    section,
    value,
    unsaved,
    onChange,
    onDiscard,
    onChanged,
}: {
    form: SectionForm
    section: SiteConfigSection
    value: unknown
    unsaved: boolean
    onChange: (value: unknown) => void
    onDiscard: () => void
    onChanged: () => Promise<void>
}) {
    const [issues, setIssues] = useState<ConfigIssue[]>([])
    const [status, setStatus] = useState<{ kind: 'saved' | 'error'; message: string } | null>(null)
    const [busy, setBusy] = useState(false)
    const [confirmingReset, setConfirmingReset] = useState(false)

    // Once something has been flagged, keep the list up to date as it's fixed
    const change = (next: unknown) => {
        onChange(next)
        setStatus(null)
        if (issues.length) {
            const result = parseSection(form.id, next)
            setIssues(result.success ? [] : result.issues)
        }
    }

    const save = async () => {
        const result = parseSection(form.id, value)
        if (!result.success) {
            setIssues(result.issues)
            setStatus({ kind: 'error', message: 'Some of these need fixing before they can be saved.' })
            return
        }

        setBusy(true)
        setStatus(null)
        try {
            await saveSiteConfigSection(form.id, result.data, section.updatedAt)
            setIssues([])
            await onChanged()
            setStatus({ kind: 'saved', message: 'Saved.' })
        } catch (err) {
            const serverIssues = err instanceof ApiRequestError && Array.isArray(err.data?.issues) ? (err.data.issues as ConfigIssue[]) : []
            setIssues(serverIssues)
            setStatus({ kind: 'error', message: errorMessage(err) })
        } finally {
            setBusy(false)
        }
    }

    const reset = async () => {
        if (!section.updatedAt) return
        setBusy(true)
        setStatus(null)
        try {
            await resetSiteConfigSection(form.id, section.updatedAt)
            setIssues([])
            await onChanged()
            setStatus({ kind: 'saved', message: 'Back to the default. The site shows it from now on.' })
        } catch (err) {
            setStatus({ kind: 'error', message: errorMessage(err) })
        } finally {
            setBusy(false)
            setConfirmingReset(false)
        }
    }

    const discard = () => {
        onDiscard()
        setIssues([])
        setStatus(null)
    }

    const preview = form.id === 'conference' ? conferencePreview(value as SiteConfig['conference']) : null

    return (
        <Card className="gap-6 p-6 sm:p-8">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold">{form.title}</h2>
                    {section.updatedAt ? <Badge variant="secondary">Changed</Badge> : <Badge variant="outline">Default</Badge>}
                    {unsaved && <Badge className="bg-amber-500">Unsaved changes</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{form.description}</p>
                <p className="text-xs text-muted-foreground">
                    {section.updatedAt
                        ? `Last changed by ${section.updatedBy} on ${new Date(section.updatedAt).toLocaleString()}.`
                        : `Using the defaults from src/config/${form.file}.`}
                </p>
            </div>

            {section.problem && (
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>What was saved here doesn&apos;t work any more, so the site is using the defaults</AlertTitle>
                    <AlertDescription>
                        <p>{section.problem}</p>
                        <p>Fix it below and save, or reset to the default.</p>
                    </AlertDescription>
                </Alert>
            )}

            {issues.length > 0 && (
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>Fix {issues.length === 1 ? 'this' : `these ${issues.length}`} before saving</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-4">
                            {issues.map((issue, index) => {
                                const where = describePath(form.root, issue.path).join(' › ')
                                return <li key={index}>{where ? `${where}: ` : ''}{issue.message}</li>
                            })}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {preview && <p className="rounded-md bg-sky-50 px-3 py-2 text-sm text-sky-900">{preview}</p>}

            <FieldEditor field={form.root} value={value} path={[]} issues={issues} onChange={change} isRoot />

            <div className="sticky bottom-0 -mx-6 -mb-6 flex flex-wrap items-center gap-2 border-t bg-card px-6 py-4 sm:-mx-8 sm:-mb-8 sm:px-8">
                <Button onClick={save} disabled={busy || !unsaved}>{busy ? 'Saving…' : 'Save changes'}</Button>
                <Button variant="outline" onClick={discard} disabled={busy || !unsaved}>Discard changes</Button>
                {section.updatedAt && (
                    <Button variant="ghost" className="ml-auto" onClick={() => setConfirmingReset(true)} disabled={busy}>
                        Reset to default
                    </Button>
                )}
                {status && (
                    <p className={cn('flex w-full items-center gap-1.5 text-sm', status.kind === 'saved' ? 'text-green-700' : 'text-red-600')}>
                        {status.kind === 'saved' ? <CircleCheck className="size-4" /> : <CircleAlert className="size-4" />}
                        {status.message}
                    </p>
                )}
            </div>

            <AlertDialog open={confirmingReset} onOpenChange={(open) => !busy && setConfirmingReset(open)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset {form.title} to the default?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Everything in this section goes back to what&apos;s in src/config/{form.file}, and the changes made here are lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={busy}
                            onClick={(e) => {
                                // Stay open until it's done, so a failure can be shown
                                e.preventDefault()
                                reset()
                            }}
                        >
                            {busy ? 'Resetting…' : 'Reset'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

function conferencePreview(conference: SiteConfig['conference']) {
    try {
        const { edition, datesLong } = describeConference(conference)
        return `Shown on the site as ${edition}, ${datesLong}.`
    } catch {
        return null
    }
}
