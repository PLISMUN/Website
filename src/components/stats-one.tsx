import { Card } from '@/components/ui/card'

export default function StatsSection() {
    return (
        <section className="bg-muted py-12 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
                <Card className="grid gap-0.5 divide-y *:py-8 *:text-center md:grid-cols-3 md:divide-x md:divide-y-0">
                    <div>
                        <div className="text-foreground space-y-1 text-4xl font-bold">980</div> {/* 980+120+80+100+200 */}
                        <p className="text-muted-foreground">Lifetime Attendees</p>
                    </div>
                    <div>
                        <div className="text-foreground space-y-1 text-4xl font-bold">4/5</div> {/* (4.20+4.2+3.77)/3 */}
                        <p className="text-muted-foreground">Average Rating</p>
                    </div>
                    <div>
                        <div className="text-foreground space-y-1 text-4xl font-bold">20+</div> {/* I made it the fuck up */}
                        <p className="text-muted-foreground">International Delegations</p>
                    </div>
                </Card>
            </div>
        </section>
    )
}
