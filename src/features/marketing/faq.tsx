'use client'

import FaqSection, { ContactLink } from '@/components/faq-section'
import { useSiteConfig } from '@/features/site-config/context'

export default function Faq() {
    const { faq } = useSiteConfig()

    return (
        <FaqSection
            title="Frequently Asked Questions"
            subtitle="Discover quick and comprehensive answers to common questions about our platform, services, and features."
            items={faq.general}
            footer={<>Can&apos;t find what you&apos;re looking for? <ContactLink /></>}
        />
    )
}
