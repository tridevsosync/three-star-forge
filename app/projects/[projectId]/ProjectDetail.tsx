"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useSite } from "@/store/site-store";
import { Btn, Container, Reveal, TechLabel, Badge, Lightbox } from "@/components/site/ui";
import { CtaBand, Section, SpecTable } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import {
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  Factory,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Cpu,
  Layers,
  Wrench,
  FileText,
} from "lucide-react";

export function ProjectDetail({ projectId }: { projectId?: string }) {
  const { projects, openRfqModal } = useSite();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const project = projects.find((p) => p.id === projectId || (p as any)._id === projectId);

  if (!project) return <ProjectNotFound />;

  const related = projects
    .filter(
      (p) =>
        p.id !== project.id && (p.category === project.category || p.industry === project.industry),
    )
    .slice(0, 3);

  // Extract key dynamic specifications for top showcase and datasheet
  const normalizedSpecs: Array<{ label: string; value: string }> = (
    Array.isArray(project.specs)
      ? project.specs
      : Array.isArray(project.parameters)
        ? project.parameters
        : []
  ).map((s: any) => ({
    label: String(s.label || s.key || "Parameter"),
    value: String(s.value || "Custom"),
  }));

  const topSpecs = normalizedSpecs.slice(0, 3);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. PREMIUM INDUSTRIAL SPLIT HERO BANNER */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-navy pt-28 pb-16 text-onnavy sm:pt-36 sm:pb-20">
        {/* Subtle Ambient Blueprint Grid */}
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-70" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <Container className="relative">
          {/* Breadcrumbs Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-sans font-semibold text-onnavy-muted mb-6"
          >
            <Link href="/projects" className="transition-colors hover:text-accent flex items-center gap-1">
              <span>PORTFOLIO</span>
            </Link>
            <span className="text-accent/60">/</span>
            <Link
              href="/projects"
              className="transition-colors hover:text-accent uppercase"
            >
              {project.industry || "MANUFACTURING"}
            </Link>
            <span className="text-accent/60">/</span>
            <span className="text-onnavy uppercase font-bold">{project.category || "MACHINES"}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left Column: Project Overview & Meta Matrix */}
            <div className="lg:col-span-7">
              <Reveal>
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="accent" className="font-bold">
                    {project.category || "Custom Machine"}
                  </Badge>
                  {project.industry && (
                    <Badge variant="navy" className="border-onnavy/20">
                      {project.industry}
                    </Badge>
                  )}
                  {project.featured && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Featured Engineering Build</span>
                    </Badge>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/30 px-3 py-1 text-[0.68rem] font-bold text-accent">
                    <ShieldCheck className="h-3 w-3" />
                    <span>100% FAT Tested</span>
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="mt-5 font-display text-3xl leading-[1.08] font-extrabold tracking-tight sm:text-4xl lg:text-[3.25rem] text-onnavy">
                  {project.title}
                </h1>

                {/* Subtitle / Short Overview */}
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-onnavy-muted sm:text-lg">
                  {project.short || project.overview || project.summary}
                </p>

                {/* Action CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Btn
                    to={`/quote?project=${encodeURIComponent(project.title)}#quote-form`}
                    variant="primary"
                    className="text-sm px-7 py-3.5 font-bold shadow-lg shadow-accent/25"
                  >
                    Request Quote for This Build
                  </Btn>
                  {project.image && (
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-onnavy/20 bg-navy-soft/80 px-5 py-3.5 text-sm font-semibold text-onnavy hover:border-accent hover:text-accent transition-all cursor-pointer backdrop-blur-sm"
                    >
                      <Maximize2 className="h-4 w-4" />
                      <span>Inspect Machine Photos</span>
                    </button>
                  )}
                </div>

                {/* Meta Telemetry Matrix */}
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-onnavy/15 pt-6">
                  <Meta label="Sector" value={project.industry || "Manufacturing"} />
                  <Meta label="Category" value={project.category || "SPM Build"} />
                  <Meta
                    label="Project Code"
                    value={`REF-P-${(project.id || (project as any)._id || "BUILD").slice(0, 8).toUpperCase()}`}
                  />
                  <Meta label="FAT & QA Status" value="Shop-Floor Verified" highlight />
                </div>
              </Reveal>
            </div>

            {/* Right Column: Premium Machinery Showcase Card */}
            <div className="lg:col-span-5">
              <Reveal className="delay-100">
                <div className="relative rounded-3xl border border-onnavy/20 bg-navy-deep/90 p-5 backdrop-blur-md shadow-2xl overflow-hidden transition-all hover:border-accent/60 group">
                  {/* Card Header Bar */}
                  <div className="flex items-center justify-between border-b border-onnavy/15 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <span className="font-sans text-xs font-bold text-accent uppercase tracking-wider">
                        Engineering Build
                      </span>
                    </div>
                    <span className="font-sans text-[0.7rem] text-onnavy-muted font-mono">
                      {`REF-P-${(project.id || (project as any)._id || "").slice(0, 6).toUpperCase()}`}
                    </span>
                  </div>

                  {/* Main High-Resolution Machine Photo */}
                  <div
                    className="relative mt-4 aspect-[16/11] overflow-hidden rounded-2xl bg-navy cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} engineered by Three Star Enterprises`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                    ) : (
                      <div className="blueprint-grid-dark flex h-full w-full flex-col items-center justify-center p-6 text-center font-sans text-xs text-onnavy-muted bg-navy-deep">
                        <Factory className="h-10 w-10 text-accent/50 mb-2" />
                        <span className="text-accent font-bold text-sm">Three Star Engineering</span>
                        <span className="mt-1 text-[0.7rem]">Shop-Floor Verified Build</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                    {/* Corner Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge variant="accent">{project.category || "Precision SPM"}</Badge>
                    </div>

                    {/* Hover Inspect Trigger */}
                    <div className="absolute bottom-3 right-3 rounded-xl bg-navy/90 border border-accent/40 px-3 py-1.5 text-xs font-semibold text-accent backdrop-blur-md flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:bg-accent group-hover:text-navy transition-all shadow-lg">
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Inspect High-Res</span>
                    </div>
                  </div>

                  {/* Quick Facts Grid */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl border border-onnavy/15 bg-navy/60 p-2.5">
                      <span className="text-[0.65rem] text-onnavy-muted uppercase block">Verification</span>
                      <strong className="font-display text-xs font-bold text-accent block">100% FAT</strong>
                    </div>
                    <div className="rounded-xl border border-onnavy/15 bg-navy/60 p-2.5">
                      <span className="text-[0.65rem] text-onnavy-muted uppercase block">Build Site</span>
                      <strong className="font-display text-xs font-bold text-onnavy block">Pune Works</strong>
                    </div>
                    <div className="rounded-xl border border-onnavy/15 bg-navy/60 p-2.5">
                      <span className="text-[0.65rem] text-onnavy-muted uppercase block">Status</span>
                      <strong className="font-display text-xs font-bold text-success block">Active Deploy</strong>
                    </div>
                  </div>

                  {/* Key Dynamic Specifications Chips (if available) */}
                  {topSpecs.length > 0 && (
                    <div className="mt-3.5 pt-3.5 border-t border-onnavy/15">
                      <span className="text-[0.68rem] text-onnavy-muted font-bold uppercase tracking-wider block mb-2">
                        Key Parameters
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {topSpecs.map((sp, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-onnavy/10 bg-navy/40 p-2 text-xs"
                          >
                            <span className="text-[0.65rem] text-onnavy-muted truncate block">
                              {sp.label || "Parameter"}
                            </span>
                            <span className="font-bold text-onnavy font-sans truncate block">
                              {sp.value || "Custom"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE SUMMARY & ENGINEERING ARCHITECTURE */}
      {/* ========================================================================= */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Main Info Column */}
          <InView className="lg:col-span-7 space-y-10 min-w-0">
            {/* Executive Summary */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-accent" />
                <TechLabel tone="accent">Executive Summary</TechLabel>
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                Engineering Architecture & Operational Role
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/90 font-medium sm:text-lg break-words">
                {project.overview || project.summary || project.short}
              </p>
            </div>

            {/* Architecture: Challenge vs Engineered Solution */}
            {(project.challenge || project.solution) && (
              <div className="grid gap-6 sm:grid-cols-2 bg-surface p-6 sm:p-8 rounded-3xl border border-line shadow-sm min-w-0">
                {project.challenge && (
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-danger shrink-0" />
                      <h3 className="font-display text-base font-bold text-foreground">
                        Engineering Challenge
                      </h3>
                    </div>
                    <div className="mt-3 h-0.5 w-10 bg-line-strong" />
                    <p className="mt-4 text-xs leading-relaxed text-muted break-words">
                      {project.challenge}
                    </p>
                  </div>
                )}

                {project.solution && (
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-success shrink-0" />
                      <h3 className="font-display text-base font-bold text-foreground">
                        Engineered Solution
                      </h3>
                    </div>
                    <div className="mt-3 h-0.5 w-10 bg-accent" />
                    <p className="mt-4 text-xs leading-relaxed text-muted break-words">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Production Application */}
            {project.application && (
              <div className="rounded-2xl border-l-4 border-accent bg-surface p-6 border border-line shadow-xs min-w-0">
                <div className="flex items-center gap-2">
                  <Factory className="h-4 w-4 text-accent" />
                  <TechLabel tone="dark">Production Application & Sector Deployment</TechLabel>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted break-words">
                  {project.application}
                </p>
              </div>
            )}

            {/* Scope & Highlights List */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="min-w-0 bg-surface-soft p-6 sm:p-8 rounded-3xl border border-line">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-accent" />
                  <TechLabel tone="accent">Technical Capabilities & Scope</TechLabel>
                </div>
                <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                  Key Design Features & Verification Highlights
                </h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 min-w-0">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-sm text-foreground items-start min-w-0">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      <span className="leading-relaxed break-words min-w-0">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </InView>

          {/* Right Column: Spec Sheet & Dedicated RFQ Trigger */}
          <InView delay={120} className="lg:col-span-5 space-y-8 min-w-0">
            {/* Technical Datasheet Table */}
            <div className="rounded-3xl border border-line bg-surface overflow-hidden shadow-md min-w-0">
              <div className="border-b border-line bg-surface-soft px-7 py-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" />
                  <TechLabel tone="dark">Technical Datasheet</TechLabel>
                </div>
                <Badge variant="accent">VERIFIED</Badge>
              </div>
              <div className="px-7 py-5">
                <SpecTable
                  specs={
                    normalizedSpecs.length > 0
                      ? normalizedSpecs
                      : [
                          { label: "Cycle Verification", value: "100% FAT in Pune" },
                          { label: "Manufacturing Standard", value: "ISO Quality Protocol" },
                          { label: "Automation Option", value: "PLC / SCADA Integration" },
                          { label: "Delivery Lead Time", value: "4-8 Weeks Typical" },
                        ]
                  }
                />
              </div>
            </div>

            {/* Bespoke RFQ Box */}
            <div className="rounded-3xl border border-onnavy/20 bg-navy p-8 text-onnavy shadow-2xl relative overflow-hidden">
              <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative z-10">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  <TechLabel tone="accent">Bespoke Engineering</TechLabel>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold text-onnavy">
                  Need a Machine Like This?
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-onnavy-muted font-sans">
                  Our Pune facility can adapt coil geometry, stroke lengths, fixtures, and PLC controls to your exact engineering component drawings.
                </p>
                <div className="mt-6">
                  <Btn
                    to={`/quote?project=${encodeURIComponent(project.title)}#quote-form`}
                    variant="primary"
                    className="w-full text-center font-bold shadow-md shadow-accent/25"
                  >
                    Request Technical Proposal
                  </Btn>
                </div>
              </div>
            </div>
          </InView>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 3. RELATED PROGRAMMES & MACHINERY */}
      {/* ========================================================================= */}
      {related.length > 0 ? (
        <Section dark tight grid>
          <InView>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <TechLabel tone="light">Cross-Sector Solutions</TechLabel>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-onnavy sm:text-3xl">
              Related Programmes in {project.industry || "Industrial Machinery"}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id || (r as any)._id}
                  href={`/projects/${r.id || (r as any)._id}`}
                  className="group rounded-2xl bg-navy-soft border border-onnavy/15 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-accent hover:bg-navy hover:shadow-xl"
                >
                  {r.image ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy-deep">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge variant="accent">{r.category}</Badge>
                      </div>
                    </div>
                  ) : null}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-base font-bold text-onnavy group-hover:text-accent transition-colors">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-xs text-onnavy-muted line-clamp-2">
                        {r.summary || r.overview || r.short}
                      </p>
                    </div>
                    <div className="mt-6 pt-3 border-t border-onnavy/10 text-xs font-bold text-accent flex items-center justify-between">
                      <span>View Specifications</span>
                      <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </InView>
        </Section>
      ) : null}

      {/* ========================================================================= */}
      {/* 4. CLOSING CTA BAND */}
      {/* ========================================================================= */}
      <Reveal>
        <CtaBand />
      </Reveal>

      {/* ========================================================================= */}
      {/* 5. FULL-SCREEN LIGHTBOX VIEWER */}
      {/* ========================================================================= */}
      {project.image && (
        <Lightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          image={project.image}
          title={project.title}
          category={project.category}
          description={project.overview || project.summary || project.short}
        />
      )}
    </>
  );
}

function Meta({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <span className="font-sans text-[0.68rem] text-onnavy-muted uppercase font-bold tracking-wider block">
        {label}
      </span>
      <p
        className={`mt-1.5 text-sm font-semibold truncate ${
          highlight ? "text-accent font-bold" : "text-onnavy"
        }`}
      >
        {value}
      </p>
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

