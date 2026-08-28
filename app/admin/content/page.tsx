"use client";

import { useState, useRef } from "react";
import {
  AdminHead,
  MiniBtn,
  Panel,
  TextField,
  Toggle,
  EmptyState,
  AdminModal,
  ConfirmDeleteModal,
} from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";
import {
  Building2,
  Home,
  Wrench,
  Factory,
  HelpCircle,
  MessageSquareQuote,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  RotateCw,
  ExternalLink,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminContentPage() {
  const { company, home, services, industries, faqs, testimonials, update, fetchContent, uploadToCloudinary } = useSite();
  const [activeTab, setActiveTab] = useState("company"); // 'company' | 'home' | 'services' | 'industries' | 'faqs' | 'testimonials'
  const [saved, setSaved] = useState(null);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);
  const [draftSection, setDraftSection] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null); // { section, item }
  const [confirmClear, setConfirmClear] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const setCompany = (key, value) => update("company", { ...company, [key]: value });
  const setHome = (key, value) => update("home", { ...home, [key]: value });

  const flash = (msg) => {
    setSaved(msg);
    setTimeout(() => setSaved(null), 3000);
  };

  const saveSingle = async (section, value) => {
    setSavingSection(true);
    try {
      const res = await fetch(`/api/content/${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
      update(section, data.data);
      flash(`✓ ${section === "home" ? "Homepage Copy" : "Company Profile"} synchronized to MongoDB`);
    } catch (err) {
      flash("Error saving: " + err.message);
    } finally {
      setSavingSection(false);
    }
  };

  const listSections = [
    {
      key: "services",
      label: "Engineering Services",
      singular: "Service",
      icon: Wrench,
      fields: [
        { key: "code", label: "Service Code", placeholder: "e.g. SRV-01" },
        { key: "title", label: "Service Title", placeholder: "e.g. Induction Hardening Systems" },
        { key: "summary", label: "Technical Summary", rows: 3, placeholder: "Overview of service..." },
        { key: "outcome", label: "Delivered Outcome", rows: 2, placeholder: "Measurable client result..." },
        { key: "points", label: "Service Points (one per line)", rows: 4, array: true, placeholder: "Key feature 1\nKey feature 2" },
      ],
    },
    {
      key: "industries",
      label: "Target Industries",
      singular: "Industry",
      icon: Factory,
      fields: [
        { key: "name", label: "Industry Sector Name", placeholder: "e.g. Automotive & Transmission" },
        { key: "image", label: "Cover Image URL", placeholder: "https://..." },
        { key: "description", label: "Sector Description", rows: 3, placeholder: "Sector scope..." },
        { key: "capabilities", label: "Engineering Capabilities (one per line)", rows: 4, array: true, placeholder: "Capability 1\nCapability 2" },
      ],
    },
    {
      key: "faqs",
      label: "Technical FAQs",
      singular: "FAQ",
      icon: HelpCircle,
      fields: [
        { key: "question", label: "Question", placeholder: "e.g. What is the typical hardening depth tolerance?" },
        { key: "answer", label: "Detailed Answer", rows: 4, placeholder: "Detailed technical answer..." },
      ],
    },
    {
      key: "testimonials",
      label: "Client Testimonials",
      singular: "Testimonial",
      icon: MessageSquareQuote,
      fields: [
        { key: "author", label: "Client Name", placeholder: "e.g. Rajesh Sharma" },
        { key: "role", label: "Designation & Company", placeholder: "e.g. Head of Plant Operations, Automech Corp" },
        { key: "quote", label: "Testimonial Quote", rows: 4, placeholder: "Client feedback quote..." },
      ],
      enabled: true,
    },
  ];

  const values = { services, industries, faqs, testimonials };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, keyName: string = "image") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadToCloudinary(file, "content");
      if (!res.success || !res.url) throw new Error(res.error || "Upload failed");
      setDraft((prev: any) => ({ ...prev, [keyName]: res.url }));
      flash("✓ Image uploaded successfully to Cloudinary");
    } catch (err: any) {
      flash("Upload error: " + err.message);
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const createItem = (section, fields, hasEnabled) => {
    setDraftSection(section);
    setEditing(null);
    setDraft({
      ...Object.fromEntries(fields.map((field) => [field.key, field.array ? [] : ""])),
      ...(hasEnabled ? { enabled: true } : {}),
    });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const startEditItem = (key, item, fields, enabled) => {
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
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const saveItem = async (section) => {
    const editingId = editing?.id || editing?._id;
    const itemPayload = {
      ...draft,
      id: editingId || draft.id || `${section}-${Date.now()}`,
    };
    const url = editingId ? `/api/content/${section}/${encodeURIComponent(editingId)}` : `/api/content/${section}`;
    try {
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemPayload),
      });
      const data = await res.json().catch(() => ({}));
      const savedItem = data?.data || itemPayload;
      update(
        section,
        editingId
          ? values[section].map((item) =>
              item.id === editingId || item._id === editingId ? savedItem : item,
            )
          : [...values[section], savedItem],
      );
      setDraft(null);
      setEditing(null);
      setDraftSection(null);
      flash(`✓ Saved ${section} item to database`);
    } catch (err) {
      flash("Error saving item: " + err.message);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    const { section, item } = deletingItem;
    const itemId = item.id || item._id || item.name || item.title || item.question || item.author;
    try {
      update(
        section,
        values[section].filter((i) => {
          if (item.id && (i.id === item.id || i._id === item.id)) return false;
          if (item._id && (i.id === item._id || i._id === item._id)) return false;
          if (item.name && i.name === item.name) return false;
          if (item.title && i.title === item.title) return false;
          if (item.question && i.question === item.question) return false;
          if (item.author && i.author === item.author) return false;
          if (itemId && (i.id === itemId || i._id === itemId)) return false;
          return true;
        }),
      );
      if (viewing) {
        setViewing(null);
      }
      setDeletingItem(null);
      flash(`✓ Deleted item from ${section}`);
      if (itemId) {
        await fetch(`/api/content/${section}/${encodeURIComponent(itemId)}`, { method: "DELETE" });
      }
    } catch {
      /* ignore */
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearSection = async () => {
    if (!confirmClear) return;
    setIsDeleting(true);
    const section = confirmClear;
    try {
      update(section, []);
      setConfirmClear(null);
      setDraft(null);
      setEditing(null);
      setDraftSection(null);
      if (viewing && viewing.sectionKey === section) {
        setViewing(null);
      }
      flash(`✓ Cleared all items from ${section}`);
      await fetch(`/api/content/${section}`, { method: "DELETE" });
    } catch {
      /* ignore */
    } finally {
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: "company", label: "Company Profile", icon: Building2 },
    { id: "home", label: "Homepage & CTAs", icon: Home },
    { id: "services", label: `Services (${services.length})`, icon: Wrench },
    { id: "industries", label: `Industries (${industries.length})`, icon: Factory },
    { id: "faqs", label: `FAQs (${faqs.length})`, icon: HelpCircle },
    { id: "testimonials", label: `Testimonials (${testimonials.length})`, icon: MessageSquareQuote },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <AdminHead
        title="Enterprise CMS & Copy Studio"
        eyebrow="Master Content"
        intro="Manage brand narratives, homepage conversion copy, technical services, industry sector capabilities, FAQs, and client reviews."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {saved && (
              <span className="border border-accent bg-accent/15 px-3 py-1.5 font-mono text-xs font-semibold text-accent animate-pulse shadow-sm">
                {saved}
              </span>
            )}
            <MiniBtn onClick={fetchContent}>
              <RotateCw className="h-3.5 w-3.5" />
              <span>Refresh CMS</span>
            </MiniBtn>
          </div>
        }
      />

      {/* Section Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-px">
        {tabs.map((tb) => {
          const Icon = tb.icon;
          const active = activeTab === tb.id;
          return (
            <button
              key={tb.id}
              type="button"
              onClick={() => {
                setActiveTab(tb.id);
                setDraft(null);
                setEditing(null);
              }}
              className={`inline-flex items-center gap-2 border px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                active
                  ? "border-accent bg-accent text-navy font-bold shadow-sm"
                  : "border-line bg-surface text-muted hover:border-line-strong hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-navy" : "text-accent"}`} />
              <span>{tb.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Company Profile */}
      {activeTab === "company" && (
        <Panel
          title="Company Master Profile & Legal Metadata"
          action={
            <MiniBtn
              tone="primary"
              disabled={savingSection}
              onClick={() => saveSingle("company", company)}
            >
              <Save className="h-3.5 w-3.5" />
              <span>{savingSection ? "Saving..." : "Save Company Details"}</span>
            </MiniBtn>
          }
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              label="Company Name"
              value={company.name}
              onChange={(v) => setCompany("name", v)}
              placeholder="Three Star Enterprises"
              required
            />
            <TextField
              label="Primary Contact Person"
              value={company.contactPerson}
              onChange={(v) => setCompany("contactPerson", v)}
              placeholder="e.g. Technical Director / Managing Partner"
            />
            <TextField
              label="Direct Phone / WhatsApp"
              value={company.phone}
              onChange={(v) => setCompany("phone", v)}
              placeholder="+91 98765 43210"
            />
            <TextField
              label="Official Email"
              value={company.email}
              onChange={(v) => setCompany("email", v)}
              placeholder="sales@threestarenterprises.com"
            />
            <TextField
              label="Official Website"
              value={company.website}
              onChange={(v) => setCompany("website", v)}
              placeholder="https://threestarenterprises.com"
            />
            <div className="sm:col-span-2">
              <TextField
                label="Manufacturing Facility Address"
                value={company.address}
                onChange={(v) => setCompany("address", v)}
                rows={2}
                placeholder="Plot No., Industrial Area..."
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                label="Company Profile & Core Precision Capabilities"
                value={company.description}
                onChange={(v) => setCompany("description", v)}
                rows={4}
                placeholder="Industrial machinery engineering company..."
              />
            </div>
            <TextField
              label="Vision Statement"
              value={company.vision}
              onChange={(v) => setCompany("vision", v)}
              rows={3}
              placeholder="To be the benchmark in custom induction hardening..."
            />
            <TextField
              label="Mission Statement"
              value={company.mission}
              onChange={(v) => setCompany("mission", v)}
              rows={3}
              placeholder="Deliver defect-free custom machine systems..."
            />
            <div className="sm:col-span-2">
              <TextField
                label="Market Positioning"
                value={company.positioning}
                onChange={(v) => setCompany("positioning", v)}
                rows={2}
                placeholder="Tier-1 Special Purpose Machine Manufacturer..."
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-line pt-5">
            <MiniBtn
              tone="primary"
              disabled={savingSection}
              onClick={() => saveSingle("company", company)}
            >
              <Save className="h-3.5 w-3.5" />
              <span>{savingSection ? "Saving..." : "Save Company Details"}</span>
            </MiniBtn>
          </div>
        </Panel>
      )}

      {/* Tab 2: Homepage & Conversion Copy */}
      {activeTab === "home" && (
        <Panel
          title="Homepage Hero, Headings & Call-to-Actions"
          action={
            <MiniBtn
              tone="primary"
              disabled={savingSection}
              onClick={() => saveSingle("home", home)}
            >
              <Save className="h-3.5 w-3.5" />
              <span>{savingSection ? "Saving..." : "Save Homepage Copy"}</span>
            </MiniBtn>
          }
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              label="Hero Eyebrow Tag"
              value={home.eyebrow}
              onChange={(v) => setHome("eyebrow", v)}
              placeholder="Precision Engineering & Induction Systems"
            />
            <TextField
              label="Hero Master Headline"
              value={home.heroTitle}
              onChange={(v) => setHome("heroTitle", v)}
              placeholder="Bespoke Industrial Machinery Built for High-Tolerance Manufacturing"
            />
            <div className="sm:col-span-2">
              <TextField
                label="Hero Subtitle Narrative"
                value={home.heroSubtitle}
                onChange={(v) => setHome("heroSubtitle", v)}
                rows={3}
                placeholder="From vertical scanning induction hardening cells to automated material handling..."
              />
            </div>
            <TextField
              label="Primary CTA Button Label"
              value={home.primaryCta}
              onChange={(v) => setHome("primaryCta", v)}
              placeholder="Request Engineering Quote"
            />
            <TextField
              label="Secondary CTA Button Label"
              value={home.secondaryCta}
              onChange={(v) => setHome("secondaryCta", v)}
              placeholder="Explore Machine Portfolio"
            />
            <div className="sm:col-span-2">
              <TextField
                label="About Section Heading"
                value={home.aboutHeading}
                onChange={(v) => setHome("aboutHeading", v)}
                placeholder="Over Three Decades of Heavy Engineering Precision"
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                label="Closing CTA Banner Heading"
                value={home.ctaHeading}
                onChange={(v) => setHome("ctaHeading", v)}
                placeholder="Have a Custom Tooling or Machine Specification in Mind?"
              />
            </div>
            <TextField
              label="Closing CTA Button Label"
              value={home.ctaButton}
              onChange={(v) => setHome("ctaButton", v)}
              placeholder="Contact Our Engineering Desk"
            />
            <TextField
              label="Client Partners Section Heading"
              value={home.clientsHeading}
              onChange={(v) => setHome("clientsHeading", v)}
              placeholder="Trusted by Tier-1 Automotive & Industrial Leaders"
            />
          </div>

          <div className="mt-8 flex justify-end border-t border-line pt-5">
            <MiniBtn
              tone="primary"
              disabled={savingSection}
              onClick={() => saveSingle("home", home)}
            >
              <Save className="h-3.5 w-3.5" />
              <span>{savingSection ? "Saving..." : "Save Homepage Copy"}</span>
            </MiniBtn>
          </div>
        </Panel>
      )}

      {/* Tab 3-6: Dynamic List Sections (Services, Industries, FAQs, Testimonials) */}
      {listSections
        .filter((sec) => activeTab === sec.key)
        .map(({ key, label, singular, fields, enabled }) => (
          <Panel
            key={key}
            title={label}
            action={
              <div className="flex flex-wrap items-center gap-2">
                <MiniBtn
                  tone="primary"
                  onClick={() => {
                    setEditing(null);
                    createItem(key, fields, enabled);
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New {singular}</span>
                </MiniBtn>
                {values[key].length > 0 && (
                  <MiniBtn tone="danger" onClick={() => setConfirmClear(key)}>
                    Clear All ({values[key].length})
                  </MiniBtn>
                )}
              </div>
            }
          >
            {/* Draft Form Builder */}
            {draft && draftSection === key ? (
              <div ref={formRef} className="mb-8 border border-accent bg-background p-6 shadow-md scroll-mt-6">
                <div className="flex items-center justify-between border-b border-line pb-3 mb-5">
                  <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                    {editing ? `Edit ${singular}: "${draft.title || draft.name || draft.question || draft.author || "Item"}"` : `New ${singular} Entry`}
                  </span>
                  <span className="font-mono text-[0.65rem] text-muted uppercase">Interactive Editor</span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {fields.map((field) =>
                    field.key === "image" ? (
                      <div key={field.key} className="sm:col-span-2">
                        <span className="tech-label text-muted text-xs block mb-2">{field.label}</span>
                        <div className="flex flex-wrap items-start gap-4 border border-line bg-surface p-4">
                          {draft[field.key] ? (
                            <div className="relative h-24 w-36 shrink-0 overflow-hidden border border-line bg-navy">
                              <img
                                src={draft[field.key]}
                                alt="Preview"
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setDraft({ ...draft, [field.key]: "" })}
                                className="absolute top-1 right-1 bg-danger text-white p-1 text-xs hover:opacity-90 transition-opacity"
                                title="Remove image"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex h-24 w-36 shrink-0 items-center justify-center border border-dashed border-line bg-background text-muted text-xs font-mono">
                              No Image Set
                            </div>
                          )}

                          <div className="flex-1 min-w-[240px] space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                disabled={uploadingImage}
                                className="border border-accent bg-accent/15 px-3 py-1.5 font-mono text-xs font-bold text-accent uppercase tracking-wider hover:bg-accent hover:text-navy transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                              >
                                <Upload className="h-3.5 w-3.5" />
                                <span>{uploadingImage ? "Uploading to Cloudinary..." : "Upload Image File"}</span>
                              </button>
                              {draft[field.key] && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDraft({ ...draft, [field.key]: "" });
                                    if (imageInputRef.current) imageInputRef.current.value = "";
                                  }}
                                  className="border border-danger/40 bg-danger/10 px-3 py-1.5 font-mono text-xs font-bold text-danger uppercase tracking-wider hover:bg-danger hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                                  title="Clear attached image"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Remove Image</span>
                                </button>
                              )}
                              <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, field.key)}
                                className="hidden"
                              />
                              <span className="text-[0.68rem] font-mono text-muted">Supports Cloudinary CDN upload</span>
                            </div>
                            <TextField
                              label="Or Direct Image URL"
                              placeholder={field.placeholder || "https://..."}
                              value={draft[field.key] || ""}
                              onChange={(value) => setDraft({ ...draft, [field.key]: value })}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={field.key}
                        className={field.rows && field.rows >= 3 ? "sm:col-span-2" : ""}
                      >
                        <TextField
                          label={field.label}
                          placeholder={field.placeholder}
                          value={
                            field.array
                              ? (draft[field.key] || []).join("\n")
                              : draft[field.key] || ""
                          }
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
                      </div>
                    ),
                  )}

                  {enabled ? (
                    <div className="sm:col-span-2">
                      <Toggle
                        label="Published & Visible to Public"
                        checked={draft.enabled !== false}
                        onChange={(value) => setDraft({ ...draft, enabled: value })}
                      />
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                  <MiniBtn tone="primary" onClick={() => saveItem(key)}>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save {singular}</span>
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

            {/* List Stream */}
            {values[key].length === 0 ? (
              <EmptyState
                title={`No ${label} Configured`}
                description={`Click "+ Add New ${singular}" above to create your first entry.`}
                action={
                  <MiniBtn
                    tone="primary"
                    onClick={() => {
                      setEditing(null);
                      createItem(key, fields, enabled);
                    }}
                  >
                    + Add New {singular}
                  </MiniBtn>
                }
              />
            ) : (
              <div className="divide-y divide-line border border-line bg-surface">
                {values[key].map((item, idx) => {
                  const itemTitle = item.title || item.name || item.question || item.author;
                  return (
                    <div
                      key={item.id || idx}
                      className="flex flex-wrap items-center justify-between gap-4 p-5 transition-colors hover:bg-background/80"
                    >
                      <div className="max-w-2xl min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-xs text-accent font-bold shrink-0">
                            #{String(idx + 1).padStart(2, "0")}
                          </span>
                          <p
                            className="font-display font-bold text-foreground text-base cursor-pointer hover:text-accent break-words"
                            onClick={() => setViewing({ sectionKey: key, item, config: { label, singular, fields, enabled } })}
                          >
                            {itemTitle}
                          </p>
                          {item.code && (
                            <span className="border border-line bg-background px-2 py-0.5 font-mono text-[0.65rem] text-muted shrink-0">
                              {item.code}
                            </span>
                          )}
                          {enabled && item.enabled === false && (
                            <span className="border border-danger/30 bg-danger/10 px-2 py-0.5 font-mono text-[0.65rem] text-danger uppercase shrink-0">
                              Draft (Hidden)
                            </span>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs font-mono text-muted leading-relaxed break-words">
                          {item.summary || item.description || item.answer || item.quote || item.role}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <MiniBtn
                          tone="accent"
                          onClick={() => setViewing({ sectionKey: key, item, config: { label, singular, fields, enabled } })}
                          title="Inspect item details"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </MiniBtn>
                        <MiniBtn
                          onClick={() => startEditItem(key, item, fields, enabled)}
                          title="Edit item"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </MiniBtn>
                        <MiniBtn
                          tone="danger"
                          onClick={() => setDeletingItem({ section: key, item, singular })}
                          title="Delete item"
                        >
                          <Trash2 className="h-3 w-3" />
                        </MiniBtn>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        ))}

      {/* Content Item Inspector Dialog */}
      {viewing && (
        <AdminModal
          isOpen={Boolean(viewing)}
          onClose={() => setViewing(null)}
          title={viewing.item.title || viewing.item.name || viewing.item.question || viewing.item.author || "Content Details"}
          eyebrow={viewing.config?.label || "Content Entry"}
          size="lg"
          footer={
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <MiniBtn
                tone="danger"
                onClick={() => {
                  const targetItem = viewing.item;
                  const targetSection = viewing.sectionKey;
                  const singular = viewing.config?.singular;
                  setViewing(null);
                  setDeletingItem({ section: targetSection, item: targetItem, singular });
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete {viewing.config?.singular || "Item"}</span>
              </MiniBtn>

              <div className="flex items-center gap-2">
                <MiniBtn
                  tone="accent"
                  onClick={() => {
                    const item = viewing.item;
                    const key = viewing.sectionKey;
                    const fields = viewing.config?.fields || [];
                    const enabled = viewing.config?.enabled;
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
                    setViewing(null);
                  }}
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit {viewing.config?.singular || "Item"}</span>
                </MiniBtn>
                <MiniBtn onClick={() => setViewing(null)}>Close</MiniBtn>
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Image Preview if applicable */}
            {viewing.item.image && (
              <div className="aspect-video w-full overflow-hidden border border-line bg-navy">
                <img
                  src={viewing.item.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Quick Metadata Matrix */}
            <div className="grid gap-3 sm:grid-cols-3 border border-line bg-background p-4 font-mono text-xs">
              <div>
                <span className="text-muted block text-[0.68rem] uppercase">Section Category</span>
                <span className="font-bold text-accent text-sm mt-0.5 block">{viewing.config?.label}</span>
              </div>
              <div>
                <span className="text-muted block text-[0.68rem] uppercase">Record ID</span>
                <span className="font-mono text-foreground text-xs mt-0.5 block truncate">{viewing.item.id || "N/A"}</span>
              </div>
              {viewing.config?.enabled && (
                <div>
                  <span className="text-muted block text-[0.68rem] uppercase">Visibility</span>
                  <span className="font-semibold text-foreground text-xs mt-0.5 block">
                    {viewing.item.enabled !== false ? "Published" : "Draft / Hidden"}
                  </span>
                </div>
              )}
              {viewing.item.code && (
                <div>
                  <span className="text-muted block text-[0.68rem] uppercase">Service Code</span>
                  <span className="font-bold text-foreground text-xs mt-0.5 block">{viewing.item.code}</span>
                </div>
              )}
            </div>

            {/* Narrative / Main text */}
            {(viewing.item.summary || viewing.item.description || viewing.item.answer || viewing.item.quote) && (
              <div className="border border-line bg-surface p-4 space-y-1">
                <span className="tech-label text-muted text-[0.68rem] uppercase block">
                  {viewing.item.answer
                    ? "Technical Answer:"
                    : viewing.item.quote
                    ? "Client Quote:"
                    : "Description / Summary:"}
                </span>
                <p className="text-sm font-sans text-foreground leading-relaxed whitespace-pre-wrap">
                  {viewing.item.answer || viewing.item.quote || viewing.item.summary || viewing.item.description}
                </p>
                {viewing.item.role && (
                  <p className="text-xs font-mono text-accent mt-2">
                    — {viewing.item.author}, {viewing.item.role}
                  </p>
                )}
              </div>
            )}

            {/* Delivered Outcome */}
            {viewing.item.outcome && (
              <div className="border-l-2 border-accent bg-background/50 p-4 space-y-1">
                <span className="tech-label text-accent text-[0.68rem] uppercase font-bold block">
                  Delivered Outcome:
                </span>
                <p className="text-xs text-foreground font-mono">{viewing.item.outcome}</p>
              </div>
            )}

            {/* Array items: Points or Capabilities */}
            {Array.isArray(viewing.item.points) && viewing.item.points.length > 0 && (
              <div className="space-y-2">
                <span className="tech-label text-accent text-xs uppercase font-bold block">
                  Service Feature Points:
                </span>
                <ul className="space-y-1 border border-line bg-background p-4 font-mono text-xs">
                  {viewing.item.points.map((pt, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(viewing.item.capabilities) && viewing.item.capabilities.length > 0 && (
              <div className="space-y-2">
                <span className="tech-label text-accent text-xs uppercase font-bold block">
                  Engineering Capabilities:
                </span>
                <ul className="space-y-1 border border-line bg-background p-4 font-mono text-xs">
                  {viewing.item.capabilities.map((cap, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </AdminModal>
      )}

      {/* SINGLE ITEM DELETE CONFIRM MODAL */}
      {deletingItem && (
        <ConfirmDeleteModal
          isOpen={Boolean(deletingItem)}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDeleteItem}
          title={`Delete ${deletingItem.singular || "Content Item"}?`}
          message="Are you sure you want to permanently delete this content item? It will be removed from your website and MongoDB store."
          itemName={deletingItem.item.title || deletingItem.item.name || deletingItem.item.question || deletingItem.item.author || "Content Item"}
          isDeleting={isDeleting}
        />
      )}

      {/* CLEAR ALL SECTION CONFIRM MODAL */}
      {confirmClear && (
        <ConfirmDeleteModal
          isOpen={Boolean(confirmClear)}
          onClose={() => setConfirmClear(null)}
          onConfirm={handleClearSection}
          title={`Clear All ${listSections.find((s) => s.key === confirmClear)?.label || "Items"}?`}
          message={`Are you sure you want to delete all items in this section? This action cannot be undone.`}
          itemName={`All ${values[confirmClear]?.length || 0} entries in ${confirmClear}`}
          confirmLabel="Yes, Clear All"
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
