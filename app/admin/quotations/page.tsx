"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AdminHead,
  MiniBtn,
  StatusBadge,
  EmptyState,
  AdminModal,
  ConfirmDeleteModal,
} from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";
import { Quotation, QuotationLineItem, QuotationStatus } from "@/types";
import { formatINR, numberToIndianWords } from "@/lib/numberToWords";
import { downloadQuotationDirectly, downloadQuotationPDF } from "@/lib/pdfExport";
import {
  FileText,
  Search,
  Plus,
  RotateCw,
  Trash2,
  Edit3,
  Eye,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  Building,
  Phone,
  Mail,
  MapPin,
  Flame,
  Calendar,
  Layers,
  FileSpreadsheet,
  Check,
  Copy,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  Filter,
  ShieldCheck,
  TrendingUp,
  Receipt,
  X,
} from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Induction Hardening",
  "Material Handling & Conveyors",
  "CNC Machine Building & SPM",
  "Inspection & Metrology",
  "Plant Automation & Robotics",
  "Refurbishment & Retrofitting",
];

const BLANK_LINE_ITEM: QuotationLineItem = {
  description: "",
  hsnCode: "",
  quantity: 1,
  unit: "Nos",
  unitPrice: 0,
  discountPercent: 0,
  taxPercent: 18,
  amount: 0,
};

function QuotationsPageInner() {
  const {
    quotations,
    quotationsLoading,
    fetchQuotations,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    enquiries,
  } = useSite();

  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("All Categories");
  const [filterPeriod, setFilterPeriod] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "value-high" | "value-low" | "client">("newest");

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [deletingQuotation, setDeletingQuotation] = useState<Quotation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [flashMsg, setFlashMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Editor Form State - Completely empty for user input
  const [formQuoteNumber, setFormQuoteNumber] = useState("");
  const [formRfqId, setFormRfqId] = useState("");
  const [formClientName, setFormClientName] = useState("");
  const [formClientCompany, setFormClientCompany] = useState("");
  const [formClientDesignation, setFormClientDesignation] = useState("");
  const [formClientEmail, setFormClientEmail] = useState("");
  const [formClientPhone, setFormClientPhone] = useState("");
  const [formClientGstin, setFormClientGstin] = useState("");
  const [formBillingAddress, setFormBillingAddress] = useState("");
  const [formPlantLocation, setFormPlantLocation] = useState("");
  const [formProjectTitle, setFormProjectTitle] = useState("");
  const [formProjectCategory, setFormProjectCategory] = useState("Induction Hardening");
  const [formRefDocName, setFormRefDocName] = useState("");
  const [formRefDocUrl, setFormRefDocUrl] = useState("");
  const [formLineItems, setFormLineItems] = useState<QuotationLineItem[]>([BLANK_LINE_ITEM]);
  const [formCurrency, setFormCurrency] = useState("INR");
  const [formPaymentTerms, setFormPaymentTerms] = useState("");
  const [formDeliveryTimeline, setFormDeliveryTimeline] = useState("");
  const [formValidityDays, setFormValidityDays] = useState(30);
  const [formWarranty, setFormWarranty] = useState("");
  const [formFreightTerms, setFormFreightTerms] = useState("");
  const [formInspectionFAT, setFormInspectionFAT] = useState("");
  const [formSpecialNotes, setFormSpecialNotes] = useState("");
  const [formStatus, setFormStatus] = useState<QuotationStatus>("draft");

  // Fetch quotations on initial load
  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  // Handle create from RFQ URL parameter: ?createFromRfq=...
  useEffect(() => {
    const rfqId = searchParams.get("createFromRfq");
    if (rfqId && enquiries && enquiries.length > 0) {
      const sourceRfq = enquiries.find((e) => e.id === rfqId || (e as any)._id === rfqId);
      if (sourceRfq) {
        openCreateModalFromRfq(sourceRfq);
      }
    }
  }, [searchParams, enquiries]);

  const flash = (msg: string) => {
    setFlashMsg(msg);
    setTimeout(() => setFlashMsg(null), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    flash("✓ Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open modal prefilled from source RFQ
  const openCreateModalFromRfq = (rfq: any) => {
    const year = new Date().getFullYear();
    const seq = String(quotations.length + 1).padStart(4, "0");
    setFormQuoteNumber(`TSE/QT/${year}/${seq}`);
    setFormRfqId(rfq.id || rfq._id || "");
    setFormClientName(rfq.name || "");
    setFormClientCompany(rfq.company || "");
    setFormClientDesignation("");
    setFormClientEmail(rfq.email || "");
    setFormClientPhone(rfq.phone || "");
    setFormClientGstin("");
    setFormBillingAddress(rfq.location || "");
    setFormPlantLocation(rfq.location || "Pune Works");
    setFormProjectTitle(rfq.machineType ? `${rfq.machineType} Turnkey Build` : "Custom Machinery Build");
    setFormProjectCategory(
      rfq.machineType?.toLowerCase().includes("induction")
        ? "Induction Hardening"
        : rfq.machineType?.toLowerCase().includes("conveyor")
        ? "Material Handling & Conveyors"
        : "CNC Machine Building & SPM",
    );
    setFormRefDocName(rfq.referenceDocumentName || "");
    setFormRefDocUrl(rfq.referenceDocument || "");
    setFormLineItems([
      {
        description: `${rfq.machineType || "Custom Equipment"} - Complete turnkey scope with PLC automation and custom tooling.`,
        hsnCode: "8479",
        quantity: 1,
        unit: "Nos",
        unitPrice: 1850000,
        discountPercent: 0,
        taxPercent: 18,
        amount: 2183000,
      },
    ]);
    setFormSpecialNotes(rfq.message ? `Client Scope Specifications:\n${rfq.message}` : "");
    setFormStatus("draft");
    setEditingQuotation(null);
    setIsEditorOpen(true);
  };

  const openNewModal = () => {
    const year = new Date().getFullYear();
    const seq = String(quotations.length + 1).padStart(4, "0");
    setFormQuoteNumber(`TSE/QT/${year}/${seq}`);
    setFormRfqId("");
    setFormClientName("");
    setFormClientCompany("");
    setFormClientDesignation("");
    setFormClientEmail("");
    setFormClientPhone("");
    setFormClientGstin("");
    setFormBillingAddress("");
    setFormPlantLocation("");
    setFormProjectTitle("");
    setFormProjectCategory("Induction Hardening");
    setFormRefDocName("");
    setFormRefDocUrl("");
    setFormLineItems([{ ...BLANK_LINE_ITEM }]);
    setFormPaymentTerms("");
    setFormDeliveryTimeline("");
    setFormValidityDays(30);
    setFormWarranty("");
    setFormFreightTerms("");
    setFormInspectionFAT("");
    setFormSpecialNotes("");
    setFormStatus("draft");
    setEditingQuotation(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (q: Quotation) => {
    setEditingQuotation(q);
    setFormQuoteNumber(q.quoteNumber);
    setFormRfqId(q.rfqId || "");
    setFormClientName(q.client?.name || "");
    setFormClientCompany(q.client?.company || "");
    setFormClientDesignation(q.client?.designation || "");
    setFormClientEmail(q.client?.email || "");
    setFormClientPhone(q.client?.phone || "");
    setFormClientGstin(q.client?.gstin || "");
    setFormBillingAddress(q.client?.billingAddress || "");
    setFormPlantLocation(q.client?.plantLocation || "");
    setFormProjectTitle(q.project?.title || "");
    setFormProjectCategory(q.project?.category || "Induction Hardening");
    setFormRefDocName(q.project?.referenceDocName || "");
    setFormRefDocUrl(q.project?.referenceDocUrl || "");
    setFormLineItems(
      q.lineItems && q.lineItems.length > 0 ? q.lineItems.map((item) => ({ ...item })) : [{ ...BLANK_LINE_ITEM }],
    );
    setFormPaymentTerms(q.commercialTerms?.paymentTerms || "");
    setFormDeliveryTimeline(q.commercialTerms?.deliveryTimeline || "");
    setFormValidityDays(q.commercialTerms?.validityDays || 30);
    setFormWarranty(q.commercialTerms?.warranty || "");
    setFormFreightTerms(q.commercialTerms?.freightTerms || "");
    setFormInspectionFAT(q.commercialTerms?.inspectionFAT || "");
    setFormSpecialNotes(q.commercialTerms?.specialNotes || "");
    setFormStatus(q.status || "draft");
    setIsEditorOpen(true);
  };

  // Line item helpers
  const handleLineItemChange = (index: number, field: keyof QuotationLineItem, val: any) => {
    setFormLineItems((prev) => {
      const next = [...prev];
      const current = { ...next[index], [field]: val };
      const qty = Number(current.quantity) || 1;
      const rate = Number(current.unitPrice) || 0;
      const discPct = Number(current.discountPercent) || 0;
      const taxPct = Number(current.taxPercent) ?? 18;

      const base = qty * rate;
      const disc = (base * discPct) / 100;
      const taxable = base - disc;
      const tax = (taxable * taxPct) / 100;
      current.amount = Math.round((taxable + tax) * 100) / 100;

      next[index] = current;
      return next;
    });
  };

  const addLineItem = () => {
    setFormLineItems((prev) => [
      ...prev,
      { ...BLANK_LINE_ITEM },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (formLineItems.length <= 1) return;
    setFormLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Live calculations
  const totals = useMemo(() => {
    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    formLineItems.forEach((item) => {
      const qty = Number(item.quantity) || 1;
      const rate = Number(item.unitPrice) || 0;
      const discPct = Number(item.discountPercent) || 0;
      const taxPct = Number(item.taxPercent) ?? 18;

      const base = qty * rate;
      const disc = (base * discPct) / 100;
      const taxable = base - disc;
      const tax = (taxable * taxPct) / 100;

      subtotal += base;
      discountTotal += disc;
      taxTotal += tax;
    });

    const grandTotal = Math.round((subtotal - discountTotal + taxTotal) * 100) / 100;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discountTotal: Math.round(discountTotal * 100) / 100,
      taxTotal: Math.round(taxTotal * 100) / 100,
      grandTotal,
    };
  }, [formLineItems]);

  const handleSaveQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientName.trim() && !formClientCompany.trim()) {
      flash("⚠️ Please enter Contact Person or Company Name");
      return;
    }

    setIsSaving(true);

    const clientName = formClientName.trim() || formClientCompany.trim() || "Client Representative";
    const clientCompany = formClientCompany.trim() || formClientName.trim() || "Client Enterprise";

    // Filter and sanitize line items
    const rawItems = formLineItems.map((item, idx) => ({
      description: item.description?.trim() || `Machinery Equipment Scope #${idx + 1}`,
      hsnCode: item.hsnCode?.trim() || "8479",
      quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
      unit: item.unit || "Nos",
      unitPrice: Number(item.unitPrice) >= 0 ? Number(item.unitPrice) : 0,
      discountPercent: Number(item.discountPercent) || 0,
      taxPercent: Number(item.taxPercent) ?? 18,
      amount: Number(item.amount) || 0,
    }));

    const finalLineItems = rawItems.length > 0 ? rawItems : [
      {
        description: "Custom Industrial Machinery Turnkey Scope",
        hsnCode: "8479",
        quantity: 1,
        unit: "Nos",
        unitPrice: 0,
        discountPercent: 0,
        taxPercent: 18,
        amount: 0,
      },
    ];

    const payload = {
      quoteNumber: formQuoteNumber.trim(),
      rfqId: formRfqId.trim(),
      client: {
        name: clientName,
        company: clientCompany,
        designation: formClientDesignation.trim(),
        email: formClientEmail.trim(),
        phone: formClientPhone.trim(),
        gstin: formClientGstin.trim(),
        billingAddress: formBillingAddress.trim(),
        plantLocation: formPlantLocation.trim(),
      },
      project: {
        title: formProjectTitle.trim() || "Custom Turnkey Machinery Build",
        category: formProjectCategory || "Induction Hardening",
        referenceDocName: formRefDocName.trim(),
        referenceDocUrl: formRefDocUrl.trim(),
      },
      lineItems: finalLineItems,
      currency: formCurrency || "INR",
      commercialTerms: {
        paymentTerms: formPaymentTerms.trim(),
        deliveryTimeline: formDeliveryTimeline.trim(),
        validityDays: formValidityDays || 30,
        warranty: formWarranty.trim(),
        freightTerms: formFreightTerms.trim(),
        inspectionFAT: formInspectionFAT.trim(),
        specialNotes: formSpecialNotes.trim(),
      },
      status: formStatus || "draft",
    };

    if (editingQuotation) {
      const res = await updateQuotation(editingQuotation.id || (editingQuotation as any)._id, payload);
      setIsSaving(false);
      if (res.success) {
        flash("✓ Quotation updated successfully");
        setIsEditorOpen(false);
        fetchQuotations();
      } else {
        flash(`⚠️ Error: ${res.error || "Failed to update"}`);
      }
    } else {
      const res = await createQuotation(payload);
      setIsSaving(false);
      if (res.success) {
        flash("✓ New commercial quotation created and issued successfully");
        setIsEditorOpen(false);
        fetchQuotations();
      } else {
        flash(`⚠️ Error: ${res.error || "Failed to create"}`);
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingQuotation) return;
    setIsDeleting(true);
    const id = deletingQuotation.id || (deletingQuotation as any)._id;
    const res = await deleteQuotation(id);
    setIsDeleting(false);
    setDeletingQuotation(null);
    if (res?.success !== false) {
      flash("✓ Quotation deleted permanently");
    } else {
      flash("⚠️ Failed to delete quotation");
    }
  };

  // Direct PDF Download Trigger: Directly generates clean standalone PDF file and downloads to client disk
  const handleDirectDownload = async (q: Quotation) => {
    const itemId = q.id || (q as any)._id;
    setDownloadingId(itemId);
    flash(`⬇ Downloading official PDF for ${q.quoteNumber}...`);

    try {
      const ok = await downloadQuotationDirectly(q);
      if (ok) {
        flash(`✓ Downloaded ${q.quoteNumber} successfully!`);
      } else {
        window.location.href = `/api/quotations/${itemId}/pdf`;
        flash(`✓ Downloading ${q.quoteNumber} via server...`);
      }
    } catch (e) {
      console.error("Direct PDF download error:", e);
      window.location.href = `/api/quotations/${itemId}/pdf`;
    } finally {
      setDownloadingId(null);
    }
  };

  // Direct Print Trigger: opens preview tab and executes window.print()
  const handlePrint = (q: Quotation) => {
    const id = q.id || (q as any)._id;
    if (!id) return;
    window.open(`/admin/quotations/${id}/preview?print=true`, "_blank");
  };

  // Pipeline metrics calculation
  const stats = useMemo(() => {
    const total = quotations.length;
    const totalVal = quotations.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
    const accepted = quotations.filter((q) => q.status === "accepted");
    const acceptedVal = accepted.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
    const draftCount = quotations.filter((q) => q.status === "draft").length;
    const sentCount = quotations.filter((q) => q.status === "sent" || q.status === "under-review").length;
    const winRate = total > 0 ? Math.round((accepted.length / total) * 100) : 0;

    return {
      total,
      totalVal,
      acceptedCount: accepted.length,
      acceptedVal,
      draftCount,
      sentCount,
      winRate,
    };
  }, [quotations]);

  // Multi-dimensional filtering logic
  const filteredQuotations = useMemo(() => {
    return quotations
      .filter((q) => {
        // Status filter
        if (filterStatus !== "all" && q.status !== filterStatus) return false;

        // Category filter
        if (filterCategory !== "All Categories" && q.project?.category !== filterCategory) return false;

        // Date / Period filter
        if (filterPeriod !== "all" && q.issuedDate) {
          const itemDate = new Date(q.issuedDate).getTime();
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000;
          if (filterPeriod === "week" && now - itemDate > 7 * oneDay) return false;
          if (filterPeriod === "month" && now - itemDate > 30 * oneDay) return false;
          if (filterPeriod === "quarter" && now - itemDate > 90 * oneDay) return false;
          if (filterPeriod === "year" && now - itemDate > 365 * oneDay) return false;
        }

        // Value Range filter
        if (filterValue !== "all") {
          const val = q.grandTotal || 0;
          if (filterValue === "under-5l" && val >= 500000) return false;
          if (filterValue === "5l-20l" && (val < 500000 || val > 2000000)) return false;
          if (filterValue === "20l-50l" && (val < 2000000 || val > 5000000)) return false;
          if (filterValue === "above-50l" && val <= 5000000) return false;
        }

        // Search filter
        if (search.trim()) {
          const s = search.toLowerCase();
          const matchQuote = q.quoteNumber?.toLowerCase().includes(s);
          const matchClient = q.client?.name?.toLowerCase().includes(s);
          const matchCompany = q.client?.company?.toLowerCase().includes(s);
          const matchEmail = q.client?.email?.toLowerCase().includes(s);
          const matchPhone = q.client?.phone?.toLowerCase().includes(s);
          const matchTitle = q.project?.title?.toLowerCase().includes(s);
          const matchLocation = q.client?.plantLocation?.toLowerCase().includes(s);
          if (!matchQuote && !matchClient && !matchCompany && !matchEmail && !matchPhone && !matchTitle && !matchLocation) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || b.issuedDate || 0).getTime() - new Date(a.createdAt || a.issuedDate || 0).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || a.issuedDate || 0).getTime() - new Date(b.createdAt || b.issuedDate || 0).getTime();
        }
        if (sortBy === "value-high") {
          return (b.grandTotal || 0) - (a.grandTotal || 0);
        }
        if (sortBy === "value-low") {
          return (a.grandTotal || 0) - (b.grandTotal || 0);
        }
        if (sortBy === "client") {
          return (a.client?.company || "").localeCompare(b.client?.company || "");
        }
        return 0;
      });
  }, [quotations, filterStatus, filterCategory, filterPeriod, filterValue, search, sortBy]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {flashMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-accent/40 bg-navy/95 px-4 py-3 font-mono text-xs font-bold text-accent shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          {flashMsg}
        </div>
      )}

      {/* Top Header */}
      <AdminHead
        title="Commercial Quotations & Proposals"
        eyebrow="Commercial Sales Studio"
        intro={`${quotations.length} total proposal(s) issued. Manage pipeline values, itemized pricing, and direct document generation.`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <MiniBtn onClick={() => fetchQuotations()} title="Refresh quotation pipeline">
              <RotateCw className="h-3.5 w-3.5" />
            </MiniBtn>
            <button
              type="button"
              onClick={openNewModal}
              className="inline-flex items-center gap-1.5 rounded-xl border border-accent bg-accent text-navy px-4 py-2 font-mono text-xs font-bold hover:bg-navy hover:text-onnavy transition-all shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Generate Quotation</span>
            </button>
          </div>
        }
      />

      {/* PIPELINE METRICS STRIP */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-line bg-surface/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.68rem] uppercase tracking-wider text-muted">Total Issued</span>
            <Receipt className="h-4 w-4 text-accent" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="mt-0.5 text-xs text-muted">
            {stats.sentCount} Active in Review • {stats.draftCount} Drafts
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.68rem] uppercase tracking-wider text-muted">Pipeline Value</span>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-accent">{formatINR(stats.totalVal)}</p>
          <p className="mt-0.5 text-xs text-muted">Across all proposals created</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.68rem] uppercase tracking-wider text-muted">Converted Orders (PO)</span>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-success">{formatINR(stats.acceptedVal)}</p>
          <p className="mt-0.5 text-xs text-muted">{stats.acceptedCount} Orders Finalized</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.68rem] uppercase tracking-wider text-muted">Conversion Rate</span>
            <ShieldCheck className="h-4 w-4 text-accent" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">{stats.winRate}%</p>
          <p className="mt-0.5 text-xs text-muted">Proposal-to-Purchase Order Ratio</p>
        </div>
      </div>

      {/* COMPREHENSIVE FILTER TOOLBAR */}
      <div className="rounded-2xl border border-line bg-surface/90 p-4 space-y-3.5 shadow-sm">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-line pb-3">
          {[
            { id: "all", label: "All Proposals", count: quotations.length },
            { id: "draft", label: "Drafts", count: quotations.filter((q) => q.status === "draft").length },
            { id: "sent", label: "Sent / Issued", count: quotations.filter((q) => q.status === "sent").length },
            { id: "under-review", label: "Under Review", count: quotations.filter((q) => q.status === "under-review").length },
            { id: "accepted", label: "Accepted (PO)", count: quotations.filter((q) => q.status === "accepted").length },
            { id: "declined", label: "Declined", count: quotations.filter((q) => q.status === "declined").length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? "border border-accent/40 bg-accent/20 text-accent"
                  : "text-muted hover:bg-background hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span className="rounded-full bg-background/80 px-1.5 py-0.2 text-[0.65rem] font-bold">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {/* Live Search */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Quote #, Client, Company, Machine..."
              className="w-full rounded-xl border border-line bg-background pl-9 pr-8 py-2 font-sans text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-xl border border-line bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Period Filter */}
          <div>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full rounded-xl border border-line bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="all">📅 All Time</option>
              <option value="week">Past 7 Days</option>
              <option value="month">Past 30 Days</option>
              <option value="quarter">Past Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* Value Filter */}
          <div>
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full rounded-xl border border-line bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="all">💰 All Values</option>
              <option value="under-5l">&lt; ₹5 Lakhs</option>
              <option value="5l-20l">₹5L – ₹20 Lakhs</option>
              <option value="20l-50l">₹20L – ₹50 Lakhs</option>
              <option value="above-50l">&gt; ₹50 Lakhs</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-line bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="value-high">Value: High → Low</option>
              <option value="value-low">Value: Low → High</option>
              <option value="client">Client: A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* QUOTATIONS LIST */}
      {filteredQuotations.length === 0 ? (
        <EmptyState
          title="No Commercial Quotations Found"
          description={
            search || filterStatus !== "all" || filterCategory !== "All Categories"
              ? "No quotations match your current filter parameters. Try clearing your search or category criteria."
              : "No quotations have been generated yet. Click 'Generate Quotation' to issue your first commercial proposal."
          }
        />
      ) : (
        <div className="grid gap-4">
          {filteredQuotations.map((q) => {
            const itemId = q.id || (q as any)._id;
            const isCopied = copiedId === itemId;

            return (
              <article
                key={itemId}
                className="rounded-2xl border border-line bg-surface p-5 transition-all hover:border-accent/50 hover:shadow-md"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-3.5">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-base font-bold text-accent">{q.quoteNumber}</span>
                      <span
                        className={`rounded-md px-2 py-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider ${
                          q.status === "accepted"
                            ? "bg-success/15 text-success border border-success/30"
                            : q.status === "declined"
                            ? "bg-danger/15 text-danger border border-danger/30"
                            : q.status === "sent" || q.status === "under-review"
                            ? "bg-accent/15 text-accent border border-accent/30"
                            : "bg-muted/15 text-muted border border-muted/30"
                        }`}
                      >
                        {q.status}
                      </span>
                      <span className="rounded-md border border-line bg-background px-2 py-0.5 font-mono text-[0.68rem] text-muted">
                        {q.project?.category || "Industrial Engineering"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 font-sans text-xs text-muted pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Building className="h-3.5 w-3.5 text-accent" />
                        <strong className="text-foreground">{q.client?.company}</strong> ({q.client?.name})
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted" />
                        {new Date(q.issuedDate || Date.now()).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {q.client?.plantLocation && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted" />
                          {q.client.plantLocation}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* DEDICATED ACTION BUTTONS */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* EYE BUTTON: PREVIEW IN NEW TAB */}
                    <Link
                      href={`/admin/quotations/${itemId}/preview`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-line bg-background px-2.5 py-1.5 font-mono text-[0.7rem] font-bold text-foreground hover:border-accent hover:text-accent transition-colors shadow-xs cursor-pointer"
                      title="Open quotation proposal in new tab for preview"
                    >
                      <Eye className="h-3.5 w-3.5 text-accent" />
                      <span>Preview</span>
                      <ExternalLink className="h-2.5 w-2.5 text-muted" />
                    </Link>

                    {/* DIRECT PDF DOWNLOAD BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleDirectDownload(q)}
                      disabled={Boolean(downloadingId)}
                      className="inline-flex items-center gap-1 rounded-lg border border-accent/40 bg-accent/15 px-2.5 py-1.5 font-mono text-[0.7rem] font-bold text-accent hover:bg-accent hover:text-navy transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                      title="Directly download official PDF proposal"
                    >
                      {downloadingId === itemId ? (
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      <span>{downloadingId === itemId ? "Downloading..." : "Download"}</span>
                    </button>

                    {/* PRINT BUTTON */}
                    <button
                      type="button"
                      onClick={() => handlePrint(q)}
                      className="inline-flex items-center gap-1 rounded-lg border border-line bg-background px-2.5 py-1.5 font-mono text-[0.7rem] font-bold text-foreground hover:border-accent hover:text-accent transition-colors shadow-xs cursor-pointer"
                      title="Print quotation on official letterhead"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print</span>
                    </button>

                    {/* EDIT BUTTON */}
                    <button
                      type="button"
                      onClick={() => openEditModal(q)}
                      className="inline-flex items-center gap-1 rounded-lg border border-line bg-background px-2.5 py-1.5 font-mono text-[0.7rem] font-bold text-foreground hover:border-accent hover:text-accent transition-colors shadow-xs cursor-pointer"
                      title="Edit line items and proposal details"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setDeletingQuotation(q)}
                      className="inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-2 py-1.5 font-mono text-[0.7rem] font-bold text-danger hover:bg-danger hover:text-white transition-colors shadow-xs cursor-pointer"
                      title="Delete quotation record"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main Proposal Body Grid */}
                <div className="grid gap-4 py-3 sm:grid-cols-2 lg:grid-cols-4 font-sans text-xs">
                  <div>
                    <span className="text-muted block text-[0.68rem] uppercase font-bold">Equipment Scope:</span>
                    <p className="font-semibold text-foreground mt-0.5 truncate">{q.project?.title}</p>
                    <span className="text-muted block text-[0.7rem] mt-0.5">
                      {q.lineItems?.length || 0} Line Item(s) included
                    </span>
                  </div>

                  <div>
                    <span className="text-muted block text-[0.68rem] uppercase font-bold">Client Contact:</span>
                    <p className="font-medium text-foreground mt-0.5">{q.client?.phone}</p>
                    <a href={`mailto:${q.client?.email}`} className="text-accent underline truncate block">
                      {q.client?.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-muted block text-[0.68rem] uppercase font-bold">Commercial Terms:</span>
                    <span className="text-foreground block mt-0.5">
                      Lead Time: <strong>{q.commercialTerms?.deliveryTimeline || "8-12 Weeks"}</strong>
                    </span>
                    <span className="text-muted block text-[0.7rem]">
                      Valid for {q.commercialTerms?.validityDays || 30} Days
                    </span>
                  </div>

                  <div className="rounded-xl border border-accent/30 bg-accent/5 p-3 text-right">
                    <span className="text-muted block text-[0.68rem] uppercase font-bold">Grand Total (Inc. GST):</span>
                    <p className="font-mono text-lg font-extrabold text-accent mt-0.5">{formatINR(q.grandTotal)}</p>
                    <span className="font-mono text-[0.68rem] text-muted block">
                      Subtotal: {formatINR(q.subtotal)}
                    </span>
                  </div>
                </div>

                {/* Line Items Quick Peek Strip */}
                {q.lineItems && q.lineItems.length > 0 && (
                  <div className="mt-2 rounded-xl border border-line bg-background/50 p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[0.68rem] uppercase font-bold text-muted">
                        Itemized Equipment Summary:
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(JSON.stringify(q.lineItems, null, 2), itemId)}
                        className="inline-flex items-center gap-1 font-sans text-[0.68rem] text-muted hover:text-accent cursor-pointer"
                      >
                        {isCopied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                        <span>{isCopied ? "Copied" : "Copy Items"}</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      {q.lineItems.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-sans">
                          <span className="text-foreground truncate max-w-lg">
                            • {item.description} ({item.quantity} {item.unit})
                          </span>
                          <span className="font-mono font-bold text-accent shrink-0">{formatINR(item.amount)}</span>
                        </div>
                      ))}
                      {q.lineItems.length > 3 && (
                        <span className="font-mono text-[0.68rem] text-muted block pt-1">
                          + {q.lineItems.length - 3} more line item(s)...
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* CREATE & EDIT QUOTATION MODAL */}
      {isEditorOpen && (
        <AdminModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={editingQuotation ? `Edit Quotation: ${formQuoteNumber}` : "Generate Commercial Quotation"}
          eyebrow="Proposal Generator"
          size="2xl"
        >
          <form onSubmit={handleSaveQuotation} className="space-y-6">
            {/* Step 1: Proposal Reference & Status */}
            <div className="grid gap-4 sm:grid-cols-3 rounded-2xl border border-line bg-background/60 p-4">
              <div>
                <label className="block font-mono text-[0.68rem] font-bold uppercase tracking-wider text-muted">
                  Quotation Number *
                </label>
                <input
                  type="text"
                  value={formQuoteNumber}
                  onChange={(e) => setFormQuoteNumber(e.target.value)}
                  required
                  placeholder="TSE/QT/2026/0001"
                  className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-mono text-xs font-bold text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[0.68rem] font-bold uppercase tracking-wider text-muted">
                  Quotation Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none cursor-pointer"
                >
                  <option value="draft">Draft (Internal Working)</option>
                  <option value="sent">Sent / Issued to Client</option>
                  <option value="under-review">Under Review / Negotiation</option>
                  <option value="accepted">Accepted (PO Received)</option>
                  <option value="declined">Declined</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[0.68rem] font-bold uppercase tracking-wider text-muted">
                  Validity Period (Days)
                </label>
                <input
                  type="number"
                  value={formValidityDays}
                  onChange={(e) => setFormValidityDays(Number(e.target.value))}
                  min={1}
                  max={180}
                  className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Step 2: Client & Company Information */}
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>1. Client & Enterprise Information</span>
              </h4>

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Contact Person</label>
                  <input
                    type="text"
                    value={formClientName}
                    onChange={(e) => setFormClientName(e.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Company Name</label>
                  <input
                    type="text"
                    value={formClientCompany}
                    onChange={(e) => setFormClientCompany(e.target.value)}
                    placeholder="e.g. Bharat Forge Ltd"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Designation</label>
                  <input
                    type="text"
                    value={formClientDesignation}
                    onChange={(e) => setFormClientDesignation(e.target.value)}
                    placeholder="e.g. Head of Plant Engineering"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Direct Email</label>
                  <input
                    type="text"
                    value={formClientEmail}
                    onChange={(e) => setFormClientEmail(e.target.value)}
                    placeholder="v.sharma@bharatforge.com"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Phone / Mobile</label>
                  <input
                    type="text"
                    value={formClientPhone}
                    onChange={(e) => setFormClientPhone(e.target.value)}
                    placeholder="+91 98220 12345"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={formClientGstin}
                    onChange={(e) => setFormClientGstin(e.target.value)}
                    placeholder="27AAACB1234F1Z5"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-mono text-xs uppercase text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-sans text-xs font-semibold text-foreground">Billing Address</label>
                  <input
                    type="text"
                    value={formBillingAddress}
                    onChange={(e) => setFormBillingAddress(e.target.value)}
                    placeholder="Plot 45, Chakan Industrial Area Phase II, Pune - 410501"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Plant Location / City</label>
                  <input
                    type="text"
                    value={formPlantLocation}
                    onChange={(e) => setFormPlantLocation(e.target.value)}
                    placeholder="Pune Works / Sanand / Chennai"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Equipment Scope & Reference */}
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                <Flame className="h-4 w-4" />
                <span>2. Machinery Scope & Technical Project Parameters</span>
              </h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Project / Machine Title</label>
                  <input
                    type="text"
                    value={formProjectTitle}
                    onChange={(e) => setFormProjectTitle(e.target.value)}
                    placeholder="e.g. Vertical CNC Induction Hardening Scanner 250 kW"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs font-bold text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Machinery Category</label>
                  <select
                    value={formProjectCategory}
                    onChange={(e) => setFormProjectCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-sans text-xs font-semibold text-foreground">
                    Attached Technical Scope Reference / Drawing
                  </label>
                  <input
                    type="text"
                    value={formRefDocName}
                    onChange={(e) => setFormRefDocName(e.target.value)}
                    placeholder="e.g. Crankshaft-Drawing-Rev-4.pdf or RFQ CAD Model"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Interactive Itemized Pricing Table */}
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  <span>3. Itemized Commercial Line Items</span>
                </h4>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="inline-flex items-center gap-1 rounded-lg border border-accent bg-accent/15 px-3 py-1 font-mono text-xs font-bold text-accent hover:bg-accent hover:text-navy transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-line text-muted font-mono text-[0.68rem] uppercase">
                      <th className="pb-2 pl-1">Description</th>
                      <th className="pb-2 px-2 w-20">HSN</th>
                      <th className="pb-2 px-2 w-16">Qty</th>
                      <th className="pb-2 px-2 w-20">Unit</th>
                      <th className="pb-2 px-2 w-28">Unit Rate (₹)</th>
                      <th className="pb-2 px-2 w-16">Disc %</th>
                      <th className="pb-2 px-2 w-16">GST %</th>
                      <th className="pb-2 px-2 text-right w-28">Amount (₹)</th>
                      <th className="pb-2 pr-1 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {formLineItems.map((item, idx) => (
                      <tr key={idx} className="group">
                        <td className="py-2.5 pl-1">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleLineItemChange(idx, "description", e.target.value)}
                            placeholder="Equipment / Tooling / Service Description"
                            className="w-full rounded-lg border border-line bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2">
                          <input
                            type="text"
                            value={item.hsnCode || "8479"}
                            onChange={(e) => handleLineItemChange(idx, "hsnCode", e.target.value)}
                            placeholder="8479"
                            className="w-full rounded-lg border border-line bg-background px-2 py-1.5 font-mono text-xs text-foreground focus:border-accent focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(idx, "quantity", e.target.value)}
                            min={0.1}
                            step={0.1}
                            className="w-full rounded-lg border border-line bg-background px-2 py-1.5 font-mono text-xs text-foreground focus:border-accent focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2">
                          <select
                            value={item.unit}
                            onChange={(e) => handleLineItemChange(idx, "unit", e.target.value)}
                            className="w-full rounded-lg border border-line bg-background px-1.5 py-1.5 font-mono text-xs text-foreground focus:border-accent focus:outline-none cursor-pointer"
                          >
                            <option value="Nos">Nos</option>
                            <option value="Sets">Sets</option>
                            <option value="Lots">Lots</option>
                            <option value="Mtrs">Mtrs</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-2">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleLineItemChange(idx, "unitPrice", e.target.value)}
                            min={0}
                            className="w-full rounded-lg border border-line bg-background px-2 py-1.5 font-mono text-xs font-bold text-foreground focus:border-accent focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2">
                          <input
                            type="number"
                            value={item.discountPercent || 0}
                            onChange={(e) => handleLineItemChange(idx, "discountPercent", e.target.value)}
                            min={0}
                            max={100}
                            className="w-full rounded-lg border border-line bg-background px-1.5 py-1.5 font-mono text-xs text-foreground focus:border-accent focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2">
                          <select
                            value={item.taxPercent ?? 18}
                            onChange={(e) => handleLineItemChange(idx, "taxPercent", Number(e.target.value))}
                            className="w-full rounded-lg border border-line bg-background px-1 py-1.5 font-mono text-xs text-foreground focus:border-accent focus:outline-none cursor-pointer"
                          >
                            <option value={18}>18%</option>
                            <option value={12}>12%</option>
                            <option value={5}>5%</option>
                            <option value={0}>0%</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-xs font-bold text-accent">
                          {formatINR(item.amount)}
                        </td>
                        <td className="py-2.5 pr-1 text-right">
                          <button
                            type="button"
                            onClick={() => removeLineItem(idx)}
                            disabled={formLineItems.length <= 1}
                            className="p-1 text-muted hover:text-danger disabled:opacity-30 cursor-pointer"
                            title="Remove line item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculations Box */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-line pt-4">
                <div className="text-xs font-sans text-muted">
                  <span className="font-bold text-foreground">Amount in Words:</span>
                  <p className="italic text-accent font-semibold">{numberToIndianWords(totals.grandTotal)}</p>
                </div>

                <div className="w-full sm:w-72 space-y-1.5 rounded-xl border border-line bg-background p-4 text-xs font-mono">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal:</span>
                    <span className="text-foreground font-bold">{formatINR(totals.subtotal)}</span>
                  </div>
                  {totals.discountTotal > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Total Discount:</span>
                      <span className="font-bold">- {formatINR(totals.discountTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted">
                    <span>GST (18%):</span>
                    <span className="text-foreground font-bold">{formatINR(totals.taxTotal)}</span>
                  </div>
                  <div className="flex justify-between border-t border-line pt-2 text-sm font-bold text-accent">
                    <span>Grand Total:</span>
                    <span>{formatINR(totals.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Commercial Terms & Conditions Presets */}
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>4. Commercial Terms & Guarantees</span>
              </h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Payment Milestones</label>
                  <textarea
                    rows={2}
                    value={formPaymentTerms}
                    onChange={(e) => setFormPaymentTerms(e.target.value)}
                    placeholder="e.g. 30% Advance with PO, 60% against FAT trial at Pune works, 10% after commissioning"
                    className="mt-1 w-full rounded-xl border border-line bg-background p-2.5 font-sans text-xs text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Delivery Timeline</label>
                  <textarea
                    rows={2}
                    value={formDeliveryTimeline}
                    onChange={(e) => setFormDeliveryTimeline(e.target.value)}
                    placeholder="e.g. 8 - 12 Weeks from drawing approval and advance receipt"
                    className="mt-1 w-full rounded-xl border border-line bg-background p-2.5 font-sans text-xs text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Warranty Period</label>
                  <input
                    type="text"
                    value={formWarranty}
                    onChange={(e) => setFormWarranty(e.target.value)}
                    placeholder="e.g. 12 Months from commissioning or 18 months from dispatch date"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-foreground">Freight & Dispatch Terms</label>
                  <input
                    type="text"
                    value={formFreightTerms}
                    onChange={(e) => setFormFreightTerms(e.target.value)}
                    placeholder="e.g. Ex-Works Pune Plant. Freight and insurance extra at actuals"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-sans text-xs font-semibold text-foreground">
                    Factory Acceptance Trials (FAT in Pune)
                  </label>
                  <input
                    type="text"
                    value={formInspectionFAT}
                    onChange={(e) => setFormInspectionFAT(e.target.value)}
                    placeholder="e.g. 100% FAT trial and workpiece cycle testing at Pune facility prior to dispatch"
                    className="mt-1 w-full rounded-xl border border-line bg-background px-3 py-2 font-sans text-xs text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-sans text-xs font-semibold text-foreground">Special Notes / Scope Details</label>
                  <textarea
                    rows={3}
                    value={formSpecialNotes}
                    onChange={(e) => setFormSpecialNotes(e.target.value)}
                    placeholder="Specific tooling fixtures, component sample requirements, or client specific scopes..."
                    className="mt-1 w-full rounded-xl border border-line bg-background p-2.5 font-sans text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="rounded-xl border border-line bg-background px-5 py-2.5 font-mono text-xs font-bold text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl border border-accent bg-accent text-navy px-6 py-2.5 font-mono text-xs font-bold hover:bg-navy hover:text-onnavy transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy border-t-transparent" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>{editingQuotation ? "Save & Update Quotation" : "Create & Issue Quotation"}</span>
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingQuotation && (
        <ConfirmDeleteModal
          isOpen={Boolean(deletingQuotation)}
          onClose={() => setDeletingQuotation(null)}
          onConfirm={handleDelete}
          title="Delete Commercial Quotation?"
          message="Are you sure you want to permanently delete this proposal record from the database? This action cannot be undone."
          itemName={`${deletingQuotation.quoteNumber} — ${deletingQuotation.client?.company} (${formatINR(deletingQuotation.grandTotal)})`}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default function AdminQuotationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <QuotationsPageInner />
    </Suspense>
  );
}