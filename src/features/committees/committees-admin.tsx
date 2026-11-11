"use client"
import { useCallback, useEffect, useId, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { IconPlus } from '@tabler/icons-react'
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
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { ApiRequestError, errorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { FieldEditor } from '@/features/site-config/field-editor'
import { describePath, type Field } from '@/features/site-config/fields'
import type { ConfigIssue } from '@/features/site-config/schema'
import { getCommitteesForAdmin, setCommittee } from './api'
import { DIFFICULTIES, parseCommittee, type CommitteeForAdmin, type CommitteeInput } from './schema'

const NEW = 'new'
type Selected = number | typeof NEW

const emptyCommittee = (): CommitteeInput => ({
    name: '',
    shorthand: '',
    description: '',
    difficulty: 'Beginner',
    icon: '',
    roles: [],
    topics: [
        { name: '', description: '' },
        { name: '', description: '' },
    ],
})

const COMMITTEE_FORM: Field = {
    kind: 'group',
    key: '',
    label: '',
    fields: [
        { kind: 'text', key: 'name', label: 'Name', placeholder: 'World Health Organisation (WHO)' },
        { kind: 'text', key: 'shorthand', label: 'Shorthand', placeholder: 'WHO', help: 'Short enough to fit on a badge.' },
        {
            kind: 'select',
            key: 'difficulty',
            label: 'Difficulty',
            options: DIFFICULTIES,
            help: 'The coloured bar on the committee’s card.',
        },
        { kind: 'text', key: 'description', label: 'Description', multiline: true },
        {
            kind: 'text',
            key: 'icon',
            label: 'Icon',
            image: true,
            help: 'A file in public/icons starting with /, like /icons/WHO.jpg, or a link starting with https://. Can be left empty.',
        },
        {
            kind: 'list',
            key: 'topics',
            label: 'Topics',
            itemLabel: 'Topic',
            titleKey: 'name',
            help: 'The first two are shown on the committee’s card, and all of them when it’s opened.',
            fields: [
                { kind: 'text', key: 'name', label: 'Topic' },
                { kind: 'text', key: 'description', label: 'Description', multiline: true },
            ],
            newItem: () => ({ name: '', description: '' }),
        },
        {
            kind: 'list',
            key: 'roles',
            label: 'Roles',
            itemLabel: 'Role',
            inline: true,
            help: 'What delegates choose from when they apply, usually countries. Applications already made keep the role they were made for, even if it’s renamed or removed here.',
            fields: [
                { kind: 'text', key: 'role', label: 'Role' },
                { kind: 'select', key: 'difficulty', label: 'Difficulty', options: DIFFICULTIES },
            ],
            newItem: () => ({ role: '', difficulty: 'Beginner' }),
        },
    ],
}

const toInput = (committee: CommitteeForAdmin): CommitteeInput => ({
    name: committee.name,
    shorthand: committee.shorthand,
    description: committee.description,
    difficulty: committee.difficulty,
    icon: committee.icon,
    roles: committee.roles,
    topics: committee.topics,
})
const isDifferent = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b)

export default function CommitteesAdmin() {
    const router = useRouter()
    const [committees, setCommittees] = useState<CommitteeForAdmin[] | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [selected, setSelected] = useState<Selected | null>(null)
    // Edits that haven't been saved yet, kept while switching between committees
    const [drafts, setDrafts] = useState<Partial<Record<string, CommitteeInput>>>({})

    const load = useCallback(async () => {
        try {
            const { committees } = await getCommitteesForAdmin()
            setCommittees(committees)
            setLoadError(null)
            setSelected((current) => current ?? committees[0]?.id ?? NEW)
        } catch (err) {
            setLoadError(errorMessage(err))
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const saved = (key: Selected) => (key === NEW ? emptyCommittee() : toInput(committees!.find((c) => c.id === key)!))
    const unsaved = (key: Selected) => String(key) in drafts && isDifferent(drafts[String(key)], saved(key))
    const anyUnsaved = !!committees && [...committees.map((c): Selected => c.id), NEW as Selected].some(unsaved)

    useEffect(() => {
        if (!anyUnsaved) return
        const warn = (e: BeforeUnloadEvent) => e.preventDefault()
        window.addEventListener('beforeunload', warn)
        return () => window.removeEventListener('beforeunload', warn)
    }, [anyUnsaved])

    const discard = (key: Selected) =>
        setDrafts((current) => {
            const next = { ...current }
            delete next[String(key)]
            return next
        })

    if (loadError) {
        return (
            <Shell>
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>The committees couldn’t be loaded</AlertTitle>
                    <AlertDescription>{loadError}</AlertDescription>
                </Alert>
            </Shell>
        )
    }

    if (!committees || selected === null) {
        return (
            <Shell>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-96 w-full" />
            </Shell>
        )
    }

    // A committee deleted by someone else while it was open
    const current = selected === NEW || committees.some((c) => c.id === selected) ? selected : NEW
    const committee = current === NEW ? null : committees.find((c) => c.id === current)!

    return (
        <Shell>
            <p className="text-sm text-muted-foreground">
                The committees on the home page, <code>/this-year</code> and <code>/delegate-info</code>, and the ones delegates choose from when they
                apply. A change shows on the site as soon as it&apos;s saved.
            </p>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <nav aria-label="Committees" className="bg-muted flex w-full flex-wrap gap-1 rounded-lg p-[3px] lg:sticky lg:top-4 lg:w-60 lg:shrink-0 lg:flex-col">
                    {committees.map((c) => (
                        <NavButton key={c.id} active={current === c.id} onClick={() => setSelected(c.id)} unsaved={unsaved(c.id)}>
                            <span className="truncate">{c.shorthand || c.name}</span>
                        </NavButton>
                    ))}
                    <NavButton active={current === NEW} onClick={() => setSelected(NEW)} unsaved={unsaved(NEW)}>
                        <span className="flex items-center gap-1.5"><IconPlus className="size-4" /> New committee</span>
                    </NavButton>
                </nav>

                <CommitteeEditor
                    key={String(current)}
                    committee={committee}
                    value={drafts[String(current)] ?? saved(current)}
                    unsaved={unsaved(current)}
                    onChange={(value) => setDrafts((d) => ({ ...d, [String(current)]: value }))}
                    onDiscard={() => discard(current)}
                    onSaved={async (id) => {
                        await load()
                        discard(current)
                        setSelected(id)
                        router.refresh()
                    }}
                    onDeleted={async () => {
                        discard(current)
                        setSelected(null)
                        await load()
                        router.refresh()
                    }}
                />
            </div>
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

function NavButton({ active, unsaved, onClick, children }: { active: boolean; unsaved: boolean; onClick: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-current={active ? 'true' : undefined}
            className={cn(
                'flex min-w-0 items-center justify-between gap-2 rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors lg:w-full',
                active ? 'bg-background shadow-sm' : 'hover:bg-background/60'
            )}
        >
            {children}
            {unsaved && <span className="size-2 shrink-0 rounded-full bg-amber-500" title="Unsaved changes" aria-label="Unsaved changes" />}
        </button>
    )
}

function CommitteeEditor({
    committee,
    value,
    unsaved,
    onChange,
    onDiscard,
    onSaved,
    onDeleted,
}: {
    // null for a new one
    committee: CommitteeForAdmin | null
    value: CommitteeInput
    unsaved: boolean
    onChange: (value: CommitteeInput) => void
    onDiscard: () => void
    onSaved: (id: number) => Promise<void>
    onDeleted: () => Promise<void>
}) {
    const [issues, setIssues] = useState<ConfigIssue[]>([])
    const [status, setStatus] = useState<{ kind: 'saved' | 'error'; message: string } | null>(null)
    const [busy, setBusy] = useState(false)
    const [confirmingDelete, setConfirmingDelete] = useState(false)

    const change = (next: CommitteeInput) => {
        onChange(next)
        setStatus(null)
        if (issues.length) {
            const result = parseCommittee(next)
            setIssues(result.success ? [] : result.issues)
        }
    }

    const save = async () => {
        const result = parseCommittee(value)
        if (!result.success) {
            setIssues(result.issues)
            setStatus({ kind: 'error', message: 'Some of this needs fixing before it can be saved.' })
            return
        }

        setBusy(true)
        setStatus(null)
        try {
            const { id } = committee
                ? await setCommittee({ action: 'update', id: committee.id, committee: result.data })
                : await setCommittee({ action: 'create', committee: result.data })
            setIssues([])
            await onSaved(id)
            // A new committee opens in a fresh editor, but an existing one stays in this one
            setStatus({ kind: 'saved', message: 'Saved.' })
        } catch (err) {
            const serverIssues = err instanceof ApiRequestError && Array.isArray(err.data?.issues) ? (err.data.issues as ConfigIssue[]) : []
            setIssues(serverIssues)
            setStatus({ kind: 'error', message: errorMessage(err) })
        } finally {
            setBusy(false)
        }
    }

    const remove = async () => {
        if (!committee) return
        setBusy(true)
        try {
            await setCommittee({ action: 'delete', id: committee.id })
            setConfirmingDelete(false)
            await onDeleted()
        } catch (err) {
            setStatus({ kind: 'error', message: errorMessage(err) })
            setConfirmingDelete(false)
        } finally {
            setBusy(false)
        }
    }

    const discard = () => {
        onDiscard()
        setIssues([])
        setStatus(null)
    }

    return (
        <Card className="min-w-0 flex-1 gap-6 p-6 sm:p-8">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold">{committee ? committee.name : 'New committee'}</h2>
                    {unsaved && <Badge className="bg-amber-500">Unsaved changes</Badge>}
                </div>
                {committee && (
                    <p className="text-sm text-muted-foreground">
                        {committee.applications === 1 ? '1 application' : `${committee.applications} applications`} · {committee.roles.length}{' '}
                        {committee.roles.length === 1 ? 'role' : 'roles'}
                    </p>
                )}
            </div>

            {issues.length > 0 && (
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>Fix {issues.length === 1 ? 'this' : `these ${issues.length}`} before saving</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-4">
                            {issues.map((issue, index) => {
                                const where = describePath(COMMITTEE_FORM, issue.path).join(' › ')
                                return <li key={index}>{where ? `${where}: ` : ''}{issue.message}</li>
                            })}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            <FieldEditor
                field={COMMITTEE_FORM}
                value={value}
                path={[]}
                issues={issues}
                onChange={(next) => change(next as CommitteeInput)}
                isRoot
            />

            <AddSeveralRoles onAdd={(roles) => change({ ...value, roles: [...value.roles, ...roles] })} existing={value.roles.map((r) => r.role)} />

            <div className="sticky bottom-0 -mx-6 -mb-6 flex flex-wrap items-center gap-2 border-t bg-card px-6 py-4 sm:-mx-8 sm:-mb-8 sm:px-8">
                <Button onClick={save} disabled={busy || !unsaved}>{busy ? 'Saving…' : committee ? 'Save changes' : 'Create committee'}</Button>
                <Button variant="outline" onClick={discard} disabled={busy || !unsaved}>Discard changes</Button>
                {committee && (
                    <Button
                        variant="ghost"
                        className="ml-auto text-red-600 hover:text-red-700"
                        onClick={() => setConfirmingDelete(true)}
                        disabled={busy || committee.applications > 0}
                        title={committee.applications > 0 ? 'A committee with applications can’t be deleted' : undefined}
                    >
                        Delete committee
                    </Button>
                )}
                {committee && committee.applications > 0 && (
                    <p className="w-full text-xs text-muted-foreground">
                        It can&apos;t be deleted because it has applications, which would disappear from the admin pages with it.
                    </p>
                )}
                {status && (
                    <p className={cn('flex w-full items-center gap-1.5 text-sm', status.kind === 'saved' ? 'text-green-700' : 'text-red-600')}>
                        {status.kind === 'saved' ? <CircleCheck className="size-4" /> : <CircleAlert className="size-4" />}
                        {status.message}
                    </p>
                )}
            </div>

            <AlertDialog open={confirmingDelete} onOpenChange={(open) => !busy && setConfirmingDelete(open)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {committee?.name}?</AlertDialogTitle>
                        <AlertDialogDescription>It disappears from the site and can no longer be applied for. This can’t be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={busy}
                            className="bg-destructive hover:bg-destructive/90 text-white"
                            onClick={(e) => {
                                e.preventDefault()
                                remove()
                            }}
                        >
                            {busy ? 'Deleting…' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

/** Adds a pasted list of roles in one go, since a committee can have dozens of countries. */
function AddSeveralRoles({ existing, onAdd }: { existing: string[]; onAdd: (roles: CommitteeInput['roles']) => void }) {
    const id = useId()
    const [text, setText] = useState('')
    const [difficulty, setDifficulty] = useState(DIFFICULTIES[0])

    const known = new Set(existing.map((role) => role.trim().toLowerCase()))
    const names = [...new Set(text.split(/\n|,|;/).map((name) => name.trim()).filter(Boolean))]
    const fresh = names.filter((name) => !known.has(name.toLowerCase()))
    const skipped = names.length - fresh.length

    return (
        <fieldset className="min-w-0 space-y-3 rounded-md border border-dashed p-4">
            <legend className="px-1 text-sm font-semibold">Add several roles</legend>
            <Label htmlFor={id} className="text-sm font-normal text-muted-foreground">
                One per line (or separated by commas), all at the same difficulty. Roles already in the list are skipped.
            </Label>
            <Textarea id={id} value={text} onChange={(e) => setText(e.target.value)} placeholder={'France\nGermany\nKenya'} className="min-h-24" />
            <div className="flex flex-wrap items-center gap-2">
                <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="w-36" aria-label="Difficulty of the roles being added">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {DIFFICULTIES.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!fresh.length}
                    onClick={() => {
                        onAdd(fresh.map((role) => ({ role, difficulty })))
                        setText('')
                    }}
                >
                    <IconPlus /> Add {fresh.length || ''} {fresh.length === 1 ? 'role' : 'roles'}
                </Button>
                {skipped > 0 && <span className="text-xs text-muted-foreground">{skipped} already in the list</span>}
            </div>
        </fieldset>
    )
}
