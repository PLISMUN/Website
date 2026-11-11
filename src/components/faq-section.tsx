'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { FaqItem } from '@/config/faq'
import { useSiteConfig } from '@/features/site-config/context'
import { fillPlaceholders } from '@/features/site-config/placeholders'
import { cn } from '@/lib/utils'

function ContactLink() {
    const { conference } = useSiteConfig()
    return (
        <Link href={`mailto:${conference.contactEmail}`} className="text-primary font-medium hover:underline">
            Contact us
        </Link>
    )
}

// A titled list of questions that open to show their answer. Line breaks (\n) in an answer are kept,
// and placeholders like {contactEmail} are filled in.
export default function FaqSection({
    title,
    subtitle,
    items,
    footer = <>Still have a question? <ContactLink /></>,
    className = 'bg-muted',
}: {
    title: string
    subtitle: string
    items: FaqItem[]
    footer?: ReactNode
    className?: string
}) {
    const config = useSiteConfig()

    return (
        <section className={cn('py-16 md:py-24', className)}>
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div>
                    <h2 className="text-foreground text-4xl font-semibold">{title}</h2>
                    <p className="text-muted-foreground mt-4 text-balance text-lg">{subtitle}</p>
                </div>

                <div className="mt-12">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-foreground/5 rounded-(--radius) w-full border border-transparent px-8 py-3 shadow ring-1">
                        {items.map((item) => (
                            <AccordionItem key={item.id} value={item.id} className="border-dotted">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{fillPlaceholders(item.question, config)}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="whitespace-pre-line text-base">{fillPlaceholders(item.answer, config)}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6">{footer}</p>
                </div>
            </div>
        </section>
    )
}

export { ContactLink }
