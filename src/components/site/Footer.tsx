import { Link } from "@tanstack/react-router";
import { useSite } from "@/store/site-store";
import { Container, TechLabel } from "./ui";

const serviceLinks = [
  { label: "Design Engineering", to: "/services" },
  { label: "Turnkey Manufacturing", to: "/services" },
  { label: "Product Management", to: "/services" },
  { label: "New Product Introduction", to: "/services" },
  { label: "Procurement Support", to: "/services" },
] as const;

const industryLinks = [
  { label: "Material Handling", to: "/industries" },
  { label: "Industrial Automation", to: "/industries" },
  { label: "Pharmaceutical", to: "/industries" },
  { label: "Food Industry", to: "/industries" },
  { label: "Process Industry", to: "/industries" },
] as const;

export function Footer() {
  const { company } = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy text-onnavy">
      <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center border border-accent">
                <span className="absolute inset-1 border border-accent/40" />
                <span className="font-mono text-xs font-bold text-accent">3S</span>
              </span>
              <span>
                <span className="block font-display text-base font-bold tracking-[0.14em]">
                  THREE STAR
                </span>
                <TechLabel tone="accent">ENTERPRISES</TechLabel>
              </span>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-onnavy-muted">
              {company.positioning}
            </p>
            <div className="mt-7 flex gap-2">
              {["in", "X", "f"].map((s) => (
                <span
                  key={s}
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center border border-onnavy/20 font-mono text-[0.7rem] text-onnavy-muted transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <nav className="lg:col-span-2">
            <TechLabel tone="light">Company</TechLabel>
            <ul className="mt-5 space-y-3 text-sm text-onnavy-muted">
              {(
                [
                  { label: "About", to: "/about" },
                  { label: "Services", to: "/services" },
                  { label: "Capabilities", to: "/capabilities" },
                  { label: "Projects", to: "/projects" },
                  { label: "Gallery", to: "/gallery" },
                  { label: "Contact", to: "/contact" },
                ] as const
              ).map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="transition-colors duration-300 hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-3">
            <TechLabel tone="light">Services</TechLabel>
            <ul className="mt-5 space-y-3 text-sm text-onnavy-muted">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="transition-colors duration-300 hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <TechLabel tone="light">
              <span className="mt-8 block">Industries</span>
            </TechLabel>
            <ul className="mt-5 space-y-3 text-sm text-onnavy-muted">
              {industryLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="transition-colors duration-300 hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <TechLabel tone="light">Contact</TechLabel>
            <address className="mt-5 space-y-4 text-sm leading-relaxed text-onnavy-muted not-italic">
              <p className="font-medium text-onnavy">{company.contactPerson}</p>
              <p>{company.address}</p>
              <p>
                <a
                  href={`tel:${(company.phone.split("/")[0] ?? "").replace(/\s/g, "")}`}
                  className="hover:text-accent"
                >
                  {company.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${company.email}`} className="hover:text-accent">
                  {company.email}
                </a>
              </p>
              <p>
                <a
                  href={`https://${company.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent"
                >
                  {company.website}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-onnavy/12 py-7 text-xs text-onnavy-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="transition-colors hover:text-accent">Privacy</span>
            <span className="transition-colors hover:text-accent">Terms</span>
            <Link
              to="/admin/login"
              className="tech-label text-onnavy-muted/70 transition-colors duration-300 hover:text-accent"
            >
              Admin Login →
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
