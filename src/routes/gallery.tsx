import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GALLERY_CATEGORIES } from "@/data/site";
import { IMAGES } from "@/data/images";
import { Reveal, SectionHead, TechLabel } from "@/components/site/ui";
import { CtaBand, PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
import { useSite } from "@/store/site-store";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Machines, Automation & Manufacturing | Three Star Enterprises" },
      {
        name: "description",
        content:
          "Photographs of induction hardening machines, automation cells, conveying systems, precision components and manufacturing work from Three Star Enterprises, Pune.",
      },
      { property: "og:title", content: "Engineering Gallery — Three Star Enterprises" },
      {
        property: "og:description",
        content:
          "A visual record of machines, automation, material handling and manufacturing work.",
      },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  const { gallery } = useSite();
  const [cat, setCat] = useState("All");
  const items = cat === "All" ? gallery : gallery.filter((g) => g.category === cat);

  return (
    <>
      <PageHero
        index="06"
        eyebrow="Gallery"
        title="Machines, components and work in progress."
        intro="Photographs of equipment we have designed, built, assembled and maintained. Each image appears once across this website."
        image={IMAGES.galleryInspection}
      />

      <Section grid>
        <InView>
          <SectionHead
            index="6.1"
            eyebrow="Visual record"
            title="Browse by category"
            intro="Filter the gallery by equipment type and discipline."
          />
        </InView>

        <InView delay={80}>
          <div className="mt-12 flex flex-wrap gap-2">
            {GALLERY_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`border px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${
                  cat === c
                    ? "border-navy bg-navy text-onnavy"
                    : "border-line text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </InView>

        {items.length === 0 ? (
          <div className="mt-14 border border-dashed border-line-strong bg-surface p-16 text-center">
            <TechLabel>Empty</TechLabel>
            <p className="mt-4 text-sm text-muted">No images in this category yet.</p>
          </div>
        ) : (
          <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {items.map((g, i) => (
              <InView key={g.id} delay={Math.min(i % 3, 3) * 90}>
                <figure className="group relative overflow-hidden border border-line bg-navy">
                  <img
                    src={g.image}
                    alt={g.title}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.06] ${
                      i % 5 === 0 ? "aspect-[4/5]" : i % 3 === 0 ? "aspect-square" : "aspect-[4/3]"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5">
                    <span className="tech-label text-accent">{g.category}</span>
                    <p className="mt-2 text-sm leading-snug font-medium text-onnavy">{g.title}</p>
                  </figcaption>
                  {g.featured ? (
                    <span className="tech-label absolute top-4 right-4 border border-accent/60 bg-navy/80 px-2 py-1 text-accent">
                      Featured
                    </span>
                  ) : null}
                </figure>
              </InView>
            ))}
          </div>
        )}
      </Section>

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
