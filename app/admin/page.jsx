"use client";

import Link from "next/link";
import { Stat } from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";

const LINKS = [
  { to: "/admin/content", label: "Company & homepage copy" },
  { to: "/admin/projects", label: "Project portfolio" },
  { to: "/admin/gallery", label: "Gallery items" },
  { to: "/admin/enquiries", label: "Contact enquiries" },
];

export default function AdminDashboardPage() {
  const { projects, services, industries, gallery, faqs, testimonials, enquiries } = useSite();
  const featured = projects.filter((p) => p.featured).length;
  const unread = enquiries.filter((e) => !e.read).length;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Overview
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Current content held in this browser session. Changes are not written to any database and
          reset when the session ends or when you use “Reset content”.
        </p>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Projects"
          value={projects.length}
          note={`${featured} featured on the homepage`}
        />
        <Stat label="Services" value={services.length} />
        <Stat label="Industries" value={industries.length} />
        <Stat label="Gallery items" value={gallery.length} />
        <Stat label="FAQs" value={faqs.length} />
        <Stat label="Testimonials" value={testimonials.length} note="Demo entries only" />
        <Stat label="Enquiries" value={enquiries.length} note={`${unread} unread`} />
        <Stat label="Session" value="Local" note="No backend connected" />
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            href={l.to}
            className="group bg-surface p-6 transition-colors duration-300 hover:bg-navy"
          >
            <span className="tech-label text-muted group-hover:text-accent">Manage</span>
            <p className="mt-3 font-display text-lg font-semibold text-foreground group-hover:text-onnavy">
              {l.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
