"use client";

import { useState, useMemo, useEffect } from "react";
import {
  AdminHead,
  MiniBtn,
  StatusBadge,
  EmptyState,
  AdminModal,
  ConfirmDeleteModal,
} from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";
import { FeedbackItem } from "@/types";
import {
  Star,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff,
  Building2,
  Calendar,
  RotateCw,
  Award,
  MessageSquare,
  User,
  Check,
} from "lucide-react";

export default function AdminFeedbackPage() {
  const {
    feedback,
    feedbackLoading,
    fetchFeedback,
    toggleFeedbackApproval,
    deleteFeedback,
  } = useSite();

  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "approved" | "five_star">("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [viewingFeedback, setViewingFeedback] = useState<FeedbackItem | null>(null);
  const [deletingFeedback, setDeletingFeedback] = useState<FeedbackItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [flashMsg, setFlashMsg] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const flash = (msg: string) => {
    setFlashMsg(msg);
    setTimeout(() => setFlashMsg(null), 3000);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Metrics calculations
  const totalCount = feedback.length;
  const approvedCount = useMemo(
    () => feedback.filter((f) => f.isApproved || f.status === "approved").length,
    [feedback],
  );
  const pendingCount = useMemo(
    () => feedback.filter((f) => !f.isApproved && f.status !== "approved").length,
    [feedback],
  );
  const averageRating = useMemo(() => {
    if (feedback.length === 0) return 5.0;
    const sum = feedback.reduce((acc, f) => acc + (f.rating || 5), 0);
    return (sum / feedback.length).toFixed(1);
  }, [feedback]);

  // Filtered list
  const filteredList = useMemo(() => {
    return feedback.filter((f) => {
      const isApp = Boolean(f.isApproved || f.status === "approved");

      if (filterTab === "pending" && isApp) return false;
      if (filterTab === "approved" && !isApp) return false;
      if (filterTab === "five_star" && f.rating !== 5) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = f.fullName?.toLowerCase().includes(q);
        const matchComp = f.company?.toLowerCase().includes(q);
        const matchCat = f.category?.toLowerCase().includes(q);
        const matchMsg = f.message?.toLowerCase().includes(q);
        return matchName || matchComp || matchCat || matchMsg;
      }

      return true;
    });
  }, [feedback, filterTab, search]);

  // Pagination Slice
  const totalItems = filteredList.length;
  const effectivePageSize = pageSize === 9999 ? Math.max(totalItems, 1) : pageSize;
  const totalPages = Math.ceil(totalItems / effectivePageSize) || 1;
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedList = useMemo(() => {
    if (pageSize === 9999) return filteredList;
    const start = (validPage - 1) * effectivePageSize;
    return filteredList.slice(start, start + effectivePageSize);
  }, [filteredList, validPage, effectivePageSize, pageSize]);

  // Handle Toggle Approval
  const handleToggle = async (id: string, currentApproved: boolean) => {
    const nextApproved = !currentApproved;
    const res = await toggleFeedbackApproval(id, nextApproved);
    if (res.success) {
      flash(nextApproved ? "✓ Testimonial Approved and published" : "✓ Testimonial set to Pending");
      if (viewingFeedback && (viewingFeedback.id === id || viewingFeedback._id === id)) {
        setViewingFeedback({
          ...viewingFeedback,
          isApproved: nextApproved,
          status: nextApproved ? "approved" : "pending",
        });
      }
    } else {
      alert("Failed to update status: " + (res.error || ""));
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!deletingFeedback) return;
    setIsDeleting(true);
    const id = (deletingFeedback.id || deletingFeedback._id) as string;
    try {
      const res = await deleteFeedback(id);
      if (res.success) {
        if (viewingFeedback && (viewingFeedback.id === id || viewingFeedback._id === id)) {
          setViewingFeedback(null);
        }
        setDeletingFeedback(null);
        flash("✓ Feedback submission deleted");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {flashMsg && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl border border-accent bg-navy px-4 py-2.5 text-xs font-bold text-accent shadow-xl animate-in fade-in slide-in-from-top-2">
          {flashMsg}
        </div>
      )}

      {/* Header */}
      <AdminHead
        eyebrow="Client Feedback"
        title="Testimonials & Reviews Control"
        intro="Review, moderate, and approve customer feedback and shop-floor ratings for the public showcase."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchFeedback()}
              className="p-2 rounded-xl border border-line bg-surface text-muted hover:text-accent hover:border-accent transition cursor-pointer"
              title="Refresh Feedback"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
        }
      />

      {/* Metrics Strip HUD */}
      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Total Submissions</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">{totalCount}</p>
          <span className="text-[0.68rem] text-muted">All Client Reviews</span>
        </div>

        <div className="bg-surface p-5">
          <span className="tech-label text-emerald-500 text-[0.65rem]">Approved Testimonials</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-emerald-500">{approvedCount}</p>
          <span className="text-[0.68rem] text-muted">Live on Homepage</span>
        </div>

        <div className="bg-surface p-5">
          <span className="tech-label text-amber-500 text-[0.65rem]">Pending Moderation</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-amber-500">{pendingCount}</p>
          <span className="text-[0.68rem] text-muted">Awaiting Admin Action</span>
        </div>

        <div className="bg-surface p-5">
          <span className="tech-label text-accent text-[0.65rem]">Average Star Rating</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <p className="font-display text-2xl sm:text-3xl font-bold text-accent">{averageRating}</p>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[0.68rem] text-muted">Client Satisfaction</span>
        </div>
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="space-y-4 rounded-3xl border border-line bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Box */}
          <div className="flex-1 min-w-[260px] max-w-md relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by client name, company, category, or review..."
              className="w-full rounded-2xl border border-line bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2 text-xs text-muted hover:text-foreground p-0.5 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl border border-line bg-background p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition cursor-pointer ${
                viewMode === "table" ? "bg-navy text-onnavy" : "text-muted hover:text-foreground"
              }`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition cursor-pointer ${
                viewMode === "grid" ? "bg-navy text-onnavy" : "text-muted hover:text-foreground"
              }`}
            >
              Grid Cards
            </button>
          </div>
        </div>

        {/* Filter Tabs Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
          <button
            type="button"
            onClick={() => {
              setFilterTab("all");
              setCurrentPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              filterTab === "all"
                ? "bg-accent text-navy shadow-xs"
                : "border border-line bg-background text-muted hover:text-foreground hover:border-accent/40"
            }`}
          >
            All Reviews ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterTab("pending");
              setCurrentPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              filterTab === "pending"
                ? "bg-amber-400 text-navy shadow-xs"
                : "border border-line bg-background text-muted hover:text-foreground hover:border-amber-400/40"
            }`}
          >
            Pending Approval ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterTab("approved");
              setCurrentPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              filterTab === "approved"
                ? "bg-emerald-500 text-white shadow-xs"
                : "border border-line bg-background text-muted hover:text-foreground hover:border-emerald-400/40"
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterTab("five_star");
              setCurrentPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              filterTab === "five_star"
                ? "bg-navy text-onnavy border border-accent"
                : "border border-line bg-background text-muted hover:text-foreground"
            }`}
          >
            ★ 5-Star Only ({feedback.filter((f) => f.rating === 5).length})
          </button>
        </div>
      </div>

      {/* Main List */}
      {feedbackLoading ? (
        <div className="rounded-3xl border border-line bg-surface p-12 text-center text-xs text-muted">
          Loading feedback submissions...
        </div>
      ) : filteredList.length === 0 ? (
        <EmptyState
          title="No Feedback Submissions Found"
          description={
            search || filterTab !== "all"
              ? "No feedback matched your current search or filter criteria."
              : "No client feedback has been submitted yet."
          }
          action={
            search || filterTab !== "all" ? (
              <MiniBtn
                onClick={() => {
                  setSearch("");
                  setFilterTab("all");
                }}
              >
                Reset Filters
              </MiniBtn>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Table View */}
          {viewMode === "table" && (
            <div className="border border-line bg-surface rounded-3xl overflow-x-auto shadow-sm">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-background/60 text-xs font-semibold uppercase tracking-wider text-muted">
                    <th className="px-4 py-3.5">Client & Facility</th>
                    <th className="px-4 py-3.5">Rating</th>
                    <th className="px-4 py-3.5">Machinery Category</th>
                    <th className="px-4 py-3.5">Review Message</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {paginatedList.map((fb) => {
                    const id = (fb.id || fb._id) as string;
                    const isApproved = Boolean(fb.isApproved || fb.status === "approved");
                    const isExpanded = Boolean(expandedIds[id]);

                    return (
                      <tr key={id} className="hover:bg-line/20 transition-colors">
                        {/* Client info */}
                        <td className="px-4 py-3.5 align-top min-w-[180px]">
                          <div className="flex items-center gap-2.5">
                            {fb.avatarUrl ? (
                              <img
                                src={fb.avatarUrl}
                                alt={fb.fullName}
                                className="h-9 w-9 rounded-full object-cover border border-line shrink-0"
                              />
                            ) : (
                              <div className="h-9 w-9 rounded-full bg-navy border border-accent/30 flex items-center justify-center font-bold text-xs text-accent shrink-0">
                                {fb.fullName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span
                                className="font-bold text-foreground hover:text-accent cursor-pointer truncate block"
                                onClick={() => setViewingFeedback(fb)}
                              >
                                {fb.fullName}
                              </span>
                              {fb.company && (
                                <p className="text-xs text-muted truncate">{fb.company}</p>
                              )}
                              <span className="text-[0.65rem] text-muted/70 block mt-0.5">
                                {fb.submittedDate
                                  ? new Date(fb.submittedDate).toLocaleDateString()
                                  : "Recent"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Rating Stars */}
                        <td className="px-4 py-3.5 align-top min-w-[110px]">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star
                                key={s}
                                className={`h-3.5 w-3.5 ${
                                  s < (fb.rating || 5)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-line"
                                }`}
                              />
                            ))}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5 align-top min-w-[150px]">
                          <span className="rounded-full border border-line bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground inline-block">
                            {fb.category}
                          </span>
                        </td>

                        {/* Review Message */}
                        <td className="px-4 py-3.5 align-top max-w-xs">
                          <p
                            className={`text-xs text-muted leading-relaxed ${
                              isExpanded ? "break-words" : "line-clamp-2"
                            }`}
                          >
                            "{fb.message}"
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleExpand(id)}
                            className="text-[0.65rem] font-bold text-accent hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer"
                          >
                            {isExpanded ? (
                              <>
                                <EyeOff className="h-3 w-3" /> Show less
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3" /> Read full
                              </>
                            )}
                          </button>
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3.5 align-top">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold border ${
                              isApproved
                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                                : "border-amber-400/40 bg-amber-400/10 text-amber-500"
                            }`}
                          >
                            {isApproved ? "✓ Approved" : "⏳ Pending"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 align-top text-right min-w-[140px]">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle Approve/Reject */}
                            <button
                              type="button"
                              onClick={() => handleToggle(id, isApproved)}
                              className={`rounded-full px-2.5 py-1 text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                                isApproved
                                  ? "border-amber-400/40 bg-amber-400/10 text-amber-500 hover:bg-amber-400 hover:text-navy"
                                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                              }`}
                              title={isApproved ? "Revoke Approval" : "Approve for Public Testimonials"}
                            >
                              {isApproved ? (
                                <>
                                  <ThumbsDown className="h-3 w-3" />
                                  <span>Reject</span>
                                </>
                              ) : (
                                <>
                                  <ThumbsUp className="h-3 w-3" />
                                  <span>Approve</span>
                                </>
                              )}
                            </button>

                            <MiniBtn
                              tone="accent"
                              onClick={() => setViewingFeedback(fb)}
                              title="Inspect Full Review"
                            >
                              <Eye className="h-3 w-3" />
                            </MiniBtn>

                            <MiniBtn
                              tone="danger"
                              onClick={() => setDeletingFeedback(fb)}
                              title="Delete Review"
                            >
                              <Trash2 className="h-3 w-3" />
                            </MiniBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedList.map((fb) => {
                const id = (fb.id || fb._id) as string;
                const isApproved = Boolean(fb.isApproved || fb.status === "approved");

                return (
                  <div
                    key={id}
                    className="rounded-3xl border border-line bg-surface p-5 flex flex-col justify-between shadow-sm hover:border-accent/40 transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star
                              key={s}
                              className={`h-3.5 w-3.5 ${
                                s < (fb.rating || 5)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-line"
                              }`}
                            />
                          ))}
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold border ${
                            isApproved
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                              : "border-amber-400/40 bg-amber-400/10 text-amber-500"
                          }`}
                        >
                          {isApproved ? "✓ Approved" : "⏳ Pending"}
                        </span>
                      </div>

                      <div className="max-h-28 overflow-y-auto pr-1.5 custom-scrollbar mb-3">
                        <blockquote className="text-xs text-foreground/90 italic leading-relaxed break-words">
                          "{fb.message}"
                        </blockquote>
                      </div>
                    </div>

                    <div className="border-t border-line pt-4">
                      <div className="flex items-center gap-2.5 mb-3">
                        {fb.avatarUrl ? (
                          <img
                            src={fb.avatarUrl}
                            alt={fb.fullName}
                            className="h-8 w-8 rounded-full object-cover border border-line shrink-0"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-navy border border-accent/30 flex items-center justify-center font-bold text-xs text-accent shrink-0">
                            {fb.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {fb.fullName}
                          </h4>
                          <p className="text-[0.68rem] text-muted truncate">
                            {fb.company || fb.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggle(id, isApproved)}
                          className={`rounded-full px-3 py-1 text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                            isApproved
                              ? "border-amber-400/40 bg-amber-400/10 text-amber-500 hover:bg-amber-400 hover:text-navy"
                              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                          }`}
                        >
                          {isApproved ? "Reject" : "Approve"}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <MiniBtn tone="accent" onClick={() => setViewingFeedback(fb)}>
                            <Eye className="h-3 w-3" />
                          </MiniBtn>
                          <MiniBtn tone="danger" onClick={() => setDeletingFeedback(fb)}>
                            <Trash2 className="h-3 w-3" />
                          </MiniBtn>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Toolbar */}
          <div className="rounded-3xl border border-line bg-surface p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="text-xs text-muted">
              Showing{" "}
              <strong className="text-foreground">
                {totalItems === 0 ? 0 : (validPage - 1) * effectivePageSize + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-foreground">
                {Math.min(validPage * effectivePageSize, totalItems)}
              </strong>{" "}
              of <strong className="text-foreground">{totalItems}</strong> reviews
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={validPage === 1}
                  className="px-3 py-1 rounded-xl border border-line text-xs font-semibold text-foreground hover:border-accent hover:text-accent disabled:opacity-30 transition cursor-pointer"
                >
                  ‹ Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`min-w-[32px] px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      validPage === p
                        ? "border-accent bg-accent text-navy font-bold shadow-xs"
                        : "border-line text-muted hover:border-line-strong hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={validPage === totalPages}
                  className="px-3 py-1 rounded-xl border border-line text-xs font-semibold text-foreground hover:border-accent hover:text-accent disabled:opacity-30 transition cursor-pointer"
                >
                  Next ›
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* VIEW FEEDBACK INSPECTION MODAL */}
      {viewingFeedback && (
        <AdminModal
          isOpen={Boolean(viewingFeedback)}
          onClose={() => setViewingFeedback(null)}
          title={`Review from ${viewingFeedback.fullName}`}
          eyebrow="Client Testimonial Detail"
          size="lg"
          footer={
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const id = (viewingFeedback.id || viewingFeedback._id) as string;
                    handleToggle(id, Boolean(viewingFeedback.isApproved || viewingFeedback.status === "approved"));
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    viewingFeedback.isApproved || viewingFeedback.status === "approved"
                      ? "border-amber-400 bg-amber-400 text-navy font-bold"
                      : "border-emerald-500 bg-emerald-500 text-white font-bold"
                  }`}
                >
                  {viewingFeedback.isApproved || viewingFeedback.status === "approved" ? (
                    <>
                      <ThumbsDown className="h-3.5 w-3.5" />
                      <span>Revoke Approval (Set Pending)</span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>Approve & Publish to Homepage</span>
                    </>
                  )}
                </button>

                <MiniBtn
                  tone="danger"
                  onClick={() => {
                    const p = viewingFeedback;
                    setViewingFeedback(null);
                    setDeletingFeedback(p);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </MiniBtn>
              </div>

              <MiniBtn onClick={() => setViewingFeedback(null)}>Close</MiniBtn>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Star Rating & Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-line bg-background">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`h-5 w-5 ${
                        s < (viewingFeedback.rating || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-line"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-foreground">
                  ({viewingFeedback.rating || 5} of 5 Stars)
                </span>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold border ${
                  viewingFeedback.isApproved || viewingFeedback.status === "approved"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                    : "border-amber-400/40 bg-amber-400/10 text-amber-500"
                }`}
              >
                {viewingFeedback.isApproved || viewingFeedback.status === "approved"
                  ? "✓ Approved Testimonial"
                  : "⏳ Pending Approval"}
              </span>
            </div>

            {/* Review Quote Text */}
            <div className="p-5 rounded-2xl border border-line bg-surface">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted block mb-2">
                Review Text
              </span>
              <blockquote className="text-sm font-sans leading-relaxed text-foreground italic">
                "{viewingFeedback.message}"
              </blockquote>
            </div>

            {/* Author Profile Metadata */}
            <div className="grid gap-3 sm:grid-cols-2 rounded-2xl border border-line bg-background p-4 text-xs">
              <div>
                <span className="text-muted text-[0.68rem] uppercase font-bold block">Author Full Name</span>
                <span className="font-bold text-foreground text-sm mt-0.5 block">{viewingFeedback.fullName}</span>
              </div>
              <div>
                <span className="text-muted text-[0.68rem] uppercase font-bold block">Company / Role</span>
                <span className="font-bold text-foreground text-sm mt-0.5 block">
                  {viewingFeedback.company || "Not specified"}
                </span>
              </div>
              <div>
                <span className="text-muted text-[0.68rem] uppercase font-bold block">Equipment Category</span>
                <span className="font-bold text-accent mt-0.5 block">{viewingFeedback.category}</span>
              </div>
              <div>
                <span className="text-muted text-[0.68rem] uppercase font-bold block">Submitted Date</span>
                <span className="font-bold text-foreground mt-0.5 block">
                  {viewingFeedback.submittedDate
                    ? new Date(viewingFeedback.submittedDate).toLocaleString()
                    : "Recent"}
                </span>
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingFeedback && (
        <ConfirmDeleteModal
          isOpen={Boolean(deletingFeedback)}
          onClose={() => setDeletingFeedback(null)}
          onConfirm={handleDelete}
          title={`Delete review from "${deletingFeedback.fullName}"?`}
          message="This action will permanently delete this client review from the database. This cannot be undone."
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
