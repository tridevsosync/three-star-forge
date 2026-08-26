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
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const flash = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 3500);
  };

  const industryNames = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set([...industries.map((i) => i.name), ...projects.map((p) => p.industry)]),
      ),
    ],
    [industries, projects],
  );

  const categoryNames = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchInd = industryFilter === "All" || p.industry === industryFilter;
      const matchCat = categoryFilter === "All" || p.category === categoryFilter;
      const matchFeatured =
        featuredFilter === "All" ||
        (featuredFilter === "Featured" && Boolean(p.featured)) ||
        (featuredFilter === "Standard" && !p.featured);
      const matchQuery =
        !query.trim() ||
        (p.title + " " + p.category + " " + p.industry + " " + p.short)
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchInd && matchCat && matchFeatured && matchQuery;
    });
  }, [projects, industryFilter, categoryFilter, featuredFilter, query]);

  const featuredTotal = projects.filter((p) => p.featured).length;

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) {
      alert("Please specify a project title.");
      return;
    }
    const exists = projects.some((p) => p.id === editing.id);
    try {
      const response = await fetch(exists ? `/api/projects/${editing.id}` : "/api/projects", {
        method: exists ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        flash(data.error || "Could not save project");
        return;
      }
      update(
        "projects",
        exists
          ? projects.map((p) => (p.id === editing.id ? data.data : p))
          : [data.data, ...projects],
      );
      setEditing(null);
      flash(`✓ Saved project "${editing.title}" to database`);
    } catch (err) {
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

  const toggleFeatured = async (project, featured) => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        flash(data.error || "Could not update project");
        return;
      }
      update(
        "projects",
        projects.map((item) => (item.id === project.id ? data.data : item)),
      );
      if (viewing && viewing.id === project.id) {
        setViewing({ ...viewing, featured });
      }
      flash(featured ? `★ Marked "${project.title}" as Featured Build` : `Marked as Standard`);
    } catch (err) {
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
        title="Project Portfolio & Machine Builds Studio"
        eyebrow="Portfolio Console"
        intro="Enterprise portfolio management. Create precision machinery showcases, define engineering specifications, upload shop-floor media, and curate featured client deliveries."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {feedback && (
              <span className="border border-accent bg-accent/15 px-3 py-1.5 font-mono text-xs font-semibold text-accent animate-pulse shadow-sm">
                {feedback}
              </span>
            )}
            <MiniBtn
              tone="primary"
              onClick={() => {
                setEditing(emptyProject());
                setEditTab("core");
              }}
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
          <span className="tech-label text-accent text-[0.65rem]">Featured Showcases</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-accent">
            {featuredTotal}
          </p>
          <span className="text-[0.68rem] font-mono text-muted">Pinned on Homepage</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Target Industries</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
            {industryNames.length - 1}
          </p>
          <span className="text-[0.68rem] font-mono text-muted">Sectors Covered</span>
        </div>
        <div className="bg-surface p-5">
          <span className="tech-label text-muted text-[0.65rem]">Filtered Results</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
            {filtered.length}
          </p>
          <span className="text-[0.68rem] font-mono text-muted">of {projects.length} total</span>
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
            <span className="tech-label text-muted text-[0.65rem]">Status:</span>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="border border-line bg-background px-2.5 py-1.5 font-mono text-xs text-foreground outline-none focus:border-accent"
            >
              <option value="All">All Statuses</option>
              <option value="Featured">★ Featured Only</option>
              <option value="Standard">Standard Only</option>
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
              />

              <TextField
                label="Machinery Category"
                value={editing.category}
                onChange={(v) => setEditing({ ...editing, category: v })}
                placeholder="e.g. Induction Hardening, Material Handling, Automation"
              />

              <div className="sm:col-span-2">
                <span className="tech-label text-muted text-xs block mb-2">Cover Photograph</span>
                <div className="flex flex-wrap items-start gap-6 border border-line bg-background p-4">
                  {editing.image ? (
                    <div className="relative h-32 w-48 shrink-0 overflow-hidden border border-line">
                      <img
                        src={editing.image}
                        alt="Project preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-32 w-48 shrink-0 items-center justify-center border border-dashed border-line bg-surface text-muted text-xs font-mono">
                      No Image Set
                    </div>
                  )}

                  <div className="flex-1 min-w-[240px] space-y-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="border border-accent bg-accent/15 px-4 py-2 font-mono text-xs font-bold text-accent uppercase tracking-wider hover:bg-accent hover:text-navy transition-colors disabled:opacity-50"
                      >
                        {uploading ? "Uploading..." : "Upload Cover Image"}
                      </button>
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

              <div className="sm:col-span-2">
                <Toggle
                  label="Featured Showcase"
                  checked={editing.featured}
                  onChange={(v) => setEditing({ ...editing, featured: v })}
                  description="When enabled, this machine build will be prominently showcased on the home landing page."
                />
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
      ) : null}

      {/* Main Content Display */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-8 w-8 text-muted" />}
          title="No Project Builds Found"
          description="No projects match your active search and filter parameters. Try clearing your filters or create a new machine build."
          action={
            <MiniBtn tone="primary" onClick={() => setEditing(emptyProject())}>
              + Create New Project
            </MiniBtn>
          }
        />
      ) : viewMode === "grid" ? (
        /* Visual Card Grid View */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const isFeatured = Boolean(p.featured);
            return (
              <article
                key={p.id}
                className={`group flex flex-col border bg-surface transition-all duration-300 hover:shadow-lg ${
                  isFeatured
                    ? "border-accent/60 shadow-sm"
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
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="border border-onnavy/30 bg-navy/80 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-onnavy uppercase backdrop-blur-sm">
                      {p.industry}
                    </span>
                    {isFeatured && (
                      <span className="border border-accent bg-accent px-2 py-0.5 font-mono text-[0.65rem] font-bold text-navy uppercase shadow-sm flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Featured Build
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between text-xs font-mono text-muted mb-1.5">
                    <span className="text-accent uppercase font-semibold">{p.category}</span>
                    <span>{p.specs?.length || 0} Specs</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
                    {p.title}
                  </h3>

                  <p className="mt-2 flex-1 text-xs text-muted leading-relaxed line-clamp-2">
                    {p.short || p.overview || "No description provided."}
                  </p>

                  {/* Footer & Actions */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(p, !isFeatured)}
                      className={`font-mono text-[0.68rem] font-semibold uppercase tracking-wider transition-colors ${
                        isFeatured ? "text-accent" : "text-muted hover:text-foreground"
                      }`}
                    >
                      {isFeatured ? "★ Featured" : "☆ Feature"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <MiniBtn tone="accent" onClick={() => setViewing(p)} title="Inspect project specification sheet">
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </MiniBtn>
                      <MiniBtn
                        onClick={() => {
                          setEditing(p);
                          setEditTab("core");
                        }}
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
        <div className="border border-line bg-surface shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
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
                    Featured
                  </th>
                  <th className="px-6 py-4 text-right font-mono text-[0.68rem] font-bold tracking-wider uppercase text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-background/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 shrink-0 overflow-hidden border border-line bg-navy cursor-pointer" onClick={() => setViewing(p)}>
                          {p.image ? (
                            <img
                              src={p.image}
                              alt=""
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                        <div>
                          <span
                            className="font-display text-sm font-bold text-foreground cursor-pointer hover:text-accent"
                            onClick={() => setViewing(p)}
                          >
                            {p.title}
                          </span>
                          <span className="block text-xs font-mono text-muted truncate max-w-xs">
                            {p.short || "No description"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted">{p.industry}</td>
                    <td className="px-6 py-4 font-mono text-xs text-accent">{p.category}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(p, !p.featured)}
                        className={`font-mono text-xs font-bold ${
                          p.featured ? "text-accent" : "text-muted hover:text-foreground"
                        }`}
                      >
                        {p.featured ? "★ Yes" : "No"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <MiniBtn tone="accent" onClick={() => setViewing(p)} title="View project">
                          <Eye className="h-3 w-3" />
                        </MiniBtn>
                        <MiniBtn
                          onClick={() => {
                            setEditing(p);
                            setEditTab("core");
                          }}
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
                ))}
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
                  onClick={() => {
                    toggleFeatured(viewing, !viewing.featured);
                  }}
                >
                  {viewing.featured ? "☆ Unmark Featured" : "★ Mark as Featured"}
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
                  onClick={() => {
                    setEditing(viewing);
                    setEditTab("core");
                    setViewing(null);
                  }}
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
