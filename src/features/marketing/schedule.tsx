import Image from 'next/image'
import { getSiteConfig } from '@/server/site-config'

export default async function Schedule() {
    const { schedule } = await getSiteConfig()

    return (
        <section>
            <div className="py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div className="mx-auto max-w-2xl">
                        <div>
                            <h2 className="text-foreground text-4xl font-semibold">Schedule</h2>
                        </div>

                        <div className="relative mt-12 overflow-hidden rounded-3xl bg-black/10">
                            <img
                                src={schedule.background}
                                alt=""
                                className="absolute inset-0 size-full object-cover"
                            />

                            <div className="bg-background rounded-(--radius) relative m-4 overflow-hidden border border-transparent shadow-xl shadow-black/15 ring-1 ring-black/10 sm:m-8 md:m-12">
                                <Image
                                    src={schedule.image}
                                    alt={schedule.alt}
                                    width={schedule.width}
                                    height={schedule.height}
                                    className="object-top-left size-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
