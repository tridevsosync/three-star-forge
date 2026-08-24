"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSite } from "@/store/site-store";
import { Btn, Container, TechLabel } from "@/components/site/ui";

const TABS = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/content", label: "Content" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/enquiries", label: "Enquiries" },
];

export default function AdminLayout({ children }) {
  const { isAuthed, logout, reset } = useSite();
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render children directly without admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

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
    <div className="min-h-screen bg-background pb-24">
      <div className="border-b border-line bg-navy py-10 text-onnavy">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <TechLabel tone="accent">Admin</TechLabel>
                <span className="h-px w-6 bg-accent" />
                <Link href="/" className="tech-label text-onnavy-muted hover:text-accent">
                  ← Back to Public Site
                </Link>
              </div>
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
                  router.push("/");
                }}
              >
                Sign out
              </Btn>
            </div>
          </div>

          <nav className="mt-9 flex flex-wrap gap-2">
            {TABS.map((t) => {
              const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
              return (
                <Link
                  key={t.to}
                  href={t.to}
                  className={`border px-4 py-2.5 text-[0.7rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${
                    active
                      ? "border-accent bg-accent text-navy"
                      : "border-onnavy/20 text-onnavy-muted hover:border-accent hover:text-accent"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </Container>
      </div>

      <Container className="pt-12">{children}</Container>
    </div>
  );
}
