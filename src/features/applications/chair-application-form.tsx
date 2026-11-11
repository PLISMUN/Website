"use client"
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { errorMessage } from '@/lib/api-client'
import { getCommittees } from '@/features/committees/api'
import type { Committee } from '@/features/committees/types'
import { submitApplication } from './api'

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
            await submitApplication({
                email: form.email,
                type: form.type,
                committee: form.committee,
                role: form.role,
                notes: form.notes,
            })
            setSuccess(true)
            if (onSuccess) onSuccess()
        } catch (err) {
            setError(errorMessage(err, 'Submission failed'))
        }
        setLoading(false)
    }

    const [committees, setCommittees] = useState<Committee[]>([])

    useEffect(() => {
        getCommittees()
            .then(setCommittees)
            .catch((err) => console.error('Error fetching committees:', err))
    }, [])

    return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
                <form onSubmit={handleSubmit} className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                        <h3 className="text-xl font-semibold">The time has come: it&apos;s time to apply!</h3>
                        <p className="text-sm">We hope that your chosen committee & topic don&apos;t disappoint you! As a chair applicant, we ask you to withold on paying until you&apos;re accepted. Your due ammount will be adjusted automatically. You can also apply to be a delegate in case your chair aspirations fail!</p>
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