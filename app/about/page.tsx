"use client";

import Link from "next/link";
import { IMAGES } from "@/data/images";
import { NPI_STEPS, WHY_POINTS, WORKFLOW } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Container, Reveal, SectionHead, TechLabel, Btn, Rule, Badge } from "@/components/site/ui";
import { CtaBand, PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import {
  ShieldCheck,
  Cpu,
  Wrench,
  Layers,
  Settings,
  Zap,
  MapPin,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Compass,
  Target,
  Award,
} from "lucide-react";

export default function AboutPage() {
  const { company } = useSite();

  return (
    <>
      <PageHero
        index="01"
        eyebrow="Company Profile"
        title="Engineering partner to global OEMs, built around design and manufacturing."
        intro={company.positioning}
        image={IMAGES.pageAbout}
        action={
          <div className="flex flex-wrap items-center gap-4">
            <Btn to="/quote" variant="primary">
              Submit Machinery RFQ
            </Btn>
            <Btn to="/projects" variant="light">
              Explore Portfolio
            </Btn>
          </div>
        }
      />

      {/* METRIC KPI HUD STRIP */}
      <div className="border-y border-line bg-surface py-8">
        <Container>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line/60">
            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="tech-label text-accent">Experience</span>
              <p className="mt-1.5 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                25+ <span className="text-accent text-xl">Years</span>
              </p>
              <p className="mt-1 font-mono text-xs text-muted">Shop-Floor Engineering</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="tech-label text-accent">Machinery Delivered</span>
              <p className="mt-1.5 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                100+ <span className="text-accent text-xl">Builds</span>
              </p>
              <p className="mt-1 font-mono text-xs text-muted">Induction & Automation</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="tech-label text-accent">Industry Sectors</span>
              <p className="mt-1.5 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                05 <span className="text-accent text-xl">Sectors</span>
              </p>
              <p className="mt-1 font-mono text-xs text-muted">Global OEM Partnerships</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="tech-label text-accent">Standard Quality</span>
              <p className="mt-1.5 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                100% <span className="text-accent text-xl">In-House</span>
              </p>
              <p className="mt-1 font-mono text-xs text-muted">DFM & Assembly Trial</p>
            </div>
          </div>
        </Container>
      </div>

      {/* INTRODUCTION & INFRASTRUCTURE */}
      <Section grid>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-8">
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

            {/* Core Engineering Pillars */}
            <div className="grid gap-5 sm:grid-cols-2 pt-4">
              <div className="border border-line bg-surface p-6 shadow-sm hover:border-line-strong transition-all">
                <div className="flex items-center gap-2">
                  <Badge variant="accent">Pillar 01</Badge>
                  <Wrench className="h-4 w-4 text-accent" />
                </div>
                <h4 className="mt-3 font-display text-lg font-bold text-foreground">
                  Design for Manufacturing (DFM)
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-muted font-mono">
                  Every 3D CAD model is engineered to eliminate setup bottlenecks, utilize standard raw materials, and guarantee component interchangeability.
                </p>
              </div>

              <div className="border border-line bg-surface p-6 shadow-sm hover:border-line-strong transition-all">
                <div className="flex items-center gap-2">
                  <Badge variant="navy">Pillar 02</Badge>
                  <Cpu className="h-4 w-4 text-accent" />
                </div>
                <h4 className="mt-3 font-display text-lg font-bold text-foreground">
                  Turnkey Single-Point Control
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-muted font-mono">
                  End-to-end execution covering mechanical machining, heavy fabrication, solid-state electrical power supplies, PLC programming, and plant commissioning.
                </p>
              </div>

              <div className="border border-line bg-surface p-6 shadow-sm hover:border-line-strong transition-all">
                <div className="flex items-center gap-2">
                  <Badge variant="accent">Pillar 03</Badge>
                  <ShieldCheck className="h-4 w-4 text-accent" />
                </div>
                <h4 className="mt-3 font-display text-lg font-bold text-foreground">
                  Shop-Floor Trial & Validation
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-muted font-mono">
                  Before dispatch, every equipment build undergoes live component trials, quench flow calibration, and cycle time verification on our Pune shop floor.
                </p>
              </div>

              <div className="border border-line bg-surface p-6 shadow-sm hover:border-line-strong transition-all">
                <div className="flex items-center gap-2">
                  <Badge variant="navy">Pillar 04</Badge>
                  <Layers className="h-4 w-4 text-accent" />
                </div>
                <h4 className="mt-3 font-display text-lg font-bold text-foreground">
                  Bespoke NPI Process
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-muted font-mono">
                  A structured 7-stage New Product Introduction workflow that systematically de-risks mechanical assembly before serial production release.
                </p>
              </div>
            </div>
          </div>

          {/* Plant Facility HUD Card */}
          <div className="lg:col-span-5">
            <InView delay={120}>
              <div className="corner-marks border border-line bg-surface p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent" />

                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <TechLabel tone="accent">Registered Facility & Works</TechLabel>
                  </div>
                  <span className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">
                    ISO 9001:2015
                  </span>
                </div>

                <div className="mt-5 space-y-4 font-mono text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-muted block text-[0.65rem] uppercase">Operating Plant Base</span>
                      <p className="mt-0.5 text-foreground font-sans font-medium leading-relaxed">
                        {company.address}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-line">
                    <div className="flex items-start gap-2.5">
                      <Building className="h-4 w-4 text-muted shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted block text-[0.65rem] uppercase">Head of Works</span>
                        <p className="mt-0.5 text-foreground font-bold">{company.contactPerson}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Award className="h-4 w-4 text-muted shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted block text-[0.65rem] uppercase">Location</span>
                        <p className="mt-0.5 text-foreground font-bold">Pune, Maharashtra</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-accent shrink-0" />
                      <div>
                        <span className="text-muted block text-[0.65rem] uppercase">Direct Helpline</span>
                        <a href={`tel:${company.phone.split("/")[0].trim()}`} className="text-accent font-bold hover:underline">
                          {company.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-accent shrink-0" />
                      <div>
                        <span className="text-muted block text-[0.65rem] uppercase">Official Commercial Email</span>
                        <a href={`mailto:${company.email}`} className="text-foreground hover:text-accent underline font-semibold break-all">
                          {company.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-line flex flex-col gap-2.5">
                  <Btn to="/quote" variant="primary" full>
                    Request Engineering Quotation →
                  </Btn>
                  <Btn to="/contact" variant="outline" full>
                    Schedule Plant Inspection Visit
                  </Btn>
                </div>
              </div>
            </InView>
          </div>
        </div>
      </Section>

      {/* VISION & MISSION BLUEPRINT GRID */}
      <Section dark grid tight>
        <div className="grid gap-px bg-onnavy/15 lg:grid-cols-2">
          {[
            {
              label: "Vision",
              body: company.vision,
              index: "1.2",
              tag: "LONG-TERM STRATEGY",
              icon: Compass,
            },
            {
              label: "Mission",
              body: company.mission,
              index: "1.3",
              tag: "CORE COMMITMENT",
              icon: Target,
            },
          ].map((v, i) => {
            const Icon = v.icon;
            return (
              <InView key={v.label} delay={i * 120} className="bg-navy">
                <div className="h-full p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Icon className="h-32 w-32 text-accent" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="tech-label text-accent font-bold">{v.index}</span>
                        <span className="h-px w-8 bg-accent/60" />
                        <TechLabel tone="light">{v.label}</TechLabel>
                      </div>
                      <Badge variant="navy">{v.tag}</Badge>
                    </div>

                    <p className="mt-8 font-display text-xl sm:text-2xl lg:text-3xl leading-[1.3] font-bold text-onnavy">
                      “{v.body}”
                    </p>
                  </div>

                  <div className="mt-10 pt-4 border-t border-onnavy/10 flex items-center justify-between text-xs font-mono text-onnavy-muted">
                    <span>THREE STAR ENTERPRISES</span>
                    <span className="text-accent font-semibold">ISO 9001:2015 CERTIFIED</span>
                  </div>
                </div>
              </InView>
            );
          })}
        </div>
      </Section>

      {/* 5-STAGE WORKFLOW PROTOCOL */}
      <Section>
        <InView>
          <SectionHead
            index="1.4"
            eyebrow="Workflow Protocol"
            title="Design → Sourcing → Manufacturing → Management → Delivery"
            intro="One controlled route from engineering intent to a stabilised, repeatable build — with a single point of coordination throughout."
          />
        </InView>
        <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5 shadow-sm">
          {WORKFLOW.map((w, i) => (
            <InView key={w} delay={i * 90} className="bg-surface">
              <div className="group h-full p-8 transition-colors duration-300 hover:bg-background flex flex-col justify-between">
                <div>
                  <span className="font-mono text-2xl font-bold text-accent">{`0${i + 1}`}</span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{w}</h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed font-mono">
                    Phase {i + 1} validation and stage-gate approval before release to the next stage.
                  </p>
                </div>
                <div className="mt-6 h-1 w-8 bg-line-strong transition-all duration-300 group-hover:w-full group-hover:bg-accent" />
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
        <ol className="mt-14 grid gap-px bg-onnavy/15 md:grid-cols-2 xl:grid-cols-4 shadow-xl">
          {NPI_STEPS.map((s, i) => (
            <InView key={s.step} delay={(i % 4) * 90} className="bg-navy">
              <li className="h-full p-8 flex flex-col justify-between transition-colors hover:bg-navy-deep">
                <div>
                  <div className="flex items-baseline justify-between border-b border-onnavy/10 pb-3">
                    <span className="font-mono text-xl font-bold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[0.68rem] text-onnavy-muted uppercase tracking-wider">
                      Stage {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base leading-snug font-bold text-onnavy">
                    {s.step}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-onnavy-muted font-mono">{s.body}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-onnavy/10 font-mono text-[0.65rem] text-accent flex items-center justify-between">
                  <span>MILESTONE 0{i + 1}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
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
              <div className="border border-line bg-surface h-full p-8 flex flex-col justify-between shadow-sm hover:border-line-strong transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Sparkles className="h-4 w-4 text-accent/60" />
                  </div>
                  <h3 className="mt-4 text-lg leading-snug font-bold text-foreground">
                    {w.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{w.body}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-line text-xs font-mono text-accent font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>PROVEN OEM BENEFIT</span>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* LEADERSHIP QUALITY ASSURANCE */}
      <Section dark tight grid>
        <div className="border border-onnavy/20 bg-navy p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-accent">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-bold uppercase tracking-wider">Chief Engineer's Guarantee</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-onnavy">
                Built in Pune, Engineered for Global Standards.
              </h3>
              <p className="text-sm sm:text-base text-onnavy-muted leading-relaxed">
                “Every induction machine, automation cell, and fixture leaving our Pune works represents our uncompromising dedication to repeatability, thermal precision, and operator ergonomics.”
              </p>
              <div className="pt-2 font-mono text-xs text-onnavy">
                <strong>{company.contactPerson}</strong> — Proprietor & Principal Engineer
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Btn to="/quote" variant="primary" full>
                Request Custom RFQ →
              </Btn>
              <Btn to="/contact" variant="outline" full>
                Contact Works Office
              </Btn>
            </div>
          </div>
        </div>
      </Section>

      {/* CLOSING CTA */}
      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
