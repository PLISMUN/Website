"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CalendarDays, ChevronRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { stages } from "@/config/stages";

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <>
      <main className="overflow-hidden">
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_35%,#eef7fb_72%,#ffffff_100%)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(14,165,233,0.09),transparent_28%),radial-gradient(circle_at_78%_42%,rgba(15,23,42,0.05),transparent_30%)]" />

          <div className="pointer-events-none absolute -top-24 left-[48%] h-[135%] w-32 -translate-x-1/2 rotate-[24deg] bg-sky-100/55 md:w-44" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-white/70 to-white" />

          <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="grid items-center gap-16 md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative z-10">
                <h1 className="max-w-xl text-balance text-5xl font-semibold tracking-tight text-slate-950 md:text-7xl">
                  PLISMUN&apos;27
                </h1>

                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-100/70 px-3 py-1.5 text-sky-900 shadow-sm backdrop-blur">
                    <CalendarDays className="h-4 w-4 text-sky-700" />
                    Jan 28 – Jan 31, 2027
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-100/70 px-3 py-1.5 text-sky-900 shadow-sm backdrop-blur">
                    <MapPin className="h-4 w-4 text-sky-700" />
                    Prague
                  </span>
                </div>

                <p className="mt-6 max-w-xl text-balance text-lg leading-8 text-muted-foreground md:text-xl">
                  The internationally renowned Model United Nations conference
                  organized by Park Lane International School returns for its
                  tenth year.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="h-11 rounded-full px-6"
                    disabled={!stages.accountCreation}
                  >
                    <Link 
                      href={"/user/signup"}
                      onClick={(e) => {
                        if (!stages.accountCreation) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <span className="text-nowrap">Get Started</span>
                      <ChevronRight className="ml-1 h-4 w-4 opacity-60" />
                    </Link>
                  </Button>

                  {!session && (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-11 rounded-full bg-white/80 px-6"
                      disabled={!stages.accountCreation}
                    >
                      <Link 
                        href={"/user/login"}
                        onClick={(e) => {
                          if (!stages.accountCreation) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <span className="text-nowrap">Log in</span>
                      </Link>
                    </Button>
                  )}
                </div>

                <div className="mt-10">
                  <p className="text-sm text-muted-foreground">
                    Partnered with
                  </p>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <img
                        className="h-9 w-auto"
                        src="https://i.redd.it/gzn9i302mxe71.jpg"
                        alt="Partner logo"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative md:translate-y-8">
                <div className="absolute -inset-6 rounded-[2rem] bg-sky-100/70 blur-3xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-2xl">
                  <Image
                    src="/headers/headertest3.png"
                    alt="Prague skyline"
                    width={2880}
                    height={1842}
                    priority
                    className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}