"use client"
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CountryDropdown} from '@/components/ui/country-dropdown'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CalendarBirthday from '@/components/calendarBirthday'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function DelegateInfoQuestion({ onSuccess }: { onSuccess?: () => void }) {

    const { data: session } = useSession()

    const [form, setForm] = useState({
        name: '',
        email: '', 
        phone: '',
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
            const res = await fetch('/api/modify/setPeopleInfo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                setSuccess(true)
                if (onSuccess) onSuccess()
            } else {
                const data = await res.json()
                setError(data.message || 'Submission failed')
            }
        } catch (err: any) {
            setError(err.message || 'Submission failed')
        }
        setLoading(false)
    }

    
    const [delegations, setDelegations] = useState<{ id: number, name: string }[]>([])
    
    useEffect(() => {
            const getInfo = async (email: string) => {
                try {
                    const res = await fetch('/api/retrieve/getPeopleInfo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                    })
                    if (res.ok) {
                        const data = await res.json()
                        setForm((prev) => ({
                            ...prev,
                            name: data[0]?.name || session?.user?.name || '',
                            email: session?.user?.email || '',
                            birth: data[0]?.birth || '',
                            phone: data[0]?.phone || '',
                            nationality: data[0]?.nationality || '',
                            delegation: data[0]?.delegation || '',
                            diet: data[0]?.diet || '',
                            notes: data[0]?.notes || '',
                        }))
                    }
                } catch (err) {
                    console.error('Error fetching user info:', err)
                }
            }

        const fetchDelegations = async () => {
            try {
                const res = await fetch('/api/retrieve/getDelegations', { method: 'POST' })
                if (res.ok) {
                    const data = await res.json()
                    setDelegations(data)
                }
            } catch (err) {
                setError('Failed to fetch delegations: ' + err)
            }
        }
        fetchDelegations()
        getInfo(session?.user?.email || "")
    }, [session])

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
                                        placeholder="e.g. john.doe@example.com"
                                        value={session?.user?.email || ''}
                                        readOnly
                                        className="cursor-not-allowed bg-gray-100 text-gray-500"
                                    />
                                </div>
                                <div></div>
                            <div>
                                <Label htmlFor="phone">Phone number</Label>
                                <Input
                                    type="tel"
                                    id="phone"
                                    placeholder="e.g. +420 234 567 890"
                                    required
                                    value={form.phone}
                                    onChange={e => handleChange('phone', e.target.value)}
                                />
                            </div>
                            </div>
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="country">Nationality</Label>
                                    <CountryDropdown
                                        placeholder="Select country"
                                        defaultValue={form.nationality}
                                        onChange={country => handleChange('nationality', country.name)}
                                        />
                                </div>
                                <div>
                                    <Label htmlFor="delegation">Delegation</Label>
                                    <Select required value={form.delegation} onValueChange={val => handleChange('delegation', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a delegation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {delegations.map(d => (
                                                <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="diet">Diet</Label>
                                    <div className="relative flex w-fit items-center">
                                        <Select required value={form.diet} onValueChange={val => handleChange('diet', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your diet" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Omnivore">Omnivore</SelectItem>
                                                <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                                <SelectItem value="Vegan">Vegan</SelectItem>
                                                <SelectItem value="Gluten Free">Gluten Free</SelectItem>
                                                <SelectItem value="Lactose Free">Lactose Free</SelectItem>
                                                <SelectItem value="Withdraw">No Lunch</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-muted-foreground pointer-events-none absolute top-1/2 left-full ml-3 -translate-y-1/2 text-xs whitespace-nowrap">We can't safely accomodate <br />all dietary needs and allergies. <br />Select <u>"No Lunch"</u> if necessary.</p>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="birth">Date of birth</Label>
                                    <CalendarBirthday selected={form.birth} onChange={date => handleChange('birth', date)} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="notes">MUN achievements, conferences attended & notes</Label>
                                <Textarea
                                    id="notes"
                                    required
                                    minLength={20}
                                    placeholder='For example "I have attended 3 MUN conferences and won Best Delegate in one of them. I am also the SG of ExampleMUN"'
                                    rows={3}
                                    value={form.notes}
                                    onChange={e => handleChange('notes', e.target.value)}
                                />
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