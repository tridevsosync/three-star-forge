import { createFileRoute } from "@tanstack/react-router";
import { IMAGES } from "@/data/images";
import { WORKFLOW } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Reveal, SectionHead, TechLabel, Btn } from "@/components/site/ui";
import { CtaBand, PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Design, Manufacturing & NPI | Three Star Enterprises" },
      {
        name: "description",
        content:
          "Design engineering, turnkey manufacturing, procurement, NPI, product management, retrofits and technical documentation for OEM equipment programmes.",
      },
      { property: "og:title", content: "Engineering Services — Three Star Enterprises" },
      {
        property: "og:description",
        content:
          "End-to-end services from concept design and sourcing through manufacturing, commissioning and repeat-build stabilisation.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  const { services } = useSite();

  return (
    <>
      <PageHero
        index="02"
        eyebrow="Services"
        title="From engineering intent to a stabilised, repeatable build."
        intro="Seven connected service lines that cover the full route of an equipment programme — used individually or as one turnkey scope."
        image={IMAGES.pageServices}
      />

      {/* WORKFLOW STRIP */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-[1320px] px-6 sm:px-8 lg:px-12">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 py-6">
            {WORKFLOW.map((w, i) => (
              <li key={w} className="flex items-center gap-3">
                <span className="tech-label text-muted">{w}</span>
                {i < WORKFLOW.length - 1 && <span className="h-px w-6 bg-line-strong" />}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* SERVICE LIST */}
      <Section>
        <InView>
          <SectionHead
            index="2.1"
            eyebrow="What we do"
            title="Service lines"
            intro="Each service is delivered by the same team that builds the equipment, so decisions hold from drawing to dispatch."
          />
        </InView>

        <div className="mt-16 space-y-px bg-line">
          {services.map((s, i) => (
            <InView key={s.id} delay={Math.min(i, 4) * 70} className="bg-background">
              <article className="group grid gap-8 px-1 py-12 transition-colors duration-500 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-1">
                  <span className="font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="lg:col-span-4">
                  <h3 className="font-display text-2xl leading-tight font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <div className="mt-4 h-px w-10 bg-line-strong transition-all duration-500 group-hover:w-20 group-hover:bg-accent" />
                  <p className="mt-5 text-sm leading-relaxed text-muted">{s.summary}</p>
                </div>
                <div className="lg:col-span-4">
                  <TechLabel>Scope</TechLabel>
                  <ul className="mt-4 space-y-2.5">
                    {s.points.map((item: string) => (
                      <li key={item} className="flex gap-3 text-sm text-foreground">
                        <span className="mt-[0.55rem] h-1 w-1 shrink-0 bg-accent" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:col-span-3">
                  <div className="border border-line bg-surface p-6">
                    <TechLabel tone="accent">Outcome</TechLabel>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{s.outcome}</p>
                  </div>
                </div>
              </article>
            </InView>
          ))}
        </div>
      </Section>

      {/* ENGAGEMENT MODELS */}
      <Section dark tight>
        <InView>
          <SectionHead
            dark
            index="2.2"
            eyebrow="Engagement"
            title="Three ways to bring us into a programme"
          />
        </InView>
        <div className="mt-14 grid gap-px bg-onnavy/12 md:grid-cols-3">
          {[
            {
              t: "Design only",
              b: "Concept development, detailing, BOM and manufacturing drawings released to your own supply chain.",
            },
            {
              t: "Build to print",
              b: "You provide the drawings; we handle sourcing, fabrication, machining, assembly and testing.",
            },
            {
              t: "Turnkey programme",
              b: "Single-point responsibility from design and procurement through manufacturing, commissioning and repeat builds.",
            },
          ].map((m, i) => (
            <InView key={m.t} delay={i * 110} className="bg-navy">
              <div className="h-full px-8 py-11">
                <span className="tech-label text-accent">{`0${i + 1}`}</span>
                <h3 className="mt-4 font-display text-xl font-semibold text-onnavy">{m.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-onnavy/70">{m.b}</p>
              </div>
            </InView>
          ))}
        </div>
        <InView delay={200}>
          <div className="mt-12 flex flex-wrap gap-4">
            <Btn to="/contact" variant="primary">
              Discuss a requirement
            </Btn>
            <Btn to="/projects" variant="light">
              See delivered projects
            </Btn>
          </div>
        </InView>
      </Section>

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
