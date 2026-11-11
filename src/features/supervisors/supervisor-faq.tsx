import FaqSection from '@/components/faq-section'
import { supervisorFaq } from '@/config/faq'

export default function SupervisorFAQ() {
    return <FaqSection title="Supervisor questions" subtitle="The things teachers ask us most often." items={supervisorFaq} />
}
