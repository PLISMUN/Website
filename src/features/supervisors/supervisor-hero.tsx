"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { CalendarDays, ChevronRight, Clock, CreditCard, School, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/features/site-config/context";
import { SUPERVISOR_APPLY_PATH, supervisorApplyHref } from "./paths";
import { describeConference } from "@/lib/conference";

const EXAMPLE_STUDENTS = [
  { initials: "AK", committee: "WHO", role: "France" },
  { initials: "LM", committee: "SC", role: "UK" },
  { initials: "JS", committee: "ECOSOC", role: "Chair" },
];

export default function SupervisorHero() {
  const { conference, pricing, stages } = useSiteConfig();
  const conferenceDatesLong = describeConference(conference).datesLong;
  const { data: session } = useSession();
  const canApply = stages.accountCreation || !!session;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_35%,#eef7fb_72%,#ffffff_100%)] pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(14,165,233,0.09),transparent_28%),radial-gradient(circle_at_78%_42%,rgba(15,23,42,0.05),transparent_30%)]" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>

          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            Bring your delegation to PLISMUN
          </h1>

          <p className="mt-6 max-w-xl text-balance text-lg leading-8 text-muted-foreground">
            Supervisors have their own application, separate from students. Register your school&apos;s
            delegation in a few minutes, then follow every student&apos;s applications and payments from one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-11 rounded-full px-6" disabled={!canApply}>
              <Link
                href={supervisorApplyHref(!!session)}
                onClick={(e) => {
                  if (!canApply) e.preventDefault();
                }}
              >
                <span className="text-nowrap">Apply as a Supervisor</span>
                <ChevronRight className="ml-1 h-4 w-4 opacity-60" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 rounded-full bg-white/80 px-6">
              <a href="#how-it-works">
                <span className="text-nowrap">See how it works</span>
              </a>
            </Button>
          </div>

          {!stages.supervisorApplication ? (
            <p className="mt-4 text-sm text-muted-foreground">Supervisor applications are currently closed.</p>
          ) : !session && (
            <p className="mt-4 text-sm text-muted-foreground">
              Already applied?{" "}
              <Link href={`/user/login?next=${encodeURIComponent(SUPERVISOR_APPLY_PATH)}`} className="font-medium text-sky-700 underline">
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
              Supervisor fee: {pricing.supervisor.czk} CZK / €{pricing.supervisor.eur}
            </li>
          </ul>
        </div>

        <DelegationDiagram />
      </div>
    </section>
  );
}

function DelegationDiagram() {
  return (
    <figure className="relative mx-auto w-full max-w-md" aria-label="Diagram: a supervisor leads a delegation that their students join">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 pb-16 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8 sm:pb-16">
        <div className="flex justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-full bg-sky-700 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">You</p>
              <p className="text-xs text-slate-600">Supervisor</p>
            </div>
          </div>
        </div>

        <span className="mx-auto block h-6 w-px bg-sky-300" aria-hidden="true" />

        <div className="flex justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <School className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">Your school&apos;s delegation</p>
              <p className="text-xs text-slate-600">Created when we approve you</p>
            </div>
          </div>
        </div>

        <span className="mx-auto block h-6 w-px bg-sky-300" aria-hidden="true" />

        <div className="relative grid grid-cols-3 gap-2 pt-6 sm:gap-3">
          <span className="absolute left-[16.66%] right-[16.66%] top-0 h-px bg-sky-300" aria-hidden="true" />
          {EXAMPLE_STUDENTS.map((student) => (
            <div key={student.initials} className="relative flex flex-col items-center">
              <span className="absolute -top-6 h-6 w-px bg-sky-300" aria-hidden="true" />
              <div className="flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white px-2 py-3 text-center shadow-sm">
                <span className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {student.initials}
                </span>
                <p className="mt-2 text-xs font-medium text-slate-950">Student</p>
                <span className="mt-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-800">
                  {student.committee} · {student.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-600">
          <UserRound className="h-3.5 w-3.5" />
          Students choose your delegation when they sign up
        </p>
      </div>

      <div className="absolute -bottom-5 -right-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:-right-6">
        <p className="text-xs text-slate-600">My Delegation</p>
        <p className="text-sm font-semibold text-slate-950">
          3 members · <span className="text-green-600">2 paid</span>
        </p>
      </div>
    </figure>
  );
}
