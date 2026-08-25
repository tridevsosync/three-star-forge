"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { AdminHead, MiniBtn, Panel, TextField, Toggle } from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";

export default function AdminContentPage() {
  const { company, home, services, industries, faqs, testimonials, update } = useSite();
  const [saved, setSaved] = useState(null);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);
  const [draftSection, setDraftSection] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [confirmClear, setConfirmClear] = useState(null);
  const setCompany = (key, value) => update("company", { ...company, [key]: value });
  const setHome = (key, value) => update("home", { ...home, [key]: value });
  const flash = (msg) => {
    setSaved(msg);
    window.setTimeout(() => setSaved(null), 2200);
  };
  const saveSingle = async (section, value) => {
    const res = await fetch(`/api/content/${section}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
    update(section, data.data);
    flash(`${section === "home" ? "Homepage" : "Company"} saved`);
  };
  const listSections = [
    {
      key: "services",
      label: "Services",
      fields: [
        { key: "code", label: "Code" },
        { key: "title", label: "Title" },
        { key: "summary", label: "Summary", rows: 3 },
        { key: "outcome", label: "Outcome", rows: 3 },
        { key: "points", label: "Service points (one per line)", rows: 4, array: true },
      ],
    },
    {
      key: "industries",
      label: "Industries",
      fields: [
        { key: "name", label: "Name" },
        { key: "image", label: "Image URL" },
        { key: "description", label: "Description", rows: 3 },
        { key: "capabilities", label: "Capabilities (one per line)", rows: 4, array: true },
      ],
    },
    {
      key: "faqs",
      label: "FAQs",
      fields: [
        { key: "question", label: "Question" },
        { key: "answer", label: "Answer", rows: 4 },
      ],
    },
    {
      key: "testimonials",
      label: "Testimonials",
      fields: [
        { key: "author", label: "Author" },
        { key: "role", label: "Role" },
        { key: "quote", label: "Quote", rows: 4 },
      ],
      enabled: true,
    },
  ];
  const values = { services, industries, faqs, testimonials };
  const createItem = (section, fields, hasEnabled) => {
    setDraftSection(section);
    setDraft({
      ...Object.fromEntries(fields.map((field) => [field.key, field.array ? "" : ""])),
      ...(hasEnabled ? { enabled: true } : {}),
    });
  };
  const saveItem = async (section) => {
    const editingId = editing?.id;
    const url = editingId ? `/api/content/${section}/${editingId}` : `/api/content/${section}`;
    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
    const savedItem = data.data;
    update(
      section,
      editingId
        ? values[section].map((item) => (item.id === editingId ? savedItem : item))
        : [...values[section], savedItem],
    );
    setDraft(null);
    setEditing(null);
    setDraftSection(null);
    flash(`${section} saved`);
  };
  const deleteItem = async (section, id) => {
    if (!window.confirm("Delete this content item?")) return;
    const res = await fetch(`/api/content/${section}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");
    update(
      section,
      values[section].filter((item) => item.id !== id),
    );
    flash(`${section} item deleted`);
  };
  const clearSection = async (section) => {
    const res = await fetch(`/api/content/${section}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");
    update(section, []);
    setConfirmClear(null);
    setDraft(null);
    setEditing(null);
    setDraftSection(null);
    flash(`${data.deletedCount || 0} ${section} items removed`);
  };
  return (
    <div className="space-y-10">
      <AdminHead
        title="Company & homepage content"
        intro="Edit the details used across the public site. Changes are saved to MongoDB."
        action={
          saved ? (
            <span className="border border-accent bg-accent/10 px-4 py-2 text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-accent">
              {saved}
            </span>
          ) : null
        }
      />

      <Panel title="Company information">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Company name"
            value={company.name}
            onChange={(v) => setCompany("name", v)}
          />
          <TextField
            label="Contact person"
            value={company.contactPerson}
            onChange={(v) => setCompany("contactPerson", v)}
          />
          <TextField label="Phone" value={company.phone} onChange={(v) => setCompany("phone", v)} />
          <TextField label="Email" value={company.email} onChange={(v) => setCompany("email", v)} />
          <TextField
            label="Website"
            value={company.website}
            onChange={(v) => setCompany("website", v)}
          />
          <TextField
            label="Address"
            value={company.address}
            onChange={(v) => setCompany("address", v)}
            rows={3}
          />
          <div className="sm:col-span-2">
            <TextField
              label="Description"
              value={company.description}
              onChange={(v) => setCompany("description", v)}
              rows={5}
            />
          </div>
          <TextField
            label="Vision"
            value={company.vision}
            onChange={(v) => setCompany("vision", v)}
            rows={3}
          />
          <TextField
            label="Mission"
            value={company.mission}
            onChange={(v) => setCompany("mission", v)}
            rows={3}
          />
          <div className="sm:col-span-2">
            <TextField
              label="Positioning"
              value={company.positioning}
              onChange={(v) => setCompany("positioning", v)}
              rows={3}
            />
          </div>
        </div>
        <div className="mt-6">
          <MiniBtn
            tone="accent"
            onClick={() => saveSingle("company", company).catch((error) => flash(error.message))}
          >
            Save company details
          </MiniBtn>
        </div>
      </Panel>

      <Panel title="Homepage content">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Eyebrow" value={home.eyebrow} onChange={(v) => setHome("eyebrow", v)} />
          <TextField
            label="Hero title"
            value={home.heroTitle}
            onChange={(v) => setHome("heroTitle", v)}
          />
          <div className="sm:col-span-2">
            <TextField
              label="Hero subtitle"
              value={home.heroSubtitle}
              onChange={(v) => setHome("heroSubtitle", v)}
              rows={3}
            />
          </div>
          <TextField
            label="Primary CTA"
            value={home.primaryCta}
            onChange={(v) => setHome("primaryCta", v)}
          />
          <TextField
            label="Secondary CTA"
            value={home.secondaryCta}
            onChange={(v) => setHome("secondaryCta", v)}
          />
          <div className="sm:col-span-2">
            <TextField
              label="About heading"
              value={home.aboutHeading}
              onChange={(v) => setHome("aboutHeading", v)}
              rows={2}
            />
          </div>
          <div className="sm:col-span-2">
            <TextField
              label="Closing CTA heading"
              value={home.ctaHeading}
              onChange={(v) => setHome("ctaHeading", v)}
              rows={2}
            />
          </div>
          <TextField
            label="Closing CTA button"
            value={home.ctaButton}
            onChange={(v) => setHome("ctaButton", v)}
          />
          <TextField
            label="Clients heading"
            value={home.clientsHeading}
            onChange={(v) => setHome("clientsHeading", v)}
          />
        </div>
        <div className="mt-6">
          <MiniBtn
            tone="accent"
            onClick={() => saveSingle("home", home).catch((error) => flash(error.message))}
          >
            Save homepage copy
          </MiniBtn>
        </div>
      </Panel>

      {listSections.map(({ key, label, fields, enabled }) => (
        <Panel key={key} title={label}>
          <div className="mb-5 flex justify-end">
            <div className="flex flex-wrap gap-2">
              <MiniBtn
                tone="accent"
                onClick={() => {
                  setEditing(null);
                  createItem(key, fields, enabled);
                }}
              >
                Add {label.slice(0, -1)}
              </MiniBtn>
              {values[key].length > 0 && confirmClear !== key ? (
                <MiniBtn tone="danger" onClick={() => setConfirmClear(key)}>
                  Remove all
                </MiniBtn>
              ) : null}
              {confirmClear === key ? (
                <>
                  <MiniBtn
                    tone="danger"
                    onClick={() => clearSection(key).catch((error) => flash(error.message))}
                  >
                    Confirm remove all
                  </MiniBtn>
                  <MiniBtn onClick={() => setConfirmClear(null)}>Cancel</MiniBtn>
                </>
              ) : null}
            </div>
          </div>
          {draft && draftSection === key ? (
            <div className="mb-6 grid gap-4 border border-line bg-background p-5 sm:grid-cols-2">
              {fields.map((field) => (
                <TextField
                  key={field.key}
                  label={field.label}
                  value={field.array ? (draft[field.key] || []).join("\n") : draft[field.key] || ""}
                  onChange={(value) =>
                    setDraft({
                      ...draft,
                      [field.key]: field.array
                        ? value.split("\n").filter((item) => item.trim())
                        : value,
                    })
                  }
                  rows={field.rows}
                />
              ))}
              {enabled ? (
                <Toggle
                  label="Published"
                  checked={draft.enabled !== false}
                  onChange={(value) => setDraft({ ...draft, enabled: value })}
                />
              ) : null}
              <div className="flex gap-2 sm:col-span-2">
                <MiniBtn
                  tone="accent"
                  onClick={() => saveItem(key).catch((error) => flash(error.message))}
                >
                  Save
                </MiniBtn>
                <MiniBtn
                  onClick={() => {
                    setDraft(null);
                    setEditing(null);
                    setDraftSection(null);
                  }}
                >
                  Cancel
                </MiniBtn>
              </div>
            </div>
          ) : null}
          <div className="divide-y divide-line border border-line">
            {values[key].map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {item.title || item.name || item.question || item.author}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {item.summary || item.description || item.answer || item.quote || item.role}
                  </p>
                </div>
                <div className="flex gap-2">
                  <MiniBtn onClick={() => setViewing(item)}>
                    <Eye size={14} aria-hidden="true" /> View
                  </MiniBtn>
                  <MiniBtn
                    onClick={() => {
                      setEditing({ ...item, section: key });
                      setDraftSection(key);
                      setDraft({
                        ...Object.fromEntries(
                          fields.map((field) => [
                            field.key,
                            field.array ? item[field.key] || [] : item[field.key] || "",
                          ]),
                        ),
                        ...(enabled ? { enabled: item.enabled !== false } : {}),
                      });
                    }}
                  >
                    Edit
                  </MiniBtn>
                  <MiniBtn
                    tone="danger"
                    onClick={() => deleteItem(key, item.id).catch((error) => flash(error.message))}
                  >
                    Delete
                  </MiniBtn>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ))}
      {viewing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[80vh] w-full max-w-xl overflow-y-auto border border-line bg-surface p-6">
            <div className="flex justify-between gap-4">
              <h2 className="font-display text-xl font-bold text-foreground">Content detail</h2>
              <MiniBtn onClick={() => setViewing(null)}>Close</MiniBtn>
            </div>
            <pre className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-muted">
              {JSON.stringify(viewing, null, 2)}
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
