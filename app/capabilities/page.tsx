"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Reveal, Badge, Btn, Container, Lightbox } from "@/components/site/ui";
import { CtaBand, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import {
  Search,
  Factory,
  RotateCcw,
  Sparkles,
  Maximize2,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Wrench,
  ShieldCheck,
  Zap,
  Cpu,
  SlidersHorizontal,
  ChevronRight,
  Settings2,
  Gauge,
  Compass,
  FileCheck2,
} from "lucide-react";

export default function CapabilitiesPage() {
  const router = useRouter();
  const { capabilities, projects, home } = useSite();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const fromCaps = capabilities.map((c) => c.category).filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(fromCaps))];
  }, [capabilities]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { All: capabilities.length };
    capabilities.forEach((c) => {
      if (c.category) map[c.category] = (map[c.category] || 0) + 1;
    });
    return map;
  }, [capabilities]);

  // Filter capabilities
  const filtered = useMemo(() => {
    return capabilities.filter((c) => {
      const okCat = selectedCategory === "All" || c.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const okQ =
        !q ||
        `${c.title} ${c.description || ""} ${c.tagline || ""} ${c.code || ""} ${(c.features || []).join(" ")}`
          .toLowerCase()
          .includes(q);
      return okCat && okQ;
    });
  }, [capabilities, selectedCategory, searchQuery]);

  // Featured capability for Hero preview (explicitly featured in hero)
  const featuredCapability = useMemo(() => {
    return capabilities.find((c) => Boolean(c.featured)) || null;
  }, [capabilities]);

  // Lightbox items mapping
  const lightboxItems = useMemo(() => {
    return filtered.map((c, idx) => ({
      id: c.id || String(idx),
      image: c.image || IMAGES.pageCapabilities || IMAGES.verticalInduction,
      title: c.title,
      category: `${c.code} • ${c.category || "Engineering Domain"}`,
      description: c.description || c.tagline || "Shop-floor manufactured special purpose machinery.",
    }));
  }, [filtered]);

  // Machine builds for the spec matrix (Induction scanners & SPMs) dynamically selected and ordered
  const inductionMachines = useMemo(() => {
    const selectedIds = home?.inductionSpecProjectIds;
    if (Array.isArray(selectedIds) && selectedIds.length > 0) {
      const ordered: any[] = [];
      selectedIds.forEach((id: string) => {
        const found = projects.find((p) => p.id === id || (p as any)._id === id);
        if (found) ordered.push(found);
      });
      if (ordered.length > 0) return ordered;
    }
    return projects.filter(
      (p) =>
        p.category === "Induction Hardening" ||
        p.category === "Induction Hardening Machines" ||
        p.category === "Special Purpose Machines (SPM)",
    );
  }, [projects, home?.inductionSpecProjectIds]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC HERO SECTION — VISUAL-FIRST ENGINEERING CAPABILITIES */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-navy pt-28 pb-20 text-onnavy sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-30" />
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Narrative */}
            <div className={featuredCapability ? "lg:col-span-7" : "lg:col-span-12 max-w-5xl"}>
              <Reveal>
                {/* Live Telemetry Pill */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent backdrop-blur-md shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  <span>PUNE WORKS CAPABILITIES • IN-HOUSE ENGINEERING</span>
                  <span className="h-3 w-px bg-accent/40" />
                  <span className="text-onnavy-muted font-normal hidden sm:inline">
                    {capabilities.length} In-House Domains
                  </span>
                </div>

                <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-onnavy leading-[1.1]">
                  Precision Engineering & Machine Building <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-hover to-white">
                    From 3D Design to 100% FAT&#8209;Tested Machinery.
                  </span>
                </h1>

                <p className="mt-5 max-w-3xl text-base sm:text-lg text-onnavy-muted leading-relaxed font-sans">
                  From custom induction hardening scanners and high-heat conveyor systems to inline NDT crack inspection stations and precision machine tool scraping, explore our end-to-end manufacturing and trial capabilities under one roof in Pune.
                </p>

                {/* Hero CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Btn
                    to="/quote#quote-form"
                    variant="primary"
                    className="text-sm px-7 py-3.5 font-bold shadow-lg shadow-accent/25"
                  >
                    Request a Technical Quote
                  </Btn>
                  <Btn to="/gallery" variant="light" className="text-sm px-7 py-3.5 font-semibold">
                    Explore Shop-Floor Gallery
                  </Btn>
                </div>

                {/* Trust Badges Strip */}
                <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-onnavy/15 pt-6 text-xs text-onnavy-muted">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>{capabilities.length} In-House Engineering Domains</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>100% FAT Trials with Client Components</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>In-House CAD, CNC & Assembly Bay</span>
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right Hero: Featured Capability Spotlight Card */}
            {featuredCapability ? (
              <div className="lg:col-span-5">
                <InView delay={120}>
                  <div
                    onClick={() =>
                      router.push(
                        `/capabilities/${encodeURIComponent(featuredCapability.id || (featuredCapability as any)._id || featuredCapability.code.toLowerCase())}`,
                      )
                    }
                    className="group relative rounded-3xl border border-onnavy/20 bg-surface/5 p-4 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-accent/50 cursor-pointer"
                  >
                    {/* Photo Container */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-navy">
                      <img
                        src={featuredCapability.image || IMAGES.verticalInduction}
                        alt={featuredCapability.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = IMAGES.verticalInduction;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

                      {/* Zoom Trigger */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLightboxIndex(0);
                        }}
                        className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-xs font-semibold text-accent backdrop-blur-md border border-accent/30 shadow-lg hover:bg-accent hover:text-navy transition-all cursor-pointer z-10"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Inspect Capability</span>
                      </button>

                      {/* Overlay Telemetry */}
                      <div className="absolute bottom-4 left-4 right-4 text-onnavy">
                        <div className="flex items-center gap-2">
                          <span className="inline-block rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent uppercase">
                            Featured Engineering Domain
                          </span>
                          <span className="text-[0.65rem] text-onnavy-muted font-sans">
                            {featuredCapability.code}
                          </span>
                        </div>
                        <h3 className="mt-1 font-display text-base font-bold text-onnavy leading-snug group-hover:text-accent transition-colors">
                          {featuredCapability.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-onnavy-muted leading-relaxed">
                          {featuredCapability.tagline || featuredCapability.description}
                        </p>
                      </div>
                    </div>

                    {/* Quick Facts Grid */}
                    <div className="mt-3.5 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Precision</span>
                        <strong className="font-display text-xs font-bold text-accent">±0.005 mm</strong>
                      </div>
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Verification</span>
                        <strong className="font-display text-xs font-bold text-onnavy">100% FAT</strong>
                      </div>
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Origin</span>
                        <strong className="font-display text-xs font-bold text-onnavy">Pune Bay</strong>
                      </div>
                    </div>
                  </div>
                </InView>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE CAPABILITY METRICS STRIP */}
      {/* ========================================================================= */}
      <div className="border-y border-line bg-surface py-8">
        <Container>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent shrink-0">
                <Factory className="h-6 w-6" />
              </span>
              <div>
                <div className="font-display text-2xl font-extrabold text-foreground">{capabilities.length}+ Domains</div>
                <div className="text-xs text-muted">In-House Turnkey Scope</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <div className="font-display text-2xl font-extrabold text-foreground">100% FAT</div>
                <div className="text-xs text-muted">Pre-Dispatch Client Trials</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent shrink-0">
                <Zap className="h-6 w-6" />
              </span>
              <div>
                <div className="font-display text-2xl font-extrabold text-foreground">±0.005mm</div>
                <div className="text-xs text-muted">CNC Precision Tolerance</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent shrink-0">
                <Layers className="h-6 w-6" />
              </span>
              <div>
                <div className="font-display text-2xl font-extrabold text-foreground">SolidWorks</div>
                <div className="text-xs text-muted">In-House 3D CAD Bureau</div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ========================================================================= */}
      {/* 3. CAPABILITY DOMAINS & SHOWCASE GRID */}
      {/* ========================================================================= */}
      <Section id="capability-domains">
        <InView>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent">
                <Cpu className="h-3.5 w-3.5" />
                <span>IN-HOUSE MANUFACTURING DOMAINS</span>
              </div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Our Full Scope of Machine Engineering & Tooling
              </h2>
              <p className="mt-2 text-sm text-muted max-w-2xl">
                Explore our core capabilities across induction hardening, automated conveying, NDT inspection stations, precision machine tool scraping, and custom tooling.
              </p>
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search capabilities & keywords..."
                className="w-full rounded-2xl border border-line bg-background pl-10 pr-4 py-3 text-xs text-foreground placeholder:text-muted outline-none transition-all focus:border-accent font-medium shadow-xs"
              />
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-accent text-navy shadow-md shadow-accent/20 scale-[1.02]"
                      : "bg-surface border border-line text-muted hover:border-accent hover:text-foreground"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                      active ? "bg-navy text-accent" : "bg-background text-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {(selectedCategory !== "All" || searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline ml-2 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </InView>

        {/* Capabilities Grid */}
        {filtered.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-dashed border-line bg-surface p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">No capabilities match your active filters</h3>
            <p className="mt-2 text-xs text-muted max-w-md mx-auto">
              We design custom machinery for bespoke client specifications. Try resetting your search or contacting our engineering team directly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Btn onClick={resetFilters} variant="primary">
                Reset Filters
              </Btn>
              <Btn to="/quote#quote-form" variant="outline">
                Request Custom Solution
              </Btn>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cap, idx) => {
              const isHeroFeatured = Boolean(cap.featured);
              return (
                <InView key={cap.id || cap.code} delay={Math.min(idx % 3, 3) * 90}>
                  <div
                    onClick={() =>
                      router.push(
                        `/capabilities/${encodeURIComponent(cap.id || (cap as any)._id || cap.code.toLowerCase())}`,
                      )
                    }
                    className={`group flex h-full flex-col overflow-hidden bg-surface rounded-3xl min-w-0 border transition-all duration-300 hover:shadow-2xl hover:border-accent/40 hover:-translate-y-1 cursor-pointer ${
                      isHeroFeatured ? "border-accent/60 shadow-md ring-1 ring-accent/30" : "border-line"
                    }`}
                  >
                    {/* Machine Photo Banner with Zoom Trigger */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                      <img
                        src={cap.image || IMAGES.verticalInduction}
                        alt={cap.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = IMAGES.verticalInduction;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-navy/90 border border-onnavy/20 px-3 py-1 text-[0.68rem] font-bold text-onnavy backdrop-blur-md">
                          {cap.code}
                        </span>
                        {isHeroFeatured && (
                          <span className="rounded-full bg-accent px-2.5 py-0.5 text-[0.65rem] font-bold text-navy shadow-md flex items-center gap-1">
                            <Sparkles className="h-3 w-3 fill-navy" />
                            <span>Header Hero</span>
                          </span>
                        )}
                      </div>

                      {/* Lightbox Quick-Inspect Action */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLightboxIndex(idx);
                        }}
                        className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-navy/80 px-2.5 py-1 text-[0.68rem] font-semibold text-accent backdrop-blur-md border border-accent/30 shadow-lg hover:bg-accent hover:text-navy transition-all cursor-pointer z-10"
                        title="Inspect Capability Photos"
                      >
                        <Maximize2 className="h-3 w-3" />
                        <span>Inspect</span>
                      </button>

                      {/* Bottom Overlay on Photo */}
                      <div className="absolute bottom-3 left-3 right-3 text-onnavy">
                        <span className="font-sans text-[0.68rem] font-bold text-accent uppercase tracking-wider block">
                          {cap.category || "Manufacturing Domain"}
                        </span>
                        <h3 className="font-display text-base font-bold text-onnavy leading-snug group-hover:text-accent transition-colors">
                          {cap.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 min-w-0">
                      <div className="min-w-0">
                        <p className="text-xs leading-relaxed text-muted break-words">
                          {cap.description}
                        </p>

                        {/* Technical Metric Chips */}
                        {cap.metrics && cap.metrics.length > 0 && (
                          <div className="mt-3.5 flex flex-wrap gap-1.5">
                            {cap.metrics.map((m, mIdx) => (
                              <span
                                key={mIdx}
                                className="inline-flex items-center gap-1 rounded-lg bg-background border border-line px-2 py-1 text-[0.68rem] text-foreground font-medium"
                              >
                                <span className="text-muted">{m.label}:</span>
                                <strong className="text-accent font-bold">{m.value}</strong>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Bullet Highlights */}
                        {cap.features && cap.features.length > 0 && (
                          <ul className="mt-4 space-y-2 border-t border-line/60 pt-3">
                            {cap.features.slice(0, 3).map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2 text-[0.72rem] text-muted">
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                <span className="leading-snug">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Dual Action Buttons */}
                      <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-accent transition-colors">
                          <span>Explore Domain Specs</span>
                          <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/quote?capability=${encodeURIComponent(cap.title)}#quote-form`);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-accent/10 border border-accent/30 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-navy transition-all shadow-xs cursor-pointer"
                        >
                          <span>Request RFQ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </InView>
              );
            })}
          </div>
        )}
      </Section>

      {/* ========================================================================= */}
      {/* 4. INDUCTION MACHINE MODELS & TECHNICAL SPECIFICATION MATRIX */}
      {/* ========================================================================= */}
      <Section dark grid>
        <InView>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-onnavy/15 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 border border-accent/40 px-3.5 py-1 text-xs font-bold text-accent">
                <Settings2 className="h-3.5 w-3.5" />
                <span>TECHNICAL SPECIFICATION MATRIX</span>
              </div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-onnavy tracking-tight">
                Induction Hardening Machinery Models & Datasheets
              </h2>
              <p className="mt-2 text-sm text-onnavy-muted max-w-2xl font-sans">
                Turnkey scanning axes, solid-state power supplies, and integrated quench recirculators built and verified in our Pune assembly bays.
              </p>
            </div>

            <Btn to="/quote#quote-form" variant="primary" className="text-xs px-6 py-3 font-bold">
              Custom Sizing Consultation
            </Btn>
          </div>
        </InView>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {inductionMachines.map((m, i) => (
            <InView key={m.id || i} delay={Math.min(i, 3) * 90}>
              <div
                onClick={() => router.push(`/projects/${m.id || (m as any)._id}`)}
                className="group h-full rounded-3xl border border-onnavy/20 bg-surface/5 p-6 sm:p-8 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-accent hover:shadow-2xl flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-accent/20 border border-accent/40 px-3 py-1 text-xs font-bold text-accent">
                      {`MODEL IH-0${i + 1}`}
                    </span>
                    <span className="text-xs font-bold text-onnavy-muted uppercase">{m.industry}</span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold text-onnavy group-hover:text-accent transition-colors leading-snug">
                    {m.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-onnavy-muted">
                    {m.short || m.overview || "Precision automated induction hardening machine build."}
                  </p>

                  {/* Technical Datasheet Table */}
                  {m.specs && m.specs.length > 0 && (
                    <div className="mt-6 rounded-2xl border border-onnavy/15 bg-navy/60 p-4">
                      <div className="text-[0.68rem] font-bold text-accent uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5" />
                        <span>Machine Parameter Specifications</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {m.specs.slice(0, 4).map((sp: any, spIdx: number) => (
                          <div key={spIdx} className="rounded-xl border border-onnavy/10 bg-navy/80 p-2.5">
                            <span className="text-[0.65rem] text-onnavy-muted block uppercase truncate">{sp.label}</span>
                            <strong className="text-xs font-bold text-onnavy truncate block">{sp.value}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-onnavy/15 flex items-center justify-between">
                  <span className="text-xs font-bold text-accent group-hover:underline inline-flex items-center gap-1">
                    <span>Explore Machine Specs</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/quote?project=${encodeURIComponent(m.title)}#quote-form`);
                    }}
                    className="rounded-xl bg-accent px-3.5 py-1.5 text-xs font-bold text-navy shadow-md hover:bg-accent-hover transition-all cursor-pointer"
                  >
                    Quote this Model
                  </button>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 5. SHOP-FLOOR PRECISION METROLOGY & 100% FAT VERIFICATION BAY */}
      {/* ========================================================================= */}
      <Section grid>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <InView>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line bg-navy shadow-2xl group">
                <img
                  src={IMAGES.metrology}
                  alt="Dimensional inspection and dial indicator metrology testing"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-navy/90 border border-accent/40 px-3.5 py-1 text-xs font-bold text-accent backdrop-blur-md">
                    Shop-Floor Testing Bay • Pune Works
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-onnavy">
                  <span className="text-xs text-accent font-bold uppercase tracking-wider block">
                    Zero-Defect Quality Assurance
                  </span>
                  <h4 className="font-display text-base font-bold text-onnavy">
                    Sub-Micron Dial Indicator & Slideway Alignment
                  </h4>
                </div>
              </div>
            </InView>
          </div>

          <div className="lg:col-span-6">
            <InView delay={120}>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent">
                <FileCheck2 className="h-3.5 w-3.5" />
                <span>QUALITY ASSURANCE & TESTING</span>
              </div>

              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Tested and Proven with Your Parts Before Leaving Pune
              </h2>

              <p className="mt-3 text-sm text-muted leading-relaxed font-sans">
                Every machine is fully assembled, electrically wired, and powered up for live component trials in our Pune facility. Cycle times, heating depth, sliding tolerances, and emergency interlocks are verified and signed off before dispatch.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-surface p-4">
                  <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                    <Compass className="h-4 w-4 text-accent" />
                    <span>Laser & Slideway Alignment</span>
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Sub-micron dial gauges and precision levels ensure parallel travel without geometric distortion.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-surface p-4">
                  <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>Rockwell & Hardness Depth</span>
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Micro-hardness testing across heat-treated zones confirms drawing metallurgy compliance.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-surface p-4">
                  <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span>Live Component Trials</span>
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Full-speed continuous dry and wet trial runs using customer production blanks.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-surface p-4">
                  <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-accent" />
                    <span>FAT Compliance Dossier</span>
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Pre-dispatch inspection sheets, wiring schematics, and test trial videos provided for handover.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Btn to="/quote#quote-form" variant="primary" className="px-7 py-3.5 font-bold shadow-lg shadow-accent/25">
                  Schedule a Factory Visit or Trial
                </Btn>
              </div>
            </InView>
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 6. CAD TO MACHINE REALITY 4-STAGE ENGINEERING LIFECYCLE BAY */}
      {/* ========================================================================= */}
      <Section dark grid tight>
        <InView>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 border border-accent/40 px-3.5 py-1 text-xs font-bold text-accent">
              <Compass className="h-3.5 w-3.5" />
              <span>FROM CAD TO COMMISSIONING</span>
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-onnavy tracking-tight">
              Our 4-Stage Engineering & Machine Delivery Roadmap
            </h2>
            <p className="mt-2 text-sm text-onnavy-muted">
              Structured engineering milestones ensuring zero surprises, complete transparency, and on-time machine commissioning.
            </p>
          </div>
        </InView>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "3D CAD & FEA Bureau",
              desc: "SolidWorks 3D kinematics, structural stress analysis, component sizing, and customer drawing approval.",
            },
            {
              step: "02",
              title: "Machining & Sub-Assembly",
              desc: "In-house precision CNC milling, turning, structural frame fabrication, and slideway scraping.",
            },
            {
              step: "03",
              title: "Electrical & Automation",
              desc: "Complete PLC wiring, servo drive integration, custom induction coil winding, and touch HMI development.",
            },
            {
              step: "04",
              title: "FAT Trials & Handover",
              desc: "100% component trial runs in Pune, pre-dispatch inspection certification, on-site setup, and operator training.",
            },
          ].map((st, i) => (
            <InView key={st.step} delay={i * 80}>
              <div className="rounded-3xl border border-onnavy/15 bg-surface/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-accent hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-extrabold text-accent">{st.step}</span>
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent uppercase">
                    Stage {i + 1}
                  </span>
                </div>
                <h4 className="mt-4 font-display text-base font-bold text-onnavy">{st.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-onnavy-muted">{st.desc}</p>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 7. FULLSCREEN ZOOMABLE LIGHTBOX */}
      {/* ========================================================================= */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        items={lightboxItems}
        currentIndex={lightboxIndex || 0}
        onChangeIndex={(i) => setLightboxIndex(i)}
      />

      {/* ========================================================================= */}
      {/* 8. DYNAMIC CALL TO ACTION BAND */}
      {/* ========================================================================= */}
      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
