"use client"
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { capitalize, statusClass } from '@/lib/utils'
import { getApplications } from './api'
import type { Application } from './types'

export default function ApplicationsList() {
    const [applications, setApplications] = useState<Application[] | null>(null)

    const { data: session } = useSession()
    const email = session?.user?.email

    useEffect(() => {
        if (!email) return
        getApplications(email)
            .then((data) => setApplications(data.applications))
            .catch((err) => console.error('Error fetching applications info:', err))
    }, [email])

return (
    <section className="bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
            <div className="@container lg:col-span-3">
                <Card className="p-8 sm:p-12">
                    {applications ? (
                        <div className="space-y-6">
                            {applications.map((app) => (
                                <div key={app.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                    <div className="font-semibold text-lg">{app.committeeName}</div>
                                    <div className="mt-2">
                                        <span className="font-medium">Role:</span> {app.role}
                                    </div>
                                    <div className="mt-1">
                                        <span className="font-medium">Status:</span>{" "}
                                        <span className={statusClass(app.status)}>
                                            {capitalize(app.status)}
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
