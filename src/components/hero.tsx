"use client";
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { stages } from "@/config/stages"

export default function HeroSection() {

    const { data: session } = useSession()

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
                                        January 29th - February 1st, 2026
                                    </h2>
                                    <p className="text-muted-foreground mt-4 mb-8 max-w-2xl text-balance text-xl">The internationally renowned conference organized by Park Lane International School is returning for its ninth year.</p>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="pr-4.5"
                                            disabled={!stages.accountCreation}>
                                            <Link href="/user/signup">
                                                <span className="text-nowrap">Get Started</span>
                                                <ChevronRight className="opacity-50" />
                                            </Link>
                                        </Button>
                                        {!session && (
                                            <>
                                        <Button
                                            key={2}
                                            asChild
                                            size="lg"
                                            variant="outline"
                                            className="pl-5"
                                            disabled={!stages.accountCreation}>
                                            <Link href="/user/login">
                                                <span className="text-nowrap">Log in</span>
                                            </Link>
                                        </Button>
                                        </>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <p className="text-muted-foreground">Partnered with :</p>
                                    <div className="mt-6 grid w-fit max-w-sm grid-cols-3 gap-3 place-items-center">
                                        <img
                                            className="h-9"
                                            src="https://i.redd.it/gzn9i302mxe71.jpg"
                                            alt="Prague Logo"
                                        />
                                        <img
                                            className="h-5"
                                            src="https://www.parklane-is.cz/wp-content/uploads/2025/03/parklane-logo.svg"
                                            alt="Park Lane International School Logo"
                                        />
                                        <img
                                            className="h-15"
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Prague_CoA_CZ.svg/960px-Prague_CoA_CZ.svg.png"
                                            alt="Prague Coat of Arms"
                                        />
                                        <img
                                            className="h-10"
                                            src="https://s3-media0.fl.yelpcdn.com/bphoto/v0fmH95u3uADxi21OTjnoQ/o.jpg"
                                            alt="The Charnwood Company"
                                        />
                                        <img
                                            className="h-10"
                                            src="https://www.vecernipraha.com/sites/default/files/2020-02/DUPLEX-logo_0.jpg"
                                            alt="Duplex"
                                        />
                                        <img
                                            className="h-10"
                                            src="https://www.avisonyoung.cz/o/ay-theme/resources/images/AVYLogo.svg?v=2020"
                                            alt="Avison Young"
                                        />
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
