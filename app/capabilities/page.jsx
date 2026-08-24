"use client";

import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Btn, Reveal, SectionHead, TechLabel, Badge } from "@/components/site/ui";
import { CtaBand, PageHero, Section, SpecTable } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

const GROUPS = [
  {
    code: "C-01",
    title: "Induction Hardening Machines",
    body: "Vertical, horizontal, dual-spindle, and rotary induction hardening systems with custom quench rings, scanning axes, and automatic part transfer.",
    items: [
      "Vertical scanning machinery (up to 1500mm length)",
      "Horizontal tube hardening systems",
      "Dual spindle high-throughput configurations",
      "Rotary index table systems",
      "Crankshaft & camshaft hardening",
      "Automatic pneumatic & servo loading/unloading",
    ],
  },
  {
    code: "C-02",
    title: "Conveying & Material Handling",
    body: "Heavy-duty conveying systems engineered for hot forged billets, machined components, and automated transfer lines.",
    items: [
      "Forge-to-trim press heat-resistant chain conveyors",
      "Honeycomb stainless steel belt conveyors",
      "Wire mesh belt conveyors for quench tanks",
      "Slat & modular belt conveyors for assembly",
      "Automatic billet elevator loaders",
      "Gravity roller & powered transfer decks",
    ],
  },
  {
    code: "C-03",
    title: "Inspection & Automated Sorting",
    body: "Inline non-destructive testing (NDT) integration with high-speed reject segregation mechanisms built directly into production lines.",
    items: [
      "Eddy current surface crack detection integration",
      "Ultrasonic testing (UT) component handling",
      "Pneumatic high-speed accept/reject sorting gates",
      "Multi-channel dimensional gauging fixtures",
      "Optical vision system mounting & inspection stations",
      "Data logging & SPC parameter capture",
    ],
  },
  {
    code: "C-04",
    title: "Automation Cells & Custom Tooling",
    body: "Dedicated robotic and pneumatic cells that eliminate manual handling in dangerous, high-heat, and repetitive operations.",
    items: [
      "Pick and place gantry & Cartesian handling",
      "Forging press loading/unloading automation",
      "Precision bearing press-fit fixtures",
      "Hydraulic cutters for laminates & composites",
      "Clamping, welding, and assembly jigs",
      "Interlocked safety fencing & light curtain integration",
    ],
  },
  {
    code: "C-05",
    title: "Machine Building & Refurbishment",
    body: "Complete assembly, geometric realignment, scraping, retrofit, and modernisation of production machine tools.",
    items: [
      "Special Purpose Machine (SPM) new build assembly",
      "Lathe machine complete assembly & testing",
      "Cylindrical & surface grinder refurbishment",
      "HMC & VMC maintenance and slideway alignment",
      "PLC, CNC controller, and drive retrofits",
      "On-site installation and laser calibration support",
    ],
  },
];

export default function CapabilitiesPage() {
  const { projects } = useSite();
  const inductionMachines = projects.filter((p) => p.category === "Induction Hardening");

  return (
    <>
      <PageHero
        index="05"
        eyebrow="Technical Capabilities"
        title="Engineering capability, stated in verified specifications."
        intro="The technical parameters below are drawn directly from our delivered equipment programmes in Pune. Custom parameters and tooling geometries are engineered on demand."
        image={IMAGES.pageCapabilities}
        action={
          <div className="flex flex-wrap gap-4">
            <Btn to="/contact" variant="primary">
              Discuss Technical Specs
            </Btn>
            <Btn to="/projects" variant="light">
              View Case Studies
            </Btn>
          </div>
        }
      />

      {/* INDUCTION SPEC CARDS */}
      <Section grid>
        <InView>
          <SectionHead
            index="5.1"
            eyebrow="Machine Engineering"
            title="Induction Hardening Machine Specifications"
            intro="Induction hardening machines engineered, built, and commissioned for shaft, tube, pin, and crankshaft applications with precision heating and quench cycles."
          />
        </InView>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {inductionMachines.map((m, i) => (
            <InView key={m.id} delay={Math.min(i, 3) * 90}>
              <article className="corner-marks h-full border border-line bg-surface p-8 transition-all duration-400 hover:border-accent hover:shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <Badge variant="accent">{`IH-0${i + 1}`}</Badge>
                    <span className="tech-label text-muted">{m.industry}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl leading-snug font-bold text-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-muted">{m.short}</p>
                  
                  <div className="mt-6 border-t border-line pt-4 bg-surface-soft p-4 rounded-sm">
                    <TechLabel tone="dark">Technical Parameters</TechLabel>
                    <div className="mt-2">
                      <SpecTable specs={m.specs} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                  <Btn to={`/projects/${m.id}`} variant="outline" className="text-xs py-2.5">
                    View Project Record →
                  </Btn>
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
            eyebrow="Scope Map"
            title="What We Design, Build, and Commission"
            intro="Five core technical domains covering machinery, material handling, tooling, and refurbishment."
          />
        </InView>

        <div className="mt-14 grid gap-px bg-onnavy/12 md:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g, i) => (
            <InView key={g.code} delay={Math.min(i, 3) * 90} className="bg-navy">
              <div className="h-full p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-accent font-bold">{g.code}</span>
                    <Badge variant="navy">Domain</Badge>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-onnavy">{g.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-onnavy-muted">{g.body}</p>
                  
                  <ul className="mt-6 space-y-2.5">
                    {g.items.map((it) => (
                      <li key={it} className="flex gap-2.5 text-xs text-onnavy-muted items-start">
                        <span className="mt-1.5 h-1 w-1 shrink-0 bg-accent rounded-full" />
                        <span className="leading-relaxed">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* METROLOGY & QUALITY VERIFICATION */}
      <Section grid>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <InView>
            <figure className="corner-marks relative aspect-[4/3] overflow-hidden border border-line bg-navy shadow-xl">
              <img
                src={IMAGES.metrology}
                alt="Dimensional inspection and metrology of machined components"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60" />
              <figcaption className="absolute bottom-4 left-4">
                <Badge variant="accent">Metrology Bay • Pune</Badge>
              </figcaption>
            </figure>
          </InView>

          <InView delay={120}>
            <SectionHead
              index="5.3"
              eyebrow="Quality Assurance"
              title="Measured, trialled, and verified prior to handover"
              intro="All machinery undergo rigorous FAT (Factory Acceptance Testing) with customer production parts. Setup parameters, cycle times, heating depth, and tolerances are proven on our shop floor before dispatch."
            />
            
            <div className="mt-8 space-y-4">
              <div className="border border-line bg-surface p-5">
                <h4 className="font-semibold text-foreground text-sm">Dimensional & Runout Inspection</h4>
                <p className="mt-1 text-xs text-muted">Precision dial indicators and micrometer calibration verifying tolerances within 0.005mm.</p>
              </div>
              <div className="border border-line bg-surface p-5">
                <h4 className="font-semibold text-foreground text-sm">Hardness Testing & Case Depth Verification</h4>
                <p className="mt-1 text-xs text-muted">Hardness profiling (HRC / HV) confirming thermal transition zones adhere strictly to drawing requirements.</p>
              </div>
            </div>

            <div className="mt-8">
              <Btn to="/contact" variant="primary">
                Consult With QA Lead
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
