"use client"
import { Card } from '@/components/ui/card'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function applicationsList({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [applicationsInfo, setApplicationsInfo] = useState<any>(null)

    const { data: session } = useSession()

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch('/api/getApplications', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: session?.user?.email }), 
                })
                if (res.ok) {
                    const data = await res.json()
                    setApplicationsInfo(data)
                }
            } catch (err) {
                console.error('Error fetching applications info:', err)
            }
        }
        fetchApplications()
    }, [session])

return (
    <section className="bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
            <div className="@container lg:col-span-3">
                <Card className="p-8 sm:p-12">
                    {applicationsInfo && applicationsInfo.applications ? (
                        <div className="space-y-6">
                            {applicationsInfo.applications.map((app: any) => (
                                <div key={app.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                    <div className="font-semibold text-lg">{app.committeeName}</div>
                                    <div className="mt-2">
                                        <span className="font-medium">Role:</span> {app.role}
                                    </div>
                                    <div className="mt-1">
                                        <span className="font-medium">Status:</span>{" "}
                                        <span className={
                                            app.status === "pending" ? "text-yellow-600" :
                                            app.status === "accepted" ? "text-green-600" :
                                            app.status === "rejected" ? "text-red-600" : ""
                                        }>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span>Loading applications...</span>
                    )}
                </Card>
            </div>
        </div>
    </section>
    )
}