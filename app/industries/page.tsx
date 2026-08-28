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
        eyebrow="Industries"
        title="Custom Machines Built for Every Industry"
        intro="From heavy-duty forging plants to clean pharmaceutical and food factories, we design and build machinery tailored to your exact plant conditions and materials."
        image={IMAGES.pageProjects}
        action={
          <Btn to="/quote" variant="primary">
            Request an Industry Quote
          </Btn>
        }
      />

      <Section grid>
        <InView>
          <SectionHead
            index="3.1"
            eyebrow="Our Reach"
            title="Serving 7 Core Industries with Proven Machines"
            intro="Explore the custom machines, conveyors, and automated systems we have built for factories across India and globally."
          />
        </InView>

        <div className="mt-16 space-y-20">
          {industries.map((ind, i) => (
            <InView key={ind.id} delay={60}>
              <article
                className={`grid items-start gap-10 lg:grid-cols-12 lg:gap-16 ${
                  i % 2 === 1 ? "lg:[&>figure]:order-2" : ""
                }`}
              >
                {/* Visual Card */}
                <figure className="lg:col-span-6 corner-marks relative aspect-[4/3] w-full overflow-hidden border border-line bg-navy shadow-xl min-w-0">
                  {ind.image ? (
                    <img
                      src={ind.image}
                      alt={`${ind.name} machinery engineered by Three Star Enterprises`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="blueprint-grid-dark relative flex h-full w-full flex-col items-center justify-center p-6 text-center bg-navy-deep overflow-hidden">
                      <div className="flex h-12 w-12 items-center justify-center border border-accent/40 bg-navy/90 font-mono text-accent text-sm font-bold shadow-inner mb-3">
                        0{i + 1}
                      </div>
                      <span className="font-mono text-[0.62rem] text-accent tracking-widest uppercase font-bold">
                        SECTOR SPEC 0{i + 1}
                      </span>
                      <h4 className="mt-1.5 font-display text-lg font-bold text-onnavy line-clamp-2 max-w-xs break-words">
                        {ind.name}
                      </h4>
                      <p className="mt-1 font-mono text-[0.65rem] text-onnavy-muted uppercase tracking-wider">
                        Industrial Engineering Solution
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                  <figcaption className="absolute bottom-4 left-4 right-4 flex items-center gap-2 max-w-full overflow-hidden pointer-events-none z-10">
                    <Badge variant="accent" className="shrink-0">{`SECTOR 0${i + 1}`}</Badge>
                    <span className="tech-label bg-navy/90 px-3 py-1 text-onnavy backdrop-blur-sm truncate max-w-[200px] border border-onnavy/20">
                      {ind.name}
                    </span>
                  </figcaption>
                </figure>

                {/* Content */}
                <div className="lg:col-span-6 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <TechLabel tone="accent">{`Sector Spec 0${i + 1}`}</TechLabel>
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-tight font-bold text-foreground sm:text-3xl break-words line-clamp-3">
                    {ind.name}
                  </h3>
                  <div className="mt-4 h-0.5 w-14 bg-accent" />
                  <p className="mt-5 text-base leading-relaxed text-muted break-words">{ind.description}</p>

                  <div className="mt-8 min-w-0">
                    <TechLabel tone="dark">Key Engineered Applications</TechLabel>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2 min-w-0">
                      {ind.capabilities.map((c) => (
                        <li key={c} className="flex gap-3 text-sm text-foreground items-start min-w-0">
                          <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 bg-accent rounded-full" />
                          <span className="leading-relaxed break-words min-w-0">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center gap-4">
                    <Btn to="/contact" variant="outline">
                      Enquire for This Sector
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
