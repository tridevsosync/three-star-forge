"use client";

import { useState, useMemo } from "react";
import { AdminHead, MiniBtn, Panel } from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";

export default function AdminEnquiriesPage() {
  const { enquiries, enquiriesLoading, updateEnquiry, deleteEnquiry, fetchEnquiries } = useSite();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'unread' | 'new' | 'under-review' | 'quoted' | 'closed'
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [flashMsg, setFlashMsg] = useState(null);

  const flash = (msg) => {
    setFlashMsg(msg);
    window.setTimeout(() => setFlashMsg(null), 3000);
  };

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "unread" && !e.read) ||
        e.status === filterStatus;

      const matchSearch =
        !search.trim() ||
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.company?.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase()) ||
        e.machineType?.toLowerCase().includes(search.toLowerCase()) ||
        e.message?.toLowerCase().includes(search.toLowerCase()) ||
        (e.id && e.id.toLowerCase().includes(search.toLowerCase()));

      return matchStatus && matchSearch;
    });
  }, [enquiries, filterStatus, search]);

  const unreadCount = useMemo(() => enquiries.filter((e) => !e.read).length, [enquiries]);
  const newRfqCount = useMemo(() => enquiries.filter((e) => e.status === "new").length, [enquiries]);
  const underReviewCount = useMemo(() => enquiries.filter((e) => e.status === "under-review").length, [enquiries]);
  const quotedCount = useMemo(() => enquiries.filter((e) => e.status === "quoted").length, [enquiries]);

  const handleToggleRead = async (enquiry) => {
    const newRead = !enquiry.read;
    await updateEnquiry(enquiry.id || enquiry._id, { read: newRead });
    flash(newRead ? "✓ Marked as read" : "✓ Marked as unread");
  };

  const handleStatusChange = async (id, status) => {
    await updateEnquiry(id, { status, read: true });
    flash(`✓ RFQ Status updated to "${status}"`);
  };

  const handlePriorityChange = async (id, priority) => {
    await updateEnquiry(id, { priority });
    flash(`✓ Priority set to ${priority}`);
  };

  const handleDelete = async (id) => {
    await deleteEnquiry(id);
    setConfirmDeleteId(null);
    flash("✓ Quotation enquiry deleted");
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <AdminHead
        title="Engineering RFQ & Quotation Enquiries"
        intro="Custom machinery builds, induction hardening systems, and tooling quotation requests submitted via 'Request Quote'."
        action={
          <div className="flex items-center gap-3">
            {flashMsg && (
              <span className="border border-accent bg-accent/15 px-3 py-1.5 font-mono text-xs font-semibold text-accent animate-pulse">
                {flashMsg}
              </span>
            )}
            <button
              type="button"
              onClick={fetchEnquiries}
              className="p-2 border border-line bg-surface text-muted hover:text-accent hover:border-accent transition-colors font-mono text-xs"
              title="Refresh RFQs"
            >
              ↻ Refresh
            </button>
          </div>
        }
      />

      {/* Metric Cards HUD */}
      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 shadow-sm">
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Total RFQs</span>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{enquiries.length}</p>
          <span className="text-[0.68rem] font-mono text-muted">Quotations Received</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-danger text-[0.65rem]">New & Unread</span>
          <p className="mt-1 font-display text-2xl font-bold text-danger">{unreadCount}</p>
          <span className="text-[0.68rem] font-mono text-muted">Awaiting Action</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-accent text-[0.65rem]">Under Review</span>
          <p className="mt-1 font-display text-2xl font-bold text-accent">{underReviewCount}</p>
          <span className="text-[0.68rem] font-mono text-muted">Engineering Sizing</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-success text-[0.65rem]">Quoted Proposals</span>
          <p className="mt-1 font-display text-2xl font-bold text-success">{quotedCount}</p>
          <span className="text-[0.68rem] font-mono text-muted">Proposal Issued</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-line bg-surface p-4 shadow-sm">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, company, machine, or specifications..."
            className="w-full border border-line bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted outline-none focus:border-accent"
          />
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-2.5 top-2 text-xs text-muted">
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["all", "unread", "new", "under-review", "quoted", "closed"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                filterStatus === st
                  ? "border-accent bg-accent text-navy font-bold shadow-sm"
                  : "border-line bg-background text-muted hover:border-line-strong hover:text-foreground"
              }`}
            >
              {st === "under-review" ? "Review" : st} {st === "unread" && unreadCount > 0 ? `(${unreadCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* RFQ List */}
      {enquiries.length === 0 ? (
        <div className="border border-dashed border-line bg-surface p-16 text-center">
          <p className="font-display text-lg font-bold text-foreground">No Quotation Enquiries (RFQ) Yet</p>
          <p className="mt-2 text-sm text-muted">When visitors tap "Request Quote" and submit engineering specifications, they will be logged here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-line bg-surface p-12 text-center text-sm text-muted">
          No quotation enquiries match the active search or status filter.
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((e) => {
            const itemId = e.id || e._id;
            return (
              <article
                key={itemId}
                className={`border transition-all duration-300 p-6 sm:p-7 bg-surface shadow-md ${
                  !e.read ? "border-l-4 border-l-accent border-line" : "border-line hover:border-line-strong"
                }`}
              >
                {/* Header Strip */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-lg font-bold text-foreground">{e.name}</h3>
                      <span className="font-mono text-xs font-bold text-foreground bg-line px-2 py-0.5">
                        {e.company}
                      </span>
                      {!e.read && (
                        <span className="border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-accent uppercase animate-pulse">
                          ★ New RFQ
                        </span>
                      )}
                      {e.priority === "urgent" && (
                        <span className="border border-danger/40 bg-danger/10 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-danger uppercase">
                          🔥 Urgent
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {e.location ? `Location: ${e.location} · ` : ""}
                      Received: {new Date(e.createdAt).toLocaleString()} · ID: {itemId.slice(-6).toUpperCase()}
                    </p>
                  </div>

                  {/* Actions & Status Pipeline */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={e.status || "new"}
                      onChange={(evt) => handleStatusChange(itemId, evt.target.value)}
                      className="border border-line bg-background px-3 py-1.5 text-xs font-mono font-bold text-foreground outline-none focus:border-accent"
                    >
                      <option value="new">Pipeline: New RFQ</option>
                      <option value="under-review">Under Review</option>
                      <option value="quoted">Quotation Sent</option>
                      <option value="closed">Closed / Won</option>
                    </select>

                    <select
                      value={e.priority || "standard"}
                      onChange={(evt) => handlePriorityChange(itemId, evt.target.value)}
                      className="border border-line bg-background px-2.5 py-1.5 text-xs font-mono text-muted outline-none focus:border-accent"
                    >
                      <option value="standard">Priority: Standard</option>
                      <option value="high">Priority: High</option>
                      <option value="urgent">Priority: Urgent</option>
                    </select>

                    <a
                      href={`mailto:${e.email}?subject=Three Star Enterprises — Proposal for ${encodeURIComponent(e.machineType || "Machinery Build")}`}
                      className="border border-accent bg-accent/10 text-accent hover:bg-accent hover:text-navy px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Issue Quote Proposal ✉
                    </a>

                    <MiniBtn onClick={() => handleToggleRead(e)}>
                      {e.read ? "Mark Unread" : "Mark Read"}
                    </MiniBtn>

                    {confirmDeleteId === itemId ? (
                      <>
                        <MiniBtn tone="danger" onClick={() => handleDelete(itemId)}>
                          Confirm
                        </MiniBtn>
                        <MiniBtn onClick={() => setConfirmDeleteId(null)}>No</MiniBtn>
                      </>
                    ) : (
                      <MiniBtn tone="danger" onClick={() => setConfirmDeleteId(itemId)}>
                        Delete
                      </MiniBtn>
                    )}
                  </div>
                </div>

                {/* Technical Parameters Matrix */}
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border border-line bg-background p-4 font-mono text-xs">
                  <div>
                    <span className="text-muted block text-[0.65rem] uppercase">Target Equipment:</span>
                    <span className="font-bold text-accent text-sm">{e.machineType || "Custom Machine"}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[0.65rem] uppercase">Project Timeline:</span>
                    <span className="font-semibold text-foreground">{e.timeline || "1 - 3 Months"}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[0.65rem] uppercase">Contact Direct:</span>
                    <p className="text-foreground">{e.phone}</p>
                    <a href={`mailto:${e.email}`} className="text-accent underline truncate block">{e.email}</a>
                  </div>
                  <div>
                    <span className="text-muted block text-[0.65rem] uppercase">Production Volume / Spec:</span>
                    <span className="text-foreground">{e.targetVolume || "Custom batch"}</span>
                  </div>
                </div>

                {/* Scope Description */}
                <div className="mt-4 p-5 border border-line bg-background/50 space-y-2">
                  <span className="tech-label text-accent text-[0.68rem] block font-bold">
                    Technical Specifications & Machinery Scope:
                  </span>
                  <p className="text-sm text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                    {e.message}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
