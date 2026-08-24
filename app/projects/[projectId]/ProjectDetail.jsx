"use client";

import Link from "next/link";
import { useSite } from "@/store/site-store";
import { Btn, Container, Reveal, TechLabel, Badge } from "@/components/site/ui";
import { CtaBand, Section, SpecTable } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

export function ProjectDetail({ projectId }) {
  const { projects } = useSite();
  const project = projects.find((p) => p.id === projectId);

  if (!project) return <ProjectNotFound />;

  const related = projects
    .filter(
      (p) =>
        p.id !== project.id && (p.category === project.category || p.industry === project.industry),
    )
    .slice(0, 3);

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-navy pt-32 pb-16 text-onnavy sm:pt-40 sm:pb-24">
        <img
          src={project.image}
          alt={`${project.title} manufactured by Three Star Enterprises`}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/70" />
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-60" />
        
        <Container className="relative">
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-onnavy-muted">
              <Link href="/projects" className="transition-colors hover:text-accent">
                PORTFOLIO
              </Link>
              <span className="text-accent">/</span>
              <span>{project.industry.toUpperCase()}</span>
              <span className="text-accent">/</span>
              <span className="text-onnavy">{project.category.toUpperCase()}</span>
            </nav>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="accent">{project.category}</Badge>
              <Badge variant="navy">{project.industry}</Badge>
              {project.featured && <Badge variant="success">Featured Build</Badge>}
            </div>

            <h1 className="mt-4 max-w-4xl text-3xl leading-[1.08] font-bold sm:text-5xl lg:text-[3.5rem]">
              {project.title}
            </h1>

            <div className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-onnavy/15 pt-6">
              <Meta label="Sector" value={project.industry} />
              <Meta label="Category" value={project.category} />
              <Meta label="Project Code" value={`REF-P-${project.id.slice(0, 8).toUpperCase()}`} />
              <Meta label="FAT & QA Status" value="Shop-Floor Verified" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* OVERVIEW & SPECS */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Main Info */}
          <InView className="lg:col-span-7 space-y-12">
            <div>
              <TechLabel tone="accent">Executive Summary</TechLabel>
              <p className="mt-4 text-lg leading-relaxed text-foreground font-medium sm:text-xl">
                {project.overview}
              </p>
            </div>

            {/* Architecture: Challenge vs Solution */}
            <div className="grid gap-8 sm:grid-cols-2 bg-surface p-8 border border-line shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-danger" />
                  <h2 className="font-display text-lg font-bold text-foreground">Engineering Challenge</h2>
                </div>
                <div className="mt-3 h-0.5 w-10 bg-line-strong" />
                <p className="mt-4 text-xs leading-relaxed text-muted">{project.challenge}</p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <h2 className="font-display text-lg font-bold text-foreground">Engineered Solution</h2>
                </div>
                <div className="mt-3 h-0.5 w-10 bg-accent" />
                <p className="mt-4 text-xs leading-relaxed text-muted">{project.solution}</p>
              </div>
            </div>

            {/* Application */}
            <div className="border-l-2 border-accent pl-6 py-2">
              <TechLabel tone="dark">Production Application</TechLabel>
              <p className="mt-2 text-sm leading-relaxed text-muted">{project.application}</p>
            </div>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div>
                <TechLabel tone="accent">Technical Capabilities & Scope</TechLabel>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-sm text-foreground items-start">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent rounded-full" />
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </InView>

          {/* Right Column: Spec Sheet */}
          <InView delay={120} className="lg:col-span-5 space-y-8">
            <div className="border border-line bg-surface shadow-md">
              <div className="border-b border-line bg-surface-soft px-7 py-5 flex items-center justify-between">
                <TechLabel tone="dark">Technical Datasheet</TechLabel>
                <Badge variant="accent">VERIFIED</Badge>
              </div>
              <div className="px-7 py-5">
                <SpecTable specs={project.specs} />
              </div>
            </div>

            {/* CTA Box */}
            <div className="corner-marks border border-line bg-navy p-8 text-onnavy shadow-xl">
              <TechLabel tone="accent">Bespoke Manufacturing</TechLabel>
              <h3 className="mt-3 font-display text-xl font-bold text-onnavy">Need Similar Equipment?</h3>
              <p className="mt-2 text-xs leading-relaxed text-onnavy-muted">
                Our Pune facility can adapt coil geometry, stroke lengths, and automation to your part drawings.
              </p>
              <div className="mt-6">
                <Btn to="/contact" variant="primary" className="w-full text-center">
                  Enquire About This Build
                </Btn>
              </div>
            </div>
          </InView>
        </div>
      </Section>

      {/* RELATED PROGRAMMES */}
      {related.length > 0 ? (
        <Section dark tight grid>
          <InView>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <TechLabel tone="light">Cross-Sector Solutions</TechLabel>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-onnavy sm:text-3xl">
              Related programmes in {project.industry}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {related.map((r, i) => (
                <Link
                  key={r.id}
                  href={`/projects/${r.id}`}
                  className="group bg-navy-soft border border-onnavy/15 p-6 flex flex-col justify-between transition-all duration-300 hover:border-accent hover:bg-navy"
                >
                  <div>
                    <span className="tech-label text-accent">{r.category}</span>
                    <h3 className="mt-3 font-display text-base font-bold text-onnavy group-hover:text-accent transition-colors">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-xs text-onnavy-muted line-clamp-2">{r.short}</p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-onnavy/10 text-xs text-accent flex items-center justify-between">
                    <span>View Specifications</span>
                    <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </InView>
        </Section>
      ) : null}

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <span className="tech-label text-onnavy-muted">{label}</span>
      <p className="mt-1.5 text-sm font-semibold text-onnavy">{value}</p>
    </div>
  );
}

function ProjectNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-6 pt-32">
      <div className="max-w-lg text-center">
        <TechLabel tone="accent">404 Reference</TechLabel>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
          Project record not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This project reference is no longer listed in active directory. Browse the full portfolio instead.
        </p>
        <div className="mt-8 flex justify-center">
          <Btn to="/projects">Return to Portfolio</Btn>
        </div>
      </div>
    </div>
  );
}
