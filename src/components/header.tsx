"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { stages } from "@/config/stages";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Details", href: "/this-year" },
  { label: "Team", href: "/team" },
  { label: "FAQ", href: "/faq" },
];

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solidHeader = isScrolled || menuOpen;
  const closeMenu = () => setMenuOpen(false);

  const renderLinks = (isMobile: boolean) =>
    links.map((link) => {
      const isActive = pathname === link.href;
      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={isMobile ? closeMenu : undefined}
          style={{ fontSize: isMobile ? undefined : "larger" }}
          className={cn(
            "font-medium transition",
            isMobile ? "text-base" : "group relative text-base",
            isActive
              ? (isMobile ? "text-sky-700" : "text-slate-950")
              : "text-slate-700 hover:text-slate-950"
          )}
        >
          {link.label}
          {!isMobile && (
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-[2px] bg-sky-700 transition-all duration-300",
                isActive ? "w-full" : "w-0 group-hover:w-full"
              )}
            />
          )}
        </Link>
      );
    });

  const renderAuthButtons = (isMobile: boolean) => {
    const btnClass = cn("rounded-full font-semibold", isMobile && "w-full");
    const textSize = isMobile ? { fontSize: "large" } : undefined;

    const handleAuthClick = (e: React.MouseEvent) => {
      if (!stages.accountCreation) {
        e.preventDefault();
      } else if (isMobile) {
        closeMenu();
      }
    };

    if (session) {
      return (
        <Button asChild className={btnClass}>
          <Link
            href="/user/dashboard"
            onClick={isMobile ? closeMenu : undefined}
            style={textSize}
          >
            Dashboard
          </Link>
        </Button>
      );
    }

    return (
      <>
        <Button
          asChild
          variant="outline"
          className={cn(btnClass, "bg-white/80")}
          disabled={!stages.accountCreation}
        >
          <Link href={"/user/login"} onClick={handleAuthClick}>
            Login
          </Link>
        </Button>

        <Button
          asChild
          className={btnClass}
          disabled={!stages.accountCreation}
        >
          <Link
            href={stages.accountCreation ? "/user/signup" : "#"}
            onClick={handleAuthClick}
            style={textSize}
          >
            {isMobile ? "Sign Up" : "Get Started"}
          </Link>
        </Button>
      </>
    );
  };

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
              className="flex shrink-0 items-center justify-center"
            >
              <Image
                src="/logo.png"
                alt="PLISMUN logo"
                width={50}
                height={50}
                priority
                className="block object-contain"
              />
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              {renderLinks(false)}
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {renderAuthButtons(false)}
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
              {renderLinks(true)}
              <div className="flex flex-col gap-3 pt-2">
                {renderAuthButtons(true)}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;