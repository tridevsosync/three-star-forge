"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/data/site";
import { Container } from "./ui";

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
        scrolled || open
          ? "border-b border-line bg-surface/95 backdrop-blur-md shadow-sm"
          : "border-b border-white/10 bg-navy/20 backdrop-blur-sm"
      }`}
    >
      <Container>
        <div
          className={`flex items-center justify-between transition-all duration-400 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-3.5">
            <div className="relative flex h-10 w-10 items-center justify-center border border-accent bg-navy">
              <span className="absolute inset-0.5 border border-accent/40" />
              <span className="font-mono text-xs font-bold text-accent tracking-tighter">3S</span>
            </div>
            <div className="leading-none">
              <span
                className={`block font-display text-sm font-bold tracking-[0.16em] sm:text-base ${
                  scrolled || open ? "text-foreground" : "text-onnavy"
                }`}
              >
                THREE STAR
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="tech-label text-accent font-semibold">ENTERPRISES</span>
                <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-accent" />
                <span className="hidden sm:inline-block font-mono text-[0.62rem] text-muted tracking-wider uppercase">
                  Pune, India
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
                  className={`relative py-1 text-[0.82rem] font-medium tracking-wider transition-colors duration-300 ${
                    scrolled
                      ? active
                        ? "text-accent font-semibold"
                        : "text-steel hover:text-accent"
                      : active
                        ? "text-accent font-semibold"
                        : "text-onnavy/80 hover:text-accent"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      active ? "w-full shadow-[0_0_8px_rgba(14,165,233,0.8)]" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden rounded-[2px] bg-accent px-5 py-2.5 text-[0.72rem] font-semibold tracking-[0.14em] text-navy uppercase transition-all duration-300 hover:bg-navy hover:text-onnavy shadow-[0_2px_10px_rgba(14,165,233,0.3)] md:inline-flex"
            >
              Request Quote
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={`flex h-10 w-10 items-center justify-center border lg:hidden transition-colors ${
                scrolled || open
                  ? "border-line text-foreground hover:border-accent"
                  : "border-onnavy/30 text-onnavy hover:border-accent"
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

      {/* Mobile Drawer */}
      <div
        className={`overflow-hidden border-t border-line bg-surface transition-[max-height,opacity] duration-400 lg:hidden ${
          open ? "max-h-[600px] opacity-100 shadow-xl" : "max-h-0 opacity-0"
        }`}
      >
        <Container className="py-6">
          <ul className="divide-y divide-line">
            {NAV_LINKS.map((l, i) => {
              const active = pathname === l.to;
              return (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    className={`flex items-center justify-between py-3.5 text-sm font-medium transition-colors ${
                      active ? "text-accent font-semibold" : "text-foreground hover:text-accent"
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="tech-label text-muted">{String(i + 1).padStart(2, "0")}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-4 border-t border-line space-y-3">
            <Link
              href="/contact"
              className="block w-full bg-accent py-3.5 text-center text-xs font-semibold tracking-[0.14em] text-navy uppercase"
            >
              Start an Enquiry
            </Link>
            <p className="text-center font-mono text-[0.7rem] text-muted">
              Direct Phone: +91 9823463655 / 8788848977
            </p>
          </div>
        </Container>
      </div>
    </header>
  );
}
