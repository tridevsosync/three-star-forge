"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSite } from "@/store/site-store";
import { AdminHead, Stat, MiniBtn, StatusBadge, PriorityBadge } from "@/components/site/admin-ui";
import {
  FileSpreadsheet,
  Mail,
  Briefcase,
  Image as ImageIcon,
  Layers,
  Database,
  PlusCircle,
  Upload,
  Clock,
  HardDrive,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const {
    projects,
    services,
    industries,
    gallery,
    faqs,
    testimonials,
    contacts,
    enquiries,
    fetchProjects,
    fetchGallery,
    fetchContacts,
    fetchEnquiries,
  } = useSite();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState("");

  const loadStats = () => {
    setStatsLoading(true);
    fetch("/api/dashboard/stats", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Unable to load dashboard stats");
        setStats(data.data);
        setLastRefreshed(new Date().toLocaleTimeString());
      })
      .catch((error) => setStatsError(error.message))
      .finally(() => setStatsLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  const refreshAll = () => {
    loadStats();
    fetchProjects();
    fetchGallery();
    fetchContacts();
    fetchEnquiries();
  };

  const featured = projects.filter((p) => p.featured).length;
  const unreadContacts = contacts?.filter((c) => !c.read).length || 0;
  const unreadEnquiries = enquiries?.filter((e) => !e.read).length || 0;
  const recentEnquiries = enquiries.slice(0, 4);
  const recentContacts = contacts.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <AdminHead
        title="Overview & Activity Dashboard"
        eyebrow="Dashboard Overview"
        intro="Welcome to the Three Star Enterprises Admin Panel. Review recent quotation requests, incoming client messages, portfolio machines, and workshop photos."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {lastRefreshed && (
              <span className="text-xs text-muted font-medium">
                Synced at {lastRefreshed}
              </span>
            )}
            <MiniBtn onClick={refreshAll} disabled={statsLoading}>
              {statsLoading ? "Syncing..." : "↻ Refresh Feeds"}
            </MiniBtn>
          </div>
        }
      />

      {/* KPI Metrics HUD */}
      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4 rounded-3xl overflow-hidden shadow-sm">
        <Stat
          label="Machine Quotes (RFQs)"
          value={stats ? stats.enquiries : enquiries.length}
          note={`${unreadEnquiries} new / unread quotes`}
          icon={<FileSpreadsheet className="h-6 w-6 text-accent" />}
          tone={unreadEnquiries > 0 ? "danger" : "default"}
        />

        <Stat
          label="Contact Messages"
          value={contacts?.length || 0}
          note={`${unreadContacts} unread messages`}
          icon={<Mail className="h-6 w-6 text-accent" />}
          tone={unreadContacts > 0 ? "accent" : "default"}
        />

        <Stat
          label="Delivered Machines"
          value={stats ? stats.projects : projects.length}
          note={`${featured} featured in spotlight`}
          icon={<Briefcase className="h-6 w-6 text-accent" />}
        />

        <Stat
          label="Workshop Photos"
          value={gallery.length}
          note="High-resolution photos"
          icon={<ImageIcon className="h-6 w-6 text-accent" />}
        />
      </div>

      {/* Dual Activity Streams Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Recent Enquiries */}
        <div className="rounded-3xl border border-line bg-surface shadow-sm overflow-hidden flex flex-col">
          <header className="flex items-center justify-between border-b border-line bg-background/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-accent" />
              <span className="tech-label font-bold text-foreground text-xs uppercase tracking-wider">
                Recent Enquiries
              </span>
            </div>
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
            >
              <span>View All ({enquiries.length})</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </header>

          <div className="divide-y divide-line p-0 flex-1">
            {recentEnquiries.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted font-medium">
                No quotation requests recorded yet.
              </div>
            ) : (
              recentEnquiries.map((e) => {
                const itemId = e.id || e._id;
                return (
                  <div
                    key={itemId}
                    className={`p-5 transition-colors hover:bg-background/80 ${
                      !e.read ? "bg-accent/5 border-l-3 border-l-accent" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-display text-sm font-bold text-foreground">
                            {e.name}
                          </p>
                          <span className="text-xs text-muted font-medium">
                            {e.company ? `(${e.company})` : ""}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-accent font-semibold">
                          Target: {e.machineType || "Custom Machinery Build"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {e.priority && <PriorityBadge priority={e.priority} />}
                        <StatusBadge status={e.status || (!e.read ? "new" : "under-review")} />
                      </div>
                    </div>

                    {e.message && (
                      <p className="mt-2 line-clamp-2 text-xs text-muted leading-relaxed">
                        {e.message}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-line/60 text-xs text-muted">
                      <span>{new Date(e.createdAt).toLocaleString()}</span>
                      <Link
                        href="/admin/enquiries"
                        className="text-accent hover:underline font-bold"
                      >
                        Inspect RFQ →
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Recent Inbound Contacts */}
        <div className="rounded-3xl border border-line bg-surface shadow-sm overflow-hidden flex flex-col">
          <header className="flex items-center justify-between border-b border-line bg-background/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" />
              <span className="tech-label font-bold text-foreground text-xs uppercase tracking-wider">
                Recent Contact Messages
              </span>
            </div>
            <Link
              href="/admin/contacts"
              className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
            >
              <span>View All ({contacts.length})</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </header>

          <div className="divide-y divide-line p-0 flex-1">
            {recentContacts.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted font-medium">
                No contact submissions recorded yet.
              </div>
            ) : (
              recentContacts.map((c) => {
                const itemId = c.id || c._id;
                return (
                  <div
                    key={itemId}
                    className={`p-5 transition-colors hover:bg-background/80 ${
                      !c.read ? "bg-accent/5 border-l-3 border-l-accent" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-display text-sm font-bold text-foreground">
                            {c.name}
                          </p>
                          <span className="text-xs text-muted font-medium">
                            {c.company ? `· ${c.company}` : ""}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-foreground font-semibold">
                          Subject: {c.subject || "General Inquiry"}
                        </p>
                      </div>

                      <StatusBadge status={c.status || (!c.read ? "unread" : "resolved")} />
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs text-muted leading-relaxed">
                      {c.message}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-line/60 text-xs text-muted">
                      <span>{new Date(c.createdAt).toLocaleString()}</span>
                      <a
                        href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject || "Your Inquiry to Three Star Enterprises")}`}
                        className="text-accent hover:underline font-bold"
                      >
                        Reply via Email ✉
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
