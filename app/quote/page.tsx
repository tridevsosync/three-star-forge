"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { TechLabel, Badge, Btn } from "@/components/site/ui";
import { PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

const MACHINE_TYPES = [
  "Vertical Induction Hardening Machine",
  "Horizontal Induction Hardening Machine",
  "Dual Spindle Induction Hardening Machine",
  "Custom Line Automation & Robotics",
  "Material Handling Conveyor System",
  "Precision Inspection & NDT Fixture",
  "Machine Refurbishment & Retrofitting",
  "CNC Special Purpose Machine (SPM)",
  "Other Custom Industrial Build",
];

const TIMELINE_OPTIONS = [
  "Immediate (< 1 Month)",
  "1 - 3 Months",
  "3 - 6 Months",
  "Concept & Budgetary Planning Stage",
];

const emptyRfq = {
  name: "",
  designation: "",
  email: "",
  phone: "",
  company: "",
  location: "",
  industry: "Industrial Automation",
  machineType: "Vertical Induction Hardening Machine",
  timeline: "1 - 3 Months",
  targetVolume: "",
  message: "",
  referenceProject: "",
};

function QuoteForm() {
  const searchParams = useSearchParams();
  const { createEnquiry } = useSite();
  const [form, setForm] = useState(emptyRfq);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedRfq, setSubmittedRfq] = useState(null);

  useEffect(() => {
    const project = searchParams?.get("project") || "";
    const machine = searchParams?.get("machine") || "";
    if (project || machine) {
      setForm((p) => ({
        ...p,
        referenceProject: project,
        machineType: machine || p.machineType,
      }));
    }

    if (typeof window !== "undefined" && (project || machine || window.location.hash === "#quote-form")) {
      const timer = setTimeout(() => {
        const el = document.getElementById("quote-form");
        if (el) {
          const rect = el.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetY = rect.top + scrollTop - 90;
          window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const validateField = (k: string, v: string) => {
    let err = "";
    if (k === "name") {
      if (!v.trim()) err = "Please enter your full name.";
      else if (v.trim().length < 2) err = "Name must be at least 2 characters.";
    } else if (k === "email") {
      if (!v.trim()) err = "Please enter your work email address.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) {
        err = "Please enter a valid email address (e.g. name@company.com).";
      }
    } else if (k === "phone") {
      if (!v.trim()) {
        err = "Please enter your phone number.";
      } else {
        const cleanPhone = v.replace(/[\s\-\(\)\.]/g, "");
        if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
          err = "Please enter a valid phone number (7 to 15 digits, e.g. +91 9823463655).";
        }
      }
    } else if (k === "company") {
      if (!v.trim()) err = "Please enter your company or enterprise name.";
      else if (v.trim().length < 2) err = "Company name must be at least 2 characters.";
    } else if (k === "message") {
      if (!v.trim()) err = "Please describe your machine specifications or scope.";
      else if (v.trim().length < 10) err = "Technical scope must be at least 10 characters.";
    }
    return err;
  };

  const set = (k: string, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
    const err = validateField(k, v);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) next[k] = err;
      else delete next[k];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    const nameErr = validateField("name", form.name);
    if (nameErr) errors.name = nameErr;

    const emailErr = validateField("email", form.email);
    if (emailErr) errors.email = emailErr;

    const phoneErr = validateField("phone", form.phone);
    if (phoneErr) errors.phone = phoneErr;

    const companyErr = validateField("company", form.company);
    if (companyErr) errors.company = companyErr;

    const msgErr = validateField("message", form.message);
    if (msgErr) errors.message = msgErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fill all required fields correctly before submitting.");
      return;
    }

    setFieldErrors({});
    setError("");
    setSubmitting(true);

    try {
      const res = await createEnquiry(form);
      if (res.success) {
        setSubmittedRfq(res.item || form);
      } else {
        setError(res.error || "Failed to submit RFQ. Please try again.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        index="Quote"
        eyebrow="Get Pricing"
        title="Request a Machine & Tooling Price Quote"
        intro="Tell us about the machine you need, your part sizes, and your target timeline. Our Pune engineering team will review your details and send you a clear, competitive quotation."
        image={IMAGES.pageCapabilities}
      />

      <Section grid>
        <div className="mx-auto max-w-4xl">
          <div id="quote-form" className="scroll-mt-28 corner-marks border border-line bg-surface shadow-xl">
            {/* Header */}
            <div className="border-b border-line bg-navy text-onnavy px-5 sm:px-8 py-5 sm:py-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <TechLabel tone="accent">Fast 2-Step Quote Request</TechLabel>
                <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-onnavy">
                  Machine & Tooling Quotation Form
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.7rem] sm:text-xs text-accent border border-accent/40 bg-accent/10 px-2.5 py-1">
                  100% CONFIDENTIAL & SECURE
                </span>
              </div>
            </div>

            {submittedRfq ? (
              <div className="px-5 sm:px-8 py-12 sm:py-16 text-center space-y-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center border-2 border-accent bg-accent/10 text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M4 12.5l5 5L20 6.5" />
                  </svg>
                </div>

                <div>
                  <span className="tech-label text-accent">Quote Request Received</span>
                  <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-foreground">
                    Thank You! Your Request Has Been Logged
                  </h3>
                  <p className="mt-2 font-mono text-xs text-muted">
                    Reference ID:{" "}
                    <span className="font-bold text-accent">
                      {submittedRfq.id
                        ? submittedRfq.id.slice(-8).toUpperCase()
                        : `RFQ-${Date.now().toString().slice(-6)}`}
                    </span>
                  </p>
                </div>

                <div className="mx-auto max-w-lg border border-line bg-background p-4 sm:p-6 text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-line pb-2">
                    <span className="text-muted">Your Name:</span>
                    <span className="font-bold text-foreground">{submittedRfq.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-line pb-2">
                    <span className="text-muted">Company Name:</span>
                    <span className="font-bold text-foreground">{submittedRfq.company}</span>
                  </div>
                  <div className="flex justify-between border-b border-line pb-2">
                    <span className="text-muted">Machine Type:</span>
                    <span className="font-bold text-accent">{submittedRfq.machineType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Target Timeline:</span>
                    <span className="text-foreground">{submittedRfq.timeline}</span>
                  </div>
                </div>

                <p className="mx-auto max-w-md text-xs text-muted leading-relaxed">
                  Our engineering department in Pune will review your project details and contact you directly with a full price quotation.
                </p>

                <div className="pt-4 flex flex-wrap justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setForm(emptyRfq);
                      setSubmittedRfq(null);
                    }}
                    className="border border-line bg-surface px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground hover:border-accent"
                  >
                    Submit Another Quote Request
                  </button>
                  <Link
                    href="/projects"
                    className="border border-accent bg-accent text-navy px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-accent-hover"
                  >
                    See Delivered Machines →
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                {error && (
                  <div className="border border-danger/40 bg-danger/10 px-4 py-3 text-xs font-semibold text-danger">
                    {error}
                  </div>
                )}

                {/* Section 1: Contact & Organization */}
                <div>
                  <div className="border-b border-line pb-2 mb-5 sm:mb-6">
                    <span className="tech-label text-accent font-bold">
                      Step 1 // Your Contact Details
                    </span>
                  </div>
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className={`tech-label block ${fieldErrors.name ? "text-danger font-bold" : "text-muted"}`}>
                          Full Name *
                        </label>
                        {form.name ? (
                          <span className="font-mono text-[0.68rem] text-muted">{form.name.length}/80</span>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        maxLength={80}
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="e.g. Vikram Sharma"
                        className={`w-full border px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-foreground outline-none transition-colors ${
                          fieldErrors.name
                            ? "border-danger bg-danger/5 focus:border-danger focus:ring-1 focus:ring-danger/40"
                            : "border-line bg-background focus:border-accent"
                        }`}
                      />
                      {fieldErrors.name && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-danger animate-fadeIn">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                          <span>{fieldErrors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className="tech-label text-muted block">Designation / Role</label>
                        {form.designation ? (
                          <span className="font-mono text-[0.68rem] text-muted">{form.designation.length}/80</span>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        maxLength={80}
                        value={form.designation}
                        onChange={(e) => set("designation", e.target.value)}
                        placeholder="e.g. VP Operations / Chief Engineer"
                        className="w-full border border-line bg-background px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-foreground outline-none transition-colors focus:border-accent"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className={`tech-label block ${fieldErrors.email ? "text-danger font-bold" : "text-muted"}`}>
                          Work Email Address *
                        </label>
                        {form.email ? (
                          <span className="font-mono text-[0.68rem] text-muted">{form.email.length}/100</span>
                        ) : null}
                      </div>
                      <input
                        type="email"
                        maxLength={100}
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="e.g. v.sharma@company.com"
                        className={`w-full border px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-foreground outline-none transition-colors ${
                          fieldErrors.email
                            ? "border-danger bg-danger/5 focus:border-danger focus:ring-1 focus:ring-danger/40"
                            : "border-line bg-background focus:border-accent"
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-danger animate-fadeIn">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                          <span>{fieldErrors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className={`tech-label block ${fieldErrors.phone ? "text-danger font-bold" : "text-muted"}`}>
                          Direct Phone / Mobile *
                        </label>
                        {form.phone ? (
                          <span className="font-mono text-[0.68rem] text-muted">{form.phone.length}/16</span>
                        ) : null}
                      </div>
                      <input
                        type="tel"
                        maxLength={16}
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value.replace(/[^0-9+\s\-()]/g, ""))}
                        placeholder="+91 98234 XXXXX"
                        className={`w-full border px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-foreground outline-none transition-colors font-mono ${
                          fieldErrors.phone
                            ? "border-danger bg-danger/5 focus:border-danger focus:ring-1 focus:ring-danger/40"
                            : "border-line bg-background focus:border-accent"
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-danger animate-fadeIn">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                          <span>{fieldErrors.phone}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className={`tech-label block ${fieldErrors.company ? "text-danger font-bold" : "text-muted"}`}>
                          Company / Enterprise Name *
                        </label>
                        {form.company ? (
                          <span className="font-mono text-[0.68rem] text-muted">{form.company.length}/100</span>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        maxLength={100}
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                        placeholder="e.g. Precision Components Ltd."
                        className={`w-full border px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-foreground outline-none transition-colors ${
                          fieldErrors.company
                            ? "border-danger bg-danger/5 focus:border-danger focus:ring-1 focus:ring-danger/40"
                            : "border-line bg-background focus:border-accent"
                        }`}
                      />
                      {fieldErrors.company && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-danger animate-fadeIn">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                          <span>{fieldErrors.company}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className="tech-label text-muted block">Plant Location / City</label>
                        {form.location ? (
                          <span className="font-mono text-[0.68rem] text-muted">{form.location.length}/100</span>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        maxLength={100}
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        placeholder="e.g. Pune / Chennai / Gurgaon / International"
                        className="w-full border border-line bg-background px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-foreground outline-none transition-colors focus:border-accent"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Machine Specifications */}
                <div>
                  <div className="border-b border-line pb-2 mb-5 sm:mb-6">
                    <span className="tech-label text-accent font-bold">
                      Step 2 // Equipment & Project Scope
                    </span>
                  </div>
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    <div>
                      <label className="tech-label text-muted block mb-1.5 sm:mb-2">
                        Target Machine / System Type *
                      </label>
                      <select
                        value={form.machineType}
                        onChange={(e) => set("machineType", e.target.value)}
                        className="w-full border border-line bg-background px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-foreground outline-none transition-colors focus:border-accent font-medium cursor-pointer"
                      >
                        {MACHINE_TYPES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="tech-label text-muted block mb-1.5 sm:mb-2">Target Timeline *</label>
                      <select
                        value={form.timeline}
                        onChange={(e) => set("timeline", e.target.value)}
                        className="w-full border border-line bg-background px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-foreground outline-none transition-colors focus:border-accent font-medium cursor-pointer"
                      >
                        {TIMELINE_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className="tech-label text-muted block">
                          Target Production Volume / Part Geometry / Cycle Time
                        </label>
                        {form.targetVolume ? (
                          <span className="font-mono text-[0.68rem] text-muted">{form.targetVolume.length}/150</span>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        maxLength={150}
                        value={form.targetVolume}
                        onChange={(e) => set("targetVolume", e.target.value)}
                        placeholder="e.g. 500 parts/shift, shaft length 400mm, dia 45mm, case depth 2.5mm"
                        className="w-full border border-line bg-background px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-foreground outline-none transition-colors focus:border-accent"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className={`tech-label block ${fieldErrors.message ? "text-danger font-bold" : "text-muted"}`}>
                          Technical Specifications & Scope Details *
                        </label>
                        <span className="font-mono text-[0.68rem] text-muted">
                          {form.message.length} / 3000
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        maxLength={3000}
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Describe your technical requirements, component drawings, PLC/CNC preferences, hardening depth tolerances, or turnkey assembly scope..."
                        className={`w-full border px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-foreground outline-none transition-colors resize-y font-mono ${
                          fieldErrors.message
                            ? "border-danger bg-danger/5 focus:border-danger focus:ring-1 focus:ring-danger/40"
                            : "border-line bg-background focus:border-accent"
                        }`}
                      />
                      {fieldErrors.message && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-danger animate-fadeIn">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                          <span>{fieldErrors.message}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-line">
                  <div className="text-xs text-muted font-mono">
                    <p className="font-bold text-foreground">CONFIDENTIAL ENGINEERING RFQ</p>
                    <p>All drawings & parameters are kept under NDA.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="border border-accent bg-accent text-navy px-10 py-3.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-navy hover:text-onnavy transition-all shadow-lg disabled:opacity-50"
                  >
                    {submitting ? "Submitting RFQ Proposal..." : "Submit Quotation Request (RFQ) →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}

export default function QuotePage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[60vh] items-center justify-center bg-background">
          <p className="font-mono text-xs text-muted">Loading quotation form...</p>
        </section>
      }
    >
      <QuoteForm />
    </Suspense>
  );
}
