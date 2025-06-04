import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <section className="bg-linear-to-b to-muted from-background">
                    <div className="relative py-36">
                        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
                            <div className="md:w-1/2">
                                <div>
                                    <h1 className="max-w-md text-balance text-5xl font-medium md:text-6xl">PLISMUN&apos;26</h1>
                                    <h2 className="max-w-md text-balance text-lg font-normal text-muted-foreground md:text-xl">
                                        Feburary 5th - 8th, 2026
                                    </h2>
                                    <p className="text-muted-foreground mt-4 mb-8 max-w-2xl text-balance text-xl">The internationally renowned conference organized by Parklane International School is returning for its seventh year.</p>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="pr-4.5">
                                            <Link href="#link">
                                                <span className="text-nowrap">Get Started</span>
                                                <ChevronRight className="opacity-50" />
                                            </Link>
                                        </Button>
                                        <Button
                                            key={2}
                                            asChild
                                            size="lg"
                                            variant="outline"
                                            className="pl-5">
                                            <Link href="#link">
                                                <span className="text-nowrap">Log in</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <p className="text-muted-foreground">Partnered with :</p>
                                    <div className="mt-6 grid max-w-sm grid-cols-3 gap-6">
                                        <div className="flex">
                                            <img
                                                className="h-4 w-fit"
                                                src="https://html.tailus.io/blocks/customers/column.svg"
                                                alt="Column Logo"
                                                height="16"
                                                width="auto"
                                            />
                                        </div>
                                        <div className="flex">
                                            <img
                                                className="h-5 w-fit"
                                                src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                                alt="Nvidia Logo"
                                                height="20"
                                                width="auto"
                                            />
                                        </div>
                                        <div className="flex">
                                            <img
                                                className="h-4 w-fit"
                                                src="https://html.tailus.io/blocks/customers/github.svg"
                                                alt="GitHub Logo"
                                                height="16"
                                                width="auto"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="perspective-near mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0">
                            <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
                                {(() => { // Randomly select an image from the array to display on the right side
                                    const images = [
                                        //"/headers/headertest.png",
                                       // "/headers/headertest2.png",
                                        "/headers/headertest3.png",
                                        //"/headers/headertest4.png",
                                        //"/headers/headertest6.png",
                                        //"/headers/newheader.png"
                                    ];
                                    const randomImage = images[Math.floor(Math.random() * images.length)];
                                    return (
                                        <div className="bg-background rounded-(--radius) shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1">
                                            <Image
                                                src={randomImage}
                                                alt="app screen"
                                                width="2880"
                                                height="1842"
                                                className="object-top-left size-full object-cover"
                                            />
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
