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
  { label: "Delegate?", href: "/delegate-info"},
  { label: "Documents", href: "/documents" },
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
            "group relative text-base",
            isActive
              ? (isMobile ? "text-sky-700" : "text-slate-950")
              : "text-slate-700 hover:text-slate-950"
          )}
        >
          {link.label}
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-[2px] bg-sky-700 transition-all duration-300",
                isActive ? "w-full" : "w-0 group-hover:w-full"
              )}
            />
        </Link>
      );
    });

  const renderAuthButtons = (isMobile: boolean) => {
    const btnClass = cn("rounded-full font-semibold", isMobile && "w-full");
    const textSize = isMobile ? undefined : { fontSize: "large" };

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
         <a aria-label="Instagram Icon" href="https://www.instagram.com/plismun/"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={32} height={32}><path fill="lab(26.9569% -1.47016 -15.6993)" d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z"/></svg></a>
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
                <a aria-label="Instagram Icon" href="https://www.instagram.com/plismun/"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={32} height={32}><path fill="lab(26.9569% -1.47016 -15.6993)" d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z"/></svg></a>
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