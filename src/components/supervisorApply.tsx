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
        type: 'supervisor',
        delegation: '',
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
            const res = await fetch('/api/modify/setApplication', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: form.email,
                        type: form.type,
                        committee: form.delegation,
                    }),
            })

            // Check if all succeeded
            if (res.ok) {
                setSuccess(true)
                if (onSuccess) onSuccess()
            } else {
                // Get the first error message
                const data = await res.json()
                setError(data?.message || 'Submission failed')
            }


                      const res_setpayment = await fetch('/api/modify/setPayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: form.email,
              valueCzk: process.env.NEXT_PUBLIC_PRICE_CZK_SUPERVISOR,
              valueEur: process.env.NEXT_PUBLIC_PRICE_EUR_SUPERVISOR,
            }),
          });
            if (!res_setpayment.ok) {
            const error = await res_setpayment.text();
            throw new Error(`Failed to set payment: ${error}`);
          }

        } catch (err: any) {
            setError(err.message || 'Submission failed')
        }
        setLoading(false)
    }

    return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
                <form onSubmit={handleSubmit} className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                        <h3 className="text-xl font-semibold">The time has come: it's time to apply!</h3>
                        <p className="text-sm">Please contact us at <a href="mailto:plismun@parklane-is.com">plismun@parklane-is.com</a>.</p>
                        <div className="**:[&>label]:block mt-1 space-y-6">
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div className="col-span-2">
                                    <Label htmlFor="notes">What delegation do you represent?</Label>
                                    <Input
                                        required
                                        id="delegation"
                                        value={form.delegation}
                                        onChange={e => handleChange('delegation', e.target.value)}
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