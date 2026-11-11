"use client"
import { useEffect, useState, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { QRCodeSVG } from 'qrcode.react'
import { Check, CircleAlert, CircleCheck, Clock, Copy, ScanLine } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { paymentDetails } from '@/config/payment'
import { pricing } from '@/config/pricing'
import { stages } from '@/config/stages'
import { cn, isPaid } from '@/lib/utils'
import { getPayment } from './api'
import type { PaymentInfo } from './types'

// The Czech bank QR code format. Its message field is limited to 60 characters.
const qrPayload = (iban: string, currency: string, message: string, amount: string | number) =>
    `SPD*1.0*ACC:${iban.replaceAll(' ', '')}*CC:${currency}*MSG:${message.slice(0, 60)}*X-VS:${paymentDetails.variableSymbol}*AM:${amount}`

// Letters that don't split into a base letter plus an accent
const PLAIN_LETTERS: Record<string, string> = {
    ł: 'l', Ł: 'L', ø: 'o', Ø: 'O', đ: 'd', Đ: 'D', ß: 'ss', æ: 'ae', Æ: 'AE', œ: 'oe', Œ: 'OE',
}

// Letters and numbers only, so it survives being typed into a bank's payment note.
// Accents are dropped first so "Novák" becomes "Novak" rather than "Novk".
const paymentReference = (name: string) =>
    name
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[łŁøØđĐßæÆœŒ]/g, (letter) => PLAIN_LETTERS[letter])
        .replace(/\W/g, '')

type Detail = {
    label: string
    value: string
    copy?: string | null // What the copy button copies, when it differs from what's shown. No button when the value can't be copied.
    hint?: string
    important?: boolean
}

const bankDetails = (
    account: { accountNumber: string; iban: string },
    amount: { shown: string; copy: string },
    reference: string,
): Detail[] => [
    { label: 'Amount', value: amount.shown, copy: amount.copy, important: true },
    { label: 'Recipient name', value: paymentDetails.recipient },
    { label: 'Account number', hint: 'Czech banks', value: account.accountNumber, important: true  },
    { label: 'IBAN', hint: 'banks outside the Czech Republic', value: account.iban, copy: account.iban.replaceAll(' ', '') },
    {
        label: 'Message for recipient',
        hint: 'may be called “Reference” or “Description”',
        value: reference || 'Your full name',
        copy: reference || null,
        important: true 
    },
    { label: 'Variable symbol', hint: '', value: paymentDetails.variableSymbol, important: true  },
    { label: 'SWIFT / BIC', hint: 'if your bank asks for it', value: paymentDetails.swift },
    { label: 'Bank', hint: 'if your bank asks for it', value: paymentDetails.bank },
]

function PaymentShell({ children }: { children: ReactNode }) {
    return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
                <div className="@container">
                    <Card className="gap-8 p-6 sm:p-10">{children}</Card>
                </div>
            </div>
        </section>
    )
}

function PaymentConfirmed({ name }: { name?: string | null }) {
    return (
        <div className="flex flex-col items-center px-2 py-10 text-center sm:py-16">
            <span className="flex size-20 items-center justify-center rounded-full bg-green-100 text-green-700">
                <CircleCheck className="size-11" strokeWidth={1.75} />
            </span>
            <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">Payment received</h2>
        </div>
    )
}

function HowToPay({ reference }: { reference: string }) {
    const steps: { title: string; body: ReactNode }[] = [
        {
            title: 'Choose the currency of your bank account',
            body: <>Pick <strong>CZK</strong> if your account is in Czech crowns, or <strong>EUR</strong> if it&apos;s in euros, using the tabs above.</>,
        },
        {
            title: 'Open your banking app or internet banking',
            body: <>Use your own bank, or ask a parent to pay from theirs. Start a new payment. It&apos;s usually called “New payment”, “Transfer” or “Send money”.</>,
        },
        {
            title: 'Fill in the payment',
            body: (
                <>
                    <strong>If your banking app can scan payment QR codes</strong> (most Czech banks can), tap its “Scan QR”
                    button and point it at the code above. It fills everything in for you.
                    <br />
                    <strong>Otherwise</strong>, copy each detail above into the payment form with the Copy buttons.
                </>
            ),
        },
        {
            title: 'Check the amount and the message, then send',
            body: <>The message for the recipient must include <strong>{reference || 'your full name'}</strong> so we can tell the payment is yours. Add it if it isn&apos;t there.</>,
        },
        {
            title: 'Wait for us to confirm it',
            body: <>It can take up to 7 business days for this page to show <strong>Payment received</strong>. Delegate applications are not considered until payment is made.</>,
        },
    ]

    return (
        <div>
            <h3 className="text-lg font-semibold">How to pay, step by step</h3>
            <ol className="mt-4 space-y-4">
                {steps.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-700 text-sm font-semibold text-white">
                            {index + 1}
                        </span>
                        <div className="pt-1">
                            <p className="font-medium">{step.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    )
}

function CopyButton({ value, label }: { value: string; label: string }) {
    const [copied, setCopied] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            setCopied(false)
        }
    }

    return (
        <Button type="button" variant="outline" size="sm" className="shrink-0 cursor-pointer" onClick={copy} aria-label={`Copy ${label}`}>
            {copied ? <Check className="text-green-600" /> : <Copy />}
            {copied ? 'Copied' : 'Copy'}
        </Button>
    )
}

function QrPanel({ value }: { value: string }) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-white p-5 text-center @2xl:w-64">
            <QRCodeSVG value={value} size={176} marginSize={0} />
            <p className="flex items-center gap-1.5 text-sm font-medium">
                <ScanLine className="size-4 text-sky-700" />
                Scan from inside your banking app
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
                Not with your camera app. Reading this on your phone? Copy the details instead, or open this page on a
                computer and scan it.
            </p>
        </div>
    )
}

function BankDetails({ details, qrValue }: { details: Detail[]; qrValue: string }) {
    return (
        <div className="grid gap-6 @2xl:grid-cols-[1fr_auto] @2xl:items-start">
            <dl className="divide-y overflow-hidden rounded-xl border">
                {details.map((detail) => {
                    const copy = detail.copy === undefined ? detail.value : detail.copy
                    return (
                        <div key={detail.label} className={cn('flex items-center gap-3 px-4 py-3', detail.important && 'bg-sky-50')}>
                            <div className="min-w-0 flex-1">
                                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    {detail.label}
                                    {detail.hint && <span className="font-normal normal-case tracking-normal"> · {detail.hint}</span>}
                                </dt>
                                <dd className="mt-0.5 wrap-break-word font-medium tabular-nums">{detail.value}</dd>
                            </div>
                            {copy && <CopyButton value={copy} label={detail.label} />}
                        </div>
                    )
                })}
            </dl>
            <QrPanel value={qrValue} />
        </div>
    )
}

export default function PaymentWidget() {
    const [payment, setPayment] = useState<PaymentInfo | undefined>(undefined)
    const [loaded, setLoaded] = useState(false)

    const { data: session } = useSession()
    const email = session?.user?.email

    useEffect(() => {
        if (!email) return
        getPayment(email)
            .then((rows) => setPayment(rows[0]))
            .catch((err) => console.error('Error fetching payment info:', err))
            .finally(() => setLoaded(true))
    }, [email])

    if (stages.paymentsAccepted === false) {
        return (
            <PaymentShell>
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>Payments Closed</AlertTitle>
                    <AlertDescription><p>Payments are currently not being accepted. We thank you for your interest in the conference.</p></AlertDescription>
                </Alert>
            </PaymentShell>
        )
    }

    // Wait for the payment so someone who has paid doesn't see the payment instructions flash up first
    if (!loaded) {
        return (
            <PaymentShell>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-96 w-full" />
            </PaymentShell>
        )
    }

    if (isPaid(payment?.state)) {
        return (
            <PaymentShell>
                <PaymentConfirmed name={session?.user?.name} />
            </PaymentShell>
        )
    }

    const reference = paymentReference(session?.user?.name ?? '')
    const czkAmount = String(payment?.valueCzk || pricing.delegate.czk)
    const eurAmount = String(payment?.valueEur || pricing.delegate.eur)

    return (
        <PaymentShell>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">Pay your conference fee</h2>
                    <p className="mt-1 text-muted-foreground">By bank transfer, from your own bank account or a parent&apos;s.</p>
                </div>
                {payment && (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800">
                        <Clock className="size-4" />
                        Not received yet
                    </span>
                )}
            </div>

            <Alert variant="destructive">
                <CircleAlert />
                <AlertTitle>For chair applicants:</AlertTitle>
                <AlertDescription><p>Please do not pay until your chair application is processed.</p></AlertDescription>
            </Alert>

            <div>
                <h3 className="text-lg font-semibold">Payment details</h3>
                <Tabs defaultValue="czk" className="mt-3 gap-4">
                    <TabsList>
                        <TabsTrigger value="czk" className="cursor-pointer px-3">CZK</TabsTrigger>
                        <TabsTrigger value="eur" className="cursor-pointer px-3">EUR</TabsTrigger>
                    </TabsList>
                    <TabsContent value="czk">
                        <BankDetails
                            qrValue={qrPayload(paymentDetails.czk.iban, 'CZK', `PLISMUN ${reference}`, czkAmount)}
                            details={bankDetails(paymentDetails.czk, { shown: `${czkAmount} CZK`, copy: czkAmount }, reference)}
                        />
                    </TabsContent>
                    <TabsContent value="eur">
                        <BankDetails
                            qrValue={qrPayload(paymentDetails.eur.iban, 'EUR', `PLISMUN ${reference}`, eurAmount)}
                            details={bankDetails(paymentDetails.eur, { shown: `€${eurAmount}`, copy: eurAmount }, reference)}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <HowToPay reference={reference} />
        </PaymentShell>
    )
}
