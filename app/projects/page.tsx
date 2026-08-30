"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Reveal, Badge, Btn, Container, Lightbox, TechLabel } from "@/components/site/ui";
import { CtaBand, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import {
  Search,
  SlidersHorizontal,
  Factory,
  RotateCcw,
  X,
  ChevronDown,
  Sparkles,
  Maximize2,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Wrench,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function ProjectsPage() {
  const router = useRouter();
  const { projects } = useSite();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract unique industries & categories dynamically
  const industries = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.industry).filter(Boolean)))],
    [projects],
  );

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))],
    [projects],
  );

  // Counts mapping
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    projects.forEach((p) => {
      if (p.category) map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [projects]);

  const industryCounts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    projects.forEach((p) => {
      if (p.industry) map[p.industry] = (map[p.industry] || 0) + 1;
    });
    return map;
  }, [projects]);

  const hasActiveFilters =
    selectedCategory !== "All" || selectedIndustry !== "All" || Boolean(searchQuery.trim());

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedIndustry("All");
    setSearchQuery("");
  };

  // Filtered builds
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const okCat = selectedCategory === "All" || p.category === selectedCategory;
      const okInd = selectedIndustry === "All" || p.industry === selectedIndustry;
      const q = searchQuery.trim().toLowerCase();
      const okQ =
        !q ||
        `${p.title} ${p.short || ""} ${p.category || ""} ${p.industry || ""} ${p.summary || ""}`
          .toLowerCase()
          .includes(q);
      return okCat && okInd && okQ;
    });
  }, [projects, selectedCategory, selectedIndustry, searchQuery]);

  // Featured project for Hero preview (explicitly featured in hero header)
  const featuredProject = useMemo(() => {
    return projects.find((p) => p.featuredInHero) || null;
  }, [projects]);

  // Lightbox items mapping
  const lightboxItems = useMemo(() => {
    return filtered.map((p, idx) => ({
      id: p.id || String(idx),
      image: p.image || IMAGES.verticalInduction || IMAGES.pageProjects,
      title: p.title,
      category: `${p.category || "SPM"} • ${p.industry || "General Industry"}`,
      description: p.summary || p.overview || p.short || "Shop-floor manufactured special purpose machinery.",
    }));
  }, [filtered]);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC HERO SECTION — VISUAL-FIRST MACHINERY PORTFOLIO */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-navy pt-28 pb-20 text-onnavy sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-30" />
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Narrative */}
            <div className={featuredProject ? "lg:col-span-7" : "lg:col-span-12 max-w-5xl"}>
              <Reveal>
                {/* Live Telemetry Pill */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent backdrop-blur-md shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  <span>PUNE ENGINEERING WORKS • EQUIPMENT PORTFOLIO</span>
                  <span className="h-3 w-px bg-accent/40" />
                  <span className="text-onnavy-muted font-normal hidden sm:inline">
                    {projects.length} Industrial Builds Delivered
                  </span>
                </div>

                <h1 className="mt-5 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-onnavy leading-[1.1]">
                  Precision Machinery & SPM Automation <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-hover to-white">
                    Engineered for High&#8209;Throughput Manufacturing.
                  </span>
                </h1>

                <p className="mt-4 sm:mt-5 max-w-3xl text-sm sm:text-base lg:text-lg text-onnavy-muted leading-relaxed font-sans">
                  Explore our comprehensive portfolio of custom induction hardening scanners, automated conveyor lines, special purpose drilling & tapping machines, and heavy structural tooling manufactured and 100% FAT-tested at our Pune facility.
                </p>

                {/* Hero CTAs */}
                <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Btn
                    to="/quote#quote-form"
                    variant="primary"
                    className="text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 font-bold shadow-lg shadow-accent/25"
                  >
                    Request a Custom Machine Quote
                  </Btn>
                  <Btn to="/gallery" variant="light" className="text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 font-semibold">
                    Explore Shop-Floor Gallery
                  </Btn>
                </div>

                {/* Trust Badges Strip */}
                <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-onnavy/15 pt-6 text-xs text-onnavy-muted">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>{projects.length} Verified Turnkey Builds</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>100% FAT Trials with Client Parts</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>In-House CAD, CNC & Assembly Bay</span>
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right Hero: Featured Build Spotlight Card */}
            {featuredProject ? (
              <div className="lg:col-span-5">
                <InView delay={120}>
                  <div
                    onClick={() => router.push(`/projects/${featuredProject.id || (featuredProject as any)._id}`)}
                    className="group relative rounded-3xl border border-onnavy/20 bg-surface/5 p-4 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-accent/50 cursor-pointer"
                  >
                    {/* Photo Container */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-navy">
                      <img
                        src={featuredProject.image || IMAGES.pageProjects}
                        alt={featuredProject.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                        <span>Inspect Machine</span>
                      </button>

                      {/* Overlay Telemetry */}
                      <div className="absolute bottom-4 left-4 right-4 text-onnavy">
                        <div className="flex items-center gap-2">
                          <span className="inline-block rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent uppercase">
                            Delivered Machinery
                          </span>
                          <span className="text-[0.65rem] text-onnavy-muted font-mono">
                            {featuredProject.category || "SPM"}
                          </span>
                        </div>
                        <h3 className="mt-1 font-display text-base font-bold text-onnavy leading-snug group-hover:text-accent transition-colors">
                          {featuredProject.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-onnavy-muted leading-relaxed line-clamp-1">
                          {featuredProject.short || featuredProject.summary}
                        </p>
                      </div>
                    </div>

                    {/* Quick Facts Grid */}
                    <div className="mt-3.5 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Sector</span>
                        <strong className="font-display text-xs font-bold text-accent truncate block">
                          {featuredProject.industry || "Custom"}
                        </strong>
                      </div>
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Testing</span>
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
      {/* 2. INDUSTRIAL BUILDS BROWSER & FILTER SECTION */}
      {/* ========================================================================= */}
      <Section grid id="projects-grid" className="scroll-mt-12">
        <InView>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent px-2.5 py-1 rounded-md bg-accent/10 border border-accent/30">
                  SECTION 02
                </span>
                <TechLabel tone="muted">Equipment Catalogue</TechLabel>
              </div>
              <h2 className="mt-3 font-display text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                All Delivered Machine Builds &amp; Automation
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted max-w-2xl">
                Filter by machine category or manufacturing sector to inspect technical capabilities, machine parameters, and delivered shop-floor photographs.
              </p>
            </div>
          </div>
        </InView>

        {/* Filter Controls Strip */}
        <InView delay={60}>
          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            {/* Category Pills Bar (Touch Scrollable on Mobile) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible sm:pb-0 scrollbar-none w-full">
              {categories.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-2xl border px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
                      isActive
                        ? "border-accent bg-accent text-navy font-bold shadow-md shadow-accent/25"
                        : "border-line bg-surface text-muted hover:border-accent hover:text-foreground"
                    }`}
                  >
                    <span>{cat === "All" ? "All Categories" : cat}</span>
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[0.65rem] font-bold ${
                        isActive ? "bg-navy text-accent" : "bg-background text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Secondary Controls Bar: Sector Selector + Search */}
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-12 items-center bg-surface border border-line p-3 sm:p-4 rounded-2xl shadow-xs">
              {/* Sector Dropdown */}
              <div className="sm:col-span-5 relative">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-line bg-background px-4 py-2.5 pr-10 text-base sm:text-xs font-semibold text-foreground outline-none transition-all focus:border-accent hover:border-line-strong cursor-pointer"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind === "All" ? "All Industry Sectors" : ind} {ind !== "All" && industryCounts[ind] ? `(${industryCounts[ind]})` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              </div>

              {/* Keyword Search Input */}
              <div className="sm:col-span-7 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search machine models, specs, controls..."
                  className="w-full rounded-xl border border-line bg-background pl-9 pr-16 py-2.5 text-base sm:text-xs text-foreground placeholder:text-muted/60 outline-none transition-all focus:border-accent"
                />
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[0.65rem] font-bold text-muted hover:text-foreground hover:bg-line/40 rounded transition-colors"
                  >
                    ✕ CLEAR
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Pill Strip */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-muted font-medium mr-1">Active Filters:</span>
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    <span>Category: {selectedCategory}</span>
                    <button type="button" onClick={() => setSelectedCategory("All")} className="hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedIndustry !== "All" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    <span>Sector: {selectedIndustry}</span>
                    <button type="button" onClick={() => setSelectedIndustry("All")} className="hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    <span>Keyword: "{searchQuery}"</span>
                    <button type="button" onClick={() => setSearchQuery("")} className="hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-auto text-xs font-bold text-accent hover:underline cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </InView>

        {/* ========================================================================= */}
        {/* 4. IMAGE-RICH PROJECTS SHOWCASE GRID */}
        {/* ========================================================================= */}
        {filtered.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-dashed border-line bg-surface p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">No machinery builds match your active filters</h3>
            <p className="mt-2 text-xs text-muted max-w-md mx-auto">
              We design and manufacture bespoke special purpose machines for custom client requirements. Try clearing your filters or contact our engineering team directly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Btn onClick={resetFilters} variant="primary">
                Reset All Filters
              </Btn>
              <Btn to="/quote" variant="outline">
                Request Custom Machinery Build
              </Btn>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, idx) => {
              const projectId = p.id || (p as any)._id;
              return (
                <InView key={projectId} delay={Math.min(idx % 3, 3) * 90}>
                  <div
                    onClick={() => router.push(`/projects/${projectId}`)}
                    className="group flex h-full flex-col overflow-hidden bg-surface rounded-3xl min-w-0 border border-line transition-all duration-300 hover:shadow-2xl hover:border-accent/40 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Machine Photo Banner with Zoom Trigger */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                      <img
                        src={p.image || IMAGES.verticalInduction || IMAGES.pageProjects}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-navy/90 border border-onnavy/20 px-3 py-1 text-[0.68rem] font-bold text-onnavy backdrop-blur-md">
                          {p.category || "Custom SPM"}
                        </span>
                        {p.featured ? (
                          <span className="rounded-full bg-accent px-2.5 py-0.5 text-[0.65rem] font-bold text-navy shadow-md flex items-center gap-1">
                            <Sparkles className="h-3 w-3 fill-navy" />
                            <span>Featured</span>
                          </span>
                        ) : null}
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
                        title="Inspect Machine Photos"
                      >
                        <Maximize2 className="h-3 w-3" />
                        <span>Inspect</span>
                      </button>

                      {/* Bottom Overlay on Photo */}
                      <div className="absolute bottom-3 left-3 right-3 text-onnavy">
                        <span className="font-sans text-[0.68rem] font-bold text-accent uppercase tracking-wider block">
                          {p.industry || "Custom Machine"}
                        </span>
                        <h3 className="font-display text-base font-bold text-onnavy leading-snug group-hover:text-accent transition-colors truncate">
                          {p.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 min-w-0">
                      <div className="min-w-0">
                        <p className="text-xs leading-relaxed text-muted break-words">
                          {p.summary || p.overview || p.short}
                        </p>

                        {/* Technical Spec Chips */}
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-background border border-line px-2 py-0.5 text-[0.68rem] text-foreground font-medium">
                            <CheckCircle2 className="h-2.5 w-2.5 text-accent" />
                            <span>100% FAT Tested</span>
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-background border border-line px-2 py-0.5 text-[0.68rem] text-foreground font-medium">
                            <CheckCircle2 className="h-2.5 w-2.5 text-accent" />
                            <span>Pune Built</span>
                          </span>
                          {p.category && (
                            <span className="rounded-lg bg-background border border-line px-2 py-0.5 text-[0.68rem] text-muted">
                              {p.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dual Action Buttons */}
                      <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-accent transition-colors">
                          <span>Full Specs</span>
                          <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/quote?project=${encodeURIComponent(p.title)}#quote-form`);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-accent/10 border border-accent/30 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-navy transition-all shadow-xs cursor-pointer"
                        >
                          <span>Quote this Build</span>
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
      {/* 5. "FROM CAD TO REALITY" 4-STAGE TECHNICAL BAY */}
      {/* ========================================================================= */}
      <Section dark tight grid>
        <InView>
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent">
              <Layers className="h-3.5 w-3.5" />
              <span>Full Lifecycle Engineering</span>
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-onnavy">
              From 3D Blueprint to Shop-Floor Reality
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-onnavy-muted leading-relaxed">
              Every build in our portfolio follows a rigorous 4-stage engineering lifecycle under single-roof accountability in Pune.
            </p>
          </div>
        </InView>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <InView delay={60}>
            <div className="h-full rounded-2xl border border-onnavy/15 bg-surface/5 p-6 backdrop-blur-md flex flex-col justify-between hover:border-accent/40 transition-colors">
              <div>
                <span className="font-display text-2xl font-extrabold text-accent">01</span>
                <h3 className="mt-2 font-display text-base font-bold text-onnavy">3D SolidWorks CAD Design</h3>
                <p className="mt-2 text-xs text-onnavy-muted leading-relaxed">
                  Kinematic motion simulations, FEA stress modeling, and full 2D manufacturing blueprints for zero-collision assemblies.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-onnavy/10 text-[0.7rem] font-bold text-accent">
                CAD BUREAU VERIFIED
              </div>
            </div>
          </InView>

          <InView delay={120}>
            <div className="h-full rounded-2xl border border-onnavy/15 bg-surface/5 p-6 backdrop-blur-md flex flex-col justify-between hover:border-accent/40 transition-colors">
              <div>
                <span className="font-display text-2xl font-extrabold text-accent">02</span>
                <h3 className="mt-2 font-display text-base font-bold text-onnavy">Precision CNC Machining</h3>
                <p className="mt-2 text-xs text-onnavy-muted leading-relaxed">
                  In-house structural frame fabrication, heavy CNC milling, turning, and stress-relieved bed machining to ±0.005mm.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-onnavy/10 text-[0.7rem] font-bold text-accent">
                CNC WORKSHOP VERIFIED
              </div>
            </div>
          </InView>

          <InView delay={180}>
            <div className="h-full rounded-2xl border border-onnavy/15 bg-surface/5 p-6 backdrop-blur-md flex flex-col justify-between hover:border-accent/40 transition-colors">
              <div>
                <span className="font-display text-2xl font-extrabold text-accent">03</span>
                <h3 className="mt-2 font-display text-base font-bold text-onnavy">PLC & Servo Integration</h3>
                <p className="mt-2 text-xs text-onnavy-muted leading-relaxed">
                  Siemens/Delta PLC control panel wiring, multi-axis servo synchronization, pneumatic quench plumbing, and safety guards.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-onnavy/10 text-[0.7rem] font-bold text-accent">
                CONTROL PANEL VERIFIED
              </div>
            </div>
          </InView>

          <InView delay={240}>
            <div className="h-full rounded-2xl border border-onnavy/15 bg-surface/5 p-6 backdrop-blur-md flex flex-col justify-between hover:border-accent/40 transition-colors">
              <div>
                <span className="font-display text-2xl font-extrabold text-accent">04</span>
                <h3 className="mt-2 font-display text-base font-bold text-onnavy">100% FAT Live Trials</h3>
                <p className="mt-2 text-xs text-onnavy-muted leading-relaxed">
                  Continuous high-speed dry and wet testing with actual client components before dispatch, with verified cycle times.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-onnavy/10 text-[0.7rem] font-bold text-accent">
                CLIENT FAT SIGNOFF
              </div>
            </div>
          </InView>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 6. BOTTOM CTA BAND */}
      {/* ========================================================================= */}
      <Reveal>
        <CtaBand />
      </Reveal>

      {/* ========================================================================= */}
      {/* 7. FULLSCREEN INTERACTIVE LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        items={lightboxItems}
        currentIndex={lightboxIndex || 0}
        onChangeIndex={(newIdx) => setLightboxIndex(newIdx)}
      />
    </>
  );
}
