"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function ContactPage() {
  const { company, createContact, openRfqModal } = useSite();
  const [form, setForm] = useState(emptyContactForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please provide your name, email address, and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.phone && form.phone.trim()) {
      const cleanPhone = form.phone.replace(/[\s\-\(\)\.]/g, "");
      if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
        setError("Please enter a valid phone number (7 to 15 digits, e.g. +91 9823463655).");
        return;
      }
    }
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
            <div className="corner-marks border border-line bg-surface shadow-lg">
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
                        <label className="tech-label text-muted block">Your Name *</label>
                        {form.name ? (
                          <span className="font-mono text-[0.68rem] text-muted">{form.name.length}/80</span>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={80}
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="e.g. Rajesh Patil"
                        className="w-full border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="tech-label text-muted block">Email Address *</label>
                        {form.email ? (
                          <span className="font-mono text-[0.68rem] text-muted">{form.email.length}/100</span>
                        ) : null}
                      </div>
                      <input
                        type="email"
                        required
                        maxLength={100}
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="e.g. r.patil@company.com"
                        className="w-full border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="tech-label text-muted block">Phone Number</label>
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
                        className="w-full border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent font-mono"
                      />
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
                      <label className="tech-label text-muted block">Message *</label>
                      <span className="font-mono text-[0.68rem] text-muted">
                        {form.message.length} / 1500
                      </span>
                    </div>
                    <textarea
                      required
                      rows={5}
                      maxLength={1500}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Write your inquiry or message here..."
                      className="w-full border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent resize-y"
                    />
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
