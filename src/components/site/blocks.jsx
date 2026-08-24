import { Link } from "@tanstack/react-router";
import { useSite } from "@/store/site-store";
import { IMAGES } from "@/data/images";
import { Btn, Container, Reveal, TechLabel } from "./ui";
export function PageHero({ index, eyebrow, title, intro, image }) {
  return (
    <section className="relative overflow-hidden bg-navy pt-32 pb-16 text-onnavy sm:pt-40 sm:pb-24">
      {image ? (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
        </>
      ) : null}
      <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="tech-label text-accent">{index}</span>
            <span className="h-px w-8 bg-accent" />
            <TechLabel tone="light">{eyebrow}</TechLabel>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-onnavy-muted sm:text-lg">
            {intro}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
export function Section({ children, dark = false, tight = false, grid = false, className = "" }) {
  return (
    <section
      className={`relative overflow-hidden ${dark ? "bg-navy text-onnavy" : "bg-background"} ${tight ? "py-16 sm:py-20" : "py-20 sm:py-28"} ${className}`}
    >
      {grid ? (
        <div
          className={`pointer-events-none absolute inset-0 ${dark ? "blueprint-grid-dark opacity-50" : "blueprint-grid opacity-40"}`}
        />
      ) : null}
      <Container className="relative">{children}</Container>
    </section>
  );
}
export function ProjectCard({ project, index }) {
  const LinkAny = Link;
  return (
    <LinkAny
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="group flex flex-col border border-line bg-surface transition-all duration-500 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-70" />
        <span className="tech-label absolute top-4 left-4 bg-navy/85 px-2.5 py-1 text-onnavy">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="tech-label absolute bottom-4 left-4 text-onnavy">{project.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <TechLabel>{project.industry}</TechLabel>
        <h3 className="mt-3 text-lg leading-snug font-semibold text-foreground transition-colors duration-300 group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.short}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.14em] text-steel uppercase transition-colors duration-300 group-hover:text-accent">
          View Project
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </LinkAny>
  );
}
export function CtaBand() {
  const { home } = useSite();
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-onnavy sm:py-28">
      <img
        src={IMAGES.cta}
        alt="Industrial workshop floor at Three Star Enterprises"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30" />
      <Container className="relative">
        <div className="max-w-3xl">
          <TechLabel tone="accent">Next Step</TechLabel>
          <h2 className="mt-5 text-3xl leading-[1.08] font-semibold sm:text-4xl lg:text-5xl">
            {home.ctaHeading}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-onnavy-muted">
            Share your drawings, concept or line requirement. Project details available on request —
            talk to our team about your requirement.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Btn to="/contact">{home.ctaButton}</Btn>
            <Btn to="/projects" variant="light">
              View Portfolio
            </Btn>
          </div>
        </div>
      </Container>
    </section>
  );
}
export function SpecTable({ specs, dark = false }) {
  return (
    <dl className={`divide-y ${dark ? "divide-onnavy/12" : "divide-line"}`}>
      {specs.map((s) => (
        <div key={s.label} className="flex items-baseline justify-between gap-6 py-3.5">
          <dt className={`tech-label ${dark ? "text-onnavy-muted" : "text-muted"}`}>{s.label}</dt>
          <dd
            className={`text-right font-mono text-sm font-medium ${dark ? "text-onnavy" : "text-foreground"}`}
          >
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
