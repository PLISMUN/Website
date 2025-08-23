"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

import { useSession } from 'next-auth/react'
import { useRouter } from "next/navigation"
import { useEffect } from 'react'
import { useState } from "react"

import { signIn } from "next-auth/react"

export default function ForgotPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/user/dashboard")
        }
    }, [status, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        const password = "Null"

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        })

        if (res?.error) {
            if (res.error === "Invalid password") {
                setSuccess(true)
            } else {
                setError(res.error)
            }
        } else if (res?.ok) {
            setSuccess(true)
        }
        setLoading(false)
    }

    return (
        <section className="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16 md:py-32">
            <form
                onSubmit={handleSubmit}
                className="max-w-92 m-auto h-fit w-full">
                <div className="p-6">
                    <div>
                        <Link
                            href="/mist"
                            aria-label="go home">
                            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                        </Link>
                        <h1 className="mt-6 text-balance text-xl font-semibold">Forgot Your Password?</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Enter your email to receive a reset link</p>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="block text-sm">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                placeholder="Your email"
                                className="ring-foreground/15 border-transparent ring-1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-full"
                            size="default">
                            Send Reset Link
                        </Button>
                        {error && <div className="text-red-500">{error}</div>}
                        {success && <div className="text-green-500">Password resets are currently disabled. Please contact support for assistance.</div>}
                    </div>
                </div>
                <div className="px-6">
                    <p className="text-muted-foreground text-sm">
                        You remember your password ?
                        <Button
                            asChild
                            variant="link"
                            className="px-2">
                            <Link href="/user/login">Sign In</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}
