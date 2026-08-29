"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  AdminHead,
  MiniBtn,
  Panel,
  TextField,
  Toggle,
  AdminModal,
  ConfirmDeleteModal,
} from "@/components/site/admin-ui";
import { GALLERY_CATEGORIES } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Eye, Trash2, Edit, ExternalLink, Image as ImageIcon } from "lucide-react";

function emptyItem(defaultCat = "Machines") {
  return {
    id: `g-${Date.now()}`,
    title: "",
    category: defaultCat,
    image: "",
    cloudinaryPublicId: "",
    description: "",
    featured: false,
    featuredInHero: false,
    order: 0,
    createdAt: new Date().toISOString(),
  };
}

export default function AdminGalleryPage() {
  const {
    gallery,
    galleryLoading,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    bulkDeleteGallery,
    clearAllGallery,
    uploadToCloudinary,
    fetchGallery,
    usedImages,
  } = useSite();

  // Filters & Search
  const [filterCat, setFilterCat] = useState("All");
  const [filterFeatured, setFilterFeatured] = useState("All"); // 'All' | 'Hero' | 'Gallery' | 'Standard'
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'alpha' | 'alpha-desc' | 'featured'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // 6, 9, 12, 24, or 9999 (All)

  // Edit / Add State
  const [editing, setEditing] = useState<any>(null);
  const [viewingPhoto, setViewingPhoto] = useState<any>(null);
  const [imageMode, setImageMode] = useState("upload"); // 'upload' | 'url'
  const [customCat, setCustomCat] = useState("");
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Deletion & Bulk
  const [deletingPhoto, setDeletingPhoto] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // Toast / Feedback
  const [flashMsg, setFlashMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFormRef = useRef<HTMLDivElement | null>(null);

  const startEditing = (item: any) => {
    setEditing(item);
    setImageMode(item && item.image && item.image.startsWith("http") ? "url" : "upload");
    setIsAddingNewCat(false);
    setCustomCat("");
    setTimeout(() => {
      if (editFormRef.current) {
        editFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  };

  const flash = (msg: string) => {
    setFlashMsg(msg);
    window.setTimeout(() => setFlashMsg(null), 3500);
  };

  // Reset page to 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCat, filterFeatured, search, sortBy, pageSize]);

  // Dynamic list of categories
  const allCategories = useMemo(() => {
    const set = new Set(["All", ...GALLERY_CATEGORIES.filter((c) => c !== "All")]);
    gallery.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [gallery]);

  const selectCategories = useMemo(
    () => allCategories.filter((c) => c !== "All"),
    [allCategories],
  );

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: gallery.length };
    gallery.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return counts;
  }, [gallery]);

  const featuredHeroCount = useMemo(
    () => gallery.filter((g) => g.featuredInHero || (g as any).featuredInHeader).length,
    [gallery],
  );

  const featuredGalleryTotal = useMemo(
    () => gallery.filter((g) => g.featured).length,
    [gallery],
  );

  // Filter & Search & Sort Pipeline
  const filteredAndSorted = useMemo(() => {
    let list = gallery.filter((g) => {
      const matchCat = filterCat === "All" || g.category === filterCat;
      const isHero = Boolean(g.featuredInHero || (g as any).featuredInHeader);
      const isGalleryFeatured = Boolean(g.featured);

      const matchFeatured =
        filterFeatured === "All" ||
        (filterFeatured === "Hero" && isHero) ||
        (filterFeatured === "Gallery" && isGalleryFeatured) ||
        (filterFeatured === "Standard" && !isHero && !isGalleryFeatured);

      const matchSearch =
        !search.trim() ||
        g.title?.toLowerCase().includes(search.toLowerCase()) ||
        g.category?.toLowerCase().includes(search.toLowerCase()) ||
        g.description?.toLowerCase().includes(search.toLowerCase()) ||
        (g.id && g.id.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchFeatured && matchSearch;
    });

    if (sortBy === "newest") {
      // Default archive sort
    } else if (sortBy === "oldest") {
      list = [...list].reverse();
    } else if (sortBy === "alpha") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "alpha-desc") {
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "featured") {
      list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [gallery, filterCat, filterFeatured, search, sortBy]);

  // Pagination Slice
  const totalItems = filteredAndSorted.length;
  const effectivePageSize = pageSize === 9999 ? Math.max(totalItems, 1) : pageSize;
  const totalPages = Math.ceil(totalItems / effectivePageSize) || 1;
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedItems = useMemo(() => {
    if (pageSize === 9999) return filteredAndSorted;
    const start = (validPage - 1) * effectivePageSize;
    return filteredAndSorted.slice(start, start + effectivePageSize);
  }, [filteredAndSorted, validPage, effectivePageSize, pageSize]);

  const featuredTotal = useMemo(() => gallery.filter((g) => g.featured).length, [gallery]);

  // File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadToCloudinary(file);
      if (res.success && res.url) {
        setEditing((prev) => ({
          ...prev,
          image: res.url,
          cloudinaryPublicId: res.public_id || "",
        }));
        flash("✓ Photograph uploaded successfully!");
      } else {
        alert("Upload failed: " + (res.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error during upload: " + err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Save Item
  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      alert("Please provide a title for the photograph.");
      return;
    }

    const finalCategory =
      isAddingNewCat && customCat.trim() ? customCat.trim() : editing.category || "Machines";
    const itemToSave = {
      ...editing,
      title: editing.title.trim(),
      category: finalCategory,
      image: (editing.image || "").trim(),
      cloudinaryPublicId: editing.image ? (editing.cloudinaryPublicId || "") : "",
      featured: Boolean(editing.featured),
      featuredInHero: Boolean(editing.featuredInHero),
    };

    setIsSaving(true);
    const exists = gallery.some((g) => g.id === itemToSave.id || g._id === itemToSave.id);

    try {
      // If setting featuredInHero to true, un-feature other hero items
      if (itemToSave.featuredInHero) {
        const editId = itemToSave.id || itemToSave._id;
        const otherHeroes = gallery.filter(
          (g) => (g.id || g._id) !== editId && Boolean(g.featuredInHero || (g as any).featuredInHeader),
        );
        for (const other of otherHeroes) {
          await updateGalleryItem(other.id || other._id, { ...other, featuredInHero: false });
        }
      }

      if (exists) {
        const itemId = itemToSave.id || itemToSave._id;
        const res = await updateGalleryItem(itemId, itemToSave);
        if (res.success) {
          flash(`✓ Saved "${itemToSave.title}"`);
          setEditing(null);
        } else {
          alert("Failed to update photograph: " + (res.error || ""));
        }
      } else {
        const res = await createGalleryItem(itemToSave);
        if (res.success) {
          flash(`✓ Added "${itemToSave.title}" to Archive`);
          setEditing(null);
        } else {
          alert("Failed to create photograph: " + (res.error || ""));
        }
      }
    } catch (err: any) {
      alert("Save error: " + err.message);
    } finally {
      setIsSaving(false);
      setIsAddingNewCat(false);
      setCustomCat("");
    }
  };

  // Delete Single Item
  const handleDelete = async () => {
    if (!deletingPhoto) return;
    setIsDeleting(true);
    const id = deletingPhoto.id || deletingPhoto._id;
    try {
      const res = await deleteGalleryItem(id);
      if (res.success) {
        setSelectedIds((prev) => prev.filter((x) => x !== id));
        if (viewingPhoto && (viewingPhoto.id === id || viewingPhoto._id === id)) {
          setViewingPhoto(null);
        }
        setDeletingPhoto(null);
        flash(`✓ Deleted "${deletingPhoto.title || "Photograph"}"`);
      } else {
        alert("Delete failed: " + (res.error || ""));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      const res = await bulkDeleteGallery(selectedIds);
      if (res.success) {
        flash(`✓ Deleted ${selectedIds.length} photographs`);
        setSelectedIds([]);
        setConfirmBulkDelete(false);
      } else {
        alert("Bulk delete failed: " + (res.error || ""));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Clear All
  const handleClearAll = async () => {
    setIsDeleting(true);
    try {
      const res = await clearAllGallery();
      if (res.success) {
        setSelectedIds([]);
        setConfirmClearAll(false);
        flash("✓ Cleared all photographs from archive");
      } else {
        alert("Clear all failed: " + (res.error || ""));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle Header Hero Spotlight (Single-featured exclusive)
  const handleToggleHeroFeatured = async (id: string) => {
    const target = gallery.find((g) => (g.id || g._id) === id);
    if (!target) return;
    const itemId = target.id || target._id;
    const isCurHero = Boolean(target.featuredInHero || (target as any).featuredInHeader);
    const newHero = !isCurHero;

    if (newHero) {
      const otherHeroes = gallery.filter(
        (g) => (g.id || g._id) !== itemId && Boolean(g.featuredInHero || (g as any).featuredInHeader),
      );
      for (const other of otherHeroes) {
        await updateGalleryItem(other.id || other._id, { ...other, featuredInHero: false });
      }
    }

    await updateGalleryItem(itemId, { ...target, featuredInHero: newHero });
    if (viewingPhoto && (viewingPhoto.id === itemId || viewingPhoto._id === itemId)) {
      setViewingPhoto({ ...viewingPhoto, featuredInHero: newHero });
    }
    flash(
      newHero
        ? `🎯 Set "${target.title}" as Header Hero Spotlight`
        : `🎯 Removed "${target.title}" from Header Hero`,
    );
  };

  // Toggle Gallery View Featured Status (Multi-featured star)
  const handleToggleFeatured = async (id: string) => {
    const target = gallery.find((g) => (g.id || g._id) === id);
    if (!target) return;
    const itemId = target.id || target._id;
    const newFeatured = !target.featured;
    await updateGalleryItem(itemId, { ...target, featured: newFeatured });
    if (viewingPhoto && (viewingPhoto.id === itemId || viewingPhoto._id === itemId)) {
      setViewingPhoto({ ...viewingPhoto, featured: newFeatured });
    }
    flash(
      newFeatured
        ? `★ Marked "${target.title}" as Gallery Featured`
        : `☆ Marked "${target.title}" as Standard in Gallery`,
    );
  };

  // Duplicate Item
  const handleDuplicate = async (item) => {
    const duplicated = {
      title: `${item.title} (Copy)`,
      category: item.category,
      image: item.image,
      cloudinaryPublicId: item.cloudinaryPublicId || "",
      description: item.description || "",
      featured: false,
    };
    const res = await createGalleryItem(duplicated);
    if (res.success) {
      flash(`✓ Cloned "${item.title}"`);
    }
  };

  // Reorder Item
  const handleMove = async (id, direction) => {
    const index = gallery.findIndex((x) => x.id === id || x._id === id);
    if (index === -1) return;
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= gallery.length) return;
    
    const newGallery = [...gallery];
    const temp = newGallery[index];
    newGallery[index] = newGallery[newIdx];
    newGallery[newIdx] = temp;

    try {
      await fetch("/api/gallery/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: newGallery.map((item, idx) => ({ id: item.id || item._id, order: idx })),
        }),
      });
      fetchGallery();
      flash("✓ Updated display order");
    } catch {
      // Fallback
    }
  };

  // Selection helpers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedItems.map((g) => g.id || g._id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const inUseElsewhere = (url) => usedImages.includes(url) && editing?.image !== url;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <AdminHead
        title="Workshop Photography & Gallery"
        eyebrow="Photo Archive"
        intro="Upload shop-floor photography. Photos added here appear in the Home Page 'Shop-Floor Archive' (Section 02) mosaic and the public /gallery page."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {flashMsg && (
              <span className="rounded-xl border border-accent bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent animate-pulse shadow-sm">
                {flashMsg}
              </span>
            )}
            <MiniBtn
              tone="accent"
              onClick={() => {
                const defaultCat = selectCategories[0] || "Machines";
                startEditing(emptyItem(defaultCat));
              }}
            >
              + Add New Photograph
            </MiniBtn>
            {gallery.length > 0 && (
              <MiniBtn tone="danger" onClick={() => setConfirmClearAll(true)}>
                Clear All ({gallery.length})
              </MiniBtn>
            )}
            <button
              type="button"
              onClick={fetchGallery}
              className="p-2 rounded-xl border border-line bg-surface text-muted hover:text-accent hover:border-accent transition-colors cursor-pointer"
              title="Refresh Archive"
            >
              ↻
            </button>
          </div>
        }
      />

      {/* Clear All Confirmation Dialog */}
      {confirmClearAll && (
        <div className="rounded-2xl border border-danger/40 bg-danger/10 p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div>
            <h4 className="font-semibold text-danger text-sm">Delete All Photographs from Archive?</h4>
            <p className="text-xs text-muted mt-1">
              This will permanently delete all {gallery.length} records and clean up associated high-resolution media.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MiniBtn tone="danger" onClick={handleClearAll}>
              Confirm Delete All
            </MiniBtn>
            <MiniBtn onClick={() => setConfirmClearAll(false)}>Cancel</MiniBtn>
          </div>
        </div>
      )}

      {/* Bulk Delete Bar */}
      {selectedIds.length > 0 && (
        <div className="rounded-2xl border border-accent bg-accent/10 p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-accent">
              {selectedIds.length} photograph(s) selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {confirmBulkDelete ? (
              <>
                <span className="text-xs text-danger font-bold">Confirm Deletion?</span>
                <MiniBtn tone="danger" onClick={handleBulkDelete}>
                  Yes, Delete Selected
                </MiniBtn>
                <MiniBtn onClick={() => setConfirmBulkDelete(false)}>No</MiniBtn>
              </>
            ) : (
              <>
                <MiniBtn tone="danger" onClick={() => setConfirmBulkDelete(true)}>
                  Delete Selected ({selectedIds.length})
                </MiniBtn>
                <MiniBtn onClick={() => setSelectedIds([])}>Deselect All</MiniBtn>
              </>
            )}
          </div>
        </div>
      )}

      {/* Metrics Strip HUD */}
      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Total Photographs</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">{gallery.length}</p>
          <span className="text-[0.68rem] text-muted">Shop-Floor Archive</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-accent text-[0.65rem]">Header Hero Spotlight</span>
          <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-accent">
            {featuredHeroCount > 0 ? "1 Active Hero" : "None Set"}
          </p>
          <span className="text-[0.68rem] text-muted">Hero Header Card</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-amber-500 text-[0.65rem]">Gallery View Featured</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-amber-500">{featuredGalleryTotal}</p>
          <span className="text-[0.68rem] text-muted">Starred in Grid</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Active Categories</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">{selectCategories.length}</p>
          <span className="text-[0.68rem] text-muted">Dynamic Filters</span>
        </div>
      </div>

      {/* Search, Filter, and Sort Controls Bar */}
      <div className="space-y-4 rounded-3xl border border-line bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Box */}
          <div className="flex-1 min-w-[260px] max-w-md relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category, description, or ID..."
              className="w-full rounded-2xl border border-line bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="tech-label text-muted text-[0.65rem]">Category:</span>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="rounded-xl border border-line bg-background px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-accent cursor-pointer"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {c} ({categoryCounts[c] || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Filter */}
            <div className="flex items-center gap-1.5">
              <span className="tech-label text-muted text-[0.65rem]">Status:</span>
              <select
                value={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.value)}
                className="rounded-xl border border-line bg-background px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-accent cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Hero">🎯 Header Hero Only ({featuredHeroCount})</option>
                <option value="Gallery">★ Gallery Featured ({featuredGalleryTotal})</option>
                <option value="Standard">Standard Builds</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="tech-label text-muted text-[0.65rem]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-line bg-background px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-accent cursor-pointer"
              >
                <option value="newest">Order: Top First</option>
                <option value="oldest">Order: Bottom First</option>
                <option value="alpha">Title (A-Z)</option>
                <option value="alpha-desc">Title (Z-A)</option>
                <option value="featured">Featured First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl border border-line bg-background p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-navy text-onnavy" : "text-muted hover:text-foreground"
                }`}
                title="Grid cards"
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition-colors cursor-pointer ${
                  viewMode === "table" ? "bg-navy text-onnavy" : "text-muted hover:text-foreground"
                }`}
                title="Table view"
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-line">
          {allCategories.map((c) => {
            const count = categoryCounts[c] || 0;
            const active = filterCat === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCat(c)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.08em] uppercase transition-all cursor-pointer ${
                  active
                    ? "border-accent bg-accent/15 text-accent shadow-sm ring-1 ring-accent"
                    : "border-line bg-background text-muted hover:border-line-strong hover:text-foreground"
                }`}
              >
                <span>{c}</span>
                <span className={`text-[0.6rem] font-bold px-1 rounded-full ${active ? "bg-accent/20 text-accent font-bold" : "bg-line text-muted"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit / Add Studio Panel */}
      {editing ? (
        <div ref={editFormRef} className="scroll-mt-8">
          <Panel
            title={
              gallery.some((g) => (g.id && g.id === editing.id) || (g._id && g._id === editing.id))
                ? `Edit Photograph: "${editing.title || "Untitled"}"`
                : "Add New Equipment Photograph"
            }
          >
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Form Column */}
              <div className="space-y-5 lg:col-span-7">
                <TextField
                  label="Photograph Title *"
                  value={editing.title}
                  onChange={(v) => setEditing({ ...editing, title: v })}
                />

                {/* Category Field + Inline New Category Switch */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="tech-label text-muted">Category</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCat(!isAddingNewCat)}
                      className="text-[0.68rem] text-accent uppercase tracking-wider underline hover:text-foreground font-semibold cursor-pointer"
                    >
                      {isAddingNewCat ? "Choose Existing" : "+ New Custom Category"}
                    </button>
                  </div>

                  {isAddingNewCat ? (
                    <input
                      type="text"
                      value={customCat}
                      onChange={(e) => setCustomCat(e.target.value)}
                      placeholder="Type new category name (e.g. CNC Tooling)..."
                      className="mt-2 w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                    />
                  ) : (
                    <select
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent font-medium cursor-pointer"
                    >
                      {selectCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Image Source Selection */}
                <div>
                  <span className="tech-label text-muted">Image Source</span>
                  <div className="mt-2 flex rounded-xl border border-line bg-background p-0.5">
                    <button
                      type="button"
                      onClick={() => setImageMode("upload")}
                      className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        imageMode === "upload" ? "bg-accent text-navy font-bold shadow-xs" : "text-muted hover:text-foreground"
                      }`}
                    >
                      Upload Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        imageMode === "url" ? "bg-accent text-navy font-bold shadow-xs" : "text-muted hover:text-foreground"
                      }`}
                    >
                      Direct Image URL
                    </button>
                  </div>

                  {/* File Upload Box */}
                  {imageMode === "upload" && (
                    <div className="mt-3 space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`rounded-2xl border-2 border-dashed ${
                          isUploading
                            ? "border-accent bg-accent/5 cursor-wait"
                            : "border-line hover:border-accent bg-surface hover:bg-accent/5 cursor-pointer"
                        } p-7 text-center transition-all`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-3 border-accent border-t-transparent" />
                            <p className="text-xs font-semibold text-accent">Uploading High-Resolution Photograph...</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 mx-auto rounded-full border border-accent/40 bg-accent/10 flex items-center justify-center text-accent mb-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <p className="text-xs font-bold text-foreground">Click to browse & upload photo</p>
                            <p className="mt-1 text-[0.68rem] text-muted">Supports JPG, PNG, WebP. High-resolution imagery stored securely.</p>
                          </>
                        )}
                      </div>
                      {editing.image && (
                        <div className="p-2.5 rounded-xl border border-success/30 bg-success/10 flex items-center justify-between gap-2 text-xs text-success font-medium">
                          <div className="flex items-center gap-2 truncate">
                            <span className="shrink-0 font-bold">✓ Attached:</span>
                            <span className="truncate max-w-[200px] text-foreground/80">{editing.image}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditing({ ...editing, image: "", cloudinaryPublicId: "" });
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="shrink-0 px-2.5 py-1 rounded-lg border border-danger/40 bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                            title="Remove attached image"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove Image</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Custom URL */}
                  {imageMode === "url" && (
                    <div className="mt-3 space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={editing.image}
                          onChange={(e) => setEditing({ ...editing, image: e.target.value, cloudinaryPublicId: "" })}
                          placeholder="https://example.com/photo.jpg"
                          className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-accent"
                        />
                        {editing.image && (
                          <button
                            type="button"
                            onClick={() => setEditing({ ...editing, image: "", cloudinaryPublicId: "" })}
                            className="shrink-0 rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-xs font-bold text-danger hover:bg-danger hover:text-white transition-colors cursor-pointer"
                            title="Clear URL"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <p className="text-[0.68rem] text-muted">Paste any valid public image link (HTTPS).</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <TextField
                  label="Caption / Technical Description (Optional)"
                  value={editing.description || ""}
                  onChange={(v) => setEditing({ ...editing, description: v })}
                  rows={3}
                />
              </div>

              {/* Right Preview Column */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-line bg-background p-5 shadow-inner">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="tech-label text-muted">Live Preview</span>
                    {editing.image && (
                      <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent">
                        High-Resolution Photo
                      </span>
                    )}
                  </div>
                  <div className="mt-3 relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-navy flex items-center justify-center group">
                    {editing.image ? (
                      <>
                        <img
                          src={editing.image}
                          alt={editing.title}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditing({ ...editing, image: "", cloudinaryPublicId: "" });
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="absolute top-2 left-2 rounded-xl border border-danger/40 bg-danger/90 text-white text-xs font-bold px-2.5 py-1 hover:bg-danger transition-colors flex items-center gap-1 shadow-md cursor-pointer"
                          title="Remove this photo"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remove Image</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-muted">No Image Selected</span>
                    )}

                    {/* Live Preview Badges */}
                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                      {editing.featuredInHero && (
                        <span className="rounded-full border border-accent bg-accent text-navy font-bold px-2.5 py-0.5 text-[0.65rem] shadow-sm">
                          🎯 Header Hero Spotlight
                        </span>
                      )}
                      {editing.featured && (
                        <span className="rounded-full border border-amber-400 bg-amber-400 text-navy font-bold px-2.5 py-0.5 text-[0.65rem] shadow-sm">
                          ★ Gallery View Star
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <span className="tech-label text-accent">{isAddingNewCat && customCat ? customCat : editing.category}</span>
                    <h4 className="text-sm font-bold text-foreground">{editing.title || "Untitled Image"}</h4>
                    {editing.description && (
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">{editing.description}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-line space-y-3.5">
                  {/* Toggle 1: Header Hero Spotlight */}
                  <Toggle
                    label={editing.featuredInHero ? "Featured for Header Hero (Active)" : "Featured for Header Hero (Off)"}
                    checked={Boolean(editing.featuredInHero)}
                    onChange={(v) => setEditing({ ...editing, featuredInHero: v })}
                    description="When enabled, this photograph is prominently spotlighted in the top Hero header card on the /gallery page. (Automatically replaces previous hero build)."
                  />

                  {/* Toggle 2: Gallery View Featured */}
                  <Toggle
                    label={editing.featured ? "Featured for Gallery View (Active)" : "Featured for Gallery View (Off)"}
                    checked={Boolean(editing.featured)}
                    onChange={(v) => setEditing({ ...editing, featured: v })}
                    description="When enabled, this photograph displays a featured gold star badge in the gallery grid and is highlighted in filtered views."
                  />

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line/60">
                    <span className="text-[0.68rem] text-muted">Verify details above before saving.</span>
                    <div className="flex items-center gap-2">
                      <MiniBtn tone="accent" onClick={handleSave} disabled={isSaving || isUploading}>
                        {isSaving ? "Saving..." : "Save Photograph"}
                      </MiniBtn>
                      <MiniBtn onClick={() => setEditing(null)}>Cancel</MiniBtn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      ) : null}

      {/* Main Gallery List: Empty State or Items */}
      {gallery.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-surface p-16 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl border border-accent/40 bg-accent/10 flex items-center justify-center text-accent">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="mt-4 font-display text-xl font-bold text-foreground">Gallery Archive is Empty</h3>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">
            No photographs found in the archive. You can add your shop-floor machinery photographs.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <MiniBtn
              tone="accent"
              onClick={() => {
                const defaultCat = selectCategories[0] || "Machines";
                startEditing(emptyItem(defaultCat));
              }}
            >
              + Add First Photograph
            </MiniBtn>
          </div>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-surface p-12 text-center">
          <p className="text-sm text-muted">No photographs match the active search and filter criteria.</p>
          <button
            type="button"
            onClick={() => {
              setFilterCat("All");
              setFilterFeatured("All");
              setSearch("");
            }}
            className="mt-3 text-xs text-accent underline hover:text-foreground font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((g, idx) => {
                const globalIndex = (validPage - 1) * effectivePageSize + idx;
                const itemId = g.id || g._id;
                const isSelected = selectedIds.includes(itemId);
                const isHeroFeatured = Boolean(g.featuredInHero || (g as any).featuredInHeader);

                return (
                  <div
                    key={itemId || idx}
                    className={`group relative rounded-3xl border bg-surface flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? "border-accent ring-2 ring-accent shadow-lg"
                        : "border-line hover:border-accent hover:shadow-xl"
                    }`}
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy">
                      {g.image ? (
                        <img
                          src={g.image}
                          alt={g.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-onnavy-muted">
                          No Image Attached
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-transparent opacity-60" />

                      {/* Checkbox */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(itemId)}
                          className="h-4 w-4 rounded border-line bg-navy text-accent cursor-pointer accent-[#0ea5e9]"
                        />
                      </div>

                      {/* Number badge */}
                      <div className="absolute top-2.5 left-9">
                        <span className="rounded-full border border-onnavy/30 bg-navy/80 px-2.5 py-0.5 text-[0.65rem] font-bold text-onnavy">
                          #{globalIndex + 1}
                        </span>
                      </div>

                      {/* HD spec indicator */}
                      <div className="absolute top-2.5 left-20">
                        <span className="rounded-full border border-accent/40 bg-navy/90 px-2 py-0.5 text-[0.6rem] font-bold text-accent backdrop-blur-sm">
                          SHOP BUILD
                        </span>
                      </div>

                      {/* Featured button badges: Header Hero & Gallery Star */}
                      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleHeroFeatured(itemId)}
                          className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold border transition-all cursor-pointer shadow-sm ${
                            isHeroFeatured
                              ? "border-accent bg-accent text-navy font-extrabold"
                              : "border-onnavy/30 bg-navy/85 text-onnavy-muted hover:text-accent hover:border-accent"
                          }`}
                          title="Toggle Header Hero Spotlight (displayed on /gallery top banner)"
                        >
                          {isHeroFeatured ? "🎯 Hero Active" : "🎯 Set Hero"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(itemId)}
                          className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold border transition-all cursor-pointer shadow-sm ${
                            g.featured
                              ? "border-amber-400 bg-amber-400 text-navy font-extrabold"
                              : "border-onnavy/30 bg-navy/85 text-onnavy-muted hover:text-amber-300 hover:border-amber-400/60"
                          }`}
                          title="Toggle Gallery View Star (featured in gallery grid)"
                        >
                          {g.featured ? "★ Gallery Star" : "☆ Standard"}
                        </button>
                      </div>

                      {/* Category Label */}
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="rounded-full bg-navy/90 px-2.5 py-0.5 text-[0.65rem] font-bold text-accent border border-accent/30">
                          {g.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors break-words">
                          {g.title}
                        </h3>
                        {g.description ? (
                          <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed break-words">{g.description}</p>
                        ) : (
                          <p className="mt-1 text-xs text-muted/60 truncate">ID: {itemId}</p>
                        )}
                      </div>

                      {/* Card Action Controls: Edit, Delete, Reorder */}
                      <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2">
                        {/* Order Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMove(itemId, "up")}
                            disabled={gallery.findIndex((x) => (x.id || x._id) === itemId) === 0}
                            className="px-2.5 py-1 rounded-lg border border-line text-xs font-bold text-muted hover:text-foreground disabled:opacity-25 transition-colors cursor-pointer"
                            title="Move up in display order"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(itemId, "down")}
                            disabled={gallery.findIndex((x) => (x.id || x._id) === itemId) === gallery.length - 1}
                            className="px-2.5 py-1 rounded-lg border border-line text-xs font-bold text-muted hover:text-foreground disabled:opacity-25 transition-colors cursor-pointer"
                            title="Move down in display order"
                          >
                            ↓
                          </button>
                        </div>

                        {/* Action Buttons: View, Edit, Delete */}
                        <div className="flex items-center gap-1.5">
                          <MiniBtn
                            tone="accent"
                            onClick={() => setViewingPhoto(g)}
                            title="Inspect photograph details"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </MiniBtn>
                          <MiniBtn
                            onClick={() => startEditing(g)}
                            title="Edit photograph details"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </MiniBtn>
                          <MiniBtn tone="danger" onClick={() => setDeletingPhoto(g)} title="Delete Photo">
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

          {/* Table View */}
          {viewMode === "table" && (
            <div className="border border-line bg-surface overflow-x-auto shadow-sm">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-background/60">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === paginatedItems.length && paginatedItems.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-line accent-[#0ea5e9] cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 tech-label text-muted">#</th>
                    <th className="px-4 py-3 tech-label text-muted">Photo</th>
                    <th className="px-4 py-3 tech-label text-muted">Title & Description</th>
                    <th className="px-4 py-3 tech-label text-muted">Category</th>
                    <th className="px-4 py-3 tech-label text-muted">Format</th>
                    <th className="px-4 py-3 tech-label text-muted">Featured Controls</th>
                    <th className="px-4 py-3 tech-label text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {paginatedItems.map((g, idx) => {
                    const globalIndex = (validPage - 1) * effectivePageSize + idx;
                    const itemId = g.id || g._id;
                    const isSelected = selectedIds.includes(itemId);
                    const isHeroFeatured = Boolean(g.featuredInHero || (g as any).featuredInHeader);

                    return (
                      <tr
                        key={itemId || idx}
                        className={`transition-colors ${isSelected ? "bg-accent/5" : "hover:bg-line/20"}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(itemId)}
                            className="h-4 w-4 rounded border-line accent-[#0ea5e9] cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-muted font-medium">{globalIndex + 1}</td>
                        <td className="px-4 py-3">
                          {g.image ? (
                            <img
                              src={g.image}
                              alt=""
                              className="h-12 w-16 object-cover rounded-xl border border-line bg-navy cursor-pointer"
                              onClick={() => setViewingPhoto(g)}
                            />
                          ) : (
                            <div
                              className="h-12 w-16 rounded-xl border border-line bg-navy flex items-center justify-center text-[0.65rem] text-onnavy-muted cursor-pointer font-medium"
                              onClick={() => setViewingPhoto(g)}
                            >
                              No Img
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          <div>
                            <span className="font-bold cursor-pointer hover:text-accent" onClick={() => startEditing(g)} title="Click to edit">
                              {g.title}
                            </span>
                            {g.description && (
                              <p className="text-xs text-muted truncate max-w-sm mt-0.5">{g.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold bg-background">
                            {g.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <span className="text-accent font-bold">Shop Photo</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleHeroFeatured(itemId)}
                              className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                                isHeroFeatured
                                  ? "border-accent bg-accent/20 text-accent font-bold"
                                  : "border-line text-muted hover:text-accent hover:border-accent"
                              }`}
                              title="Toggle Header Hero Spotlight (displayed in /gallery top hero banner)"
                            >
                              {isHeroFeatured ? "🎯 Header Hero" : "🎯 Set Hero"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(itemId)}
                              className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                                g.featured
                                  ? "border-amber-400/60 bg-amber-400/15 text-amber-500 font-bold"
                                  : "border-line text-muted hover:text-foreground hover:border-amber-400/40"
                              }`}
                              title="Toggle Gallery View Featured star"
                            >
                              {g.featured ? "★ Gallery Star" : "☆ Standard"}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Order Controls */}
                            <div className="flex items-center gap-1 mr-1">
                              <button
                                type="button"
                                onClick={() => handleMove(itemId, "up")}
                                disabled={gallery.findIndex((x) => (x.id || x._id) === itemId) === 0}
                                className="px-2 py-1 rounded-lg border border-line text-xs font-bold text-muted hover:text-foreground hover:border-accent disabled:opacity-25 transition-colors cursor-pointer"
                                title="Move up in display order"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMove(itemId, "down")}
                                disabled={gallery.findIndex((x) => (x.id || x._id) === itemId) === gallery.length - 1}
                                className="px-2 py-1 rounded-lg border border-line text-xs font-bold text-muted hover:text-foreground hover:border-accent disabled:opacity-25 transition-colors cursor-pointer"
                                title="Move down in display order"
                              >
                                ↓
                              </button>
                            </div>

                            <MiniBtn
                              tone="accent"
                              onClick={() => setViewingPhoto(g)}
                              title="View photo details"
                            >
                              <Eye className="h-3 w-3" />
                            </MiniBtn>
                            <MiniBtn
                              onClick={() => startEditing(g)}
                              title="Edit photograph details"
                            >
                              Edit
                            </MiniBtn>
                            <MiniBtn tone="danger" onClick={() => setDeletingPhoto(g)} title="Delete photo">
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

          {/* Pagination Toolbar */}
          <div className="rounded-3xl border border-line bg-surface p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            {/* Range info */}
            <div className="text-xs text-muted">
              Showing{" "}
              <span className="font-bold text-foreground">
                {(validPage - 1) * effectivePageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-foreground">
                {Math.min(validPage * effectivePageSize, totalItems)}
              </span>{" "}
              of <span className="font-bold text-foreground">{totalItems}</span> photographs in archive
              {filterCat !== "All" || filterFeatured !== "All" || search ? " (filtered)" : ""}
            </div>

            {/* Page buttons and Page Size */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="tech-label text-muted text-[0.65rem]">Per Page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded-xl border border-line bg-background px-2.5 py-1 text-xs font-medium text-foreground outline-none focus:border-accent cursor-pointer"
                >
                  <option value={6}>6 items</option>
                  <option value={9}>9 items</option>
                  <option value={12}>12 items</option>
                  <option value={24}>24 items</option>
                  <option value={9999}>View All</option>
                </select>
              </div>

              {/* Navigation Page Numbers */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={validPage === 1}
                    className="px-3 py-1 rounded-xl border border-line text-xs font-semibold text-foreground hover:border-accent hover:text-accent disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    ‹ Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[32px] px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
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
                    className="px-3 py-1 rounded-xl border border-line text-xs font-semibold text-foreground hover:border-accent hover:text-accent disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* VIEW PHOTOGRAPH MODAL POPUP */}
      {viewingPhoto && (
        <AdminModal
          isOpen={Boolean(viewingPhoto)}
          onClose={() => setViewingPhoto(null)}
          title={viewingPhoto.title || "Machinery Photograph"}
          eyebrow="Shop-Floor Gallery Detail"
          size="xl"
          footer={
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <MiniBtn
                  tone="danger"
                  onClick={() => {
                    setDeletingPhoto(viewingPhoto);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Photo</span>
                </MiniBtn>
                <MiniBtn
                  tone={viewingPhoto.featuredInHero ? "accent" : "default"}
                  onClick={() => {
                    handleToggleHeroFeatured(viewingPhoto.id || viewingPhoto._id);
                  }}
                >
                  <span>{viewingPhoto.featuredInHero ? "🎯 Header Hero (Active)" : "🎯 Set as Header Hero"}</span>
                </MiniBtn>
                <MiniBtn
                  onClick={() => {
                    handleToggleFeatured(viewingPhoto.id || viewingPhoto._id);
                  }}
                >
                  <span>{viewingPhoto.featured ? "★ Gallery Star (Active)" : "☆ Set Gallery Star"}</span>
                </MiniBtn>
              </div>

              <div className="flex items-center gap-2">
                <MiniBtn
                  tone="accent"
                  onClick={() => {
                    const p = viewingPhoto;
                    setViewingPhoto(null);
                    startEditing(p);
                  }}
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit Details</span>
                </MiniBtn>
                <MiniBtn onClick={() => setViewingPhoto(null)}>Close</MiniBtn>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Image Stage */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-navy flex items-center justify-center">
              {viewingPhoto.image ? (
                <img
                  src={viewingPhoto.image}
                  alt={viewingPhoto.title}
                  className="h-full w-full object-contain bg-navy-deep"
                />
              ) : (
                <span className="text-xs text-muted">No Image Available</span>
              )}
              <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                {viewingPhoto.featuredInHero && (
                  <span className="rounded-full border border-accent bg-accent text-navy font-bold px-3 py-1 text-xs shadow-md">
                    🎯 Header Hero Spotlight
                  </span>
                )}
                {viewingPhoto.featured && (
                  <span className="rounded-full border border-amber-400 bg-amber-400 text-navy font-bold px-3 py-1 text-xs shadow-md">
                    ★ Gallery View Star
                  </span>
                )}
              </div>
            </div>

            {/* Photo Metadata Matrix */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-line bg-background p-4 text-xs">
              <div>
                <span className="text-muted block text-[0.68rem] uppercase font-semibold">Category</span>
                <span className="font-bold text-accent text-sm mt-0.5 block">{viewingPhoto.category}</span>
              </div>
              <div>
                <span className="text-muted block text-[0.68rem] uppercase font-semibold">Record ID</span>
                <span className="font-semibold text-foreground mt-0.5 block truncate">
                  {viewingPhoto.id || viewingPhoto._id}
                </span>
              </div>
              <div>
                <span className="text-muted block text-[0.68rem] uppercase font-semibold">Status</span>
                <span className="font-semibold text-foreground mt-0.5 block">
                  {viewingPhoto.featured ? "Featured Pinned" : "Standard Archive"}
                </span>
              </div>
              <div>
                <span className="text-muted block text-[0.68rem] uppercase font-semibold">Created Date</span>
                <span className="font-semibold text-foreground mt-0.5 block">
                  {viewingPhoto.createdAt ? new Date(viewingPhoto.createdAt).toLocaleDateString() : "Active Record"}
                </span>
              </div>
            </div>

            {/* Description / Caption */}
            {viewingPhoto.description && (
              <div className="rounded-2xl border border-line bg-surface p-4">
                <span className="tech-label text-muted text-[0.68rem] uppercase block mb-1">
                  Technical Caption & Scope:
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  {viewingPhoto.description}
                </p>
              </div>
            )}
          </div>
        </AdminModal>
      )}

      {/* SINGLE PHOTO DELETE CONFIRM MODAL */}
      {deletingPhoto && (
        <ConfirmDeleteModal
          isOpen={Boolean(deletingPhoto)}
          onClose={() => setDeletingPhoto(null)}
          onConfirm={handleDelete}
          title="Delete Gallery Photograph?"
          message="Are you sure you want to permanently delete this photograph from your shop-floor gallery archive? This action cannot be undone."
          itemName={deletingPhoto.title || "Machinery Photograph"}
          isDeleting={isDeleting}
        />
      )}

      {/* BULK DELETE CONFIRM MODAL */}
      {confirmBulkDelete && (
        <ConfirmDeleteModal
          isOpen={confirmBulkDelete}
          onClose={() => setConfirmBulkDelete(false)}
          onConfirm={handleBulkDelete}
          title={`Delete ${selectedIds.length} Selected Photographs?`}
          message="Are you sure you want to permanently delete all selected photographs? This will purge the records from MongoDB."
          itemName={`${selectedIds.length} photographs selected`}
          isDeleting={isDeleting}
        />
      )}

      {/* CLEAR ALL CONFIRM MODAL */}
      {confirmClearAll && (
        <ConfirmDeleteModal
          isOpen={confirmClearAll}
          onClose={() => setConfirmClearAll(false)}
          onConfirm={handleClearAll}
          title="Clear Entire Gallery Archive?"
          message={`Are you sure you want to delete ALL ${gallery.length} photographs from the gallery archive? This action is completely irreversible.`}
          itemName={`All ${gallery.length} archive photographs`}
          confirmLabel="Yes, Clear All"
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
