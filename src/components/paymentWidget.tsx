"use client"
import { Card } from '@/components/ui/card'
import { useEffect } from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom';
import { useSession } from 'next-auth/react'
import { QRCodeCanvas } from 'qrcode.react'

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
    
return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
                <div className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                        <div className="@md:grid-cols-2 grid gap-3 *:space-y-3 justify-end text-right sm:justify-center sm:text-center">
                            <QRCodeCanvas
                                value={`SPD*1.0*ACC:CZ4208000000005284999073*AM:1500.00*CC:CZK*RN:TOMÁŠ STOKLÁSEK*X-VS:250219*`}
                                style={{ height: "13rem", width: "auto" }}
                                className="ml-auto"
                            />
                            <div>
                                <p>
                                    Name: Park Lane International School, a.s.<br />
                                    Bank: Česká Spořitelna<br />
                                    Acc#: 5284999073/0800<br />
                                    Ammount: {paymentInfo?.[0]?.valueCzk ? paymentInfo[0].valueCzk : process.env.NEXT_PUBLIC_PRICE_CZK} CZK<br />
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
                    </Card>
                </div>
            </div>
        </section>
    )
}