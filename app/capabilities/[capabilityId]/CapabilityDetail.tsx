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
      {/* 1. ATMOSPHERIC HERO BANNER */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-navy pt-32 pb-16 text-onnavy sm:pt-40 sm:pb-24">
        {coverImage && (
          <img
            src={coverImage}
            alt={`${cap.title} engineered by Three Star Enterprises Pune`}
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80" />
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-50" />

        <Container className="relative">
          <Reveal>
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans font-semibold text-onnavy-muted">
              <Link href="/" className="transition-colors hover:text-accent">
                HOME
              </Link>
              <span className="text-accent">/</span>
              <Link href="/capabilities" className="transition-colors hover:text-accent">
                CAPABILITIES
              </Link>
              <span className="text-accent">/</span>
              <span className="text-accent uppercase">{cap.code}</span>
              <span className="text-accent">/</span>
              <span className="text-onnavy uppercase">{(cap.category || "Domain").toUpperCase()}</span>
            </nav>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-navy shadow-sm">
                {cap.code}
              </span>
              <Badge variant="navy">{cap.category || "Manufacturing Domain"}</Badge>
              {cap.featured && (
                <span className="rounded-full bg-accent/20 border border-accent/40 px-3 py-1 text-xs font-bold text-accent flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 fill-accent" />
                  <span>Header Spotlight Build</span>
                </span>
              )}
              <span className="rounded-full bg-surface/10 border border-onnavy/20 px-3 py-1 text-xs text-onnavy-muted">
                100% In-House Pune Assembly
              </span>
            </div>

            <h1 className="mt-5 max-w-4xl font-display text-3xl leading-[1.08] font-extrabold sm:text-5xl lg:text-[3.5rem] text-onnavy tracking-tight">
              {cap.title}
            </h1>

            {cap.tagline && (
              <p className="mt-3 text-base sm:text-lg font-semibold text-accent tracking-wide">
                {cap.tagline}
              </p>
            )}

            {/* Live Telemetry Metadata Strip */}
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-onnavy/15 pt-6">
              <Meta label="Domain Reference" value={cap.code} />
              <Meta label="Sector Category" value={cap.category || "Precision Engineering"} />
              <Meta label="Shop-Floor QA Status" value="100% FAT Verified" />
              <Meta label="Manufacturing Bay" value="Pune Engineering Works" />
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Btn
                to={`/quote?capability=${encodeURIComponent(cap.title)}#quote-form`}
                variant="primary"
                className="text-xs px-7 py-3.5 font-bold shadow-lg shadow-accent/25"
              >
                Request Domain Quote
              </Btn>
              <Btn
                to="/capabilities"
                variant="light"
                className="text-xs px-6 py-3.5 font-semibold"
              >
                ← Back to All Capabilities
              </Btn>
            </div>
          </Reveal>
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
              <TechLabel tone="accent">Domain Scope & Manufacturing Overview</TechLabel>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-foreground font-medium break-words">
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

          {/* Right Column: Machine Photo Inspection, RFQ Card & Pune Bay Details */}
          <InView className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Machine Photo Card with Lightbox Trigger */}
            <div className="rounded-3xl border border-line bg-surface p-4 shadow-xl overflow-hidden group">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-navy">
                <img
                  src={coverImage}
                  alt={cap.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = IMAGES.verticalInduction;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />

                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-xs font-semibold text-accent backdrop-blur-md border border-accent/30 shadow-lg hover:bg-accent hover:text-navy transition-all cursor-pointer"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Inspect Photo</span>
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-onnavy">
                  <span className="rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent uppercase">
                    {cap.code} • In-House Engineering
                  </span>
                  <h4 className="mt-1 font-display text-sm font-bold text-onnavy leading-snug">
                    {cap.title}
                  </h4>
                </div>
              </div>
            </div>

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

function Meta({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <span className="font-sans text-[0.65rem] font-bold text-onnavy-muted uppercase tracking-wider block">
        {label}
      </span>
      <span className="font-sans text-xs sm:text-sm font-semibold text-onnavy mt-0.5 block">
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
