"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  AdminHead,
  MiniBtn,
  Panel,
  TextField,
  Toggle,
} from "@/components/site/admin-ui";
import { IMAGES } from "@/data/images";
import { GALLERY_CATEGORIES } from "@/data/site";
import { useSite } from "@/store/site-store";

const PRESET_IMAGES = Object.entries(IMAGES).map(([key, url]) => ({
  key,
  url,
  label: key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase()),
}));

function emptyItem(defaultCat = "Machines") {
  return {
    id: `g-${Date.now()}`,
    title: "",
    category: defaultCat,
    image: PRESET_IMAGES[0]?.url || "",
    cloudinaryPublicId: "",
    description: "",
    featured: false,
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
    seedDefaultGallery,
    uploadToCloudinary,
    fetchGallery,
    usedImages,
  } = useSite();

  // Filters & Search
  const [filterCat, setFilterCat] = useState("All");
  const [filterFeatured, setFilterFeatured] = useState("All"); // 'All' | 'Featured' | 'Standard'
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'alpha' | 'alpha-desc' | 'featured'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // 6, 9, 12, 24, or 9999 (All)

  // Edit / Add State
  const [editing, setEditing] = useState(null);
  const [imageMode, setImageMode] = useState("upload"); // 'upload' | 'presets' | 'url'
  const [customCat, setCustomCat] = useState("");
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Deletion & Bulk
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // Toast / Feedback
  const [flashMsg, setFlashMsg] = useState(null);
  const fileInputRef = useRef(null);

  const flash = (msg) => {
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
    const counts = { All: gallery.length };
    gallery.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return counts;
  }, [gallery]);

  // Filter & Search & Sort Pipeline
  const filteredAndSorted = useMemo(() => {
    let list = gallery.filter((g) => {
      const matchCat = filterCat === "All" || g.category === filterCat;
      const matchFeatured =
        filterFeatured === "All" ||
        (filterFeatured === "Featured" && Boolean(g.featured)) ||
        (filterFeatured === "Standard" && !g.featured);
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
    if (!editing.image) {
      alert("Please select, paste or upload an image.");
      return;
    }

    const finalCategory =
      isAddingNewCat && customCat.trim() ? customCat.trim() : editing.category || "Machines";
    const itemToSave = {
      ...editing,
      title: editing.title.trim(),
      category: finalCategory,
      image: editing.image.trim(),
      cloudinaryPublicId: editing.cloudinaryPublicId || "",
    };

    setIsSaving(true);
    const exists = gallery.some((g) => g.id === itemToSave.id || g._id === itemToSave.id);

    try {
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
    } catch (err) {
      alert("Save error: " + err.message);
    } finally {
      setIsSaving(false);
      setIsAddingNewCat(false);
      setCustomCat("");
    }
  };

  // Delete Single Item
  const handleDelete = async (id) => {
    const target = gallery.find((g) => g.id === id || g._id === id);
    const res = await deleteGalleryItem(id);
    if (res.success) {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      setConfirmDeleteId(null);
      flash(`✓ Deleted "${target?.title || "Photograph"}"`);
    } else {
      alert("Delete failed: " + (res.error || ""));
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const res = await bulkDeleteGallery(selectedIds);
    if (res.success) {
      flash(`✓ Deleted ${selectedIds.length} photographs`);
      setSelectedIds([]);
      setConfirmBulkDelete(false);
    } else {
      alert("Bulk delete failed: " + (res.error || ""));
    }
  };

  // Clear All
  const handleClearAll = async () => {
    const res = await clearAllGallery();
    if (res.success) {
      setSelectedIds([]);
      setConfirmClearAll(false);
      flash("✓ Cleared all photographs from archive");
    } else {
      alert("Clear all failed: " + (res.error || ""));
    }
  };

  // Seed Demo Data
  const handleLoadDemoData = async () => {
    const res = await seedDefaultGallery();
    if (res.success) {
      flash(`✓ Loaded ${res.count || 9} sample archive photographs`);
    } else {
      alert("Load failed: " + (res.error || ""));
    }
  };

  // Toggle Featured Status
  const handleToggleFeatured = async (id) => {
    const target = gallery.find((g) => g.id === id || g._id === id);
    if (!target) return;
    const newFeatured = !target.featured;
    await updateGalleryItem(id, { ...target, featured: newFeatured });
    flash(newFeatured ? `★ Marked "${target.title}" as Featured` : `☆ Marked as Standard`);
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
        title="Gallery Management Studio"
        intro="Enterprise visual archive. Upload high-resolution shop-floor photographs, curate equipment categories, and configure public display."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {flashMsg && (
              <span className="border border-accent bg-accent/15 px-3 py-1.5 font-mono text-xs font-semibold text-accent animate-pulse shadow-sm">
                {flashMsg}
              </span>
            )}
            <MiniBtn
              tone="accent"
              onClick={() => {
                const defaultCat = selectCategories[0] || "Machines";
                setEditing(emptyItem(defaultCat));
                setImageMode("upload");
                setIsAddingNewCat(false);
                setCustomCat("");
              }}
            >
              + Add New Photograph
            </MiniBtn>
            {gallery.length > 0 ? (
              <MiniBtn tone="danger" onClick={() => setConfirmClearAll(true)}>
                Clear All ({gallery.length})
              </MiniBtn>
            ) : (
              <MiniBtn onClick={handleLoadDemoData}>
                Load Sample Images (9)
              </MiniBtn>
            )}
            <button
              type="button"
              onClick={fetchGallery}
              className="p-2 border border-line bg-surface text-muted hover:text-accent hover:border-accent transition-colors"
              title="Refresh Archive"
            >
              ↻
            </button>
          </div>
        }
      />

      {/* System Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-line bg-navy text-onnavy px-4 py-3 text-xs font-mono shadow-sm">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-2 text-success font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-success animate-ping" />
            <span>Archive Database: Connected & Synchronized</span>
          </span>
          <span className="text-onnavy/30">|</span>
          <span className="flex items-center gap-2 text-accent">
            <span>High-Resolution Media Storage: Active</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-onnavy-muted">
          <span>{galleryLoading ? "Syncing..." : `${gallery.length} Photographs in Archive`}</span>
          <a
            href="/gallery"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline hover:text-onnavy text-xs"
          >
            View Public Gallery ↗
          </a>
        </div>
      </div>

      {/* Clear All Confirmation Dialog */}
      {confirmClearAll && (
        <div className="border border-danger/40 bg-danger/10 p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
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
        <div className="border border-accent bg-accent/10 p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-accent">
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
      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 shadow-sm">
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Total Photographs</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">{gallery.length}</p>
          <span className="text-[0.68rem] font-mono text-muted">Shop-Floor Archive</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-accent text-[0.65rem]">Featured Builds</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-accent">{featuredTotal}</p>
          <span className="text-[0.68rem] font-mono text-muted">Pinned to Top</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Active Categories</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">{selectCategories.length}</p>
          <span className="text-[0.68rem] font-mono text-muted">Dynamic Filters</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Filter Results</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">{filteredAndSorted.length}</p>
          <span className="text-[0.68rem] font-mono text-muted">of {gallery.length} total</span>
        </div>
      </div>

      {/* Search, Filter, and Sort Controls Bar */}
      <div className="space-y-4 border border-line bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Box */}
          <div className="flex-1 min-w-[260px] max-w-md relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category, description, or ID..."
              className="w-full border border-line bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
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
                className="absolute right-2.5 top-2 text-xs text-muted hover:text-foreground p-0.5"
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
                className="border border-line bg-background px-2.5 py-1.5 font-mono text-xs text-foreground outline-none focus:border-accent"
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
                className="border border-line bg-background px-2.5 py-1.5 font-mono text-xs text-foreground outline-none focus:border-accent"
              >
                <option value="All">All Statuses</option>
                <option value="Featured">★ Featured Only</option>
                <option value="Standard">Standard Only</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="tech-label text-muted text-[0.65rem]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-line bg-background px-2.5 py-1.5 font-mono text-xs text-foreground outline-none focus:border-accent"
              >
                <option value="newest">Order: Top First</option>
                <option value="oldest">Order: Bottom First</option>
                <option value="alpha">Title (A-Z)</option>
                <option value="alpha-desc">Title (Z-A)</option>
                <option value="featured">Featured First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-line bg-background">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 text-xs font-semibold uppercase ${
                  viewMode === "grid" ? "bg-navy text-onnavy" : "text-muted hover:text-foreground"
                }`}
                title="Grid cards"
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 text-xs font-semibold uppercase ${
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
                className={`inline-flex items-center gap-1.5 border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.08em] uppercase transition-all ${
                  active
                    ? "border-accent bg-accent/15 text-accent shadow-sm ring-1 ring-accent"
                    : "border-line bg-background text-muted hover:border-line-strong hover:text-foreground"
                }`}
              >
                <span>{c}</span>
                <span className={`font-mono text-[0.6rem] px-1 rounded ${active ? "bg-accent/20 text-accent font-bold" : "bg-line text-muted"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit / Add Studio Panel */}
      {editing ? (
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
                    className="text-[0.68rem] text-accent uppercase tracking-wider underline hover:text-foreground font-semibold"
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
                    className="mt-2 w-full border border-line bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent"
                  />
                ) : (
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="mt-2 w-full border border-line bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent font-medium"
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
                <div className="mt-2 flex border border-line bg-background">
                  <button
                    type="button"
                    onClick={() => setImageMode("upload")}
                    className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      imageMode === "upload" ? "bg-accent text-navy font-bold" : "text-muted hover:text-foreground"
                    }`}
                  >
                    Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("presets")}
                    className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      imageMode === "presets" ? "bg-accent text-navy font-bold" : "text-muted hover:text-foreground"
                    }`}
                  >
                    Asset Catalog ({PRESET_IMAGES.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      imageMode === "url" ? "bg-accent text-navy font-bold" : "text-muted hover:text-foreground"
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
                      className={`border-2 border-dashed ${
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
                      <div className="p-2 border border-success/30 bg-success/10 flex items-center justify-between text-xs font-mono text-success">
                        <span>✓ Image Attached</span>
                        <span className="truncate max-w-xs">{editing.image}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Preset Catalog */}
                {imageMode === "presets" && (
                  <div className="mt-3 space-y-2">
                    <select
                      value={editing.image}
                      onChange={(e) => setEditing({ ...editing, image: e.target.value, cloudinaryPublicId: "" })}
                      className="w-full border border-line bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-accent"
                    >
                      {PRESET_IMAGES.map((o) => (
                        <option key={o.key} value={o.url}>
                          {o.label} {inUseElsewhere(o.url) ? " — [already in use]" : ""}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 max-h-40 overflow-y-auto p-2 border border-line bg-surface">
                      {PRESET_IMAGES.map((img) => (
                        <button
                          key={img.key}
                          type="button"
                          onClick={() => setEditing({ ...editing, image: img.url, cloudinaryPublicId: "" })}
                          className={`relative aspect-square border overflow-hidden transition-all ${
                            editing.image === img.url
                              ? "border-accent ring-2 ring-accent"
                              : "border-line opacity-60 hover:opacity-100"
                          }`}
                          title={img.label}
                        >
                          <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom URL */}
                {imageMode === "url" && (
                  <div className="mt-3">
                    <input
                      type="url"
                      value={editing.image}
                      onChange={(e) => setEditing({ ...editing, image: e.target.value, cloudinaryPublicId: "" })}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full border border-line bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-accent"
                    />
                    <p className="mt-1 text-[0.68rem] text-muted">Paste any valid public image link (HTTPS).</p>
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
            <div className="lg:col-span-5 flex flex-col justify-between border border-line bg-background p-5 shadow-inner">
              <div>
                <div className="flex items-center justify-between">
                  <span className="tech-label text-muted">Live Preview</span>
                  {editing.image && (
                    <span className="border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.6rem] text-accent">
                      High-Resolution Asset
                    </span>
                  )}
                </div>
                <div className="mt-3 relative aspect-[4/3] w-full overflow-hidden border border-line bg-navy flex items-center justify-center corner-marks">
                  {editing.image ? (
                    <img
                      src={editing.image}
                      alt={editing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted">No Image Selected</span>
                  )}
                  {editing.featured && (
                    <span className="tech-label absolute top-2 right-2 border border-accent bg-accent text-navy font-bold px-2 py-0.5 text-[0.6rem] shadow-sm">
                      ★ Featured
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <span className="tech-label text-accent">{isAddingNewCat && customCat ? customCat : editing.category}</span>
                  <h4 className="text-sm font-bold text-foreground">{editing.title || "Untitled Image"}</h4>
                  {editing.description && (
                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">{editing.description}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                <Toggle
                  label={editing.featured ? "Featured Build" : "Standard Photo"}
                  checked={editing.featured}
                  onChange={(v) => setEditing({ ...editing, featured: v })}
                />
                <div className="flex items-center gap-2">
                  <MiniBtn tone="accent" onClick={handleSave} disabled={isSaving || isUploading}>
                    {isSaving ? "Saving..." : "Save Photograph"}
                  </MiniBtn>
                  <MiniBtn onClick={() => setEditing(null)}>Cancel</MiniBtn>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      ) : null}

      {/* Main Gallery List: Empty State or Items */}
      {gallery.length === 0 ? (
        <div className="border border-dashed border-line bg-surface p-16 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto border border-accent/40 bg-accent/10 flex items-center justify-center text-accent">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="mt-4 font-display text-xl font-bold text-foreground">Gallery Archive is Empty</h3>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">
            No photographs found in the archive. You can add your own machinery photographs or load sample records.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <MiniBtn
              tone="accent"
              onClick={() => {
                setEditing(emptyItem("Machines"));
                setImageMode("upload");
              }}
            >
              + Add First Photograph
            </MiniBtn>
            <MiniBtn onClick={handleLoadDemoData}>
              Load Sample Images (9)
            </MiniBtn>
          </div>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="border border-dashed border-line bg-surface p-12 text-center">
          <p className="text-sm text-muted">No photographs match the active search and filter criteria.</p>
          <button
            type="button"
            onClick={() => {
              setFilterCat("All");
              setFilterFeatured("All");
              setSearch("");
            }}
            className="mt-3 text-xs text-accent underline hover:text-foreground uppercase tracking-wider font-semibold"
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

                return (
                  <div
                    key={itemId || idx}
                    className={`group relative border bg-surface flex flex-col justify-between transition-all duration-300 ${
                      isSelected
                        ? "border-accent ring-2 ring-accent shadow-lg"
                        : "border-line hover:border-accent hover:shadow-xl"
                    }`}
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy">
                      <img
                        src={g.image}
                        alt={g.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
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
                        <span className="border border-onnavy/30 bg-navy/80 px-2 py-0.5 font-mono text-[0.6rem] text-onnavy">
                          #{globalIndex + 1}
                        </span>
                      </div>

                      {/* HD spec indicator */}
                      <div className="absolute top-2.5 left-20">
                        <span className="border border-accent/40 bg-navy/90 px-1.5 py-0.5 font-mono text-[0.55rem] text-accent backdrop-blur-sm">
                          HD SPEC
                        </span>
                      </div>

                      {/* Featured button badge */}
                      <div className="absolute top-2.5 right-2.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(itemId)}
                          className={`px-2.5 py-0.5 font-mono text-[0.65rem] border transition-all ${
                            g.featured
                              ? "border-accent bg-accent text-navy font-bold shadow-md"
                              : "border-onnavy/30 bg-navy/80 text-onnavy-muted hover:text-accent"
                          }`}
                          title="Toggle Featured status"
                        >
                          {g.featured ? "★ Featured" : "☆ Standard"}
                        </button>
                      </div>

                      {/* Category Label */}
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="tech-label text-accent text-[0.65rem] bg-navy/90 px-2 py-0.5 border border-accent/30">
                          {g.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                          {g.title}
                        </h3>
                        {g.description ? (
                          <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">{g.description}</p>
                        ) : (
                          <p className="mt-1 text-[0.7rem] font-mono text-muted/60">ID: {itemId}</p>
                        )}
                      </div>

                      {/* Card Action Controls: Edit, Delete, Reorder, Copy */}
                      <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2">
                        {/* Order Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMove(itemId, "up")}
                            disabled={gallery.findIndex((x) => (x.id || x._id) === itemId) === 0}
                            className="px-2 py-1 border border-line text-xs text-muted hover:text-foreground disabled:opacity-25 transition-colors"
                            title="Move up in display order"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(itemId, "down")}
                            disabled={gallery.findIndex((x) => (x.id || x._id) === itemId) === gallery.length - 1}
                            className="px-2 py-1 border border-line text-xs text-muted hover:text-foreground disabled:opacity-25 transition-colors"
                            title="Move down in display order"
                          >
                            ↓
                          </button>
                        </div>

                        {/* Action Buttons: Edit, Copy, Delete */}
                        <div className="flex items-center gap-1.5">
                          <MiniBtn
                            tone="accent"
                            onClick={() => {
                              setEditing(g);
                              setImageMode(g.image.startsWith("http") ? "url" : "upload");
                            }}
                          >
                            Edit
                          </MiniBtn>
                          <MiniBtn onClick={() => handleDuplicate(g)}>
                            Copy
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="border border-line bg-surface overflow-x-auto shadow-sm">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
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
                    <th className="px-4 py-3 tech-label text-muted">Featured</th>
                    <th className="px-4 py-3 tech-label text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {paginatedItems.map((g, idx) => {
                    const globalIndex = (validPage - 1) * effectivePageSize + idx;
                    const itemId = g.id || g._id;
                    const isSelected = selectedIds.includes(itemId);

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
                        <td className="px-4 py-3 font-mono text-xs text-muted">{globalIndex + 1}</td>
                        <td className="px-4 py-3">
                          <img
                            src={g.image}
                            alt=""
                            className="h-12 w-16 object-cover border border-line bg-navy"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          <div>
                            <span className="font-bold">{g.title}</span>
                            {g.description && (
                              <p className="text-xs text-muted truncate max-w-sm mt-0.5">{g.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="border border-line px-2 py-0.5 font-mono text-xs bg-background">
                            {g.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          <span className="text-accent font-semibold">HD Media</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(itemId)}
                            className={`text-xs font-semibold ${g.featured ? "text-accent" : "text-muted"}`}
                          >
                            {g.featured ? "★ Featured" : "☆ Standard"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <MiniBtn
                              tone="accent"
                              onClick={() => {
                                setEditing(g);
                                setImageMode(g.image.startsWith("http") ? "url" : "upload");
                              }}
                            >
                              Edit
                            </MiniBtn>
                            <MiniBtn onClick={() => handleDuplicate(g)}>Copy</MiniBtn>
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Toolbar */}
          <div className="border border-line bg-surface p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            {/* Range info */}
            <div className="text-xs text-muted font-mono">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {(validPage - 1) * effectivePageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(validPage * effectivePageSize, totalItems)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{totalItems}</span> photographs in archive
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
                  className="border border-line bg-background px-2.5 py-1 text-xs text-foreground outline-none focus:border-accent font-mono"
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
                    className="px-2.5 py-1 border border-line text-xs font-semibold text-foreground hover:border-accent hover:text-accent disabled:opacity-30 transition-colors"
                  >
                    ‹ Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[30px] px-2 py-1 text-xs font-semibold border transition-all ${
                        validPage === p
                          ? "border-accent bg-accent text-navy font-bold shadow-sm"
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
                    className="px-2.5 py-1 border border-line text-xs font-semibold text-foreground hover:border-accent hover:text-accent disabled:opacity-30 transition-colors"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
