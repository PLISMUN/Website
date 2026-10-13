"use client"
import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { CountryDropdown } from '@/components/ui/country-dropdown'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import DelegationMembers from '@/components/delegationMembers'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

type Delegation = {
    id: number
    name: string
    shorthand: string
    country: string
    notes: string
    memberCount: number
}

type SupervisorApplication = {
    id: number
    userId: number
    delegation: string
    status: string
    email: string
    name: string | null
}

type SupervisorCandidate = {
    id: number
    email: string
    name: string | null
    isSupervisor: boolean
}

type DelegationForm = {
    id?: number
    name: string
    shorthand: string
    country: string
    notes: string
    supervisorId?: number
    acceptSupervisor: boolean
}

const emptyForm: DelegationForm = {
    name: '',
    shorthand: '',
    country: '',
    notes: '',
    acceptSupervisor: false,
}

const statusClass = (status: string) =>
    status === "pending" ? "text-yellow-600" :
    status === "accepted" ? "text-green-600" :
    status === "rejected" ? "text-red-600" : ""

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const personLabel = (name: string | null, email: string) => name ? `${name} (${email})` : email

// Suggest a shorthand from the delegation name, e.g. "Prague International School" -> "PIS"
const suggestShorthand = (name: string) =>
    name.split(/\s+/).filter(Boolean).map(word => word[0]).join('').toUpperCase().slice(0, 20)

const postJson = async (url: string, body: object, fallbackError: string) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.message || fallbackError)
    return data
}

// Accepts the supervisor application and emails the applicant
const acceptSupervisorApplication = (supervisorId: number) =>
    postJson('/api/modify/acceptApplication', { [supervisorId]: true }, 'Failed to accept the supervisor application')

const setDelegationSupervisor = (body: object) =>
    postJson('/api/modify/setDelegationSupervisor', body, 'Failed to update supervisors')

export default function DelegationsAdmin() {
    const [delegations, setDelegations] = useState<Delegation[]>([])
    const [supervisors, setSupervisors] = useState<SupervisorApplication[]>([])
    const [users, setUsers] = useState<SupervisorCandidate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<DelegationForm | null>(null)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    const [viewing, setViewing] = useState<Delegation | null>(null)

    const [managing, setManaging] = useState<Delegation | null>(null)
    const [addUserId, setAddUserId] = useState('')
    const [supervisorBusy, setSupervisorBusy] = useState(false)
    const [supervisorError, setSupervisorError] = useState<string | null>(null)

    const [linking, setLinking] = useState<SupervisorApplication | null>(null)
    const [linkDelegationId, setLinkDelegationId] = useState('')
    const [linkAccept, setLinkAccept] = useState(true)

    const fetchDelegations = async () => {
        try {
            const res = await fetch('/api/retrieve/getAllDelegations', { method: 'POST' })
            if (!res.ok) {
                const data = await res.json().catch(() => null)
                throw new Error(data?.message || 'Failed to fetch delegations')
            }
            const data = await res.json()
            setDelegations(data.delegations)
            setSupervisors(data.supervisors)
            setUsers(data.users)
            setError(null)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDelegations()
    }, [])

    const delegationNames = useMemo(() => new Set(delegations.map(d => d.name)), [delegations])

    // Supervisor applications whose requested delegation doesn't exist yet
    const unlinkedSupervisors = useMemo(
        () => supervisors.filter(s => !delegationNames.has(s.delegation) && s.status !== 'rejected'),
        [supervisors, delegationNames]
    )

    const supervisorsByDelegation = useMemo(() => {
        const map: Record<string, SupervisorApplication[]> = {}
        for (const s of supervisors) {
            // Rejected applications are removed supervisors
            if (!delegationNames.has(s.delegation) || s.status === 'rejected') continue
            if (!map[s.delegation]) map[s.delegation] = []
            map[s.delegation].push(s)
        }
        return map
    }, [supervisors, delegationNames])

    const managingSupervisors = managing ? supervisorsByDelegation[managing.name] ?? [] : []
    // Users that can still be added as a supervisor of the delegation being managed
    const addableUsers = users.filter(u => !managingSupervisors.some(s => s.userId === u.id))
    const supervisorUsers = addableUsers.filter(u => u.isSupervisor)
    const otherUsers = addableUsers.filter(u => !u.isSupervisor)

    const openCreate = () => {
        setFormError(null)
        setForm({ ...emptyForm })
    }

    const openCreateFromApplication = (application: SupervisorApplication) => {
        setFormError(null)
        setForm({
            ...emptyForm,
            name: application.delegation,
            shorthand: suggestShorthand(application.delegation),
            supervisorId: application.id,
            acceptSupervisor: application.status !== 'accepted',
        })
    }

    const openEdit = (delegation: Delegation) => {
        setFormError(null)
        setForm({
            id: delegation.id,
            name: delegation.name,
            shorthand: delegation.shorthand,
            country: delegation.country,
            notes: delegation.notes,
            acceptSupervisor: false,
        })
    }

    const handleFormChange = (field: keyof DelegationForm, value: string | boolean) => {
        setForm(prev => prev ? { ...prev, [field]: value } : prev)
    }

    // Links a supervisor application to a delegation, optionally accepting it (which emails the applicant)
    const linkSupervisor = async (delegationId: number, supervisorId: number, accept: boolean) => {
        await setDelegationSupervisor({ action: 'link', delegationId, supervisorId })
        if (accept) await acceptSupervisorApplication(supervisorId)
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form) return
        if (!form.country) return setFormError('Please select a country')

        setSaving(true)
        setFormError(null)
        try {
            const data = await postJson('/api/modify/setDelegation', {
                id: form.id,
                name: form.name,
                shorthand: form.shorthand,
                country: form.country,
                notes: form.notes,
            }, 'Failed to save delegation')
            if (form.supervisorId !== undefined) {
                // A retry after a failed link should update the delegation just created, not create another
                setForm(prev => prev ? { ...prev, id: data.id } : prev)
                await linkSupervisor(data.id, form.supervisorId, form.acceptSupervisor)
            }
            setForm(null)
        } catch (err: any) {
            setFormError(err.message)
        } finally {
            await fetchDelegations()
        }
        setSaving(false)
    }

    const openLink = (application: SupervisorApplication) => {
        setFormError(null)
        setLinkDelegationId('')
        setLinkAccept(application.status !== 'accepted')
        setLinking(application)
    }

    const handleLinkSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!linking) return
        const delegation = delegations.find(d => d.id.toString() === linkDelegationId)
        if (!delegation) return setFormError('Please select a delegation')

        setSaving(true)
        setFormError(null)
        try {
            await linkSupervisor(delegation.id, linking.id, linkAccept)
            setLinking(null)
        } catch (err: any) {
            setFormError(err.message)
        } finally {
            await fetchDelegations()
        }
        setSaving(false)
    }

    const openManage = (delegation: Delegation) => {
        setSupervisorError(null)
        setAddUserId('')
        setManaging(delegation)
    }

    const runSupervisorAction = async (action: () => Promise<unknown>) => {
        setSupervisorBusy(true)
        setSupervisorError(null)
        try {
            await action()
        } catch (err: any) {
            setSupervisorError(err.message)
        } finally {
            await fetchDelegations()
        }
        setSupervisorBusy(false)
    }

    const handleAddSupervisor = (e: React.FormEvent) => {
        e.preventDefault()
        if (!managing || !addUserId) return
        runSupervisorAction(async () => {
            await setDelegationSupervisor({ action: 'add', delegationId: managing.id, userId: Number(addUserId) })
            setAddUserId('')
        })
    }

    const formApplication = form?.supervisorId !== undefined
        ? supervisors.find(s => s.id === form.supervisorId)
        : undefined

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-600">{error}</div>

    return (
    <section className="bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen space-y-4">
            <div className="@container lg:col-span-3">
                <Card className="p-8 sm:p-12">
                    <div>
                        <h3 className="text-xl font-semibold">Supervisor applications without a delegation</h3>
                        <p className="text-sm text-muted-foreground">
                            Supervisor (delegation leader / teacher) applications whose delegation doesn&apos;t exist yet. Create the delegation, or link the application to an existing one.
                        </p>
                    </div>
                    {unlinkedSupervisors.length ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-2 py-1 border">ID</th>
                                        <th className="px-2 py-1 border">Applicant</th>
                                        <th className="px-2 py-1 border">Requested delegation</th>
                                        <th className="px-2 py-1 border">Status</th>
                                        <th className="px-2 py-1 border"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unlinkedSupervisors.map(application => (
                                        <tr key={application.id} className="border-t">
                                            <td className="px-2 py-1 border">{application.id}</td>
                                            <td className="px-2 py-1 border">{personLabel(application.name, application.email)}</td>
                                            <td className="px-2 py-1 border">{application.delegation}</td>
                                            <td className={`px-2 py-1 border ${statusClass(application.status)}`}>{capitalize(application.status)}</td>
                                            <td className="px-2 py-1 border whitespace-nowrap">
                                                <Button size="sm" onClick={() => openCreateFromApplication(application)}>Create delegation</Button>
                                                <Button size="sm" variant="ghost" onClick={() => openLink(application)} disabled={!delegations.length}>Link to existing</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm">All supervisor applications are linked to a delegation.</p>
                    )}
                </Card>
            </div>

            <div className="@container lg:col-span-3">
                <Card className="p-8 sm:p-12">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-xl font-semibold">Delegations</h3>
                        <Button onClick={openCreate}>New delegation</Button>
                    </div>
                    {delegations.length ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-2 py-1 border">ID</th>
                                        <th className="px-2 py-1 border">Name</th>
                                        <th className="px-2 py-1 border">Shorthand</th>
                                        <th className="px-2 py-1 border">Country</th>
                                        <th className="px-2 py-1 border">Supervisors</th>
                                        <th className="px-2 py-1 border">Members</th>
                                        <th className="px-2 py-1 border">Notes</th>
                                        <th className="px-2 py-1 border"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {delegations.map(delegation => (
                                        <tr key={delegation.id} className="border-t">
                                            <td className="px-2 py-1 border">{delegation.id}</td>
                                            <td className="px-2 py-1 border">{delegation.name}</td>
                                            <td className="px-2 py-1 border">{delegation.shorthand}</td>
                                            <td className="px-2 py-1 border">{delegation.country}</td>
                                            <td className="px-2 py-1 border">
                                                {supervisorsByDelegation[delegation.name]?.map(application => (
                                                    <div key={application.id}>
                                                        {application.name || application.email}{" "}
                                                        <span className={statusClass(application.status)}>({application.status})</span>
                                                    </div>
                                                )) ?? <span className="text-muted-foreground">None</span>}
                                            </td>
                                            <td className="px-2 py-1 border">{delegation.memberCount}</td>
                                            <td className="px-2 py-1 border">
                                                {delegation.notes ? (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button size="sm" variant="outline">View</Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent>{delegation.notes}</PopoverContent>
                                                    </Popover>
                                                ) : null}
                                            </td>
                                            <td className="px-2 py-1 border whitespace-nowrap">
                                                <Button size="sm" variant="outline" onClick={() => setViewing(delegation)}>Details</Button>
                                                <Button size="sm" variant="ghost" onClick={() => openManage(delegation)}>Supervisors</Button>
                                                <Button size="sm" variant="ghost" onClick={() => openEdit(delegation)}>Edit</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm">No delegations yet.</p>
                    )}
                </Card>
            </div>
        </div>

        <Dialog open={!!form} onOpenChange={open => { if (!open && !saving) setForm(null) }}>
            <DialogContent>
                {form && (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>{form.id !== undefined ? 'Edit delegation' : 'New delegation'}</DialogTitle>
                            {formApplication && (
                                <DialogDescription>
                                    From the supervisor application of {personLabel(formApplication.name, formApplication.email)}, who will be linked as a supervisor.
                                </DialogDescription>
                            )}
                            {form.id !== undefined && (
                                <DialogDescription>
                                    Renaming updates the delegation on every member and supervisor.
                                </DialogDescription>
                            )}
                        </DialogHeader>
                        <div className="space-y-2">
                            <Label htmlFor="delegation-name">Name</Label>
                            <Input
                                required
                                id="delegation-name"
                                maxLength={100}
                                value={form.name}
                                onChange={e => handleFormChange('name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="delegation-shorthand">Shorthand</Label>
                            <Input
                                required
                                id="delegation-shorthand"
                                maxLength={20}
                                value={form.shorthand}
                                onChange={e => handleFormChange('shorthand', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Country</Label>
                            <CountryDropdown
                                placeholder="Select country"
                                defaultValue={form.country}
                                onChange={country => handleFormChange('country', country.name)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="delegation-notes">Notes</Label>
                            <Textarea
                                id="delegation-notes"
                                rows={3}
                                maxLength={1000}
                                value={form.notes}
                                onChange={e => handleFormChange('notes', e.target.value)}
                            />
                        </div>
                        {formApplication && formApplication.status !== 'accepted' && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="delegation-accept"
                                    checked={form.acceptSupervisor}
                                    onCheckedChange={checked => handleFormChange('acceptSupervisor', checked === true)}
                                />
                                <Label htmlFor="delegation-accept">Accept the supervisor application and email the applicant</Label>
                            </div>
                        )}
                        {formError && <p className="text-red-600 text-sm">{formError}</p>}
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setForm(null)} disabled={saving}>Cancel</Button>
                            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>

        <Dialog open={!!viewing} onOpenChange={open => { if (!open) setViewing(null) }}>
            <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Delegation details</DialogTitle>
                    <DialogDescription>What the delegation&apos;s supervisors see on their My Delegation page.</DialogDescription>
                </DialogHeader>
                {viewing && <DelegationMembers key={viewing.id} delegationId={viewing.id} />}
            </DialogContent>
        </Dialog>

        <Dialog open={!!managing} onOpenChange={open => { if (!open && !supervisorBusy) setManaging(null) }}>
            <DialogContent className="sm:max-w-2xl">
                {managing && (
                    <div className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Supervisors of {managing.name}</DialogTitle>
                            <DialogDescription>
                                Accepted supervisors can see every member of this delegation on their My Delegation page.
                            </DialogDescription>
                        </DialogHeader>
                        {managingSupervisors.length ? (
                            <table className="min-w-full border border-gray-200 rounded">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-2 py-1 border">Supervisor</th>
                                        <th className="px-2 py-1 border">Status</th>
                                        <th className="px-2 py-1 border"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {managingSupervisors.map(supervisor => (
                                        <tr key={supervisor.id} className="border-t">
                                            <td className="px-2 py-1 border">{personLabel(supervisor.name, supervisor.email)}</td>
                                            <td className={`px-2 py-1 border ${statusClass(supervisor.status)}`}>{capitalize(supervisor.status)}</td>
                                            <td className="px-2 py-1 border whitespace-nowrap">
                                                {supervisor.status !== 'accepted' && (
                                                    <Button
                                                        size="sm"
                                                        disabled={supervisorBusy}
                                                        title="Accept and email the applicant"
                                                        onClick={() => runSupervisorAction(() => acceptSupervisorApplication(supervisor.id))}
                                                    >
                                                        Accept
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    disabled={supervisorBusy}
                                                    onClick={() => runSupervisorAction(() => setDelegationSupervisor({ action: 'remove', supervisorId: supervisor.id }))}
                                                >
                                                    Remove
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm">This delegation has no supervisors yet.</p>
                        )}
                        <form onSubmit={handleAddSupervisor} className="flex items-end gap-2">
                            <div className="flex-1 space-y-2">
                                <Label>Add supervisor</Label>
                                <Select value={addUserId} onValueChange={setAddUserId}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {supervisorUsers.length > 0 && (
                                            <SelectGroup>
                                                <SelectLabel>Supervisor applicants</SelectLabel>
                                                {supervisorUsers.map(u => (
                                                    <SelectItem key={u.id} value={u.id.toString()}>{personLabel(u.name, u.email)}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        )}
                                        {otherUsers.length > 0 && (
                                            <SelectGroup>
                                                <SelectLabel>Other users</SelectLabel>
                                                {otherUsers.map(u => (
                                                    <SelectItem key={u.id} value={u.id.toString()}>{personLabel(u.name, u.email)}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" disabled={supervisorBusy || !addUserId}>Add</Button>
                        </form>
                        <p className="text-xs text-muted-foreground">
                            Added users become accepted supervisors immediately, without an email.
                        </p>
                        {supervisorError && <p className="text-red-600 text-sm">{supervisorError}</p>}
                    </div>
                )}
            </DialogContent>
        </Dialog>

        <Dialog open={!!linking} onOpenChange={open => { if (!open && !saving) setLinking(null) }}>
            <DialogContent>
                {linking && (
                    <form onSubmit={handleLinkSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Link to existing delegation</DialogTitle>
                            <DialogDescription>
                                {personLabel(linking.name, linking.email)} applied for &quot;{linking.delegation}&quot;.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                            <Label>Delegation</Label>
                            <Select value={linkDelegationId} onValueChange={setLinkDelegationId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a delegation" />
                                </SelectTrigger>
                                <SelectContent>
                                    {delegations.map(d => (
                                        <SelectItem key={d.id} value={d.id.toString()}>{d.name} ({d.shorthand})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {linking.status !== 'accepted' && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="link-accept"
                                    checked={linkAccept}
                                    onCheckedChange={checked => setLinkAccept(checked === true)}
                                />
                                <Label htmlFor="link-accept">Accept the supervisor application and email the applicant</Label>
                            </div>
                        )}
                        {formError && <p className="text-red-600 text-sm">{formError}</p>}
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setLinking(null)} disabled={saving}>Cancel</Button>
                            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Link'}</Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    </section>
    )
}
