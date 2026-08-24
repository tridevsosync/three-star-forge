"use client";

import { useState } from "react";
import { GALLERY_CATEGORIES } from "@/data/site";
import { IMAGES } from "@/data/images";
import { Reveal, SectionHead, TechLabel, Badge, Btn, Lightbox } from "@/components/site/ui";
import { CtaBand, PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import { useSite } from "@/store/site-store";

export default function GalleryPage() {
  const { gallery } = useSite();
  const [cat, setCat] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const items = cat === "All" ? gallery : gallery.filter((g) => g.category === cat);
  const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  const handleNext = () => {
    if (lightboxIndex !== null && lightboxIndex < items.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    } else {
      setLightboxIndex(0);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else {
      setLightboxIndex(items.length - 1);
    }
  };

  return (
    <>
      <PageHero
        index="06"
        eyebrow="Visual Record"
        title="Machinery, components, and workshop builds."
        intro="A photographic archive of equipment designed, machined, assembled, and trialled in our Pune facility. Click any photo to open full-resolution inspection view."
        image={IMAGES.galleryInspection}
        action={
          <Btn to="/contact" variant="primary">
            Submit RFQ with Sample Photo
          </Btn>
        }
      />

      <Section grid>
        <InView>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              index="6.1"
              eyebrow="Category Filter"
              title="Shop Floor Photographic Archive"
              intro="Filter imagery by equipment category and manufacturing discipline."
            />
            <Badge variant="accent">
              {String(items.length).padStart(2, "0")} ARCHIVE PHOTOGRAPHS
            </Badge>
          </div>
        </InView>

        {/* Filter Pills */}
        <InView delay={80}>
          <div className="mt-12 flex flex-wrap gap-2">
            {GALLERY_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCat(c);
                  setLightboxIndex(null);
                }}
                className={`border px-4 py-2 text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-all duration-300 ${
                  cat === c
                    ? "border-navy bg-navy text-onnavy shadow-sm"
                    : "border-line text-muted hover:border-accent hover:text-accent bg-surface"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </InView>

        {/* Image Grid */}
        {items.length === 0 ? (
          <div className="mt-14 border border-dashed border-line-strong bg-surface p-16 text-center">
            <TechLabel>Empty Category</TechLabel>
            <p className="mt-3 text-sm text-muted">No images currently filed under this category.</p>
          </div>
        ) : (
          <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {items.map((g, i) => (
              <InView key={g.id} delay={Math.min(i % 3, 3) * 80}>
                <figure
                  onClick={() => setLightboxIndex(i)}
                  className="group relative cursor-pointer overflow-hidden border border-line bg-navy corner-marks shadow-md transition-all hover:shadow-xl"
                >
                  <img
                    src={g.image}
                    alt={g.title}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.07] ${
                      i % 5 === 0 ? "aspect-[4/5]" : i % 3 === 0 ? "aspect-square" : "aspect-[4/3]"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-95" />
                  
                  {/* Overlay Info */}
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                    <span className="tech-label text-accent font-semibold">{g.category}</span>
                    <h3 className="mt-1 text-sm font-semibold text-onnavy leading-snug">
                      {g.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-[0.65rem] font-mono text-onnavy-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span>Click to enlarge</span>
                      <span>🔍</span>
                    </div>
                  </figcaption>

                  {g.featured && (
                    <span className="tech-label absolute top-4 right-4 border border-accent/60 bg-navy/90 px-2 py-0.5 text-accent text-[0.65rem] backdrop-blur-sm">
                      Featured
                    </span>
                  )}
                </figure>
              </InView>
            ))}
          </div>
        )}
      </Section>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        image={activeItem?.image}
        title={activeItem?.title}
        category={activeItem?.category}
        onNext={items.length > 1 ? handleNext : null}
        onPrev={items.length > 1 ? handlePrev : null}
      />

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
