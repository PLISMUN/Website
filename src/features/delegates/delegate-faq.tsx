"use client"

import Link from 'next/link'

import FaqSection, { ContactLink } from '@/components/faq-section'
import { useSiteConfig } from '@/features/site-config/context'

export default function DelegateFAQ() {
    const { faq } = useSiteConfig()

    return (
        <FaqSection
            title="Delegate questions"
            subtitle="The things students ask us most often."
            items={faq.delegate}
            className="bg-background"
            footer={
                <>
                    More answers on the{' '}
                    <Link href="/faq" className="text-primary font-medium hover:underline">FAQ page</Link>
                    . Still stuck? <ContactLink />
                </>
            }
        />
    )
}
