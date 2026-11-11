"use client"

import Link from 'next/link'

import FaqSection, { contactLink } from '@/components/faq-section'
import { delegateFaq } from '@/config/faq'

export default function DelegateFAQ() {
    return (
        <FaqSection
            title="Delegate questions"
            subtitle="The things students ask us most often."
            items={delegateFaq}
            className="bg-background"
            footer={
                <>
                    More answers on the{' '}
                    <Link href="/faq" className="text-primary font-medium hover:underline">FAQ page</Link>
                    . Still stuck? {contactLink}
                </>
            }
        />
    )
}
