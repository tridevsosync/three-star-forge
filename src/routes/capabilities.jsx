import { createFileRoute } from "@tanstack/react-router";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Btn, Reveal, SectionHead, TechLabel } from "@/components/site/ui";
import { CtaBand, PageHero, Section, SpecTable } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
export const Route = createFileRoute("/capabilities")({
  head: () => ({
    meta: [
      { title: "Technical Capabilities — Induction Hardening & Automation | Three Star" },
      {
        name: "description",
        content:
          "Induction hardening machine capability, conveying and handling systems, inspection and sorting, fixtures, machine assembly and refurbishment — with specifications as supplied.",
      },
      { property: "og:title", content: "Engineering Capabilities — Three Star Enterprises" },
      {
        property: "og:description",
        content:
          "Specification cards for induction hardening machines, automation, material handling, inspection and machine building capability.",
      },
      { property: "og:url", content: "/capabilities" },
    ],
    links: [{ rel: "canonical", href: "/capabilities" }],
  }),
  component: Capabilities,
});
const GROUPS = [
  {
    code: "C-01",
    title: "Induction Hardening Machines",
    body: "Vertical, horizontal, dual spindle and rotary induction hardening machines with quench systems, scanning axes and handling options.",
    items: [
      "Vertical scanning machines",
      "Horizontal tube hardening",
      "Dual spindle configurations",
      "Rotary index machines",
      "Crank shaft hardening",
      "Automatic loading / unloading",
    ],
  },
  {
    code: "C-02",
    title: "Conveying & Material Handling",
    body: "Conveying systems built for hot and cold components across forging, machining and assembly lines.",
    items: [
      "Forge-to-trim press chain conveyor",
      "Honeycomb belt conveyor",
      "Wire mesh belt conveyor",
      "Slat conveyor",
      "Modular belt conveyor",
      "Auto billet loader",
    ],
  },
  {
    code: "C-03",
    title: "Inspection & Sorting",
    body: "Inspection integration and part segregation built into the equipment flow rather than added afterwards.",
    items: [
      "Eddy current surface crack detection",
      "Ultrasonic testing handling systems",
      "Accept-reject devices",
      "Sorting systems",
      "Dimensional verification setups",
      "Inspection station integration",
    ],
  },
  {
    code: "C-04",
    title: "Automation Cells & Fixtures",
    body: "Automation and tooling that removes manual intervention from repetitive and hazardous operations.",
    items: [
      "Pick and place systems",
      "Forging automation handling",
      "Bearing fixtures",
      "Cutter for laminates",
      "Special purpose tooling",
      "Guarding and safety integration",
    ],
  },
  {
    code: "C-05",
    title: "Machine Building & Refurbishment",
    body: "Assembly, refurbishment and maintenance of production machinery, carried out by the same team that engineers new builds.",
    items: [
      "New machine assembly",
      "Lathe machine assembly work",
      "Grinding machine refurbishment",
      "HMC machine maintenance",
      "Retrofit and upgrade work",
      "Commissioning support",
    ],
  },
];
function Capabilities() {
  const { projects } = useSite();
  const inductionMachines = projects.filter((p) => p.category === "Induction Hardening");
  return (
    <>
      <PageHero
        index="05"
        eyebrow="Capabilities"
        title="Technical capability, stated in specifications rather than adjectives."
        intro="The values below are taken directly from our company presentation and are shown unchanged. Anything not listed is available on request."
        image={IMAGES.pageCapabilities}
      />

      {/* INDUCTION SPEC CARDS */}
      <Section grid>
        <InView>
          <SectionHead
            index="5.1"
            eyebrow="Induction hardening"
            title="Machine specifications"
            intro="Induction hardening machines engineered, built and commissioned for shaft, tube, pin and crank shaft applications."
          />
        </InView>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {inductionMachines.map((m, i) => (
            <InView key={m.id} delay={Math.min(i, 3) * 90}>
              <article className="corner-marks h-full border border-line bg-surface p-8 transition-all duration-500 hover:border-accent/60 hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.3)]">
                <div className="flex items-baseline justify-between gap-4">
                  <TechLabel tone="accent">{`IH-${String(i + 1).padStart(2, "0")}`}</TechLabel>
                  <TechLabel>{m.industry}</TechLabel>
                </div>
                <h3 className="mt-4 font-display text-xl leading-snug font-semibold text-foreground">
                  {m.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{m.short}</p>
                <div className="mt-6 border-t border-line pt-2">
                  <SpecTable specs={m.specs} />
                </div>
              </article>
            </InView>
          ))}
        </div>
      </Section>

      {/* CAPABILITY GROUPS */}
      <Section dark grid>
        <InView>
          <SectionHead
            dark
            index="5.2"
            eyebrow="Capability map"
            title="What we can design, build and commission"
          />
        </InView>

        <div className="mt-14 grid gap-px bg-onnavy/12 md:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g, i) => (
            <InView key={g.code} delay={Math.min(i, 3) * 90} className="bg-navy">
              <div className="h-full px-8 py-10">
                <span className="tech-label text-accent">{g.code}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-onnavy">{g.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-onnavy/70">{g.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-3 text-sm text-onnavy/85">
                      <span className="mt-[0.55rem] h-1 w-1 shrink-0 bg-accent" />
                      <span className="leading-relaxed">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </InView>
          ))}
        </div>

        <InView delay={200}>
          <div className="mt-12 flex flex-wrap gap-4">
            <Btn to="/projects" variant="light">
              See these in the portfolio
            </Btn>
          </div>
        </InView>
      </Section>

      {/* METROLOGY */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <InView>
            <figure className="corner-marks relative aspect-[4/3] overflow-hidden border border-line">
              <img
                src={IMAGES.metrology}
                alt="Dimensional inspection and metrology of machined components"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.04]"
              />
            </figure>
          </InView>
          <InView delay={120}>
            <SectionHead
              index="5.3"
              eyebrow="Verification"
              title="Measured, trialled and only then released"
              intro="Equipment is dimensionally verified and trialled with the customer's own components wherever possible, so setup parameters are proven before handover."
            />
            <div className="mt-8">
              <Btn to="/contact" variant="outline">
                Talk to our team
              </Btn>
            </div>
          </InView>
        </div>
      </Section>

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
