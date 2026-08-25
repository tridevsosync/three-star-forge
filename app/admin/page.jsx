"use client";

import Link from "next/link";
import { Stat } from "@/components/site/admin-ui";
import { useEffect, useState } from "react";
import { useSite } from "@/store/site-store";

const LINKS = [
  { to: "/admin/content", label: "Company & Homepage Copy" },
  { to: "/admin/projects", label: "Project Portfolio" },
  { to: "/admin/gallery", label: "Gallery Archive" },
  { to: "/admin/contacts", label: "Contact Inquiries" },
  { to: "/admin/enquiries", label: "RFQ Quotation Requests" },
];

export default function AdminDashboardPage() {
  const { projects, services, industries, gallery, faqs, testimonials, contacts, enquiries } =
    useSite();
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState("");
  useEffect(() => {
    fetch("/api/dashboard/stats", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Unable to load dashboard");
        setStats(data.data);
      })
      .catch((error) => setStatsError(error.message));
  }, []);
  const featured = projects.filter((p) => p.featured).length;
  const unreadContacts = contacts?.filter((c) => !c.read).length || 0;
  const unreadEnquiries = enquiries?.filter((e) => !e.read).length || 0;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Overview Console
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Central administration console for Three Star Enterprises. Monitor live contact messages,
          machinery RFQ requests, project portfolios, and shop-floor gallery archives.
        </p>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4 shadow-sm">
        <Stat
          label="RFQ Enquiries"
          value={stats ? stats.enquiries : "..."}
          note={`${unreadEnquiries} new / unread RFQs`}
        />
        <Stat
          label="Contact Messages"
          value={contacts?.length || 0}
          note={`${unreadContacts} unread inquiries`}
        />
        <Stat
          label="Projects"
          value={stats ? stats.projects : "..."}
          note={`${featured} featured builds`}
        />
        <Stat label="Gallery Archive" value={gallery.length} note="High-res photographs" />
        <Stat
          label="Content Sections"
          value={stats ? stats.content : "..."}
          note={statsError || undefined}
        />
        <Stat label="Services" value={services.length} />
        <Stat label="Industries" value={industries.length} />
        <Stat label="System Status" value="Online" note="Central archive connected" />
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3 shadow-sm">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            href={l.to}
            className="group bg-surface p-6 transition-colors duration-300 hover:bg-navy"
          >
            <span className="tech-label text-muted group-hover:text-accent">Console</span>
            <p className="mt-3 font-display text-lg font-bold text-foreground group-hover:text-onnavy">
              {l.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
