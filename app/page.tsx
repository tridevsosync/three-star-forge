"use client";

import Link from "next/link";
import { useState } from "react";
import { IMAGES } from "@/data/images";
import { NPI_STEPS, WORKFLOW } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Container, Reveal, SectionHead, TechLabel, Btn, Rule, Badge } from "@/components/site/ui";
import { CtaBand, ProjectCard, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

export default function HomePage() {
  const { home, company, services, industries, projects, faqs } = useSite();
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 6);
  const filteredProjects =
    selectedIndustry === "All"
      ? featuredProjects
      : projects.filter((p) => p.industry === selectedIndustry).slice(0, 6);

  const industryFilters = ["All", ...Array.from(new Set(projects.map((p) => p.industry)))].slice(0, 5);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-navy pt-28 pb-20 text-onnavy sm:pt-36 sm:pb-28">
        <img
          src={IMAGES.heroIndustrial}
          alt="Industrial equipment manufacturing"
          className="absolute inset-0 h-full w-full object-cover opacity-25 scale-105 animate-pulse duration-[10000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/70" />
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-60" />
        
        {/* Glow orb */}
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

        <Container className="relative">
          <div className="max-w-4xl">
            <Reveal>
              {/* Telemetry pill */}
              <div className="inline-flex items-center gap-3 border border-onnavy/20 bg-navy-soft/80 px-4 py-2 text-xs font-mono backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                <span className="text-accent font-semibold">PUNE WORKSHOP & WORKS</span>
                <span className="h-3 w-px bg-onnavy/20" />
                <span className="text-onnavy-muted hidden sm:inline">Design • Manufacturing • Testing</span>
              </div>

              <h1 className="mt-8 font-display text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl lg:text-[4.2rem] break-words">
                {home.heroTitle || "We Turn Engineering Ideas Into Reliable Machines."}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-onnavy-muted sm:text-xl break-words">
                {home.heroSubtitle ||
                  "Custom machine design, complete in-house manufacturing, and live testing for factories and equipment makers worldwide."}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Btn to="/quote" variant="primary" className="text-base px-8 py-4 font-bold">
                  {home.primaryCta || "Get a Free Quote"}
                </Btn>
                <Btn to="/projects" variant="light" className="text-base px-8 py-4">
                  {home.secondaryCta || "See Our Machines"}
                </Btn>
              </div>

              {/* Live Metric Strip */}
              <div className="mt-14 grid grid-cols-2 gap-4 border-t border-onnavy/15 pt-8 sm:grid-cols-4 sm:gap-6">
                {[
                  { value: "40+", label: "Machines Delivered", desc: "Built & Working on Factory Floors" },
                  { value: "25+", label: "Years Experience", desc: "Practical Workshop Engineering" },
                  { value: "7", label: "Industries Served", desc: "Automotive, Food, Pharma & More" },
                  { value: "100%", label: "Tested In-House", desc: "Live Trials Before Shipping" },
                ].map((s, idx) => (
                  <div key={idx} className="border-l border-onnavy/20 pl-4">
                    <span className="font-display text-2xl font-bold text-accent sm:text-3xl">
                      {s.value}
                    </span>
                    <p className="mt-1 font-mono text-[0.72rem] font-semibold text-onnavy uppercase">
                      {s.label}
                    </p>
                    <p className="text-[0.68rem] text-onnavy-muted hidden sm:block">{s.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CORE CAPABILITY STRIP */}
      <div className="border-y border-line bg-surface py-5">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted">
            <span className="font-semibold text-foreground">HOW WE WORK:</span>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              {WORKFLOW.map((w, i) => (
                <div key={w} className="flex items-center gap-2">
                  <span className="text-accent font-bold">0{i + 1}</span>
                  <span className="text-foreground">{w.replace(/^\d+\.\s*/, '')}</span>
                  {i < WORKFLOW.length - 1 && <span className="text-line-strong">→</span>}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* ABOUT PREVIEW */}
      <Section grid>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          <InView className="lg:col-span-6">
            <SectionHead
              index="01"
              eyebrow="Who We Are"
              title={home.aboutHeading || "Your complete machine design and manufacturing partner."}
              intro="We work closely with engineering teams and plant managers to turn concepts into working machinery. Because design, machining, and assembly all happen in our Pune workshop, every blueprint is verified by the team who builds the machine."
            />
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="card-soft p-5">
                <span className="tech-label text-accent">Design & 3D Modeling</span>
                <p className="mt-2 text-sm text-muted">Full CAD models, 2D part drawings, and manufacturing blueprints.</p>
              </div>
              <div className="card-soft p-5">
                <span className="tech-label text-accent">Workshop & Assembly</span>
                <p className="mt-2 text-sm text-muted">Precision CNC cutting, welding, wiring, assembly, and live testing.</p>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <Btn to="/about" variant="outline">
                About Our Company
              </Btn>
              <Btn to="/capabilities" variant="ghost">
                Explore Capabilities →
              </Btn>
            </div>
          </InView>

          <InView delay={120} className="lg:col-span-6">
            <div className="corner-marks relative overflow-hidden border border-line bg-navy aspect-[4/3] shadow-2xl">
              <img
                src={IMAGES.pageAbout}
                alt="Workshop manufacturing facility"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-onnavy">
                <Badge variant="accent">Pune Workshop Works</Badge>
                <h3 className="mt-2 text-lg font-bold text-onnavy">Integrated Assembly & Inspection Bay</h3>
                <p className="mt-1 text-xs text-onnavy-muted">Equipped for induction machinery assembly, conveyor fabrication, and fixture calibration.</p>
              </div>
            </div>
          </InView>
        </div>
      </Section>

      {/* SERVICE LINES */}
      <Section dark tight grid>
        <InView>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              dark
              index="02"
              eyebrow="What We Offer"
              title="Our Core Machine Building & Design Services"
              intro="Whether you need a full machine built from scratch, drawings made for your own team, or machine upgrades — we have you covered."
            />
            <Btn to="/services" variant="light">
              Explore All Services
            </Btn>
          </div>
        </InView>

        <div className="mt-14 grid gap-px bg-onnavy/12 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s, i) => (
            <InView key={s.id} delay={i * 80} className="bg-navy group">
              <div className="h-full p-8 flex flex-col justify-between transition-colors duration-400 group-hover:bg-navy-soft">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-accent font-bold">{String(i + 1).padStart(2, "0")}</span>
                    <Badge variant="navy">Complete Service</Badge>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-onnavy group-hover:text-accent transition-colors break-words">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-onnavy-muted break-words">
                    {s.summary}
                  </p>
                  <ul className="mt-5 space-y-2 text-xs text-onnavy-muted">
                    {s.points.slice(0, 3).map((pt) => (
                      <li key={pt} className="flex items-center gap-2 min-w-0">
                        <span className="h-1 w-1 bg-accent rounded-full shrink-0" />
                        <span className="break-words min-w-0">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-onnavy/10 flex items-center justify-between text-xs text-accent">
                  <span>Learn More →</span>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* FEATURED PROJECTS PORTFOLIO */}
      <Section grid>
        <InView>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              index="03"
              eyebrow="Our Work"
              title="Machines Built & Delivered to Customers"
              intro="Browse real machines, conveyors, and automation setups designed and manufactured in our Pune workshop."
            />
            <div className="flex flex-wrap gap-2">
              {industryFilters.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wider uppercase transition-all ${
                    selectedIndustry === ind
                      ? "bg-navy text-onnavy"
                      : "border border-line text-muted hover:border-accent hover:text-accent"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        </InView>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p, i) => (
            <InView key={p.id} delay={(i % 3) * 90}>
              <ProjectCard project={p} index={i} />
            </InView>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Btn to="/projects" variant="outline" className="px-8 py-4">
            View All Delivered Machines ({projects.length}+ Builds)
          </Btn>
        </div>
      </Section>

      {/* NPI STEPPER TIMELINE */}
      <Section dark tight grid>
        <InView>
          <SectionHead
            dark
            index="04"
            eyebrow="Our Process"
            title="How We Build Your Machine (Step-by-Step)"
            intro="A simple, organized approach that guarantees your machine is built right, tested thoroughly, and delivered on time."
          />
        </InView>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {NPI_STEPS.slice(0, 4).map((step, i) => (
            <InView key={step.step} delay={i * 90}>
              <div className="h-full border border-onnavy/15 bg-navy-soft/60 p-7 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-2xl font-bold text-accent">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-lg font-bold text-onnavy">{step.step.replace(/^\d+\.\s*/, '')}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-onnavy-muted">{step.body}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-onnavy/10 text-[0.7rem] font-mono text-accent">
                  STEP {i + 1}
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <Section>
        <InView>
          <SectionHead
            index="05"
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            intro="Quick answers to common questions about our machines, project timelines, testing, and pricing."
          />
        </InView>

        <div className="mt-12 max-w-4xl space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <InView key={idx} delay={idx * 50}>
                <div className="border border-line bg-surface transition-all">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-semibold text-foreground sm:text-lg hover:text-accent transition-colors min-w-0"
                  >
                    <span className="break-words min-w-0 flex-1">{faq.q || faq.question}</span>
                    <span className="text-accent font-mono text-xl shrink-0">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-sm leading-relaxed text-muted border-t border-line break-words">
                      {faq.a || faq.answer}
                    </div>
                  )}
                </div>
              </InView>
            );
          })}
        </div>
      </Section>

      {/* CLOSING RFQ CTA */}
      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
