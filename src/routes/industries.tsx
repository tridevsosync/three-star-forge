import { createFileRoute } from "@tanstack/react-router";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Btn, Reveal, SectionHead, TechLabel } from "@/components/site/ui";
import { CtaBand, PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries Served — Material Handling, Automation, Pharma | Three Star" },
      {
        name: "description",
        content:
          "Equipment design and turnkey manufacturing for material handling, industrial automation, pharmaceutical, food, process industries, engineering equipment and line automation.",
      },
      { property: "og:title", content: "Industries We Engineer For — Three Star Enterprises" },
      {
        property: "og:description",
        content:
          "Multi-industry OEM engineering support across material handling, automation, pharma, food, process, engineering equipment and line automation.",
      },
      { property: "og:url", content: "/industries" },
    ],
    links: [{ rel: "canonical", href: "/industries" }],
  }),
  component: Industries,
});

function Industries() {
  const { industries } = useSite();

  return (
    <>
      <PageHero
        index="03"
        eyebrow="Industries"
        title="Equipment engineered for the conditions of each industry."
        intro="From hot forging lines to hygienic food and pharmaceutical environments — the design brief, materials and handling change with every sector we build for."
        image={IMAGES.pageProjects}
      />

      <Section grid>
        <InView>
          <SectionHead
            index="3.1"
            eyebrow="Sectors"
            title="Seven industries, one engineering discipline"
            intro="Each sector below reflects work described in our company presentation. Project details are available on request."
          />
        </InView>

        <div className="mt-16 space-y-16">
          {industries.map((ind, i) => (
            <InView key={ind.id} delay={60}>
              <article
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? "lg:[&>figure]:order-2" : ""
                }`}
              >
                <figure className="corner-marks relative aspect-[4/3] overflow-hidden border border-line bg-navy">
                  <img
                    src={ind.image}
                    alt={`${ind.name} equipment engineered by Three Star Enterprises`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.05]"
                  />
                  <figcaption className="tech-label absolute bottom-4 left-4 bg-navy/85 px-3 py-1.5 text-onnavy">
                    {`IND-${String(i + 1).padStart(2, "0")}`}
                  </figcaption>
                </figure>

                <div>
                  <TechLabel tone="accent">{`Sector ${String(i + 1).padStart(2, "0")}`}</TechLabel>
                  <h3 className="mt-4 font-display text-2xl leading-tight font-semibold text-foreground sm:text-3xl">
                    {ind.name}
                  </h3>
                  <div className="mt-5 h-px w-14 bg-line-strong" />
                  <p className="mt-5 text-base leading-relaxed text-muted">{ind.description}</p>

                  <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                    {ind.capabilities.map((c) => (
                      <li key={c} className="flex gap-3 text-sm text-foreground">
                        <span className="mt-[0.55rem] h-1 w-1 shrink-0 bg-accent" />
                        <span className="leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Btn to="/contact" variant="outline">
                      Discuss this sector
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
