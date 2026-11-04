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
import { parseCommitteeRoles, type Committee } from '@/features/committees/types'
import { submitApplication } from './api'

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
                { ...form, committee: form.committee1, role: form.role1, notes: `Choice 1: ${form.notes1}` },
                { ...form, committee: form.committee2, role: form.role2, notes: `Choice 2: ${form.notes2}` },
                { ...form, committee: form.committee3, role: form.role3, notes: `Choice 3: ${form.notes3}` },
            ]

            // Send all three requests in parallel
            await Promise.all(applications.map(app =>
                submitApplication({
                    email: app.email,
                    type: app.type,
                    committee: app.committee,
                    role: app.role,
                    notes: app.notes,
                })
            ))

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
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0">
                <form onSubmit={handleSubmit} className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                        <h3 className="text-xl font-semibold">The time has come: it&apos;s time to apply!</h3>
                        <p className="text-sm">Your application won&apos;t be considered and your roles won&apos;t be assigned until your payment is made. We hope that your chosen committee & topic don&apos;t disappoint you!</p>
                        <div className="**:[&>label]:block mt-1 space-y-6">
                            <ChoiceSection
                                choiceNumber={1}
                                committeeValue={form.committee1}
                                roleValue={form.role1}
                                notesValue={form.notes1}
                                required={true}
                                committees={committees}
                                handleChange={handleChange}
                            />
                            <ChoiceSection
                                choiceNumber={2}
                                committeeValue={form.committee2}
                                roleValue={form.role2}
                                notesValue={form.notes2}
                                committees={committees}
                                handleChange={handleChange}
                            />
                            <ChoiceSection
                                choiceNumber={3}
                                committeeValue={form.committee3}
                                roleValue={form.role3}
                                notesValue={form.notes3}
                                committees={committees}
                                handleChange={handleChange}
                            />
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


    function ChoiceSection({
        choiceNumber,
        committeeValue,
        roleValue,
        notesValue,
        required = true,
        committees,
        handleChange,
    }: {
        choiceNumber: number,
        committeeValue: string,
        roleValue: string,
        notesValue: string,
        required?: boolean,
        committees: Committee[],
        handleChange: (field: string, value: string) => void,
    }) {
        return (
            <>
                <h3 className="text-lg font-semibold">{`Choice ${choiceNumber}`}</h3>
                <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                    <div>
                        <Label htmlFor={`committee${choiceNumber}`}>Committee</Label>
                        <Select
                            required={required}
                            value={committeeValue}
                            onValueChange={val => handleChange(`committee${choiceNumber}`, val)}
                            
                        >
                            <SelectTrigger className="max-w-[100%]">
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
                        <Label htmlFor={`role${choiceNumber}`}>Role</Label>
                        <Select
                            required={required}
                            value={roleValue}
                            onValueChange={val => handleChange(`role${choiceNumber}`, val)}
                        >
                            <SelectTrigger className="max-w-[100%]">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {(() => {
                                    const committee = committees.find(c => c.id.toString() === committeeValue)
                                    if (!committee?.roles) return null
                                    return parseCommitteeRoles(committee.roles).map((roleObj, index) => (
                                        <SelectItem key={index} value={roleObj.role}>
                                            {roleObj.role}
                                            {roleObj.difficulty ? ` (${roleObj.difficulty})` : ""}
                                        </SelectItem>
                                    ))
                                })()}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor={`notes${choiceNumber}`}>Why would you like this role? Any other things to note?</Label>
                        <Textarea
                            required={required}
                            id={`notes${choiceNumber}`}
                            rows={3}
                            minLength={250}
                            value={notesValue}
                            onChange={e => handleChange(`notes${choiceNumber}`, e.target.value)}
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                            {notesValue.length < 250 && (
                                <span>{250 - notesValue.length} more characters required</span>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
    }