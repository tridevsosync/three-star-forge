"use client";

import { useState } from "react";
import {
  AdminHead,
  MiniBtn,
  Panel,
  SelectField,
  TextField,
  Toggle,
} from "@/components/site/admin-ui";
import { IMAGES } from "@/data/images";
import { GALLERY_CATEGORIES } from "@/data/site";
import { useSite } from "@/store/site-store";

const IMAGE_OPTIONS = Object.entries(IMAGES).map(([key, url]) => ({ key, url: url }));
const CATEGORIES = GALLERY_CATEGORIES.filter((c) => c !== "All");

export default function AdminGalleryPage() {
  const { gallery, update, usedImages } = useSite();
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const items = gallery.filter((g) => filter === "All" || g.category === filter);
  const save = () => {
    if (!editing) return;
    const exists = gallery.some((g) => g.id === editing.id);
    update(
      "gallery",
      exists ? gallery.map((g) => (g.id === editing.id ? editing : g)) : [editing, ...gallery],
    );
    setEditing(null);
  };
  const inUseElsewhere = (url) => usedImages.includes(url) && editing?.image !== url;
  return (
    <div className="space-y-8">
      <AdminHead
        title="Gallery"
        intro="Manage gallery items. Images already assigned to a project, industry or another gallery item are flagged so nothing is duplicated."
        action={
          <MiniBtn
            tone="accent"
            onClick={() =>
              setEditing({
                id: `g-${Date.now()}`,
                title: "New gallery item",
                category: CATEGORIES[0] ?? "Projects",
                image: IMAGE_OPTIONS[0].url,
                featured: false,
              })
            }
          >
            Add image
          </MiniBtn>
        }
      />

      <div className="flex flex-wrap gap-2">
        {GALLERY_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`border px-4 py-2 text-[0.7rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${
              filter === c
                ? "border-accent bg-accent/10 text-accent"
                : "border-line text-muted hover:border-line-strong"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {editing ? (
        <Panel
          title={
            gallery.some((g) => g.id === editing.id) ? "Edit gallery item" : "New gallery item"
          }
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              label="Title"
              value={editing.title}
              onChange={(v) => setEditing({ ...editing, title: v })}
            />
            <SelectField
              label="Category"
              value={editing.category}
              options={CATEGORIES}
              onChange={(v) => setEditing({ ...editing, category: v })}
            />
            <label className="block sm:col-span-2">
              <span className="tech-label text-muted">Image</span>
              <select
                value={editing.image}
                onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                className="mt-2 w-full border border-line bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent"
              >
                {IMAGE_OPTIONS.map((o) => (
                  <option key={o.key} value={o.url}>
                    {o.key}
                    {inUseElsewhere(o.url) ? " — already in use" : ""}
                  </option>
                ))}
              </select>
              {inUseElsewhere(editing.image) ? (
                <span className="mt-2 block text-xs text-danger">
                  This image is already used elsewhere — choose a unique one.
                </span>
              ) : null}
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Toggle
              label="Featured"
              checked={editing.featured}
              onChange={(v) => setEditing({ ...editing, featured: v })}
            />
            <MiniBtn tone="accent" onClick={save}>
              Save item
            </MiniBtn>
            <MiniBtn onClick={() => setEditing(null)}>Cancel</MiniBtn>
          </div>
        </Panel>
      ) : null}

      {items.length === 0 ? (
        <p className="border border-line bg-surface px-6 py-14 text-center text-sm text-muted">
          No gallery items in this category.
        </p>
      ) : (
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <div key={g.id} className="bg-surface">
              <img
                src={g.image}
                alt={g.title}
                className="h-44 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <span className="tech-label text-muted">{g.category}</span>
                <p className="mt-2 text-sm font-medium text-foreground">{g.title}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Toggle
                    label={g.featured ? "Featured" : "Standard"}
                    checked={g.featured}
                    onChange={(v) =>
                      update(
                        "gallery",
                        gallery.map((x) => (x.id === g.id ? { ...x, featured: v } : x)),
                      )
                    }
                  />
                  <MiniBtn onClick={() => setEditing(g)}>Edit</MiniBtn>
                  {confirmDelete === g.id ? (
                    <>
                      <MiniBtn
                        tone="danger"
                        onClick={() => {
                          update(
                            "gallery",
                            gallery.filter((x) => x.id !== g.id),
                          );
                          setConfirmDelete(null);
                        }}
                      >
                        Confirm
                      </MiniBtn>
                      <MiniBtn onClick={() => setConfirmDelete(null)}>Cancel</MiniBtn>
                    </>
                  ) : (
                    <MiniBtn tone="danger" onClick={() => setConfirmDelete(g.id)}>
                      Delete
                    </MiniBtn>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
