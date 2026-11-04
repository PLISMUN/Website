"use client";

import React, { useState } from "react";
import { Check, ChevronDown, Copy, MailCheck, MousePointer2, School, UsersRound } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import { conference } from "@/config/conference";
import { pricing } from "@/config/pricing";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Create your account",
    description: "Sign up with Google or with your email address. It takes less than a minute.",
    illustration: <SignUpIllustration />,
  },
  {
    title: "Fill in the supervisor application",
    description:
      "Tell us a little about yourself and register your delegation, which is usually your school. If a colleague has already registered your school, choose “Join an existing delegation” instead.",
    illustration: <ApplicationIllustration />,
  },
  {
    title: "We review it and set up your delegation",
    description:
      "Our team checks your application and creates your delegation. We email you when you're approved, and you can follow the status in the portal at any time.",
    illustration: <ReviewIllustration />,
  },
  {
    title: "Pay the supervisor fee",
    description:
      `Once you're approved, open Payment in the portal. You'll find the bank details and a QR code for the supervisor fee of ${pricing.supervisor.czk} CZK (€${pricing.supervisor.eur}). It can take up to 7 business days for us to process your payment.`,
    illustration: <PaymentIllustration />,
  },
  {
    title: "Your students sign up and choose your delegation",
    description:
      "Each student creates their own account and applies for committees. When they fill in their details, they pick your delegation from the list.",
    illustration: <DelegationPickIllustration />,
  },
  {
    title: "Follow everything from My Delegation",
    description:
      "Once you're approved, My Delegation lists every student who joined, with their committee applications, payments and dietary needs.",
    illustration: <MyDelegationIllustration />,
  },
];

export default function SupervisorSteps() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-muted/50 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-foreground text-4xl font-semibold">How it works</h2>
          <p className="text-muted-foreground mt-4 text-balance text-lg">
            From your application to conference day in six steps.
          </p>
        </div>

        <ol className="mt-12 space-y-6 md:mt-16">
          {STEPS.map((step, index) => (
            <li key={step.title} className="grid items-center gap-6 rounded-2xl border bg-background p-6 shadow-sm md:grid-cols-2 md:gap-10 md:p-8">
              <div className={cn("flex gap-4", index % 2 === 1 && "md:order-2")}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-700 text-lg font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-foreground text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground mt-2">{step.description}</p>
                </div>
              </div>
              <div className="flex justify-center rounded-xl bg-[linear-gradient(135deg,#f0f9ff_0%,#f8fafc_100%)] p-6" aria-hidden="true">
                {step.illustration}
              </div>
            </li>
          ))}
        </ol>

        <ShareWithStudents />
      </div>
    </section>
  );
}

function ShareWithStudents() {
  const [copied, setCopied] = useState(false);

  const instructions = [
    "Signing up for PLISMUN:",
    `1. Go to ${conference.siteUrl} and click "Get Started" to create an account.`,
    `2. When asked about yourself, choose our school's delegation under "Delegation".`,
    "3. Choose Delegate or Chair and submit your committee choices.",
    "4. Pay the conference fee from the Payment page in the portal.",
  ].join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(instructions);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-10 rounded-2xl border border-sky-200 bg-sky-50 p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-foreground flex items-center gap-2 text-lg font-semibold">
            <UsersRound className="h-5 w-5 text-sky-700" />
            Instructions to share with your students
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">Copy this into an email or your class chat.</p>
        </div>
        <Button variant="outline" className="cursor-pointer bg-white" onClick={copy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border border-sky-100 bg-white p-4 font-sans text-sm leading-7 text-slate-700">
        {instructions}
      </pre>
    </div>
  );
}

// Small static mock-ups of what the supervisor sees at each step

function MockCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("w-full max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-md", className)}>{children}</div>;
}

function MockField({ label, value, active = false }: { label: string; value?: string; active?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <div className={cn("mt-1 h-8 rounded-md border px-2 text-xs leading-8 text-slate-700", active ? "border-sky-600 ring-2 ring-sky-100" : "border-slate-200")}>
        {value}
      </div>
    </div>
  );
}

function SignUpIllustration() {
  return (
    <MockCard>
      <img src="/logo.png" alt="" className="h-6 w-auto" />
      <p className="mt-3 text-sm font-semibold text-slate-950">Create an account to register your delegation</p>
      <div className="mt-3 flex h-8 items-center justify-center gap-2 rounded-md border border-slate-200 text-xs font-medium text-slate-700">
        <span className="font-bold text-[#4285f4]">G</span> Google
      </div>
      <div className="my-3 h-px bg-slate-200" />
      <MockField label="Email" value="teacher@school.edu" active />
      <div className="mt-3 h-8 rounded-md bg-slate-900 text-center text-xs font-medium leading-8 text-white">Continue</div>
    </MockCard>
  );
}

function ApplicationIllustration() {
  return (
    <MockCard>
      <p className="text-sm font-semibold text-slate-950">Your delegation</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-sky-600 bg-sky-50 p-2 ring-1 ring-sky-600">
          <School className="h-4 w-4 text-sky-700" />
          <p className="mt-1 text-[11px] font-medium leading-tight text-slate-900">Register a new delegation</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-2">
          <UsersRound className="h-4 w-4 text-slate-500" />
          <p className="mt-1 text-[11px] font-medium leading-tight text-slate-600">Join an existing delegation</p>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <MockField label="Delegation name" value="Your School Name" active />
        <div className="grid grid-cols-2 gap-2">
          <MockField label="Country" value="Czechia" />
          <MockField label="Students" value="12" />
        </div>
      </div>
    </MockCard>
  );
}

function ReviewIllustration() {
  const steps = [
    { label: "Applied", done: true },
    { label: "Review", done: true },
    { label: "Approved", done: true },
  ];
  return (
    <div className="w-full max-w-xs space-y-3">
      <MockCard>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-950">Your School Name</p>
          <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">Approved</span>
        </div>
        <div className="mt-4 flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center">
                <span className="flex size-6 items-center justify-center rounded-full bg-sky-700 text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="mt-1 text-[10px] text-slate-600">{step.label}</span>
              </div>
              {index < steps.length - 1 && <span className="mx-1 mb-4 h-0.5 flex-1 bg-sky-700" />}
            </React.Fragment>
          ))}
        </div>
      </MockCard>
      <div className="ml-auto flex w-11/12 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-md">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
          <MailCheck className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-950">Supervisor Application Accepted</p>
          <p className="truncate text-[11px] text-slate-500">Congratulations! Your application…</p>
        </div>
      </div>
    </div>
  );
}

function PaymentIllustration() {
  return (
    <MockCard>
      <p className="text-sm font-semibold text-slate-950">Payment</p>
      <div className="mt-3 inline-flex rounded-md bg-slate-100 p-0.5 text-[11px] font-medium">
        <span className="rounded bg-white px-2.5 py-1 text-slate-950 shadow-sm">CZK</span>
        <span className="px-2.5 py-1 text-slate-500">Euro</span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <QRCodeSVG value="PLISMUN supervisor fee (example)" size={76} className="shrink-0" />
        <div className="min-w-0 space-y-0.5 text-[11px] text-slate-600">
          <p>Park Lane International School</p>
          <p>Bank transfer or QR code</p>
          <p className="font-medium text-slate-950">Amount: {pricing.supervisor.czk} CZK</p>
          <span className="mt-1 inline-block rounded-full bg-green-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">Completed</span>
        </div>
      </div>
    </MockCard>
  );
}

function DelegationPickIllustration() {
  return (
    <MockCard className="relative">
      <p className="text-[11px] font-medium text-slate-500">Delegation</p>
      <div className="mt-1 flex h-8 items-center justify-between rounded-md border border-sky-600 px-2 text-xs text-slate-700 ring-2 ring-sky-100">
        Select a delegation
        <ChevronDown className="h-3.5 w-3.5" />
      </div>
      <div className="mt-1 space-y-0.5 rounded-md border border-slate-200 p-1 text-xs text-slate-700 shadow-sm">
        <p className="rounded px-2 py-1.5">Another School</p>
        <p className="flex items-center justify-between rounded bg-sky-50 px-2 py-1.5 font-medium text-sky-900">
          Your School Name
          <Check className="h-3.5 w-3.5" />
        </p>
        <p className="rounded px-2 py-1.5">One More School</p>
      </div>
      <MousePointer2 className="absolute bottom-10 right-8 h-5 w-5 fill-white text-slate-900" />
    </MockCard>
  );
}

function MyDelegationIllustration() {
  const rows = [
    { name: "Student A", app: "WHO – France", status: "Accepted", paid: true },
    { name: "Student B", app: "SC – UK", status: "Pending", paid: true },
    { name: "Student C", app: "ECOSOC – Chair", status: "Pending", paid: false },
  ];
  return (
    <MockCard className="max-w-sm">
      <p className="text-sm font-semibold text-slate-950">Your School Name</p>
      <p className="text-[11px] text-slate-500">Members: 3 · Paid: 2 / 3</p>
      <table className="mt-3 w-full text-left text-[11px]">
        <thead className="text-slate-500">
          <tr className="border-b border-slate-200">
            <th className="py-1 font-medium">Name</th>
            <th className="py-1 font-medium">Application</th>
            <th className="py-1 font-medium">Paid</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-slate-100 last:border-0">
              <td className="py-1.5">{row.name}</td>
              <td className="py-1.5">
                {row.app} <span className={row.status === "Accepted" ? "text-green-600" : "text-yellow-600"}>({row.status})</span>
              </td>
              <td className={cn("py-1.5", row.paid ? "text-green-600" : "text-yellow-600")}>{row.paid ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MockCard>
  );
}
