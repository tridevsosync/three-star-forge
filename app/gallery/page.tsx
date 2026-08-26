"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GALLERY_CATEGORIES } from "@/data/site";
import { Reveal, TechLabel, Btn, Lightbox } from "@/components/site/ui";
import { CtaBand } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import { useSite } from "@/store/site-store";

export default function GalleryPage() {
  const { gallery } = useSite();
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [layoutMode, setLayoutMode] = useState("masonry"); // 'masonry' | 'grid'
  const [lightboxIndex, setLightboxIndex] = useState(null);

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
    const counts = { All: gallery.length };
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

  return (
    <>
      {/* Ultra-Premium Precision Hero */}
      <div className="relative border-b border-line bg-navy text-onnavy blueprint-grid-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-transparent z-0" />
        
        {/* Subtle Ambient Laser Glow */}
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-semibold tracking-widest text-accent uppercase border border-accent/40 bg-accent/10 px-3 py-1">
                  ARCHIVE // 06
                </span>
                <span className="font-mono text-xs text-onnavy-muted uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  ISO 9001:2015 Spec Verified
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-onnavy leading-[1.1]">
                Shop-Floor Engineering & Machinery Archive.
              </h1>

              <p className="text-sm sm:text-base text-onnavy-muted leading-relaxed max-w-2xl">
                A high-resolution visual record of custom induction hardening machines, precision fixtures, robotic tooling, and turnkey automation lines engineered and trialled in our Pune plant.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Btn to="/contact" variant="primary">
                  Submit Machinery RFQ
                </Btn>
                <a
                  href="#gallery-grid"
                  className="inline-flex items-center gap-2 border border-onnavy/30 bg-navy/80 hover:border-accent hover:text-accent px-5 py-3 font-mono text-xs uppercase tracking-wider transition-all"
                >
                  <span>Explore Gallery</span>
                  <span>↓</span>
                </a>
              </div>
            </div>

            {/* Hero Right Metrics Box */}
            <div className="lg:col-span-5">
              <div className="border border-onnavy/20 bg-navy-deep/80 backdrop-blur-md p-6 sm:p-8 corner-marks-dark shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-onnavy/10 pb-4">
                  <span className="tech-label text-accent">Visual Portfolio Status</span>
                  <span className="font-mono text-xs text-success flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-success animate-ping" />
                    Live Cloud Sync
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-onnavy/10 bg-navy/60 p-4">
                    <span className="tech-label text-onnavy-muted text-[0.65rem]">Total Photographs</span>
                    <p className="mt-1 font-display text-3xl font-bold text-onnavy">{gallery.length}</p>
                    <span className="text-[0.68rem] font-mono text-accent">Shop Floor Records</span>
                  </div>
                  <div className="border border-onnavy/10 bg-navy/60 p-4">
                    <span className="tech-label text-accent text-[0.65rem]">Featured Builds</span>
                    <p className="mt-1 font-display text-3xl font-bold text-accent">{featuredTotal}</p>
                    <span className="text-[0.68rem] font-mono text-onnavy-muted">Flagship Systems</span>
                  </div>
                </div>

                <div className="pt-2 text-xs font-mono text-onnavy-muted flex items-center justify-between">
                  <span>Categories: <strong className="text-onnavy">{allCategories.length - 1} Specializations</strong></span>
                  <span>Media Quality: <strong className="text-accent">Ultra-HD 4K</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Showcase Section */}
      <div id="gallery-grid" className="scroll-mt-12 bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header */}
          <InView>
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
              <div>
                <span className="tech-label text-accent">Engineering Visuals</span>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Browse Machine & Tooling Archive
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-muted max-w-xl">
                  Select any category to inspect close-up machining tolerances, component assemblies, and surface finishes in full-resolution lightbox.
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2.5">
                <span className="border border-line bg-surface px-3 py-1 font-mono text-xs font-semibold text-foreground">
                  {String(filteredItems.length).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")} DISPLAYED
                </span>
                <span className="border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs font-semibold text-accent">
                  ★ {featuredTotal} FEATURED
                </span>
              </div>
            </div>
          </InView>

          {/* Interactive Floating Command & Filter Dock */}
          <InView delay={50}>
            <div className="border border-line bg-surface shadow-md p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[260px] max-w-md">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search machines, coils, fixtures, automation..."
                    className="w-full border border-line bg-background pl-9 pr-8 py-2.5 text-xs text-foreground placeholder:text-muted outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                  <svg
                    className="absolute left-3 top-3 h-4 w-4 text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-2.5 text-xs text-muted hover:text-foreground p-0.5"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Controls & Layout Toggles */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Featured Button */}
                  <button
                    type="button"
                    onClick={() => setOnlyFeatured(!onlyFeatured)}
                    className={`inline-flex items-center gap-2 border px-3.5 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
                      onlyFeatured
                        ? "border-accent bg-accent text-navy font-bold shadow-sm"
                        : "border-line bg-background text-muted hover:border-line-strong hover:text-foreground"
                    }`}
                  >
                    <span>★ Featured Only</span>
                    <span className="font-mono text-[0.65rem]">({featuredTotal})</span>
                  </button>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="tech-label text-muted text-[0.65rem] hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-line bg-background px-3 py-2 font-mono text-xs text-foreground outline-none focus:border-accent"
                    >
                      <option value="default">Default Archive Order</option>
                      <option value="featured">Featured First</option>
                      <option value="alpha">Title (A-Z)</option>
                      <option value="alpha-desc">Title (Z-A)</option>
                    </select>
                  </div>

                  {/* Layout Mode Switcher */}
                  <div className="flex border border-line bg-background">
                    <button
                      type="button"
                      onClick={() => setLayoutMode("masonry")}
                      className={`px-3 py-2 text-xs font-mono uppercase transition-colors ${
                        layoutMode === "masonry" ? "bg-navy text-onnavy font-semibold" : "text-muted hover:text-foreground"
                      }`}
                      title="Masonry Mosaic Layout"
                    >
                      Mosaic
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutMode("grid")}
                      className={`px-3 py-2 text-xs font-mono uppercase transition-colors ${
                        layoutMode === "grid" ? "bg-navy text-onnavy font-semibold" : "text-muted hover:text-foreground"
                      }`}
                      title="Uniform Technical Grid"
                    >
                      Grid
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Category Tabs */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-line">
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
                      className={`inline-flex items-center gap-2 border px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                        active
                          ? "border-accent bg-navy text-accent shadow-sm ring-1 ring-accent"
                          : "border-line text-muted hover:border-accent/60 hover:text-foreground bg-background"
                      }`}
                    >
                      <span>{c}</span>
                      <span
                        className={`font-mono text-[0.65rem] px-1.5 py-0.5 rounded ${
                          active ? "bg-accent/20 text-accent font-bold" : "bg-line text-muted"
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

          {/* Active Filter Indicators / Clear */}
          {(cat !== "All" || onlyFeatured || search) && (
            <div className="flex items-center justify-between text-xs text-muted font-mono px-1">
              <p>
                Showing <strong className="text-foreground">{filteredItems.length}</strong> of {gallery.length} photographs
                {cat !== "All" ? ` in "${cat}"` : ""}
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
                className="text-accent underline hover:text-foreground text-xs uppercase tracking-wider font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Empty State */}
          {gallery.length === 0 ? (
            <div className="border border-dashed border-line bg-surface p-16 text-center shadow-sm">
              <div className="w-14 h-14 mx-auto border border-accent/40 bg-accent/10 flex items-center justify-center text-accent">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">Archive is Currently Empty</h3>
              <p className="mt-2 text-sm text-muted max-w-md mx-auto">
                No photographs are published in the database yet. You can upload custom build photos via the Admin Panel.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="border border-accent bg-accent text-navy px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-accent-hover transition-colors"
                >
                  Contact Our Engineering Team
                </Link>
                <Link
                  href="/admin/gallery"
                  className="border border-line bg-surface px-5 py-2.5 font-mono text-xs font-semibold text-foreground hover:border-accent transition-colors"
                >
                  Go to Admin Panel →
                </Link>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="border border-dashed border-line bg-surface p-14 text-center">
              <TechLabel>No Match Found</TechLabel>
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
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
                className="mt-5 border border-accent bg-accent/10 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent hover:bg-accent hover:text-navy transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Gallery Cards Presentation */
            <div
              className={`${
                layoutMode === "masonry"
                  ? "columns-1 sm:columns-2 lg:columns-3 gap-6 [&>*]:mb-6"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              }`}
            >
              {filteredItems.map((g, i) => (
                <InView key={g.id || g._id || i} delay={Math.min(i % 3, 3) * 70}>
                  <figure
                    onClick={() => setLightboxIndex(i)}
                    className="group relative cursor-pointer overflow-hidden border border-line bg-navy corner-marks shadow-md transition-all duration-500 hover:shadow-2xl hover:border-accent/80 hover:-translate-y-1"
                  >
                    {/* Image Container */}
                    <div
                      className={`relative w-full overflow-hidden bg-navy-deep ${
                        layoutMode === "grid"
                          ? "aspect-[16/11]"
                          : i % 5 === 0
                          ? "aspect-[4/5]"
                          : i % 3 === 0
                          ? "aspect-square"
                          : "aspect-[4/3]"
                      }`}
                    >
                      <img
                        src={g.image}
                        alt={g.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      
                      {/* Gradient Ambient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/35 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-95" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="font-mono text-[0.62rem] text-onnavy border border-onnavy/30 bg-navy/80 px-2 py-0.5 backdrop-blur-sm">
                          #{String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-[0.58rem] text-accent border border-accent/40 bg-navy/90 px-1.5 py-0.5 backdrop-blur-sm">
                            HD SPEC
                          </span>
                      </div>

                      {g.featured && (
                        <span className="tech-label absolute top-3 right-3 border border-accent/70 bg-accent text-navy font-bold px-2 py-0.5 text-[0.65rem] shadow-sm">
                          ★ Featured
                        </span>
                      )}

                      {/* Floating Inspection Trigger on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="border border-accent bg-navy/90 text-accent px-4 py-2 font-mono text-xs uppercase tracking-wider backdrop-blur-sm shadow-xl flex items-center gap-2">
                          <span>Inspect Full Resolution</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Figcaption Info Card */}
                    <figcaption className="p-4 sm:p-5 border-t border-onnavy/10 bg-navy flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="tech-label text-accent font-semibold text-[0.68rem] tracking-widest">
                            {g.category}
                          </span>
                          <span className="font-mono text-[0.62rem] text-onnavy-muted/60">
                            SPEC PROOF
                          </span>
                        </div>
                        <h3 className="mt-1 text-sm sm:text-base font-bold text-onnavy leading-snug group-hover:text-accent transition-colors">
                          {g.title}
                        </h3>
                        {g.description && (
                          <p className="mt-1.5 text-xs text-onnavy-muted/85 line-clamp-2 leading-relaxed">
                            {g.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-onnavy/10 flex items-center justify-between text-[0.68rem] font-mono text-onnavy-muted">
                        <span className="text-accent hover:underline flex items-center gap-1">
                          <span>View Blueprint Details</span>
                          <span>→</span>
                        </span>
                        <span className="text-onnavy-muted/60">THREE STAR FORGE</span>
                      </div>
                    </figcaption>
                  </figure>
                </InView>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Engineering Quality Validation Band */}
      <div className="border-y border-line bg-surface py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-l-2 border-accent pl-4 space-y-1">
              <span className="tech-label text-accent text-[0.65rem]">Verification Standard</span>
              <h4 className="font-display text-sm font-bold text-foreground">3D Coordinate Measuring</h4>
              <p className="text-xs text-muted leading-relaxed">Sub-micron dimensional accuracy check across all manufactured fixtures.</p>
            </div>
            <div className="border-l-2 border-line-strong pl-4 space-y-1">
              <span className="tech-label text-muted text-[0.65rem]">Heat Treat Depth</span>
              <h4 className="font-display text-sm font-bold text-foreground">Ultrasonic NDT Scanning</h4>
              <p className="text-xs text-muted leading-relaxed">Precise case hardening depth validation conforming to DIN/ISO norms.</p>
            </div>
            <div className="border-l-2 border-line-strong pl-4 space-y-1">
              <span className="tech-label text-muted text-[0.65rem]">Surface Finish</span>
              <h4 className="font-display text-sm font-bold text-foreground">Ra &lt; 0.2µm Finish</h4>
              <p className="text-xs text-muted leading-relaxed">High-precision CNC cylindrical & surface ground tool interfaces.</p>
            </div>
            <div className="border-l-2 border-line-strong pl-4 space-y-1">
              <span className="tech-label text-muted text-[0.65rem]">Turnkey Trials</span>
              <h4 className="font-display text-sm font-bold text-foreground">100% In-House FAT</h4>
              <p className="text-xs text-muted leading-relaxed">Full factory acceptance testing before equipment dispatch to client sites.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        items={filteredItems}
        currentIndex={lightboxIndex || 0}
        onChangeIndex={(idx) => setLightboxIndex(idx)}
      />

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
