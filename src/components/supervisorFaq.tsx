'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { supervisorPrice } from '@/config/supervisor'

export default function SupervisorFAQ() {
    const faqItems = [
        {
            id: 'who',
            question: 'Who should apply as a supervisor?',
            answer: 'Teachers and school staff who bring a group of students to PLISMUN and are responsible for them during the conference. Students apply separately, as delegates or chairs.',
        },
        {
            id: 'accounts',
            question: 'Do my students and I each need an account?',
            answer: 'Yes. You create your own account and apply as a supervisor; each student creates their own account and applies for committees. Students join your delegation by selecting it when they fill in their details.',
        },
        {
            id: 'new-school',
            question: "My school isn't in the list of delegations. What do I do?",
            answer: 'That is expected if your school is new to PLISMUN. Choose "Register a new delegation" in the supervisor application and we will set it up when we review your application.',
        },
        {
            id: 'colleagues',
            question: 'Two teachers from our school are coming. Do we both apply?',
            answer: 'Yes. The first teacher registers the delegation. Once it has been set up, the second chooses "Join an existing delegation". Both of you will see the same overview once approved.',
        },
        {
            id: 'several',
            question: 'I am bringing more than one delegation. Can I supervise all of them?',
            answer: 'Yes. After your first application, use "Register another delegation" on your Supervisor Application page. You can switch between your delegations on the My Delegation page.',
        },
        {
            id: 'early-students',
            question: 'Some of my students signed up before our delegation existed. What now?',
            answer: 'They can update their delegation at any time: they open Apply in the portal, choose your delegation in their details and submit the form again.',
        },
        {
            id: 'price',
            question: 'How much does it cost and how do I pay?',
            answer: `The supervisor fee is ${supervisorPrice.czk} CZK (€${supervisorPrice.eur}). Once your application is approved, open Payment in the portal for the bank details and a QR code. Payments can take up to 7 business days to be processed.`,
        },
        {
            id: 'visibility',
            question: 'What can I see about my students?',
            answer: "Once approved: each member's name, email, phone number, date of birth, nationality, dietary needs and notes, their committee applications and status, and their payment status. Only approved supervisors of a delegation can see its members.",
        },
        {
            id: 'payment',
            question: 'Does each student have to pay separately?',
            answer: "It is prefferable for each student to pay separately through their PLISMUN account portal, however if neccesery, you can pay for all of your students in one payment if prior arrangement is made. Please contact us if you wish to do this.",
        },
    ]

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
                        {faqItems.map((item) => (
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
                            href="mailto:plismun@parklane-is.com"
                            className="text-primary font-medium hover:underline">
                            Contact us
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
