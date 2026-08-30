"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSite } from "@/store/site-store";
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
  Star,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  MessageSquareQuote,
  HelpCircle,
  ExternalLink,
  Flame,
  Sparkles,
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  exact?: boolean;
  page?: string;
  icon: any;
  badgeType?: "contacts" | "enquiries" | "feedback";
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "DASHBOARD",
    items: [
      { to: "/admin", label: "Overview", exact: true, icon: LayoutDashboard },
    ],
  },
  {
    title: "PAGES & CONTENT",
    items: [
      { to: "/admin/content?page=home", label: "Home Page", page: "home", icon: Home },
      { to: "/admin/content?page=about", label: "About Us", page: "about", icon: Info },
      { to: "/admin/content?page=services", label: "Services", page: "services", icon: Wrench },
      { to: "/admin/content?page=industries", label: "Industries", page: "industries", icon: Factory },
      { to: "/admin/content?page=capabilities", label: "Capabilities", page: "capabilities", icon: Cpu },
      { to: "/admin/content?page=contact", label: "Company Contact", page: "contact", icon: Phone },
      { to: "/admin/content?page=testimonials", label: "Client Reviews", page: "testimonials", icon: MessageSquareQuote },
      { to: "/admin/content?page=faqs", label: "FAQs", page: "faqs", icon: HelpCircle },
    ],
  },
  {
    title: "MACHINERY & MEDIA",
    items: [
      { to: "/admin/projects", label: "Projects & Portfolio", icon: Briefcase },
      { to: "/admin/gallery", label: "Gallery & Photos", icon: ImageIcon },
    ],
  },
  {
    title: "INQUIRIES & REVIEWS",
    items: [
      { to: "/admin/enquiries", label: "Quotes (RFQs)", icon: FileSpreadsheet, badgeType: "enquiries" },
      { to: "/admin/contacts", label: "Messages", icon: Mail, badgeType: "contacts" },
      { to: "/admin/feedback", label: "Client Feedback", icon: Star, badgeType: "feedback" },
    ],
  },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { isAuthed, authChecked, authEmail, logout, contacts, enquiries, feedback } = useSite();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Collapsible sidebar state (persisted in localStorage)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem("admin_sidebar_collapsed");
      if (savedState !== null) {
        setIsCollapsed(savedState === "true");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("admin_sidebar_collapsed", String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (authChecked && !isAuthed && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [authChecked, isAuthed, pathname, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, searchParams]);

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
  const pendingFeedback = feedback?.filter((f) => !f.isApproved && f.status !== "approved").length || 0;
  const currentPage = searchParams.get("page") || (pathname === "/admin/content" ? "home" : null);

  const getBadgeCount = (type?: "contacts" | "enquiries" | "feedback") => {
    if (type === "contacts") return unreadContacts;
    if (type === "enquiries") return unreadEnquiries;
    if (type === "feedback") return pendingFeedback;
    return 0;
  };

  // Helper to check if item is active
  const isItemActive = (item: NavItem) => {
    if (item.exact) return pathname === item.to;
    if (item.page) return pathname === "/admin/content" && currentPage === item.page;
    return pathname?.startsWith(item.to.split("?")[0]);
  };

  // Find active label for top bar title
  let currentLabel = "Dashboard Overview";
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (isItemActive(item)) {
        currentLabel = item.label;
        break;
      }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ========================================================================= */}
      {/* 1. COLLAPSIBLE LEFT SIDEBAR (DESKTOP & MOBILE DRAWER) */}
      {/* ========================================================================= */}

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-navy/80 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between border-r border-line bg-navy text-onnavy transition-all duration-300 ease-in-out ${
          /* Mobile Drawer Position */
          isMobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:translate-x-0"
        } ${
          /* Desktop Width */
          isCollapsed ? "md:w-[76px]" : "md:w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Top Header & Branding */}
          <div className="flex h-16 items-center justify-between border-b border-onnavy/10 px-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-navy font-bold shadow-md shadow-accent/20">
                <Flame className="h-5 w-5 fill-navy" />
              </div>

              {(!isCollapsed || isMobileOpen) && (
                <div className="min-w-0 transition-opacity duration-200">
                  <h1 className="font-display text-sm font-extrabold tracking-tight text-onnavy truncate">
                    THREE STAR
                  </h1>
                  <span className="block text-[0.65rem] font-bold text-accent tracking-wider uppercase truncate">
                    Admin Panel OS
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse / Expand Button */}
            <button
              type="button"
              onClick={toggleCollapsed}
              className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-onnavy/20 bg-navy-deep text-onnavy-muted hover:border-accent hover:text-accent transition cursor-pointer shadow-xs"
              title={isCollapsed ? "Expand Sidebar (Wider View)" : "Collapse Sidebar (Compact View)"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-onnavy-muted hover:text-onnavy"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links Scroll Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6 scrollbar-thin">
            {NAV_GROUPS.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {/* Group Title */}
                {(!isCollapsed || isMobileOpen) ? (
                  <h2 className="px-3 pb-1 text-[0.65rem] font-bold tracking-wider text-onnavy-muted uppercase font-sans">
                    {group.title}
                  </h2>
                ) : (
                  <div className="my-2 border-t border-onnavy/10 mx-2" />
                )}

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item);
                  const badge = getBadgeCount(item.badgeType);

                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      title={isCollapsed && !isMobileOpen ? item.label : undefined}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-150 ${
                        active
                          ? "bg-accent text-navy font-bold shadow-md shadow-accent/25"
                          : "text-onnavy-muted hover:bg-navy-deep hover:text-onnavy"
                      } ${isCollapsed && !isMobileOpen ? "justify-center px-0 py-2.5" : ""}`}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 ${
                          active ? "text-navy" : "text-onnavy-muted group-hover:text-accent"
                        }`}
                      />

                      {(!isCollapsed || isMobileOpen) && (
                        <span className="truncate flex-1 font-sans">{item.label}</span>
                      )}

                      {/* Notification Badges */}
                      {badge > 0 && (
                        <span
                          className={`flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold font-mono ${
                            active
                              ? "bg-navy text-accent"
                              : "bg-danger text-white animate-pulse"
                          } ${
                            isCollapsed && !isMobileOpen
                              ? "absolute top-1 right-1 h-3.5 min-w-[14px] text-[0.55rem] px-1"
                              : ""
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer User Info & Actions */}
          <div className="border-t border-onnavy/10 p-3 bg-navy-deep/60 space-y-2">
            {(!isCollapsed || isMobileOpen) ? (
              <>
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-navy/80 border border-onnavy/10 text-xs">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-[0.68rem]">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-onnavy truncate text-[0.72rem]">
                      {authEmail || ADMIN_CREDENTIALS.email}
                    </p>
                    <span className="text-[0.62rem] text-accent block uppercase tracking-wider">
                      Administrator
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 pt-1">
                  <Link
                    href="/"
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-onnavy/15 bg-navy px-2.5 py-1.5 text-[0.7rem] font-semibold text-onnavy-muted hover:text-accent hover:border-accent/40 transition"
                  >
                    <span>Public Site</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      router.push("/admin/login");
                    }}
                    className="inline-flex items-center justify-center rounded-lg border border-onnavy/15 bg-navy p-1.5 text-onnavy-muted hover:bg-danger/10 hover:text-danger hover:border-danger/40 transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-1">
                <Link
                  href="/"
                  target="_blank"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-onnavy/15 bg-navy text-onnavy-muted hover:text-accent hover:border-accent/40 transition"
                  title="View Live Public Site"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push("/admin/login");
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-onnavy/15 bg-navy text-onnavy-muted hover:bg-danger/10 hover:text-danger hover:border-danger/40 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT VIEWPORT (RESPONSIVE OFFSET FOR COLLAPSIBLE SIDEBAR) */}
      {/* ========================================================================= */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "md:pl-[76px]" : "md:pl-64"
        }`}
      >
        {/* Sticky Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface/90 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-background text-foreground hover:border-accent"
              title="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Current Route Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted uppercase tracking-wider hidden sm:inline">
                Admin Panel
              </span>
              <span className="text-muted hidden sm:inline">/</span>
              <h2 className="font-display text-sm sm:text-base font-bold text-foreground truncate">
                {currentLabel}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-background px-3.5 py-1.5 font-sans text-xs font-semibold text-foreground hover:border-accent hover:text-accent transition shadow-xs"
            >
              <span>Live Site</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-line bg-background px-3 py-1.5 font-sans text-xs font-semibold text-muted hover:border-danger hover:text-danger transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-24">
          {children}
        </main>
      </div>
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
