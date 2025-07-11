'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQs() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How can I contact you?',
            answer: 'Write an email to plismun@parklane-is.com',
        },
        {
            id: 'item-2',
            question: 'How do I apply?',
            answer: 'Sign up and follow the instructions! If you apply as a chair, you can also apply as a delegate at the same time in case you get rejected.',
        },
        {
            id: 'item-3',
            question: 'Where can I find this yearʹs committees & topics?',
            answer: 'Go to the This Year page. If you want to know more about the committees, just click on them!',
        },
        {
            id: 'item-4',
            question: 'Whatʹs the best way to get to the Úvoz Campus?',
            answer: 'The full address is: Úvoz 227, 118 00 Malá Strana, Czechia\n\nThere are a few different ways to travel to our campus.\n• By tram downhill: Travel on the 22 or 23 tram to Pohořelec and walk down the hill.\n• By tram uphill: Take the trams 12,15,20,22 to Malostranské náměstí and walk up the hill.\n• By bus through the garden: Alternatively, you can take 194 bus from Malostranská to Nemocnice pod Petřínem and walk up the hill from the rear enterance of the Úvoz campus.\n\nPlease note that this is the standard operation, may be changed. Check DPP (the cityʹs public transport provider) for more details on your route.',
        },
        {
            id: 'item-5',
            question: 'What if I want to change my application?',
            answer: "Use the applications tab in the dashboard when logged in. If your application has already been accepted, email the team and we'll see what we can do :)",
        },
        {
            id: 'item-6',
            question: 'What is the price of attending?',
            answer: 'Scroll down to the pricing section in the This Year page.',
        },
        {
            id: 'item-7',
            question: 'What if I do not receive any information about my application?',
            answer: 'You should always receive some sort of notification for your application. If you do not receive any information within 24 hours of submission of your application please contact via our email.'
        },
        {
            id: 'item-8',
            question: 'I got an unknown error or an error that wasnʹt my fault when submitting my application, what should I do?',
            answer: 'Firstly email us at plismun@parklane-is.com for you to be able to get your confirmation email.\nAdditionally, in the email send us the screenshot of the console so we are able to know how to fix it for next time. (Right click anywhere on the page, then Inspect Element, then the console.)\nWe apologise for the issues and we will attempt to get back to you within 24 hours an error occuring.'
        }
    ]

    return (
        <section className="bg-muted py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div>
                    <h2 className="text-foreground text-4xl font-semibold">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mt-4 text-balance text-lg">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
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
                                    <p className="text-base">
                                        {item.answer.split('\n').map((line, idx) => (
                                            <span key={idx}>
                                                {line}
                                                <br />
                                            </span>
                                        ))}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6">
                        Can&apos;t find what you&apos;re looking for? {' '}
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
