"use client";

import { useState } from "react";
import Link from "next/link";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import {
  Btn,
  Reveal,
  SectionHead,
  TechLabel,
  Badge,
  Container,
  Lightbox,
} from "@/components/site/ui";
import { CtaBand, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import {
  ArrowUpRight,
  Maximize2,
  CheckCircle2,
  Factory,
  ShieldCheck,
  Layers,
  Settings,
  Zap,
  Check,
  Sparkles,
  Award,
} from "lucide-react";

// Industry standards and compliance cards
const COMPLIANCE_PILLARS = [
  {
    num: "01",
    sector: "Automotive & Powertrain",
    title: "Localized Hardening & Precision Machining",
    desc: "Engineered to withstand millions of continuous operating cycles with zero thermal distortion, micron-level journal alignment, and automated quench integration.",
    badge: "IATF Standards",
    image: IMAGES.crankShaft,
  },
  {
    num: "02",
    sector: "Heavy Forging & Steel Mills",
    title: "Thermal Barrier & Shock-Resistant Frames",
    desc: "Rigid heavy-gauge welded steel frames built to withstand high-impact press vibrations, billet transfer heat up to 1200°C, and abrasive foundry dust.",
    badge: "Heavy Duty Build",
    image: IMAGES.forgeToTrim,
  },
  {
    num: "03",
    sector: "Food & Pharmaceutical Processing",
    title: "Sanitary Stainless Steel & Tool-Less Washdown",
    desc: "Smooth weld finishes, non-corrosive SS-304/316 contact surfaces, hygienic modular plastic belting, and sealed washdown motors meeting GMP standards.",
    badge: "Hygienic Grade",
    image: IMAGES.modularConveyor,
  },
  {
    num: "04",
    sector: "Aerospace & Precision Metrology",
    title: "Zero-Backlash Servos & 100% FAT Verification",
    desc: "Multi-axis synchronized motion, sub-micron dial indicator test benches, and full-speed automated part inspection with digital test logs.",
    badge: "Precision Quality",
    image: IMAGES.metrology,
  },
];

// Fallback photography for sectors when custom image is not yet uploaded
const fallbackImages = [
  IMAGES.crankShaft,
  IMAGES.forgeToTrim,
  IMAGES.autoBilletLoader,
  IMAGES.modularConveyor,
  IMAGES.eddyCurrent,
  IMAGES.verticalInduction,
  IMAGES.latheAssembly,
  IMAGES.about,
];

export default function IndustriesPage() {
  const { industries } = useSite();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Identify featured industry for the hero spotlight card (if enabled in Admin)
  const featuredIndustry = industries.find((ind) => ind.featured);
  const featuredIndex = featuredIndustry ? industries.indexOf(featuredIndustry) : -1;

  // Prepare images for the interactive full-screen Lightbox
  const lightboxItems = industries.map((ind, i) => ({
    id: ind.id || String(i),
    image: ind.image || fallbackImages[i % fallbackImages.length],
    title: ind.name,
    category: `Sector Spec 0${i + 1}`,
    description: ind.description,
  }));

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION — HIGH IMPACT SECTOR SPOTLIGHT & LIVE TELEMETRY */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-navy pt-28 pb-20 text-onnavy sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-30" />
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Content */}
            <div className={featuredIndustry ? "lg:col-span-7" : "lg:col-span-12 max-w-4xl"}>
              <Reveal>
                {/* Live Telemetry Pill */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent backdrop-blur-md shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  <span>INDUSTRY-SPECIFIC MACHINERY</span>
                  <span className="h-3 w-px bg-accent/40" />
                  <span className="text-onnavy-muted font-normal hidden sm:inline">
                    {industries.length} Key Industrial Sectors
                  </span>
                </div>

                <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-onnavy leading-[1.1]">
                  Custom Machine Engineering <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-hover to-white">
                    Built for Every Industrial Sector.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base sm:text-lg text-onnavy-muted leading-relaxed font-sans">
                  From heavy-duty forging plants and high-speed automotive lines to clean pharmaceutical and food packaging facilities, we engineer, machine, and test special purpose machinery tailored to your exact manufacturing conditions.
                </p>

                {/* Hero CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Btn
                    to="/quote#quote-form"
                    variant="primary"
                    className="text-sm px-7 py-3.5 font-bold shadow-lg shadow-accent/25"
                  >
                    Request an Industry Quote
                  </Btn>
                  <Btn to="/projects" variant="light" className="text-sm px-7 py-3.5 font-semibold">
                    Explore Delivered Builds
                  </Btn>
                </div>

                {/* Trust Badges Strip */}
                <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-onnavy/15 pt-6 text-xs text-onnavy-muted">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>{industries.length} Specialized Sectors</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>100% In-House Pune Manufacturing</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Guaranteed Cycle Times (FAT)</span>
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right Hero: Sector Spotlight Card (Rendered ONLY if an industry is marked Featured) */}
            {featuredIndustry ? (
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
                          featuredIndustry.image ||
                          (featuredIndex >= 0 ? fallbackImages[featuredIndex % fallbackImages.length] : IMAGES.crankShaft)
                        }
                        alt={featuredIndustry.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

                      {/* Floating Zoom Action */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-xs font-semibold text-accent backdrop-blur-md border border-accent/30 shadow-lg">
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Inspect Sector Bay</span>
                      </div>

                      {/* Overlay Telemetry */}
                      <div className="absolute bottom-4 left-4 right-4 text-onnavy">
                        <span className="inline-block rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent uppercase">
                          Featured Industry
                        </span>
                        <h3 className="mt-1 font-display text-base font-bold text-onnavy">
                          {featuredIndustry.name}
                        </h3>
                        <p className="text-xs text-onnavy-muted line-clamp-1">
                          {featuredIndustry.description}
                        </p>
                      </div>
                    </div>

                    {/* Quick Facts Grid */}
                    <div className="mt-3.5 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Sectors</span>
                        <strong className="font-display text-sm font-bold text-onnavy">{industries.length} Core</strong>
                      </div>
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Build Type</span>
                        <strong className="font-display text-sm font-bold text-accent">Custom SPM</strong>
                      </div>
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Testing</span>
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
      {/* 2. LIVE SECTOR METRICS STRIP */}
      {/* ========================================================================= */}
      <div className="border-y border-line bg-surface py-8">
        <Container>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line/60">
            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Industrial Scope</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {industries.length < 10 ? `0${industries.length}` : industries.length}{" "}
                <span className="text-accent text-xl font-bold">Sectors</span>
              </p>
              <p className="mt-1 text-xs text-muted">Automotive, Forging, Food & Pharma</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Plant Deployments</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                40+ <span className="text-accent text-xl font-bold">Machines</span>
              </p>
              <p className="mt-1 text-xs text-muted">Running 24/7 on factory floors</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Engineering Legacy</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                25+ <span className="text-accent text-xl font-bold">Years</span>
              </p>
              <p className="mt-1 text-xs text-muted">Special purpose engineering in Pune</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">FAT Verification</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                100% <span className="text-accent text-xl font-bold">Tested</span>
              </p>
              <p className="mt-1 text-xs text-muted">Live part trials before shipping</p>
            </div>
          </div>
        </Container>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION 01: CORE INDUSTRIAL SECTORS PHOTO CATALOG (IMAGE-DENSE & DYNAMIC) */}
      {/* ========================================================================= */}
      <Section grid>
        <InView>
          <SectionHead
            index="3.1"
            eyebrow="Our Reach"
            title={`Serving ${industries.length} Core Industries with Proven Machines`}
            intro="Explore the custom machines, conveyors, and automated systems we have engineered and built for factory floors across India and globally."
          />
        </InView>

        <div className="mt-14 space-y-16">
          {industries.map((ind, idx) => {
            const indImg = ind.image || fallbackImages[idx % fallbackImages.length];
            const isEven = idx % 2 === 0;

            return (
              <InView key={ind.id || idx} delay={Math.min(idx, 3) * 80}>
                <article className="group relative rounded-3xl border border-line bg-surface overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-accent/40">
                  <div className="grid gap-8 lg:grid-cols-12 items-stretch">
                    {/* Sector Photography Showcase */}
                    <div
                      onClick={() => setLightboxIndex(idx)}
                      className={`relative min-h-[300px] lg:min-h-[420px] overflow-hidden bg-navy cursor-pointer ${
                        isEven ? "lg:col-span-5 lg:order-1" : "lg:col-span-5 lg:order-2"
                      }`}
                    >
                      {indImg ? (
                        <img
                          src={indImg}
                          alt={`${ind.name} machinery engineered by Three Star Enterprises`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                          Photo Coming Soon
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />

                      {/* Sector Pill Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-navy/90 border border-accent/40 px-3.5 py-1 text-xs font-bold text-accent shadow-md">
                          {`SECTOR 0${idx + 1}`}
                        </span>
                      </div>

                      {/* Inspect Zoom Pill */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-accent/95 px-3 py-1 text-xs font-bold text-navy shadow-lg">
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Inspect Build</span>
                      </div>

                      {/* Photo Bottom Caption */}
                      <div className="absolute bottom-4 left-4 right-4 text-onnavy">
                        <span className="text-[0.68rem] font-bold text-accent uppercase tracking-wider block">
                          Industrial Sector Solution
                        </span>
                        <h4 className="mt-1 font-display text-lg font-bold text-onnavy leading-snug">
                          {ind.name}
                        </h4>
                      </div>
                    </div>

                    {/* Sector Details & Capabilities */}
                    <div
                      className={`p-6 sm:p-10 flex flex-col justify-between ${
                        isEven ? "lg:col-span-7 lg:order-2" : "lg:col-span-7 lg:order-1"
                      }`}
                    >
                      <div>
                        {/* Sector Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                          <div className="flex items-center gap-2.5">
                            <span className="h-2 w-2 rounded-full bg-accent" />
                            <span className="text-xs font-bold text-accent uppercase tracking-wider">
                              {`Sector Spec 0${idx + 1}`}
                            </span>
                          </div>
                          <Badge variant="navy">CUSTOM SPM BUILD</Badge>
                        </div>

                        <h3 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                          {ind.name}
                        </h3>

                        <p className="mt-3 text-sm leading-relaxed text-muted font-sans">
                          {ind.description}
                        </p>

                        {/* Key Applications Checklist */}
                        {ind.capabilities && ind.capabilities.length > 0 && (
                          <div className="mt-6 pt-5 border-t border-line">
                            <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-3">
                              Key Engineered Applications:
                            </span>
                            <div className="grid gap-2.5 sm:grid-cols-2">
                              {ind.capabilities.map((cap: string, cIdx: number) => (
                                <div
                                  key={cIdx}
                                  className="flex items-start gap-2.5 rounded-xl border border-line bg-surface-soft/60 px-3.5 py-2.5 text-xs text-foreground font-medium"
                                >
                                  <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                                  <span className="leading-snug">{cap}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA Action Row */}
                      <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4 bg-surface-soft/60 rounded-2xl p-5 border">
                        <div>
                          <span className="text-[0.68rem] font-bold text-accent uppercase tracking-wider block">
                            Direct Industry Fit:
                          </span>
                          <p className="mt-0.5 text-xs font-medium text-foreground">
                            Custom tooling, cycle time simulation & live FAT trials in Pune.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Btn
                            to={`/quote?project=${encodeURIComponent(`${ind.name} Machinery Inquiry`)}#quote-form`}
                            variant="primary"
                            className="text-xs px-5 py-2.5 font-bold shrink-0"
                          >
                            Request Quote for This Sector
                          </Btn>
                          <Btn
                            to={`/contact?subject=${encodeURIComponent(`Industry Inquiry: ${ind.name}`)}#contact-form`}
                            variant="outline"
                            className="text-xs px-4 py-2.5 font-semibold shrink-0"
                          >
                            Enquire About Sector
                          </Btn>
                        </div>
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
      {/* 4. SECTION 02: CROSS-INDUSTRY ENGINEERING COMPLIANCE (DARK PHOTO-GRID) */}
      {/* ========================================================================= */}
      <Section dark tight grid>
        <InView>
          <SectionHead
            dark
            index="02"
            eyebrow="Quality & Compliance"
            title="Built for Heavy-Duty & Cleanroom Standards Alike"
            intro="Our in-house machine building adheres to the specific safety, structural rigidity, and contamination standards of each manufacturing discipline."
          />
        </InView>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COMPLIANCE_PILLARS.map((p, i) => (
            <InView key={p.num} delay={i * 90}>
              <div className="group h-full rounded-2xl border border-onnavy/15 bg-surface/5 overflow-hidden shadow-lg transition-all duration-300 hover:border-accent/60 hover:shadow-2xl flex flex-col justify-between">
                <div>
                  {/* Photo Preview */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-navy/90 border border-accent/40 px-3 py-1 text-xs font-bold text-accent shadow-md">
                        {p.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="font-display text-2xl font-extrabold text-accent">{p.num}</span>
                    <span className="text-[0.65rem] font-bold text-onnavy-muted uppercase tracking-wider block mt-1">
                      {p.sector}
                    </span>
                    <h3 className="mt-2 font-display text-base font-bold text-onnavy leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-onnavy-muted">{p.desc}</p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="border-t border-onnavy/10 pt-3 flex items-center justify-between text-xs font-semibold text-accent">
                    <span>ENGINEERED SPEC</span>
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 5. SECTION 03: 3-STEP INDUSTRY RAPID RFQ WORKFLOW */}
      {/* ========================================================================= */}
      <Section grid>
        <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12 shadow-xl">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5">
              <span className="tech-label text-accent font-bold">Fast Procurement Route</span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-foreground">
                How We Deliver Your Industry Machine
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                From initial component drawings to complete FAT trials in Pune, we follow a transparent and rigorous protocol to ensure timely commissioning.
              </p>
              <div className="mt-6">
                <Btn to="/quote#quote-form" variant="primary" className="text-sm px-6 py-3 font-bold">
                  Submit Your Component RFQ →
                </Btn>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  step: "01",
                  title: "Drawing Review & Cycle Time Target",
                  desc: "Share your 2D/3D part drawings, production volumes, and required hardening or transfer speeds.",
                },
                {
                  step: "02",
                  title: "3D CAD Concept & Transparent Costing",
                  desc: "We deliver full 3D assembly models, tooling configurations, component brand BOMs, and clear quotations.",
                },
                {
                  step: "03",
                  title: "Pune Workshop Build & 100% FAT Trials",
                  desc: "We machine, assemble, program, and run the machine with your actual raw parts to prove quality prior to dispatch.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="flex items-start gap-4 rounded-2xl border border-line bg-surface-soft/60 p-4 transition-colors hover:border-accent/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-navy font-display text-sm font-bold">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-xs text-muted leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CTA BAND */}
      <Reveal>
        <CtaBand />
      </Reveal>

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE FULL-SCREEN LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        items={lightboxItems}
        currentIndex={lightboxIndex || 0}
        onChangeIndex={(i) => setLightboxIndex(i)}
      />
    </>
  );
}
