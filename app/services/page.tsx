"use client";

import { useState } from "react";
import Link from "next/link";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Container, Reveal, SectionHead, TechLabel, Btn, Lightbox } from "@/components/site/ui";
import { CtaBand, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import {
  Wrench,
  Cpu,
  Layers,
  Settings,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Maximize2,
  ChevronRight,
  Factory,
  FileText,
  Check,
  Target,
  Clock,
  Compass,
} from "lucide-react";

export default function ServicesPage() {
  const { services, servicesSpotlight, engagementModels = [], company, openRfqModal } = useSite();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Identify featured service for hero spotlight card (if enabled in Admin)
  const featuredService = services.find((s) => s.featured);
  const featuredIndex = featuredService ? services.indexOf(featuredService) : -1;

  // Dynamic image pairing for services
  const defaultServiceImages: Record<string, string> = {
    "design-engineering": IMAGES.blueprints,
    "turnkey-manufacturing": IMAGES.engineeringEquipment,
    "product-management": IMAGES.pageServices,
    npi: IMAGES.automation,
    procurement: IMAGES.metrology,
    "process-optimization": IMAGES.materialHandling,
  };

  const fallbackImages = [
    IMAGES.blueprints,
    IMAGES.engineeringEquipment,
    IMAGES.pageServices,
    IMAGES.automation,
    IMAGES.metrology,
    IMAGES.materialHandling,
  ];

  const fallbackEngagementImages = [
    IMAGES.blueprints,
    IMAGES.engineeringEquipment,
    IMAGES.pageAbout || IMAGES.pageServices,
  ];

  // Gallery items for Lightbox
  const serviceGalleryItems = services.map((s, idx) => ({
    id: s.id || s.code || String(idx),
    image: s.image || defaultServiceImages[s.code as any] || fallbackImages[idx % fallbackImages.length],
    title: s.title,
    category: s.code || `Core Engineering 0${idx + 1}`,
    description: s.summary,
  }));

  const engagementGalleryItems = engagementModels.map((model, idx) => ({
    id: model.id || String(idx),
    image: model.image || fallbackEngagementImages[idx % fallbackEngagementImages.length],
    title: model.title,
    category: model.badge || `Model Tier 0${idx + 1}`,
    description: model.description || (model as any).desc || "",
  }));

  // Step-by-step engineering lifecycle breakdown
  const workflowStages = [
    {
      num: "01",
      title: "Design Concept & FEA Simulation",
      desc: "Parametric 3D CAD modeling in SolidWorks, finite element structural analysis, and cycle-time calculations.",
      tag: "Design",
    },
    {
      num: "02",
      title: "Component Sourcing & Heavy Procurement",
      desc: "Sourcing premium class-A components: Siemens PLC, Festo pneumatics, THK linear guides, and SKF bearings.",
      tag: "Sourcing",
    },
    {
      num: "03",
      title: "Precision CNC Machining & Welding",
      desc: "In-house heavy CNC milling, turning, structural frame fabrication, and stress-relieved machining.",
      tag: "Fabrication",
    },
    {
      num: "04",
      title: "Electrical, PLC & Automation Assembly",
      desc: "Siemens/Delta PLC programming, servo synchronization, quench plumbing, and safety enclosure integration.",
      tag: "Assembly",
    },
    {
      num: "05",
      title: "100% FAT Live Testing & Signoff",
      desc: "Full-speed automated testing with actual client parts and metallurgical inspection before plant dispatch.",
      tag: "FAT Signoff",
    },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. CINEMATIC SERVICES HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-navy pt-28 pb-20 text-onnavy sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-30" />
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Narrative */}
            <div className={featuredService ? "lg:col-span-7" : "lg:col-span-12 max-w-4xl"}>
              <Reveal>
                {/* Glowing Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent backdrop-blur-md shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  <span>PUNE WORKS • ENGINEERING SERVICES</span>
                  <span className="h-3 w-px bg-accent/40" />
                  <span className="text-onnavy-muted font-normal hidden sm:inline">
                    Complete In-House Machine Building
                  </span>
                </div>

                <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-onnavy leading-[1.1]">
                  Complete Engineering Support <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-hover to-white">
                    From 3D Design to Final Machine Run.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base sm:text-lg text-onnavy-muted leading-relaxed font-sans">
                  We provide flexible end-to-end engineering support from our Pune workshop. Partner with us for 3D CAD design only, contract us to manufacture to your drawings, or let us deliver a complete turnkey machine ready for production.
                </p>

                {/* Hero Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Btn
                    to="/quote#quote-form"
                    variant="primary"
                    className="text-sm px-7 py-3.5 font-bold"
                  >
                    Request a Project Quote
                  </Btn>
                  <Btn to="/projects" variant="light" className="text-sm px-7 py-3.5">
                    Explore Delivered Builds
                  </Btn>
                </div>

                {/* Trust Badges Strip */}
                <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-onnavy/15 pt-6 text-xs text-onnavy-muted">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>{services.length} Core Engineering Disciplines</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>100% In-House Pune Manufacturing</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Single Accountable Project Manager</span>
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right Hero: Service Spotlight Card (Rendered ONLY if a service is marked Featured) */}
            {featuredService ? (
              <div className="lg:col-span-5">
                <InView delay={120}>
                  <div className="group relative rounded-3xl border border-onnavy/20 bg-surface/5 p-4 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-accent/50">
                    {/* Photo Container */}
                    <div
                      onClick={() => setLightboxIndex(featuredIndex >= 0 ? featuredIndex : 0)}
                      className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-navy cursor-pointer"
                    >
                      <img
                        src={
                          featuredService.image ||
                          (featuredService.code ? defaultServiceImages[featuredService.code] : null) ||
                          (featuredIndex >= 0 ? fallbackImages[featuredIndex % fallbackImages.length] : IMAGES.pageServices)
                        }
                        alt={featuredService.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

                      {/* Floating Zoom Action */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-xs font-semibold text-accent backdrop-blur-md border border-accent/30 shadow-lg">
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Inspect Services</span>
                      </div>

                      {/* Overlay Facility Telemetry */}
                      <div className="absolute bottom-4 left-4 right-4 text-onnavy">
                        <span className="inline-block rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent uppercase">
                          {featuredService.code ? `Featured • ${featuredService.code}` : "Featured Service"}
                        </span>
                        <h3 className="mt-1 font-display text-base font-bold text-onnavy">
                          {featuredService.title}
                        </h3>
                        <p className="text-xs text-onnavy-muted line-clamp-1">
                          {featuredService.summary}
                        </p>
                      </div>
                    </div>

                    {/* Quick Facts Grid */}
                    <div className="mt-3.5 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Service Lines</span>
                        <strong className="font-display text-sm font-bold text-onnavy">{services.length} Core</strong>
                      </div>
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Delivery Model</span>
                        <strong className="font-display text-sm font-bold text-accent">Turnkey</strong>
                      </div>
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Testing QA</span>
                        <strong className="font-display text-sm font-bold text-onnavy">100% FAT</strong>
                      </div>
                    </div>
                  </div>
                </InView>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE CAPABILITY METRICS STRIP */}
      {/* ========================================================================= */}
      <div className="border-y border-line bg-surface py-8">
        <Container>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line/60">
            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Engineering Scope</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {services.length < 10 ? `0${services.length}` : services.length} <span className="text-accent text-xl font-bold">Disciplines</span>
              </p>
              <p className="mt-1 text-xs text-muted">Design, CNC, Assembly & FAT</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">In-House Control</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                100% <span className="text-accent text-xl font-bold">Pune Works</span>
              </p>
              <p className="mt-1 text-xs text-muted">Fabrication to PLC programming</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Engineering Legacy</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                25+ <span className="text-accent text-xl font-bold">Years</span>
              </p>
              <p className="mt-1 text-xs text-muted">Decades of machine building</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Accountability</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Single <span className="text-accent text-xl font-bold">Lead PM</span>
              </p>
              <p className="mt-1 text-xs text-muted">Zero subcontracting delays</p>
            </div>
          </div>
        </Container>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION 01: CORE SERVICES PHOTO CATALOG (IMAGE-RICH & DYNAMIC) */}
      {/* ========================================================================= */}
      <Section grid>
        <InView>
          <SectionHead
            index="01"
            eyebrow="Our Services"
            title="Comprehensive Machine Design, Manufacturing & Automation"
            intro="Explore our core service lines. Every machine is designed, machined, assembled, and verified by our engineering team in Pune."
          />
        </InView>

        <div className="mt-14 space-y-12">
          {services.map((s, idx) => {
            const serviceImg = s.image || defaultServiceImages[s.id] || fallbackImages[idx % fallbackImages.length];
            const isEven = idx % 2 === 0;

            return (
              <InView key={s.id || idx} delay={Math.min(idx, 3) * 80}>
                <article className="group relative rounded-3xl border border-line bg-surface overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-accent/40">
                  <div className="grid gap-8 lg:grid-cols-12 items-stretch">
                    {/* Service Photography Showcase */}
                    <div
                      onClick={() => setLightboxIndex(idx)}
                      className={`relative min-h-[280px] lg:min-h-[380px] overflow-hidden bg-navy cursor-pointer ${
                        isEven ? "lg:col-span-5 lg:order-1" : "lg:col-span-5 lg:order-2"
                      }`}
                    >
                      {serviceImg ? (
                        <img
                          src={serviceImg}
                          alt={s.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                          Photo Coming Soon
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

                      {/* Service Code Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-navy/90 border border-accent/40 px-3 py-1 text-xs font-bold text-accent shadow-md">
                          {s.code || `SRV-0${idx + 1}`}
                        </span>
                      </div>

                      {/* Inspect Zoom Pill */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-accent/90 px-3 py-1 text-xs font-bold text-navy shadow-lg">
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Inspect Bay</span>
                      </div>

                      {/* Photo Caption */}
                      <div className="absolute bottom-4 left-4 right-4 text-onnavy">
                        <h4 className="font-display text-sm font-bold text-onnavy line-clamp-1">{s.title}</h4>
                        <p className="text-xs text-onnavy-muted line-clamp-1">In-house Pune Works capability</p>
                      </div>
                    </div>

                    {/* Service Content & Deliverables */}
                    <div
                      className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-between ${
                        isEven ? "lg:col-span-7 lg:order-2" : "lg:col-span-7 lg:order-1"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-accent" />
                          <span className="text-xs font-bold text-accent uppercase tracking-wider">
                            Engineering Discipline 0{idx + 1}
                          </span>
                        </div>

                        <h3 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                          {s.title}
                        </h3>

                        <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">
                          {s.summary}
                        </p>

                        {/* Deliverables Checklist */}
                        {s.points && s.points.length > 0 && (
                          <div className="mt-6 pt-5 border-t border-line">
                            <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-3">
                              What We Deliver:
                            </span>
                            <ul className="grid gap-2.5 sm:grid-cols-2">
                              {s.points.map((pt: string, pIdx: number) => (
                                <li key={pIdx} className="flex items-start gap-2.5 text-xs text-muted">
                                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                                  <span className="leading-snug text-foreground font-medium">{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Outcome & CTA Action Box */}
                      <div className="mt-8 pt-5 border-t border-line flex flex-wrap items-center justify-between gap-4 bg-surface-soft/60 rounded-2xl p-5 border">
                        <div className="max-w-md">
                          <span className="text-[0.68rem] font-bold text-accent uppercase tracking-wider block">
                            Direct Outcome:
                          </span>
                          <p className="mt-0.5 text-xs font-medium text-foreground leading-relaxed">
                            {s.outcome || "Production-ready engineering delivered with zero quality compromise."}
                          </p>
                        </div>

                        <Btn
                          to={`/quote?project=${encodeURIComponent(`${s.title} Service Inquiry`)}#quote-form`}
                          variant="primary"
                          className="text-xs px-5 py-2.5 font-bold shrink-0"
                        >
                          Request Quote for This Service
                        </Btn>
                      </div>
                    </div>
                  </div>
                </article>
              </InView>
            );
          })}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 4. SECTION 02: 5-STAGE MACHINE BUILDING WORKFLOW (VISUAL STEPPER) */}
      {/* ========================================================================= */}
      <Section dark tight grid>
        <InView>
          <SectionHead
            dark
            index="02"
            eyebrow="Workflow Protocol"
            title="How We Execute Your Project: 5 Controlled Stages"
            intro="A transparent, systematic route from your initial requirements to a verified, production-ready machine in your plant."
          />
        </InView>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {workflowStages.map((st, i) => (
            <InView key={st.num} delay={i * 80}>
              <div className="h-full rounded-2xl border border-onnavy/15 bg-surface/5 p-6 flex flex-col justify-between transition-all duration-300 hover:border-accent/40 hover:bg-surface/10">
                <div>
                  <div className="flex items-baseline justify-between border-b border-onnavy/10 pb-3">
                    <span className="font-display text-2xl font-extrabold text-accent">{st.num}</span>
                    <span className="text-[0.65rem] font-bold text-onnavy-muted uppercase tracking-wider">
                      {st.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-onnavy">{st.title}</h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-onnavy-muted">{st.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-onnavy/10 text-[0.7rem] font-bold text-accent flex items-center justify-between">
                  <span>STAGE 0{i + 1} VERIFIED</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 5. SECTION 03: 3 FLEXIBLE ENGAGEMENT MODELS */}
      {/* ========================================================================= */}
      <Section grid>
        <InView>
          <SectionHead
            index="03"
            eyebrow="Flexible Partnership"
            title={`${engagementModels.length} Simple Ways to Work With Our Engineering Works`}
            intro="Choose the partnership model that best fits your internal manufacturing resources, timeline, and budget."
          />
        </InView>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {engagementModels.map((m, i) => {
            const modelImg = m.image || fallbackEngagementImages[i % fallbackEngagementImages.length];
            const deliverables = m.deliverables || [];

            return (
              <InView key={m.title || i} delay={i * 100}>
                <div className="group h-full rounded-3xl border border-line bg-surface overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-accent/40 flex flex-col justify-between">
                  <div>
                    {/* Model Photo Banner */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy">
                      {modelImg ? (
                        <img
                          src={modelImg}
                          alt={m.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-navy/90 border border-accent/40 px-3 py-1 text-xs font-bold text-accent shadow-md">
                          {m.badge}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                        {m.tagline}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-bold text-foreground">{m.title}</h3>
                      <p className="mt-3 text-xs leading-relaxed text-muted">
                        {m.description || (m as any).desc}
                      </p>

                      {deliverables.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-line">
                          <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-3">
                            Included Deliverables:
                          </span>
                          <ul className="space-y-2">
                            {deliverables.map((d: string, dIdx: number) => (
                              <li key={dIdx} className="flex items-center gap-2 text-xs text-foreground font-medium">
                                <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 pt-0">
                    <Btn
                      to={`/contact?subject=${encodeURIComponent(`Partnership Model: ${m.title}`)}#contact-form`}
                      variant="primary"
                      full
                      className="py-3 text-xs font-bold"
                    >
                      Select This Model
                    </Btn>
                  </div>
                </div>
              </InView>
            );
          })}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 6. SECTION 04: CLOSING CTA BAND */}
      {/* ========================================================================= */}
      <Reveal>
        <CtaBand />
      </Reveal>

      {/* Full-Resolution Interactive Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          isOpen={lightboxIndex !== null}
          items={serviceGalleryItems}
          currentIndex={lightboxIndex}
          onChangeIndex={(idx) => setLightboxIndex(idx)}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
