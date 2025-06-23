"use client"
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function DelegateApply({ onSuccess }: { onSuccess?: () => void }) {

    const { data: session } = useSession()

    useEffect(() => {
        if (session?.user?.email) {
            setForm(prev => ({ ...prev, email: session?.user?.email as string }))
        }
    }, [session])

    const [form, setForm] = useState({
        email: '',
        type: 'delegate',
        committee1: '',
        role1: '', 
        notes1: '',
        committee2: '',
        role2: '',
        notes2: '',
        committee3: '',
        role3: '',
        notes3: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)
        try {
            // Prepare the three application payloads
            const applications = [
                { ...form, committee: form.committee1, role: form.role1, notes: form.notes1 },
                { ...form, committee: form.committee2, role: form.role2, notes: form.notes2 },
                { ...form, committee: form.committee3, role: form.role3, notes: form.notes3 },
            ]

            // Send all three requests in parallel
            const responses = await Promise.all(applications.map(app =>
                fetch('/api/setApplication', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: app.email,
                        type: app.type,
                        committee: app.committee,
                        role: app.role,
                        notes: app.notes,
                    }),
                })
            ))

            // Check if all succeeded
            if (responses.every(res => res.ok)) {
                setSuccess(true)
                if (onSuccess) onSuccess()
            } else {
                // Get the first error message
                const data = await responses[responses.findIndex(res => !res.ok)]?.json()
                setError(data?.message || 'Submission failed')
            }
        } catch (err: any) {
            setError(err.message || 'Submission failed')
        }
        setLoading(false)
    }

    const [committees, setCommittees] = useState<{ id: number, name: string, roles: string }[]>([])

    useEffect(() => {
        const fetchCommittees = async () => {
            try {
                const res = await fetch('/api/getCommittees', { method: 'POST' })
                if (res.ok) {
                    const data = await res.json()
                    setCommittees(data)
                }
            } catch (err) {
                console.error('Error fetching committees:', err)
            }
        }

        fetchCommittees()
    }, [])

    return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0">
                <form onSubmit={handleSubmit} className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                        <h3 className="text-xl font-semibold">The time has come: it's time to apply!</h3>
                        <p className="text-sm">You can leave rows empty if you have a smaller number of choices, or you can fill out this form again if you have more than 3! We hope that your chosen committee & topic don't disappoint you!</p>
                        <div className="**:[&>label]:block mt-1 space-y-6">
                        <h3 className="text-lg font-semibold">Choice 1</h3>
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="delegation">Committee</Label>
                                    <Select required value={form.committee1} onValueChange={val => handleChange('committee1', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a committee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {committees.map(d => (
                                                <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="country">Role</Label>
                                    <Select required value={form.role1} onValueChange={val => handleChange('role1', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                            <SelectContent>
                                                {committees.find(c => c.id.toString() === form.committee1)?.roles && 
                                                    JSON.parse(committees.find(c => c.id.toString() === form.committee1)!.roles).map((role: string, index: number) => (
                                                        <SelectItem key={index} value={role}>{role}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="notes">Why would you like this role? </Label>
                                    <Textarea
                                        required
                                        id="notes"
                                        rows={1}
                                        value={form.notes1}
                                        onChange={e => handleChange('notes1', e.target.value)}
                                    />
                                </div>
                            </div>
                        <h3 className="text-lg font-semibold">Choice 2</h3>
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="delegation">Committee</Label>
                                    <Select value={form.committee2} onValueChange={val => handleChange('committee2', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a committee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {committees.map(d => (
                                                <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="country">Role</Label>
                                    <Select value={form.role2} onValueChange={val => handleChange('role2', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                            <SelectContent>
                                                {committees.find(c => c.id.toString() === form.committee2)?.roles && 
                                                    JSON.parse(committees.find(c => c.id.toString() === form.committee2)!.roles).map((role: string, index: number) => (
                                                        <SelectItem key={index} value={role}>{role}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="notes">Why would you like this role? </Label>
                                    <Textarea
                                        id="notes"
                                        rows={1}
                                        value={form.notes2}
                                        onChange={e => handleChange('notes2', e.target.value)}
                                    />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold">Choice 3</h3>
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="delegation">Committee</Label>
                                    <Select value={form.committee3} onValueChange={val => handleChange('committee3', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a committee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {committees.map(d => (
                                                <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="country">Role</Label>
                                    <Select value={form.role3} onValueChange={val => handleChange('role3', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                            <SelectContent>
                                                {committees.find(c => c.id.toString() === form.committee3)?.roles && 
                                                    JSON.parse(committees.find(c => c.id.toString() === form.committee3)!.roles).map((role: string, index: number) => (
                                                        <SelectItem key={index} value={role}>{role}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="notes">Why would you like this role? </Label>
                                    <Textarea
                                        id="notes"
                                        rows={1}
                                        value={form.notes3}
                                        onChange={e => handleChange('notes3', e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button className="cursor-pointer" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
                            {success && <p className="text-green-600">Signup successful!</p>}
                            {error && <p className="text-red-600">{error}</p>}
                        </div>
                    </Card>
                </form>
            </div>
        </section>
    )
}