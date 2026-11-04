'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { conference } from '@/config/conference'
import { supervisorFaq } from '@/config/faq'

export default function SupervisorFAQ() {
    return (
        <section className="bg-muted py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div>
                    <h2 className="text-foreground text-4xl font-semibold">Supervisor questions</h2>
                    <p className="text-muted-foreground mt-4 text-balance text-lg">The things teachers ask us most often.</p>
                </div>

                <div className="mt-12">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-foreground/5 rounded-(--radius) w-full border border-transparent px-8 py-3 shadow ring-1">
                        {supervisorFaq.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dotted">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6">
                        Still have a question? {' '}
                        <Link
                            href={`mailto:${conference.contactEmail}`}
                            className="text-primary font-medium hover:underline">
                            Contact us
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
