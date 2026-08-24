import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Reveal, SectionHead, TechLabel } from "@/components/site/ui";
import { CtaBand, PageHero, ProjectCard, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Project Portfolio — Induction Hardening, Conveyors, Automation | Three Star" },
      {
        name: "description",
        content:
          "Delivered equipment programmes: induction hardening machines, forging automation, conveyors, inspection and sorting systems, fixtures, machine assembly and refurbishment.",
      },
      { property: "og:title", content: "Industrial Project Portfolio — Three Star Enterprises" },
      {
        property: "og:description",
        content:
          "Browse machines and automation systems designed, manufactured and commissioned for OEM and engineering customers.",
      },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsList,
});
function ProjectsList() {
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
    const okQ = !q || `${p.title} ${p.short} ${p.category} ${p.industry}`.toLowerCase().includes(q);
    return okInd && okCat && okQ;
  });
  return (
    <>
      <PageHero
        index="04"
        eyebrow="Portfolio"
        title="Machines, automation and handling systems we have engineered."
        intro="A working portfolio of equipment programmes drawn from our company presentation. Technical values shown are as supplied; further detail is available on request."
        image={IMAGES.pageProjects}
      />

      <Section grid>
        <InView>
          <SectionHead
            index="4.1"
            eyebrow="Browse"
            title="Filter the portfolio"
            intro="Filter by industry or equipment category, or search by machine name."
          />
        </InView>

        <InView delay={80}>
          <div className="mt-12 border border-line bg-surface p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_minmax(0,18rem)]">
              <FilterRow
                label="Industry"
                options={industries}
                active={industry}
                onChange={setIndustry}
              />
              <FilterRow
                label="Category"
                options={categories}
                active={category}
                onChange={setCategory}
              />
              <div>
                <TechLabel>Search</TechLabel>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. conveyor, hardening"
                  aria-label="Search projects"
                  className="mt-3 w-full border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
                />
              </div>
            </div>
            <p className="mt-6 font-mono text-xs text-muted">
              {String(filtered.length).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")} projects
            </p>
          </div>
        </InView>

        {filtered.length === 0 ? (
          <div className="mt-14 border border-dashed border-line-strong bg-surface p-16 text-center">
            <TechLabel>No results</TechLabel>
            <p className="mt-4 text-sm text-muted">
              No projects match these filters. Talk to our team about your requirement.
            </p>
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
            className={`border px-3.5 py-2 text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${
              active === o
                ? "border-navy bg-navy text-onnavy"
                : "border-line text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
