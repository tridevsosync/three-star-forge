"use client";

import { useMemo, useState } from "react";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Reveal, SectionHead, TechLabel, Badge, Btn } from "@/components/site/ui";
import { CtaBand, PageHero, ProjectCard, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import {
  Search,
  SlidersHorizontal,
  Factory,
  Cpu,
  RotateCcw,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function ProjectsPage() {
  const { projects } = useSite();
  const [industry, setIndustry] = useState("All");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const industries = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.industry).filter(Boolean)))],
    [projects],
  );
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))],
    [projects],
  );

  // Counts map for quick tags
  const industryCounts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    projects.forEach((p) => {
      if (p.industry) map[p.industry] = (map[p.industry] || 0) + 1;
    });
    return map;
  }, [projects]);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    projects.forEach((p) => {
      if (p.category) map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [projects]);

  const hasActiveFilters = industry !== "All" || category !== "All" || Boolean(query.trim());

  const resetFilters = () => {
    setIndustry("All");
    setCategory("All");
    setQuery("");
  };

  const filtered = projects.filter((p) => {
    const okInd = industry === "All" || p.industry === industry;
    const okCat = category === "All" || p.category === category;
    const q = query.trim().toLowerCase();
    const okQ =
      !q || `${p.title} ${p.short} ${p.category} ${p.industry}`.toLowerCase().includes(q);
    return okInd && okCat && okQ;
  });

  return (
    <>
      <PageHero
        index="04"
        eyebrow="Equipment Portfolio"
        title="Industrial machines, automated lines, and custom tooling delivered."
        intro="A comprehensive portfolio of machinery and automation systems engineered in Pune for OEM clients. Explore technical parameters, challenge solutions, and verified specs."
        image={IMAGES.pageProjects}
        action={
          <Btn to="/contact" variant="primary">
            Submit Custom Specification
          </Btn>
        }
      />

      <Section grid>
        <InView>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              index="4.1"
              eyebrow="Portfolio Directory"
              title="Filter & Search Delivered Builds"
              intro="Refine the directory by sector, machine category, or keyword."
            />
            <div className="flex items-center gap-3">
              <Badge variant="accent">
                {String(filtered.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} MACHINES
              </Badge>
            </div>
          </div>
        </InView>

        {/* Precision Engineering Filter Bar */}
        <InView delay={80}>
          <div className="mt-10 border border-line bg-surface shadow-md overflow-hidden">
            {/* Top Accent Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-background/60 px-6 py-3.5">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="h-4 w-4 text-accent" />
                <span className="tech-label font-bold text-foreground text-xs uppercase tracking-wider">
                  Specification Filter & Search Suite
                </span>
              </div>

              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-accent hover:text-foreground uppercase tracking-wider transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset All</span>
                  </button>
                )}
                <span className="font-mono text-xs text-muted">
                  Showing <strong className="text-foreground">{filtered.length}</strong> matching systems
                </span>
              </div>
            </div>

            {/* Main 3-Column Controls Strip */}
            <div className="p-6 sm:p-7">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Column 1: Industry Sector */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-muted">
                      <Factory className="h-3.5 w-3.5 text-accent" />
                      Industry Sector
                    </span>
                    <span className="text-[0.68rem] text-muted">
                      {industries.length - 1} Sectors
                    </span>
                  </label>

                  <div className="relative">
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full appearance-none border border-line bg-background px-4 py-2.5 pr-10 text-xs font-mono font-semibold uppercase tracking-wider text-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent hover:border-line-strong cursor-pointer"
                    >
                      {industries.map((ind) => (
                        <option key={ind} value={ind} className="bg-surface text-foreground py-1">
                          {ind === "All" ? "All Industry Sectors" : ind} {ind !== "All" && industryCounts[ind] ? `(${industryCounts[ind]})` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  </div>

                  {/* Quick Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {industries.slice(0, 4).map((ind) => {
                      const isActive = industry === ind;
                      return (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => setIndustry(ind)}
                          className={`border px-2.5 py-1 text-[0.65rem] font-mono font-semibold uppercase tracking-wider transition-all ${
                            isActive
                              ? "border-accent bg-accent text-navy font-bold shadow-sm"
                              : "border-line bg-background/60 text-muted hover:border-accent hover:text-foreground"
                          }`}
                        >
                          {ind}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Machine Category */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-muted">
                      <Cpu className="h-3.5 w-3.5 text-accent" />
                      Machine Category
                    </span>
                    <span className="text-[0.68rem] text-muted">
                      {categories.length - 1} Categories
                    </span>
                  </label>

                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none border border-line bg-background px-4 py-2.5 pr-10 text-xs font-mono font-semibold uppercase tracking-wider text-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent hover:border-line-strong cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-surface text-foreground py-1">
                          {cat === "All" ? "All Machine Categories" : cat} {cat !== "All" && categoryCounts[cat] ? `(${categoryCounts[cat]})` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  </div>

                  {/* Quick Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {categories.slice(0, 4).map((cat) => {
                      const isActive = category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`border px-2.5 py-1 text-[0.65rem] font-mono font-semibold uppercase tracking-wider transition-all ${
                            isActive
                              ? "border-accent bg-accent text-navy font-bold shadow-sm"
                              : "border-line bg-background/60 text-muted hover:border-accent hover:text-foreground"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Column 3: Keyword Search */}
                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <label className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-muted">
                      <Search className="h-3.5 w-3.5 text-accent" />
                      Search Keyword
                    </span>
                    <span className="text-[0.68rem] text-muted">Real-time Search</span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. hardening, conveyor, spindle..."
                      aria-label="Search machinery specifications"
                      className="w-full border border-line bg-background pl-9 pr-16 py-2.5 text-xs font-mono text-foreground outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-muted hover:text-foreground hover:bg-line/40 rounded transition-colors"
                      >
                        ✕ CLEAR
                      </button>
                    )}
                  </div>

                  <p className="pt-1 text-[0.68rem] font-mono text-muted">
                    Filter across titles, technical descriptions, and tooling categories.
                  </p>
                </div>
              </div>

              {/* Active Filter Tags Strip */}
              {hasActiveFilters && (
                <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-line/60">
                  <span className="font-mono text-[0.68rem] uppercase font-bold text-muted mr-1">
                    Active Filters:
                  </span>

                  {industry !== "All" && (
                    <span className="inline-flex items-center gap-1.5 border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-xs font-semibold text-accent">
                      <span>Sector: {industry}</span>
                      <button
                        type="button"
                        onClick={() => setIndustry("All")}
                        className="hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {category !== "All" && (
                    <span className="inline-flex items-center gap-1.5 border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-xs font-semibold text-accent">
                      <span>Category: {category}</span>
                      <button
                        type="button"
                        onClick={() => setCategory("All")}
                        className="hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {query.trim() && (
                    <span className="inline-flex items-center gap-1.5 border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-xs font-semibold text-accent">
                      <span>Keyword: "{query}"</span>
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="ml-auto font-mono text-xs font-bold text-accent hover:underline uppercase tracking-wider"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </InView>

        {/* Project Grid */}
        {filtered.length === 0 ? (
          <div className="mt-14 border border-dashed border-line bg-surface p-10 sm:p-14 text-center shadow-sm relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-background shadow-inner text-accent">
              <Search className="h-6 w-6" />
            </div>
            <TechLabel tone="accent">No Matches Found</TechLabel>
            <h3 className="mt-3 font-display text-xl sm:text-2xl font-bold text-foreground">
              No machinery projects match the active filters
            </h3>
            <p className="mt-2.5 max-w-lg mx-auto text-xs sm:text-sm text-muted leading-relaxed">
              We design and build bespoke induction machines and automation systems for OEM requirements. Try clearing your search keyword, switching category, or request a custom build specification.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Btn onClick={resetFilters} variant="primary">
                Reset All Filters
              </Btn>
              <Btn to="/contact" variant="outline">
                Request Custom Machinery Build
              </Btn>
            </div>
          </div>
        ) : (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <InView key={p.id} delay={Math.min(i % 3, 3) * 90}>
                <ProjectCard project={p} index={projects.indexOf(p)} />
              </InView>
            ))}
          </div>
        )}
      </Section>

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
