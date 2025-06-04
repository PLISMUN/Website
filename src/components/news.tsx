'use client'
import React from "react"
import { cn } from '@/lib/utils'
import { Bold, Calendar1, Ellipsis, Italic, Strikethrough, Underline } from 'lucide-react'


export default function ContentSection() {
    return (
        <section>
            <div className="bg-muted/50 py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div>
                        <span className="text-primary">Latest News</span>
                        <h2 className="text-foreground mt-4 text-4xl font-semibold">PLISMUN is still under construction!</h2>
                        <p className="text-muted-foreground mb-12 mt-4 text-lg">The secretariat is working day and night to bring your favourite conference back.</p>
                    </div>

                    <div className="border-foreground/5 space-y-6 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] sm:space-y-0 sm:divide-y">
                        <div className="grid sm:grid-cols-5">
                            <div className="mt-6 sm:col-span-3 sm:mt-0 sm:border-l sm:pl-12 pb-6">
                                <h3 className="text-foreground text-xl font-semibold">Lorem ipsum dolor sit amet</h3>
                                <span className="text-muted-foreground block text-base font-medium">20/05/2025</span>
                                <p className="text-muted-foreground mt-3 text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-5">
                            <div className="mt-6 sm:col-span-3 sm:mt-0 sm:border-l sm:pl-12 sm:pt-6">
                                <h3 className="text-foreground text-xl font-semibold">🎉 PLSIMUN 2026 planning has started!</h3>
                                <span className="text-muted-foreground block text-base font-medium">06/05/2025</span>
                                <p className="text-muted-foreground mt-3 text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}