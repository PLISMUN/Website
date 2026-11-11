import FaqSection from '@/components/faq-section'
import { getSiteConfig } from '@/server/site-config'

export default async function SupervisorFAQ() {
    const { faq } = await getSiteConfig()
    return <FaqSection title="Supervisor questions" subtitle="The things teachers ask us most often." items={faq.supervisor} />
}
