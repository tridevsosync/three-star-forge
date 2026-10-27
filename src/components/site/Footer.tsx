"use client";

import Link from "next/link";
import { useSite } from "@/store/site-store";
import { Container, TechLabel, Badge } from "./ui";

const serviceLinks = [
  { label: "Design Engineering", to: "/services" },
  { label: "Turnkey Manufacturing", to: "/services" },
  { label: "Product Management", to: "/services" },
  { label: "New Product Introduction", to: "/services" },
  { label: "Procurement Support", to: "/services" },
];

const industryLinks = [
  { label: "Material Handling", to: "/industries" },
  { label: "Industrial Automation", to: "/industries" },
  { label: "Pharmaceutical", to: "/industries" },
  { label: "Food Industry", to: "/industries" },
  { label: "Process Industry", to: "/industries" },
];

export function Footer() {
  const { company } = useSite();
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-navy text-onnavy">
      <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-60" />

      {/* Quality Standards Strip */}
      <div className="border-b border-onnavy/10 bg-navy-soft/60">
        <Container className="py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-onnavy-muted">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>FACILITY LOCATION: DEHU GAON, PUNE, MAHARASHTRA</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="navy">ISO 9001 CERTIFIED</Badge>
              <Badge variant="navy">WORKSHOP TESTED</Badge>
              <Badge variant="accent">FAST DELIVERY</Badge>
            </div>
          </div>
        </Container>
      </div>

      <Container className="relative">
        <div className="grid gap-8 py-10 sm:gap-12 sm:py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3.5">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-accent bg-navy">
                <span className="text-xs font-bold text-accent">3S</span>
              </span>
              <span>
                <span className="block font-display text-base font-bold tracking-wide">
                  THREE STAR
                </span>
                <TechLabel tone="accent">ENTERPRISES</TechLabel>
              </span>
            </div>
            <p className="mt-4 sm:mt-6 max-w-sm text-xs sm:text-sm leading-relaxed text-onnavy-muted">
              {company.positioning}
            </p>
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
              <Badge variant="navy">Custom Machines</Badge>
              <Badge variant="navy">Induction Heating</Badge>
              <Badge variant="navy">Conveyor Systems</Badge>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="lg:col-span-2">
            <TechLabel tone="light">Navigation</TechLabel>
            <ul className="mt-4 sm:mt-5 space-y-2 text-xs sm:text-sm text-onnavy-muted">
              {[
                { label: "Company Profile", to: "/about" },
                { label: "Service Lines", to: "/services" },
                { label: "Capabilities", to: "/capabilities" },
                { label: "Delivered Projects", to: "/projects" },
                { label: "Visual Gallery", to: "/gallery" },
                { label: "Get In Touch", to: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.to} className="transition-colors duration-200 hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services & Industries */}
          <nav className="lg:col-span-3">
            <TechLabel tone="light">Services & Sectors</TechLabel>
            <ul className="mt-4 sm:mt-5 space-y-2 text-xs sm:text-sm text-onnavy-muted">
              {serviceLinks.slice(0, 3).map((l) => (
                <li key={l.label}>
                  <Link href={l.to} className="transition-colors duration-200 hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
              {industryLinks.slice(0, 3).map((l) => (
                <li key={l.label}>
                  <Link href={l.to} className="transition-colors duration-200 hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Direct Contact */}
          <div className="lg:col-span-3">
            <TechLabel tone="light">Pune Works</TechLabel>
            <address className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm leading-relaxed text-onnavy-muted not-italic">
              <p className="font-semibold text-onnavy">{company.contactPerson}</p>
              <p className="text-xs leading-relaxed">{company.address}</p>
              <div className="pt-2 text-xs space-y-1.5">
                <p>
                  <span className="text-onnavy-muted/70">Phone: </span>
                  <a href={`tel:${(company.phone.split("/")[0] ?? "").replace(/\s/g, "")}`} className="text-accent hover:underline font-mono">
                    {company.phone}
                  </a>
                </p>
                <p>
                  <span className="text-onnavy-muted/70">Email: </span>
                  <a href={`mailto:${company.email}`} className="text-accent hover:underline break-all font-mono">
                    {company.email}
                  </a>
                </p>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-5 border-t border-onnavy/12 py-7 text-xs text-onnavy-muted md:flex-row md:items-center md:justify-between">
          <p className="order-1 md:order-1">
            © {year} {company.name}. All rights reserved. Precision OEM Partner.
          </p>

          {/* Non-removable Hardcoded Developer Attribution */}
          <div className="order-2 flex flex-wrap items-center gap-2">
            <span className="text-onnavy-muted/80">Designed &amp; developed by</span>
            <a
              href="https://www.sosyncaitech.in/"
              target="_blank"
              rel="noopener noreferrer"
              title="SOSync AI Tech - https://www.sosyncaitech.in/"
              className="group inline-flex items-center gap-2 rounded-md border border-onnavy/15 bg-navy-soft/80 px-2.5 py-1 transition-all duration-200 hover:border-accent/50 hover:bg-navy-soft"
            >
              <span className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-white p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-110">
                <img
                  src="/images/sosync-logo.jpg"
                  alt="SOSync AI Tech Logo"
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="font-semibold text-white transition-colors duration-200 group-hover:text-accent">
                SOSync AI Tech
              </span>
              <svg
                className="h-3 w-3 text-onnavy-muted opacity-60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="order-3 flex flex-wrap items-center gap-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-accent hover:underline transition-all"
            >
              <span>Back to Top</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
