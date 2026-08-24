"use client";

import { IMAGES } from "@/data/images";
import { NPI_STEPS, WHY_POINTS, WORKFLOW } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Container, Reveal, SectionHead, TechLabel, Btn, Rule, Badge } from "@/components/site/ui";
import { CtaBand, PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

export default function AboutPage() {
  const { company, industries } = useSite();

  return (
    <>
      <PageHero
        index="01"
        eyebrow="Company Profile"
        title="Engineering partner to global OEMs, built around design and manufacturing."
        intro={company.positioning}
        image={IMAGES.pageAbout}
        action={
          <div className="flex flex-wrap gap-4">
            <Btn to="/contact" variant="primary">
              Contact Engineering Team
            </Btn>
            <Btn to="/capabilities" variant="light">
              Machine Capabilities
            </Btn>
          </div>
        }
      />

      {/* INTRODUCTION & INFRASTRUCTURE */}
      <Section grid>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <InView>
              <SectionHead
                index="1.1"
                eyebrow="Company Overview"
                title="A design engineering house with shop-floor manufacturing depth"
              />
              <p className="mt-7 text-base leading-relaxed text-muted sm:text-lg">
                {company.description}
              </p>
              <p className="mt-5 text-base leading-relaxed text-muted">
                We work alongside OEM engineering teams on equipment programmes — reviewing intent,
                developing the 3D design, procuring verified components, and manufacturing the custom machine.
                Because design and fabrication sit in the same Pune facility, drawings are validated by the people
                who assemble and trial the equipment.
              </p>
            </InView>

            {/* Core Pillars */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <div className="card-soft p-6">
                <Badge variant="accent">Pillar 01</Badge>
                <h4 className="mt-3 font-display text-lg font-bold text-foreground">Design for Manufacturing (DFM)</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted">Every CAD model is optimized for machining setups, raw material standard sizes, and fast maintenance.</p>
              </div>
              <div className="card-soft p-6">
                <Badge variant="navy">Pillar 02</Badge>
                <h4 className="mt-3 font-display text-lg font-bold text-foreground">Turnkey Single-Point</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted">Single-source responsibility covering mechanical, electrical controls, PLC programming, and commissioning.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <InView delay={120}>
              <div className="corner-marks border border-line bg-surface p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <TechLabel tone="accent">Registered Facility</TechLabel>
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground font-medium">{company.address}</p>
                
                <div className="my-6 hairline-top" />
                
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="tech-label text-muted">Key Contact</dt>
                    <dd className="mt-1 font-semibold text-foreground">{company.contactPerson}</dd>
                  </div>
                  <div>
                    <dt className="tech-label text-muted">Direct Phone</dt>
                    <dd className="mt-1 font-mono text-accent">{company.phone}</dd>
                  </div>
                  <div>
                    <dt className="tech-label text-muted">Official Email</dt>
                    <dd className="mt-1 font-mono break-all text-foreground">{company.email}</dd>
                  </div>
                  <div>
                    <dt className="tech-label text-muted">Operating Base</dt>
                    <dd className="mt-1 font-mono text-muted text-xs">Dehu Gaon, TQ Haveli, Pune - 412109</dd>
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
            { label: "Vision", body: company.vision, index: "1.2", tag: "LONG-TERM OBJECTIVE" },
            { label: "Mission", body: company.mission, index: "1.3", tag: "CORE COMMITMENT" },
          ].map((v, i) => (
            <InView key={v.label} delay={i * 120} className="bg-navy">
              <div className="h-full px-8 py-12 sm:px-12 sm:py-16 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="tech-label text-accent">{v.index}</span>
                      <span className="h-px w-8 bg-accent" />
                      <TechLabel tone="light">{v.label}</TechLabel>
                    </div>
                    <Badge variant="navy">{v.tag}</Badge>
                  </div>
                  <p className="mt-8 font-display text-xl leading-[1.35] font-semibold text-onnavy sm:text-2xl">
                    “{v.body}”
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-onnavy/10 text-xs font-mono text-onnavy-muted">
                  THREE STAR ENTERPRISES • QUALITY ASSURED
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* 5-STAGE WORKFLOW */}
      <Section>
        <InView>
          <SectionHead
            index="1.4"
            eyebrow="Workflow Protocol"
            title="Design → Sourcing → Manufacturing → Management → Delivery"
            intro="One controlled route from engineering intent to a stabilised, repeatable build — with a single point of coordination throughout."
          />
        </InView>
        <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
          {WORKFLOW.map((w, i) => (
            <InView key={w} delay={i * 90} className="bg-surface">
              <div className="group h-full p-8 transition-colors duration-400 hover:bg-background">
                <span className="font-mono text-2xl font-bold text-accent">{`0${i + 1}`}</span>
                <h3 className="mt-4 text-base font-bold text-foreground">{w}</h3>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  Phase {i + 1} validation and stage-gate approval before release to the next stage.
                </p>
                <div className="mt-5 h-px w-8 bg-line-strong transition-all duration-400 group-hover:w-full group-hover:bg-accent" />
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* NPI METHODOLOGY */}
      <Section dark tight grid>
        <InView>
          <SectionHead
            dark
            index="1.5"
            eyebrow="NPI Engineering"
            title="New Product Introduction (NPI) Step-by-Step"
            intro="Our NPI process systematically eliminates risk before production begins — verifying part fitment, tool access, cycle times, and quench parameters."
          />
        </InView>
        <ol className="mt-14 grid gap-px bg-onnavy/12 md:grid-cols-2 xl:grid-cols-4">
          {NPI_STEPS.map((s, i) => (
            <InView key={s.step} delay={(i % 4) * 90} className="bg-navy">
              <li className="h-full p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-lg font-bold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Badge variant="navy">Step</Badge>
                  </div>
                  <h3 className="mt-5 text-base leading-snug font-bold text-onnavy">
                    {s.step}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-onnavy-muted">{s.body}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-onnavy/10 font-mono text-[0.65rem] text-accent">
                  MILESTONE 0{i + 1}
                </div>
              </li>
            </InView>
          ))}
        </ol>
      </Section>

      {/* WHY OEMS WORK WITH US */}
      <Section>
        <InView>
          <SectionHead
            index="1.6"
            eyebrow="Value Proposition"
            title="Why global OEMs partner with Three Star Enterprises"
            intro="Engineering support that carries seamlessly from design through machine trials and repeat builds."
          />
        </InView>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY_POINTS.map((w, i) => (
            <InView key={w.title} delay={(i % 3) * 100}>
              <div className="card-soft h-full p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xl font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-lg leading-snug font-bold text-foreground">
                    {w.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{w.body}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-line text-xs font-mono text-accent">
                  PROVEN OEM BENEFIT
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* CLOSING CTA */}
      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
