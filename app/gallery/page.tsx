"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GALLERY_CATEGORIES } from "@/data/site";
import { IMAGES } from "@/data/images";
import { Reveal, TechLabel, Btn, Lightbox, Badge, Container } from "@/components/site/ui";
import { CtaBand, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import { useSite } from "@/store/site-store";
import {
  Search,
  Maximize2,
  Sparkles,
  SlidersHorizontal,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
  ArrowRight,
  RotateCcw,
  Camera,
  Grid,
  LayoutGrid,
} from "lucide-react";

export default function GalleryPage() {
  const router = useRouter();
  const { gallery } = useSite();
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [layoutMode, setLayoutMode] = useState<"masonry" | "grid">("masonry");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Dynamic featured photo for hero spotlight (prioritizes featuredInHero, then featured)
  const featuredPhoto = useMemo(
    () => gallery.find((g) => g.featuredInHero || (g as any).featuredInHeader) || gallery.find((g) => g.featured),
    [gallery],
  );

  // Dynamically extract all unique categories from the gallery items in store
  const allCategories = useMemo(() => {
    const set = new Set(["All", ...GALLERY_CATEGORIES.filter((c) => c !== "All")]);
    gallery.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [gallery]);

  // Compute category count map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: gallery.length };
    gallery.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return counts;
  }, [gallery]);

  // Filter & Sort
  const filteredItems = useMemo(() => {
    let list = gallery.filter((g) => {
      const matchCat = cat === "All" || g.category === cat;
      const matchFeatured = !onlyFeatured || Boolean(g.featured);
      const matchSearch =
        !search.trim() ||
        g.title?.toLowerCase().includes(search.toLowerCase()) ||
        g.category?.toLowerCase().includes(search.toLowerCase()) ||
        g.description?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchFeatured && matchSearch;
    });

    if (sortBy === "featured") {
      list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sortBy === "alpha") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "alpha-desc") {
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
    }

    return list;
  }, [gallery, cat, onlyFeatured, search, sortBy]);

  const featuredTotal = useMemo(() => gallery.filter((g) => g.featured).length, [gallery]);

  // Prepare items for Lightbox
  const lightboxItems = useMemo(
    () =>
      filteredItems.map((g, i) => ({
        id: g.id || (g as any)._id || String(i),
        image: g.image || "",
        title: g.title,
        category: `${g.category || "Machinery"} • Photo #${i + 1}`,
        description: g.description,
      })),
    [filteredItems],
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION — UNIFIED ATMOSPHERIC DARK HERO WITH SPOTLIGHT CARD */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-navy pt-28 pb-20 text-onnavy sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-30" />
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Content */}
            <div className={featuredPhoto ? "lg:col-span-7" : "lg:col-span-12 max-w-5xl"}>
              <Reveal>
                {/* Live Telemetry Pill */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent backdrop-blur-md shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  <span>SHOP-FLOOR VISUAL ARCHIVE</span>
                  <span className="h-3 w-px bg-accent/40" />
                  <span className="text-onnavy-muted font-normal hidden sm:inline">
                    {gallery.length} High-Resolution Photographs
                  </span>
                </div>

                <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-onnavy leading-[1.1]">
                  Precision Machinery &amp; Tooling <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-hover to-white">
                    High&#8209;Resolution Shop&#8209;Floor Archive.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base sm:text-lg text-onnavy-muted leading-relaxed font-sans">
                  A comprehensive photographic record of custom induction hardening machines, automated material handling conveyors, robotic cells, and precision fixtures manufactured and FAT-trialled at our Pune works.
                </p>

                {/* Hero CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Btn
                    to="/quote#quote-form"
                    variant="primary"
                    className="text-xs sm:text-sm px-7 py-3.5 font-bold shadow-lg shadow-accent/25"
                  >
                    Submit Machinery RFQ
                  </Btn>
                  <a
                    href="#gallery-grid"
                    className="inline-flex items-center gap-2 rounded-xl border border-onnavy/30 bg-navy/80 hover:border-accent hover:text-accent px-5 py-3 text-xs sm:text-sm font-semibold transition-all"
                  >
                    <span>Explore Gallery Photos</span>
                    <span>↓</span>
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Hero Spotlight Photo Card (Active when a photo is featured) */}
            {featuredPhoto && (
              <div className="lg:col-span-5">
                <InView delay={120}>
                  <div
                    onClick={() => {
                      const fIndex = filteredItems.findIndex(
                        (item) => item.id === featuredPhoto.id || (item as any)._id === (featuredPhoto as any)._id,
                      );
                      setLightboxIndex(fIndex >= 0 ? fIndex : 0);
                    }}
                    className="group relative rounded-3xl border border-onnavy/20 bg-surface/5 p-4 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-accent/50 cursor-pointer"
                  >
                    {/* Photo Container */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-navy">
                      <img
                        src={featuredPhoto.image || IMAGES.verticalInduction}
                        alt={featuredPhoto.title || "Featured Visual Build"}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = IMAGES.verticalInduction;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

                      {/* Zoom Trigger */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const fIndex = filteredItems.findIndex(
                            (item) => item.id === featuredPhoto.id || (item as any)._id === (featuredPhoto as any)._id,
                          );
                          setLightboxIndex(fIndex >= 0 ? fIndex : 0);
                        }}
                        className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-xs font-semibold text-accent backdrop-blur-md border border-accent/30 shadow-lg hover:bg-accent hover:text-navy transition-all cursor-pointer z-10"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Inspect Photograph</span>
                      </button>

                      {/* Overlay Telemetry */}
                      <div className="absolute bottom-4 left-4 right-4 text-onnavy">
                        <div className="flex items-center gap-2">
                          <span className="inline-block rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent uppercase">
                            Featured Visual Build
                          </span>
                          <span className="text-[0.65rem] text-onnavy-muted font-sans">
                            {featuredPhoto.category}
                          </span>
                        </div>
                        <h3 className="mt-1 font-display text-base font-bold text-onnavy leading-snug group-hover:text-accent transition-colors">
                          {featuredPhoto.title}
                        </h3>
                        {featuredPhoto.description && (
                          <p className="mt-0.5 text-xs text-onnavy-muted leading-relaxed">
                            {featuredPhoto.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Facts Grid */}
                    <div className="mt-3.5 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Category</span>
                        <strong className="font-display text-xs font-bold text-accent truncate block">
                          {featuredPhoto.category || "Machinery"}
                        </strong>
                      </div>
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Status</span>
                        <strong className="font-display text-xs font-bold text-onnavy block">
                          Hero Build
                        </strong>
                      </div>
                      <div className="rounded-xl border border-onnavy/15 bg-navy/40 p-2.5">
                        <span className="text-[0.65rem] text-onnavy-muted uppercase block">Quality</span>
                        <strong className="font-display text-xs font-bold text-accent block">
                          HD Photo
                        </strong>
                      </div>
                    </div>
                  </div>
                </InView>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN GALLERY SECTION & INTERACTIVE FLOATING COMMAND DOCK */}
      {/* ========================================================================= */}
      <div id="gallery-grid" className="scroll-mt-12 bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header */}
          <InView>
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
              <div>
                <TechLabel tone="accent">Engineering Visuals</TechLabel>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Browse Machinery &amp; Tooling Records
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-muted max-w-xl">
                  Select any category to inspect close-up machining tolerances, component assemblies, and surface finishes in full-resolution lightbox.
                </p>
              </div>

              {/* Status Chips */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-foreground shadow-xs">
                  {String(filteredItems.length).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")} Photographs
                </span>
                <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent shadow-xs flex items-center gap-1">
                  <Sparkles className="h-3 w-3 fill-accent" />
                  <span>{featuredTotal} Featured</span>
                </span>
              </div>
            </div>
          </InView>

          {/* Interactive Floating Command & Filter Dock */}
          <InView delay={50}>
            <div className="rounded-3xl border border-line bg-surface shadow-sm p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[260px] max-w-md">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search machines, coils, fixtures, automation..."
                    className="w-full rounded-2xl border border-line bg-background pl-10 pr-9 py-2.5 text-xs font-medium text-foreground placeholder:text-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-3 text-xs text-muted hover:text-foreground cursor-pointer p-0.5"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Controls & Layout Toggles */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Featured Button */}
                  <button
                    type="button"
                    onClick={() => setOnlyFeatured(!onlyFeatured)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      onlyFeatured
                        ? "border-accent bg-accent text-navy font-bold shadow-sm"
                        : "border-line bg-background text-muted hover:border-line-strong hover:text-foreground"
                    }`}
                  >
                    <Sparkles className={`h-3 w-3 ${onlyFeatured ? "fill-navy" : "text-accent"}`} />
                    <span>Featured Only</span>
                    <span className="rounded-md bg-navy/10 px-1.5 py-0.5 text-[0.65rem] font-bold">
                      {featuredTotal}
                    </span>
                  </button>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-xl border border-line bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-accent cursor-pointer"
                    >
                      <option value="default">Default Order</option>
                      <option value="featured">Featured First</option>
                      <option value="alpha">Title (A-Z)</option>
                      <option value="alpha-desc">Title (Z-A)</option>
                    </select>
                  </div>

                  {/* Layout Mode Switcher */}
                  <div className="flex rounded-xl border border-line bg-background p-0.5">
                    <button
                      type="button"
                      onClick={() => setLayoutMode("masonry")}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        layoutMode === "masonry"
                          ? "bg-navy text-onnavy shadow-xs"
                          : "text-muted hover:text-foreground"
                      }`}
                      title="Masonry Mosaic Layout"
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Mosaic</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutMode("grid")}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        layoutMode === "grid"
                          ? "bg-navy text-onnavy shadow-xs"
                          : "text-muted hover:text-foreground"
                      }`}
                      title="Uniform Grid Layout"
                    >
                      <Grid className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Category Tabs */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-line">
                {allCategories.map((c) => {
                  const count = categoryCounts[c] || 0;
                  const active = cat === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCat(c);
                        setLightboxIndex(null);
                      }}
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        active
                          ? "border-accent bg-accent text-navy font-bold shadow-xs"
                          : "border-line bg-background text-muted hover:border-accent hover:text-foreground"
                      }`}
                    >
                      <span>{c}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[0.65rem] font-bold ${
                          active ? "bg-navy/15 text-navy" : "bg-line text-muted"
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

          {/* Active Filter Summary Bar */}
          {(cat !== "All" || onlyFeatured || search) && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted px-1">
              <p>
                Showing <strong className="text-foreground">{filteredItems.length}</strong> of{" "}
                {gallery.length} photographs
                {cat !== "All" ? ` in category "${cat}"` : ""}
                {onlyFeatured ? " (Featured builds only)" : ""}
                {search ? ` matching "${search}"` : ""}
              </p>
              <button
                type="button"
                onClick={() => {
                  setCat("All");
                  setOnlyFeatured(false);
                  setSearch("");
                }}
                className="text-accent underline hover:text-foreground text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Empty State */}
          {gallery.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-surface p-16 text-center shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl border border-accent/40 bg-accent/10 flex items-center justify-center text-accent">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">Archive is Updating</h3>
              <p className="mt-2 text-sm text-muted max-w-md mx-auto">
                No photographs are currently published in this view. Contact our Pune engineering team to request customized project photographs and machine specifications.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Btn to="/contact" variant="primary" className="text-xs px-6 py-3 font-bold">
                  Contact Our Engineering Team
                </Btn>
                <Btn to="/quote" variant="light" className="text-xs px-6 py-3 font-semibold">
                  Request Machinery Quote →
                </Btn>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-surface p-14 text-center">
              <TechLabel tone="accent">No Matches</TechLabel>
              <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                No photographs match the active filter criteria.
              </h3>
              <p className="mt-1 text-xs text-muted">
                Try selecting another category pill or clearing your search keywords.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCat("All");
                  setOnlyFeatured(false);
                  setSearch("");
                }}
                className="mt-5 rounded-xl border border-accent bg-accent/10 px-5 py-2.5 text-xs font-bold text-accent hover:bg-accent hover:text-navy transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* ========================================================================= */
            /* 3. GALLERY CARDS PRESENTATION */
            /* ========================================================================= */
            <div
              className={`${
                layoutMode === "masonry"
                  ? "columns-1 sm:columns-2 lg:columns-3 gap-6 [&>*]:mb-6"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              }`}
            >
              {filteredItems.map((g, i) => (
                <InView key={g.id || (g as any)._id || i} delay={Math.min(i % 3, 3) * 70}>
                  <figure
                    onClick={() => setLightboxIndex(i)}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl border border-line bg-surface shadow-xs transition-all duration-500 hover:shadow-2xl hover:border-accent/60 hover:-translate-y-1"
                  >
                    {/* Image Container */}
                    <div
                      className={`relative w-full overflow-hidden bg-navy ${
                        layoutMode === "grid"
                          ? "aspect-[16/11]"
                          : i % 5 === 0
                          ? "aspect-[4/5]"
                          : i % 3 === 0
                          ? "aspect-square"
                          : "aspect-[4/3]"
                      }`}
                    >
                      {g.image && g.image.trim() !== "" ? (
                        <img
                          src={g.image}
                          alt={g.title || "Shop-Floor Photograph"}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = IMAGES.spindleHardening;
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-onnavy-muted">
                          Three Star Engineering
                        </div>
                      )}

                      {/* Ambient Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="rounded-full border border-onnavy/30 bg-navy/80 px-2.5 py-0.5 text-[0.65rem] font-bold text-onnavy backdrop-blur-sm">
                          #{String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="rounded-full border border-accent/40 bg-navy/90 px-2 py-0.5 text-[0.62rem] font-bold text-accent backdrop-blur-sm">
                          SHOP BUILD
                        </span>
                      </div>

                      {g.featured && (
                        <span className="absolute top-3 right-3 rounded-full bg-accent text-navy font-bold px-2.5 py-0.5 text-[0.65rem] shadow-sm flex items-center gap-1">
                          <Sparkles className="h-3 w-3 fill-navy" />
                          <span>Featured</span>
                        </span>
                      )}

                      {/* Floating Inspection Trigger on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="rounded-full border border-accent bg-navy/90 text-accent px-4 py-2 text-xs font-bold backdrop-blur-sm shadow-xl flex items-center gap-2">
                          <Maximize2 className="h-3.5 w-3.5" />
                          <span>Inspect Full Resolution</span>
                        </div>
                      </div>
                    </div>

                    {/* Figcaption Info Card */}
                    <figcaption className="p-5 border-t border-line bg-surface flex flex-col justify-between">
                      <div>
                        <span className="text-[0.68rem] font-bold text-accent uppercase tracking-wider block">
                          {g.category}
                        </span>
                        <h3 className="mt-1 font-display text-base font-bold text-foreground leading-snug group-hover:text-accent transition-colors">
                          {g.title}
                        </h3>
                        {g.description && (
                          <p className="mt-2 text-xs text-muted leading-relaxed break-words">
                            {g.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-line flex items-center justify-between text-xs">
                        <span className="text-accent font-bold group-hover:underline flex items-center gap-1">
                          <span>Inspect Photo</span>
                          <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/quote?photo=${encodeURIComponent(g.title)}#quote-form`);
                          }}
                          className="rounded-lg bg-accent/10 border border-accent/30 px-2.5 py-1 text-[0.68rem] font-bold text-accent hover:bg-accent hover:text-navy transition-all cursor-pointer"
                        >
                          Request RFQ
                        </button>
                      </div>
                    </figcaption>
                  </figure>
                </InView>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. QUALITY VALIDATION & STANDARDS GUARANTEE MATRIX */}
      {/* ========================================================================= */}
      <div className="border-y border-line bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-line bg-background p-6 space-y-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Metrology</span>
              </div>
              <h4 className="font-display text-base font-bold text-foreground">3D Coordinate Measuring</h4>
              <p className="text-xs text-muted leading-relaxed">Sub-micron dimensional accuracy check across all manufactured fixtures.</p>
            </div>

            <div className="rounded-3xl border border-line bg-background p-6 space-y-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Activity className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Heat Treatment</span>
              </div>
              <h4 className="font-display text-base font-bold text-foreground">Ultrasonic NDT Scanning</h4>
              <p className="text-xs text-muted leading-relaxed">Precise case hardening depth validation conforming to DIN/ISO norms.</p>
            </div>

            <div className="rounded-3xl border border-line bg-background p-6 space-y-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Layers className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Precision Fit</span>
              </div>
              <h4 className="font-display text-base font-bold text-foreground">Ra &lt; 0.2µm Finish</h4>
              <p className="text-xs text-muted leading-relaxed">High-precision CNC cylindrical and surface ground machine interfaces.</p>
            </div>

            <div className="rounded-3xl border border-line bg-background p-6 space-y-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Shop-Floor Trials</span>
              </div>
              <h4 className="font-display text-base font-bold text-foreground">100% In-House FAT</h4>
              <p className="text-xs text-muted leading-relaxed">Full factory acceptance testing with client blanks before equipment dispatch.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FULL-SCREEN LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        items={lightboxItems}
        currentIndex={lightboxIndex || 0}
        onChangeIndex={(idx) => setLightboxIndex(idx)}
      />

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION */}
      {/* ========================================================================= */}
      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
