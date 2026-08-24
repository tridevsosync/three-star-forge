import { createFileRoute } from "@tanstack/react-router";
import { IMAGES } from "@/data/images";
import { CAPABILITY_STRIP, NPI_STEPS, WHY_POINTS, WORKFLOW } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Btn, Container, Reveal, SectionHead, TechLabel } from "@/components/site/ui";
import { CtaBand, ProjectCard, Section } from "@/components/site/blocks";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Three Star Enterprises — Engineering Ideas Into Industrial Reality" },
      {
        name: "description",
        content:
          "Design engineering, turnkey manufacturing, NPI and product management for global OEMs. Induction hardening machines, conveyors, automation and material handling equipment from Pune.",
      },
      {
        property: "og:title",
        content: "Three Star Enterprises — Design & Turnkey Manufacturing for OEMs",
      },
      {
        property: "og:description",
        content:
          "Pune-based design and manufacturing partner for OEMs across material handling, automation, pharmaceutical, food and process industries.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { home, services, industries, projects, gallery, company } = useSite();
  const featured = projects.filter((p) => p.featured).slice(0, 6);
  const galleryPreview = gallery.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] overflow-hidden bg-navy text-onnavy">
        <img
          src={IMAGES.hero}
          alt="Industrial manufacturing floor with engineering equipment"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/85 to-navy/45" />
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-onnavy/10 lg:block" />

        <Container className="relative flex min-h-[92vh] flex-col justify-center pt-32 pb-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <TechLabel tone="accent">{home.eyebrow}</TechLabel>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-8 max-w-4xl text-[2.6rem] leading-[1.03] font-semibold tracking-tight sm:text-6xl lg:text-[4.4rem]">
              {home.heroTitle}
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-onnavy-muted sm:text-lg">
              {home.heroSubtitle}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Btn to="/capabilities">{home.primaryCta}</Btn>
              <Btn to="/contact" variant="light">
                {home.secondaryCta}
              </Btn>
            </div>
          </Reveal>

          <Reveal delay={480}>
            <dl className="mt-16 grid max-w-3xl gap-px border border-onnavy/15 bg-onnavy/10 sm:grid-cols-3">
              {[
                { k: "Discipline", v: "Design + Build" },
                { k: "Process", v: "NPI Driven" },
                { k: "Clients", v: "Global OEMs" },
              ].map((s) => (
                <div key={s.k} className="bg-navy/70 px-6 py-5 backdrop-blur-sm">
                  <dt className="tech-label text-onnavy-muted">{s.k}</dt>
                  <dd className="mt-2 font-display text-lg font-semibold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
          <TechLabel tone="light">Scroll</TechLabel>
          <span className="relative block h-10 w-px bg-onnavy/25">
            <span className="scroll-dot absolute top-0 left-1/2 block h-2 w-2 -translate-x-1/2 rounded-full bg-accent" />
          </span>
        </div>
      </section>

      {/* CAPABILITY STRIP */}
      <div className="border-y border-line bg-surface">
        <Container>
          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {CAPABILITY_STRIP.map((c, i) => (
              <li
                key={c}
                className="group flex items-center gap-3 bg-surface px-5 py-6 transition-colors duration-300 hover:bg-background"
              >
                <span className="tech-label text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[0.82rem] font-semibold tracking-wide text-foreground">
                  {c}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* ABOUT */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHead
              index="01"
              eyebrow="About Three Star Enterprises"
              title={home.aboutHeading}
              intro={company.description}
            />
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
              {company.positioning}
            </p>
            <div className="mt-10">
              <Btn to="/about" variant="outline">
                About the Company
              </Btn>
            </div>
          </div>
          <div className="relative">
            <div className="corner-marks relative border border-line">
              <img
                src={IMAGES.about}
                alt="Design engineering workstation with technical drawings"
                className="aspect-4/3 w-full object-cover"
              />
            </div>
            <ol className="mt-8 divide-y divide-line border border-line bg-surface">
              {WORKFLOW.map((w, i) => (
                <li key={w} className="flex items-center gap-4 px-5 py-4">
                  <span className="tech-label text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-semibold text-foreground">{w}</span>
                  <span className="ml-auto h-px flex-1 bg-line" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* WHY */}
      <Section dark grid tight>
        <SectionHead
          index="02"
          eyebrow="Why Three Star"
          title="Engineering support built around OEM programmes"
          dark
        />
        <div className="mt-14 grid gap-px bg-onnavy/12 md:grid-cols-2 lg:grid-cols-3">
          {WHY_POINTS.map((p, i) => (
            <div
              key={p.title}
              className="group bg-navy p-7 transition-colors duration-500 hover:bg-navy-soft"
            >
              <TechLabel tone="accent">{String(i + 1).padStart(2, "0")}</TechLabel>
              <h3 className="mt-4 text-base font-semibold text-onnavy">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-onnavy-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SERVICES */}
      <Section>
        <SectionHead
          index="03"
          eyebrow="Services"
          title="Design, manufacturing and product management under one roof"
          intro="Seven service modules that carry an equipment programme from requirement to stabilised production."
        />
        <div className="mt-14 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.id}
              className="group relative bg-surface p-8 transition-colors duration-500 hover:bg-background"
            >
              <div className="flex items-center justify-between">
                <TechLabel tone="accent">{s.code}</TechLabel>
                <span className="h-px w-10 bg-line-strong transition-all duration-500 group-hover:w-16 group-hover:bg-accent" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.summary}</p>
              <ul className="mt-6 space-y-2">
                {s.points.slice(0, 3).map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-steel">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-12">
          <Btn to="/services" variant="outline">
            All Services
          </Btn>
        </div>
      </Section>

      {/* INDUSTRIES */}
      <Section tight className="border-y border-line bg-surface!">
        <SectionHead index="04" eyebrow="Industries" title="Where our equipment works" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind) => (
            <Link
              key={ind.id}
              to="/industries"
              className="group relative block overflow-hidden border border-line"
            >
              <img
                src={ind.image}
                alt={ind.name}
                loading="lazy"
                className="aspect-4/5 w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <TechLabel tone="accent">Industry</TechLabel>
                <h3 className="mt-2 text-base font-semibold text-onnavy">{ind.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* FEATURED PROJECTS */}
      <Section>
        <SectionHead
          index="05"
          eyebrow="Featured Projects"
          title="Selected equipment engineered and built"
          intro="Induction hardening machines, conveying systems, inspection handling and automation cells delivered for engineering and forging applications."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
        <div className="mt-12">
          <Btn to="/projects" variant="outline">
            View All Projects
          </Btn>
        </div>
      </Section>

      {/* NPI PROCESS */}
      <Section dark grid>
        <SectionHead
          index="06"
          eyebrow="New Product Introduction"
          title="A controlled route from concept to final manufacturing"
          intro="Design optimization, procurement and manufacturing setup challenges are identified and resolved before production release."
          dark
        />
        <ol className="mt-16 grid gap-px bg-onnavy/12 sm:grid-cols-2 lg:grid-cols-4">
          {NPI_STEPS.map((s, i) => (
            <li key={s.step} className="relative bg-navy p-7">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-medium text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-onnavy/15" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-onnavy">{s.step}</h3>
              <p className="mt-3 text-sm leading-relaxed text-onnavy-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* CAPABILITIES */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="relative order-2 border border-line lg:order-1">
            <img
              src={IMAGES.metrology}
              alt="Dimensional inspection of machined components"
              className="aspect-4/3 w-full object-cover"
            />
            <div className="absolute right-0 bottom-0 bg-navy px-6 py-4">
              <TechLabel tone="accent">Vertical Induction Hardening</TechLabel>
              <p className="mt-2 font-mono text-sm text-onnavy">250 kW · 5 KHz · Ø30–400 mm</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHead
              index="07"
              eyebrow="Machinery & Engineering Capabilities"
              title="Induction hardening, conveying, inspection and automation"
              intro="Machine categories we design, build, assemble and refurbish for engineering and process applications."
            />
            <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2">
              {[
                "Induction Hardening Machines",
                "Chain & Slat Conveyors",
                "Wire Mesh & Modular Belts",
                "Auto Loading / Unloading",
                "Inspection & Crack Detection",
                "Sorting & Accept-Reject",
                "Fixtures & Tooling",
                "Machine Assembly & Refurbishment",
              ].map((c) => (
                <li key={c} className="bg-surface px-5 py-4 text-sm font-medium text-steel">
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Btn to="/capabilities" variant="outline">
                Technical Capabilities
              </Btn>
            </div>
          </div>
        </div>
      </Section>

      {/* GALLERY */}
      <Section tight className="border-t border-line bg-surface!">
        <SectionHead index="08" eyebrow="Portfolio Gallery" title="From the shop floor" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryPreview.map((g) => (
            <figure key={g.id} className="group relative overflow-hidden border border-line">
              <img
                src={g.image}
                alt={g.title}
                loading="lazy"
                className="aspect-4/3 w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-navy/85 px-4 py-3 text-xs text-onnavy opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {g.title}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10">
          <Btn to="/gallery" variant="outline">
            Open Gallery
          </Btn>
        </div>
      </Section>

      {/* CLIENTS */}
      <Section tight>
        <div className="border border-line bg-surface px-8 py-12 text-center">
          <TechLabel tone="accent">Partners</TechLabel>
          <h2 className="mt-4 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {home.clientsHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Client names and programme details are confidential. Project details available on
            request.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-px bg-line sm:grid-cols-4">
            {["OEM", "Forging", "Automation", "Process"].map((t) => (
              <div key={t} className="bg-surface px-4 py-6">
                <span className="tech-label text-muted">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
