"use client";

import { useState, useMemo } from "react";
import {
  AdminHead,
  MiniBtn,
  StatusBadge,
  PriorityBadge,
  EmptyState,
  AdminModal,
  ConfirmDeleteModal,
} from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";
import {
  FileSpreadsheet,
  RotateCw,
  Search,
  Send,
  Trash2,
  Clock,
  Building,
  Phone,
  Mail,
  MapPin,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  Copy,
  Check,
  Cpu,
  Eye,
  ExternalLink,
} from "lucide-react";

export default function AdminEnquiriesPage() {
  const { enquiries, enquiriesLoading, updateEnquiry, deleteEnquiry, fetchEnquiries } = useSite();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'unread' | 'new' | 'under-review' | 'quoted' | 'closed'
  const [viewingEnquiry, setViewingEnquiry] = useState(null);
  const [deletingEnquiry, setDeletingEnquiry] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [flashMsg, setFlashMsg] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const flash = (msg) => {
    setFlashMsg(msg);
    setTimeout(() => setFlashMsg(null), 3000);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    flash("✓ Copied specs to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
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
  const underReviewCount = useMemo(
    () => enquiries.filter((e) => e.status === "under-review").length,
    [enquiries],
  );
  const quotedCount = useMemo(() => enquiries.filter((e) => e.status === "quoted").length, [enquiries]);

  const handleToggleRead = async (enquiry) => {
    const newRead = !enquiry.read;
    await updateEnquiry(enquiry.id || enquiry._id, { read: newRead });
    if (viewingEnquiry && (viewingEnquiry.id === enquiry.id || viewingEnquiry._id === enquiry._id)) {
      setViewingEnquiry({ ...viewingEnquiry, read: newRead });
    }
    flash(newRead ? "✓ Marked as read" : "✓ Marked as unread");
  };

  const handleStatusChange = async (id, status) => {
    await updateEnquiry(id, { status, read: true });
    if (viewingEnquiry && (viewingEnquiry.id === id || viewingEnquiry._id === id)) {
      setViewingEnquiry({ ...viewingEnquiry, status, read: true });
    }
    flash(`✓ RFQ Status updated to "${status}"`);
  };

  const handlePriorityChange = async (id, priority) => {
    await updateEnquiry(id, { priority });
    if (viewingEnquiry && (viewingEnquiry.id === id || viewingEnquiry._id === id)) {
      setViewingEnquiry({ ...viewingEnquiry, priority });
    }
    flash(`✓ Priority set to ${priority}`);
  };

  const handleDelete = async () => {
    if (!deletingEnquiry) return;
    setIsDeleting(true);
    const id = deletingEnquiry.id || deletingEnquiry._id;
    try {
      await deleteEnquiry(id);
      if (viewingEnquiry && (viewingEnquiry.id === id || viewingEnquiry._id === id)) {
        setViewingEnquiry(null);
      }
      setDeletingEnquiry(null);
      flash("✓ Quotation enquiry deleted successfully");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <AdminHead
        title="Engineering RFQ & Machinery Quotation Suite"
        eyebrow="Commercial Pipeline"
        intro="Custom induction hardening machines, automation tooling, and bespoke engineering RFQs submitted through the public 'Request Quote' portal."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {flashMsg && (
              <span className="border border-accent bg-accent/15 px-3 py-1.5 font-mono text-xs font-semibold text-accent animate-pulse shadow-sm">
                {flashMsg}
              </span>
            )}
            <MiniBtn onClick={fetchEnquiries} disabled={enquiriesLoading}>
              <RotateCw className={`h-3.5 w-3.5 ${enquiriesLoading ? "animate-spin" : ""}`} />
              <span>{enquiriesLoading ? "Syncing..." : "Refresh RFQs"}</span>
            </MiniBtn>
          </div>
        }
      />

      {/* Metrics HUD */}
      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 shadow-sm">
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Total RFQs</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
            {enquiries.length}
          </p>
          <span className="text-[0.68rem] font-mono text-muted">Quotations Received</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-danger text-[0.65rem]">New & Unread</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-danger">
            {unreadCount}
          </p>
          <span className="text-[0.68rem] font-mono text-muted">Awaiting Action</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-accent text-[0.65rem]">Engineering Review</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-accent">
            {underReviewCount}
          </p>
          <span className="text-[0.68rem] font-mono text-muted">Feasibility Sizing</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-success text-[0.65rem]">Proposals Issued</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-success">
            {quotedCount}
          </p>
          <span className="text-[0.68rem] font-mono text-muted">Commercial Quotations</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-line bg-surface p-4 shadow-sm">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, company, machinery type, or specs..."
            className="w-full border border-line bg-background pl-9 pr-8 py-2 text-xs font-mono text-foreground placeholder:text-muted outline-none focus:border-accent"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2 text-xs text-muted hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All RFQs" },
            { id: "unread", label: "Unread", count: unreadCount },
            { id: "new", label: "New Pipeline" },
            { id: "under-review", label: "Under Review", count: underReviewCount },
            { id: "quoted", label: "Quotation Sent", count: quotedCount },
            { id: "closed", label: "Won / Closed" },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilterStatus(st.id)}
              className={`border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                filterStatus === st.id
                  ? "border-accent bg-accent text-navy font-bold shadow-sm"
                  : "border-line bg-background text-muted hover:border-line-strong hover:text-foreground"
              }`}
            >
              <span>{st.label}</span>
              {st.count > 0 ? (
                <span className="ml-1.5 rounded bg-navy/20 px-1 py-0.2 text-[0.62rem] font-bold">
                  {st.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* RFQ Stream */}
      {enquiries.length === 0 ? (
        <EmptyState
          icon={<FileSpreadsheet className="h-8 w-8 text-muted" />}
          title="No RFQ Quotation Requests Yet"
          description="When clients submit custom machinery specifications through the Request Quote wizard, they will be logged here with complete technical parameters."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8 text-muted" />}
          title="No Quotations Match Your Filters"
          description="Try broadening your search query or switching your pipeline filter."
          action={<MiniBtn onClick={() => { setSearch(""); setFilterStatus("all"); }}>Reset Filters</MiniBtn>}
        />
      ) : (
        <div className="space-y-6">
          {filtered.map((e) => {
            const itemId = e.id || e._id;
            const isUnread = !e.read;
            const isCopied = copiedId === itemId;

            // Pipeline stage helper
            const stages = ["new", "under-review", "quoted", "closed"];
            const currentStageIdx = stages.indexOf(e.status || "new");

            return (
              <article
                key={itemId}
                className={`border bg-surface p-6 sm:p-7 shadow-md transition-all duration-200 ${
                  isUnread
                    ? "border-l-4 border-l-accent border-line"
                    : "border-line hover:border-line-strong"
                }`}
              >
                {/* Header Strip */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {e.name}
                      </h3>

                      <span className="border border-line bg-background px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
                        {e.company || "Independent Client"}
                      </span>

                      {isUnread && (
                        <span className="border border-accent/40 bg-accent/15 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-accent uppercase animate-pulse">
                          ★ New RFQ
                        </span>
                      )}

                      {e.priority && <PriorityBadge priority={e.priority} />}
                    </div>

                    <p className="mt-1 font-mono text-xs text-muted flex items-center gap-2">
                      <Clock className="h-3 w-3 inline" />
                      <span>{new Date(e.createdAt).toLocaleString()}</span>
                      {e.location && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {e.location}
                          </span>
                        </>
                      )}
                      <span>·</span>
                      <span>ID: {itemId.slice(-6).toUpperCase()}</span>
                    </p>
                  </div>

                  {/* Actions & Pipeline Control */}
                  <div className="flex flex-wrap items-center gap-2">
                    <MiniBtn
                      tone="accent"
                      onClick={() => setViewingEnquiry(e)}
                      title="Inspect full RFQ details popup"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View RFQ</span>
                    </MiniBtn>

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
                      href={`mailto:${e.email}?subject=Three Star Enterprises — Engineering Proposal for ${encodeURIComponent(e.machineType || "Machinery Build")}&body=Dear ${encodeURIComponent(e.name || "Client")},%0D%0A%0D%0AThank you for submitting your Request for Quotation (RFQ) for the ${encodeURIComponent(e.machineType || "custom machine build")}.%0D%0A%0D%0AWe have reviewed your project requirements and are pleased to provide the attached technical quotation.%0D%0A%0D%0ABest regards,%0D%0AThree Star Enterprises`}
                      className="inline-flex items-center gap-1.5 border border-accent bg-accent/15 px-3.5 py-1.5 font-mono text-xs font-bold text-accent uppercase tracking-wider transition-colors hover:bg-accent hover:text-navy shadow-sm"
                    >
                      <Send className="h-3 w-3" />
                      <span>Issue Proposal ✉</span>
                    </a>

                    <MiniBtn onClick={() => handleToggleRead(e)}>
                      {e.read ? "Mark Unread" : "Mark Read"}
                    </MiniBtn>

                    <MiniBtn tone="danger" onClick={() => setDeletingEnquiry(e)} title="Delete RFQ">
                      <Trash2 className="h-3.5 w-3.5" />
                    </MiniBtn>
                  </div>
                </div>

                {/* Pipeline Step Progress Visualizer */}
                <div className="my-4 grid grid-cols-4 gap-1.5 font-mono text-[0.65rem] uppercase">
                  {[
                    { key: "new", label: "1. Intake" },
                    { key: "under-review", label: "2. Engineering Sizing" },
                    { key: "quoted", label: "3. Quote Issued" },
                    { key: "closed", label: "4. Closed / Won" },
                  ].map((stg, sIdx) => {
                    const isDone = sIdx <= currentStageIdx;
                    const isCurrent = sIdx === currentStageIdx;
                    return (
                      <div
                        key={stg.key}
                        className={`border p-1.5 text-center transition-all ${
                          isCurrent
                            ? "border-accent bg-accent text-navy font-bold shadow-sm"
                            : isDone
                              ? "border-accent/40 bg-accent/10 text-accent font-semibold"
                              : "border-line bg-background text-muted/60"
                        }`}
                      >
                        {stg.label}
                      </div>
                    );
                  })}
                </div>

                {/* Technical Parameters Matrix */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border border-line bg-background p-4 font-mono text-xs">
                  <div>
                    <span className="text-muted block text-[0.65rem] uppercase">Target Machinery:</span>
                    <span className="font-bold text-accent text-sm flex items-center gap-1 mt-0.5">
                      <Cpu className="h-3.5 w-3.5 shrink-0" />
                      {e.machineType || "Custom Machinery"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted block text-[0.65rem] uppercase">Project Delivery Timeline:</span>
                    <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-muted shrink-0" />
                      {e.timeline || "1 – 3 Months"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted block text-[0.65rem] uppercase">Client Direct Contact:</span>
                    <p className="text-foreground">{e.phone || "No phone provided"}</p>
                    <a href={`mailto:${e.email}`} className="text-accent underline truncate block">
                      {e.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-muted block text-[0.65rem] uppercase">Volume / Component Spec:</span>
                    <span className="text-foreground block mt-0.5 font-medium">
                      {e.targetVolume || "Bespoke production"}
                    </span>
                  </div>
                </div>

                {/* Scope Description & Specifications */}
                <div className="mt-4 border border-line bg-background/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="tech-label text-accent text-[0.68rem] uppercase font-bold">
                      Technical Scope & Engineering Sizing Parameters:
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(e.message, itemId)}
                      className="inline-flex items-center gap-1 font-mono text-[0.65rem] text-muted hover:text-accent transition-colors"
                      title="Copy engineering specifications"
                    >
                      {isCopied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                      <span>{isCopied ? "Copied" : "Copy specs"}</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap">
                    {e.message}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* VIEW RFQ MODAL POPUP */}
      {viewingEnquiry && (
        <AdminModal
          isOpen={Boolean(viewingEnquiry)}
          onClose={() => setViewingEnquiry(null)}
          title={`RFQ Proposal #${(viewingEnquiry.id || viewingEnquiry._id).slice(-6).toUpperCase()} — ${viewingEnquiry.name}`}
          eyebrow="Commercial Pipeline Detail"
          size="xl"
          footer={
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2">
                <MiniBtn
                  tone="danger"
                  onClick={() => {
                    setDeletingEnquiry(viewingEnquiry);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete RFQ</span>
                </MiniBtn>
                <MiniBtn onClick={() => handleToggleRead(viewingEnquiry)}>
                  {viewingEnquiry.read ? "Mark as Unread" : "Mark as Read"}
                </MiniBtn>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${viewingEnquiry.email}?subject=Three Star Enterprises — Engineering Proposal for ${encodeURIComponent(viewingEnquiry.machineType || "Machinery Build")}&body=Dear ${encodeURIComponent(viewingEnquiry.name || "Client")},%0D%0A%0D%0AThank you for submitting your Request for Quotation (RFQ) for the ${encodeURIComponent(viewingEnquiry.machineType || "custom machine build")}.%0D%0A%0D%0AWe have reviewed your project requirements and are pleased to provide the attached technical quotation.%0D%0A%0D%0ABest regards,%0D%0AThree Star Enterprises`}
                  className="inline-flex items-center gap-1.5 border border-accent bg-accent px-4 py-2 font-mono text-xs font-bold text-navy uppercase tracking-wider transition-colors hover:bg-navy hover:text-onnavy shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Issue Formal Proposal ✉</span>
                </a>
                <MiniBtn onClick={() => setViewingEnquiry(null)}>Close</MiniBtn>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Top Status & Pipeline Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-4 border border-line bg-background p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-muted">Pipeline Status:</span>
                <select
                  value={viewingEnquiry.status || "new"}
                  onChange={(evt) =>
                    handleStatusChange(viewingEnquiry.id || viewingEnquiry._id, evt.target.value)
                  }
                  className="border border-line bg-surface px-3 py-1 text-xs font-mono font-bold text-foreground outline-none focus:border-accent"
                >
                  <option value="new">New RFQ</option>
                  <option value="under-review">Under Review</option>
                  <option value="quoted">Quotation Sent</option>
                  <option value="closed">Closed / Won</option>
                </select>

                <span className="font-mono text-xs text-muted ml-2">Priority:</span>
                <select
                  value={viewingEnquiry.priority || "standard"}
                  onChange={(evt) =>
                    handlePriorityChange(viewingEnquiry.id || viewingEnquiry._id, evt.target.value)
                  }
                  className="border border-line bg-surface px-3 py-1 text-xs font-mono text-foreground outline-none focus:border-accent"
                >
                  <option value="standard">Standard</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <Clock className="h-3.5 w-3.5" />
                <span>Submitted: {new Date(viewingEnquiry.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Client Information Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 border border-line bg-surface p-5 font-mono text-xs">
              <div>
                <span className="text-muted block text-[0.68rem] uppercase">Client Name</span>
                <p className="text-foreground font-bold text-sm mt-0.5">{viewingEnquiry.name}</p>
              </div>

              <div>
                <span className="text-muted block text-[0.68rem] uppercase">Company / Organization</span>
                <p className="text-foreground font-bold text-sm mt-0.5">
                  {viewingEnquiry.company || "Independent Client"}
                </p>
              </div>

              <div>
                <span className="text-muted block text-[0.68rem] uppercase">Location / Plant Site</span>
                <p className="text-foreground font-bold text-sm mt-0.5">
                  {viewingEnquiry.location || "Not specified"}
                </p>
              </div>

              <div>
                <span className="text-muted block text-[0.68rem] uppercase">Email Address</span>
                <a
                  href={`mailto:${viewingEnquiry.email}`}
                  className="text-accent underline font-semibold mt-0.5 block"
                >
                  {viewingEnquiry.email}
                </a>
              </div>

              <div>
                <span className="text-muted block text-[0.68rem] uppercase">Phone Number</span>
                <p className="text-foreground font-semibold mt-0.5">
                  {viewingEnquiry.phone || "Not provided"}
                </p>
              </div>

              <div>
                <span className="text-muted block text-[0.68rem] uppercase">Target Delivery Timeline</span>
                <p className="text-foreground font-semibold mt-0.5">
                  {viewingEnquiry.timeline || "1 – 3 Months"}
                </p>
              </div>
            </div>

            {/* Machinery Specifications & Target Machine */}
            <div className="border border-line bg-background p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="tech-label text-accent font-bold text-xs uppercase">
                  Target Machine Build & Volume Specs:
                </span>
                <span className="border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.65rem] text-accent font-bold uppercase">
                  {viewingEnquiry.machineType || "Custom Equipment"}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-line font-mono text-xs">
                <div>
                  <span className="text-muted text-[0.68rem] uppercase block">Equipment Class:</span>
                  <span className="font-bold text-foreground">{viewingEnquiry.machineType || "Bespoke Automation / Induction Machine"}</span>
                </div>
                <div>
                  <span className="text-muted text-[0.68rem] uppercase block">Volume / Throughput Requirement:</span>
                  <span className="font-bold text-foreground">{viewingEnquiry.targetVolume || "Custom batch size"}</span>
                </div>
              </div>
            </div>

            {/* Full Technical Scope Description */}
            <div className="border border-line bg-surface p-5 space-y-2">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="tech-label text-foreground font-bold text-xs uppercase">
                  Complete Scope of Work & Engineering Parameters:
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(viewingEnquiry.message, viewingEnquiry.id || viewingEnquiry._id)}
                  className="inline-flex items-center gap-1.5 border border-line bg-background px-3 py-1 font-mono text-[0.68rem] font-semibold text-muted hover:text-accent hover:border-accent transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy Technical Scope</span>
                </button>
              </div>

              <div className="p-3 bg-background border border-line text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {viewingEnquiry.message}
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* DELETE CONFIRMATION POPUP MODAL */}
      {deletingEnquiry && (
        <ConfirmDeleteModal
          isOpen={Boolean(deletingEnquiry)}
          onClose={() => setDeletingEnquiry(null)}
          onConfirm={handleDelete}
          title="Delete RFQ Quotation Enquiry?"
          message="Are you sure you want to permanently delete this commercial RFQ from your pipeline? All client specifications and communications logs will be removed."
          itemName={`${deletingEnquiry.name} (${deletingEnquiry.company || "Independent"}) — ${deletingEnquiry.machineType || "Machinery Build"}`}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
