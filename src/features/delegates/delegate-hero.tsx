"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { CalendarDays, Check, ChevronRight, CreditCard, ListChecks, MailCheck, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { conference } from "@/config/conference";
import { pricing } from "@/config/pricing";
import { stages } from "@/config/stages";
import { conferenceDatesLong, conferenceEdition } from "@/lib/conference";

// The sections further down /delegate-info, for the "On this page" links. Their ids are set in src/app/delegate-info/page.tsx.
const DELEGATE_SECTIONS = [
  { id: "how-to-apply", label: "How to apply" },
  { id: "committees", label: "Committees" },
  { id: "documents", label: "Documents" },
  { id: "schedule", label: "Schedule" },
  { id: "venues", label: "Venues" },
  { id: "faq", label: "FAQ" },
];

export default function DelegateHero() {
  const { data: session } = useSession();
  const canApply = stages.accountCreation || !!session;
  const applyHref = session ? "/user/dashboard" : "/user/signup";

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_35%,#eef7fb_72%,#ffffff_100%)] pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(14,165,233,0.09),transparent_28%),radial-gradient(circle_at_78%_42%,rgba(15,23,42,0.05),transparent_30%)]" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            Become a delegate at {conferenceEdition}
          </h1>

          <p className="mt-6 max-w-xl text-balance text-lg leading-8 text-muted-foreground">
            Represent a country, debate real global issues and work with students from other schools.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-11 rounded-full px-6" disabled={!canApply}>
              <Link
                href={applyHref}
                onClick={(e) => {
                  if (!canApply) e.preventDefault();
                }}
              >
                <span className="text-nowrap">Apply as a Delegate</span>
                <ChevronRight className="ml-1 h-4 w-4 opacity-60" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 rounded-full bg-white/80 px-6">
              <a href="#how-to-apply">
                <span className="text-nowrap">See how to apply</span>
              </a>
            </Button>
          </div>

          {!stages.delegateApplication ? (
            <p className="mt-4 text-sm text-muted-foreground">Delegate applications are currently closed.</p>
          ) : !session && (
            <p className="mt-4 text-sm text-muted-foreground">
              Already applied?{" "}
              <Link href={`/user/login?next=${encodeURIComponent("/user/applications")}`} className="font-medium text-sky-700 underline">
                Log in to check your status
              </Link>
            </p>
          )}

          <ul className="mt-8 flex flex-wrap gap-3 text-sm">
            <li className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 shadow-sm">
              <CalendarDays className="h-4 w-4 text-sky-700" />
              {conferenceDatesLong}
            </li>
            <li className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 shadow-sm">
              <CreditCard className="h-4 w-4 text-sky-700" />
              Delegate fee: {pricing.delegate.czk} CZK / €{pricing.delegate.eur}
            </li>
          </ul>
        </div>

        <PlacardIllustration />
      </div>

      <nav aria-label="On this page" className="relative z-10 mx-auto mt-14 max-w-6xl px-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="mr-1 font-medium text-slate-950">On this page:</span>
          {DELEGATE_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 shadow-sm transition-colors hover:border-sky-300 hover:text-sky-800"
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>
    </section>
  );
}

// A delegate's country placard in committee, with the application around it
function PlacardIllustration() {
  return (
    <figure className="relative mx-auto w-full max-w-md" aria-label="Illustration: a delegate's country placard for their committee">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 pb-14 pt-14 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-10 sm:pt-14">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">World Health Organisation</p>

        <div className="mx-auto mt-5 max-w-xs">
          <div className="rounded-t-xl border border-slate-300 bg-white px-6 py-7 text-center shadow-sm">
            <p className="text-3xl font-bold tracking-[0.25em] text-slate-950 sm:text-4xl">FRANCE</p>
          </div>
          <div className="h-3 rounded-b-md bg-slate-200 [clip-path:polygon(0_0,100%_0,94%_100%,6%_100%)]" />
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">Delegate · {conferenceEdition}</p>
      </div>

      <div className="absolute -left-2 -top-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg sm:-left-8">
        <span className="flex size-7 items-center justify-center rounded-full bg-sky-50 text-sky-700">
          <ListChecks className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] text-slate-500">Choice 1 of 3</p>
          <p className="text-xs font-semibold text-slate-950">WHO · France</p>
        </div>
      </div>

      <div className="absolute -bottom-5 -right-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:-right-6">
        <span className="flex size-8 items-center justify-center rounded-full bg-green-50 text-green-700">
          <MailCheck className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs text-slate-600">Application</p>
          <p className="flex items-center gap-1 text-sm font-semibold text-green-700">
            <Check className="h-3.5 w-3.5" /> Accepted
          </p>
        </div>
      </div>
    </figure>
  );
}
