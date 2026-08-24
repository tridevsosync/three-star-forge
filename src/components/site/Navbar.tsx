import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/data/site";
import { Container } from "./ui";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-line bg-surface/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container>
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          <Link to="/" className="group flex items-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center border border-accent">
              <span className="absolute inset-1 border border-accent/40" />
              <span className="font-mono text-[0.7rem] font-bold text-accent">3S</span>
            </span>
            <span className="leading-none">
              <span
                className={`block font-display text-[0.95rem] font-bold tracking-[0.14em] ${
                  scrolled || open ? "text-foreground" : "text-onnavy"
                } lg:text-base`}
              >
                THREE STAR
              </span>
              <span className="tech-label mt-1 block text-accent">ENTERPRISES</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 xl:flex">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative text-[0.82rem] font-medium tracking-wide transition-colors duration-300 ${
                    scrolled ? "text-steel hover:text-accent" : "text-onnavy/85 hover:text-accent"
                  } ${active ? "text-accent!" : ""}`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden rounded-[2px] bg-accent px-5 py-3 text-[0.72rem] font-semibold tracking-[0.14em] text-navy uppercase transition-colors duration-300 hover:bg-navy hover:text-onnavy lg:inline-flex"
            >
              Start a Project
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={`flex h-11 w-11 items-center justify-center border xl:hidden ${
                scrolled || open ? "border-line text-foreground" : "border-onnavy/30 text-onnavy"
              }`}
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute top-1.5 left-0 block h-px w-full bg-current transition-all duration-300 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </Container>

      <div
        className={`overflow-hidden border-t border-line bg-surface transition-[max-height,opacity] duration-500 xl:hidden ${
          open ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Container className="py-4">
          <ul className="divide-y divide-line">
            {NAV_LINKS.map((l, i) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="flex items-center justify-between py-4 text-sm font-medium text-foreground transition-colors hover:text-accent"
                  style={{ transitionDelay: `${i * 20}ms` }}
                >
                  <span>{l.label}</span>
                  <span className="tech-label text-muted">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="mt-5 mb-2 block bg-accent py-4 text-center text-[0.75rem] font-semibold tracking-[0.14em] text-navy uppercase"
          >
            Start a Project
          </Link>
        </Container>
      </div>
    </header>
  );
}
