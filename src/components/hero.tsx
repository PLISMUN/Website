"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CalendarDays, ChevronRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { stages } from "@/config/stages";

const IMAGES = ["/headers/headertest3.webp"];
const STACKED_IMAGES = [
  "/headers/subheaders/IMG_2646.webp",
  "/headers/subheaders/IMG_2693.webp",
  "/headers/subheaders/IMG_2837.webp",
  "/headers/subheaders/IMG_3312.webp",
  "/headers/subheaders/IMG_3415.webp",
  "/headers/subheaders/IMG_3448.webp",
  "/headers/subheaders/IMG_3470.webp",
  "/headers/subheaders/IMG_3573.webp",
  "/headers/subheaders/IMG_3591.webp",
  "/headers/subheaders/IMG_3722.webp",
  "/headers/subheaders/IMG_3740.webp",
  "/headers/subheaders/IMG_4874.webp",
  "/headers/subheaders/IMG_5460.webp",
  "/headers/subheaders/IMG_6213.webp",
  "/headers/subheaders/IMG_6303.webp",
  "/headers/subheaders/IMG_6305.webp",
  "/headers/subheaders/IMG_6343.webp",
  "/headers/subheaders/IMG_6473.webp",
  "/headers/subheaders/IMG_6549.webp",
];

export default function HeroSection() {
  const { data: session } = useSession();
  const [randomImage, setRandomImage] = React.useState(IMAGES[0]);
  const [randomImageStacked, setRandomImageStacked] = React.useState(STACKED_IMAGES[0],);

  React.useEffect(() => {
    setRandomImageStacked(
      STACKED_IMAGES[Math.floor(Math.random() * STACKED_IMAGES.length)],
    );
  }, []);

  React.useEffect(() => {
    setRandomImage(IMAGES[Math.floor(Math.random() * IMAGES.length)]);
  }, []);

  return (
    <main className="overflow-hidden">
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_35%,#eef7fb_72%,#ffffff_100%)] py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(14,165,233,0.09),transparent_28%),radial-gradient(circle_at_78%_42%,rgba(15,23,42,0.05),transparent_30%)]" />
        <div className="pointer-events-none absolute -top-24 left-[48%] h-[135%] w-32 -translate-x-1/2 rotate-[24deg] bg-sky-100/55 md:w-44" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-white/70 to-white" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="md:w-[45%]">
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
                  href="/user/signup"
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
                    href="/user/login"
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
              {!stages.accountCreation && (
                <p className="text-sm text-muted-foreground">
                  Account creation is currently closed.
                </p>
              )}
            </div>

            <div className="mt-10">
              <p className="text-sm text-muted-foreground">Partnered with</p>

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
        </div>

        <div className="perspective-near relative mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0">
          <div className="relative h-[87.5%] -translate-y-12 skew-x-6">
            <div className="relative h-full isolate before:absolute before:-inset-x-4 before:bottom-0 before:top-0 before:-z-10 before:translate-y-10 before:rounded-[calc(var(--radius)+1rem)] before:border before:border-foreground/5 before:bg-foreground/5">
              <div className="relative z-10 size-full overflow-hidden rounded-[calc(var(--radius)+0.35rem)] border border-white/70 bg-background ring-1 ring-foreground/5">
                <Image
                  src={randomImage}
                  alt="app screen"
                  width={2880}
                  height={1842}
                  className="size-full object-cover object-top-left"
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 z-20 aspect-video w-2/3 translate-x-1 translate-y-2 skew-x-6">
            <div className="relative h-full isolate before:absolute before:-inset-x-3 before:bottom-0 before:top-0 before:-z-10 before:translate-y-6 before:rounded-[1.5rem] before:border before:border-foreground/5 before:bg-foreground/5">
              <div className="relative z-10 size-full rounded-[1.25rem] border border-white/40 bg-white/20 p-1.5 backdrop-blur-xl">
                <Image
                  src={randomImageStacked}
                  alt="stacked detail screen"
                  fill
                  className="rounded-[0.9rem] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}