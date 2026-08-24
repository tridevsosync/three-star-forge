import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useSite } from "@/store/site-store";
import { Btn, Container, TechLabel } from "@/components/site/ui";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Content Panel — Three Star Enterprises" },
      {
        name: "description",
        content: "Session-state content panel for editing Three Star Enterprises website content.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Content Panel — Three Star Enterprises" },
      { property: "og:description", content: "Edit demo site content in session state." },
    ],
  }),
  component: AdminLayout,
});

const TABS = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/content", label: "Content" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/enquiries", label: "Enquiries" },
] as const;

function AdminLayout() {
  const { isAuthed, logout, reset } = useSite();
  const navigate = useNavigate();

  if (!isAuthed) {
    return (
      <section className="flex min-h-[70vh] items-center bg-background py-24">
        <Container>
          <div className="mx-auto max-w-md border border-line bg-surface p-10 text-center">
            <TechLabel tone="accent">Restricted</TechLabel>
            <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
              Sign in required
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The content panel is available to signed-in administrators only.
            </p>
            <div className="mt-8 flex justify-center">
              <Btn to="/admin/login">Go to login</Btn>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <div className="bg-background pb-24">
      <div className="border-b border-line bg-navy py-10 text-onnavy">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <TechLabel tone="accent">Admin</TechLabel>
              <h2 className="mt-3 font-display text-2xl font-semibold text-onnavy sm:text-3xl">
                Content panel
              </h2>
              <p className="mt-2 font-mono text-xs text-onnavy-muted">
                Edits apply to this browser session only — no database involved.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Btn variant="light" onClick={reset}>
                Reset content
              </Btn>
              <Btn
                variant="light"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                Sign out
              </Btn>
            </div>
          </div>

          <nav className="mt-9 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeOptions={{ exact: "exact" in t }}
                className="border border-onnavy/20 px-4 py-2.5 text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-onnavy-muted transition-colors duration-300 hover:border-accent hover:text-accent data-[status=active]:border-accent data-[status=active]:bg-accent data-[status=active]:text-navy"
                activeProps={{ "data-status": "active" }}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>

      <Container className="pt-12">
        {/* Required: nested admin routes render here. */}
        <Outlet />
      </Container>
    </div>
  );
}
