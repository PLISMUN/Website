"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { stages } from "@/config/stages";

export function HeroHeader() {
  const { data: session } = useSession();

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);

    onScroll();
    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "About", href: "/about" },
    { label: "This Year", href: "/this-year" },
    { label: "FAQ", href: "/faq" },
  ];

  const solidHeader = isScrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed left-0 top-0 z-50 w-full transition-all duration-500",
        solidHeader ? "px-4 pt-3" : "px-0 pt-0"
      )}
    >
      <nav
        className={cn(
          "relative mx-auto max-w-6xl transition-all duration-500",
          solidHeader
            ? "rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-900/10 backdrop-blur-xl"
            : "rounded-none border border-transparent bg-transparent shadow-none"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between px-8 transition-all duration-500",
            solidHeader ? "py-2.5" : "py-3"
          )}
        >
          <div className="flex items-center gap-8">
            <Link
              href="/"
              aria-label="Go to homepage"
              className="flex h-9 w-9 shrink-0 items-center justify-center"
            >
              <Image
                src="/logo.png"
                alt="PLISMUN logo"
                width={36}
                height={36}
                priority
                unoptimized
                className="block h-9 w-9 object-contain"
              />
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative text-sm font-medium text-slate-700 transition hover:text-slate-950"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-sky-700 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/user/login"
                  className="text-sm font-medium text-slate-700 transition duration-300 hover:text-slate-950"
                >
                  Login
                </Link>

                <Link
                  href={stages.accountCreation ? "/user/signup" : "#"}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition duration-300",
                    stages.accountCreation
                      ? "bg-slate-950 text-white hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
                      : "cursor-not-allowed bg-slate-300 text-slate-500"
                  )}
                  aria-disabled={!stages.accountCreation}
                  onClick={(e) => {
                    if (!stages.accountCreation) {
                      e.preventDefault();
                    }
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition duration-300 hover:scale-105 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={cn(
            "overflow-hidden transition-all duration-500 ease-out md:hidden",
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-slate-200/80 px-6 pb-6 pt-4">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex gap-3 pt-2">
                {session ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/user/login"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      Login
                    </Link>

                    <Link
                      href={
                        stages.accountCreation
                          ? "/user/signup"
                          : "#"
                      }
                      onClick={(e) => {
                        if (!stages.accountCreation) {
                          e.preventDefault();
                        } else {
                          setMenuOpen(false);
                        }
                      }}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium",
                        stages.accountCreation
                          ? "bg-slate-950 text-white"
                          : "cursor-not-allowed bg-slate-300 text-slate-500"
                      )}
                      aria-disabled={!stages.accountCreation}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeroHeader;