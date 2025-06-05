import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function Pricing() {
    return (
        <div className="bg-muted relative py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">A price that&apos;s affordable</h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-lg">While we know that noone wants to see a price tag on their hobbies, your financial contributions pay not only for your food & drinks, but for everything that makes PLISMUN great.</p>
                </div>
                <div className="@container relative mt-12 md:mt-20">
                    <Card className="@4xl:max-w-full relative mx-auto max-w-sm">
                        <div className="@4xl:grid-cols-3 grid">
                            <div>
                                <CardHeader className="p-8">
                                    <CardTitle className="font-medium">Chair</CardTitle>
                                    <span className="mb-0.5 mt-2 block text-2xl font-semibold">€20</span>
                                    <CardDescription className="text-sm">Per person</CardDescription>
                                </CardHeader>
                                <div className="border-y px-8 py-4">
                                    <Button
                                        asChild
                                        className="w-full"
                                        variant="neutral">
                                        <Link href="#">Get Started</Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="ring-foreground/10 bg-background rounded-(--radius) @3xl:mx-0 @3xl:-my-3 -mx-1 border-transparent shadow ring-1">
                                <div className="@3xl:py-3 @3xl:px-0 relative px-1">
                                    <CardHeader className="p-8">
                                        <CardTitle className="font-medium">Delegate</CardTitle>
                                        <span className="mb-0.5 mt-2 block text-2xl font-semibold">€30</span>
                                        <CardDescription className="text-sm">Per person</CardDescription>
                                    </CardHeader>
                                    <div className="@3xl:mx-0 -mx-1 border-y px-8 py-4">
                                        <Button
                                            asChild
                                            className="w-full">
                                            <Link href="#">Get Started</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <CardHeader className="p-8">
                                    <CardTitle className="font-medium">Delegation</CardTitle>
                                    <span className="mb-0.5 mt-2 block text-2xl font-semibold">€400</span>
                                    <CardDescription className="text-sm">Per delegation</CardDescription>
                                </CardHeader>
                                <div className="border-y px-8 py-4">
                                    <Button
                                        asChild
                                        className="w-full"
                                        variant="neutral">
                                        <Link href="#">Get Started</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
