"use client";

import { IMAGES } from "@/data/images";
import { WORKFLOW } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Reveal, SectionHead, TechLabel, Btn, Badge } from "@/components/site/ui";
import { CtaBand, PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

export default function ServicesPage() {
  const { services } = useSite();

  return (
    <>
      <PageHero
        index="02"
        eyebrow="Service Lines"
        title="From engineering intent to a stabilised, repeatable build."
        intro="Seven connected service lines that cover the complete lifecycle of an industrial equipment programme — available individually or as one turnkey scope."
        image={IMAGES.pageServices}
        action={
          <div className="flex flex-wrap gap-4">
            <Btn to="/contact" variant="primary">
              Enquire for Service Scope
            </Btn>
            <Btn to="/projects" variant="light">
              See Delivered Builds
            </Btn>
          </div>
        }
      />

      {/* WORKFLOW STRIP */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-[1320px] px-6 sm:px-8 lg:px-12">
          <ol className="flex flex-wrap items-center gap-x-4 gap-y-3 py-6">
            {WORKFLOW.map((w, i) => (
              <li key={w} className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-accent">0{i + 1}</span>
                <span className="tech-label text-foreground">{w}</span>
                {i < WORKFLOW.length - 1 && <span className="h-px w-6 bg-line-strong" />}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* SERVICE LIST DEEP DIVE */}
      <Section grid>
        <InView>
          <SectionHead
            index="2.1"
            eyebrow="Specialised Scopes"
            title="Comprehensive Engineering Services"
            intro="Each service line is delivered by the same multidisciplinary team that builds and tests the equipment in Pune."
          />
        </InView>

        <div className="mt-16 space-y-12">
          {services.map((s, i) => (
            <InView key={s.id} delay={Math.min(i, 4) * 70}>
              <article className="card-soft corner-marks grid gap-8 p-8 lg:grid-cols-12 lg:gap-12 items-start">
                <div className="lg:col-span-1">
                  <span className="font-mono text-2xl font-bold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="lg:col-span-4">
                  <Badge variant="accent">Service Line</Badge>
                  <h3 className="mt-3 font-display text-2xl leading-tight font-bold text-foreground">
                    {s.title}
                  </h3>
                  <div className="mt-4 h-0.5 w-12 bg-accent" />
                  <p className="mt-4 text-sm leading-relaxed text-muted">{s.summary}</p>
                </div>

                <div className="lg:col-span-4">
                  <TechLabel tone="dark">Key Deliverables & Scope</TechLabel>
                  <ul className="mt-4 space-y-2.5">
                    {s.points.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-foreground">
                        <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 bg-accent rounded-full" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-3">
                  <div className="border border-line bg-surface-soft p-6">
                    <TechLabel tone="accent">Expected Outcome</TechLabel>
                    <p className="mt-3 text-xs leading-relaxed text-muted font-medium">{s.outcome}</p>
                    <div className="mt-6 pt-4 border-t border-line">
                      <Btn to="/contact" variant="outline" className="w-full text-center text-xs py-2.5">
                        Discuss Scope
                      </Btn>
                    </div>
                  </div>
                </div>
              </article>
            </InView>
          ))}
        </div>
      </Section>

      {/* ENGAGEMENT MODELS COMPARISON */}
      <Section dark tight grid>
        <InView>
          <SectionHead
            dark
            index="2.2"
            eyebrow="Engagement Matrix"
            title="Three Flexible Ways to Partner With Us"
            intro="Tailor our involvement to your internal capacity and project requirements."
          />
        </InView>

        <div className="mt-14 grid gap-px bg-onnavy/12 md:grid-cols-3">
          {[
            {
              t: "Design & Detailing Only",
              badge: "ENGINEERING",
              b: "Concept development, 3D CAD modeling, FEA simulation, BOM and complete 2D manufacturing drawings released to your own manufacturing network.",
              features: ["3D Assembly Models", "2D Manufacturing Drawings", "Detailed BOM & Part Specs", "FEA Structural Analysis"],
            },
            {
              t: "Build to Print",
              badge: "FABRICATION & ASSEMBLY",
              b: "You supply the design drawing package; we manage precision raw material procurement, machining, welding, electrical integration, and shop-floor assembly.",
              features: ["Procurement & Sourcing", "VMC / CNC Machining", "Assembly & Wiring", "Dimension Verification"],
            },
            {
              t: "Full Turnkey Programme",
              badge: "END-TO-END TURNKEY",
              b: "Complete single-point responsibility from initial design and sourcing through machining, assembly, PLC automation, commissioning, and repeat-build stabilisation.",
              features: ["Single-Point Accountability", "Custom Tooling & Coils", "Full Trials & Metrology", "On-site Commissioning"],
            },
          ].map((m, i) => (
            <InView key={m.t} delay={i * 110} className="bg-navy">
              <div className="h-full p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="tech-label text-accent">{`0${i + 1}`}</span>
                    <Badge variant="navy">{m.badge}</Badge>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-onnavy">{m.t}</h3>
                  <p className="mt-4 text-xs leading-relaxed text-onnavy-muted">{m.b}</p>
                  
                  <div className="mt-6 pt-4 border-t border-onnavy/10">
                    <TechLabel tone="light">Includes</TechLabel>
                    <ul className="mt-3 space-y-2 text-xs text-onnavy-muted">
                      {m.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <span className="h-1 w-1 bg-accent rounded-full" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-onnavy/10">
                  <Btn to="/contact" variant="light" className="w-full text-center text-xs">
                    Choose Model
                  </Btn>
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
