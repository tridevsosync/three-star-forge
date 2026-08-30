"use client";

import { useRef, useMemo, useState } from "react";
import {
  AdminHead,
  MiniBtn,
  Panel,
  SelectField,
  TextField,
  Toggle,
  EmptyState,
  AdminModal,
  ConfirmDeleteModal,
} from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";
import { ImageMetaBadge } from "@/components/site/ImageMetaBadge";
import {
  Briefcase,
  Plus,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Wrench,
  ExternalLink,
  Star,
  ChevronDown,
} from "lucide-react";

function emptyProject() {
  return {
    id: `p-${Date.now()}`,
    title: "",
    industry: "Engineering Equipment",
    category: "Induction Hardening",
    image: "",
    short: "",
    featured: false,
    featuredInHero: false,
    featuredInHome: false,
    overview: "",
    challenge: "",
    solution: "",
    application: "",
    specs: [
      { label: "Hardening Depth", value: "1.5 – 3.2 mm" },
      { label: "Cycle Time", value: "12 sec / component" },
      { label: "Power Output", value: "100 kW Solid State" },
    ],
    highlights: ["Automated CNC component indexing", "Zero distortion quenching system"],
  };
}

const PRESET_SPEC_LABELS = [
  "Hardening Depth",
  "Power Rating",
  "Cycle Time",
  "Component Capacity",
  "Dimensional Tolerance",
  "Quench Medium",
  "Automation Level",
  "Power Supply",
  "Surface Hardness",
];

export default function AdminProjectsPage() {
  const { projects, industries, update, uploadToCloudinary, deleteProject } = useSite();
  const [query, setQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  const [editing, setEditing] = useState(null);
  const [editTab, setEditTab] = useState("core"); // 'core' | 'narrative' | 'specs' | 'media'
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef<HTMLDivElement>(null);

  const startEditingProject = (p: any, tab: string = "core") => {
    setEditing(p);
    setEditTab(tab);
    setViewing(null);
    const isCustom = Boolean(p?.category && !DEFAULT_CATEGORIES.includes(p.category));
    setIsCustomCategory(isCustom);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const flash = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 3500);
  };

const DEFAULT_INDUSTRIES = [
  "Material Handling",
  "Industrial Automation",
  "Pharmaceutical",
  "Automotive & Ancillary",
  "Heavy Engineering",
  "Defence & Aerospace",
  "Energy & Electrical",
  "Food Processing & Packaging",
  "Forging & Foundry",
  "General Manufacturing",
];

const DEFAULT_CATEGORIES = [
  "Induction Hardening Machines",
  "Special Purpose Machines (SPM)",
  "Conveyor & Material Handling Systems",
  "Industrial Automation & Robotic Cells",
  "Hydraulic & Pneumatic Presses",
  "Leak Testing & Assembly Fixtures",
  "Custom Engineering Systems",
];

  const industryNames = useMemo(() => {
    const list = [
      ...DEFAULT_INDUSTRIES,
      ...(Array.isArray(industries)
        ? industries.map((i: any) => i?.name || i?.title).filter(Boolean)
        : []),
      ...(Array.isArray(projects) ? projects.map((p: any) => p?.industry).filter(Boolean) : []),
    ];
    return ["All", ...Array.from(new Set(list))];
  }, [industries, projects]);

  const categoryNames = useMemo(() => {
    const list = [
      ...DEFAULT_CATEGORIES,
      ...(Array.isArray(projects) ? projects.map((p: any) => p?.category).filter(Boolean) : []),
    ];
    return ["All", ...Array.from(new Set(list))];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchInd = industryFilter === "All" || p.industry === industryFilter;
      const matchCat = categoryFilter === "All" || p.category === categoryFilter;
      const matchFeatured =
        featuredFilter === "All" ||
        (featuredFilter === "Hero" && Boolean(p.featuredInHero)) ||
        (featuredFilter === "Home" && Boolean(p.featured || p.featuredInHome)) ||
        (featuredFilter === "Standard" && !p.featuredInHero && !p.featured && !p.featuredInHome);
      const matchQuery =
        !query.trim() ||
        (p.title + " " + p.category + " " + p.industry + " " + p.short)
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchInd && matchCat && matchFeatured && matchQuery;
    });
  }, [projects, industryFilter, categoryFilter, featuredFilter, query]);

  const featuredHeroCount = projects.filter((p) => p.featuredInHero).length;
  const featuredHomeTotal = projects.filter((p) => p.featured || p.featuredInHome).length;

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) {
      alert("Please specify a project title.");
      return;
    }
    const editId = editing._id || editing.id;
    const exists = projects.some((p) => (p.id && p.id === editId) || (p._id && p._id === editId));
    try {
      const response = await fetch(exists ? `/api/projects/${encodeURIComponent(editId)}` : "/api/projects", {
        method: exists ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editing,
          image: editing.image || "",
          featuredInHero: Boolean(editing.featuredInHero),
          featured: Boolean(editing.featured || editing.featuredInHome),
          featuredInHome: Boolean(editing.featured || editing.featuredInHome),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        flash(data.error || "Could not save project");
        return;
      }
      const savedData = data.data || { ...editing, id: editId };
      let updatedList = exists
        ? projects.map((p) => (p.id === editId || p._id === editId ? savedData : p))
        : [savedData, ...projects];

      // If set to featuredInHero, un-feature all other projects (exclusive radio behavior)
      if (editing.featuredInHero) {
        updatedList = updatedList.map((p) => {
          const pId = p.id || p._id;
          return pId === editId ? { ...p, featuredInHero: true } : { ...p, featuredInHero: false };
        });
        projects
          .filter((p: any) => (p.id || p._id) !== editId && p.featuredInHero)
          .forEach((p: any) => {
            fetch(`/api/projects/${encodeURIComponent(p.id || p._id)}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ featuredInHero: false }),
            }).catch(() => {});
          });
      }

      update("projects", updatedList);
      setEditing(null);
      flash(`✓ Saved project "${editing.title}" to database`);
    } catch (err: any) {
      flash(err.message || "Save failed");
    }
  };

  const remove = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);
    const id = deletingProject.id || deletingProject._id;
    try {
      await deleteProject(id);
      if (viewing && (viewing.id === id || viewing._id === id)) {
        setViewing(null);
      }
      setDeletingProject(null);
      flash("✓ Project removed from database");
    } catch (err) {
      flash("✓ Project removed");
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle Featured status for Projects Header Hero Spotlight (Exclusive single-featured)
  const toggleFeaturedInHero = async (project: any) => {
    const id = project.id || project._id;
    const newFeatured = !project.featuredInHero;
    try {
      const updatedList = projects.map((p: any) => {
        const pId = p.id || p._id;
        if (pId === id) {
          return { ...p, featuredInHero: newFeatured };
        }
        return newFeatured ? { ...p, featuredInHero: false } : p;
      });

      update("projects", updatedList);
      if (viewing && (viewing.id === id || viewing._id === id)) {
        setViewing({ ...viewing, featuredInHero: newFeatured });
      }
      flash(
        newFeatured
          ? `★ "${project.title}" is now Featured in Projects Page Header Spotlight`
          : `✓ Removed "${project.title}" from Header Spotlight`,
      );

      // Save update to database
      if (newFeatured) {
        // Un-feature others in db
        await Promise.all(
          projects
            .filter((p: any) => (p.id || p._id) !== id && p.featuredInHero)
            .map((p: any) =>
              fetch(`/api/projects/${encodeURIComponent(p.id || p._id)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ featuredInHero: false }),
              }),
            ),
        );
      }
      await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredInHero: newFeatured }),
      });
    } catch (err: any) {
      flash("Error: " + err.message);
    }
  };

  // Toggle Featured on Homepage (Multi-select)
  const toggleFeaturedInHome = async (project: any) => {
    const id = project.id || project._id;
    const isCurFeatured = Boolean(project.featured || project.featuredInHome);
    const newFeatured = !isCurFeatured;
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newFeatured, featuredInHome: newFeatured }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        flash(data.error || "Could not update project");
        return;
      }
      update(
        "projects",
        projects.map((item) =>
          item.id === id || (item as any)._id === id
            ? { ...item, featured: newFeatured, featuredInHome: newFeatured }
            : item,
        ),
      );
      if (viewing && (viewing.id === id || viewing._id === id)) {
        setViewing({ ...viewing, featured: newFeatured, featuredInHome: newFeatured });
      }
      flash(
        newFeatured
          ? `🏠 Marked "${project.title}" as Featured on Homepage`
          : `✓ Removed "${project.title}" from Homepage`,
      );
    } catch (err: any) {
      flash(err.message || "Update failed");
    }
  };

  const clearAll = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/projects", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        flash(data.error || "Could not remove projects");
        return;
      }
      update("projects", []);
      setConfirmClear(false);
      setEditing(null);
      if (viewing) setViewing(null);
      flash(`✓ Removed ${data.deletedCount || 0} projects`);
    } catch (err) {
      flash(err.message || "Clear all failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const uploadProjectImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editing) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "three-star-forge/projects");
      if (!result.success) {
        flash(result.error || "Image upload failed");
        return;
      }
      setEditing({ ...editing, image: result.url });
      flash("✓ Project cover photograph uploaded");
    } catch (err) {
      flash("Upload error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Spec helper
  const addSpecRow = () => {
    setEditing((prev) => ({
      ...prev,
      specs: [...(prev.specs || []), { label: "", value: "" }],
    }));
  };

  const updateSpecRow = (index, key, val) => {
    setEditing((prev) => {
      const updated = [...(prev.specs || [])];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, specs: updated };
    });
  };

  const removeSpecRow = (index) => {
    setEditing((prev) => ({
      ...prev,
      specs: (prev.specs || []).filter((_, i) => i !== index),
    }));
  };

  // Highlight helper
  const addHighlightRow = () => {
    setEditing((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), ""],
    }));
  };

  const updateHighlightRow = (index, val) => {
    setEditing((prev) => {
      const updated = [...(prev.highlights || [])];
      updated[index] = val;
      return { ...prev, highlights: updated };
    });
  };

  const removeHighlightRow = (index) => {
    setEditing((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <AdminHead
        title="Machinery Portfolio & Delivered Builds"
        eyebrow="Machine Manager"
        intro="Add, edit, or remove delivered machines. Machines starred as 'Featured' will automatically appear on the Home Page spotlight and lead the 'Our Work' portfolio."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {feedback && (
              <span className="border border-accent bg-accent/15 px-3 py-1.5 font-mono text-xs font-semibold text-accent animate-pulse shadow-sm">
                {feedback}
              </span>
            )}
            <MiniBtn
              tone="primary"
              onClick={() => startEditingProject(emptyProject(), "core")}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Project Build</span>
            </MiniBtn>

            {projects.length > 0 && !confirmClear ? (
              <MiniBtn tone="danger" onClick={() => setConfirmClear(true)}>
                Remove All ({projects.length})
              </MiniBtn>
            ) : null}

            {confirmClear ? (
              <div className="flex items-center gap-2">
                <MiniBtn tone="danger" onClick={clearAll}>
                  Confirm Remove All
                </MiniBtn>
                <MiniBtn onClick={() => setConfirmClear(false)}>Cancel</MiniBtn>
              </div>
            ) : null}
          </div>
        }
      />

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 shadow-sm">
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Total Machine Builds</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
            {projects.length}
          </p>
          <span className="text-[0.68rem] font-mono text-muted">Active in Portfolio</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-accent text-[0.65rem]">Projects Header Spotlight</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-accent">
            {featuredHeroCount > 0 ? "1 Active Hero" : "None Set"}
          </p>
          <span className="text-[0.68rem] font-mono text-muted">/projects Hero Card</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-accent text-[0.65rem]">Homepage Featured</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-accent">
            {featuredHomeTotal}
          </p>
          <span className="text-[0.68rem] font-mono text-muted">Showcased on Home</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Target Industries</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
            {industryNames.length - 1}
          </p>
          <span className="text-[0.68rem] font-mono text-muted">Sectors Covered</span>
        </div>
      </div>

      {/* Filter & View Mode Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-line bg-surface p-4 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by title, category, industry..."
            className="w-full border border-line bg-background pl-9 pr-8 py-2 text-xs font-mono text-foreground placeholder:text-muted outline-none focus:border-accent"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-2 text-xs text-muted hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="tech-label text-muted text-[0.65rem]">Industry:</span>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="border border-line bg-background px-2.5 py-1.5 font-mono text-xs text-foreground outline-none focus:border-accent"
            >
              {industryNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="tech-label text-muted text-[0.65rem]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-line bg-background px-2.5 py-1.5 font-mono text-xs text-foreground outline-none focus:border-accent"
            >
              {categoryNames.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="tech-label text-muted text-[0.65rem]">Placement:</span>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="border border-line bg-background px-2.5 py-1.5 font-mono text-xs text-foreground outline-none focus:border-accent"
            >
              <option value="All">All Placements</option>
              <option value="Hero">★ Projects Header Spotlight</option>
              <option value="Home">🏠 Homepage Featured</option>
              <option value="Standard">Standard Builds Only</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-line bg-background">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid" ? "bg-navy text-onnavy" : "text-muted hover:text-foreground"
              }`}
              title="Grid Cards"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-2 transition-colors ${
                viewMode === "table" ? "bg-navy text-onnavy" : "text-muted hover:text-foreground"
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Project Builder / Editor Panel */}
      {editing ? (
        <div ref={formRef} className="scroll-mt-6">
          <Panel
            title={
              projects.some((p) => p.id === editing.id)
                ? `Edit Project Specification: "${editing.title || "Untitled"}"`
                : "Create New Machine Build Specification"
            }
            action={
              <div className="flex items-center gap-2">
                <MiniBtn tone="primary" onClick={save}>
                  ✓ Save Project
                </MiniBtn>
                <MiniBtn onClick={() => setEditing(null)}>Cancel</MiniBtn>
              </div>
            }
          >
          {/* Sub-tabs within Editor */}
          <div className="flex border-b border-line mb-6 gap-2">
            {[
              { id: "core", label: "1. Core & Cover Media" },
              { id: "narrative", label: "2. Engineering Scope" },
              { id: "specs", label: `3. Technical Specs (${editing.specs?.length || 0})` },
              { id: "highlights", label: `4. Highlights (${editing.highlights?.length || 0})` },
            ].map((tb) => (
              <button
                key={tb.id}
                type="button"
                onClick={() => setEditTab(tb.id)}
                className={`border-b-2 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                  editTab === tb.id
                    ? "border-accent text-accent font-bold bg-accent/5"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Core & Image */}
          {editTab === "core" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                label="Project Title"
                value={editing.title}
                onChange={(v) => setEditing({ ...editing, title: v })}
                placeholder="e.g. Dual-Spindle Induction Hardening Cell"
                required
              />

              <SelectField
                label="Target Industry"
                value={editing.industry}
                options={industryNames.filter((n) => n !== "All")}
                onChange={(v) => setEditing({ ...editing, industry: v })}
                placeholder="-- Select Target Industry --"
                required
              />

              {/* Machinery Category Selector + Custom Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Machinery Category <span className="text-danger">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(!isCustomCategory)}
                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {isCustomCategory ? "📁 Choose from Existing Categories" : "✏️ + Type Custom Category"}
                  </button>
                </div>

                {isCustomCategory ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editing.category || ""}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      placeholder="Type custom category name (e.g. Induction bro, Custom SPM, etc.)..."
                      className="w-full rounded-xl border border-line bg-background px-4 py-2.5 text-xs text-foreground outline-none transition-all focus:border-accent font-medium placeholder:text-muted"
                      autoFocus
                    />
                    {/* Quick Suggestion Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[0.68rem] text-muted font-medium mr-1">Suggestions:</span>
                      {categoryNames
                        .filter((c) => c !== "All")
                        .slice(0, 5)
                        .map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setEditing({ ...editing, category: cat })}
                            className="rounded-lg border border-line bg-surface px-2 py-0.5 text-[0.68rem] text-muted hover:border-accent hover:text-accent transition-all cursor-pointer"
                          >
                            {cat}
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <select
                        value={
                          categoryNames.includes(editing.category)
                            ? editing.category
                            : editing.category
                            ? "custom"
                            : ""
                        }
                        onChange={(e) => {
                          if (e.target.value === "custom") {
                            setIsCustomCategory(true);
                          } else {
                            setEditing({ ...editing, category: e.target.value });
                          }
                        }}
                        className="w-full appearance-none rounded-xl border border-line bg-background px-4 py-2.5 pr-10 text-xs font-medium text-foreground outline-none transition-all focus:border-accent hover:border-line-strong cursor-pointer"
                      >
                        <option value="" disabled>
                          -- Select Existing Category --
                        </option>
                        {categoryNames
                          .filter((c) => c !== "All")
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        <option value="custom">✏️ + Type New / Custom Category...</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    </div>

                    {/* Quick Pills for 1-Click Selection */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {categoryNames
                        .filter((c) => c !== "All")
                        .slice(0, 4)
                        .map((cat) => {
                          const isSelected = editing.category === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setEditing({ ...editing, category: cat })}
                              className={`rounded-lg border px-2.5 py-1 text-[0.68rem] font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? "border-accent bg-accent text-navy font-bold shadow-xs"
                                  : "border-line bg-background text-muted hover:border-accent hover:text-foreground"
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <span className="tech-label text-muted text-xs block mb-2">Cover Photograph</span>
                <div className="flex flex-wrap items-start gap-6 border border-line bg-background p-4">
                  {editing.image ? (
                    <div className="relative h-32 w-48 shrink-0 overflow-hidden border border-line group">
                      <img
                        src={editing.image}
                        alt="Project preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditing({ ...editing, image: "" });
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute top-1 right-1 bg-danger text-white p-1 text-xs hover:opacity-90 transition-opacity shadow"
                        title="Remove image"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-32 w-48 shrink-0 items-center justify-center border border-dashed border-line bg-surface text-muted text-xs font-mono">
                      No Image Set
                    </div>
                  )}

                  <div className="flex-1 min-w-[240px] space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="border border-accent bg-accent/15 px-4 py-2 font-mono text-xs font-bold text-accent uppercase tracking-wider hover:bg-accent hover:text-navy transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>{uploading ? "Uploading..." : "Upload Cover Image"}</span>
                      </button>
                      {editing.image && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditing({ ...editing, image: "" });
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-xs font-bold text-danger uppercase tracking-wider hover:bg-danger hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Clear attached image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove Image</span>
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={uploadProjectImage}
                        className="hidden"
                      />
                    </div>
                    <TextField
                      label="Or Direct Image URL"
                      value={editing.image}
                      onChange={(v) => setEditing({ ...editing, image: v })}
                      placeholder="https://..."
                    />
                    {editing.image && (
                      <ImageMetaBadge src={editing.image} variant="panel" className="mt-2" />
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <TextField
                  label="Executive Summary (Short Description)"
                  value={editing.short}
                  onChange={(v) => setEditing({ ...editing, short: v })}
                  placeholder="Concise overview displayed on portfolio cards..."
                  rows={2}
                />
              </div>

              <div className="sm:col-span-2 space-y-4 rounded-2xl border border-line bg-surface/50 p-5">
                <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span>Featured Placements & Showcase Settings</span>
                </h4>

                <Toggle
                  label="★ Featured in Projects Page Header Hero Spotlight"
                  checked={Boolean(editing.featuredInHero)}
                  onChange={(v) => setEditing({ ...editing, featuredInHero: v })}
                  description="When enabled, this machine will be prominently featured inside the top hero header on the /projects page. (Setting this ON automatically un-features any previous hero build)."
                />

                <div className="border-t border-line/60 pt-3">
                  <Toggle
                    label="🏠 Featured on Homepage Showcases"
                    checked={Boolean(editing.featured || editing.featuredInHome)}
                    onChange={(v) => setEditing({ ...editing, featured: v, featuredInHome: v })}
                    description="When enabled, this build will be featured in the homepage carousel, marquee reel, and top portfolio showcase."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Scope & Narratives */}
          {editTab === "narrative" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField
                  label="Detailed Engineering Overview"
                  value={editing.overview}
                  onChange={(v) => setEditing({ ...editing, overview: v })}
                  placeholder="Comprehensive technical breakdown of the machine build..."
                  rows={4}
                />
              </div>

              <TextField
                label="Engineering Challenge"
                value={editing.challenge}
                onChange={(v) => setEditing({ ...editing, challenge: v })}
                placeholder="What precision challenge or bottleneck did the client face?"
                rows={4}
              />

              <TextField
                label="Delivered Solution"
                value={editing.solution}
                onChange={(v) => setEditing({ ...editing, solution: v })}
                placeholder="What custom mechanism, induction coil, or PLC logic was implemented?"
                rows={4}
              />

              <div className="sm:col-span-2">
                <TextField
                  label="Industrial Application & Use Cases"
                  value={editing.application}
                  onChange={(v) => setEditing({ ...editing, application: v })}
                  placeholder="e.g. Automotive crankshaft induction hardening line, Aerospace component heat treatment..."
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Tab 3: Structured Specs Builder */}
          {editTab === "specs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    Technical Parameter Matrix
                  </h4>
                  <p className="text-xs text-muted font-mono">
                    Structured key-value specifications shown on the public project blueprint page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addSpecRow}
                  className="border border-accent bg-accent/10 px-3 py-1.5 font-mono text-xs font-bold text-accent uppercase tracking-wider hover:bg-accent hover:text-navy transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Parameter Row
                </button>
              </div>

              {/* Quick Preset Badges */}
              <div className="flex flex-wrap items-center gap-1.5 p-3 border border-line bg-background text-xs font-mono">
                <span className="text-muted text-[0.65rem] uppercase mr-1">Quick Label Presets:</span>
                {PRESET_SPEC_LABELS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setEditing((prev) => ({
                        ...prev,
                        specs: [...(prev.specs || []), { label: preset, value: "" }],
                      }));
                    }}
                    className="border border-line bg-surface px-2 py-0.5 text-[0.68rem] text-muted hover:border-accent hover:text-accent transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {(editing.specs || []).map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-3 border border-line bg-surface p-3"
                  >
                    <div className="w-1/3 min-w-[160px]">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => updateSpecRow(idx, "label", e.target.value)}
                        placeholder="Parameter (e.g. Cycle Time)"
                        className="w-full border border-line bg-background px-3 py-1.5 font-mono text-xs text-foreground outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpecRow(idx, "value", e.target.value)}
                        placeholder="Value (e.g. 14 sec / component)"
                        className="w-full border border-line bg-background px-3 py-1.5 font-mono text-xs text-foreground outline-none focus:border-accent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecRow(idx)}
                      className="p-1.5 border border-danger/30 text-danger hover:bg-danger hover:text-white transition-colors"
                      title="Remove Row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Highlights */}
          {editTab === "highlights" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    Key Technical Highlights & Innovations
                  </h4>
                  <p className="text-xs text-muted font-mono">
                    Bullet points emphasizing precision tolerances, PLC automation, and custom tooling.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addHighlightRow}
                  className="border border-accent bg-accent/10 px-3 py-1.5 font-mono text-xs font-bold text-accent uppercase tracking-wider hover:bg-accent hover:text-navy transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Highlight Point
                </button>
              </div>

              <div className="space-y-2">
                {(editing.highlights || []).map((h, idx) => (
                  <div key={idx} className="flex items-center gap-3 border border-line bg-surface p-3">
                    <span className="font-mono text-xs text-accent font-bold">
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => updateHighlightRow(idx, e.target.value)}
                      placeholder="e.g. Integrated optical pyrometer for closed-loop thermal regulation"
                      className="flex-1 border border-line bg-background px-3 py-1.5 font-mono text-xs text-foreground outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlightRow(idx)}
                      className="p-1.5 border border-danger/30 text-danger hover:bg-danger hover:text-white transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <div className="flex items-center gap-3">
              <MiniBtn tone="primary" onClick={save}>
                Save Project Specification
              </MiniBtn>
              <MiniBtn onClick={() => setEditing(null)}>Cancel</MiniBtn>
            </div>

            <span className="font-mono text-xs text-muted">
              Project ID: <strong className="text-foreground">{editing.id}</strong>
            </span>
          </div>
        </Panel>
      </div>
      ) : null}

      {/* Main Content Display */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-8 w-8 text-muted" />}
          title="No Project Builds Found"
          description="No projects match your active search and filter parameters. Try clearing your filters or create a new machine build."
          action={
            <MiniBtn tone="primary" onClick={() => startEditingProject(emptyProject(), "core")}>
              + Create New Project
            </MiniBtn>
          }
        />
      ) : viewMode === "grid" ? (
        /* Visual Card Grid View */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const isHeroFeatured = Boolean(p.featuredInHero);
            const isHomeFeatured = Boolean(p.featured || p.featuredInHome);
            return (
              <article
                key={p.id}
                className={`group flex flex-col border bg-surface transition-all duration-300 hover:shadow-lg rounded-2xl overflow-hidden ${
                  isHeroFeatured
                    ? "border-accent shadow-md ring-1 ring-accent/30"
                    : isHomeFeatured
                    ? "border-accent/50 shadow-xs"
                    : "border-line hover:border-line-strong"
                }`}
              >
                {/* Cover Image & Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-navy">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-mono text-xs text-onnavy-muted">
                      No Image Attached
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="border border-onnavy/30 bg-navy/90 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-onnavy uppercase backdrop-blur-sm rounded-md">
                      {p.industry}
                    </span>
                    {isHeroFeatured && (
                      <span className="border border-accent bg-accent px-2 py-0.5 text-[0.65rem] font-bold text-navy uppercase shadow-sm flex items-center gap-1 rounded-md">
                        <Sparkles className="h-3 w-3 fill-navy" />
                        Header Hero
                      </span>
                    )}
                    {isHomeFeatured && (
                      <span className="border border-onnavy/30 bg-navy/90 px-2 py-0.5 text-[0.65rem] font-bold text-accent uppercase shadow-sm flex items-center gap-1 rounded-md backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-accent" />
                        Home Featured
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Metadata Pill */}
                  {p.image && (
                    <div className="absolute bottom-2.5 right-2.5 z-10">
                      <ImageMetaBadge src={p.image} variant="pill" className="shadow-md" />
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="flex flex-1 flex-col p-5 min-w-0">
                  <div className="flex items-center justify-between text-xs font-mono text-muted mb-1.5 min-w-0">
                    <span className="text-accent uppercase font-semibold truncate">{p.category}</span>
                    <span className="shrink-0">{p.specs?.length || 0} Specs</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-foreground group-hover:text-accent transition-colors leading-snug break-words">
                    {p.title}
                  </h3>

                  <p className="mt-2 flex-1 text-xs text-muted leading-relaxed line-clamp-2 break-words">
                    {p.short || p.overview || "No description provided."}
                  </p>

                  {/* Footer Placement Toggles & Action Buttons */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Projects Header Hero Spotlight Toggle (Exclusive) */}
                      <button
                        type="button"
                        onClick={() => toggleFeaturedInHero(p)}
                        className={`rounded-lg px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                          isHeroFeatured
                            ? "border border-accent bg-accent text-navy shadow-sm font-extrabold"
                            : "border border-line bg-background text-muted hover:border-accent hover:text-accent"
                        }`}
                        title="Feature this build in the /projects page top hero header"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{isHeroFeatured ? "In Hero" : "Set Hero"}</span>
                      </button>

                      {/* Homepage Featured Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleFeaturedInHome(p)}
                        className={`rounded-lg px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                          isHomeFeatured
                            ? "border border-accent/40 bg-accent/15 text-accent"
                            : "border border-line bg-background text-muted hover:border-line-strong hover:text-foreground"
                        }`}
                        title="Feature this build on the Homepage showcase carousel"
                      >
                        <Star className="h-3 w-3" />
                        <span>{isHomeFeatured ? "Home (On)" : "Home (Off)"}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MiniBtn tone="accent" onClick={() => setViewing(p)} title="Inspect project specification sheet">
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </MiniBtn>
                      <MiniBtn
                        onClick={() => startEditingProject(p, "core")}
                        title="Edit project"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </MiniBtn>
                      <MiniBtn tone="danger" onClick={() => setDeletingProject(p)} title="Delete project">
                        <Trash2 className="h-3 w-3" />
                      </MiniBtn>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="border border-line bg-surface shadow-sm overflow-hidden min-w-0 rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-background/50">
                  <th className="px-6 py-4 font-mono text-[0.68rem] font-bold tracking-wider uppercase text-muted">
                    Project Build
                  </th>
                  <th className="px-6 py-4 font-mono text-[0.68rem] font-bold tracking-wider uppercase text-muted">
                    Industry
                  </th>
                  <th className="px-6 py-4 font-mono text-[0.68rem] font-bold tracking-wider uppercase text-muted">
                    Category
                  </th>
                  <th className="px-6 py-4 font-mono text-[0.68rem] font-bold tracking-wider uppercase text-muted text-center">
                    Header Hero
                  </th>
                  <th className="px-6 py-4 font-mono text-[0.68rem] font-bold tracking-wider uppercase text-muted text-center">
                    Homepage
                  </th>
                  <th className="px-6 py-4 text-right font-mono text-[0.68rem] font-bold tracking-wider uppercase text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((p) => {
                  const isHeroFeatured = Boolean(p.featuredInHero);
                  const isHomeFeatured = Boolean(p.featured || p.featuredInHome);
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-background/80">
                      <td className="px-6 py-4 max-w-sm min-w-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-navy cursor-pointer" onClick={() => setViewing(p)}>
                            {p.image ? (
                              <img
                                src={p.image}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center font-mono text-[0.6rem] text-onnavy-muted">
                                No Img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className="font-display text-sm font-bold text-foreground hover:text-accent cursor-pointer transition-colors break-words"
                              onClick={() => setViewing(p)}
                            >
                              {p.title}
                            </p>
                            <span className="block text-xs font-mono text-muted truncate max-w-xs">
                              {p.short || "No description"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted break-words">{p.industry}</td>
                      <td className="px-6 py-4 font-mono text-xs text-accent break-words">{p.category}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFeaturedInHero(p)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                            isHeroFeatured
                              ? "bg-accent text-navy font-bold shadow-xs"
                              : "bg-surface border border-line text-muted hover:border-accent hover:text-accent"
                          }`}
                          title="Toggle /projects page hero spotlight"
                        >
                          {isHeroFeatured ? "★ In Hero" : "Set Hero"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFeaturedInHome(p)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                            isHomeFeatured
                              ? "bg-accent/15 text-accent border border-accent/40"
                              : "bg-surface border border-line text-muted hover:text-foreground"
                          }`}
                          title="Toggle Homepage showcase"
                        >
                          {isHomeFeatured ? "★ Active" : "Off"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <MiniBtn tone="accent" onClick={() => setViewing(p)} title="View project">
                            <Eye className="h-3 w-3" />
                          </MiniBtn>
                          <MiniBtn
                            onClick={() => startEditingProject(p, "core")}
                            title="Edit project"
                          >
                            <Edit className="h-3 w-3" />
                          </MiniBtn>
                          <MiniBtn tone="danger" onClick={() => setDeletingProject(p)} title="Delete project">
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
        </div>
      )}

      {/* Project Detail Preview Modal */}
      {viewing && (
        <AdminModal
          isOpen={Boolean(viewing)}
          onClose={() => setViewing(null)}
          title={viewing.title}
          eyebrow={`Technical Specification · ${viewing.category}`}
          size="2xl"
          footer={
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2">
                <MiniBtn
                  tone="danger"
                  onClick={() => {
                    setDeletingProject(viewing);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Project</span>
                </MiniBtn>
                <MiniBtn
                  onClick={() => toggleFeaturedInHero(viewing)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{viewing.featuredInHero ? "In Header Hero" : "Set Header Hero"}</span>
                </MiniBtn>
                <MiniBtn
                  onClick={() => toggleFeaturedInHome(viewing)}
                >
                  <Star className="h-3.5 w-3.5" />
                  <span>{viewing.featured || viewing.featuredInHome ? "Home (On)" : "Home (Off)"}</span>
                </MiniBtn>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/projects/${viewing.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-line bg-surface px-3.5 py-2 font-mono text-xs font-semibold text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  <span>Live Project Page</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <MiniBtn
                  tone="accent"
                  onClick={() => startEditingProject(viewing, "core")}
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit Project</span>
                </MiniBtn>
                <MiniBtn onClick={() => setViewing(null)}>Close</MiniBtn>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Top Project Picture with Badges */}
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-line bg-navy">
              {viewing.image ? (
                <img
                  src={viewing.image}
                  alt={viewing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-mono text-xs text-onnavy-muted">
                  No Image Attached
                </div>
              )}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="border border-onnavy/30 bg-navy/80 px-2.5 py-0.5 font-mono text-xs font-bold text-onnavy uppercase backdrop-blur-sm">
                  {viewing.industry}
                </span>
                {viewing.featured && (
                  <span className="border border-accent bg-accent px-2.5 py-0.5 font-mono text-xs font-bold text-navy uppercase shadow-md flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured Build
                  </span>
                )}
              </div>
            </div>

            {/* Quick Metadata Matrix */}
            <div className="grid gap-3 sm:grid-cols-3 border border-line bg-background p-4 font-mono text-xs">
              <div>
                <span className="text-muted block text-[0.68rem] uppercase">Machinery Category</span>
                <span className="font-bold text-accent text-sm mt-0.5 block">{viewing.category}</span>
              </div>
              <div>
                <span className="text-muted block text-[0.68rem] uppercase">Target Sector</span>
                <span className="font-bold text-foreground text-sm mt-0.5 block">{viewing.industry}</span>
              </div>
              <div>
                <span className="text-muted block text-[0.68rem] uppercase">Build Identifier</span>
                <span className="font-mono text-muted text-xs mt-0.5 block truncate">{viewing.id}</span>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <span className="tech-label text-muted text-xs uppercase block">
                Technical Overview & Brief:
              </span>
              <p className="text-sm font-sans text-foreground leading-relaxed whitespace-pre-wrap">
                {viewing.overview || viewing.short || "No detailed overview provided."}
              </p>
            </div>

            {/* Challenge & Solution Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {viewing.challenge && (
                <div className="border-l-2 border-accent bg-background/50 p-4 space-y-1">
                  <span className="tech-label text-accent text-[0.68rem] uppercase font-bold block">
                    Engineering Challenge:
                  </span>
                  <p className="text-xs text-muted leading-relaxed font-sans">{viewing.challenge}</p>
                </div>
              )}
              {viewing.solution && (
                <div className="border-l-2 border-success bg-background/50 p-4 space-y-1">
                  <span className="tech-label text-success text-[0.68rem] uppercase font-bold block">
                    Delivered Solution:
                  </span>
                  <p className="text-xs text-muted leading-relaxed font-sans">{viewing.solution}</p>
                </div>
              )}
            </div>

            {/* Applications */}
            {viewing.application && (
              <div className="border border-line bg-surface p-4 space-y-1">
                <span className="tech-label text-muted text-[0.68rem] uppercase block">
                  Industrial Application & Use Cases:
                </span>
                <p className="text-xs text-foreground font-mono">{viewing.application}</p>
              </div>
            )}

            {/* Structured Specifications */}
            {viewing.specs?.length > 0 && (
              <div className="space-y-2">
                <span className="tech-label text-accent text-xs uppercase font-bold block">
                  Technical Specifications Matrix:
                </span>
                <div className="grid gap-2 sm:grid-cols-2 border border-line bg-background p-4 font-mono text-xs">
                  {viewing.specs.map((s, i) => (
                    <div key={i} className="flex justify-between border-b border-line/60 py-1.5">
                      <span className="text-muted">{s.label}:</span>
                      <span className="font-bold text-foreground">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {viewing.highlights?.length > 0 && (
              <div className="space-y-2">
                <span className="tech-label text-foreground text-xs uppercase font-bold block">
                  Key Engineering Highlights:
                </span>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {viewing.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="border border-line bg-background p-3 text-xs font-mono text-foreground flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </AdminModal>
      )}

      {/* SINGLE PROJECT DELETE CONFIRM MODAL */}
      {deletingProject && (
        <ConfirmDeleteModal
          isOpen={Boolean(deletingProject)}
          onClose={() => setDeletingProject(null)}
          onConfirm={remove}
          title="Delete Engineering Project?"
          message="Are you sure you want to permanently delete this project specification from the database and public showcase? All technical specifications and highlights will be removed."
          itemName={`${deletingProject.title} (${deletingProject.category})`}
          isDeleting={isDeleting}
        />
      )}

      {/* CLEAR ALL PROJECTS CONFIRM MODAL */}
      {confirmClear && (
        <ConfirmDeleteModal
          isOpen={confirmClear}
          onClose={() => setConfirmClear(false)}
          onConfirm={clearAll}
          title="Clear All Projects?"
          message={`Are you sure you want to delete ALL ${projects.length} project builds from the database? This action is completely irreversible.`}
          itemName={`All ${projects.length} project records`}
          confirmLabel="Yes, Clear All"
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
