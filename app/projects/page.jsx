"use client";

import { useMemo, useState } from "react";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Reveal, SectionHead, TechLabel, Badge, Btn } from "@/components/site/ui";
import { CtaBand, PageHero, ProjectCard, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

export default function ProjectsPage() {
  const { projects } = useSite();
  const [industry, setIndustry] = useState("All");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const industries = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.industry)))],
    [projects],
  );
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );

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
            <Badge variant="accent">
              {String(filtered.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} MACHINES
            </Badge>
          </div>
        </InView>

        {/* Filter Toolbar */}
        <InView delay={80}>
          <div className="mt-12 border border-line bg-surface p-6 sm:p-8 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_minmax(0,18rem)]">
              <FilterRow
                label="Industry Sector"
                options={industries}
                active={industry}
                onChange={setIndustry}
              />
              <FilterRow
                label="Machine Category"
                options={categories}
                active={category}
                onChange={setCategory}
              />
              <div>
                <TechLabel>Search Keyword</TechLabel>
                <div className="relative mt-3">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. hardening, conveyor, spindle"
                    aria-label="Search projects"
                    className="w-full border border-line bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted hover:text-foreground"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </InView>

        {/* Project Grid */}
        {filtered.length === 0 ? (
          <div className="mt-14 border border-dashed border-line-strong bg-surface p-16 text-center">
            <TechLabel>No Matches Found</TechLabel>
            <h3 className="mt-3 font-display text-xl font-bold text-foreground">No projects match the active filters</h3>
            <p className="mt-2 text-sm text-muted">
              We design custom machinery for bespoke requirements. Contact our engineers to discuss your exact specifications.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setIndustry("All");
                  setCategory("All");
                  setQuery("");
                }}
                className="font-mono text-xs font-bold text-accent hover:underline uppercase"
              >
                Reset All Filters
              </button>
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

function FilterRow({ label, options, active, onChange }) {
  return (
    <div>
      <TechLabel>{label}</TechLabel>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`border px-3 py-1.5 text-[0.7rem] font-semibold tracking-[0.1em] uppercase transition-all duration-300 ${
              active === o
                ? "border-navy bg-navy text-onnavy shadow-sm"
                : "border-line text-muted hover:border-accent hover:text-accent bg-surface"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
