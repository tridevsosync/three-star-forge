"use client";

import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Btn, Reveal, SectionHead, TechLabel, Badge } from "@/components/site/ui";
import { CtaBand, PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

export default function IndustriesPage() {
  const { industries } = useSite();

  return (
    <>
      <PageHero
        index="03"
        eyebrow="Industry Sectors"
        title="Equipment engineered for the demanding conditions of each industry."
        intro="From high-temperature hot forging lines to hygienic pharmaceutical and food processing environments — our design parameters, metallurgy, and controls adapt to every operating requirement."
        image={IMAGES.pageProjects}
        action={
          <Btn to="/contact" variant="primary">
            Request Sector Consultation
          </Btn>
        }
      />

      <Section grid>
        <InView>
          <SectionHead
            index="3.1"
            eyebrow="Sector Coverage"
            title="Seven Core Industries, One Engineering Discipline"
            intro="Detailed sector capabilities and equipment engineered for global OEM clients. Full project case studies available on request."
          />
        </InView>

        <div className="mt-16 space-y-20">
          {industries.map((ind, i) => (
            <InView key={ind.id} delay={60}>
              <article
                className={`grid items-center gap-10 lg:grid-cols-12 lg:gap-16 ${
                  i % 2 === 1 ? "lg:[&>figure]:order-2" : ""
                }`}
              >
                {/* Visual Card */}
                <figure className="lg:col-span-6 corner-marks relative aspect-[4/3] overflow-hidden border border-line bg-navy shadow-xl">
                  <img
                    src={ind.image}
                    alt={`${ind.name} machinery engineered by Three Star Enterprises`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60" />
                  <figcaption className="absolute bottom-4 left-4 flex items-center gap-2">
                    <Badge variant="accent">{`SECTOR 0${i + 1}`}</Badge>
                    <span className="tech-label bg-navy/90 px-3 py-1 text-onnavy backdrop-blur-sm">
                      {ind.name}
                    </span>
                  </figcaption>
                </figure>

                {/* Content */}
                <div className="lg:col-span-6">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <TechLabel tone="accent">{`Sector Spec 0${i + 1}`}</TechLabel>
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-tight font-bold text-foreground sm:text-3xl">
                    {ind.name}
                  </h3>
                  <div className="mt-4 h-0.5 w-14 bg-accent" />
                  <p className="mt-5 text-base leading-relaxed text-muted">{ind.description}</p>

                  <div className="mt-8">
                    <TechLabel tone="dark">Key Engineered Applications</TechLabel>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {ind.capabilities.map((c) => (
                        <li key={c} className="flex gap-3 text-sm text-foreground items-start">
                          <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 bg-accent rounded-full" />
                          <span className="leading-relaxed">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-line flex items-center gap-4">
                    <Btn to="/contact" variant="outline">
                      Enquire for {ind.name}
                    </Btn>
                    <Btn to="/projects" variant="ghost">
                      View Projects →
                    </Btn>
                  </div>
                </div>
              </article>
            </InView>
          ))}
        </div>
      </Section>

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
