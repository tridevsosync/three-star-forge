"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { SectionHead, TechLabel, Badge, Btn } from "@/components/site/ui";
import { PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

const SUBJECT_OPTIONS = [
  "General Engineering Inquiry",
  "Plant Visit & Facility Audit",
  "Machinery Support & Maintenance",
  "Vendor & Component Supply",
  "Partnership & Distribution",
  "Other Inquiry",
];

const emptyContactForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  subject: "General Engineering Inquiry",
  message: "",
};

function ContactPageInner() {
  const searchParams = useSearchParams();
  const { company, createContact, openRfqModal } = useSite();
  const [form, setForm] = useState(emptyContactForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const subjectParam = searchParams?.get("subject") || "";
    const messageParam = searchParams?.get("message") || "";
    if (subjectParam || messageParam) {
      setForm((p) => ({
        ...p,
        subject: SUBJECT_OPTIONS.includes(subjectParam) ? subjectParam : "Partnership & Distribution",
        message: messageParam || (subjectParam ? `Inquiry regarding: ${subjectParam}\n` : p.message),
      }));
    }
    if (typeof window !== "undefined" && (subjectParam || messageParam || window.location.hash === "#contact-form")) {
      const timer = setTimeout(() => {
        const el = document.getElementById("contact-form");
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
      if (!v.trim()) err = "Please enter your email address.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) {
        err = "Please enter a valid email address (e.g. name@company.com).";
      }
    } else if (k === "phone") {
      if (v && v.trim()) {
        const cleanPhone = v.replace(/[\s\-\(\)\.]/g, "");
        if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
          err = "Please enter a valid phone number (7 to 15 digits, e.g. +91 9823463655).";
        }
      }
    } else if (k === "message") {
      if (!v.trim()) err = "Please enter your message or inquiry.";
      else if (v.trim().length < 10) err = "Message must be at least 10 characters.";
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

    const msgErr = validateField("message", form.message);
    if (msgErr) errors.message = msgErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please correct the errors in the highlighted fields below.");
      return;
    }

    setFieldErrors({});
    setError("");
    setSubmitting(true);

    try {
      const res = await createContact(form);
      if (res.success) {
        setSent(true);
      } else {
        setError(res.error || "Failed to submit contact message. Please try again.");
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        index="07"
        eyebrow="Contact Us"
        title="Get in Touch with Three Star Enterprises"
        intro="Have a question about our machines, need a price quote, or want to visit our workshop in Pune? Send us a message below or call us directly."
        image={IMAGES.pageContact}
      />

      {/* RFQ Prompt Banner */}
      <div className="border-b border-line bg-accent/10 py-4 px-4 text-center">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
          <span className="font-bold text-accent">NEED A FAST PRICE QUOTE FOR A MACHINE?</span>
          <span className="text-muted hidden sm:inline">—</span>
          <span className="text-foreground">Tell us about your machine type, dimensions, and timeline:</span>
          <Link
            href="/quote"
            className="border border-accent bg-accent text-navy px-3.5 py-1 font-bold uppercase tracking-wider hover:bg-navy hover:text-onnavy transition-colors"
          >
            Get a Free Quote →
          </Link>
        </div>
      </div>

      <Section grid>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* LEFT: Contact Information & Headquarters */}
          <InView className="lg:col-span-5 space-y-8">
            <div>
              <SectionHead index="7.1" eyebrow="Pune Plant" title="Headquarters & Workshop" />
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Our plant is located in Dehu Gaon, Pune. Reach out directly by phone, email, or schedule a technical discussion.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="space-y-4">
              <div className="border border-line bg-surface p-6 flex items-start gap-4">
                <span className="p-3 bg-accent/10 text-accent border border-accent/30 text-lg font-bold">
                  📞
                </span>
                <div>
                  <TechLabel>Phone Support</TechLabel>
                  <p className="mt-1 font-mono text-sm font-bold text-foreground">{company.phone}</p>
                  <p className="text-xs text-muted">Mon–Sat, 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="border border-line bg-surface p-6 flex items-start gap-4">
                <span className="p-3 bg-accent/10 text-accent border border-accent/30 text-lg font-bold">
                  ✉️
                </span>
                <div>
                  <TechLabel>Official Email</TechLabel>
                  <p className="mt-1 font-mono text-sm font-bold text-foreground break-all">{company.email}</p>
                  <p className="text-xs text-muted">Direct correspondence</p>
                </div>
              </div>

              <div className="border border-line bg-surface p-6 flex items-start gap-4">
                <span className="p-3 bg-accent/10 text-accent border border-accent/30 text-lg font-bold">
                  📍
                </span>
                <div>
                  <TechLabel>Plant Address</TechLabel>
                  <p className="mt-1 text-xs leading-relaxed text-foreground font-medium">{company.address}</p>
                  <p className="mt-2 text-xs font-mono text-accent">Pune District, Maharashtra - 412109</p>
                </div>
              </div>
            </div>
          </InView>

          {/* RIGHT: Contact Message Form */}
          <InView delay={100} className="lg:col-span-7">
            <div id="contact-form" className="scroll-mt-28 corner-marks border border-line bg-surface shadow-lg">
              <div className="border-b border-line bg-surface-soft px-8 py-6 flex items-center justify-between">
                <div>
                  <TechLabel tone="accent">General Inquiries</TechLabel>
                  <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                    Send Us a Message
                  </h2>
                </div>
                <Badge variant="navy">DIRECT LINE</Badge>
              </div>

              {sent ? (
                <div className="px-8 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center border border-accent bg-accent/10 text-accent">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 12.5l5 5L20 6.5" />
                    </svg>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
                    Message Sent Successfully
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                    Thank you, <span className="font-semibold text-foreground">{form.name}</span>. Your message has been received. Our team will review and respond to you at <span className="font-mono text-foreground">{form.email}</span> shortly.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setForm(emptyContactForm);
                        setSent(false);
                      }}
                      className="border border-line bg-surface px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground hover:border-accent"
                    >
                      Send Another Message
                    </button>
                    <Link
                      href="/quote"
                      className="border border-accent bg-accent text-navy px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-accent-hover"
                    >
                      Submit Machinery RFQ →
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {error && (
                    <div className="border border-danger/40 bg-danger/10 px-4 py-3 text-xs font-semibold text-danger">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={`tech-label block ${fieldErrors.name ? "text-danger font-bold" : "text-muted"}`}>
                          Your Name *
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
                        placeholder="e.g. Rajesh Patil"
                        className={`w-full border px-4 py-3 text-sm text-foreground outline-none transition-colors ${
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
                      <div className="flex items-center justify-between mb-2">
                        <label className={`tech-label block ${fieldErrors.email ? "text-danger font-bold" : "text-muted"}`}>
                          Email Address *
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
                        placeholder="e.g. r.patil@company.com"
                        className={`w-full border px-4 py-3 text-sm text-foreground outline-none transition-colors ${
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
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={`tech-label block ${fieldErrors.phone ? "text-danger font-bold" : "text-muted"}`}>
                          Phone Number
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
                        placeholder="+91 98XXX XXXXX"
                        className={`w-full border px-4 py-3 text-sm text-foreground outline-none transition-colors font-mono ${
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
                      <div className="flex items-center justify-between mb-2">
                        <label className="tech-label text-muted block">Company / Organization</label>
                        {form.company ? (
                          <span className="font-mono text-[0.68rem] text-muted">{form.company.length}/100</span>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        maxLength={100}
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                        placeholder="e.g. Tata Motors / Bharat Forge"
                        className="w-full border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="tech-label text-muted block mb-2">Subject / Inquiry Type</label>
                    <select
                      value={form.subject}
                      onChange={(e) => set("subject", e.target.value)}
                      className="w-full border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                    >
                      {SUBJECT_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`tech-label block ${fieldErrors.message ? "text-danger font-bold" : "text-muted"}`}>
                        Message *
                      </label>
                      <span className="font-mono text-[0.68rem] text-muted">
                        {form.message.length} / 1500
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      maxLength={1500}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Write your inquiry or message here..."
                      className={`w-full border px-4 py-3 text-sm text-foreground outline-none transition-colors resize-y ${
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

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line">
                    <p className="text-xs text-muted font-mono">
                      * Required fields. We respect your confidentiality.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="border border-accent bg-accent text-navy px-8 py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-navy hover:text-onnavy transition-all shadow-md disabled:opacity-50"
                    >
                      {submitting ? "Sending Message..." : "Send Message →"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </InView>
        </div>
      </Section>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <ContactPageInner />
    </Suspense>
  );
}
