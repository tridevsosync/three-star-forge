"use client";

import { useState, useMemo } from "react";
import { AdminHead, MiniBtn, Panel } from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";

export default function AdminContactsPage() {
  const { contacts, contactsLoading, updateContact, deleteContact, fetchContacts } = useSite();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'unread' | 'in-progress' | 'resolved'
  const [selectedContact, setSelectedContact] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [flashMsg, setFlashMsg] = useState(null);

  const flash = (msg) => {
    setFlashMsg(msg);
    window.setTimeout(() => setFlashMsg(null), 3000);
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
  const inProgressCount = useMemo(() => contacts.filter((c) => c.status === "in-progress").length, [contacts]);
  const resolvedCount = useMemo(() => contacts.filter((c) => c.status === "resolved").length, [contacts]);

  const handleToggleRead = async (contact) => {
    const newRead = !contact.read;
    await updateContact(contact.id || contact._id, { read: newRead });
    flash(newRead ? "✓ Marked as read" : "✓ Marked as unread");
  };

  const handleStatusChange = async (id, status) => {
    await updateContact(id, { status, read: true });
    flash(`✓ Status updated to "${status}"`);
  };

  const handleDelete = async (id) => {
    await deleteContact(id);
    setConfirmDeleteId(null);
    if (selectedContact?.id === id || selectedContact?._id === id) {
      setSelectedContact(null);
    }
    flash("✓ Contact deleted");
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <AdminHead
        title="Contact Messages & Inquiries"
        intro="General communication, support requests, and facility visit inquiries submitted via the public /contact page."
        action={
          <div className="flex items-center gap-3">
            {flashMsg && (
              <span className="border border-accent bg-accent/15 px-3 py-1.5 font-mono text-xs font-semibold text-accent animate-pulse">
                {flashMsg}
              </span>
            )}
            <button
              type="button"
              onClick={fetchContacts}
              className="p-2 border border-line bg-surface text-muted hover:text-accent hover:border-accent transition-colors font-mono text-xs"
              title="Refresh messages"
            >
              ↻ Refresh
            </button>
          </div>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 shadow-sm">
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Total Messages</span>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{contacts.length}</p>
          <span className="text-[0.68rem] font-mono text-muted">All Time Submissions</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-danger text-[0.65rem]">Unread Inquiries</span>
          <p className="mt-1 font-display text-2xl font-bold text-danger">{unreadCount}</p>
          <span className="text-[0.68rem] font-mono text-muted">Requires Attention</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-accent text-[0.65rem]">In Progress</span>
          <p className="mt-1 font-display text-2xl font-bold text-accent">{inProgressCount}</p>
          <span className="text-[0.68rem] font-mono text-muted">Under Discussion</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-success text-[0.65rem]">Resolved</span>
          <p className="mt-1 font-display text-2xl font-bold text-success">{resolvedCount}</p>
          <span className="text-[0.68rem] font-mono text-muted">Closed Queries</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-line bg-surface p-4 shadow-sm">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company, or message..."
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
          {["all", "unread", "in-progress", "resolved"].map((st) => (
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
              {st} {st === "unread" && unreadCount > 0 ? `(${unreadCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {contacts.length === 0 ? (
        <div className="border border-dashed border-line bg-surface p-16 text-center">
          <p className="font-display text-lg font-bold text-foreground">No Contact Messages Yet</p>
          <p className="mt-2 text-sm text-muted">Submissions from the public /contact form will appear here automatically.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-line bg-surface p-12 text-center text-sm text-muted">
          No contact messages match your active search or filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => {
            const itemId = c.id || c._id;
            return (
              <article
                key={itemId}
                className={`border transition-all duration-300 p-6 bg-surface shadow-sm ${
                  !c.read ? "border-l-4 border-l-accent border-line" : "border-line hover:border-line-strong"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-base font-bold text-foreground">{c.name}</h3>
                      {!c.read && (
                        <span className="border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-accent uppercase">
                          New Message
                        </span>
                      )}
                      <span className="border border-line bg-background px-2 py-0.5 font-mono text-[0.65rem] text-muted uppercase">
                        {c.subject || "General Inquiry"}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {c.company ? `${c.company} · ` : ""}{new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={c.status || "new"}
                      onChange={(e) => handleStatusChange(itemId, e.target.value)}
                      className="border border-line bg-background px-2.5 py-1 text-xs font-mono text-foreground outline-none focus:border-accent"
                    >
                      <option value="new">Status: New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    <a
                      href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject || "Your Inquiry to Three Star Enterprises")}`}
                      className="border border-line bg-surface hover:border-accent hover:text-accent px-3 py-1 font-mono text-xs text-foreground transition-colors"
                    >
                      Reply via Email ✉
                    </a>

                    <MiniBtn onClick={() => handleToggleRead(c)}>
                      {c.read ? "Mark Unread" : "Mark Read"}
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

                {/* Contact Meta */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
                  <div>
                    <span className="text-muted block text-[0.65rem] uppercase">Email:</span>
                    <a href={`mailto:${c.email}`} className="text-accent underline font-medium">
                      {c.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-muted block text-[0.65rem] uppercase">Phone:</span>
                    <span className="text-foreground">{c.phone || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[0.65rem] uppercase">Company:</span>
                    <span className="text-foreground">{c.company || "Individual / Not Provided"}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="mt-4 p-4 border border-line bg-background/60">
                  <span className="tech-label text-muted text-[0.65rem] block mb-1">Message Content:</span>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{c.message}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
