"use client"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { IconPodium, IconLaurelWreath, IconUserShield } from "@tabler/icons-react"
import { stages } from "@/config/stages"
import { SUPERVISOR_APPLY_PATH } from "@/features/supervisors/paths"

export default function DelegateTypePick({ onPickType }: { onPickType: (type: 'delegate' | 'chair') => void }) {
    return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0">
                <div style={{ width: '60vw', height: '85vh' }} className="mx-auto flex items-center justify-center min-w-90">
                    <div className="@container lg:col-span-3 w-full">
                        <Card className="p-8 sm:p-12">
                            <h3 className="text-xl font-semibold">Now it&apos;s time to pick what to apply for!</h3>
                            <p className="text-sm">Don&apos;t worry, you can apply to be a delegate in case your chair aspirations fail.</p>
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
                                    disabled={!stages.delegateApplication}
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
                                    disabled={!stages.chairApplication}
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
                            <p className="mt-8 text-center text-sm text-muted-foreground">
                                <IconUserShield className="mr-1 inline size-4 align-text-bottom" stroke={1.5} />
                                Teacher or supervisor? <Link href={SUPERVISOR_APPLY_PATH} className="underline">Use the supervisor application instead</Link>.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}