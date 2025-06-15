"use client"
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { IconPodium, IconLaurelWreath } from "@tabler/icons-react"

export default function DelegateTypePick({ onPickType }: { onPickType: (type: 'delegate' | 'chair') => void }) {

    const { data: session } = useSession()

    return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0">
                <div style={{ width: '60vw', height: '85vh' }} className="mx-auto flex items-center justify-center">
                    <div className="@container lg:col-span-3 w-full">
                        <Card className="p-8 sm:p-12">
                            <h3 className="text-xl font-semibold">Now it's time to pick what to apply for!</h3>
                            <p className="text-sm">Don't worry, you can apply to be a delegate in case being a chair fails.</p>
                            <div
                                className="flex items-center justify-center mt-8"
                            >
                                <Button
                                    variant="secondary"
                                    className="flex flex-col items-center justify-center cursor-pointer"
                                    style={{ background: "none", boxShadow: "none" }}
                                    aria-label="Apply as Delegate"
                                    onClick={() => {
                                        onPickType('delegate')
                                    }}
                                >
                                    <IconPodium
                                        className=""
                                        stroke={1}
                                        style={{
                                            width: 'clamp(24px, 5vw, 60px)',
                                            height: 'clamp(24px, 5vw, 60px)',
                                        }}
                                    />
                                    <span className="text-sm">Delegate</span>
                                </Button>
                                <span className="mx-6 h-12 border-l border-gray-300" aria-hidden="true"></span>
                                <Button
                                    variant="secondary"
                                    className="flex flex-col items-center justify-center cursor-pointer"
                                    style={{ background: "none", boxShadow: "none" }}
                                    aria-label="Apply as Chair"
                                    onClick={() => {
                                        onPickType('chair')
                                    }}
                                >
                                    <IconLaurelWreath
                                        className=""
                                        stroke={1}
                                        style={{
                                            width: 'clamp(24px, 5vw, 60px)',
                                            height: 'clamp(24px, 5vw, 60px)',
                                        }}
                                    />
                                    <span className="text-sm">Chair</span>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}