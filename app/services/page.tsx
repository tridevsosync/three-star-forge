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
        eyebrow="What We Do"
        title="Custom Machine Design, Manufacturing & Automation"
        intro="We provide end-to-end engineering support. You can hire us for 3D design only, have us build a machine to your drawings, or let us manage the entire build from concept to delivery."
        image={IMAGES.pageServices}
        action={
          <div className="flex flex-wrap gap-4">
            <Btn to="/quote" variant="primary">
              Get a Project Quote
            </Btn>
            <Btn to="/projects" variant="light">
              See Machines We Built
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
                <span className="tech-label text-foreground">{w.replace(/^\d+\.\s*/, '')}</span>
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
            eyebrow="Our Services"
            title="Comprehensive Machine Building & Engineering"
            intro="Every service is carried out directly by our skilled team in Pune who designs, cuts, machines, and tests the equipment."
          />
        </InView>

        <div className="mt-16 space-y-12">
          {services.map((s, i) => (
            <InView key={s.id} delay={Math.min(i, 4) * 70}>
              <article className="card-soft corner-marks grid gap-8 p-8 lg:grid-cols-12 lg:gap-12 items-start min-w-0">
                <div className="lg:col-span-1">
                  <span className="font-mono text-2xl font-bold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="lg:col-span-4 min-w-0">
                  <Badge variant="accent">Service Line</Badge>
                  <h3 className="mt-3 font-display text-2xl leading-tight font-bold text-foreground break-words">
                    {s.title}
                  </h3>
                  <div className="mt-4 h-0.5 w-12 bg-accent" />
                  <p className="mt-4 text-sm leading-relaxed text-muted break-words">{s.summary}</p>
                </div>

                <div className="lg:col-span-4 min-w-0">
                  <TechLabel tone="dark">What's Included</TechLabel>
                  <ul className="mt-4 space-y-2.5 min-w-0">
                    {s.points.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-foreground min-w-0 items-start">
                        <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 bg-accent rounded-full" />
                        <span className="leading-relaxed break-words min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-3 min-w-0">
                  <div className="border border-line bg-surface-soft p-6 min-w-0">
                    <TechLabel tone="accent">What You Get</TechLabel>
                    <p className="mt-3 text-xs leading-relaxed text-muted font-medium break-words">{s.outcome}</p>
                    <div className="mt-6 pt-4 border-t border-line">
                      <Btn to="/quote" variant="outline" className="w-full text-center text-xs py-2.5">
                        Ask for Pricing
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
            eyebrow="How to Work With Us"
            title="3 Simple Ways to Partner on Your Project"
            intro="Choose the engagement model that fits your internal team and project budget best."
          />
        </InView>

        <div className="mt-14 grid gap-px bg-onnavy/12 md:grid-cols-3">
          {[
            {
              t: "1. 3D Design & Blueprints Only",
              badge: "DESIGN ONLY",
              b: "We create full 3D CAD models, part drawings, and assembly blueprints for you to manufacture with your own team.",
              features: ["3D Assembly Models", "2D Part Blueprints", "Complete Parts & Bill of Materials", "Engineering Calculations"],
            },
            {
              t: "2. Build to Your Drawings",
              badge: "MANUFACTURING ONLY",
              b: "You give us your CAD blueprints; we buy raw materials, machine all parts, wire, assemble, and test the machine.",
              features: ["Material Procurement", "Precision CNC Machining", "Electrical Wiring & Assembly", "Accuracy Verification"],
            },
            {
              t: "3. Complete Turnkey Delivery",
              badge: "FULL TURNKEY",
              b: "We handle everything from the initial sketch to complete design, part sourcing, building, testing, and delivery.",
              features: ["Single Project Manager", "Custom Machine & Tooling", "Live Testing with Real Parts", "Setup Support & Manuals"],
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
                    <TechLabel tone="light">What We Provide</TechLabel>
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
                  <Btn to="/quote" variant="light" className="w-full text-center text-xs">
                    Choose This Option
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
