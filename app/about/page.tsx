"use client";

import { useState } from "react";
import Link from "next/link";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Container, Reveal, SectionHead, TechLabel, Btn, Lightbox } from "@/components/site/ui";
import { CtaBand, Section } from "@/components/site/blocks";
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
  Maximize2,
  ChevronRight,
  Clock,
  Check,
  Flame,
  Factory,
} from "lucide-react";

export default function AboutPage() {
  const { company, home, openRfqModal } = useSite();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // High-Resolution Plant Tour & Shop-Floor Imagery
  const plantPhotos = [
    {
      image: IMAGES.pageAbout || IMAGES.newMachineAssembly,
      title: "Pune Manufacturing Works & Assembly Facility",
      category: "Plant Overview",
      description: "Our integrated workshop in Dehu Gaon, Pune equipped for complete mechanical fabrication, assembly, and FAT live testing.",
    },
    {
      image: IMAGES.blueprints || IMAGES.about,
      title: "3D CAD Modeling & Kinematic Simulation",
      category: "Design Bureau",
      description: "Complete 3D SolidWorks computer models, assembly layouts, and FEA stress calculations verified before metal fabrication.",
    },
    {
      image: IMAGES.latheAssembly || IMAGES.hmcMachine,
      title: "Heavy Precision CNC Machining & VMC Milling",
      category: "Machining Bay",
      description: "In-house turning, boring, and precision CNC milling ensuring exact mechanical tolerances on every critical machine component.",
    },
    {
      image: IMAGES.galleryInductionGlow || IMAGES.verticalInduction,
      title: "Induction Coil Shaping & High-Frequency Power Tuning",
      category: "Thermal Systems",
      description: "Custom copper inductor coils and integrated quench ring manifolds engineered for localized, distortion-free case hardening.",
    },
    {
      image: IMAGES.newMachineAssembly || IMAGES.pageProjects,
      title: "Turnkey SPM Machine Assembly Bay",
      category: "Assembly Bay",
      description: "Mechanical assembly, pneumatic routing, and drive synchronizations assembled under strict cleanliness and alignment standards.",
    },
    {
      image: IMAGES.galleryInspection || IMAGES.metrology,
      title: "Electrical Automation & PLC Control Panel Integration",
      category: "Control Systems",
      description: "Siemens and Delta PLC integration with custom multi-axis servo drives and operator-friendly touch-screen HMI control interfaces.",
    },
    {
      image: IMAGES.metrology || IMAGES.galleryInspection,
      title: "100% FAT Live Part Testing & Quality Inspection Bench",
      category: "Quality Assurance",
      description: "Dial indicators, hardness testing, and full-speed automated production trials with client parts prior to factory dispatch.",
    },
  ];

  // 25+ Years Legacy Milestones in Photos
  const milestones = [
    {
      year: "1998",
      title: "Workshop Inception in Pune",
      desc: "Founded as a precision tooling and fixture workshop in Dehu Gaon, supplying high-tolerance components to Pune's automotive belt.",
      tag: "Founding Era",
      image: IMAGES.about || IMAGES.blueprints,
    },
    {
      year: "2006",
      title: "CNC & Heavy Machining Expansion",
      desc: "Invested in in-house VMC and heavy turning machinery to deliver complete welded and machined sub-assemblies under one roof.",
      tag: "Machining Scale",
      image: IMAGES.latheAssembly || IMAGES.hmcMachine,
    },
    {
      year: "2014",
      title: "Induction Hardening Specialization",
      desc: "Engineered specialized vertical scanning induction hardening cells and custom copper coil tooling for Tier-1 gear manufacturers.",
      tag: "Thermal Mastery",
      image: IMAGES.galleryInductionGlow || IMAGES.verticalInduction,
    },
    {
      year: "Present",
      title: "Turnkey SPM Automation & Global Supply",
      desc: "Delivering complete custom machines with PLC automation, safety enclosures, and 100% in-house FAT live testing for global manufacturers.",
      tag: "Turnkey SPMS",
      image: IMAGES.newMachineAssembly || IMAGES.pageAbout,
    },
  ];

  // 4 Core Craftsmanship Pillars
  const pillars = [
    {
      num: "01",
      title: "Smart, Practical 3D Design",
      desc: "Every machine model is built for heavy continuous industrial use, easy maintenance access, and ergonomic operator safety.",
      image: IMAGES.blueprints,
      badge: "CAD Engineering",
    },
    {
      num: "02",
      title: "100% In-House Manufacturing",
      desc: "Steel fabrication, precision CNC milling, electrical panel wiring, and PLC logic are performed completely within our Pune workshop.",
      image: IMAGES.latheAssembly,
      badge: "In-House Works",
    },
    {
      num: "03",
      title: "Full Workshop FAT Live Trials",
      desc: "Before shipping, we run the completed machine with your actual raw parts to verify cycle times, hardness depth, and tolerances.",
      image: IMAGES.galleryInspection,
      badge: "100% Live Trials",
    },
    {
      num: "04",
      title: "Single-Point Accountability",
      desc: "Direct communication with the engineers designing and building your machine — zero subcontracting delays or lost details.",
      image: IMAGES.newMachineAssembly,
      badge: "Dedicated Team",
    },
  ];

  // 5-Stage Machine Building Protocol
  const stages = [
    {
      step: "01",
      title: "Requirement & Blueprint Study",
      body: "We review your part drawings, material grades, production throughput, and dimensional tolerances.",
      tag: "Requirement",
    },
    {
      step: "02",
      title: "3D CAD & Motion Simulation",
      body: "Complete SolidWorks 3D models and assembly kinematic simulations verified before cutting any metal.",
      tag: "CAD Design",
    },
    {
      step: "03",
      title: "Precision CNC Machining",
      body: "In-house heavy CNC milling, turning, boring, and structural frame fabrication to tight micrometric tolerances.",
      tag: "Fabrication",
    },
    {
      step: "04",
      title: "Electrical & PLC Integration",
      body: "Servo motor wiring, quench manifold routing, safety interlocks, and custom HMI touch-screen programming.",
      tag: "Assembly",
    },
    {
      step: "05",
      title: "100% FAT Live Part Testing",
      body: "Rigorous Factory Acceptance Testing (FAT) with actual client parts to prove cycle times and surface quality.",
      tag: "FAT Signoff",
    },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION (CLEAN, POWERFUL & PREMIUM) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-navy pt-28 pb-20 text-onnavy sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-30" />
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Hero Narrative */}
            <div className="lg:col-span-7">
              <Reveal>
                {/* Glowing Pill Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent backdrop-blur-md shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  <span>PUNE WORKS • ESTABLISHED 1998</span>
                  <span className="h-3 w-px bg-accent/40" />
                  <span className="text-onnavy-muted font-normal hidden sm:inline">
                    25+ Years of Precision Engineering
                  </span>
                </div>

                <h1 className="mt-5 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-onnavy leading-[1.1]">
                  Engineering Ideas Into <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-hover to-white">
                    Industrial Reality.
                  </span>
                </h1>

                <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base lg:text-lg text-onnavy-muted leading-relaxed font-sans">
                  {company.description ||
                    "For over 25 years, Three Star Enterprises has designed, fabricated, and tested custom industrial machinery in Pune. We deliver turnkey special-purpose machines, automated conveyors, and precision induction hardening systems for equipment manufacturers worldwide."}
                </p>

                {/* Hero CTA Actions */}
                <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Btn
                    to="/quote"
                    variant="primary"
                    className="text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 font-bold shadow-lg shadow-accent/25"
                  >
                    Request a Free Quote
                  </Btn>
                  <Btn to="/projects" variant="light" className="text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5">
                    Explore Delivered Builds
                  </Btn>
                </div>

                {/* Trust Badges Strip */}
                <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-onnavy/15 pt-6 text-xs text-onnavy-muted">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>ISO 9001:2015 Certified Plant</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>100% In-House FAT Trials</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Direct Founder Accountability</span>
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right Hero: Interactive Plant Showcase Card */}
            <div className="lg:col-span-5">
              <InView delay={120}>
                <div className="group relative rounded-3xl border border-onnavy/20 bg-surface/5 p-4 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-accent/50">
                  {/* Photo Container */}
                  <div
                    onClick={() => setLightboxIndex(0)}
                    className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-navy cursor-pointer"
                  >
                    <img
                      src={IMAGES.pageAbout || IMAGES.newMachineAssembly}
                      alt="Three Star Enterprises Pune Workshop"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

                    {/* Floating Zoom Action */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-xs font-semibold text-accent backdrop-blur-md border border-accent/30 shadow-lg">
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Inspect Facility</span>
                    </div>

                    {/* Overlay Facility Telemetry */}
                    <div className="absolute bottom-4 left-4 right-4 text-onnavy">
                      <span className="inline-block rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent uppercase">
                        Operating Facility
                      </span>
                      <h3 className="mt-1 font-display text-base font-bold text-onnavy">
                        Dehu Gaon Manufacturing Works
                      </h3>
                      <p className="text-xs text-onnavy-muted line-clamp-1">
                        Plot No., Industrial Area, Pune - 412109, Maharashtra
                      </p>
                    </div>
                  </div>

                  {/* Plant Quick Facts Grid */}
                  <div className="mt-3.5 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                      <span className="text-[0.65rem] text-onnavy-muted uppercase block">Facility Base</span>
                      <strong className="font-display text-sm font-bold text-onnavy">Pune Works</strong>
                    </div>
                    <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                      <span className="text-[0.65rem] text-onnavy-muted uppercase block">Engineering</span>
                      <strong className="font-display text-sm font-bold text-accent">Turnkey SPM</strong>
                    </div>
                    <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                      <span className="text-[0.65rem] text-onnavy-muted uppercase block">QA Standard</span>
                      <strong className="font-display text-sm font-bold text-onnavy">ISO 9001</strong>
                    </div>
                  </div>
                </div>
              </InView>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE METRIC COUNTER STRIP */}
      {/* ========================================================================= */}
      <div className="border-y border-line bg-surface py-8">
        <Container>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line/60">
            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Engineering Legacy</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                25+ <span className="text-accent text-xl font-bold">Years</span>
              </p>
              <p className="mt-1 text-xs text-muted">Continuous shop-floor operations</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Machines Delivered</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                100+ <span className="text-accent text-xl font-bold">Builds</span>
              </p>
              <p className="mt-1 text-xs text-muted">Induction, conveyors & automation</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Sectors Served</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                07 <span className="text-accent text-xl font-bold">Industries</span>
              </p>
              <p className="mt-1 text-xs text-muted">Automotive, Food, Pharma & Process</p>
            </div>

            <div className="px-4 py-2 sm:py-0 text-center sm:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Quality Assurance</span>
              <p className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                100% <span className="text-accent text-xl font-bold">Tested</span>
              </p>
              <p className="mt-1 text-xs text-muted">Live parts verified in-house</p>
            </div>
          </div>
        </Container>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION 01: 25+ YEARS LEGACY — VISUAL EVOLUTION TIMELINE */}
      {/* ========================================================================= */}
      <Section grid>
        <InView>
          <SectionHead
            index="01"
            eyebrow="25+ Years Legacy"
            title="Our Evolution From Precision Tooling to Turnkey Automation"
            intro="A quarter-century journey of heavy engineering craft, technological investments, and zero-compromise precision in Pune."
          />
        </InView>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m, idx) => (
            <InView key={m.year} delay={idx * 100}>
              <div className="group h-full rounded-2xl border border-line bg-surface overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:border-accent/40 flex flex-col justify-between">
                <div>
                  {/* Milestone Photo Preview */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy">
                    {m.image ? (
                      <img
                        src={m.image}
                        alt={m.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-navy/90 px-3 py-1 text-xs font-bold text-accent border border-accent/30 shadow-md">
                        {m.tag}
                      </span>
                    </div>
                  </div>

                  {/* Milestone Content */}
                  <div className="p-6">
                    <span className="font-display text-3xl font-extrabold text-accent">{m.year}</span>
                    <h3 className="mt-2 font-display text-base font-bold text-foreground">{m.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{m.desc}</p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="border-t border-line pt-3 flex items-center justify-between text-xs font-semibold text-accent">
                    <span>MILESTONE PHASE 0{idx + 1}</span>
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 4. VISION & MISSION STRATEGIC BLUEPRINT CARDS */}
      {/* ========================================================================= */}
      {(company.vision || company.mission) && (
        <Section grid>
          <div className="grid gap-6 lg:grid-cols-2">
            {company.vision && (
              <InView>
                <div className="group relative h-full rounded-3xl border border-line bg-surface p-8 sm:p-10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-accent/40 flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Compass className="h-36 w-36 text-accent" />
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent" />

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 px-3.5 py-1 text-xs font-bold text-accent uppercase">
                        <Compass className="h-3.5 w-3.5" />
                        <span>Company Vision</span>
                      </div>
                      <span className="text-[0.65rem] font-bold text-muted uppercase tracking-wider">
                        Long-Term Strategy
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-xl sm:text-2xl font-extrabold text-foreground leading-snug">
                      "{company.vision}"
                    </h3>
                  </div>

                  <div className="mt-8 pt-4 border-t border-line flex items-center justify-between text-xs text-muted">
                    <span className="font-semibold text-foreground">Three Star Enterprises</span>
                    <span className="text-accent font-bold">Pune Works Strategy</span>
                  </div>
                </div>
              </InView>
            )}

            {company.mission && (
              <InView delay={100}>
                <div className="group relative h-full rounded-3xl border border-line bg-surface p-8 sm:p-10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-accent/40 flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Target className="h-36 w-36 text-accent" />
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent" />

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 px-3.5 py-1 text-xs font-bold text-accent uppercase">
                        <Target className="h-3.5 w-3.5" />
                        <span>Company Mission</span>
                      </div>
                      <span className="text-[0.65rem] font-bold text-muted uppercase tracking-wider">
                        Daily Commitment
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-xl sm:text-2xl font-extrabold text-foreground leading-snug">
                      "{company.mission}"
                    </h3>
                  </div>

                  <div className="mt-8 pt-4 border-t border-line flex items-center justify-between text-xs text-muted">
                    <span className="font-semibold text-foreground">Zero-Defect Standard</span>
                    <span className="text-accent font-bold">ISO 9001:2015 Execution</span>
                  </div>
                </div>
              </InView>
            )}
          </div>
        </Section>
      )}

      {/* ========================================================================= */}
      {/* 5. SECTION 02: INSIDE OUR PUNE WORKS (VIRTUAL SHOP-FLOOR TOUR + LIGHTBOX) */}
      {/* ========================================================================= */}
      <Section dark grid tight>
        <InView>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              dark
              index="02"
              eyebrow="Inside Our Works"
              title="Virtual Tour of Our Pune Manufacturing Bay"
              intro="Explore our in-house manufacturing infrastructure — from 3D computer design to heavy CNC machining and live FAT trials."
            />
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2.5 text-xs font-bold text-accent hover:bg-accent hover:text-navy transition-all mb-4"
            >
              <span>Explore Complete Photo Archive</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </InView>

        {/* 6-Card Shop-Floor Photo Tour Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plantPhotos.slice(1, 7).map((photo, i) => (
            <InView key={photo.title} delay={i * 90}>
              <div
                onClick={() => setLightboxIndex(i + 1)}
                className="group relative rounded-2xl border border-onnavy/15 bg-surface/5 overflow-hidden shadow-lg transition-all duration-300 hover:border-accent/60 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
              >
                {/* Photo Aspect Box */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-navy">
                  {photo.image ? (
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-onnavy-muted">
                      Photo Coming Soon
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-navy/90 border border-accent/30 px-3 py-1 text-[0.7rem] font-bold text-accent uppercase backdrop-blur-md">
                      {photo.category}
                    </span>
                  </div>

                  {/* Zoom Inspect Pill */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[0.65rem] font-bold text-navy shadow-lg">
                    <Maximize2 className="h-3 w-3" />
                    <span>Zoom</span>
                  </div>
                </div>

                {/* Card Text Footer */}
                <div className="p-6">
                  <h3 className="font-display text-base font-bold text-onnavy group-hover:text-accent transition-colors">
                    {photo.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-onnavy-muted line-clamp-2">
                    {photo.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-onnavy/10 flex items-center justify-between text-[0.7rem] font-bold text-accent">
                    <span>INSPECT FACILITY BAY</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 5. SECTION 03: THE 4 IN-HOUSE CRAFTSMANSHIP PILLARS */}
      {/* ========================================================================= */}
      <Section grid>
        <InView>
          <SectionHead
            index="03"
            eyebrow="Craftsmanship"
            title="The 4 In-House Manufacturing Pillars"
            intro="Why leading Tier-1 automotive and heavy equipment manufacturers trust Three Star Enterprises with their mission-critical machinery."
          />
        </InView>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, idx) => (
            <InView key={p.num} delay={idx * 100}>
              <div className="h-full rounded-2xl border border-line bg-surface p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-accent/40">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-extrabold text-accent">{p.num}</span>
                    <span className="rounded-full bg-navy px-3 py-1 text-[0.65rem] font-bold text-accent">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">{p.title}</h3>
                  <p className="mt-2.5 text-xs text-muted leading-relaxed">{p.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-xs font-semibold text-accent">
                  <span>PROVEN BENEFIT</span>
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 6. SECTION 04: VISUAL 5-STAGE MACHINE BUILDING PROTOCOL */}
      {/* ========================================================================= */}
      <Section dark tight grid>
        <InView>
          <SectionHead
            dark
            index="04"
            eyebrow="Build Protocol"
            title="How We Build Your Machine: 5-Stage Controlled Protocol"
            intro="A transparent, systematic route from your raw drawings to a tested, production-ready machine on your factory floor."
          />
        </InView>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stages.map((st, i) => (
            <InView key={st.step} delay={i * 80}>
              <div className="h-full rounded-2xl border border-onnavy/15 bg-surface/5 p-6 flex flex-col justify-between transition-all duration-300 hover:border-accent/40 hover:bg-surface/10">
                <div>
                  <div className="flex items-baseline justify-between border-b border-onnavy/10 pb-3">
                    <span className="font-display text-2xl font-extrabold text-accent">{st.step}</span>
                    <span className="text-[0.65rem] font-bold text-onnavy-muted uppercase tracking-wider">
                      {st.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-onnavy">{st.title}</h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-onnavy-muted">{st.body}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-onnavy/10 text-[0.7rem] font-bold text-accent flex items-center justify-between">
                  <span>GATE 0{i + 1} VERIFIED</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 7. SECTION 05: FOUNDER & WORKS LEADERSHIP QUALITY SPOTLIGHT */}
      {/* ========================================================================= */}
      <Section grid>
        <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12 lg:p-14 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent via-accent/60 to-transparent" />

          <div className="grid gap-10 lg:grid-cols-12 items-center">
            {/* Quote & Credentials */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 px-3.5 py-1 text-xs font-bold text-accent uppercase">
                <ShieldCheck className="h-4 w-4" />
                <span>Our Quality Commitment</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                Built in Pune. Engineered for Zero Downtime.
              </h2>

              <p className="text-base sm:text-lg text-muted leading-relaxed italic">
                “Every machine, conveyor, and automation system leaving our workshop is built with pride, thoroughly tested with real materials, and engineered to run reliably year after year on active factory floors.”
              </p>

              <div className="pt-2 border-t border-line flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    {company.contactPerson || "Founder & Head of Works"}
                  </h4>
                  <p className="text-xs text-accent font-semibold">Three Star Enterprises • Pune Works</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted font-medium">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    <span>Pune, Maharashtra</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-accent" />
                    <span>ISO 9001:2015</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Plant Visit & Contact Buttons */}
            <div className="lg:col-span-4 flex flex-col gap-3 rounded-2xl border border-line bg-background/60 p-6">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider text-center">
                Schedule a Visit or Consultation
              </span>
              <Btn to="/quote" variant="primary" full className="py-3.5 font-bold">
                Request Engineering Quote
              </Btn>
              <Btn to="/contact" variant="outline" full className="py-3.5">
                Contact Pune Workshop
              </Btn>
              <div className="mt-2 text-center text-[0.7rem] text-muted">
                Direct phone: <strong className="text-foreground">{company.phone}</strong>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 8. SECTION 06: CLOSING CTA BAND */}
      {/* ========================================================================= */}
      <Reveal>
        <CtaBand />
      </Reveal>

      {/* Full-Resolution Interactive Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          isOpen={lightboxIndex !== null}
          items={plantPhotos}
          currentIndex={lightboxIndex}
          onChangeIndex={(idx) => setLightboxIndex(idx)}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
