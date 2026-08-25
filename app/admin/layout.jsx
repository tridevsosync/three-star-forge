"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSite } from "@/store/site-store";
import { Btn, Container, TechLabel } from "@/components/site/ui";

import { ADMIN_CREDENTIALS } from "@/data/site";

const TABS = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/content", label: "Content" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/contacts", label: "Contacts" },
  { to: "/admin/enquiries", label: "Enquiries (RFQ)" },
];

export default function AdminLayout({ children }) {
  const { isAuthed, authChecked, login, logout, contacts, enquiries } = useSite();
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render children directly without admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Prevent flash while checking session storage
  if (!authChecked) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-background py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="font-mono text-xs text-muted">Checking administrator session...</p>
        </div>
      </section>
    );
  }

  if (!isAuthed) {
    return (
      <section className="flex min-h-[70vh] items-center bg-background py-24">
        <Container>
          <div className="mx-auto max-w-md border border-line bg-surface p-8 sm:p-10 text-center shadow-lg">
            <TechLabel tone="accent">Restricted</TechLabel>
            <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
              Sign in required
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The content panel is available to signed-in administrators only.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Btn
                onClick={() => {
                  login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
                }}
                full
              >
                1-Click Demo Login
              </Btn>
              <Btn variant="outline" to="/admin/login" full>
                Go to Login Page
              </Btn>
            </div>
            <div className="mt-6 border-t border-line pt-4 text-xs text-muted font-mono">
              Demo: {ADMIN_CREDENTIALS.email} / {ADMIN_CREDENTIALS.password}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const unreadContacts = contacts?.filter((c) => !c.read).length || 0;
  const unreadEnquiries = enquiries?.filter((e) => !e.read).length || 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="border-b border-line bg-navy py-10 text-onnavy">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <TechLabel tone="accent">Admin Studio</TechLabel>
                <span className="h-px w-6 bg-accent" />
                <Link href="/" className="tech-label text-onnavy-muted hover:text-accent">
                  ← Back to Public Site
                </Link>
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold text-onnavy sm:text-3xl">
                Content & Inquiries Console
              </h2>
              <p className="mt-2 font-mono text-xs text-onnavy-muted">
                Manage shop-floor records, visual media, technical specifications, contact
                submissions, and RFQs.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Btn
                variant="light"
                onClick={() => {
                  logout();
                  router.push("/admin/login");
                }}
              >
                Sign out
              </Btn>
            </div>
          </div>

          <nav className="mt-8 flex flex-wrap gap-2 border-t border-onnavy/15 pt-6">
            {TABS.map((t) => {
              const active = t.exact ? pathname === t.to : pathname?.startsWith(t.to);
              let badge = null;
              if (t.to === "/admin/contacts" && unreadContacts > 0) {
                badge = unreadContacts;
              } else if (t.to === "/admin/enquiries" && unreadEnquiries > 0) {
                badge = unreadEnquiries;
              }

              return (
                <Link
                  key={t.to}
                  href={t.to}
                  className={`inline-flex items-center gap-2 border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? "border-accent bg-accent text-navy font-bold shadow-sm"
                      : "border-onnavy/20 bg-navy-deep/60 text-onnavy-muted hover:border-onnavy/40 hover:text-onnavy"
                  }`}
                >
                  <span>{t.label}</span>
                  {badge !== null && (
                    <span className="h-4 min-w-[16px] px-1 rounded-full bg-danger text-[0.6rem] font-bold text-white flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </Container>
      </div>

      <main className="py-10">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
