'use client'
import { cn } from '@/lib/utils'
import { Calendar1, Ellipsis } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Partners() {
    return (
        <section>
            <div className="bg-muted/50 py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div>
                        <h2 className="text-foreground mt-4 text-4xl font-semibold">Our Partners</h2>
                        <p className="text-muted-foreground mb-12 mt-4 text-lg">These are the companies that we couldn&apos;t have made it without.</p>
                    </div>

                    <div className="border-foreground/5 space-y-6 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] sm:space-y-0 sm:divide-y">
                        <div className="grid sm:grid-cols-5 sm:divide-x">
                            <div className="flex items-center justify-center sm:col-span-2">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Logo_Praha.svg"
                                    alt="Prague Logo"
                                    style={{height: '7lh', width: 'auto'}}
                                />
                            </div>
                            <div className="mt-6 sm:col-span-3 sm:mt-0 sm:border-l sm:pl-12">
                                <h3 className="text-foreground text-xl font-semibold">Hl.m. Prague</h3>
                                <p className="text-muted-foreground mt-4 text-lg">Thanks to cooperation of the city of Prague, we're able to use the New City Hall; the very same one where Prague law makers decide on the future of this city.</p>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-5 sm:divide-x">
                            <div className="pt-12 sm:col-span-3 sm:border-r sm:pr-12">
                                <h3 className="text-foreground text-xl font-semibold">Parklane International School</h3>
                                <p className="text-muted-foreground mt-4 text-lg">Parklane International School, being the parent organization of PLISMUN, has contributed venues, finances, and overall a lot of help.</p>
                            </div>
                            <div className="row-start-1 flex items-center justify-center pt-12 sm:col-span-2 sm:row-start-auto">
                                <img
                                    src="https://www.teacherhorizons.com/static/mediav2/schools/2358/images/505186_main.webp"
                                    alt="Parklane International School Logo"
                                    style={{height: '7lh', width: 'auto'}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}   
