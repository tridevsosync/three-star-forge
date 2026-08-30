"use client";

import { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { IMAGES } from "@/data/images";
import {
  MiniBtn,
  Panel,
  TextField,
  Toggle,
  AdminModal,
  ConfirmDeleteModal,
} from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";
import { ImageMetaBadge } from "@/components/site/ImageMetaBadge";
import {
  Home,
  Wrench,
  Factory,
  Cpu,
  Building2,
  Phone,
  MessageSquareQuote,
  HelpCircle,
  Save,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Upload,
  CheckCircle2,
  ArrowRight,
  Star,
  Layers,
  Sparkles,
  Briefcase,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";

function AdminContentPageInner() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") || "home";

  const {
    company,
    home,
    services,
    servicesSpotlight,
    engagementModels = [],
    industries,
    capabilities = [],
    faqs,
    testimonials,
    projects,
    gallery,
    update,
    uploadToCloudinary,
  } = useSite();

  const DEFAULT_CAPABILITY_CATEGORIES = [
    "Induction Hardening",
    "Material Handling",
    "Inspection & Sorting",
    "Automation & Tooling",
    "Machine Building",
    "Quality & Metrology",
  ];
  const [isCustomCapCategory, setIsCustomCapCategory] = useState(false);

  const capabilityCategoryNames = useMemo(() => {
    const allCats = [
      ...DEFAULT_CAPABILITY_CATEGORIES,
      ...(Array.isArray(capabilities) ? capabilities.map((c: any) => c?.category).filter(Boolean) : []),
    ];
    return Array.from(new Set(allCats));
  }, [capabilities]);

  const [activeTab, setActiveTab] = useState(pageParam);
  const [saved, setSaved] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [draft, setDraft] = useState<any>(null);
  const [draftSection, setDraftSection] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const values: Record<string, any[]> = { services, engagementModels, industries, capabilities, faqs, testimonials };

  // Sync tab with URL search parameter if changed
  useEffect(() => {
    if (
      pageParam &&
      [
        "home",
        "projects",
        "gallery",
        "services",
        "industries",
        "capabilities",
        "about",
        "contact",
        "testimonials",
        "faqs",
      ].includes(pageParam)
    ) {
      setActiveTab(pageParam);
    }
  }, [pageParam]);

  const setCompany = (key: string, value: any) => update("company", { ...company, [key]: value });
  const setHome = (key: string, value: any) => update("home", { ...home, [key]: value });

  const flash = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(null), 3000);
  };

  const saveSingle = async (section: "company" | "home", value: any) => {
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
      flash(`✓ Saved ${section === "home" ? "Home Page Changes" : "Company Details"} to Database!`);
    } catch (err: any) {
      flash("Error saving: " + err.message);
    } finally {
      setSavingSection(false);
    }
  };

  // =========================================================================
  // INDUCTION HARDENING TECHNICAL SPECS MATRIX SELECTION & REORDERING
  // =========================================================================
  const [selectedAddProjectId, setSelectedAddProjectId] = useState<string>("");
  const [savingMatrixOrder, setSavingMatrixOrder] = useState(false);

  // Compute active matrix project items
  const matrixProjects = useMemo(() => {
    const currentList = Array.isArray(projects) ? projects : [];
    const selectedIds = home?.inductionSpecProjectIds;

    if (Array.isArray(selectedIds) && selectedIds.length > 0) {
      const ordered: any[] = [];
      selectedIds.forEach((id: string) => {
        const found = currentList.find((p: any) => p.id === id || p._id === id);
        if (found) ordered.push(found);
      });
      return ordered;
    }

    // Default fallback: all induction and SPM projects
    return currentList.filter(
      (p: any) =>
        p.category?.toLowerCase().includes("induction") ||
        p.title?.toLowerCase().includes("induction") ||
        p.category === "Special Purpose Machines (SPM)",
    );
  }, [projects, home?.inductionSpecProjectIds]);

  // Projects from database available to be added to the matrix (not currently in matrix)
  const availableProjectsToAdd = useMemo(() => {
    const activeIds = new Set(matrixProjects.map((p: any) => p.id || p._id));
    return (Array.isArray(projects) ? projects : []).filter(
      (p: any) => !activeIds.has(p.id || p._id),
    );
  }, [projects, matrixProjects]);

  const saveMatrixProjectIds = async (newIds: string[]) => {
    const updatedHome = { ...home, inductionSpecProjectIds: newIds };
    update("home", updatedHome);
    setSavingMatrixOrder(true);
    try {
      const res = await fetch("/api/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHome),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
      flash("✓ Updated Technical Specification Matrix selection & sequence!");
    } catch (err: any) {
      flash("Error saving matrix layout: " + err.message);
    } finally {
      setSavingMatrixOrder(false);
    }
  };

  const handleAddProjectToMatrix = () => {
    if (!selectedAddProjectId) return;
    const currentIds = matrixProjects.map((p: any) => p.id || p._id);
    if (!currentIds.includes(selectedAddProjectId)) {
      const nextIds = [...currentIds, selectedAddProjectId];
      saveMatrixProjectIds(nextIds);
      setSelectedAddProjectId("");
    }
  };

  const handleMoveMatrixProject = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= matrixProjects.length) return;
    const currentIds = matrixProjects.map((p: any) => p.id || p._id);
    const temp = currentIds[index];
    currentIds[index] = currentIds[targetIndex];
    currentIds[targetIndex] = temp;
    saveMatrixProjectIds(currentIds);
  };

  const handleRemoveProjectFromMatrix = (projectId: string) => {
    const currentIds = matrixProjects.map((p: any) => p.id || p._id);
    const nextIds = currentIds.filter((id: string) => id !== projectId);
    saveMatrixProjectIds(nextIds);
  };

  const handleResetMatrixOrder = () => {
    const defaultIds = (Array.isArray(projects) ? projects : [])
      .filter(
        (p: any) =>
          p.category?.toLowerCase().includes("induction") ||
          p.title?.toLowerCase().includes("induction") ||
          p.category === "Special Purpose Machines (SPM)",
      )
      .map((p: any) => p.id || p._id);
    saveMatrixProjectIds(defaultIds);
  };

  // Toggle Featured status for a project
  const toggleProjectFeatured = async (project: any) => {
    const id = project.id || project._id;
    const newFeatured = !project.featured;
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...project, featured: newFeatured }),
      });
      const data = await res.json();
      if (data.success) {
        update(
          "projects",
          projects.map((p: any) => (p.id === id || p._id === id ? { ...p, featured: newFeatured } : p)),
        );
        flash(`✓ ${project.title} is now ${newFeatured ? "Featured in Hero Spotlight" : "Standard"}`);
      }
    } catch (err: any) {
      flash("Error: " + err.message);
    }
  };

  // Toggle Featured status for an engineering service in header hero (Exclusive single-featured)
  const toggleServiceFeatured = async (service: any) => {
    const id = service.id || service._id || service.code || service.title;
    const newFeatured = !service.featured;
    try {
      const updatedList = services.map((s: any) => {
        const sId = s.id || s._id || s.code || s.title;
        const isMatch = sId === id || (s.code && s.code === service.code) || (s.title && s.title === service.title);
        if (isMatch) {
          return { ...s, featured: newFeatured };
        }
        // If enabling this service, automatically turn off all other services
        return newFeatured ? { ...s, featured: false } : s;
      });

      update("services", updatedList);
      flash(`✓ ${service.title} is now ${newFeatured ? "Featured in Services Header" : "Removed from Header"}`);

      await fetch(`/api/content/services`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });
    } catch (err: any) {
      flash("Error: " + err.message);
    }
  };

  // Toggle Featured status for an industry sector in header hero (Exclusive single-featured)
  const toggleIndustryFeatured = async (industry: any) => {
    const id = industry.id || industry._id || industry.name;
    const newFeatured = !industry.featured;
    try {
      const updatedList = industries.map((ind: any) => {
        const indId = ind.id || ind._id || ind.name;
        const isMatch = indId === id || (ind.name && ind.name === industry.name);
        if (isMatch) {
          return { ...ind, featured: newFeatured };
        }
        // If enabling this industry, automatically turn off all other industries
        return newFeatured ? { ...ind, featured: false } : ind;
      });

      update("industries", updatedList);
      flash(`✓ ${industry.name} is now ${newFeatured ? "Featured in Industries Header" : "Removed from Header"}`);

      await fetch(`/api/content/industries`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });
    } catch (err: any) {
      flash("Error: " + err.message);
    }
  };

  // Toggle Featured status for a capability in header hero (Exclusive single-featured)
  const toggleCapabilityFeatured = async (capability: any) => {
    const id = capability.id || capability._id || capability.code || capability.title;
    const newFeatured = !capability.featured;
    try {
      const updatedList = capabilities.map((c: any) => {
        const cId = c.id || c._id || c.code || c.title;
        const isMatch = cId === id || (c.code && c.code === capability.code) || (c.title && c.title === capability.title);
        if (isMatch) {
          return { ...c, featured: newFeatured };
        }
        // If enabling this capability, automatically turn off all other capabilities
        return newFeatured ? { ...c, featured: false } : c;
      });

      update("capabilities", updatedList);
      flash(`✓ ${capability.title} is now ${newFeatured ? "Featured in Capabilities Header" : "Removed from Header"}`);

      await fetch(`/api/content/capabilities`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });
    } catch (err: any) {
      flash("Error: " + err.message);
    }
  };

  // Save Item for Services, Industries, Capabilities, FAQs, Testimonials
  const saveItem = async (section: string) => {
    const editingId = editing?.id || editing?._id || editing?.code || editing?.title || editing?.name;
    const slug = (draft.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const generatedId = section === "capabilities" && slug ? `cap-${slug}` : `${section}-${Date.now()}`;
    const itemPayload = {
      ...draft,
      id: editingId || draft.id || generatedId,
    };
    const currentList = values[section] || [];

    let updatedList = editingId
      ? currentList.map((item: any) => {
          const isMatch =
            (editingId && (item.id === editingId || item._id === editingId)) ||
            (editing?.code && item.code === editing.code) ||
            (editing?.name && item.name === editing.name) ||
            (editing?.title && item.title === editing.title);
          return isMatch ? itemPayload : item;
        })
      : [...currentList, itemPayload];

    // If saving an item as featured (services, industries, capabilities), automatically turn off featured for all other items in that section
    if ((section === "services" || section === "industries" || section === "capabilities") && itemPayload.featured) {
      const savedItemId = itemPayload.id || itemPayload.code || itemPayload.title || itemPayload.name;
      updatedList = updatedList.map((item: any) => {
        const itemId = item.id || item._id || item.code || item.title || item.name;
        const isSelf = itemId === savedItemId || (item.code && item.code === itemPayload.code) || (item.title && item.title === itemPayload.title) || (item.name && item.name === itemPayload.name);
        return isSelf ? { ...item, featured: true } : { ...item, featured: false };
      });
    }

    try {
      // Bulk update full list in database to ensure full synchronisation & exclusive featured state
      await fetch(`/api/content/${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      update(section as any, updatedList);
      setDraft(null);
      setEditing(null);
      setDraftSection(null);
      flash(`✓ Saved item to ${section}`);
    } catch (err: any) {
      flash("Error saving item: " + err.message);
    }
  };

  // Delete Item
  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    const { section, item } = deletingItem;
    const itemId = item.id || item._id || item.name || item.title || item.question || item.author;
    try {
      const currentList = values[section] || [];
      update(
        section as any,
        currentList.filter((i: any) => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, keyName: string = "image") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadToCloudinary(file, "content");
      if (!res.success || !res.url) throw new Error(res.error || "Upload failed");
      setDraft((prev: any) => ({ ...prev, [keyName]: res.url }));
      flash("✓ Image uploaded successfully!");
    } catch (err: any) {
      flash("Upload error: " + err.message);
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const PAGE_TABS = [
    { key: "home", label: "Home Page", icon: Home, badge: "9 Sections", href: "/" },
    { key: "about", label: "About Us Page", icon: Building2, badge: "Story & Facility", href: "/about" },
    { key: "services", label: "Services Page", icon: Wrench, badge: `${services.length} Services`, href: "/services" },
    { key: "industries", label: "Industries Page", icon: Factory, badge: `${industries.length} Sectors`, href: "/industries" },
    { key: "projects", label: "Projects Portfolio", icon: Briefcase, badge: `${projects.length} Builds`, href: "/projects" },
    { key: "capabilities", label: "Capabilities Page", icon: Cpu, badge: "Specs & Models", href: "/capabilities" },
    { key: "gallery", label: "Gallery & Photos", icon: ImageIcon, badge: `${gallery.length} Photos`, href: "/gallery" },
    { key: "contact", label: "Contact & Info", icon: Phone, badge: "Phone & Address", href: "/contact" },
    { key: "testimonials", label: "Client Reviews", icon: MessageSquareQuote, badge: `${testimonials.length} Reviews` },
    { key: "faqs", label: "FAQs", icon: HelpCircle, badge: `${faqs.length} Questions` },
  ];

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {saved && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-xl border border-accent bg-navy px-5 py-3.5 text-sm font-semibold text-accent shadow-2xl backdrop-blur-md animate-bounce">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
          <span>{saved}</span>
        </div>
      )}



      {/* ========================================================================= */}
      {/* MODULE 1: HOME PAGE ALL-IN-ONE HUB */}
      {/* ========================================================================= */}
      {activeTab === "home" && (
        <div className="space-y-8">
          {/* Quick Page Overview Banner */}
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-navy font-bold">
                <Home className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Home Page All-In-One Editor
                </h3>
                <p className="text-xs text-muted">
                  All 9 sections on the homepage are displayed below in the exact order of the live website.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MiniBtn tone="primary" disabled={savingSection} onClick={() => saveSingle("home", home)}>
                <Save className="h-3.5 w-3.5" />
                <span>{savingSection ? "Saving..." : "Save All Home Changes"}</span>
              </MiniBtn>
            </div>
          </div>

          {/* Section 1: Hero Banner */}
          <Panel
            title="1. Hero Section (Top of Home Page)"
            action={
              <span className="rounded-full bg-accent/15 border border-accent/40 px-3 py-1 text-[0.7rem] font-bold text-accent">
                Hero Top
              </span>
            }
          >
            <p className="text-xs text-muted mb-6">
              This is the very first area visitors see with the glowing gradient and machine spotlight.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField
                  label="Top Glowing Badge (Pill Tag above Title)"
                  value={home.eyebrow}
                  onChange={(v) => setHome("eyebrow", v)}
                  placeholder="e.g. PUNE WORKSHOP & WORKS • LIVE PRODUCTION"
                />
                <span className="mt-1 block text-[0.7rem] text-muted">
                  Displays inside the glowing pill badge right above the main large headline.
                </span>
              </div>

              <div className="sm:col-span-2">
                <TextField
                  label="Main Hero Title (Large Heading)"
                  value={home.heroTitle}
                  onChange={(v) => setHome("heroTitle", v)}
                  placeholder="e.g. We Turn Engineering Ideas Into Reliable Machines."
                />
              </div>

              <div className="sm:col-span-2">
                <TextField
                  label="Hero Subtitle Narrative"
                  value={home.heroSubtitle}
                  onChange={(v) => setHome("heroSubtitle", v)}
                  rows={3}
                  placeholder="e.g. Custom machine design, complete in-house manufacturing, and live testing..."
                />
              </div>

              <TextField
                label="Primary Button Text"
                value={home.primaryCta}
                onChange={(v) => setHome("primaryCta", v)}
                placeholder="e.g. Get a Free Quote"
              />

              <TextField
                label="Secondary Button Text"
                value={home.secondaryCta}
                onChange={(v) => setHome("secondaryCta", v)}
                placeholder="e.g. See Our Work"
              />
            </div>
          </Panel>

          {/* Section 2: Hero Machine Spotlight & "Our Work" (Section 01) */}
          <Panel
            title="2. Hero Machine Spotlight & Section 01: Our Work"
            action={
              <Link
                href="/admin/projects"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 font-sans text-xs font-semibold text-foreground hover:border-accent hover:text-accent transition-all"
              >
                <span>Open Full Machine Studio</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            <p className="text-xs text-muted mb-4">
              The machines starred as <strong>"Featured (★)"</strong> automatically power the interactive <strong>Hero Machine Spotlight Card</strong> and lead the <strong>"Our Work" (Section 01)</strong> grid.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((p) => {
                const isFeatured = Boolean(p.featured);
                return (
                  <div
                    key={p.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isFeatured ? "border-accent/60 bg-accent/5 shadow-xs" : "border-line bg-surface"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-navy px-2.5 py-0.5 text-[0.65rem] font-bold text-accent">
                        {p.category || "Machine"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleProjectFeatured(p)}
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] font-bold cursor-pointer transition-all ${
                          isFeatured
                            ? "border-accent bg-accent text-navy"
                            : "border-line text-muted hover:border-accent hover:text-accent"
                        }`}
                        title="Toggle Featured in Hero Spotlight"
                      >
                        <Star className="h-3 w-3 fill-current" />
                        <span>{isFeatured ? "Spotlight: ON" : "Spotlight: OFF"}</span>
                      </button>
                    </div>
                    <h4 className="mt-3 font-display text-sm font-bold text-foreground truncate">{p.title}</h4>
                    <p className="mt-1 text-[0.7rem] text-muted line-clamp-2">{p.short || p.overview}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted">
                Showing top machines. Manage all {projects.length} machines in the dedicated studio.
              </span>
              <Link
                href="/admin/projects"
                className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
              >
                <span>+ Add / Edit Machine Builds ({projects.length} Total)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Panel>

          {/* Section 3: Shop-Floor Photo Archive (Section 02 - Inside Our Pune Works) */}
          <Panel
            title="3. Section 02: Shop-Floor Photo Archive & Workshop Mosaic"
            action={
              <Link
                href="/admin/gallery"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 font-sans text-xs font-semibold text-foreground hover:border-accent hover:text-accent transition-all"
              >
                <span>Open Full Photo Archive</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            <p className="text-xs text-muted mb-4">
              These are the 6 high-resolution workshop photos displayed in the <strong>"Inside Our Pune Works & Machinery Assembly Bay"</strong> mosaic grid on the home page.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.slice(0, 6).map((g, idx) => (
                <div key={g.id || idx} className="rounded-xl border border-line bg-surface overflow-hidden p-3 flex gap-3 items-center">
                  <div className="h-14 w-20 rounded-lg overflow-hidden bg-navy shrink-0 relative">
                    {g.image ? (
                      <img src={g.image} alt={g.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[0.6rem] text-muted">No Img</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[0.65rem] font-bold text-accent uppercase block">{g.category || "Photo"}</span>
                    <h5 className="font-display text-xs font-bold text-foreground truncate">{g.title}</h5>
                    <p className="text-[0.68rem] text-muted truncate">{g.description || "Workshop photo"}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted">
                Click below to upload new photos or change captions for the mosaic.
              </span>
              <Link
                href="/admin/gallery"
                className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
              >
                <span>+ Upload & Manage Workshop Photos ({gallery.length} Total)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Panel>

          {/* Section 4: In-House Craftsmanship & Works (Section 04) */}
          <Panel title="4. Section 04: In-House Craftsmanship & 4 Pillars">
            <p className="text-xs text-muted mb-6">
              Controls the title of Section 04 and the 4 capability pillars (*3D CAD, In-House CNC, Turnkey Assembly, 100% FAT Testing*).
            </p>
            <TextField
              label="Section 04 Heading"
              value={home.aboutHeading}
              onChange={(v) => setHome("aboutHeading", v)}
              placeholder="e.g. Complete In-House Capability Under One Roof"
            />
          </Panel>

          {/* Section 5: Client Feedback (Section 05) */}
          <Panel
            title="5. Section 05: Client Feedback & Reviews"
            action={
              <button
                type="button"
                onClick={() => setActiveTab("testimonials")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 font-sans text-xs font-semibold text-foreground hover:border-accent hover:text-accent transition-all cursor-pointer"
              >
                <span>Manage Client Reviews ({testimonials.length})</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            }
          >
            <p className="text-xs text-muted mb-6">
              Controls the heading for the client testimonials section on the home page.
            </p>
            <TextField
              label="Client Reviews Section Heading"
              value={home.clientsHeading}
              onChange={(v) => setHome("clientsHeading", v)}
              placeholder="e.g. Trusted by Equipment Manufacturers & Industrial Leaders"
            />
          </Panel>

          {/* Section 6: Bottom Call-To-Action Banner */}
          <Panel title="6. Bottom Call-to-Action Banner (Ready to Build)">
            <p className="text-xs text-muted mb-6">
              Controls the high-conversion blue banner displayed at the bottom of the home page and throughout the website.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField
                  label="Closing Banner Headline"
                  value={home.ctaHeading}
                  onChange={(v) => setHome("ctaHeading", v)}
                  placeholder="e.g. Have a machine project in mind? Let's build it together."
                />
              </div>

              <TextField
                label="Primary Button Text"
                value={home.ctaButton}
                onChange={(v) => setHome("ctaButton", v)}
                placeholder="e.g. Get a Free Quote"
              />
            </div>
          </Panel>

          {/* Save Action Bar at bottom */}
          <div className="sticky bottom-6 flex justify-end">
            <MiniBtn tone="primary" disabled={savingSection} onClick={() => saveSingle("home", home)}>
              <Save className="h-4 w-4" />
              <span>{savingSection ? "Saving..." : "Save All Home Page Changes"}</span>
            </MiniBtn>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE: PROJECTS & MACHINE PORTFOLIO HUB */}
      {/* ========================================================================= */}
      {activeTab === "projects" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-navy font-bold">
                <Briefcase className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Projects & Machine Portfolio Manager</h3>
                <p className="text-xs text-muted">Manage all {projects.length} industrial machinery builds, technical datasheets, and shop-floor equipment specs.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/projects"
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-navy shadow-md hover:bg-accent-hover transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Open Full Projects Editor</span>
              </Link>
              <Link
                href="/projects"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:border-accent hover:text-accent transition-all"
              >
                <span>Live Projects Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <span className="text-xs text-muted font-medium">Total Delivered Builds</span>
              <div className="mt-1 font-display text-2xl font-extrabold text-foreground">{projects.length} Machines</div>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <span className="text-xs text-muted font-medium">Featured in Showcases</span>
              <div className="mt-1 font-display text-2xl font-extrabold text-accent">{projects.filter((p) => p.featured).length} Featured</div>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <span className="text-xs text-muted font-medium">Dedicated Manager</span>
              <div className="mt-1">
                <Link href="/admin/projects" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                  <span>Go to /admin/projects</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Projects Cards Grid */}
          <Panel
            title={`Active Machinery Builds (${projects.length})`}
            action={
              <Link
                href="/admin/projects"
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
              >
                <span>Manage in Full Editor →</span>
              </Link>
            }
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, idx) => {
                const pId = p.id || (p as any)._id;
                return (
                  <div
                    key={pId || idx}
                    className="group rounded-2xl border border-line bg-background p-4 flex flex-col justify-between transition-all hover:border-accent hover:shadow-md"
                  >
                    <div>
                      {/* Photo Thumbnail */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy mb-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-sans text-xs text-accent">
                            No Photo
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          <span className="rounded-md bg-navy/90 px-2 py-0.5 text-[0.65rem] font-bold text-onnavy">
                            {p.category || "SPM"}
                          </span>
                          {p.featuredInHero && (
                            <span className="rounded-md bg-accent px-2 py-0.5 text-[0.65rem] font-bold text-navy">
                              ★ Header Hero
                            </span>
                          )}
                          {(p.featured || p.featuredInHome) && (
                            <span className="rounded-md bg-navy/90 px-2 py-0.5 text-[0.65rem] font-bold text-accent border border-accent/40">
                              🏠 Home
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[0.68rem] font-bold text-accent uppercase tracking-wider block mb-1">
                        {p.industry || "General Industry"}
                      </span>
                      <h4 className="font-display text-sm font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                        {p.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted line-clamp-2">
                        {p.summary || p.overview || p.short}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs">
                      <Link
                        href={`/admin/projects`}
                        className="font-bold text-accent hover:underline flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit Project</span>
                      </Link>
                      <Link
                        href={`/projects/${pId}`}
                        target="_blank"
                        className="text-muted hover:text-foreground flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE: GALLERY & WORKSHOP PHOTOS HUB */}
      {/* ========================================================================= */}
      {activeTab === "gallery" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-navy font-bold">
                <ImageIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Workshop & Equipment Gallery Manager</h3>
                <p className="text-xs text-muted">Manage all {gallery.length} workshop photos, machinery builds, and live shop-floor media.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/gallery"
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-navy shadow-md hover:bg-accent-hover transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Open Full Gallery Manager</span>
              </Link>
              <Link
                href="/gallery"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:border-accent hover:text-accent transition-all"
              >
                <span>Live Gallery Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <span className="text-xs text-muted font-medium">Total Photos</span>
              <div className="mt-1 font-display text-2xl font-extrabold text-foreground">{gallery.length} Photos</div>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <span className="text-xs text-muted font-medium">Featured in Home Reel</span>
              <div className="mt-1 font-display text-2xl font-extrabold text-accent">{gallery.filter((g) => g.featured).length} Featured</div>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <span className="text-xs text-muted font-medium">Dedicated Manager</span>
              <div className="mt-1">
                <Link href="/admin/gallery" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                  <span>Go to /admin/gallery</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Gallery Photos Grid */}
          <Panel
            title={`Active Workshop Photos (${gallery.length})`}
            action={
              <Link
                href="/admin/gallery"
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
              >
                <span>Upload & Reorder in Full Manager →</span>
              </Link>
            }
          >
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {gallery.map((g, idx) => {
                const gId = g.id || (g as any)._id;
                return (
                  <div
                    key={gId || idx}
                    className="group rounded-2xl border border-line bg-background p-3 flex flex-col justify-between transition-all hover:border-accent hover:shadow-md"
                  >
                    <div>
                      {/* Photo Thumbnail */}
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-navy mb-2.5">
                        {g.image ? (
                          <img
                            src={g.image}
                            alt={g.title || "Photo"}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-sans text-xs text-accent">
                            No Photo
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="rounded-md bg-navy/90 px-2 py-0.5 text-[0.65rem] font-bold text-onnavy">
                            {g.category || "Workshop"}
                          </span>
                          {g.featured && (
                            <span className="rounded-md bg-accent px-2 py-0.5 text-[0.65rem] font-bold text-navy">
                              Reel
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="font-display text-xs font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                        {g.title || "Workshop Machinery"}
                      </h4>
                      {g.description && (
                        <p className="mt-1 text-[0.7rem] text-muted line-clamp-2">
                          {g.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-line flex items-center justify-between text-xs">
                      <Link
                        href={`/admin/gallery`}
                        className="font-bold text-accent hover:underline flex items-center gap-1 text-[0.75rem]"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </Link>
                      <Link
                        href={`/gallery`}
                        target="_blank"
                        className="text-muted hover:text-foreground flex items-center gap-1 text-[0.75rem]"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: SERVICES PAGE ALL-IN-ONE HUB */}
      {/* ========================================================================= */}
      {activeTab === "services" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-navy font-bold">
                <Wrench className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Services Page Manager</h3>
                <p className="text-xs text-muted">Manage all {services.length} core engineering services displayed on the /services page.</p>
              </div>
            </div>
            <MiniBtn
              tone="primary"
              onClick={() => {
                setDraftSection("services");
                setEditing(null);
                setDraft({
                  code: `SRV-0${services.length + 1}`,
                  title: "",
                  summary: "",
                  outcome: "",
                  points: [],
                  featured: false,
                });
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add New Service</span>
            </MiniBtn>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, idx) => (
              <div key={s.id || idx} className="rounded-2xl border border-line bg-surface overflow-hidden flex flex-col justify-between">
                {/* Service Photo Banner */}
                <div className="relative aspect-[16/9] bg-navy overflow-hidden">
                  {s.image ? (
                    <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                      Default Workshop Photo
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-navy/90 px-3 py-1 text-xs font-bold text-accent border border-accent/30">
                      {s.code || `SRV-0${idx + 1}`}
                    </span>
                  </div>
                  {s.featured ? (
                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-[0.65rem] font-bold text-navy shadow-md flex items-center gap-1">
                        <Star className="h-3 w-3 fill-navy" />
                        <span>Header Featured</span>
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-lg font-bold text-foreground">{s.title}</h4>
                    <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-3">{s.summary}</p>

                    {s.points && s.points.length > 0 && (
                      <ul className="mt-4 space-y-1.5 text-xs text-muted border-t border-line pt-3">
                        {s.points.slice(0, 3).map((pt: string, pIdx: number) => (
                          <li key={pIdx} className="flex items-center gap-2 truncate">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                            <span className="truncate">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleServiceFeatured(s)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[0.72rem] font-semibold transition-all cursor-pointer ${
                        s.featured
                          ? "border border-accent bg-accent text-navy font-bold shadow-xs"
                          : "border border-line-strong bg-surface text-muted hover:text-accent hover:border-accent"
                      }`}
                      title={s.featured ? "Click to remove from Header Hero" : "Click to feature in Header Hero"}
                    >
                      <Star className={`h-3.5 w-3.5 ${s.featured ? "fill-navy text-navy" : ""}`} />
                      <span>{s.featured ? "Featured in Hero" : "Set Featured"}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <MiniBtn
                        tone="default"
                        onClick={() => {
                          setDraftSection("services");
                          setEditing(s);
                          setDraft({ ...s });
                        }}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </MiniBtn>
                      <MiniBtn
                        tone="danger"
                        onClick={() => setDeletingItem({ section: "services", item: s })}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </MiniBtn>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 2: Engagement & Partnership Models (3 Ways to Work) */}
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-wrap items-center justify-between gap-4 mt-12">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-navy font-bold">
                <Layers className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">3 Simple Ways to Work (Engagement Models)</h3>
                <p className="text-xs text-muted">Manage the partnership cards, photos, and deliverables in Section 03 of /services.</p>
              </div>
            </div>
            <MiniBtn
              tone="primary"
              onClick={() => {
                setDraftSection("engagementModels");
                setEditing(null);
                setDraft({
                  title: "",
                  badge: "DESIGN ONLY",
                  tagline: "FOR OEMS WITH INTERNAL MANUFACTURING CAPACITY",
                  description: "",
                  deliverables: [],
                  image: "",
                });
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add Partnership Model</span>
            </MiniBtn>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {engagementModels.map((m: any, idx: number) => (
              <div key={m.id || idx} className="rounded-2xl border border-line bg-surface overflow-hidden flex flex-col justify-between">
                {/* Model Photo Banner */}
                <div className="relative aspect-[16/9] bg-navy overflow-hidden">
                  {m.image ? (
                    <img src={m.image} alt={m.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                      Default Model Photo
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-navy/90 px-3 py-1 text-xs font-bold text-accent border border-accent/30">
                      {m.badge || `MODEL 0${idx + 1}`}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[0.65rem] font-bold text-accent uppercase tracking-wider block">
                      {m.tagline}
                    </span>
                    <h4 className="mt-1 font-display text-lg font-bold text-foreground">{m.title}</h4>
                    <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-3">{m.description || m.desc}</p>

                    {m.deliverables && m.deliverables.length > 0 && (
                      <div className="mt-4 border-t border-line pt-3">
                        <span className="text-[0.65rem] font-bold text-foreground uppercase tracking-wider block mb-2">
                          Deliverables:
                        </span>
                        <ul className="space-y-1 text-xs text-muted">
                          {m.deliverables.slice(0, 3).map((d: string, dIdx: number) => (
                            <li key={dIdx} className="flex items-center gap-2 truncate">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                              <span className="truncate">{d}</span>
                            </li>
                          ))}
                          {m.deliverables.length > 3 && (
                            <li className="text-[0.65rem] text-accent font-semibold pt-0.5">
                              +{m.deliverables.length - 3} more items
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-line flex items-center justify-end gap-2">
                    <MiniBtn
                      tone="default"
                      onClick={() => {
                        setDraftSection("engagementModels");
                        setEditing(m);
                        setDraft({ ...m });
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit Model</span>
                    </MiniBtn>
                    <MiniBtn
                      tone="danger"
                      onClick={() => setDeletingItem({ section: "engagementModels", item: m })}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </MiniBtn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: INDUSTRIES PAGE ALL-IN-ONE HUB */}
      {/* ========================================================================= */}
      {activeTab === "industries" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-navy font-bold">
                <Factory className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Industries & Sectors Manager</h3>
                <p className="text-xs text-muted">Manage all {industries.length} industrial sectors and custom background photography on /industries.</p>
              </div>
            </div>
            <MiniBtn
              tone="primary"
              onClick={() => {
                setDraftSection("industries");
                setEditing(null);
                setDraft({
                  name: "",
                  image: "",
                  description: "",
                  capabilities: [],
                  featured: false,
                });
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add New Industry Sector</span>
            </MiniBtn>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, idx) => (
              <div key={ind.id || idx} className="rounded-2xl border border-line bg-surface overflow-hidden flex flex-col justify-between">
                <div className="relative aspect-[16/10] bg-navy overflow-hidden">
                  {ind.image ? (
                    <img src={ind.image} alt={ind.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted">No Image</div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-navy/90 px-3 py-1 text-xs font-bold text-accent border border-accent/30">
                      Sector 0{idx + 1}
                    </span>
                  </div>
                  {ind.featured ? (
                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-[0.65rem] font-bold text-navy shadow-md flex items-center gap-1">
                        <Star className="h-3 w-3 fill-navy" />
                        <span>Header Featured</span>
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold text-foreground">{ind.name}</h4>
                    <p className="mt-2 text-xs text-muted line-clamp-2">{ind.description}</p>
                    {ind.capabilities && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {ind.capabilities.slice(0, 2).map((cap: string) => (
                          <span key={cap} className="rounded-full bg-line/60 px-2 py-0.5 text-[0.65rem] text-muted">
                            {cap}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleIndustryFeatured(ind)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[0.72rem] font-semibold transition-all cursor-pointer ${
                        ind.featured
                          ? "border border-accent bg-accent text-navy font-bold shadow-xs"
                          : "border border-line-strong bg-surface text-muted hover:text-accent hover:border-accent"
                      }`}
                      title={ind.featured ? "Click to remove from Header Hero" : "Click to feature in Header Hero"}
                    >
                      <Star className={`h-3.5 w-3.5 ${ind.featured ? "fill-navy text-navy" : ""}`} />
                      <span>{ind.featured ? "Featured in Hero" : "Set Featured"}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <MiniBtn
                        tone="default"
                        onClick={() => {
                          setDraftSection("industries");
                          setEditing(ind);
                          setDraft({ ...ind });
                        }}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </MiniBtn>
                      <MiniBtn
                        tone="danger"
                        onClick={() => setDeletingItem({ section: "industries", item: ind })}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </MiniBtn>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: CAPABILITIES & SPECIFICATIONS HUB */}
      {/* ========================================================================= */}
      {activeTab === "capabilities" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-navy font-bold">
                <Cpu className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Capabilities & Engineering Domains</h3>
                <p className="text-xs text-muted">
                  Manage engineering domains, machine capabilities, technical parameters, and hero spotlight on <strong>/capabilities</strong>.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <MiniBtn
                tone="primary"
                onClick={() => {
                  setDraftSection("capabilities");
                  setEditing(null);
                  setIsCustomCapCategory(false);
                  setDraft({
                    code: `CAP-0${capabilities.length + 1}`,
                    title: "",
                    tagline: "",
                    category: "Induction Hardening",
                    description: "",
                    image: "",
                    featured: false,
                    metrics: [
                      { label: "Precision", value: "±0.005 mm" },
                      { label: "Trial Run", value: "100% FAT" },
                    ],
                    features: [],
                    deliverables: [],
                  });
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New Capability</span>
              </MiniBtn>
              <Link
                href="/capabilities"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 font-sans text-xs font-semibold text-foreground hover:border-accent hover:text-accent shadow-xs"
              >
                <span>View Public Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Capabilities Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap: any) => {
              const isHeroFeatured = Boolean(cap.featured);
              return (
                <div
                  key={cap.id || cap.code}
                  className={`rounded-2xl border bg-surface p-5 transition-all flex flex-col justify-between ${
                    isHeroFeatured
                      ? "border-accent shadow-md ring-1 ring-accent/30"
                      : "border-line hover:border-line-strong shadow-xs"
                  }`}
                >
                  <div>
                    {/* Thumbnail & Badges */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-navy mb-4">
                      {cap.image ? (
                        <img
                          src={cap.image}
                          alt={cap.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-sans text-xs text-accent">
                          No Photo
                        </div>
                      )}

                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        <span className="rounded-md bg-navy/90 px-2 py-0.5 text-[0.65rem] font-bold text-onnavy">
                          {cap.code || "CAP"}
                        </span>
                        <span className="rounded-md bg-navy/90 px-2 py-0.5 text-[0.65rem] font-bold text-onnavy">
                          {cap.category || "Domain"}
                        </span>
                        {isHeroFeatured && (
                          <span className="rounded-md bg-accent px-2 py-0.5 text-[0.65rem] font-bold text-navy flex items-center gap-1">
                            <Sparkles className="h-3 w-3 fill-navy" />
                            ★ Header Hero
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="font-display text-base font-bold text-foreground leading-snug">
                      {cap.title}
                    </h4>
                    {cap.tagline && (
                      <span className="text-[0.68rem] font-bold text-accent uppercase tracking-wider block mt-0.5">
                        {cap.tagline}
                      </span>
                    )}

                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {cap.description}
                    </p>

                    {cap.features && cap.features.length > 0 && (
                      <div className="mt-3 border-t border-line pt-2.5">
                        <span className="text-[0.65rem] font-bold text-muted uppercase block mb-1">
                          Key Capabilities ({cap.features.length})
                        </span>
                        <ul className="space-y-1">
                          {cap.features.slice(0, 2).map((feat: string, fIdx: number) => (
                            <li key={fIdx} className="text-[0.7rem] text-muted flex items-start gap-1.5">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions & Exclusive Hero Toggle */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
                    <button
                      type="button"
                      onClick={() => toggleCapabilityFeatured(cap)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isHeroFeatured
                          ? "bg-accent text-navy font-bold shadow-xs"
                          : "bg-surface border border-line text-muted hover:border-accent hover:text-accent"
                      }`}
                      title="Toggle /capabilities page hero spotlight card"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>{isHeroFeatured ? "★ In Hero" : "Set Hero"}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <MiniBtn
                        onClick={() => {
                          setDraftSection("capabilities");
                          setEditing(cap);
                          const isCustom = Boolean(cap?.category && !DEFAULT_CAPABILITY_CATEGORIES.includes(cap.category));
                          setIsCustomCapCategory(isCustom);
                          setDraft({ ...cap });
                        }}
                        title="Edit Capability"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </MiniBtn>
                      <MiniBtn
                        tone="danger"
                        onClick={() => setDeletingItem({ section: "capabilities", item: cap })}
                        title="Delete Capability"
                      >
                        <Trash2 className="h-3 w-3" />
                      </MiniBtn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Induction Hardening Technical Specification Matrix Module */}
          <Panel
            title="Induction Hardening Technical Specs Matrix (Machine Selection & Sequence)"
            action={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetMatrixOrder}
                  disabled={savingMatrixOrder}
                  className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground hover:border-accent transition cursor-pointer"
                  title="Reset to default category machines"
                >
                  Reset Default
                </button>
                <Link
                  href="/admin/projects"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-navy transition shadow-xs"
                >
                  <span>Projects Studio</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            }
          >
            <p className="text-xs text-muted mb-4 font-sans">
              Choose which machines from your <strong>Projects</strong> appear in the Technical Matrix on <strong>/capabilities</strong> and rearrange their sequence (<strong>IH-01</strong>, <strong>IH-02</strong>, etc.).
            </p>

            {/* Quick Add Machine Bar */}
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-4">
              <div className="flex-1 min-w-[240px]">
                <label className="block text-[0.7rem] font-bold uppercase tracking-wider text-muted mb-1">
                  Add Machine from Projects
                </label>
                <select
                  value={selectedAddProjectId}
                  onChange={(e) => setSelectedAddProjectId(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-foreground outline-none focus:border-accent"
                >
                  <option value="">-- Select a project to add to matrix --</option>
                  {availableProjectsToAdd.map((p: any) => (
                    <option key={p.id || p._id} value={p.id || p._id}>
                      [{p.category || "Project"}] {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 sm:pt-5">
                <button
                  type="button"
                  disabled={!selectedAddProjectId || savingMatrixOrder}
                  onClick={handleAddProjectToMatrix}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-navy hover:bg-accent-hover transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add to Matrix</span>
                </button>
              </div>
            </div>

            {/* Matrix Cards Grid */}
            {matrixProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-8 text-center">
                <p className="text-xs text-muted">No machines currently in the Technical Matrix.</p>
                <p className="text-[0.7rem] text-muted mt-1">Select a machine from the dropdown above to add it.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {matrixProjects.map((m: any, idx: number) => {
                  const mId = m.id || m._id;
                  const rawList =
                    Array.isArray(m.specs) && m.specs.length > 0
                      ? m.specs
                      : Array.isArray(m.parameters) && m.parameters.length > 0
                        ? m.parameters
                        : [];

                  const mSpecs = rawList.map((s: any) => ({
                    label: s.label || s.key || "Parameter",
                    value: s.value || "Custom",
                  }));

                  return (
                    <div
                      key={mId || idx}
                      className="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-xs hover:border-accent/60 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
                          <span className="rounded-full bg-navy px-2.5 py-0.5 text-[0.65rem] font-bold text-accent">
                            {`IH-0${idx + 1}`}
                          </span>
                          <span className="text-[0.68rem] font-bold text-muted uppercase truncate max-w-[140px]">
                            {m.industry || m.category || "Machinery"}
                          </span>
                        </div>

                        <h4 className="mt-3 font-display text-sm font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
                          {m.title}
                        </h4>

                        {/* Specs Matrix Preview */}
                        {mSpecs.length > 0 ? (
                          <div className="mt-3 space-y-1.5 border-t border-line/60 pt-3">
                            {mSpecs.slice(0, 3).map((sp: any, spIdx: number) => (
                              <div
                                key={spIdx}
                                className="flex items-center justify-between text-xs rounded-lg bg-background px-2.5 py-1.5 border border-line/40"
                              >
                                <span className="text-[0.7rem] font-medium text-muted truncate pr-2">
                                  {sp.label}
                                </span>
                                <span className="font-bold font-mono text-[0.72rem] text-accent truncate">
                                  {sp.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-3 border-t border-line/60 pt-3 text-[0.7rem] text-muted italic">
                            Specs configured in Projects Studio
                          </div>
                        )}
                      </div>

                      {/* Rearrange & Remove Controls */}
                      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0 || savingMatrixOrder}
                            onClick={() => handleMoveMatrixProject(idx, "left")}
                            className="rounded-lg border border-line bg-background px-2.5 py-1 text-xs font-bold text-muted hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                            title="Move Left / Up"
                          >
                            ← Move Left
                          </button>
                          <button
                            type="button"
                            disabled={idx === matrixProjects.length - 1 || savingMatrixOrder}
                            onClick={() => handleMoveMatrixProject(idx, "right")}
                            className="rounded-lg border border-line bg-background px-2.5 py-1 text-xs font-bold text-muted hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                            title="Move Right / Down"
                          >
                            Move Right →
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveProjectFromMatrix(mId)}
                          disabled={savingMatrixOrder}
                          className="rounded-lg border border-line bg-background p-1.5 text-xs text-muted hover:border-danger hover:text-danger transition cursor-pointer"
                          title="Remove from Matrix (does not delete project)"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: ABOUT US PAGE HUB */}
      {/* ========================================================================= */}
      {activeTab === "about" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-navy font-bold">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">About Us Page Content</h3>
                <p className="text-xs text-muted">Company story, manufacturing philosophy, vision, mission, and leadership message.</p>
              </div>
            </div>
            <MiniBtn tone="primary" disabled={savingSection} onClick={() => saveSingle("company", company)}>
              <Save className="h-3.5 w-3.5" />
              <span>{savingSection ? "Saving..." : "Save About Us Content"}</span>
            </MiniBtn>
          </div>

          <Panel title="Company Overview, Story & Facility Details">
            <p className="text-xs text-muted mb-6">
              These fields power the story, vision & mission cards, and founder guarantee on the public <strong>/about</strong> page.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField
                  label="Company Narrative & Story (25+ Years Legacy)"
                  value={company.description}
                  onChange={(v) => setCompany("description", v)}
                  rows={4}
                  placeholder="Industrial machinery manufacturing company in Pune..."
                />
                <span className="mt-1 block text-[0.7rem] text-muted">
                  Displays as the main narrative paragraph directly beneath the headline on the About page Hero.
                </span>
              </div>

              <div>
                <TextField
                  label="Company Vision Statement"
                  value={company.vision}
                  onChange={(v) => setCompany("vision", v)}
                  rows={3}
                  placeholder="To be the benchmark in precision induction machinery..."
                />
                <span className="mt-1 block text-[0.7rem] text-muted">
                  Displays inside the dedicated "Company Vision" card on the About page.
                </span>
              </div>

              <div>
                <TextField
                  label="Company Mission Statement"
                  value={company.mission}
                  onChange={(v) => setCompany("mission", v)}
                  rows={3}
                  placeholder="Deliver defect-free custom machine systems..."
                />
                <span className="mt-1 block text-[0.7rem] text-muted">
                  Displays inside the dedicated "Company Mission" card on the About page.
                </span>
              </div>

              <div className="sm:col-span-2">
                <TextField
                  label="Leadership & Founder Name"
                  value={company.contactPerson}
                  onChange={(v) => setCompany("contactPerson", v)}
                  placeholder="e.g. Founder & Head of Works"
                />
                <span className="mt-1 block text-[0.7rem] text-muted">
                  Displays as the signatory in the "Our Quality Commitment" section on the About page.
                </span>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 6: CONTACT & COMPANY INFO HUB */}
      {/* ========================================================================= */}
      {activeTab === "contact" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-navy font-bold">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Company Contact Details</h3>
                <p className="text-xs text-muted">Phone numbers, emails, Pune workshop address, and working hours.</p>
              </div>
            </div>
            <MiniBtn tone="primary" disabled={savingSection} onClick={() => saveSingle("company", company)}>
              <Save className="h-3.5 w-3.5" />
              <span>{savingSection ? "Saving..." : "Save Contact Info"}</span>
            </MiniBtn>
          </div>

          <Panel title="Direct Communication & Workshop Physical Location">
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                label="Direct Phone / WhatsApp Number"
                value={company.phone}
                onChange={(v) => setCompany("phone", v)}
                placeholder="+91 98765 43210"
              />

              <TextField
                label="Official Email Address"
                value={company.email}
                onChange={(v) => setCompany("email", v)}
                placeholder="sales@threestarenterprises.com"
              />

              <TextField
                label="Official Website URL"
                value={company.website}
                onChange={(v) => setCompany("website", v)}
                placeholder="https://threestarenterprises.com"
              />

              <TextField
                label="Working Hours"
                value={(company as any).hours || "Monday - Saturday: 8:30 AM - 6:30 PM"}
                onChange={(v) => setCompany("hours", v)}
                placeholder="Monday - Saturday: 8:30 AM - 6:30 PM"
              />

              <div className="sm:col-span-2">
                <TextField
                  label="Pune Workshop Physical Address"
                  value={company.address}
                  onChange={(v) => setCompany("address", v)}
                  rows={3}
                  placeholder="Plot No., Industrial Area, Dehu Gaon, Pune - 412109, Maharashtra, India"
                />
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 7: CLIENT REVIEWS (TESTIMONIALS) HUB */}
      {/* ========================================================================= */}
      {activeTab === "testimonials" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-navy font-bold">
                <MessageSquareQuote className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Client Reviews & Testimonials</h3>
                <p className="text-xs text-muted">Manage verified client reviews displayed in the feedback section.</p>
              </div>
            </div>
            <MiniBtn
              tone="primary"
              onClick={() => {
                setDraftSection("testimonials");
                setEditing(null);
                setDraft({
                  author: "",
                  role: "",
                  quote: "",
                });
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add New Review</span>
            </MiniBtn>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {testimonials.map((t, idx) => (
              <div key={t.id || idx} className="rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between">
                <div>
                  <p className="text-sm italic leading-relaxed text-foreground">"{t.quote}"</p>
                  <div className="mt-4 pt-3 border-t border-line">
                    <h5 className="font-display text-sm font-bold text-foreground">{t.author}</h5>
                    <p className="text-xs text-accent font-medium mt-0.5">{t.role}</p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-line flex items-center justify-end gap-2">
                  <MiniBtn
                    tone="default"
                    onClick={() => {
                      setDraftSection("testimonials");
                      setEditing(t);
                      setDraft({ ...t });
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </MiniBtn>
                  <MiniBtn
                    tone="danger"
                    onClick={() => setDeletingItem({ section: "testimonials", item: t })}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </MiniBtn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 8: FREQUENTLY ASKED QUESTIONS (FAQ) HUB */}
      {/* ========================================================================= */}
      {activeTab === "faqs" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-navy font-bold">
                <HelpCircle className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Frequently Asked Questions (FAQ)</h3>
                <p className="text-xs text-muted">Manage question & answer accordion items on the website.</p>
              </div>
            </div>
            <MiniBtn
              tone="primary"
              onClick={() => {
                setDraftSection("faqs");
                setEditing(null);
                setDraft({
                  question: "",
                  answer: "",
                });
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add New Question</span>
            </MiniBtn>
          </div>

          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div key={f.id || idx} className="rounded-2xl border border-line bg-surface p-6 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-display text-base font-bold text-foreground">{f.question || (f as any).q}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{f.answer || (f as any).a}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <MiniBtn
                    tone="default"
                    onClick={() => {
                      setDraftSection("faqs");
                      setEditing(f);
                      setDraft({
                        question: f.question || (f as any).q,
                        answer: f.answer || (f as any).a,
                      });
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </MiniBtn>
                  <MiniBtn
                    tone="danger"
                    onClick={() => setDeletingItem({ section: "faqs", item: f })}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </MiniBtn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT DRAFT ITEM */}
      {/* ========================================================================= */}
      {draft && draftSection && (
        <AdminModal
          isOpen={Boolean(draft && draftSection)}
          title={editing ? `Edit ${draftSection.slice(0, -1)}` : `Add New ${draftSection.slice(0, -1)}`}
          onClose={() => {
            setDraft(null);
            setEditing(null);
            setDraftSection(null);
          }}
          footer={
            <div className="flex items-center justify-end gap-3">
              <MiniBtn
                tone="default"
                onClick={() => {
                  setDraft(null);
                  setEditing(null);
                  setDraftSection(null);
                }}
              >
                Cancel
              </MiniBtn>
              <MiniBtn tone="primary" onClick={() => saveItem(draftSection)}>
                <Save className="h-3.5 w-3.5" />
                <span>Save Item</span>
              </MiniBtn>
            </div>
          }
        >
          <div className="space-y-5">
            {draftSection === "services" && (
              <>
                <Toggle
                  label="Featured in Header Hero Spotlight"
                  checked={Boolean(draft.featured)}
                  onChange={(val) => setDraft({ ...draft, featured: val })}
                  description="When enabled, this engineering service and its photo will be showcased in the /services header."
                />

                <TextField
                  label="Service Code"
                  value={draft.code}
                  onChange={(v) => setDraft({ ...draft, code: v })}
                  placeholder="e.g. SRV-01"
                />
                <TextField
                  label="Service Title"
                  value={draft.title}
                  onChange={(v) => setDraft({ ...draft, title: v })}
                  placeholder="e.g. Induction Hardening Systems"
                />
                <div className="space-y-2">
                  <div className="relative">
                    <TextField
                      label="Service Cover Photo URL"
                      value={draft.image || ""}
                      onChange={(v) => setDraft({ ...draft, image: v })}
                      placeholder="https://... or upload photo file below"
                    />
                    {draft.image && (
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, image: "" })}
                        className="absolute top-9 right-3 text-muted hover:text-danger p-1 text-xs cursor-pointer"
                        title="Clear photo"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={imageInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "image")}
                    />
                    <MiniBtn
                      tone="default"
                      disabled={uploadingImage}
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingImage ? "Uploading Photo..." : "Upload Photo File"}</span>
                    </MiniBtn>
                    {draft.image ? (
                      <MiniBtn
                        tone="danger"
                        onClick={() => setDraft((prev: any) => ({ ...prev, image: "" }))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove Photo</span>
                      </MiniBtn>
                    ) : null}
                    {draft.image && (
                      <span className="text-xs text-accent font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                        <span>Photo attached</span>
                      </span>
                    )}
                  </div>
                  {draft.image && (
                    <div className="mt-2 h-28 w-44 rounded-xl overflow-hidden border border-line bg-navy relative group">
                      <img src={draft.image} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setDraft((prev: any) => ({ ...prev, image: "" }))}
                        className="absolute top-1.5 right-1.5 rounded-full bg-navy/80 p-1.5 text-danger hover:bg-danger hover:text-white transition-all shadow-md cursor-pointer"
                        title="Remove Photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <TextField
                  label="Technical Summary"
                  value={draft.summary}
                  onChange={(v) => setDraft({ ...draft, summary: v })}
                  rows={3}
                  placeholder="Comprehensive explanation of the service..."
                />
                <TextField
                  label="Service Bullet Points (one per line)"
                  value={(draft.points || []).join("\n")}
                  onChange={(v) =>
                    setDraft({
                      ...draft,
                      points: v.split("\n").map((s: string) => s.trim()).filter(Boolean),
                    })
                  }
                  rows={4}
                  placeholder="Custom coil geometry\nServo-driven scanning\nQuench manifold routing"
                />
                <TextField
                  label="Direct Outcome / Value Result"
                  value={draft.outcome}
                  onChange={(v) => setDraft({ ...draft, outcome: v })}
                  rows={2}
                  placeholder="e.g. A complete, ready-to-build drawing package for your machine."
                />
              </>
            )}

            {draftSection === "engagementModels" && (
              <>
                <TextField
                  label="Model Title"
                  value={draft.title}
                  onChange={(v) => setDraft({ ...draft, title: v })}
                  placeholder="e.g. 1. 3D Design & Blueprints Only"
                />
                <TextField
                  label="Badge Pill"
                  value={draft.badge}
                  onChange={(v) => setDraft({ ...draft, badge: v })}
                  placeholder="e.g. DESIGN ONLY"
                />
                <TextField
                  label="Header Tagline"
                  value={draft.tagline}
                  onChange={(v) => setDraft({ ...draft, tagline: v })}
                  placeholder="e.g. FOR OEMS WITH INTERNAL MANUFACTURING CAPACITY"
                />
                <div className="space-y-2">
                  <div className="relative">
                    <TextField
                      label="Cover Photo URL"
                      value={draft.image || ""}
                      onChange={(v) => setDraft({ ...draft, image: v })}
                      placeholder="https://... or upload photo file below"
                    />
                    {draft.image && (
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, image: "" })}
                        className="absolute top-9 right-3 text-muted hover:text-danger p-1 text-xs cursor-pointer"
                        title="Clear photo"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={imageInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "image")}
                    />
                    <MiniBtn
                      tone="default"
                      disabled={uploadingImage}
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingImage ? "Uploading Photo..." : "Upload Photo File"}</span>
                    </MiniBtn>
                    {draft.image ? (
                      <MiniBtn
                        tone="danger"
                        onClick={() => setDraft((prev: any) => ({ ...prev, image: "" }))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove Photo</span>
                      </MiniBtn>
                    ) : null}
                    {draft.image && (
                      <span className="text-xs text-accent font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                        <span>Photo attached</span>
                      </span>
                    )}
                  </div>
                  {draft.image && (
                    <div className="mt-2 h-28 w-44 rounded-xl overflow-hidden border border-line bg-navy relative group">
                      <img src={draft.image} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setDraft((prev: any) => ({ ...prev, image: "" }))}
                        className="absolute top-1.5 right-1.5 rounded-full bg-navy/80 p-1.5 text-danger hover:bg-danger hover:text-white transition-all shadow-md cursor-pointer"
                        title="Remove Photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <TextField
                  label="Description"
                  value={draft.description || draft.desc}
                  onChange={(v) => setDraft({ ...draft, description: v, desc: v })}
                  rows={3}
                  placeholder="Explanation of this partnership model..."
                />
                <TextField
                  label="Included Deliverables (one per line)"
                  value={(draft.deliverables || []).join("\n")}
                  onChange={(v) =>
                    setDraft({
                      ...draft,
                      deliverables: v.split("\n").map((s: string) => s.trim()).filter(Boolean),
                    })
                  }
                  rows={4}
                  placeholder="Full 3D CAD Assembly & Part Models\n2D Detailed Manufacturing Blueprints\nComprehensive Bill of Materials (BOM)"
                />
              </>
            )}

            {draftSection === "industries" && (
              <>
                <Toggle
                  label="Featured in Header Hero Spotlight"
                  checked={Boolean(draft.featured)}
                  onChange={(val) => setDraft({ ...draft, featured: val })}
                  description="When enabled, this industry sector and its photo will be showcased in the /industries header."
                />

                <TextField
                  label="Industry Sector Name"
                  value={draft.name}
                  onChange={(v) => setDraft({ ...draft, name: v })}
                  placeholder="e.g. Automotive & Transmission"
                  required
                />
                <div className="space-y-2">
                  <div className="relative">
                    <TextField
                      label="Cover Image URL"
                      value={draft.image || ""}
                      onChange={(v) => setDraft({ ...draft, image: v })}
                      placeholder="https://... or upload below"
                    />
                    {draft.image && (
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, image: "" })}
                        className="absolute top-9 right-3 text-muted hover:text-danger p-1 text-xs cursor-pointer"
                        title="Clear photo"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={imageInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "image")}
                    />
                    <MiniBtn
                      tone="default"
                      disabled={uploadingImage}
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingImage ? "Uploading..." : "Upload Photo File"}</span>
                    </MiniBtn>
                    {draft.image ? (
                      <MiniBtn
                        tone="danger"
                        onClick={() => setDraft((prev: any) => ({ ...prev, image: "" }))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove Photo</span>
                      </MiniBtn>
                    ) : null}
                    {draft.image && (
                      <span className="text-xs text-accent font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                        <span>Photo attached</span>
                      </span>
                    )}
                  </div>
                  {draft.image && (
                    <div className="mt-2 h-28 w-44 rounded-xl overflow-hidden border border-line bg-navy relative group">
                      <img src={draft.image} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setDraft((prev: any) => ({ ...prev, image: "" }))}
                        className="absolute top-1.5 right-1.5 rounded-full bg-navy/80 p-1.5 text-danger hover:bg-danger hover:text-white transition-all shadow-md cursor-pointer"
                        title="Remove Photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <TextField
                  label="Sector Description"
                  value={draft.description}
                  onChange={(v) => setDraft({ ...draft, description: v })}
                  rows={3}
                  placeholder="Scope of work for this industry..."
                />
                <TextField
                  label="Capability Tags (one per line)"
                  value={(draft.capabilities || []).join("\n")}
                  onChange={(v) =>
                    setDraft({
                      ...draft,
                      capabilities: v.split("\n").map((s: string) => s.trim()).filter(Boolean),
                    })
                  }
                  rows={3}
                  placeholder="Pneumatic loader\nSS 316L Sanitary weld\n1200°C Heat resistant chain"
                />
              </>
            )}

            {draftSection === "capabilities" && (
              <>
                <Toggle
                  label="Featured in Capabilities Header Spotlight"
                  checked={Boolean(draft.featured)}
                  onChange={(val) => setDraft({ ...draft, featured: val })}
                  description="When enabled, this capability domain and its photo will be showcased in the /capabilities header card."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Capability Code"
                    value={draft.code}
                    onChange={(v) => setDraft({ ...draft, code: v })}
                    placeholder="e.g. CAP-01"
                    required
                  />

                  {/* Dynamic Category Selector (Choose Existing or Type Custom) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Domain Category <span className="text-danger">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCustomCapCategory(!isCustomCapCategory)}
                        className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {isCustomCapCategory ? "📁 Choose from Existing" : "✏️ + Type Custom"}
                      </button>
                    </div>

                    {isCustomCapCategory ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={draft.category || ""}
                          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                          placeholder="Type custom domain category name..."
                          className="w-full rounded-xl border border-line bg-background px-3 py-2 text-xs font-medium text-foreground outline-none transition-all focus:border-accent placeholder:text-muted"
                          autoFocus
                        />
                        {/* Quick Suggestion Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[0.68rem] text-muted font-medium mr-1">Suggestions:</span>
                          {capabilityCategoryNames
                            .slice(0, 5)
                            .map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setDraft({ ...draft, category: cat })}
                                className="rounded-lg border border-line bg-surface px-2 py-0.5 text-[0.68rem] text-muted hover:border-accent hover:text-accent transition-all cursor-pointer"
                              >
                                {cat}
                              </button>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="relative">
                          <select
                            value={
                              capabilityCategoryNames.includes(draft.category)
                                ? draft.category
                                : draft.category
                                ? "custom"
                                : ""
                            }
                            onChange={(e) => {
                              if (e.target.value === "custom") {
                                setIsCustomCapCategory(true);
                              } else {
                                setDraft({ ...draft, category: e.target.value });
                              }
                            }}
                            className="w-full appearance-none rounded-xl border border-line bg-background px-3 py-2 pr-9 text-xs font-medium text-foreground outline-none transition-all focus:border-accent hover:border-line-strong cursor-pointer"
                          >
                            <option value="" disabled>
                              -- Select Existing Category --
                            </option>
                            {capabilityCategoryNames.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                            <option value="custom">✏️ + Type New / Custom Category...</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                        </div>

                        {/* Quick 1-Click Selection Pills */}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {capabilityCategoryNames.slice(0, 4).map((cat) => {
                            const isSelected = draft.category === cat;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setDraft({ ...draft, category: cat })}
                                className={`rounded-lg border px-2 py-0.5 text-[0.68rem] font-semibold transition-all cursor-pointer ${
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
                </div>

                <TextField
                  label="Capability Title"
                  value={draft.title}
                  onChange={(v) => setDraft({ ...draft, title: v })}
                  placeholder="e.g. Induction Hardening Machinery & Quench Systems"
                  required
                />

                <TextField
                  label="Tagline / Header Subtitle"
                  value={draft.tagline}
                  onChange={(v) => setDraft({ ...draft, tagline: v })}
                  placeholder="e.g. Vertical & Horizontal Scanning Systems"
                />

                <div className="space-y-2">
                  <div className="relative">
                    <TextField
                      label="Cover Image URL"
                      value={draft.image || ""}
                      onChange={(v) => setDraft({ ...draft, image: v })}
                      placeholder="https://... or upload below"
                    />
                    {draft.image && (
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, image: "" })}
                        className="absolute top-9 right-3 text-muted hover:text-danger p-1 text-xs cursor-pointer"
                        title="Clear photo"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={imageInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "image")}
                    />
                    <MiniBtn
                      tone="default"
                      disabled={uploadingImage}
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingImage ? "Uploading..." : "Upload Photo File"}</span>
                    </MiniBtn>
                    {draft.image ? (
                      <MiniBtn
                        tone="danger"
                        onClick={() => setDraft((prev: any) => ({ ...prev, image: "" }))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove Photo</span>
                      </MiniBtn>
                    ) : null}
                    {draft.image && (
                      <span className="text-xs text-accent font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                        <span>Photo attached</span>
                      </span>
                    )}
                  </div>
                  {draft.image && (
                    <div className="mt-2 h-28 w-44 rounded-xl overflow-hidden border border-line bg-navy relative group">
                      <img src={draft.image} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setDraft((prev: any) => ({ ...prev, image: "" }))}
                        className="absolute top-1.5 right-1.5 rounded-full bg-navy/80 p-1.5 text-danger hover:bg-danger hover:text-white transition-all shadow-md cursor-pointer"
                        title="Remove Photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Operating & Performance Parameter Metrics */}
                <div className="space-y-2 rounded-2xl border border-line bg-background p-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Performance Parameters & Metrics ({draft.metrics?.length || 0})
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          metrics: [
                            ...(draft.metrics || []),
                            { label: "Specification", value: "Parameter Value" },
                          ],
                        })
                      }
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Metric</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(draft.metrics || []).map((m: any, mIdx: number) => (
                      <div key={mIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={m.label || ""}
                          onChange={(e) => {
                            const newMetrics = [...(draft.metrics || [])];
                            newMetrics[mIdx] = { ...newMetrics[mIdx], label: e.target.value };
                            setDraft({ ...draft, metrics: newMetrics });
                          }}
                          placeholder="Label (e.g. Max Power)"
                          className="w-1/2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-accent"
                        />
                        <input
                          type="text"
                          value={m.value || ""}
                          onChange={(e) => {
                            const newMetrics = [...(draft.metrics || [])];
                            newMetrics[mIdx] = { ...newMetrics[mIdx], value: e.target.value };
                            setDraft({ ...draft, metrics: newMetrics });
                          }}
                          placeholder="Value (e.g. 250 kW Solid State)"
                          className="w-1/2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-bold text-accent outline-none focus:border-accent"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newMetrics = (draft.metrics || []).filter((_: any, i: number) => i !== mIdx);
                            setDraft({ ...draft, metrics: newMetrics });
                          }}
                          className="rounded-lg p-1 text-muted hover:text-danger hover:bg-surface transition-all cursor-pointer"
                          title="Remove Metric"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <TextField
                  label="Detailed Domain Description"
                  value={draft.description}
                  onChange={(v) => setDraft({ ...draft, description: v })}
                  rows={3}
                  placeholder="Summary of engineering and manufacturing scope..."
                />

                <TextField
                  label="Key Technical Features (one per line)"
                  value={(draft.features || []).join("\n")}
                  onChange={(v) =>
                    setDraft({
                      ...draft,
                      features: v.split("\n").map((s: string) => s.trim()).filter(Boolean),
                    })
                  }
                  rows={4}
                  placeholder="Vertical scanning machinery with high-precision servo ballscrew drive\nIntegrated stainless steel quench ring with temperature control\nDual-spindle high-throughput configurations"
                />

                <TextField
                  label="Deliverables & Hardware Inclusions (one per line)"
                  value={(draft.deliverables || []).join("\n")}
                  onChange={(v) =>
                    setDraft({
                      ...draft,
                      deliverables: v.split("\n").map((s: string) => s.trim()).filter(Boolean),
                    })
                  }
                  rows={3}
                  placeholder="Complete PLC / CNC Control Cabinets with Touch HMI\nCustom CNC-Wound Induction Heating Coils\n100% FAT Trial Verification"
                />
              </>
            )}

            {draftSection === "testimonials" && (
              <>
                <TextField
                  label="Client Name"
                  value={draft.author}
                  onChange={(v) => setDraft({ ...draft, author: v })}
                  placeholder="e.g. Rajesh Sharma"
                />
                <TextField
                  label="Designation & Company"
                  value={draft.role}
                  onChange={(v) => setDraft({ ...draft, role: v })}
                  placeholder="e.g. Head of Plant Operations, Automech Corp"
                />
                <TextField
                  label="Client Review Quote"
                  value={draft.quote}
                  onChange={(v) => setDraft({ ...draft, quote: v })}
                  rows={4}
                  placeholder="Feedback quote from the client..."
                />
              </>
            )}

            {draftSection === "faqs" && (
              <>
                <TextField
                  label="Question"
                  value={draft.question}
                  onChange={(v) => setDraft({ ...draft, question: v })}
                  placeholder="e.g. What is the typical machine delivery timeline?"
                />
                <TextField
                  label="Detailed Answer"
                  value={draft.answer}
                  onChange={(v) => setDraft({ ...draft, answer: v })}
                  rows={4}
                  placeholder="Comprehensive answer explaining timeline, FAT testing, and dispatch..."
                />
              </>
            )}
          </div>
        </AdminModal>
      )}

      {/* Confirmation Delete Modal */}
      {deletingItem && (
        <ConfirmDeleteModal
          isOpen={Boolean(deletingItem)}
          onClose={() => setDeletingItem(null)}
          title={`Delete ${deletingItem.section.slice(0, -1)}`}
          message={`Are you sure you want to delete "${
            deletingItem.item.name ||
            deletingItem.item.title ||
            deletingItem.item.question ||
            deletingItem.item.author ||
            "this item"
          }"? This cannot be undone.`}
          isDeleting={isDeleting}
          onConfirm={handleDeleteItem}
        />
      )}

    </div>
  );
}

export default function AdminContentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-muted font-sans text-sm">
          Loading Page Manager...
        </div>
      }
    >
      <AdminContentPageInner />
    </Suspense>
  );
}
