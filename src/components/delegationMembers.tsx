"use client"
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { paymentStatusLabel } from '@/lib/utils'

type SupervisedDelegation = {
    id: number
    name: string
    shorthand: string
    country: string
}

type MemberApplication = {
    id: number
    type: string
    committeeName: string
    role: string
    status: string
}

type Member = {
    id: number
    email: string
    name: string
    birth: string
    phone: string
    nationality: string
    diet: string
    notes: string
    valueCzk: number | null
    valueEur: number | null
    paymentStatus: boolean
    applications: MemberApplication[]
}

const statusClass = (status: string) =>
    status === "pending" ? "text-yellow-600" :
    status === "accepted" ? "text-green-600" :
    status === "rejected" ? "text-red-600" : ""

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export default function DelegationMembers() {
    const [delegations, setDelegations] = useState<SupervisedDelegation[]>([])
    const [selectedId, setSelectedId] = useState<string>('')
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [membersLoading, setMembersLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDelegations = async () => {
            try {
                const res = await fetch('/api/retrieve/getSupervisedDelegations', { method: 'POST' })
                if (!res.ok) {
                    const data = await res.json().catch(() => null)
                    throw new Error(data?.message || 'Failed to fetch your delegations')
                }
                const data = await res.json()
                setDelegations(data.delegations)
                if (data.delegations.length) setSelectedId(data.delegations[0].id.toString())
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchDelegations()
    }, [])

    useEffect(() => {
        if (!selectedId) return
        const fetchMembers = async () => {
            setMembersLoading(true)
            try {
                const res = await fetch('/api/retrieve/getDelegationMembers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ delegationId: Number(selectedId) }),
                })
                if (!res.ok) {
                    const data = await res.json().catch(() => null)
                    throw new Error(data?.message || 'Failed to fetch delegation members')
                }
                const data = await res.json()
                setMembers(data.members)
                setError(null)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setMembersLoading(false)
            }
        }
        fetchMembers()
    }, [selectedId])

    if (loading) return <div>Loading...</div>
    if (!delegations.length && !error) return <div>You are not an accepted leader of any delegation.</div>

    const delegation = delegations.find(d => d.id.toString() === selectedId)
    const paidCount = members.filter(m => m.paymentStatus).length
    const acceptedCount = members.filter(m => m.applications.some(a => a.status === 'accepted')).length

    return (
    <section className="bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
            <div className="@container lg:col-span-3">
                <Card className="p-8 sm:p-12">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-semibold">{delegation ? `${delegation.name} (${delegation.shorthand})` : 'My delegation'}</h3>
                            {delegation && <p className="text-sm text-muted-foreground">{delegation.country}</p>}
                        </div>
                        {delegations.length > 1 && (
                            <div className="space-y-2">
                                <Label>Delegation</Label>
                                <Select value={selectedId} onValueChange={setSelectedId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a delegation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {delegations.map(d => (
                                            <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-600">{error}</p>}

                    {membersLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-6 text-sm">
                                <div><span className="font-medium">Members:</span> {members.length}</div>
                                <div><span className="font-medium">Paid:</span> {paidCount} / {members.length}</div>
                                <div><span className="font-medium">Accepted applications:</span> {acceptedCount} / {members.length}</div>
                            </div>
                            {members.length ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-200 rounded">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="px-2 py-1 border">Name</th>
                                                <th className="px-2 py-1 border">Email</th>
                                                <th className="px-2 py-1 border">Phone</th>
                                                <th className="px-2 py-1 border">Birth</th>
                                                <th className="px-2 py-1 border">Nationality</th>
                                                <th className="px-2 py-1 border">Diet</th>
                                                <th className="px-2 py-1 border">Notes</th>
                                                <th className="px-2 py-1 border">Applications</th>
                                                <th className="px-2 py-1 border">Payment CZK</th>
                                                <th className="px-2 py-1 border">Payment EUR</th>
                                                <th className="px-2 py-1 border">Payment Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {members.map(member => (
                                                <tr key={member.id} className="border-t">
                                                    <td className="px-2 py-1 border">{member.name}</td>
                                                    <td className="px-2 py-1 border">
                                                        <a href={`mailto:${member.email}`} className="underline">{member.email}</a>
                                                    </td>
                                                    <td className="px-2 py-1 border">{member.phone}</td>
                                                    <td className="px-2 py-1 border">{member.birth}</td>
                                                    <td className="px-2 py-1 border">{member.nationality}</td>
                                                    <td className="px-2 py-1 border">{member.diet}</td>
                                                    <td className="px-2 py-1 border">
                                                        {member.notes ? (
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button size="sm" variant="outline">View</Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent>{member.notes}</PopoverContent>
                                                            </Popover>
                                                        ) : null}
                                                    </td>
                                                    <td className="px-2 py-1 border">
                                                        {member.applications.length ? member.applications.map(app => (
                                                            <div key={`${app.type}-${app.id}`} className="whitespace-nowrap">
                                                                {app.type === 'supervisor' ? 'Supervisor' : `${app.committeeName} – ${app.role}`}{" "}
                                                                <span className={statusClass(app.status)}>({capitalize(app.status)})</span>
                                                            </div>
                                                        )) : <span className="text-muted-foreground">None</span>}
                                                    </td>
                                                    <td className="px-2 py-1 border">{member.valueCzk ?? ''}</td>
                                                    <td className="px-2 py-1 border">{member.valueEur ?? ''}</td>
                                                    <td className={`px-2 py-1 border ${member.paymentStatus ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {paymentStatusLabel(member.paymentStatus)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm">Nobody has signed up under this delegation yet.</p>
                            )}
                        </>
                    )}
                </Card>
            </div>
        </div>
    </section>
    )
}
