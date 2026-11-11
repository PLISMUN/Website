"use client";

import Link from "next/link";
import { Check, ChevronDown, Clock, MailCheck } from "lucide-react";
import { IconLaurelWreath, IconPodium } from "@tabler/icons-react";
import { QRCodeSVG } from "qrcode.react";

import { IllustratedSteps, MockCard, MockField, type IllustratedStep } from "@/components/illustrated-steps";
import { pricing } from "@/config/pricing";
import { stages } from "@/config/stages";

const STEPS: IllustratedStep[] = [
  {
    title: "Create your account",
    description: "Sign up with Google or with your email address. It takes less than a minute.",
    illustration: <SignUpIllustration />,
  },
  {
    title: "Tell us about yourself",
    description:
      "Fill in your name, phone number, nationality, date of birth and diet, plus a short note on your MUN experience. Under Delegation, choose your school. If we can't safely cater for your diet or allergies, choose “No Lunch”.",
    tip: (
      <>
        School not in the list? Ask your teacher to register it on the{" "}
        <Link href="/supervisors" className="font-medium underline">Supervisors page</Link>. You can change your delegation later.
      </>
    ),
    illustration: <AboutYouIllustration />,
  },
  {
    title: "Choose Delegate or Chair",
    description: `Most students apply as a Delegate. Experienced delegates can apply to chair a committee, and can also apply as a delegate in case their chair application isn't successful.${
      stages.chairApplication ? "" : " Chair applications are closed at the moment."
    }`,
    illustration: <TypePickIllustration />,
  },
  {
    title: "Pick your three committee choices",
    description:
      "For each choice, pick a committee and a role (the country you'd represent), then tell us why you want it. All three choices are required, and each role shows how difficult it is.",
    tip: (
      <>
        You are not guranteed to recieve your preferred choices, country, or committee. We always attempt to match you with your preferences, but cannot guarantee a specific outcome. When neccesarry, the Admissions team has the power to make the final decision.{" "}
        <a href="#committees" className="font-medium underline">Browse the committees below</a>.
      </>
    ),
    illustration: <ChoicesIllustration />,
  },
  {
    title: "Pay the delegate fee",
    description: `Open Payment in the portal and send ${pricing.delegate.czk} CZK (€${pricing.delegate.eur}) by bank transfer from your own or a parent's bank account. There is no card payment. Your application is only reviewed once your payment has been processed, which can take up to 7 business days.`,
    tip: (
      <>
        Applying to chair? Don&apos;t pay until your chair application is accepted. Your amount is then changed to the
        chair fee of {pricing.chair.czk} CZK (€{pricing.chair.eur}) automatically.
      </>
    ),
    illustration: <PaymentIllustration />,
  },
  {
    title: "Get your committee and start preparing",
    description:
      "We email you when your application is accepted, and you can follow its status under Applications in the portal at any time. Then read your committee's study guide and the rules of procedure.",
    tip: (
      <>
        The study guides are under <a href="#documents" className="font-medium underline">Documents</a> further down this page.
      </>
    ),
    illustration: <AcceptedIllustration />,
  },
];

export default function DelegateSteps() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-foreground text-4xl font-semibold">How to apply</h2>
          <p className="text-muted-foreground mt-4 text-balance text-lg">
            From creating your account to your first committee session, in six steps.
          </p>
        </div>

        <IllustratedSteps steps={STEPS} />
      </div>
    </section>
  );
}

// Small static mock-ups of what the delegate sees at each step

function SignUpIllustration() {
  return (
    <MockCard>
      <img src="/logo.png" alt="" className="h-6 w-auto" />
      <p className="mt-3 text-sm font-semibold text-slate-950">Create your PLISMUN account</p>
      <div className="mt-3 flex h-8 items-center justify-center gap-2 rounded-md border border-slate-200 text-xs font-medium text-slate-700">
        <span className="font-bold text-[#4285f4]">G</span> Google
      </div>
      <div className="my-3 h-px bg-slate-200" />
      <MockField label="Email" value="you@example.com" active />
      <div className="mt-3 h-8 rounded-md bg-slate-900 text-center text-xs font-medium leading-8 text-white">Continue</div>
    </MockCard>
  );
}

function AboutYouIllustration() {
  return (
    <MockCard>
      <p className="text-sm font-semibold text-slate-950">Let&apos;s get to know you</p>
      <div className="mt-3 space-y-2">
        <MockField label="Full name" value="Alex Novak" />
        <div className="grid grid-cols-2 gap-2">
          <MockField label="Nationality" value="Czechia" />
          <MockField label="Date of birth" value="14 Mar 2009" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Delegation</p>
          <div className="mt-1 flex h-8 items-center justify-between rounded-md border border-sky-600 px-2 text-xs text-slate-700 ring-2 ring-sky-100">
            Your School Name
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </div>
        <MockField label="Diet" value="Vegetarian" />
      </div>
    </MockCard>
  );
}

function TypePickIllustration() {
  return (
    <MockCard>
      <p className="text-sm font-semibold text-slate-950">Pick what to apply for</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center rounded-lg border border-sky-600 bg-sky-50 p-3 ring-1 ring-sky-600">
          <IconPodium className="size-8 text-sky-800" stroke={1.25} />
          <p className="mt-1 text-xs font-medium text-slate-900">Delegate</p>
        </div>
        <div className="flex flex-col items-center rounded-lg border border-slate-200 p-3">
          <IconLaurelWreath className="size-8 text-slate-500" stroke={1.25} />
          <p className="mt-1 text-xs font-medium text-slate-600">Chair</p>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-snug text-slate-500">Applying to chair? You can apply as a delegate too.</p>
    </MockCard>
  );
}

function ChoicesIllustration() {
  return (
    <div className="relative w-full max-w-xs pr-4 pt-10">
      <div className="absolute bottom-6 right-0 top-0 w-[calc(100%-2rem)] rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-right text-[11px] font-medium leading-4 text-slate-400 shadow-sm">
        Choice 3
      </div>
      <div className="absolute bottom-3 right-2 top-[18px] w-[calc(100%-1.5rem)] rounded-xl border border-slate-200 bg-white px-3 py-1 text-right text-[11px] font-medium leading-4 text-slate-500 shadow-sm">
        Choice 2
      </div>
      <MockCard className="relative">
        <p className="text-sm font-semibold text-slate-950">Choice 1</p>
        <div className="mt-3 space-y-2">
          <MockField label="Committee" value="World Health Organisation" />
          <MockField label="Role" value="France (Intermediate)" active />
          <div>
            <p className="text-[11px] font-medium text-slate-500">Why would you like this role?</p>
            <div className="mt-1 space-y-1.5 rounded-md border border-slate-200 p-2">
              <div className="h-1.5 w-full rounded-full bg-slate-200" />
              <div className="h-1.5 w-11/12 rounded-full bg-slate-200" />
              <div className="h-1.5 w-2/3 rounded-full bg-slate-200" />
            </div>
            <p className="mt-1 text-[10px] text-slate-500">At least 250 characters</p>
          </div>
        </div>
      </MockCard>
    </div>
  );
}

function PaymentIllustration() {
  return (
    <MockCard>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-950">Pay your conference fee</p>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800">
          <Clock className="h-3 w-3" /> Not received yet
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <QRCodeSVG value="PLISMUN delegate fee (example)" size={76} className="shrink-0" />
        <div className="min-w-0 flex-1 divide-y divide-slate-100 rounded-md border border-slate-200 text-[11px]">
          <div className="bg-sky-50 px-2 py-1">
            <p className="text-slate-500">Amount</p>
            <p className="font-medium text-slate-950">{pricing.delegate.czk} CZK</p>
          </div>
          <div className="bg-sky-50 px-2 py-1">
            <p className="text-slate-500">Message for recipient</p>
            <p className="font-medium text-slate-950">AlexNovak</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-slate-500">Bank transfer only · scan inside your banking app</p>
    </MockCard>
  );
}

function AcceptedIllustration() {
  return (
    <div className="w-full max-w-xs space-y-3">
      <MockCard>
        <p className="text-[11px] text-slate-500">Applications</p>
        <div className="mt-2 rounded-lg border border-slate-200 p-3">
          <p className="text-sm font-semibold text-slate-950">World Health Organisation</p>
          <p className="mt-1 text-xs text-slate-700"><span className="font-medium">Role:</span> France</p>
          <p className="mt-0.5 text-xs text-slate-700">
            <span className="font-medium">Status:</span> <span className="text-green-600">Accepted</span>
          </p>
        </div>
      </MockCard>
      <div className="ml-auto flex w-11/12 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-md">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
          <MailCheck className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate text-xs font-semibold text-slate-950">
            <Check className="h-3 w-3 text-green-600" /> Application Accepted
          </p>
          <p className="truncate text-[11px] text-slate-500">Congratulations! Your application for…</p>
        </div>
      </div>
    </div>
  );
}
