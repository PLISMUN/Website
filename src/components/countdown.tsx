"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2027-01-28T09:00:00+01:00").getTime();

function getTimeLeft() {
  const diff = Math.max(0, EVENT_DATE - Date.now());

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const initialTimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    setTimeLeft(getTimeLeft());

    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const shownTimeLeft = mounted ? timeLeft : initialTimeLeft;

  const units = [
    ["Days", shownTimeLeft.days],
    ["Hours", shownTimeLeft.hours],
    ["Minutes", shownTimeLeft.minutes],
    ["Seconds", shownTimeLeft.seconds],
  ] as const;

  return (
    <section className="mx-auto my-20 max-w-5xl px-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-800/40 to-transparent" />

        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-sky-50 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-slate-50 blur-3xl" />

        <div className="relative px-6 py-10 text-center sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Prague awaits!
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            January 28th – January 31st, 2027 · Prague
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {units.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
              >
                <div className="text-4xl font-bold tabular-nums tracking-tight text-slate-950 sm:text-5xl">
                  {String(value).padStart(2, "0")}
                </div>

                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}