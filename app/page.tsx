"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { IMAGES } from "@/data/images";
import { NPI_STEPS } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Container, Reveal, SectionHead, TechLabel, Btn, Badge, Lightbox } from "@/components/site/ui";
import { CtaBand, ProjectCard, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import {
  ArrowUpRight,
  Maximize2,
  ChevronRight,
  Award,
  Check,
} from "lucide-react";

export default function HomePage() {
  const { home, services, industries, projects, gallery, faqs, testimonials, openRfqModal } = useSite();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxItems, setLightboxItems] = useState<any[]>([]);

  // Hero Spotlight Machines
  const heroSpotlightProjects = useMemo(() => {
    const featured = projects.filter((p) => p.featured);
    return featured.length > 0 ? featured.slice(0, 4) : projects.slice(0, 4);
  }, [projects]);

  const activeSpotlight = heroSpotlightProjects[spotlightIndex] || heroSpotlightProjects[0] || {
    title: "Vertical Induction Hardening Machine",
    category: "Induction Hardening",
    image: IMAGES.verticalInduction,
    specs: [{ label: "Max Power", value: "250 kW" }, { label: "Job Diameter", value: "30-400 mm" }],
    short: "Vertical scanning induction hardening setup for shafts and long components.",
  };

  // Categories for Our Work filter
  const allCategories = useMemo(() => {
    const cats = new Set(["All"]);
    projects.forEach((p) => {
      if (p.category) cats.add(p.category);
      else if (p.industry) cats.add(p.industry);
    });
    return Array.from(cats).slice(0, 6);
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") {
      return projects.slice(0, 6);
    }
    return projects
      .filter((p) => p.category === selectedCategory || p.industry === selectedCategory)
      .slice(0, 6);
  }, [projects, selectedCategory]);

  // Marquee visual items combining featured projects & gallery
  const visualReelItems = useMemo(() => {
    const items = [
      {
        title: "Vertical Induction Scanner",
        category: "Induction Hardening",
        image: IMAGES.verticalInduction,
      },
      {
        title: "High-Temp Induction Coil Glow",
        category: "Precision Heat Treat",
        image: IMAGES.galleryInductionGlow,
      },
      {
        title: "Heavy Chain Conveyor (1200°C)",
        category: "Material Handling",
        image: IMAGES.forgeToTrim,
      },
      {
        title: "Crank Shaft Hardening Station",
        category: "Machine Building",
        image: IMAGES.crankShaft,
      },
      {
        title: "Automated Billet Loader System",
        category: "Automation",
        image: IMAGES.autoBilletLoader,
      },
      {
        title: "Dual Spindle Induction Rig",
        category: "Induction Hardening",
        image: IMAGES.dualSpindle,
      },
      {
        title: "Food Grade Modular Conveyor",
        category: "Conveyors",
        image: IMAGES.modularConveyor,
      },
      {
        title: "Eddy Current Surface Inspection",
        category: "Inspection Automation",
        image: IMAGES.eddyCurrent,
      },
      {
        title: "Wire Mesh Billet Feed Conveyor",
        category: "Material Handling",
        image: IMAGES.wireMeshConveyor,
      },
      {
        title: "Precision Metrology Bench",
        category: "FAT Quality Testing",
        image: IMAGES.galleryInspection,
      },
    ];
    return items;
  }, []);

  // Gallery Showcase items from store (filter out items with empty image URLs)
  const galleryMosaicItems = useMemo(() => {
    const valid = (gallery || []).filter(
      (g) => Boolean(g?.image && typeof g.image === "string" && g.image.trim() !== "")
    );
    if (valid.length > 0) {
      return valid.slice(0, 6);
    }
    return [
      {
        title: "Vertical Induction Hardening Machine Assembly",
        category: "Machines",
        image: IMAGES.verticalInduction,
        description: "Full assembly and testing of vertical induction scanner at Pune works.",
      },
      {
        title: "Precision Induction Heating Coil Glow",
        category: "Engineering",
        image: IMAGES.galleryInductionGlow,
        description: "High frequency induction coil hardening cycle on rotational components.",
      },
      {
        title: "Crank Shaft Inductor & Quench Mechanism",
        category: "Manufacturing",
        image: IMAGES.crankShaft,
        description: "Custom crankshaft journal inductor setup and precision quench manifold.",
      },
      {
        title: "Automated Billet Loader Station",
        category: "Automation",
        image: IMAGES.autoBilletLoader,
        description: "Pneumatic billet feeder mechanism engineered for high-temp forging lines.",
      },
      {
        title: "Modular Slat Conveyor Assembly",
        category: "Conveyors",
        image: IMAGES.modularConveyor,
        description: "Modular slat conveyor with integrated optical sensor gates for line transfer.",
      },
      {
        title: "Precision Metrology & Inspection Bench",
        category: "Testing",
        image: IMAGES.galleryInspection,
        description: "Laser alignment and dimensional verification bench at Pune plant.",
      },
    ];
  }, [gallery]);

  // Handle open lightbox
  const handleOpenLightbox = (items: any[], index: number) => {
    setLightboxItems(items);
    setLightboxIndex(index);
  };

  return (
    <>
      {/* HERO SECTION — HIGH IMPACT VISUAL ENGINEERING SHOWCASE */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-navy pt-28 pb-20 text-onnavy sm:pt-36 sm:pb-28">
        {/* Background Image & Atmospheric Lighting */}
        <img
          src={IMAGES.hero}
          alt="Industrial engineering facility"
          className="absolute inset-0 h-full w-full object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/75" />
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-40" />

        {/* Ambient Glow Elements */}
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7">
              <Reveal>
                {/* Live Telemetry Pill */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent backdrop-blur-md shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  <span>{home.eyebrow || "ENGINEERING • DESIGN • MANUFACTURING"}</span>
                  <span className="h-3 w-px bg-accent/40" />
                  <span className="text-onnavy-muted font-normal hidden sm:inline">
                    Design • In-House Build • 100% Live Trials
                  </span>
                </div>

                <h1 className="mt-6 font-display text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-[3.85rem] text-onnavy">
                  {home.heroTitle || "We Turn Engineering Ideas Into Reliable Machines."}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-onnavy-muted sm:text-lg">
                  {home.heroSubtitle ||
                    "Custom machine design, complete in-house manufacturing, and live testing for factories and equipment makers worldwide."}
                </p>

                {/* Hero CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Btn
                    variant="primary"
                    className="text-sm px-7 py-3.5 font-bold"
                    onClick={() => openRfqModal({ project: "General Machine Inquiry" })}
                  >
                    {home.primaryCta || "Get a Free Quote"}
                  </Btn>
                  <Btn to="/projects" variant="light" className="text-sm px-7 py-3.5">
                    {home.secondaryCta || "See Our Work"}
                  </Btn>
                </div>

                {/* Live Dynamic Metric Strip */}
                <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 border-t border-onnavy/15 pt-8">
                  {[
                    { value: "40+", label: "Machines Delivered", sub: "Active on factory floors" },
                    { value: "25+", label: "Years Experience", sub: "Hands-on engineering" },
                    { value: `${industries.length}`, label: "Industry Sectors", sub: "Automotive, Food, Pharma" },
                    { value: "100%", label: "Tested In-House", sub: "Live trials with parts" },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-onnavy/15 bg-navy-deep/60 p-3.5 backdrop-blur-sm transition-all hover:border-accent/40"
                    >
                      <span className="font-display text-2xl font-extrabold text-accent sm:text-3xl">
                        {s.value}
                      </span>
                      <p className="mt-1 font-sans text-xs font-bold text-onnavy">
                        {s.label}
                      </p>
                      <p className="text-[0.68rem] text-onnavy-muted hidden sm:block leading-tight mt-0.5">
                        {s.sub}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Hero Right Visual Machine Spotlight */}
            <div className="lg:col-span-5">
              <Reveal className="delay-100">
                <div className="relative rounded-2xl border border-onnavy/20 bg-navy-deep/90 p-5 backdrop-blur-md shadow-2xl overflow-hidden transition-all hover:border-accent/50">
                  {/* Spotlight Top Bar */}
                  <div className="flex items-center justify-between border-b border-onnavy/15 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <span className="font-sans text-xs font-bold text-accent uppercase tracking-wider">
                        Machine Spotlight
                      </span>
                    </div>
                    <span className="font-sans text-[0.7rem] text-onnavy-muted font-medium">
                      Built & Delivered in Pune
                    </span>
                  </div>

                  {/* Active Spotlight Image with Interactive Lightbox Trigger */}
                  <div
                    className="group relative mt-4 aspect-[16/11] overflow-hidden rounded-xl bg-navy cursor-pointer"
                    onClick={() =>
                      handleOpenLightbox(
                        heroSpotlightProjects.map((p) => ({
                          image: p.image || IMAGES.verticalInduction,
                          title: p.title,
                          category: p.category,
                          description: p.short || p.overview,
                        })),
                        spotlightIndex,
                      )
                    }
                  >
                    {activeSpotlight.image || IMAGES.verticalInduction ? (
                      <img
                        src={activeSpotlight.image || IMAGES.verticalInduction}
                        alt={activeSpotlight.title || "Machine Spotlight"}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-navy-deep font-sans text-xs text-onnavy-muted">
                        Machine Spotlight
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                    {/* Spotlight Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge variant="accent">{activeSpotlight.category || "Induction Hardening"}</Badge>
                    </div>

                    <div className="absolute bottom-3 right-3 rounded-lg bg-navy/90 border border-accent/40 px-3 py-1.5 text-xs font-semibold text-accent backdrop-blur-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Inspect Photo</span>
                    </div>
                  </div>

                  {/* Active Spotlight Details */}
                  <div className="mt-4">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-onnavy leading-snug">
                      {activeSpotlight.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-onnavy-muted line-clamp-2 leading-relaxed">
                      {activeSpotlight.short || activeSpotlight.overview}
                    </p>

                    {/* Quick Specs Chips */}
                    {activeSpotlight.specs && activeSpotlight.specs.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {activeSpotlight.specs.slice(0, 2).map((spec: any, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-onnavy/10 bg-navy/60 p-2 text-xs"
                          >
                            <span className="text-[0.65rem] text-onnavy-muted uppercase block">{spec.label}</span>
                            <span className="font-bold text-onnavy font-sans truncate block">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Spotlight Selector Tabs */}
                  {heroSpotlightProjects.length > 1 && (
                    <div className="mt-4 pt-3 border-t border-onnavy/15 flex items-center justify-between">
                      <span className="text-[0.7rem] text-onnavy-muted font-medium">Select Build:</span>
                      <div className="flex items-center gap-1.5">
                        {heroSpotlightProjects.map((p, idx) => (
                          <button
                            key={p.id || idx}
                            type="button"
                            onClick={() => setSpotlightIndex(idx)}
                            className={`h-2.5 rounded-full transition-all cursor-pointer ${
                              idx === spotlightIndex
                                ? "w-7 bg-accent"
                                : "w-2.5 bg-onnavy/30 hover:bg-onnavy/60"
                            }`}
                            aria-label={`Select ${p.title}`}
                          />
                        ))}
                      </div>
                      <Link
                        href={`/projects/${activeSpotlight.id || (activeSpotlight as any)._id || ""}`}
                        className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                      >
                        <span>Full Specs</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* CONTINUOUS VISUAL REEL / MACHINE MARQUEE STREAM */}
      <div className="relative border-y border-line bg-surface py-5 overflow-hidden shadow-xs select-none">
        <div className="animate-marquee hover:[animation-play-state:paused] gap-4 items-center flex">
          {[...visualReelItems, ...visualReelItems].map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleOpenLightbox(visualReelItems, idx % visualReelItems.length)}
              className="group flex items-center gap-3 rounded-xl border border-line bg-background p-2 pr-4 transition-all duration-300 hover:border-accent hover:shadow-md hover:bg-surface cursor-pointer shrink-0"
            >
              <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-navy shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title || "Machine build"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-115"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-navy text-[0.65rem] font-bold text-accent">
                    3S
                  </div>
                )}
              </div>
              <div>
                <span className="font-sans text-[0.65rem] font-bold text-accent uppercase tracking-wider block">
                  {item.category}
                </span>
                <p className="font-display text-xs font-bold text-foreground truncate max-w-[160px] group-hover:text-accent transition-colors">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED WORK & MACHINERY PORTFOLIO (OUR WORK - CORE SECTION) */}
      <Section grid className="scroll-mt-12" id="our-work">
        <InView>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <SectionHead
              index="01"
              eyebrow="Our Work"
              title="Machines & Turnkey Automation Built by Three Star"
              intro="Browse real machinery, induction hardening rigs, conveyors, and custom assembly setups engineered and tested in our Pune workshop."
            />

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const count =
                  cat === "All"
                    ? projects.length
                    : projects.filter((p) => p.category === cat || p.industry === cat).length;
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-sans text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                      active
                        ? "border-accent bg-accent text-navy font-bold shadow-sm shadow-accent/20"
                        : "border-line bg-surface text-muted hover:border-accent hover:text-foreground"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[0.68rem] px-1.5 py-0.5 rounded-full font-bold ${
                        active ? "bg-navy text-accent" : "bg-background text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </InView>

        {/* Project Cards Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p, i) => (
            <InView key={p.id || i} delay={(i % 3) * 80}>
              <ProjectCard project={p} index={i} />
            </InView>
          ))}
        </div>

        {/* Explore All Builds Action */}
        <div className="mt-12 text-center">
          <Btn to="/projects" variant="outline" className="px-8 py-4 text-sm font-bold rounded-xl">
            View All Delivered Machines ({projects.length}+ Builds)
          </Btn>
        </div>
      </Section>

      {/* SHOP-FLOOR & LIVE WORKS VISUAL GALLERY (IMAGE DENSE MOSAIC) */}
      <Section dark grid tight>
        <InView>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-onnavy/15 pb-8">
            <SectionHead
              dark
              index="02"
              eyebrow="Shop-Floor Archive"
              title="Inside Our Pune Works & Machinery Assembly Bay"
              intro="A visual showcase of high-frequency induction glow, CNC tooling, metrology inspection, and live factory acceptance trials."
            />
            <Btn to="/gallery" variant="light" className="text-xs">
              <span>View Full Gallery ({gallery.length || 10}+ Photos)</span>
            </Btn>
          </div>
        </InView>

        {/* Photo Mosaic Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryMosaicItems.map((item, idx) => (
            <InView key={item.id || idx} delay={idx * 70}>
              <div
                onClick={() =>
                  handleOpenLightbox(
                    galleryMosaicItems.map((g) => ({
                      image: g.image,
                      title: g.title,
                      category: g.category,
                      description: g.description || g.caption,
                    })),
                    idx,
                  )
                }
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-onnavy/15 bg-navy-soft shadow-lg transition-all duration-300 hover:border-accent hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[16/11] overflow-hidden bg-navy-deep">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || "Shop floor photograph"}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-navy-deep font-sans text-xs text-onnavy-muted">
                      Three Star Works
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent opacity-60 transition-opacity group-hover:opacity-90" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="navy">{item.category}</Badge>
                  </div>

                  {/* Hover Inspect Pill */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="rounded-xl border border-accent bg-navy/90 text-accent px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xl flex items-center gap-2">
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Inspect Full Resolution</span>
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-display text-base font-bold text-onnavy group-hover:text-accent transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1.5 text-xs text-onnavy-muted line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* VISUAL INDUSTRY SOLUTIONS (PHOTO-DRIVEN SECTOR CARDS) */}
      <Section grid>
        <InView>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <SectionHead
              index="03"
              eyebrow="Industries Served"
              title={`Tailored Machinery Across ${industries.length} Key Industrial Sectors`}
              intro="Custom equipment engineered to meet the stringent cycle time, safety, and hygiene demands of each industry."
            />
            <Btn to="/industries" variant="outline">
              Explore All Industries
            </Btn>
          </div>
        </InView>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.slice(0, 6).map((ind, i) => (
            <InView key={ind.id} delay={i * 70}>
              <Link
                href={`/industries`}
                className="group relative overflow-hidden rounded-2xl border border-line bg-navy shadow-md transition-all duration-300 hover:shadow-xl hover:border-accent/60 flex flex-col justify-between aspect-[4/3]"
              >
                {ind.image ? (
                  <img
                    src={ind.image}
                    alt={ind.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                ) : (
                  <div className="absolute inset-0 bg-navy-deep" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/20 opacity-85 transition-opacity group-hover:opacity-95" />

                <div className="relative p-5 z-10">
                  <Badge variant="accent">{`Sector 0${i + 1}`}</Badge>
                </div>

                <div className="relative p-5 z-10">
                  <h3 className="font-display text-xl font-bold text-onnavy group-hover:text-accent transition-colors leading-snug">
                    {ind.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-onnavy-muted line-clamp-2 leading-relaxed">
                    {ind.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {ind.capabilities.slice(0, 2).map((cap) => (
                      <span
                        key={cap}
                        className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-medium text-onnavy backdrop-blur-sm"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </InView>
          ))}
        </div>
      </Section>

      {/* ENGINEERING CRAFTSMANSHIP PILLARS (PHOTO-SPLIT HIGHLIGHTS) */}
      <Section dark tight grid>
        <InView>
          <SectionHead
            dark
            index="04"
            eyebrow="Craftsmanship"
            title={home.aboutHeading || "Complete In-House Capability Under One Roof"}
            intro="Why Pune's top manufacturing plants partner with Three Star Enterprises for turnkey machinery."
          />
        </InView>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "3D CAD & Blueprint Design",
              desc: "Complete 3D computer models, assembly layouts, and precision 2D part drawings verified before cutting metal.",
              image: IMAGES.blueprints,
              tag: "Design Bureau",
            },
            {
              title: "In-House CNC & Fabrication",
              desc: "Heavy steel frames, high-precision machining, welding, and stress relieving performed in our Pune workshop.",
              image: IMAGES.about,
              tag: "Machining Works",
            },
            {
              title: "Turnkey Assembly & Controls",
              desc: "Mechanical fitting, electrical wiring, PLC programming, pneumatic routing, and sensor interlocks.",
              image: IMAGES.pageCapabilities,
              tag: "Assembly Bay",
            },
            {
              title: "100% In-House FAT Testing",
              desc: "Every single machine is powered up and trialled with your actual parts to prove cycle time and quality before dispatch.",
              image: IMAGES.metrology,
              tag: "Quality Inspection",
            },
          ].map((card, i) => (
            <InView key={card.title} delay={i * 80}>
              <div className="group rounded-2xl border border-onnavy/15 bg-navy-soft overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-xl flex flex-col justify-between h-full">
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-deep">
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-navy-deep font-sans text-xs text-onnavy-muted">
                      Capability
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-navy/85 border border-onnavy/20 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent">
                      {card.tag}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-onnavy leading-snug">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs text-onnavy-muted leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-onnavy/10 flex items-center text-xs font-semibold text-accent">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    <span>Verified In-House</span>
                  </div>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* MACHINE BUILDING PROCESS (STEP-BY-STEP VISUAL TIMELINE) */}
      <Section grid>
        <InView>
          <SectionHead
            index="05"
            eyebrow="Our Process"
            title="How We Build Your Machine (Step-by-Step)"
            intro="A simple, organized approach that guarantees your machine is built right, tested thoroughly, and delivered on time."
          />
        </InView>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NPI_STEPS.slice(0, 4).map((step, i) => (
            <InView key={step.step} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-accent/40">
                <div>
                  <span className="font-display text-3xl font-extrabold text-accent">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-base font-bold text-foreground">
                    {step.step.replace(/^\d+\.\s*/, "")}
                  </h3>
                  <p className="mt-2.5 text-xs text-muted leading-relaxed">{step.body}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-line text-[0.7rem] font-semibold text-accent flex items-center justify-between">
                  <span>STAGE {i + 1} OF 4</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      {/* CLIENT TESTIMONIALS & TRUST PROOF */}
      <Section dark tight grid>
        <InView>
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-sans text-xs font-bold text-accent uppercase tracking-wider px-3 py-1 rounded-full bg-accent/10 border border-accent/30 inline-block mb-3">
              Client Feedback
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-onnavy">
              {home.clientsHeading || "Trusted by Equipment Manufacturers & Industrial Leaders"}
            </h2>
          </div>
        </InView>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
          {testimonials.map((t, idx) => (
            <InView key={t.id || idx} delay={idx * 80}>
              <div className="rounded-2xl border border-onnavy/15 bg-navy-soft p-6 sm:p-7 flex flex-col justify-between h-full shadow-lg">
                <p className="text-sm sm:text-base leading-relaxed text-onnavy-muted italic">
                  "{t.quote}"
                </p>
                <div className="mt-6 pt-4 border-t border-onnavy/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-onnavy">{t.author}</h4>
                    <p className="text-xs text-accent font-medium mt-0.5">{t.role}</p>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                    <Award className="h-4 w-4" />
                  </div>
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
            index="06"
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            intro="Quick answers to common questions about our custom machines, project timelines, testing, and pricing."
          />
        </InView>

        <div className="mt-10 max-w-3xl space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <InView key={idx} delay={idx * 40}>
                <div className="rounded-2xl border border-line bg-surface overflow-hidden transition-all hover:border-accent/40 shadow-xs">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display font-semibold text-foreground sm:text-base hover:text-accent transition-colors cursor-pointer"
                  >
                    <span className="break-words min-w-0 flex-1">{faq.q || faq.question}</span>
                    <span className="text-accent font-sans text-lg font-bold shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-sm leading-relaxed text-muted border-t border-line break-words">
                      {faq.a || faq.answer}
                    </div>
                  )}
                </div>
              </InView>
            );
          })}
        </div>
      </Section>

      {/* CLOSING RFQ CTA BAND */}
      <Reveal>
        <CtaBand />
      </Reveal>

      {/* GLOBAL LIGHTBOX MODAL */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        items={lightboxItems}
        currentIndex={lightboxIndex || 0}
        onChangeIndex={(idx) => setLightboxIndex(idx)}
      />
    </>
  );
}
