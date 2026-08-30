"use client";

import Link from "next/link";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSite } from "@/store/site-store";
import { Btn, Container, Reveal, TechLabel, Badge, Lightbox } from "@/components/site/ui";
import { CtaBand, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import { IMAGES } from "@/data/images";
import {
  Cpu,
  Layers,
  Settings2,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  ChevronRight,
  Maximize2,
  Phone,
  Mail,
  MapPin,
  Gauge,
  Sparkles,
  Wrench,
  Activity,
  Check,
} from "lucide-react";

export function CapabilityDetail({ capabilityId }: { capabilityId?: string }) {
  const router = useRouter();
  const { capabilities = [], projects = [] } = useSite();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const cap = useMemo(() => {
    if (!capabilityId) return null;
    const decoded = decodeURIComponent(capabilityId).toLowerCase();
    return capabilities.find(
      (c) =>
        c.id?.toLowerCase() === decoded ||
        (c as any)._id?.toLowerCase() === decoded ||
        c.code?.toLowerCase() === decoded ||
        c.title?.toLowerCase() === decoded,
    );
  }, [capabilities, capabilityId]);

  // Related projects in this capability's category or keywords
  const relatedProjects = useMemo(() => {
    if (!cap) return [];
    const cat = cap.category?.toLowerCase() || "";
    const titleWords = cap.title.toLowerCase().split(" ").filter((w) => w.length > 3);

    return projects
      .filter((p) => {
        const pCat = (p.category || "").toLowerCase();
        const pTitle = (p.title || "").toLowerCase();
        const matchCategory = cat && (pCat.includes(cat) || cat.includes(pCat));
        const matchTitle = titleWords.some((w) => pTitle.includes(w) || pCat.includes(w));
        return matchCategory || matchTitle;
      })
      .slice(0, 3);
  }, [cap, projects]);

  if (!cap) return <CapabilityNotFound />;

  const coverImage = cap.image || IMAGES.pageCapabilities || IMAGES.verticalInduction;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. PREMIUM INDUSTRIAL SPLIT HERO BANNER */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-navy pt-28 pb-16 text-onnavy sm:pt-36 sm:pb-20">
        {/* Ambient Blueprint Matrix */}
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-70" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <Container className="relative">
          {/* Breadcrumbs Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-sans font-semibold text-onnavy-muted mb-6"
          >
            <Link href="/" className="transition-colors hover:text-accent">
              HOME
            </Link>
            <span className="text-accent/60">/</span>
            <Link href="/capabilities" className="transition-colors hover:text-accent">
              CAPABILITIES
            </Link>
            <span className="text-accent/60">/</span>
            <span className="text-accent uppercase font-bold">{cap.code}</span>
            <span className="text-accent/60">/</span>
            <span className="text-onnavy uppercase font-bold">{(cap.category || "Domain").toUpperCase()}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left Column: Domain Overview & Live Telemetry */}
            <div className="lg:col-span-7">
              <Reveal>
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-navy shadow-sm">
                    {cap.code}
                  </span>
                  <Badge variant="navy" className="border-onnavy/20">
                    {cap.category || "Manufacturing Domain"}
                  </Badge>
                  {cap.featured && (
                    <span className="rounded-full bg-accent/20 border border-accent/40 px-3 py-1 text-xs font-bold text-accent flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 fill-accent" />
                      <span>Header Spotlight Build</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/30 px-3 py-1 text-[0.68rem] font-bold text-accent">
                    <ShieldCheck className="h-3 w-3" />
                    <span>100% FAT Tested</span>
                  </span>
                </div>

                {/* Heading */}
                <h1 className="mt-5 font-display text-3xl leading-[1.08] font-extrabold sm:text-4xl lg:text-[3.25rem] text-onnavy tracking-tight">
                  {cap.title}
                </h1>

                {/* Tagline */}
                {cap.tagline && (
                  <p className="mt-3 text-base sm:text-lg font-semibold text-accent tracking-wide">
                    {cap.tagline}
                  </p>
                )}

                {/* Description */}
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-onnavy-muted">
                  {cap.description}
                </p>

                {/* Quick Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Btn
                    to={`/quote?capability=${encodeURIComponent(cap.title)}#quote-form`}
                    variant="primary"
                    className="text-xs px-7 py-3.5 font-bold shadow-lg shadow-accent/25"
                  >
                    Request Domain Quote
                  </Btn>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-onnavy/20 bg-navy-soft/80 px-5 py-3.5 text-xs font-semibold text-onnavy hover:border-accent hover:text-accent transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <Maximize2 className="h-4 w-4" />
                    <span>Inspect High-Res Photos</span>
                  </button>
                </div>

                {/* Live Telemetry Metadata Strip */}
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-onnavy/15 pt-6">
                  <Meta label="Domain Reference" value={cap.code} />
                  <Meta label="Sector Category" value={cap.category || "Precision Engineering"} />
                  <Meta label="Shop-Floor QA" value="100% FAT Verified" highlight />
                  <Meta label="Manufacturing Bay" value="Pune Works" />
                </div>
              </Reveal>
            </div>

            {/* Right Column: Premium Capability Image Showcase Card */}
            <div className="lg:col-span-5">
              <Reveal className="delay-100">
                <div className="relative rounded-3xl border border-onnavy/20 bg-navy-deep/90 p-5 backdrop-blur-md shadow-2xl overflow-hidden transition-all hover:border-accent/60 group">
                  {/* Card Header Bar */}
                  <div className="flex items-center justify-between border-b border-onnavy/15 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <span className="font-sans text-xs font-bold text-accent uppercase tracking-wider">
                        Capability Domain
                      </span>
                    </div>
                    <span className="font-sans text-[0.7rem] text-onnavy-muted font-mono font-bold">
                      {cap.code}
                    </span>
                  </div>

                  {/* High-Resolution Capability Photo */}
                  <div
                    className="relative mt-4 aspect-[16/11] overflow-hidden rounded-2xl bg-navy cursor-pointer"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img
                      src={coverImage}
                      alt={`${cap.title} engineered by Three Star Enterprises Pune`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = IMAGES.verticalInduction;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge variant="accent">{cap.category || "In-House Engineering"}</Badge>
                    </div>

                    {/* Inspect Photo Action */}
                    <div className="absolute bottom-3 right-3 rounded-xl bg-navy/90 border border-accent/40 px-3 py-1.5 text-xs font-semibold text-accent backdrop-blur-md flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:bg-accent group-hover:text-navy transition-all shadow-lg">
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Inspect Photo</span>
                    </div>
                  </div>

                  {/* Quick Facts Grid */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl border border-onnavy/15 bg-navy/60 p-2.5">
                      <span className="text-[0.65rem] text-onnavy-muted uppercase block">Verification</span>
                      <strong className="font-display text-xs font-bold text-accent block">100% FAT</strong>
                    </div>
                    <div className="rounded-xl border border-onnavy/15 bg-navy/60 p-2.5">
                      <span className="text-[0.65rem] text-onnavy-muted uppercase block">Assembly Site</span>
                      <strong className="font-display text-xs font-bold text-onnavy block">Pune Plant</strong>
                    </div>
                    <div className="rounded-xl border border-onnavy/15 bg-navy/60 p-2.5">
                      <span className="text-[0.65rem] text-onnavy-muted uppercase block">Engineering</span>
                      <strong className="font-display text-xs font-bold text-success block">In-House</strong>
                    </div>
                  </div>

                  {/* Operating Metric Chips (if available) */}
                  {cap.metrics && cap.metrics.length > 0 && (
                    <div className="mt-3.5 pt-3.5 border-t border-onnavy/15">
                      <span className="text-[0.68rem] text-onnavy-muted font-bold uppercase tracking-wider block mb-2">
                        Key Performance Parameters
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {cap.metrics.slice(0, 3).map((m, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-onnavy/10 bg-navy/40 p-2 text-xs"
                          >
                            <span className="text-[0.65rem] text-onnavy-muted truncate block">
                              {m.label}
                            </span>
                            <span className="font-bold text-onnavy font-sans truncate block">
                              {m.value}
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
      {/* 2. MAIN TECHNICAL SPECIFICATIONS & DETAILS */}
      {/* ========================================================================= */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Scope, Metrics, Features & Deliverables */}
          <InView className="lg:col-span-8 space-y-12 min-w-0">
            {/* Executive Overview */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-accent" />
                <TechLabel tone="accent">Domain Scope & Manufacturing Overview</TechLabel>
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                Precision Manufacturing & Assembly Capabilities
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-foreground/90 font-medium break-words">
                {cap.description}
              </p>
            </div>

            {/* Key Technical Metric Chips Matrix */}
            {cap.metrics && cap.metrics.length > 0 && (
              <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Activity className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Operating & Performance Parameters
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {cap.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-line bg-background p-4 flex flex-col justify-between"
                    >
                      <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                        {m.label}
                      </span>
                      <strong className="mt-2 font-display text-lg sm:text-xl font-extrabold text-accent">
                        {m.value}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Capability Highlights */}
            {cap.features && cap.features.length > 0 && (
              <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Wrench className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Engineering Architecture & Scope Highlights
                  </h3>
                </div>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {cap.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl border border-line/60 bg-background p-4"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Turnkey Deliverables & FAT Scope */}
            {cap.deliverables && cap.deliverables.length > 0 && (
              <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Turnkey Package Deliverables & Handover
                  </h3>
                </div>
                <p className="text-xs text-muted mb-6">
                  Every custom machine built under this domain includes certified pre-dispatch documentation, trial verification, and on-site integration support.
                </p>
                <div className="space-y-3">
                  {cap.deliverables.map((del, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl border border-accent/20 bg-surface p-3.5 shadow-xs"
                    >
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {del}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Machine Builds delivered in Pune */}
            {relatedProjects.length > 0 && (
              <div className="pt-6 border-t border-line">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Delivered Machine Builds in this Domain
                    </h3>
                    <p className="text-xs text-muted">
                      Real equipment manufactured and FAT-tested at our Pune facility.
                    </p>
                  </div>
                  <Link
                    href={`/projects?category=${encodeURIComponent(cap.category || "")}`}
                    className="text-xs font-bold text-accent hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {relatedProjects.map((p) => (
                    <div
                      key={p.id || (p as any)._id}
                      onClick={() => router.push(`/projects/${p.id || (p as any)._id}`)}
                      className="group rounded-2xl border border-line bg-surface overflow-hidden shadow-xs hover:border-accent hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-navy">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-accent">
                            Machine Spec
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <span className="text-[0.65rem] font-bold text-accent uppercase block">
                            {p.category || "Machinery"}
                          </span>
                          <h4 className="font-display text-xs font-bold text-foreground mt-1 group-hover:text-accent transition-colors leading-snug">
                            {p.title}
                          </h4>
                        </div>
                        <span className="mt-3 text-[0.7rem] font-bold text-accent inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>View Specs</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </InView>

          {/* Right Column: Direct RFQ Card & Pune Bay Details (Cleaned without duplicate photo card) */}
          <InView className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Direct RFQ Action Box */}
            <div className="rounded-3xl border border-accent/30 bg-navy p-6 sm:p-7 text-onnavy shadow-2xl relative overflow-hidden">
              <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative z-10">
                <span className="rounded-full bg-accent/20 border border-accent/40 px-3 py-1 text-xs font-bold text-accent uppercase">
                  Technical RFQ
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-onnavy">
                  Need a Machine Built in this Domain?
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-onnavy-muted">
                  Share your component 2D/3D CAD drawings or cycle time requirements. Our Pune engineering team will review feasibility and provide a detailed proposal.
                </p>

                <div className="mt-6 space-y-3">
                  <Btn
                    to={`/quote?capability=${encodeURIComponent(cap.title)}#quote-form`}
                    variant="primary"
                    className="w-full text-xs py-3 font-bold justify-center shadow-lg shadow-accent/25"
                  >
                    Launch Technical RFQ
                  </Btn>
                  <Btn
                    to="/contact"
                    variant="light"
                    className="w-full text-xs py-3 font-semibold justify-center"
                  >
                    Speak with Machine Engineer
                  </Btn>
                </div>
              </div>
            </div>

            {/* Quality & Trials Assurance Box */}
            <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm space-y-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>Shop-Floor Trial Guarantee</span>
              </div>
              <ul className="space-y-2 text-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>100% FAT trial runs with client production blanks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Sub-micron dial indicator slideway alignment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Siemens / Fanuc / Mitsubishi PLC HMI software</span>
                </li>
              </ul>
            </div>
          </InView>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 3. LIGHTBOX MODAL FOR ZOOM INSPECTION */}
      {/* ========================================================================= */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={[
          {
            id: cap.id || cap.code,
            image: coverImage,
            title: cap.title,
            category: `${cap.code} • ${cap.category || "Domain"}`,
            description: cap.description,
          },
        ]}
        currentIndex={0}
        onChangeIndex={() => {}}
      />

      {/* ========================================================================= */}
      {/* 4. BOTTOM TECHNICAL CTA BAND */}
      {/* ========================================================================= */}
      <CtaBand />
    </>
  );
}

function Meta({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <span className="font-sans text-[0.65rem] font-bold text-onnavy-muted uppercase tracking-wider block">
        {label}
      </span>
      <span
        className={`font-sans text-xs sm:text-sm font-semibold mt-0.5 block truncate ${
          highlight ? "text-accent font-bold" : "text-onnavy"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function CapabilityNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-navy px-4 text-center text-onnavy">
      <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10 max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/30 text-accent mb-6">
          <Cpu className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-onnavy">
          Capability Domain Not Found
        </h1>
        <p className="mt-3 text-sm text-onnavy-muted">
          The requested engineering capability domain could not be found or may have been relocated.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Btn to="/capabilities" variant="primary" className="text-xs px-6 py-3 font-bold">
            Explore All Capabilities
          </Btn>
          <Btn to="/" variant="light" className="text-xs px-6 py-3 font-semibold">
            Return Home
          </Btn>
        </div>
      </div>
    </div>
  );
}
