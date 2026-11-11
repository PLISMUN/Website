import { conference } from '@/config/conference'
import { pricing } from '@/config/pricing'

export type FaqItem = {
  id: string
  question: string
  // Line breaks (\n) in an answer on the /faq page are kept
  answer: string
}

// The /faq page
export const generalFaq: FaqItem[] = [
    {
        id: 'item-1',
        question: 'How can I contact you?',
        answer: `Write an email to ${conference.contactEmail}`,
    },
    {
        id: 'item-2',
        question: 'How do I apply?',
        answer: 'Sign up and follow the instructions! If you apply as a chair, you can also apply as a delegate at the same time in case you get rejected.',
    },
    {
        id: 'item-supervisor',
        question: 'I am a teacher. How do I register my delegation?',
        answer: 'Supervisors have their own application, separate from students. Visit the Supervisors page for a step-by-step guide and the link to apply.',
    },
    {
        id: 'item-3',
        question: 'Where can I find this yearʹs committees & topics?',
        answer: 'Go to the Details page. If you want to know more about the committees, just click on them!',
    },
    {
        id: 'item-4',
        question: 'Whatʹs the best way to get to the Úvoz Campus?',
        answer: 'The full address is: Úvoz 227, 118 00 Malá Strana, Czechia\n\nThere are a few different ways to travel to our campus.\n• By tram downhill: Travel on the 22 or 23 tram to Pohořelec and walk down the hill.\n• By tram uphill: Take the trams 12,15,20,22 to Malostranské náměstí and walk up the hill.\n• By bus through the garden: Alternatively, you can take 194 bus from Malostranská to Nemocnice pod Petřínem and walk up the hill from the rear enterance of the Úvoz campus.\n\nPlease note that this is the standard operation, and may be changed. Check DPP (the cityʹs public transport provider) for more details on your route.',
    },
    {
        id: 'item-5',
        question: 'What if I want to change my application?',
        answer: "Use the applications tab in the dashboard when logged in. If your application has already been accepted, email the team and we'll see what we can do :)",
    },
    {
        id: 'item-6',
        question: 'What is the price of attending?',
        answer: 'Scroll down to the pricing section in the Details page.',
    },
    {
        id: 'item-7',
        question: 'What if I do not receive any information about my application?',
        answer: 'You should always receive some sort of notification for your application. If you do not receive any information within 24 hours of submission of your application please contact via our email.'
    },
    {
        id: 'item-8',
        question: 'I got an unknown error or an error that wasnʹt my fault when submitting my application, what should I do?',
        answer: `Firstly email us at ${conference.contactEmail} for you to be able to get your confirmation email.\nAdditionally, in the email send us the screenshot of the console so we are able to know how to fix it for next time. (Right click anywhere on the page, then Inspect Element, then the console.)\nWe apologise for the issues and we will attempt to get back to you within 24 hours an error occuring.`
    }
]

// The questions at the bottom of the /delegate-info page
export const delegateFaq: FaqItem[] = [
    {
        id: 'chair-and-delegate',
        question: 'Can I apply to be a chair and a delegate?',
        answer: 'Yes. If you apply to chair, you can also apply as a delegate in case your chair application is not successful.',
    },
    {
        id: 'delegation',
        question: "My school isn't in the list of delegations. What do I do?",
        answer: 'Ask your teacher to register your school on the Supervisors page. Once it has been set up, open Apply in the portal, choose your school under Delegation and submit your details again.',
    },
    {
        id: 'when',
        question: 'When will I find out my committee and role?',
        answer: 'Applications are reviewed once your payment has been processed, which can take up to 7 business days. We email you when your application is accepted, and you can check its status under Applications in the portal at any time.',
    },
    {
        id: 'change',
        question: 'What if I want to change my application?',
        answer: "Use the Applications tab in the portal. If your application has already been accepted, email the team and we'll see what we can do :)",
    },
    {
        id: 'diet',
        question: 'I have dietary requirements or allergies. What should I choose?',
        answer: 'Choose your diet when you fill in your details. We can\'t safely accommodate every dietary need or allergy, so if yours isn\'t covered, choose "No Lunch".',
    },
    {
        id: 'pay',
        question: 'How much does it cost and how do I pay?',
        answer: `The delegate fee is ${pricing.delegate.czk} CZK (€${pricing.delegate.eur}) and the chair fee is ${pricing.chair.czk} CZK (€${pricing.chair.eur}). You pay by bank transfer: open Payment in the portal for the bank details and a QR code to scan in your banking app. There is no card payment. If you applied to chair, wait until your chair application is accepted before you pay.`,
    },
    {
        id: 'no-email',
        question: "I haven't heard anything about my application.",
        answer: `You should always get an email when you submit an application. If nothing arrives within 24 hours, check your spam folder, check that there are no typos in your email address, and then email us at ${conference.contactEmail}.`,
    },
]

// The questions at the bottom of the /supervisors page
export const supervisorFaq: FaqItem[] = [
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
        answer: `The supervisor fee is ${pricing.supervisor.czk} CZK (€${pricing.supervisor.eur}). Once your application is approved, open Payment in the portal for the bank details and a QR code. Payments can take up to 7 business days to be processed.`,
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
