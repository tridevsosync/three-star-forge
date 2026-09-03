"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { formatINR, numberToIndianWords } from "@/lib/numberToWords";
import { downloadQuotationDirectly, downloadQuotationPDF } from "@/lib/pdfExport";
import { Quotation } from "@/types";
import {
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Receipt,
  Flame,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  X,
  FileText,
} from "lucide-react";

export default function QuotationPreviewView({ params }: { params?: Promise<{ id: string }> | { id: string } }) {
  const routeParams = useParams();
  const rawId = (routeParams?.id as string) || "";
  const [resolvedId, setResolvedId] = useState<string>(rawId);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (rawId) {
      setResolvedId(rawId);
    } else if (params && typeof (params as any).then === "function") {
      (params as Promise<{ id: string }>).then((p) => {
        if (p?.id) setResolvedId(p.id);
      });
    } else if (params && (params as any).id) {
      setResolvedId((params as any).id);
    }
  }, [params, rawId]);

  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shouldAutoPrint = searchParams.get("print") === "true";

  useEffect(() => {
    if (!resolvedId) return;
    async function fetchQuotation() {
      try {
        setLoading(true);
        const res = await fetch(`/api/quotations/${encodeURIComponent(resolvedId)}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.success || !json.data) {
          throw new Error(json.error || "Could not find quotation");
        }
        setQuotation(json.data);
      } catch (err: any) {
        setError(err.message || "Failed to load quotation.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuotation();
  }, [resolvedId]);

  useEffect(() => {
    if (!loading && quotation && shouldAutoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [loading, quotation, shouldAutoPrint]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectDownload = async () => {
    if (!quotation) return;
    setIsDownloadingPdf(true);
    const quoteId = quotation.id || (quotation as any)._id;

    try {
      const ok = await downloadQuotationDirectly(quotation);
      if (!ok) {
        if (quoteId) {
          window.location.href = `/api/quotations/${quoteId}/pdf`;
        } else {
          throw new Error("Direct PDF failed");
        }
      }
    } catch (err) {
      console.error("Direct PDF download fallback:", err);
      if (quoteId) {
        window.location.href = `/api/quotations/${quoteId}/pdf`;
      } else {
        const quoteNo = (quotation.quoteNumber || "Quotation").replace(/[\/\\]/g, "-");
        const filename = `Quotation-${quoteNo}-${(quotation.client?.company || "Client").replace(/\s+/g, "_")}.pdf`;
        const element = document.getElementById("printable-quotation-sheet") || document.body;
        await downloadQuotationPDF(element, filename);
      }
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="font-mono text-sm tracking-wider text-slate-300">Loading Commercial Quotation Proposal...</p>
        </div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-red-950/20 p-8 text-center space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400">
            <X className="h-6 w-6" />
          </div>
          <h2 className="font-mono text-lg font-bold text-white">Quotation Not Found</h2>
          <p className="text-xs text-slate-300">{error || "The requested quotation does not exist or has been deleted."}</p>
          <div className="pt-2">
            <Link
              href="/admin/quotations"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 text-slate-950 px-4 py-2 font-mono text-xs font-bold hover:bg-cyan-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Quotation Studio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = quotation;

  return (
    <div className="min-h-screen bg-slate-950/95 py-6 px-3 sm:px-6 md:py-10 print:bg-white print:p-0">
      {/* FLOATING ACTION TOOLBAR (HIDDEN DURING PRINT) */}
      <header className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-white shadow-2xl backdrop-blur-md print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/quotations"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quotation Studio</span>
          </Link>
          <span className="font-mono text-xs text-slate-400 hidden sm:inline">•</span>
          <span className="font-mono text-xs font-bold text-cyan-400">{q.quoteNumber}</span>
          <span
            className={`rounded-md px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider ${
              q.status === "accepted"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : q.status === "sent" || q.status === "under-review"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            {q.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-xs font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Copy public quotation preview link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </button>

          <button
            type="button"
            onClick={handleDirectDownload}
            disabled={isDownloadingPdf}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/50 bg-cyan-500/15 px-3 py-2 font-mono text-xs font-bold text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors cursor-pointer disabled:opacity-50"
            title="Directly download formal PDF document"
          >
            {isDownloadingPdf ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            <span>{isDownloadingPdf ? "Generating PDF..." : "Download PDF"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400 bg-cyan-400 text-slate-950 px-4 py-2 font-mono text-xs font-bold hover:bg-white transition-all shadow-md cursor-pointer"
            title="Print quotation sheet"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Quotation</span>
          </button>
        </div>
      </header>

      {/* OFFICIAL PRINTABLE QUOTATION SHEET */}
      <main
        id="printable-quotation-sheet"
        className="max-w-4xl mx-auto bg-white text-slate-900 rounded-3xl shadow-2xl p-8 sm:p-12 print:shadow-none print:p-0 print:rounded-none print:max-w-none"
      >
        {/* Company Header */}
        <div className="border-b-2 border-blue-800 pb-6 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-blue-900 tracking-tight">
                THREE STAR ENTERPRISES
              </h1>
            </div>
            <p className="text-xs font-semibold text-slate-700 mt-1">
              Special Purpose Machines • CNC Induction Hardening Plants • Industrial Automation Systems
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded bg-blue-50 border border-blue-200 px-2 py-0.5 font-mono text-[0.68rem] font-bold text-blue-900 uppercase tracking-wide">
              <ShieldCheck className="h-3 w-3 text-blue-700" />
              <span>ISO 9001:2015 Certified Manufacturing Facility • Pune Works</span>
            </div>
            <div className="mt-3 text-[0.72rem] text-slate-600 space-y-0.5 font-sans">
              <p>Works Plant: Sr No 12/2, Dehu Alandi Road, Dehu Gaon, Pune - 412109, Maharashtra, India</p>
              <p>GSTIN: <strong>27AABCT1234F1Z5</strong> • Email: sales@threestarforge.com • Web: www.threestarforge.com</p>
            </div>
          </div>

          <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 w-full md:w-auto">
            <span className="font-mono text-base md:text-lg font-extrabold text-slate-900 block tracking-tight">
              COMMERCIAL PROPOSAL
            </span>
            <div className="mt-1 font-mono text-sm font-bold text-blue-800">
              Ref No: {q.quoteNumber}
            </div>
            <div className="mt-1 text-xs text-slate-600 font-sans">
              Date: <strong>{new Date(q.issuedDate || Date.now()).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong>
            </div>
            <div className="text-xs text-slate-600 font-sans">
              Validity: <strong>{q.commercialTerms?.validityDays || 30} Days</strong> (Until {new Date(q.validUntil || Date.now()).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })})
            </div>
          </div>
        </div>

        {/* Client & Scope Metadata Grid */}
        <div className="grid gap-6 sm:grid-cols-2 my-6 font-sans">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Quotation Issued To:
            </span>
            <h3 className="font-bold text-sm text-slate-900">{q.client?.name}</h3>
            <p className="font-semibold text-xs text-blue-800">{q.client?.company}</p>
            {q.client?.designation && <p className="text-[0.72rem] text-slate-600">{q.client.designation}</p>}
            <div className="mt-2 text-xs text-slate-700 space-y-0.5">
              <p>Direct Phone: <strong>{q.client?.phone}</strong></p>
              <p>Email: <strong>{q.client?.email}</strong></p>
              {q.client?.gstin && <p className="font-mono text-[0.72rem]">Client GSTIN: <strong>{q.client.gstin}</strong></p>}
              {q.client?.billingAddress && <p className="text-[0.72rem] text-slate-600 mt-1">{q.client.billingAddress}</p>}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Machinery Scope & Parameters:
            </span>
            <h3 className="font-bold text-sm text-slate-900">{q.project?.title}</h3>
            <p className="font-semibold text-xs text-blue-800">Category: {q.project?.category || "Industrial Engineering"}</p>
            <div className="mt-2 text-xs text-slate-700 space-y-0.5">
              <p>Delivery Schedule: <strong>{q.commercialTerms?.deliveryTimeline || "8 - 12 Weeks"}</strong></p>
              <p>Installation Plant: <strong>{q.client?.plantLocation || "Customer Works Site"}</strong></p>
              {q.project?.referenceDocName && (
                <p className="text-[0.72rem] text-blue-800 mt-1">
                  📎 Scope Reference Drawing: <strong>{q.project.referenceDocName}</strong>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="my-6 overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-mono text-[0.68rem] uppercase">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3">Equipment Description & Technical Specifications</th>
                <th className="py-2.5 px-3 w-20 text-center">HSN</th>
                <th className="py-2.5 px-3 w-16 text-right">Qty</th>
                <th className="py-2.5 px-3 w-28 text-right">Unit Rate (₹)</th>
                <th className="py-2.5 px-3 w-16 text-right">GST %</th>
                <th className="py-2.5 px-3 w-32 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 border-b border-slate-200">
              {(q.lineItems || []).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{item.description}</p>
                    {item.discountPercent ? (
                      <span className="text-[0.68rem] text-emerald-700 font-semibold block">
                        • {item.discountPercent}% Commercial Discount Applied
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">{item.hsnCode || "8479"}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-800">
                    {item.quantity} {item.unit || "Nos"}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-800">{formatINR(item.unitPrice)}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-800">{item.taxPercent || 18}%</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-blue-900">
                    {formatINR(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Amount in Words */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 my-6">
          <div className="w-full sm:max-w-md">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-xs">
              <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Total Amount in Words:
              </span>
              <p className="font-serif italic font-bold text-slate-900 text-sm leading-relaxed">
                {numberToIndianWords(q.grandTotal)}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 p-4 text-[0.72rem] text-slate-600 font-sans space-y-1">
              <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Company Wire Transfer Details:
              </span>
              <p>Beneficiary: <strong>THREE STAR ENTERPRISES</strong></p>
              <p>Bank: <strong>HDFC Bank Ltd</strong> • A/c No: <strong>50200084791234</strong></p>
              <p>IFSC: <strong>HDFC0001234</strong> • Branch: Chakan Industrial Area, Pune</p>
            </div>
          </div>

          <div className="w-full sm:w-80 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Equipment Subtotal:</span>
              <span className="font-bold text-slate-900">{formatINR(q.subtotal)}</span>
            </div>
            {q.discountTotal ? (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Total Discount:</span>
                <span>- {formatINR(q.discountTotal)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-slate-600">
              <span>Integrated GST (18%):</span>
              <span className="font-bold text-slate-900">{formatINR(q.taxTotal)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-base font-extrabold text-blue-900">
              <span>Grand Total:</span>
              <span>{formatINR(q.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Commercial Terms & Conditions */}
        <div className="my-6 rounded-xl border border-slate-200 p-5 font-sans text-xs">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-blue-900 mb-2.5">
            Commercial Terms & Guarantees
          </h4>
          <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 text-[0.74rem] leading-relaxed">
            <li>
              <strong>Payment Terms:</strong> {q.commercialTerms?.paymentTerms || "30% Advance with Purchase Order, 60% against successful FAT trial inspection at Pune works, 10% after site commissioning."}
            </li>
            <li>
              <strong>Delivery Timeline:</strong> {q.commercialTerms?.deliveryTimeline || "8 - 12 Weeks from drawing approval and advance receipt."}
            </li>
            <li>
              <strong>Factory Acceptance Trials (FAT):</strong> {q.commercialTerms?.inspectionFAT || "100% FAT trial & workpiece cycle trial at Pune facility prior to dispatch."}
            </li>
            <li>
              <strong>Warranty Coverage:</strong> {q.commercialTerms?.warranty || "12 Months from commissioning or 18 months from dispatch date, whichever is earlier."}
            </li>
            <li>
              <strong>Freight & Transit Terms:</strong> {q.commercialTerms?.freightTerms || "Ex-Works Pune Plant. Freight, packing, and transit insurance extra at actuals."}
            </li>
            <li>
              <strong>Proposal Validity:</strong> Valid for {q.commercialTerms?.validityDays || 30} Days from date of quotation issuance.
            </li>
            {q.commercialTerms?.specialNotes && (
              <li>
                <strong>Special Notes:</strong> {q.commercialTerms.specialNotes}
              </li>
            )}
          </ol>
        </div>

        {/* Signatures & Plant Seal */}
        <div className="mt-10 pt-6 border-t border-slate-300 flex justify-between items-end font-sans text-xs">
          <div>
            <p className="text-[0.7rem] text-slate-500">Prepared by:</p>
            <p className="font-bold text-slate-800 mt-0.5">{q.preparedBy || "Three Star Enterprises Engineering Division"}</p>
            <p className="text-[0.68rem] text-slate-500">Pune Engineering & SPM Works</p>
          </div>

          <div className="text-right">
            <p className="font-bold text-slate-900">For THREE STAR ENTERPRISES</p>
            <div className="mt-12 pt-2 border-t border-slate-900 w-52 inline-block text-center">
              <p className="font-bold text-slate-900 text-[0.72rem]">Authorized Signatory</p>
              <p className="text-[0.68rem] text-slate-500">Technical Director / Works Manager</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}