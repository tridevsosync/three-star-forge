"use client";

import Link from "next/link";
import React, { ReactNode } from "react";
import { Container, TechLabel, Btn, Badge } from "./ui";
import { useSite } from "@/store/site-store";
import { Project } from "@/types";

export interface SectionProps {
  children: ReactNode;
  dark?: boolean;
  grid?: boolean;
  tight?: boolean;
  className?: string;
  id?: string;
}

export function Section({
  children,
  dark = false,
  grid = false,
  tight = false,
  className = "",
  id,
}: SectionProps) {
  const bg = dark ? "bg-navy text-onnavy" : "bg-background text-foreground";
  const gridCls = grid ? (dark ? "blueprint-grid-dark" : "blueprint-grid") : "";
  const pad = tight ? "py-16 sm:py-20" : "py-20 sm:py-28 lg:py-32";
  return (
    <section id={id} className={`relative overflow-hidden ${bg} ${gridCls} ${pad} ${className}`}>
      <Container className="relative">{children}</Container>
    </section>
  );
}

export interface PageHeroProps {
  index?: string | number;
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string;
  action?: ReactNode;
}

export function PageHero({ index, eyebrow, title, intro, image, action }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy pt-32 pb-20 text-onnavy sm:pt-40 sm:pb-28 lg:pb-32">
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/60" />
      <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            {index ? <Badge variant="accent">{index}</Badge> : null}
            <span className="h-px w-8 bg-accent" />
            {eyebrow && <TechLabel tone="light">{eyebrow}</TechLabel>}
          </div>
          <h1 className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
          {intro ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-onnavy-muted sm:text-lg">
              {intro}
            </p>
          ) : null}
          {action ? <div className="mt-8 flex flex-wrap gap-4">{action}</div> : null}
        </div>
      </Container>
    </section>
  );
}

export interface SpecTableProps {
  specs?: Array<{ label: string; value: string }>;
}

export function SpecTable({ specs }: SpecTableProps) {
  if (!specs || specs.length === 0) return null;
  return (
    <dl className="divide-y divide-line">
      {specs.map((s, i) => (
        <div
          key={`${s.label}-${i}`}
          className="grid grid-cols-1 gap-1 py-3 text-xs sm:grid-cols-[11rem_1fr] sm:gap-4 sm:text-sm"
        >
          <dt className="tech-label text-muted">{s.label}</dt>
          <dd className="font-medium text-foreground">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id || (project as any)._id}`}
      className="group card-soft corner-marks flex h-full flex-col overflow-hidden bg-surface"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant="navy">{project.category}</Badge>
          {project.featured ? <Badge variant="accent">Featured</Badge> : null}
        </div>
        <div className="tech-label absolute bottom-3 right-3 bg-navy/90 px-2.5 py-1 text-[0.65rem] text-onnavy backdrop-blur-sm">
          {`REF P-${String(index + 1).padStart(2, "0")}`}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          <span className="tech-label text-accent">{project.industry}</span>
          <h3 className="mt-2 font-display text-xl leading-snug font-bold text-foreground transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-2">
            {project.summary || project.overview}
          </p>
        </div>

        <div className="mt-6 border-t border-line pt-4 flex items-center justify-between text-xs font-mono text-muted group-hover:text-accent">
          <span>Explore Specification →</span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}

export function CtaBand() {
  const { home, company } = useSite();
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-onnavy sm:py-28">
      <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-60" />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
              <TechLabel tone="accent">Ready for Production</TechLabel>
            </div>
            <h2 className="mt-4 font-display text-3xl leading-tight font-bold text-onnavy sm:text-4xl lg:text-[2.75rem]">
              {home.ctaHeading || "Discuss your equipment programme with our Pune engineering team."}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-onnavy-muted">
              Bring us in for concept review, build-to-print manufacturing, or single-point turnkey machinery programmes.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-xs font-mono text-onnavy-muted">
              <span>📍 Workshop: Dehu Gaon, Pune</span>
              <span>📞 Phone: {company.phone}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end">
            <Btn to="/quote" variant="primary" className="w-full sm:w-auto text-center font-bold">
              Request a Quote (RFQ)
            </Btn>
            <Btn to="/projects" variant="light" className="w-full sm:w-auto text-center">
              View Portfolio
            </Btn>
          </div>
        </div>
      </Container>
    </section>
  );
}
