"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/data/site";
import { Container } from "./ui";
import { Phone, ArrowUpRight, MessageSquareQuote } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? "border-b border-line bg-surface/95 backdrop-blur-md shadow-sm"
            : "border-b border-white/10 bg-navy/20 backdrop-blur-sm"
        }`}
      >
        <Container>
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Brand Logo */}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-2.5 sm:gap-3.5 min-w-0"
            >
              <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-accent/60 bg-navy shadow-md shadow-accent/10 transition-transform group-hover:scale-105 shrink-0">
                <span className="font-display text-xs sm:text-sm font-extrabold text-accent tracking-tight">3S</span>
              </div>
              <div className="leading-none min-w-0">
                <span
                  className={`block font-display text-sm sm:text-base font-bold tracking-tight truncate ${
                    scrolled || open ? "text-foreground" : "text-onnavy"
                  }`}
                >
                  THREE STAR
                </span>
                <div className="mt-0.5 sm:mt-1 flex items-center gap-1.5">
                  <span className="font-sans text-[0.62rem] sm:text-[0.68rem] font-bold text-accent tracking-wider uppercase">
                    ENTERPRISES
                  </span>
                  <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-accent" />
                  <span className="hidden sm:inline-block font-sans text-[0.68rem] text-muted">
                    Pune Works
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
              {NAV_LINKS.map((l) => {
                const active = pathname === l.to || (l.to !== "/" && pathname?.startsWith(l.to));
                return (
                  <Link
                    key={l.to}
                    href={l.to}
                    className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                      scrolled
                        ? active
                          ? "text-accent font-semibold"
                          : "text-steel hover:text-accent"
                        : active
                          ? "text-accent font-semibold"
                          : "text-onnavy/90 hover:text-accent"
                    }`}
                  >
                    {l.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-accent transition-all duration-300 ${
                        active ? "w-full shadow-[0_0_8px_rgba(14,165,233,0.8)]" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Action CTAs */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mobile Direct Quote Button */}
              <Link
                href="/quote"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 rounded-xl bg-accent px-3 py-2 text-[0.72rem] font-bold tracking-wide text-navy uppercase transition-all duration-300 hover:bg-accent-hover active:scale-95 shadow-sm lg:hidden"
              >
                <MessageSquareQuote className="h-3.5 w-3.5" />
                <span>Get Quote</span>
              </Link>

              {/* Desktop Quote Button */}
              <Link
                href="/quote"
                className="hidden rounded-xl bg-accent px-5 py-2.5 text-xs font-bold tracking-wide text-navy uppercase transition-all duration-300 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 active:scale-95 lg:inline-flex"
              >
                Get a Quote
              </Link>

              {/* Mobile Menu Hamburger / Close Button */}
              <button
                type="button"
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border lg:hidden transition-colors cursor-pointer ${
                  scrolled || open
                    ? "border-line text-foreground hover:border-accent bg-surface"
                    : "border-onnavy/30 text-onnavy hover:border-accent bg-navy/40"
                }`}
              >
                <span className="relative block h-3.5 w-5">
                  <span
                    className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-300 ${
                      open ? "top-1.5 rotate-45 bg-accent" : "top-0"
                    }`}
                  />
                  <span
                    className={`absolute top-1.5 left-0 block h-0.5 w-full bg-current transition-all duration-300 ${
                      open ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-300 ${
                      open ? "top-1.5 -rotate-45 bg-accent" : "top-3"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Drawer Navigation */}
        <div
          className={`overflow-y-auto border-t border-line bg-surface transition-all duration-300 lg:hidden shadow-2xl ${
            open
              ? "max-h-[calc(100dvh-4.5rem)] opacity-100 visible"
              : "max-h-0 opacity-0 invisible pointer-events-none"
          }`}
        >
          <Container className="py-5 sm:py-6">
            <ul className="divide-y divide-line">
              {NAV_LINKS.map((l, i) => {
                const active = pathname === l.to || (l.to !== "/" && pathname?.startsWith(l.to));
                return (
                  <li key={l.to}>
                    <Link
                      href={l.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between py-3.5 text-sm font-medium transition-colors ${
                        active
                          ? "text-accent font-bold"
                          : "text-foreground hover:text-accent active:text-accent"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                        <span>{l.label}</span>
                      </span>
                      <span className="font-mono text-xs text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 pt-5 border-t border-line space-y-3">
              <Link
                href="/quote"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-accent py-3.5 text-center text-xs font-bold tracking-[0.12em] text-navy uppercase shadow-md active:scale-98 transition-all"
              >
                <span>Request a Price Quote</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-line bg-background py-3 text-center text-xs font-bold tracking-wider text-foreground hover:border-accent hover:text-accent uppercase transition-all"
              >
                <span>Contact Workshop</span>
              </Link>

              {/* Quick Direct Phone Call Button */}
              <div className="pt-2">
                <a
                  href="tel:+919823463655"
                  className="flex items-center justify-center gap-2 rounded-xl bg-accent/10 border border-accent/30 py-2.5 px-4 text-xs font-semibold text-accent hover:bg-accent hover:text-navy transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>Call Workshop: +91 9823463655</span>
                </a>
              </div>
            </div>
          </Container>
        </div>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 top-16 sm:top-20 z-40 bg-navy/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}
    </>
  );
}
