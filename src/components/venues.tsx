import { Card } from '@/components/ui/card'

export default function Features() {
    return (
        <section>
            <div className="bg-muted/50 py-24">
                <div className="mx-auto max-w-5xl px-6">
                    <div>
                        <h2 className="text-foreground text-4xl font-semibold">Venues</h2>
                        <p className="text-muted-foreground mb-12 mt-4 text-balance text-lg">Enjoy great venues that are host to your experience this year.</p>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
                        <div className="space-y-4">
                            <Card className="aspect-video overflow-hidden px-6 flex items-center justify-center">
                                <img
                                    src="/headers/newheader.png"
                                    alt="Úvoz Campus"
                                    className="h-full w-full object-cover object-center scale-120 rounded-lg transition-transform duration-300"
                                />
                            </Card>
                            <div className="sm:max-w-sm">
                                <h3 className="text-foreground text-xl font-semibold">Úvoz Campus</h3>
                                <p className="text-muted-foreground my-4 text-lg">The debating portion of PLISMUN will occur at Parklane&apos;s Úvoz Campus, a historical building with incredible views overlooking prague situated right next to the Prague Castle and Raoul Wallenberg Promenade. We recommend getting off at the Pohořelec tram station and walking down hill.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Card
                                className="aspect-video overflow-hidden p-6">
                                <Card className="h-full" />
                            </Card>
                            <div className="sm:max-w-sm">
                                <h3 className="text-foreground text-xl font-semibold">Bike Jesus</h3>
                                <p className="text-muted-foreground my-4 text-lg">This is an example Social Event venue. Stay on top of your schedule.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Card className="aspect-video overflow-hidden px-6 flex items-center justify-center">
                                <img
                                    src="/CityHall.jpg"
                                    alt="Úvoz Campus"
                                    className="h-full w-full object-cover object-center scale-120 rounded-lg transition-transform duration-300"
                                />
                            </Card>
                            <div className="sm:max-w-sm">
                                <h3 className="text-foreground text-xl font-semibold">Nová Radnice</h3>
                                <p className="text-muted-foreground my-4 text-lg">The GA will happen at the New Prague City Hall; the very same one where Prague law makers decide on the future of this city. It is situated in Prague Center, more specifically old town. We recommend getting of at staromestka metro station.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
