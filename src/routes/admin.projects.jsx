import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AdminHead,
  MiniBtn,
  Panel,
  SelectField,
  TextField,
  Toggle,
} from "@/components/site/admin-ui";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
export const Route = createFileRoute("/admin/projects")({
  component: AdminProjects,
});
const IMAGE_OPTIONS = Object.entries(IMAGES).map(([key, url]) => ({ key, url: url }));
function emptyProject() {
  return {
    id: `p-${Date.now()}`,
    title: "New project",
    industry: "Engineering Equipment",
    category: "Engineering",
    image: IMAGE_OPTIONS[0].url,
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
function AdminProjects() {
  const { projects, industries, update, usedImages } = useSite();
  const [query, setQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
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
      (p.title + p.category).toLowerCase().includes(query.toLowerCase()),
  );
  const save = () => {
    if (!editing) return;
    const exists = projects.some((p) => p.id === editing.id);
    update(
      "projects",
      exists ? projects.map((p) => (p.id === editing.id ? editing : p)) : [editing, ...projects],
    );
    setEditing(null);
  };
  const remove = (id) => {
    update(
      "projects",
      projects.filter((p) => p.id !== id),
    );
    setConfirmDelete(null);
  };
  const imageInUseElsewhere = (url) =>
    usedImages.filter((u) => u === url).length > 0 && editing?.image !== url;
  return (
    <div className="space-y-8">
      <AdminHead
        title="Projects"
        intro="Add, edit and remove portfolio projects. Every project should use an image that is not already assigned elsewhere."
        action={
          <MiniBtn tone="accent" onClick={() => setEditing(emptyProject())}>
            Add project
          </MiniBtn>
        }
      />

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
              <select
                value={editing.image}
                onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                className="mt-2 w-full border border-line bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent"
              >
                {IMAGE_OPTIONS.map((o) => (
                  <option key={o.key} value={o.url}>
                    {o.key}
                    {imageInUseElsewhere(o.url) ? " — already in use" : ""}
                  </option>
                ))}
              </select>
              {imageInUseElsewhere(editing.image) ? (
                <span className="mt-2 block text-xs text-danger">
                  This image is already assigned elsewhere — pick a unique one.
                </span>
              ) : null}
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
            <MiniBtn tone="accent" onClick={save}>
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
                          update(
                            "projects",
                            projects.map((x) => (x.id === p.id ? { ...x, featured: v } : x)),
                          )
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
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
    </div>
  );
}
