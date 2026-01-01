"use client"
import { Card } from '@/components/ui/card'
import { useEffect } from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom';
import { useSession } from 'next-auth/react'
import { QRCodeCanvas } from 'qrcode.react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { stages } from '@/config/stages';

export default function paymentWidget({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [paymentInfo, setPaymentInfo] = useState<any>(null)

    const { data: session } = useSession()

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const res = await fetch('/api/retrieve/getPayment', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: session?.user?.email }), 
                })
                if (res.ok) {
                    const data = await res.json()
                    setPaymentInfo(data)
                }
            } catch (err) {
                console.error('Error fetching payment info:', err)
            }
        }
        fetchPayment()
    }, [session])
    if (stages.paymentsAccepted === false) {
        return (
                    <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
                <div className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                    <Alert variant="destructive">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style={{width: "1rem", height: "1rem"}}><path fill="#e7000b" d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM320 200C306.7 200 296 210.7 296 224L296 336C296 349.3 306.7 360 320 360C333.3 360 344 349.3 344 336L344 224C344 210.7 333.3 200 320 200zM346.7 416C347.3 406.1 342.4 396.7 333.9 391.5C325.4 386.4 314.7 386.4 306.2 391.5C297.7 396.7 292.8 406.1 293.4 416C292.8 425.9 297.7 435.3 306.2 440.5C314.7 445.6 325.4 445.6 333.9 440.5C342.4 435.3 347.3 425.9 346.7 416z"/></svg>
                        <AlertTitle>Payments Closed</AlertTitle>
                        <AlertDescription><p>Payments are currently not being accepted. We thank you for your intrest in the conference.</p></AlertDescription>
                    </Alert>
                    </Card>
                </div>
            </div>
        </section>
        )
    }

return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
                <div className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                    <Alert variant="destructive">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style={{width: "1rem", height: "1rem"}}><path fill="#e7000b" d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM320 200C306.7 200 296 210.7 296 224L296 336C296 349.3 306.7 360 320 360C333.3 360 344 349.3 344 336L344 224C344 210.7 333.3 200 320 200zM346.7 416C347.3 406.1 342.4 396.7 333.9 391.5C325.4 386.4 314.7 386.4 306.2 391.5C297.7 396.7 292.8 406.1 293.4 416C292.8 425.9 297.7 435.3 306.2 440.5C314.7 445.6 325.4 445.6 333.9 440.5C342.4 435.3 347.3 425.9 346.7 416z"/></svg>
                        <AlertTitle>For chair applicants:</AlertTitle>
                        <AlertDescription><p>Please do not pay until your chair application is processed.</p></AlertDescription>
                    </Alert>
                    <Tabs defaultValue="czk">
                      <TabsList>
                        <TabsTrigger value="czk">CZK</TabsTrigger>
                        <TabsTrigger value="eur">Euro</TabsTrigger>
                    </TabsList>
                    <TabsContent value="czk">
                        <div className="@md:grid-cols-2 grid gap-3 *:space-y-3 justify-end text-right sm:justify-center sm:text-left">
                            <QRCodeCanvas
                                value={`SPD*1.0*ACC:CZ8827000000002107914717*CC:CZK*MSG:PLISMUN*X-VS:250219*AM:${paymentInfo?.[0]?.valueCzk || 0}`}
                                style={{ height: "13rem", width: "auto" }}
                                className="ml-auto"
                            />
                            <div>
                                <p>
                                    Name: Park Lane International School, a.s.<br />
                                    Bank: UniCredit Bank Czech Republic and Slovakia, a.s.<br />
                                    Acc#: 2107914717/2700<br />
                                    Variable: 250219<br />
                                    IBAN: CZ88 2700 0000 0021 0791 4717<br />
                                    SWIFT: BACXCZPP<br />
                                    Amount: {paymentInfo?.[0]?.valueCzk ? paymentInfo[0].valueCzk : process.env.NEXT_PUBLIC_PRICE_CZK || 0} CZK<br />
                                    Info for recipient: {(session?.user?.name ?? '').replace(/\W/g, '')}<br />
                                </p>
                                {paymentInfo?.[0]?.state && (
                                    <div
                                        style={{
                                            backgroundColor: paymentInfo[0].state === 'Completed' ? 'green' : 'red',
                                            borderRadius: '2.5rem',
                                            padding: '0.5rem 1.5rem',
                                            display: 'inline-block',
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {paymentInfo[0].state}
                                    </div>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Please note it may take up to 7 business days for the payment to be processed. Delegate applications are not considered until payment is made.
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="eur">
                        <div className="@md:grid-cols-2 grid gap-3 *:space-y-3 justify-end text-right sm:justify-center sm:text-left">
                            <QRCodeCanvas
                                value={`SPD*1.0*ACC:CZ5027000000002109992559*CC:EUR*MSG:PLISMUN ${(session?.user?.name ?? '').replace(/\W/g, '')}*X-VS:250219*AM:${paymentInfo?.[0]?.valueEur || 0}`}
                                style={{ height: "13rem", width: "auto" }}
                                className="ml-auto"
                            />
                            <div>
                                <p>
                                    Name: Park Lane International School, a.s.<br />
                                    Bank: UniCredit Bank Czech Republic and Slovakia, a.s.<br />
                                    Acc#: 2109992559/2700<br />
                                    Variable: 250219<br />
                                    IBAN: CZ50 2700 0000 0021 0999 2559<br />
                                    SWIFT: BACXCZPP<br />
                                    Amount: €{paymentInfo?.[0]?.valueEur ? paymentInfo[0].valueEur : process.env.NEXT_PUBLIC_PRICE_EUR || 0}<br />
                                    Info for recipient: {(session?.user?.name ?? '').replace(/\W/g, '')}<br />
                                </p>
                                {paymentInfo?.[0]?.state && (
                                    <div
                                        style={{
                                            backgroundColor: paymentInfo[0].state === 'Completed' ? 'green' : 'red',
                                            borderRadius: '2.5rem',
                                            padding: '0.5rem 1.5rem',
                                            display: 'inline-block',
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {paymentInfo[0].state}
                                    </div>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Please note it may take up to 7 business days for the payment to be processed. Delegate applications are not considered until payment is made.
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </section>
    )
}