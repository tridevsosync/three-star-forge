"use client";

import { useState, useMemo } from "react";
import {
  AdminHead,
  MiniBtn,
  StatusBadge,
  EmptyState,
  AdminModal,
  ConfirmDeleteModal,
} from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Search,
  CheckCircle2,
  Trash2,
  Send,
  ExternalLink,
  MessageSquare,
  Clock,
  RotateCw,
  Copy,
  Check,
  Eye,
} from "lucide-react";

export default function AdminContactsPage() {
  const { contacts, contactsLoading, updateContact, deleteContact, fetchContacts } = useSite();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'unread' | 'in-progress' | 'resolved'
  const [viewingContact, setViewingContact] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [flashMsg, setFlashMsg] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const flash = (msg) => {
    setFlashMsg(msg);
    setTimeout(() => setFlashMsg(null), 3000);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    flash("✓ Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "unread" && !c.read) ||
        (filterStatus === "in-progress" && c.status === "in-progress") ||
        (filterStatus === "resolved" && c.status === "resolved");

      const matchSearch =
        !search.trim() ||
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.company?.toLowerCase().includes(search.toLowerCase()) ||
        c.subject?.toLowerCase().includes(search.toLowerCase()) ||
        c.message?.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [contacts, filterStatus, search]);

  const unreadCount = useMemo(() => contacts.filter((c) => !c.read).length, [contacts]);
  const inProgressCount = useMemo(
    () => contacts.filter((c) => c.status === "in-progress").length,
    [contacts],
  );
  const resolvedCount = useMemo(
    () => contacts.filter((c) => c.status === "resolved").length,
    [contacts],
  );

  const handleToggleRead = async (contact) => {
    const newRead = !contact.read;
    await updateContact(contact.id || contact._id, { read: newRead });
    if (viewingContact && (viewingContact.id === contact.id || viewingContact._id === contact._id)) {
      setViewingContact({ ...viewingContact, read: newRead });
    }
    flash(newRead ? "✓ Marked as read" : "✓ Marked as unread");
  };

  const handleStatusChange = async (id, status) => {
    await updateContact(id, { status, read: true });
    if (viewingContact && (viewingContact.id === id || viewingContact._id === id)) {
      setViewingContact({ ...viewingContact, status, read: true });
    }
    flash(`✓ Status updated to "${status}"`);
  };

  const handleDelete = async () => {
    if (!deletingContact) return;
    setIsDeleting(true);
    const id = deletingContact.id || deletingContact._id;
    try {
      await deleteContact(id);
      if (viewingContact && (viewingContact.id === id || viewingContact._id === id)) {
        setViewingContact(null);
      }
      setDeletingContact(null);
      flash("✓ Contact inquiry deleted successfully");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <AdminHead
        title="Contact Inquiries & Communications"
        eyebrow="Inbound Messages"
        intro="Direct communication, support tickets, and facility visit requests submitted through the public /contact form."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {flashMsg && (
              <span className="rounded-xl border border-accent bg-accent/15 px-3 py-1.5 font-sans text-xs font-semibold text-accent animate-pulse shadow-sm">
                {flashMsg}
              </span>
            )}
            <MiniBtn onClick={fetchContacts} disabled={contactsLoading}>
              <RotateCw className={`h-3.5 w-3.5 ${contactsLoading ? "animate-spin" : ""}`} />
              <span>{contactsLoading ? "Syncing..." : "Refresh Inbox"}</span>
            </MiniBtn>
          </div>
        }
      />

      {/* Metrics HUD */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <span className="font-sans font-bold text-muted text-[0.68rem] uppercase tracking-wider block">Total Inquiries</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {contacts.length}
          </p>
          <span className="text-xs font-sans text-muted">All-Time Messages</span>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <span className="font-sans font-bold text-danger text-[0.68rem] uppercase tracking-wider block">Unread Inquiries</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-danger">
            {unreadCount}
          </p>
          <span className="text-xs font-sans text-muted">Awaiting Review</span>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <span className="font-sans font-bold text-accent text-[0.68rem] uppercase tracking-wider block">Under Discussion</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-accent">
            {inProgressCount}
          </p>
          <span className="text-xs font-sans text-muted">In Progress</span>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <span className="font-sans font-bold text-success text-[0.68rem] uppercase tracking-wider block">Resolved & Closed</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-success">
            {resolvedCount}
          </p>
          <span className="text-xs font-sans text-muted">Completed Queries</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sender, email, company, or message..."
            className="w-full rounded-xl border border-line bg-background pl-9 pr-8 py-2.5 text-xs font-sans text-foreground placeholder:text-muted outline-none focus:border-accent shadow-xs"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-xs text-muted hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Messages" },
            { id: "unread", label: "Unread", count: unreadCount },
            { id: "in-progress", label: "In Progress", count: inProgressCount },
            { id: "resolved", label: "Resolved", count: resolvedCount },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilterStatus(st.id)}
              className={`rounded-xl px-4 py-2 font-sans text-xs font-bold transition-all cursor-pointer ${
                filterStatus === st.id
                  ? "bg-accent text-navy font-bold shadow-md shadow-accent/20 scale-[1.02]"
                  : "bg-background border border-line text-muted hover:border-accent hover:text-foreground"
              }`}
            >
              <span>{st.label}</span>
              {st.count > 0 ? (
                <span className="ml-1.5 rounded-full bg-navy/20 px-1.5 py-0.5 text-[0.65rem] font-bold">
                  {st.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Stream */}
      {contacts.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-8 w-8 text-muted" />}
          title="No Contact Inquiries Yet"
          description="Messages submitted through the public /contact form will be delivered here in real-time."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8 text-muted" />}
          title="No Messages Match Your Filters"
          description="Try modifying your search keywords or switching your active status filter."
          action={<MiniBtn onClick={() => { setSearch(""); setFilterStatus("all"); }}>Reset Filters</MiniBtn>}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => {
            const itemId = c.id || c._id;
            const isUnread = !c.read;
            const isCopied = copiedId === itemId;

            return (
              <article
                key={itemId}
                className={`rounded-2xl border bg-surface p-6 shadow-xs transition-all ${
                  isUnread
                    ? "border-accent shadow-md ring-1 ring-accent/30"
                    : "border-line hover:border-line-strong"
                }`}
              >
                {/* Header Strip */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 font-display font-bold text-sm text-accent">
                        {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-base font-bold text-foreground line-clamp-1 max-w-sm break-words" title={c.name}>
                            {c.name}
                          </h3>
                          {isUnread && (
                            <span className="rounded-full border border-accent/50 bg-accent/15 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent uppercase animate-pulse shrink-0">
                              ★ New Message
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted font-sans">
                          {c.company ? `${c.company} · ` : ""}
                          <Clock className="inline h-3 w-3 mr-1" />
                          {new Date(c.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Pipeline Selector */}
                  <div className="flex flex-wrap items-center gap-2">
                    <MiniBtn
                      tone="accent"
                      onClick={() => setViewingContact(c)}
                      title="Inspect full message details popup"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Message</span>
                    </MiniBtn>

                    <select
                      value={c.status || (c.read ? "resolved" : "new")}
                      onChange={(e) => handleStatusChange(itemId, e.target.value)}
                      className="rounded-xl border border-line bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-accent font-sans"
                    >
                      <option value="new">Status: New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    <a
                      href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject || "Your Inquiry to Three Star Enterprises")}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent uppercase tracking-wider transition-colors hover:bg-accent hover:text-navy font-sans"
                    >
                      <Send className="h-3 w-3" />
                      <span>Reply via Email</span>
                    </a>

                    <MiniBtn onClick={() => handleToggleRead(c)}>
                      {c.read ? "Mark Unread" : "Mark Read"}
                    </MiniBtn>

                    <MiniBtn tone="danger" onClick={() => setDeletingContact(c)} title="Delete Inquiry">
                      <Trash2 className="h-3.5 w-3.5" />
                    </MiniBtn>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs border-b border-line pb-4 font-sans">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted shrink-0" />
                    <div>
                      <span className="text-muted text-[0.65rem] uppercase block font-semibold">Email Address:</span>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-accent underline font-semibold hover:text-foreground"
                      >
                        {c.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted shrink-0" />
                    <div>
                      <span className="text-muted text-[0.65rem] uppercase block font-semibold">Contact Phone:</span>
                      <span className="text-foreground font-medium">{c.phone || "Not provided"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-muted shrink-0" />
                    <div>
                      <span className="text-muted text-[0.65rem] uppercase block font-semibold">Organization:</span>
                      <span className="text-foreground font-medium">{c.company || "Individual / Not specified"}</span>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="mt-4 rounded-xl border border-line bg-background/60 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-accent text-[0.68rem] uppercase font-bold truncate max-w-md">
                      Subject: {c.subject || "General Inquiry"}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(c.message, itemId)}
                      className="inline-flex items-center gap-1 text-[0.68rem] text-muted hover:text-accent transition-colors shrink-0 font-sans"
                      title="Copy message content"
                    >
                      {isCopied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                      <span>{isCopied ? "Copied" : "Copy text"}</span>
                    </button>
                  </div>
                  <p className={`text-sm font-sans text-foreground leading-relaxed whitespace-pre-wrap break-words ${expandedIds[itemId] ? "" : "line-clamp-4"}`}>
                    {c.message}
                  </p>
                  {c.message && c.message.length > 200 && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(itemId)}
                      className="mt-2.5 inline-flex items-center gap-1 font-sans text-[0.72rem] font-bold text-accent hover:underline uppercase tracking-wider cursor-pointer"
                    >
                      {expandedIds[itemId] ? "▲ Show Less" : `▼ Read Full Message (${c.message.length} chars)`}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* VIEW CONTACT MODAL POPUP */}
      {viewingContact && (
        <AdminModal
          isOpen={Boolean(viewingContact)}
          onClose={() => setViewingContact(null)}
          title={`Message from ${viewingContact.name}`}
          eyebrow="Direct Inquiry Detail"
          size="lg"
          footer={
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2">
                <MiniBtn
                  tone="danger"
                  onClick={() => {
                    setDeletingContact(viewingContact);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Inquiry</span>
                </MiniBtn>
                <MiniBtn onClick={() => handleToggleRead(viewingContact)}>
                  {viewingContact.read ? "Mark as Unread" : "Mark as Read"}
                </MiniBtn>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${viewingContact.email}?subject=Re: ${encodeURIComponent(viewingContact.subject || "Your Inquiry to Three Star Enterprises")}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-accent bg-accent px-4 py-2 font-sans text-xs font-bold text-navy uppercase tracking-wider transition-colors hover:bg-navy hover:text-onnavy shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Reply via Email ✉</span>
                </a>
                <MiniBtn onClick={() => setViewingContact(null)}>Close</MiniBtn>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Top Status Selector */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-background p-4">
              <div className="flex items-center gap-3">
                <span className="font-sans text-xs font-bold text-muted">Status:</span>
                <select
                  value={viewingContact.status || (viewingContact.read ? "resolved" : "new")}
                  onChange={(e) =>
                    handleStatusChange(viewingContact.id || viewingContact._id, e.target.value)
                  }
                  className="rounded-xl border border-line bg-surface px-3 py-1.5 font-sans text-xs font-semibold text-foreground outline-none focus:border-accent"
                >
                  <option value="new">Status: New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2 font-sans text-xs text-muted">
                <Clock className="h-3.5 w-3.5" />
                <span>Received: {new Date(viewingContact.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Sender Info Card */}
            <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-line bg-surface p-5 font-sans text-xs">
              <div>
                <span className="text-muted block text-[0.68rem] uppercase font-bold">Sender Full Name</span>
                <p className="text-foreground font-bold text-sm mt-0.5">{viewingContact.name}</p>
              </div>

              <div>
                <span className="text-muted block text-[0.68rem] uppercase font-bold">Company / Organization</span>
                <p className="text-foreground font-bold text-sm mt-0.5">
                  {viewingContact.company || "Individual / Not specified"}
                </p>
              </div>

              <div>
                <span className="text-muted block text-[0.68rem] uppercase font-bold">Email Address</span>
                <a
                  href={`mailto:${viewingContact.email}`}
                  className="text-accent underline font-semibold mt-0.5 block"
                >
                  {viewingContact.email}
                </a>
              </div>

              <div>
                <span className="text-muted block text-[0.68rem] uppercase font-bold">Phone Number</span>
                <p className="text-foreground font-semibold mt-0.5">
                  {viewingContact.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Subject & Full Message */}
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <div>
                  <span className="text-muted text-[0.65rem] font-sans uppercase font-bold block">Subject Line:</span>
                  <h4 className="font-display font-bold text-foreground text-sm">
                    {viewingContact.subject || "General Inquiry"}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(viewingContact.message, viewingContact.id || viewingContact._id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-background px-3 py-1 font-sans text-[0.68rem] font-semibold text-muted hover:text-accent hover:border-accent transition-colors cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy Message</span>
                </button>
              </div>

              <div className="p-3 bg-background rounded-xl border border-line text-sm font-sans text-foreground leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                {viewingContact.message}
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* DELETE CONFIRMATION POPUP MODAL */}
      {deletingContact && (
        <ConfirmDeleteModal
          isOpen={Boolean(deletingContact)}
          onClose={() => setDeletingContact(null)}
          onConfirm={handleDelete}
          title="Delete Contact Inquiry?"
          message="Are you sure you want to delete this communication message from your inbox? This action cannot be undone."
          itemName={`${deletingContact.name} — ${deletingContact.subject || "General Inquiry"}`}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

