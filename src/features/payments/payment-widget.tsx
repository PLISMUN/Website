"use client"
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { QRCodeCanvas } from 'qrcode.react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { paymentDetails } from '@/config/payment'
import { pricing } from '@/config/pricing'
import { stages } from '@/config/stages'
import { paymentStatusLabel } from '@/lib/utils'
import { getPayment } from './api'
import type { PaymentInfo } from './types'

function WarningIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style={{width: "1rem", height: "1rem"}}><path fill="#e7000b" d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM320 200C306.7 200 296 210.7 296 224L296 336C296 349.3 306.7 360 320 360C333.3 360 344 349.3 344 336L344 224C344 210.7 333.3 200 320 200zM346.7 416C347.3 406.1 342.4 396.7 333.9 391.5C325.4 386.4 314.7 386.4 306.2 391.5C297.7 396.7 292.8 406.1 293.4 416C292.8 425.9 297.7 435.3 306.2 440.5C314.7 445.6 325.4 445.6 333.9 440.5C342.4 435.3 347.3 425.9 346.7 416z"/></svg>
    )
}

// The Czech bank QR code format
const qrPayload = (iban: string, currency: string, message: string, amount: string | number) =>
    `SPD*1.0*ACC:${iban.replaceAll(' ', '')}*CC:${currency}*MSG:${message}*X-VS:${paymentDetails.variableSymbol}*AM:${amount}`

function BankDetails({ qrValue, accountNumber, iban, amount, reference, payment }: {
    qrValue: string
    accountNumber: string
    iban: string
    amount: string
    reference: string
    payment?: PaymentInfo
}) {
    return (
        <div className="@md:grid-cols-2 grid gap-3 *:space-y-3 justify-end text-right sm:justify-center sm:text-left">
            <QRCodeCanvas
                value={qrValue}
                style={{ height: "13rem", width: "auto" }}
                className="ml-auto"
            />
            <div>
                <p>
                    Name: {paymentDetails.recipient}<br />
                    Bank: {paymentDetails.bank}<br />
                    Acc#: {accountNumber}<br />
                    Variable: {paymentDetails.variableSymbol}<br />
                    IBAN: {iban}<br />
                    SWIFT: {paymentDetails.swift}<br />
                    Amount: {amount}<br />
                    Info for recipient: {reference}<br />
                </p>
                {payment && (
                    <div
                        style={{
                            backgroundColor: payment.state ? 'green' : 'red',
                            borderRadius: '2.5rem',
                            padding: '0.5rem 1.5rem',
                            display: 'inline-block',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        {paymentStatusLabel(payment.state)}
                    </div>
                )}
                <p className="text-sm text-muted-foreground">
                    Please note it may take up to 7 business days for the payment to be processed. Delegate applications are not considered until payment is made.
                </p>
            </div>
        </div>
    )
}

export default function PaymentWidget() {
    const [payment, setPayment] = useState<PaymentInfo | undefined>(undefined)

    const { data: session } = useSession()
    const email = session?.user?.email

    useEffect(() => {
        if (!email) return
        getPayment(email)
            .then((rows) => setPayment(rows[0]))
            .catch((err) => console.error('Error fetching payment info:', err))
    }, [email])

    if (stages.paymentsAccepted === false) {
        return (
                    <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
                <div className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                    <Alert variant="destructive">
                        <WarningIcon />
                        <AlertTitle>Payments Closed</AlertTitle>
                        <AlertDescription><p>Payments are currently not being accepted. We thank you for your interest in the conference.</p></AlertDescription>
                    </Alert>
                    </Card>
                </div>
            </div>
        </section>
        )
    }

    // Letters and numbers only, so it survives being typed into a bank's payment note
    const reference = (session?.user?.name ?? '').replace(/\W/g, '')

return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
                <div className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                    <Alert variant="destructive">
                        <WarningIcon />
                        <AlertTitle>For chair applicants:</AlertTitle>
                        <AlertDescription><p>Please do not pay until your chair application is processed.</p></AlertDescription>
                    </Alert>
                    <Tabs defaultValue="czk">
                      <TabsList>
                        <TabsTrigger value="czk">CZK</TabsTrigger>
                        <TabsTrigger value="eur">Euro</TabsTrigger>
                    </TabsList>
                    <TabsContent value="czk">
                        <BankDetails
                            qrValue={qrPayload(paymentDetails.czk.iban, 'CZK', 'PLISMUN', payment?.valueCzk || 0)}
                            accountNumber={paymentDetails.czk.accountNumber}
                            iban={paymentDetails.czk.iban}
                            amount={`${payment?.valueCzk || pricing.delegate.czk} CZK`}
                            reference={reference}
                            payment={payment}
                        />
                    </TabsContent>
                    <TabsContent value="eur">
                        <BankDetails
                            qrValue={qrPayload(paymentDetails.eur.iban, 'EUR', `PLISMUN ${reference}`, payment?.valueEur || 0)}
                            accountNumber={paymentDetails.eur.accountNumber}
                            iban={paymentDetails.eur.iban}
                            amount={`€${payment?.valueEur || pricing.delegate.eur}`}
                            reference={reference}
                            payment={payment}
                        />
                    </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </section>
    )
}
