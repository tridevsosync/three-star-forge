import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PROJECTS } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Btn, Container, Reveal, TechLabel } from "@/components/site/ui";
import { CtaBand, Section, SpecTable } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
export const Route = createFileRoute("/projects/$projectId")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.id === params.projectId);
    if (!project) throw notFound();
    return { title: project.title, short: project.short, category: project.category };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Project unavailable — Three Star Enterprises" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `${loaderData.title} — Project | Three Star Enterprises` },
        { name: "description", content: loaderData.short },
        { property: "og:title", content: `${loaderData.title} — ${loaderData.category}` },
        { property: "og:description", content: loaderData.short },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/projects/${params.projectId}` },
      ],
      links: [{ rel: "canonical", href: `/projects/${params.projectId}` }],
    };
  },
  component: ProjectDetail,
  notFoundComponent: ProjectNotFound,
});
function ProjectDetail() {
  const { projectId } = Route.useParams();
  const { projects } = useSite();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return <ProjectNotFound />;
  const related = projects
    .filter(
      (p) =>
        p.id !== project.id && (p.category === project.category || p.industry === project.industry),
    )
    .slice(0, 6);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy pt-32 pb-16 text-onnavy sm:pt-40 sm:pb-24">
        <img
          src={project.image}
          alt={`${project.title} manufactured by Three Star Enterprises`}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-50" />
        <Container className="relative">
          <Reveal>
            <nav aria-label="Breadcrumb" className="tech-label text-onnavy-muted">
              <Link to="/projects" className="transition-colors hover:text-accent">
                Portfolio
              </Link>
              <span className="px-2 text-accent">/</span>
              <span>{project.category}</span>
            </nav>
            <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-[3.4rem]">
              {project.title}
            </h1>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-onnavy/15 pt-6">
              <Meta label="Industry" value={project.industry} />
              <Meta label="Category" value={project.category} />
              <Meta label="Reference" value={`P-${project.id.slice(0, 6).toUpperCase()}`} />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* IMAGE + OVERVIEW */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <InView className="lg:col-span-7">
            <TechLabel tone="accent">Overview</TechLabel>
            <p className="mt-5 text-lg leading-relaxed text-foreground">{project.overview}</p>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Challenge</h2>
                <div className="mt-3 h-px w-10 bg-accent" />
                <p className="mt-4 text-sm leading-relaxed text-muted">{project.challenge}</p>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Solution</h2>
                <div className="mt-3 h-px w-10 bg-accent" />
                <p className="mt-4 text-sm leading-relaxed text-muted">{project.solution}</p>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="font-display text-lg font-semibold text-foreground">Application</h2>
              <div className="mt-3 h-px w-10 bg-accent" />
              <p className="mt-4 text-sm leading-relaxed text-muted">{project.application}</p>
            </div>
          </InView>

          <InView delay={120} className="lg:col-span-5">
            <div className="border border-line bg-surface">
              <div className="border-b border-line px-7 py-6">
                <TechLabel>Technical specification</TechLabel>
              </div>
              <div className="px-7 py-4">
                <SpecTable specs={project.specs} />
              </div>
            </div>

            <div className="mt-8 border border-line bg-navy p-7 text-onnavy">
              <TechLabel tone="accent">Related capabilities</TechLabel>
              <ul className="mt-5 space-y-3">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm text-onnavy/85">
                    <span className="mt-[0.55rem] h-1 w-1 shrink-0 bg-accent" />
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Btn to="/contact" variant="light">
                  Enquire about this build
                </Btn>
              </div>
            </div>
          </InView>
        </div>
      </Section>

      {/* RELATED */}
      {related.length > 0 ? (
        <Section dark tight grid>
          <InView>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <TechLabel tone="light">Related programmes</TechLabel>
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-onnavy sm:text-3xl">
              Other work in {project.industry}
            </h2>
            <ul className="mt-10 grid gap-px bg-onnavy/12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.id} className="bg-navy">
                  <Link
                    to="/projects/$projectId"
                    params={{ projectId: r.id }}
                    className="group flex h-full flex-col justify-between gap-6 px-7 py-8 transition-colors duration-300 hover:bg-navy-soft"
                  >
                    <span className="tech-label text-accent">{r.category}</span>
                    <span className="font-display text-base leading-snug font-semibold text-onnavy transition-colors group-hover:text-accent">
                      {r.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </InView>
        </Section>
      ) : null}

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
function Meta({ label, value }) {
  return (
    <div>
      <span className="tech-label text-onnavy-muted">{label}</span>
      <p className="mt-2 text-sm font-medium text-onnavy">{value}</p>
    </div>
  );
}
function ProjectNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-6 pt-32">
      <div className="max-w-lg text-center">
        <TechLabel tone="accent">404</TechLabel>
        <h1 className="mt-5 font-display text-3xl font-semibold text-foreground">
          Project not found
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          This project reference is no longer listed. Browse the full portfolio instead.
        </p>
        <div className="mt-8 flex justify-center">
          <Btn to="/projects">Back to portfolio</Btn>
        </div>
      </div>
    </div>
  );
}
