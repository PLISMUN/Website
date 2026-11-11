import React from "react";
import { Lock } from "lucide-react";

import { getSiteConfig } from "@/server/site-config";
import { describeConference } from "@/lib/conference";
import { cn } from "@/lib/utils";

const CALLOUTS = [
  { title: "Your delegation at a glance", description: "How many students joined, how many have paid, and how many applications are accepted." },
  { title: "Every student", description: "Contact details, nationality, date of birth and dietary needs." },
  { title: "Committee applications", description: "Each student's choices, colour-coded by status." },
  { title: "Payments", description: "The amount due and whether it's been received." },
];

// Example rows for the illustration; not real data
const EXAMPLE_ROWS = [
  { name: "Student A", email: "student.a@school.edu", diet: "Omnivore", app: "WHO – France", status: "Accepted", paid: true },
  { name: "Student B", email: "student.b@school.edu", diet: "Vegetarian", app: "SC – UK", status: "Pending", paid: true },
  { name: "Student C", email: "student.c@school.edu", diet: "Vegan", app: "ECOSOC – Chair", status: "Pending", paid: false },
  { name: "Student D", email: "student.d@school.edu", diet: "Omnivore", app: "SPECPOL – Brazil", status: "Accepted", paid: true },
];

export default async function SupervisorPortalTour() {
  const { siteDomain } = describeConference((await getSiteConfig()).conference);

  return (
    <section id="portal" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-foreground text-4xl font-semibold">Your delegation, all in one place</h2>
          <p className="text-muted-foreground mt-4 text-balance text-lg">
            Once your application is approved, the PLISMUN portal gives you a live overview of your delegation
            on the <span className="font-medium text-foreground">My Delegation</span> page.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <PortalMock siteDomain={siteDomain} />
          <ol className="space-y-5">
            {CALLOUTS.map((callout, index) => (
              <li key={callout.title} className="flex gap-3">
                <Marker number={index + 1} />
                <div>
                  <h3 className="text-foreground font-semibold">{callout.title}</h3>
                  <p className="text-muted-foreground text-sm">{callout.description}</p>
                </div>
              </li>
            ))}
            <li className="flex gap-3 rounded-xl border bg-muted/50 p-4">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
              <p className="text-muted-foreground text-sm">
                Only approved supervisors of a delegation can see its members.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

function Marker({ number, className }: { number: number; className?: string }) {
  return (
    <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-700 text-xs font-semibold text-white shadow ring-2 ring-white", className)}>
      {number}
    </span>
  );
}

// A static picture of the My Delegation page, with numbered markers matching CALLOUTS
function PortalMock({ siteDomain }: { siteDomain: string }) {
  return (
    <figure
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5"
      aria-label="Illustration of the My Delegation page in the PLISMUN portal"
    >
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 truncate rounded-md bg-white px-3 py-0.5 text-xs text-slate-500 ring-1 ring-slate-200">
          {siteDomain}/user/supervisor/delegation
        </span>
      </div>

      <div className="flex">
        <aside className="hidden w-44 shrink-0 border-r border-slate-200 bg-slate-50/60 p-3 text-xs sm:block">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <img src="/logo.png" alt="" className="size-4" />
            <span className="font-semibold text-slate-900">PLISMUN</span>
          </div>
          <p className="mt-4 px-2 text-[11px] text-slate-500">Supervisor</p>
          <ul className="mt-1 space-y-0.5 text-slate-700">
            <li className="rounded-md px-2 py-1.5">Supervisor Application</li>
            <li className="rounded-md bg-white px-2 py-1.5 font-medium text-slate-950 shadow-sm ring-1 ring-slate-200">My Delegation</li>
            <li className="rounded-md px-2 py-1.5">Payment</li>
          </ul>
        </aside>

        <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
          <div>
            <p className="text-sm font-semibold text-slate-950">Your School Name (YSN)</p>
            <p className="text-xs text-slate-500">Czechia</p>
          </div>

          <div className="relative flex flex-wrap gap-x-5 gap-y-1 rounded-lg border border-dashed border-sky-300 bg-sky-50/50 py-2 pl-6 pr-3 text-xs text-slate-700">
            <Marker number={1} className="absolute -left-2 -top-2" />
            <span><span className="font-medium">Members:</span> 4</span>
            <span><span className="font-medium">Paid:</span> 3 / 4</span>
            <span><span className="font-medium">Accepted applications:</span> 2 / 4</span>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="hidden px-3 py-2 font-medium xl:table-cell">Email</th>
                    <th className="hidden px-3 py-2 font-medium sm:table-cell">Diet</th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">
                      <Marker number={3} className="mr-1.5 inline-flex size-5 align-middle text-[10px]" />Applications
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">
                      <Marker number={4} className="mr-1.5 inline-flex size-5 align-middle text-[10px]" />Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {EXAMPLE_ROWS.map((row) => (
                    <tr key={row.name} className="border-t border-slate-100">
                      <td className="px-3 py-2 whitespace-nowrap">{row.name}</td>
                      <td className="hidden px-3 py-2 underline xl:table-cell">{row.email}</td>
                      <td className="hidden px-3 py-2 sm:table-cell">{row.diet}</td>
                      <td className="px-3 py-2">
                        {row.app}{" "}
                        <span className={row.status === "Accepted" ? "text-green-600" : "text-yellow-600"}>({row.status})</span>
                      </td>
                      <td className={cn("px-3 py-2", row.paid ? "text-green-600" : "text-yellow-600")}>
                        {row.paid ? "Completed" : "Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Marker number={2} className="absolute -left-3 top-10" />
          </div>
        </div>
      </div>
    </figure>
  );
}
