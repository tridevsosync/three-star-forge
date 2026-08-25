"use client";

import { useRef, useMemo, useState } from "react";
import {
  AdminHead,
  MiniBtn,
  Panel,
  SelectField,
  TextField,
  Toggle,
} from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";

function emptyProject() {
  return {
    id: `p-${Date.now()}`,
    title: "New project",
    industry: "Engineering Equipment",
    category: "Engineering",
    image: "",
    short: "",
    featured: false,
    overview: "",
    challenge: "",
    solution: "",
    application: "",
    specs: [],
    highlights: [],
  };
}

export default function AdminProjectsPage() {
  const { projects, industries, update, uploadToCloudinary } = useSite();
  const [query, setQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const industryNames = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set([...industries.map((i) => i.name), ...projects.map((p) => p.industry)]),
      ),
    ],
    [industries, projects],
  );
  const filtered = projects.filter(
    (p) =>
      (industryFilter === "All" || p.industry === industryFilter) &&
      (categoryFilter === "All" || p.category === categoryFilter) &&
      (p.title + p.category).toLowerCase().includes(query.toLowerCase()),
  );
  const save = async () => {
    if (!editing) return;
    const exists = projects.some((p) => p.id === editing.id);
    const response = await fetch(exists ? `/api/projects/${editing.id}` : "/api/projects", {
      method: exists ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setFeedback(data.error || "Could not save project");
      return;
    }
    update(
      "projects",
      exists
        ? projects.map((p) => (p.id === editing.id ? data.data : p))
        : [data.data, ...projects],
    );
    setEditing(null);
    setFeedback("Project saved to MongoDB");
  };
  const remove = async (id) => {
    const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setFeedback(data.error || "Could not delete project");
      return;
    }
    update(
      "projects",
      projects.filter((p) => p.id !== id),
    );
    setConfirmDelete(null);
    setFeedback("Project deleted from MongoDB");
  };
  const toggleFeatured = async (project, featured) => {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setFeedback(data.error || "Could not update project");
      return;
    }
    update(
      "projects",
      projects.map((item) => (item.id === project.id ? data.data : item)),
    );
    setFeedback("Project updated in MongoDB");
  };
  const clearAll = async () => {
    const response = await fetch("/api/projects", { method: "DELETE" });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setFeedback(data.error || "Could not remove projects");
      return;
    }
    update("projects", []);
    setConfirmClear(false);
    setEditing(null);
    setFeedback(`${data.deletedCount || 0} projects removed from MongoDB`);
  };
  const uploadProjectImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editing) return;
    if (!file.type.startsWith("image/")) {
      setFeedback("Please select an image file");
      return;
    }
    setUploading(true);
    const result = await uploadToCloudinary(file, "three-star-forge/projects");
    setUploading(false);
    if (!result.success) {
      setFeedback(result.error || "Image upload failed");
      return;
    }
    setEditing({ ...editing, image: result.url });
    setFeedback("Project image uploaded. Save the project to apply it.");
  };
  return (
    <div className="space-y-8">
      <AdminHead
        title="Projects"
        intro="Add, edit and remove portfolio projects. Every project should use an image that is not already assigned elsewhere."
        action={
          <div className="flex flex-wrap gap-2">
            <MiniBtn tone="accent" onClick={() => setEditing(emptyProject())}>
              Add project
            </MiniBtn>
            {projects.length > 0 && !confirmClear ? (
              <MiniBtn tone="danger" onClick={() => setConfirmClear(true)}>
                Remove all
              </MiniBtn>
            ) : null}
            {confirmClear ? (
              <>
                <MiniBtn
                  tone="danger"
                  onClick={() => clearAll().catch((error) => setFeedback(error.message))}
                >
                  Confirm remove all
                </MiniBtn>
                <MiniBtn onClick={() => setConfirmClear(false)}>Cancel</MiniBtn>
              </>
            ) : null}
          </div>
        }
      />
      {feedback ? (
        <p className="border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
          {feedback}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects"
          className="w-full max-w-xs border border-line bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="border border-line bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent"
        >
          {industryNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-line bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent"
        >
          {["All", ...Array.from(new Set(projects.map((p) => p.category)))].map((category) => (
            <option key={category} value={category}>
              {category === "All" ? "All categories" : category}
            </option>
          ))}
        </select>
      </div>

      {editing ? (
        <Panel title={projects.some((p) => p.id === editing.id) ? "Edit project" : "New project"}>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              label="Title"
              value={editing.title}
              onChange={(v) => setEditing({ ...editing, title: v })}
            />
            <SelectField
              label="Industry"
              value={editing.industry}
              options={industryNames.filter((n) => n !== "All")}
              onChange={(v) => setEditing({ ...editing, industry: v })}
            />
            <TextField
              label="Category"
              value={editing.category}
              onChange={(v) => setEditing({ ...editing, category: v })}
            />
            <label className="block">
              <span className="tech-label text-muted">Image</span>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="border border-accent bg-accent/10 px-3.5 py-2.5 text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-accent transition-colors hover:bg-accent hover:text-navy disabled:cursor-wait disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Upload image"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={uploadProjectImage}
                  className="hidden"
                />
                {editing.image ? (
                  <img
                    src={editing.image}
                    alt="Selected project"
                    className="h-12 w-20 object-cover"
                  />
                ) : null}
              </div>
            </label>
            <div className="sm:col-span-2">
              <TextField
                label="Short description"
                value={editing.short}
                onChange={(v) => setEditing({ ...editing, short: v })}
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                label="Overview"
                value={editing.overview}
                onChange={(v) => setEditing({ ...editing, overview: v })}
                rows={4}
              />
            </div>
            <TextField
              label="Challenge"
              value={editing.challenge}
              onChange={(v) => setEditing({ ...editing, challenge: v })}
              rows={4}
            />
            <TextField
              label="Solution"
              value={editing.solution}
              onChange={(v) => setEditing({ ...editing, solution: v })}
              rows={4}
            />
            <div className="sm:col-span-2">
              <TextField
                label="Application"
                value={editing.application}
                onChange={(v) => setEditing({ ...editing, application: v })}
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                label="Technical highlights (one per line)"
                value={editing.highlights.join("\n")}
                onChange={(v) =>
                  setEditing({
                    ...editing,
                    highlights: v.split("\n").filter((s) => s.trim() !== ""),
                  })
                }
                rows={4}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                label="Specifications (one per line, as Label: Value)"
                value={editing.specs.map((s) => `${s.label}: ${s.value}`).join("\n")}
                onChange={(v) =>
                  setEditing({
                    ...editing,
                    specs: v
                      .split("\n")
                      .filter((s) => s.trim() !== "")
                      .map((line) => {
                        const [label, ...rest] = line.split(":");
                        return { label: (label ?? "").trim(), value: rest.join(":").trim() };
                      }),
                  })
                }
                rows={5}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Toggle
              label="Featured"
              checked={editing.featured}
              onChange={(v) => setEditing({ ...editing, featured: v })}
            />
            <MiniBtn
              tone="accent"
              onClick={() => save().catch((error) => setFeedback(error.message))}
            >
              Save project
            </MiniBtn>
            <MiniBtn onClick={() => setEditing(null)}>Cancel</MiniBtn>
          </div>
        </Panel>
      ) : null}

      <div className="border border-line bg-surface">
        {filtered.length === 0 ? (
          <p className="px-6 py-14 text-center text-sm text-muted">
            No projects match this filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  {["Project", "Industry", "Category", "Featured", ""].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-b-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={p.image}
                          alt=""
                          className="h-12 w-16 object-cover"
                          loading="lazy"
                        />
                        <span className="text-sm font-medium text-foreground">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{p.industry}</td>
                    <td className="px-6 py-4 text-sm text-muted">{p.category}</td>
                    <td className="px-6 py-4">
                      <Toggle
                        label={p.featured ? "Yes" : "No"}
                        checked={p.featured}
                        onChange={(v) =>
                          toggleFeatured(p, v).catch((error) => setFeedback(error.message))
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <MiniBtn onClick={() => setViewing(p)}>View</MiniBtn>
                        <MiniBtn onClick={() => setEditing(p)}>Edit</MiniBtn>
                        {confirmDelete === p.id ? (
                          <>
                            <MiniBtn tone="danger" onClick={() => remove(p.id)}>
                              Confirm
                            </MiniBtn>
                            <MiniBtn onClick={() => setConfirmDelete(null)}>Cancel</MiniBtn>
                          </>
                        ) : (
                          <MiniBtn tone="danger" onClick={() => setConfirmDelete(p.id)}>
                            Delete
                          </MiniBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {viewing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-line bg-surface p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="tech-label text-accent">Project detail</span>
                <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
                  {viewing.title}
                </h2>
              </div>
              <MiniBtn onClick={() => setViewing(null)}>Close</MiniBtn>
            </div>
            <img src={viewing.image} alt="" className="mt-6 h-48 w-full object-cover" />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {viewing.overview || viewing.short}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="tech-label text-muted">Industry</span>
                <p className="mt-1 text-sm text-foreground">{viewing.industry}</p>
              </div>
              <div>
                <span className="tech-label text-muted">Category</span>
                <p className="mt-1 text-sm text-foreground">{viewing.category}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
