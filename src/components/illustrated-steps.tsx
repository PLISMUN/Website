import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type IllustratedStep = {
  title: string;
  description: ReactNode;
  // A short extra note under the description, e.g. a common mistake to avoid
  tip?: ReactNode;
  illustration: ReactNode;
};

// Numbered steps, each next to a small static picture of what it looks like. Used on /supervisors and /delegate-info.
export function IllustratedSteps({ steps }: { steps: IllustratedStep[] }) {
  return (
    <ol className="mt-12 space-y-6 md:mt-16">
      {steps.map((step, index) => (
        <li key={step.title} className="grid items-center gap-6 rounded-2xl border bg-background p-6 shadow-sm md:grid-cols-2 md:gap-10 md:p-8">
          <div className={cn("flex gap-4", index % 2 === 1 && "md:order-2")}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-700 text-lg font-semibold text-white">
              {index + 1}
            </span>
            <div>
              <h3 className="text-foreground text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mt-2">{step.description}</p>
              {step.tip && (
                <p className="mt-4 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-950">{step.tip}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center rounded-xl bg-[linear-gradient(135deg,#f0f9ff_0%,#f8fafc_100%)] p-6" aria-hidden="true">
            {step.illustration}
          </div>
        </li>
      ))}
    </ol>
  );
}

// Building blocks for the small mock-ups of the portal in the illustrations

export function MockCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("w-full max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-md", className)}>{children}</div>;
}

export function MockField({ label, value, active = false }: { label: string; value?: string; active?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <div className={cn("mt-1 h-8 truncate rounded-md border px-2 text-xs leading-8 text-slate-700", active ? "border-sky-600 ring-2 ring-sky-100" : "border-slate-200")}>
        {value}
      </div>
    </div>
  );
}
