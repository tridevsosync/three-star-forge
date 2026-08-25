"use client";

import Link from "next/link";
import { Stat } from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";

const LINKS = [
  { to: "/admin/content", label: "Company & Homepage Copy" },
  { to: "/admin/projects", label: "Project Portfolio" },
  { to: "/admin/gallery", label: "Gallery Archive" },
  { to: "/admin/contacts", label: "Contact Inquiries" },
  { to: "/admin/enquiries", label: "RFQ Quotation Requests" },
];

export default function AdminDashboardPage() {
  const { projects, services, industries, gallery, faqs, testimonials, contacts, enquiries } = useSite();
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
          Central administration console for Three Star Enterprises. Monitor live contact messages, machinery RFQ requests, project portfolios, and shop-floor gallery archives.
        </p>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4 shadow-sm">
        <Stat
          label="RFQ Enquiries"
          value={enquiries?.length || 0}
          note={`${unreadEnquiries} new / unread RFQs`}
        />
        <Stat
          label="Contact Messages"
          value={contacts?.length || 0}
          note={`${unreadContacts} unread inquiries`}
        />
        <Stat
          label="Projects"
          value={projects.length}
          note={`${featured} featured builds`}
        />
        <Stat label="Gallery Archive" value={gallery.length} note="High-res photographs" />
        <Stat label="Services" value={services.length} />
        <Stat label="Industries" value={industries.length} />
        <Stat label="FAQs" value={faqs.length} />
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
