"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useSite } from "@/store/site-store";
import { Btn, Container, TechLabel } from "@/components/site/ui";
import { ADMIN_CREDENTIALS } from "@/data/site";
import {
  LayoutDashboard,
  Home,
  Wrench,
  Factory,
  Cpu,
  Briefcase,
  Image as ImageIcon,
  Info,
  Phone,
  Mail,
  FileSpreadsheet,
  LogOut,
  ArrowUpRight,
  ShieldCheck,
  Lock,
} from "lucide-react";

const TABS = [
  { to: "/admin", label: "Overview", exact: true, icon: LayoutDashboard },
  { to: "/admin/content?page=home", label: "Home Page", page: "home", icon: Home },
  { to: "/admin/content?page=about", label: "About Us", page: "about", icon: Info },
  { to: "/admin/content?page=services", label: "Services", page: "services", icon: Wrench },
  { to: "/admin/content?page=industries", label: "Industries", page: "industries", icon: Factory },
  { to: "/admin/projects", label: "Projects & Portfolio", icon: Briefcase },
  { to: "/admin/content?page=capabilities", label: "Capabilities", page: "capabilities", icon: Cpu },
  { to: "/admin/gallery", label: "Gallery & Photos", icon: ImageIcon },
  { to: "/admin/content?page=contact", label: "Company Contact", page: "contact", icon: Phone },
  { to: "/admin/enquiries", label: "Quotes (RFQs)", icon: FileSpreadsheet },
  { to: "/admin/contacts", label: "Messages", icon: Mail },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { isAuthed, authChecked, authEmail, logout, contacts, enquiries } = useSite();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Redirect to login if unauthenticated (called unconditionally)
  useEffect(() => {
    if (authChecked && !isAuthed && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [authChecked, isAuthed, pathname, router]);

  // If on login page, render children directly without admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading state while checking session
  if (!authChecked || !isAuthed) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-navy py-24 text-onnavy">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-none border border-accent/40 bg-accent/10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-onnavy">Loading Admin Panel</p>
            <p className="mt-1 font-sans text-xs text-onnavy-muted">Verifying administrator authorization...</p>
          </div>
        </div>
      </section>
    );
  }

  const unreadContacts = contacts?.filter((c) => !c.read).length || 0;
  const unreadEnquiries = enquiries?.filter((e) => !e.read).length || 0;
  const currentPage = searchParams.get("page") || (pathname === "/admin/content" ? "home" : null);

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      {/* Main Admin Masthead & Navigation Header */}
      <div className="relative border-b border-line bg-navy text-onnavy">
        <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-25" />

        <Container className="relative pt-8 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-sans text-xs font-bold text-accent uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin Panel</span>
                </span>
                <span className="h-px w-6 bg-accent/40" />
                <span className="font-sans text-xs text-onnavy-muted">
                  Signed in as <strong className="text-onnavy font-semibold">{authEmail || ADMIN_CREDENTIALS.email}</strong>
                </span>
              </div>

              <h2 className="mt-3 font-display text-2xl font-bold text-onnavy sm:text-3xl lg:text-4xl tracking-tight">
                Three Star Enterprises — Admin Panel
              </h2>

              <p className="mt-2 max-w-2xl font-sans text-xs text-onnavy-muted leading-relaxed">
                Manage website pages, machinery specifications, workshop photos, client inquiries, and quotation requests.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl border border-onnavy/25 bg-navy-deep/80 px-4 py-2.5 font-sans text-xs font-semibold text-onnavy-muted hover:text-accent hover:border-accent/40 tracking-wider transition-all"
              >
                <span>Live Public Site</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/admin/login");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-onnavy/25 bg-navy-deep/80 px-4 py-2.5 font-sans text-xs font-semibold text-onnavy tracking-wider transition-all hover:border-danger/60 hover:bg-danger/10 hover:text-danger cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Strip */}
          <nav className="mt-8 flex flex-wrap items-center gap-2 border-t border-onnavy/15 pt-5">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.exact
                ? pathname === t.to
                : t.page
                ? pathname === "/admin/content" && currentPage === t.page
                : pathname?.startsWith(t.to.split("?")[0]);

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
                  className={`group relative inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 font-sans text-xs font-semibold tracking-wide transition-all duration-200 ${
                    active
                      ? "border-accent bg-accent text-navy font-bold shadow-md shadow-accent/20"
                      : "border-onnavy/15 bg-navy-deep/70 text-onnavy-muted hover:border-onnavy/40 hover:bg-navy-deep hover:text-onnavy"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-navy" : "text-onnavy-muted group-hover:text-accent"}`} />
                  <span>{t.label}</span>
                  {badge !== null && (
                    <span className={`flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold ${
                      active ? "bg-navy text-accent font-bold" : "bg-danger text-white animate-pulse"
                    }`}>
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </Container>
      </div>

      {/* Main Page Workspace */}
      <main className="py-8 sm:py-10">
        <Container>{children}</Container>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-navy text-onnavy font-sans text-sm">
          Loading Admin Panel...
        </div>
      }
    >
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}
