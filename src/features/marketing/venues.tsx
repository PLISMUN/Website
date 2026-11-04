import { Card } from '@/components/ui/card'
import { venues } from '@/config/venues'

export default function Venues() {
    return (
        <section>
            <div className="bg-muted/50 py-24">
                <div className="mx-auto max-w-5xl px-6">
                    <div>
                        <h2 className="text-foreground text-4xl font-semibold">Venues</h2>
                        <p className="text-muted-foreground mb-12 mt-4 text-balance text-lg">Enjoy great venues that are host to your experience this year.</p>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
                        {venues.map((venue, index) => (
                            <div key={index} className="space-y-4">
                                <Card className="aspect-video overflow-hidden px-6 flex items-center justify-center">
                                    <img
                                        src={venue.image}
                                        alt={venue.name}
                                        className="h-full w-full object-cover object-center scale-120 rounded-lg transition-transform duration-300"
                                    />
                                </Card>
                                <div className="sm:max-w-sm">
                                    <h3 className="text-foreground text-xl font-semibold">{venue.name}</h3>
                                    <p className="text-muted-foreground my-4 text-lg">{venue.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
