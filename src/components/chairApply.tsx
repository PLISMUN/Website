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

export default function ChairApply({ onSuccess }: { onSuccess?: () => void }) {

    const { data: session } = useSession()

    useEffect(() => {
        if (session?.user?.email) {
            setForm(prev => ({ ...prev, email: session?.user?.email as string }))
        }
    }, [session])

    const [form, setForm] = useState({
        email: '',
        type: 'chair',
        committee: '',
        role: 'chair',
        notes: '',
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
                { ...form, committee: form.committee, notes: form.notes },
            ]

            // Send all three requests in parallel
            const responses = await Promise.all(applications.map(app =>
                fetch('/api/modify/setApplication', {
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

    const [committees, setCommittees] = useState<{ id: number, name: string }[]>([])

    useEffect(() => {
        const fetchCommittees = async () => {
            try {
                const res = await fetch('/api/retrieve/getCommittees', { method: 'POST' })
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
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
                <form onSubmit={handleSubmit} className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                        <h3 className="text-xl font-semibold">The time has come: it's time to apply!</h3>
                        <p className="text-sm">We hope that your chosen committee & topic don't disappoint you! As a chair applicant, we ask you to withold on paying until you're accepted. Your due ammount will be adjusted automatically. You can also apply to be a delegate in case your chair aspirations fail!</p>
                        <div className="**:[&>label]:block mt-1 space-y-6">
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="delegation">Committee</Label>
                                    <Select required value={form.committee} onValueChange={val => handleChange('committee', val)}>
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
                                <div className="col-span-2">
                                    <Label htmlFor="notes">Why would you like to chair? Any other things to note? </Label>
                                    <Textarea
                                        required
                                        id="notes"
                                        rows={1}
                                        value={form.notes}
                                        onChange={e => handleChange('notes', e.target.value)}
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