import { createFileRoute } from "@tanstack/react-router";
import { IMAGES } from "@/data/images";
import { NPI_STEPS, WHY_POINTS, WORKFLOW } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Container, Reveal, SectionHead, TechLabel, Btn, Rule } from "@/components/site/ui";
import { CtaBand, PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Three Star Enterprises | Design & Manufacturing for OEMs" },
      {
        name: "description",
        content:
          "Three Star Enterprises is a Pune-based design and manufacturing company supporting global OEMs with design engineering, turnkey manufacturing, NPI and product management.",
      },
      { property: "og:title", content: "About Three Star Enterprises" },
      {
        property: "og:description",
        content:
          "Our engineering philosophy, NPI approach and design-to-manufacturing workflow for global OEM equipment programmes.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});
function About() {
  const { company, industries } = useSite();
  return (
    <>
      <PageHero
        index="01"
        eyebrow="About the company"
        title="Engineering partner to global OEMs, built around design and manufacturing."
        intro={company.positioning}
        image={IMAGES.pageAbout}
      />

      {/* INTRODUCTION */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <InView>
              <SectionHead
                index="1.1"
                eyebrow="Company introduction"
                title="A design services company with manufacturing depth"
              />
              <p className="mt-7 text-base leading-relaxed text-muted sm:text-[1.05rem]">
                {company.description}
              </p>
              <p className="mt-5 text-base leading-relaxed text-muted">
                We work alongside OEM engineering teams on equipment programmes — reviewing intent,
                developing the design, sourcing the content and building the machine. Because design
                and manufacturing sit together, drawings are validated by the people who make the
                equipment.
              </p>
            </InView>
          </div>
          <div className="lg:col-span-5">
            <InView delay={120}>
              <div className="corner-marks border border-line bg-surface p-8">
                <TechLabel tone="accent">Registered office</TechLabel>
                <p className="mt-5 text-sm leading-relaxed text-foreground">{company.address}</p>
                <div className="my-6 hairline-top" />
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="tech-label text-muted">Contact person</dt>
                    <dd className="mt-1 font-medium text-foreground">{company.contactPerson}</dd>
                  </div>
                  <div>
                    <dt className="tech-label text-muted">Phone</dt>
                    <dd className="mt-1 font-mono text-foreground">{company.phone}</dd>
                  </div>
                  <div>
                    <dt className="tech-label text-muted">Email</dt>
                    <dd className="mt-1 font-mono break-all text-foreground">{company.email}</dd>
                  </div>
                </dl>
              </div>
            </InView>
          </div>
        </div>
      </Section>

      {/* VISION / MISSION */}
      <Section dark grid tight>
        <div className="grid gap-px bg-onnavy/12 lg:grid-cols-2">
          {[
            { label: "Vision", body: company.vision, index: "1.2" },
            { label: "Mission", body: company.mission, index: "1.3" },
          ].map((v, i) => (
            <InView key={v.label} delay={i * 120} className="bg-navy">
              <div className="h-full px-8 py-12 sm:px-12 sm:py-16">
                <div className="flex items-center gap-3">
                  <span className="tech-label text-accent">{v.index}</span>
                  <span className="h-px w-8 bg-accent" />
                  <TechLabel tone="light">{v.label}</TechLabel>
                </div>
                <p className="mt-7 font-display text-xl leading-[1.35] font-medium text-onnavy sm:text-2xl">
                  “{v.body}”
                </p>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* APPROACH / WORKFLOW */}
      <Section>
        <InView>
          <SectionHead
            index="1.4"
            eyebrow="Our approach"
            title="Design → Procurement → Manufacturing → Product Management → Delivery"
            intro="One controlled route from engineering intent to a stabilised, repeatable build — with a single point of coordination throughout."
          />
        </InView>
        <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
          {WORKFLOW.map((w, i) => (
            <InView key={w} delay={i * 90} className="bg-surface">
              <div className="group h-full px-6 py-8 transition-colors duration-500 hover:bg-background">
                <span className="tech-label text-accent">{`0${i + 1}`}</span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{w}</h3>
                <div className="mt-5 h-px w-8 bg-line-strong transition-all duration-500 group-hover:w-16 group-hover:bg-accent" />
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* ENGINEERING PHILOSOPHY */}
      <Section tight className="border-y border-line bg-surface">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <InView>
              <SectionHead
                index="1.5"
                eyebrow="Engineering philosophy"
                title="Decisions taken early, on the drawing board"
              />
            </InView>
          </div>
          <div className="lg:col-span-7">
            <InView delay={120}>
              <div className="space-y-8">
                {[
                  {
                    t: "Design for the shop floor",
                    b: "Every design is reviewed for manufacturability, standardisation and assembly before release, so the build does not discover problems.",
                  },
                  {
                    t: "Resolve risk before production",
                    b: "Sourcing, setup and process risks are identified during NPI rather than during manufacturing, where correction is expensive.",
                  },
                  {
                    t: "Stabilise, then repeat",
                    b: "Trials and fine tuning continue until the process runs repeatably, and the stabilised build is documented for repeat manufacturing.",
                  },
                ].map((p) => (
                  <div
                    key={p.t}
                    className="border-l border-line-strong pl-6 transition-colors duration-500 hover:border-accent"
                  >
                    <h3 className="text-lg font-semibold text-foreground">{p.t}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{p.b}</p>
                  </div>
                ))}
              </div>
            </InView>
          </div>
        </div>
      </Section>

      {/* NPI APPROACH */}
      <Section grid>
        <InView>
          <SectionHead
            index="1.6"
            eyebrow="NPI approach"
            title="New Product Introduction, step by step"
            intro="Our NPI process identifies and resolves challenges related to design optimization, procurement and manufacturing setups."
          />
        </InView>
        <ol className="mt-14 grid gap-px bg-line md:grid-cols-2 xl:grid-cols-4">
          {NPI_STEPS.map((s, i) => (
            <InView key={s.step} delay={(i % 4) * 90} className="bg-surface">
              <li className="h-full px-7 py-9">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-sm font-medium text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="tech-label text-line-strong">Step</span>
                </div>
                <h3 className="mt-5 text-base leading-snug font-semibold text-foreground">
                  {s.step}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            </InView>
          ))}
        </ol>
      </Section>

      {/* INDUSTRIES SERVED */}
      <Section tight className="border-t border-line bg-surface">
        <InView>
          <SectionHead index="1.7" eyebrow="Industries served" title="Where our equipment works" />
        </InView>
        <InView delay={120}>
          <ul className="mt-10 flex flex-wrap gap-3">
            {industries.map((ind) => (
              <li
                key={ind.id}
                className="border border-line px-5 py-3 text-sm font-medium text-foreground transition-all duration-400 hover:border-accent hover:text-accent"
              >
                {ind.name}
              </li>
            ))}
          </ul>
        </InView>
        <div className="mt-10">
          <Rule />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Btn to="/industries" variant="outline">
              Explore Industries
            </Btn>
            <Btn to="/capabilities" variant="ghost">
              Technical Capabilities
            </Btn>
          </div>
        </div>
      </Section>

      {/* WHY OEMS WORK WITH US */}
      <Section>
        <InView>
          <SectionHead
            index="1.8"
            eyebrow="Why OEMs work with us"
            title="Engineering support that carries through to the build"
          />
        </InView>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY_POINTS.map((w, i) => (
            <InView key={w.title} delay={(i % 3) * 100}>
              <div className="card-soft h-full p-7">
                <span className="tech-label text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-base leading-snug font-semibold text-foreground">
                  {w.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{w.body}</p>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      <Container className="pb-4">
        <p className="text-xs text-muted">Project details available on request.</p>
      </Container>

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
