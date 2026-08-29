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
    <dl className="divide-y divide-line min-w-0">
      {specs.map((s, i) => (
        <div
          key={`${s.label}-${i}`}
          className="grid grid-cols-1 gap-1 py-3 text-xs sm:grid-cols-[11rem_1fr] sm:gap-4 sm:text-sm min-w-0"
        >
          <dt className="tech-label text-muted break-words">{s.label}</dt>
          <dd className="font-medium text-foreground break-words">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

import { useRouter } from "next/navigation";
import { Maximize2, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";

export interface ProjectCardProps {
  project: Project;
  index?: number;
  onImageClick?: (e: React.MouseEvent) => void;
}

export function ProjectCard({ project, index = 0, onImageClick }: ProjectCardProps) {
  const router = useRouter();
  const projectId = project.id || (project as any)._id;

  return (
    <div
      onClick={() => router.push(`/projects/${projectId}`)}
      className="group flex h-full flex-col overflow-hidden bg-surface rounded-3xl min-w-0 border border-line transition-all duration-300 hover:shadow-2xl hover:border-accent/40 hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-navy">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="blueprint-grid-dark flex h-full w-full flex-col items-center justify-center p-4 text-center font-sans text-xs text-onnavy-muted bg-navy-deep">
            <span className="text-accent font-bold text-xs tracking-wider uppercase">{project.category || "Precision SPM"}</span>
            <span className="mt-1 text-[0.68rem] text-onnavy-muted">Shop-Floor Engineering Build</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant="navy">{project.category || "Custom Build"}</Badge>
          {project.featured ? (
            <Badge variant="accent" className="flex items-center gap-1 shadow-md">
              <Sparkles className="h-3 w-3" />
              <span>Featured</span>
            </Badge>
          ) : null}
        </div>

        {/* Lightbox Quick-Inspect Action */}
        {onImageClick ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onImageClick(e);
            }}
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-navy/80 px-2.5 py-1 text-[0.68rem] font-semibold text-accent backdrop-blur-md border border-accent/30 shadow-lg hover:bg-accent hover:text-navy transition-all cursor-pointer z-10"
            title="Inspect Machine Photos"
          >
            <Maximize2 className="h-3 w-3" />
            <span>Inspect</span>
          </button>
        ) : (
          <div className="absolute top-3 right-3 rounded-full bg-navy/90 px-3 py-1 font-sans text-[0.68rem] font-bold text-accent backdrop-blur-md border border-accent/20">
            {`REF P-${String(index + 1).padStart(2, "0")}`}
          </div>
        )}

        {/* Bottom Overlay Info on Photo */}
        <div className="absolute bottom-3 left-3 right-3 text-onnavy">
          <span className="font-sans text-[0.68rem] font-bold text-accent uppercase tracking-wider block">
            {project.industry || "Custom SPM"}
          </span>
          <h3 className="font-display text-base font-bold text-onnavy line-clamp-1 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 min-w-0">
        <div className="min-w-0">
          <p className="text-xs leading-relaxed text-muted line-clamp-2 break-words">
            {project.summary || project.overview || project.short}
          </p>

          {/* Capability Chips */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-lg bg-background border border-line px-2 py-0.5 text-[0.68rem] text-foreground font-medium">
              <CheckCircle2 className="h-2.5 w-2.5 text-accent" />
              <span>100% FAT Tested</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-background border border-line px-2 py-0.5 text-[0.68rem] text-foreground font-medium">
              <CheckCircle2 className="h-2.5 w-2.5 text-accent" />
              <span>Pune Built</span>
            </span>
            {project.category && (
              <span className="rounded-lg bg-background border border-line px-2 py-0.5 text-[0.68rem] text-muted">
                {project.category}
              </span>
            )}
          </div>
        </div>

        {/* Dual Actions Footer */}
        <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-accent transition-colors">
            <span>Full Specs</span>
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/quote?project=${encodeURIComponent(project.title)}#quote-form`);
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-accent/10 border border-accent/30 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-navy transition-all shadow-xs cursor-pointer"
          >
            <span>Quote this Build</span>
          </button>
        </div>
      </div>
    </div>
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
              <span className="h-2.5 w-2.5 rounded-full bg-accent animate-ping" />
              <TechLabel tone="accent">Ready to Build</TechLabel>
            </div>
            <h2 className="mt-4 font-display text-3xl leading-tight font-bold text-onnavy sm:text-4xl lg:text-[2.75rem]">
              {home.ctaHeading || "Have a machine project in mind? Let's build it together."}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-onnavy-muted">
              Talk directly with our Pune workshop team. Whether you need a new custom machine or drawings built, we provide fast, honest pricing.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-xs font-sans text-onnavy-muted">
              <span className="flex items-center gap-1.5"><span className="text-accent">📍</span> Workshop: Dehu Gaon, Pune</span>
              <span className="flex items-center gap-1.5"><span className="text-accent">📞</span> Phone: {company.phone}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end">
            <Btn to="/quote" variant="primary" className="w-full sm:w-auto text-center font-bold">
              {home.ctaButton || "Get a Free Quote"}
            </Btn>
            <Btn to="/projects" variant="light" className="w-full sm:w-auto text-center">
              See Our Work
            </Btn>
          </div>
        </div>
      </Container>
    </section>
  );
}
