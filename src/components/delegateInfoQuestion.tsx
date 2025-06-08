"use client"
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CalendarBirthday from '@/components/calendarBirthday'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function DelegateInfoQuestion() {

    const { data: session } = useSession()

    const [form, setForm] = useState({
        name: '',
        email: session?.user?.email, 
        nationality: '',
        delegation: '',
        diet: '',
        birth: '',
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
            const res = await fetch('/api/setDelegateInfo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                setSuccess(true)
            } else {
                const data = await res.json()
                setError(data.message || 'Submission failed')
            }
        } catch (err: any) {
            setError(err.message || 'Submission failed')
        }
        setLoading(false)
    }

    return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0">
                <form onSubmit={handleSubmit} className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                        <h3 className="text-xl font-semibold">Let's get to know a little more about you</h3>
                        <p className="text-sm">In order to be able to properly get things ready for you, we first need to learn a bit more about you.</p>

                        <div className="**:[&>label]:block mt-6 space-y-6 *:space-y-3">
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="name" className="space-y-2">Full name</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        required
                                        value={form.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        required
                                        value={session?.user?.email || ''}
                                        readOnly
                                        className="cursor-not-allowed bg-gray-100 text-gray-500"
                                    />
                                </div>
                            </div>
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="country">Nationality</Label>
                                    <Select onValueChange={val => handleChange('nationality', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DR Congo">DR Congo</SelectItem>
                                            <SelectItem value="United States">United States</SelectItem>
                                            <SelectItem value="France">France</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="delegation">Delegation</Label>
                                    <Select onValueChange={val => handleChange('delegation', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a delegation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ECP">ECP</SelectItem>
                                            <SelectItem value="ISP">ISP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="diet">Diet</Label>
                                    <Select onValueChange={val => handleChange('diet', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your diet" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="None">None</SelectItem>
                                            <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                            <SelectItem value="Vegan">Vegan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="birth">Date of birth</Label>
                                    <CalendarBirthday onChange={date => handleChange('birth', date)} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    rows={3}
                                    value={form.notes}
                                    onChange={e => handleChange('notes', e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
                            {success && <p className="text-green-600">Signup successful!</p>}
                            {error && <p className="text-red-600">{error}</p>}
                        </div>
                    </Card>
                </form>
            </div>
        </section>
    )
}