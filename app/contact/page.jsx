"use client";

import { useState } from "react";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Btn, Reveal, SectionHead, TechLabel, Badge } from "@/components/site/ui";
import { PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";

const INDUSTRY_OPTIONS = [
  "Material Handling",
  "Industrial Automation",
  "Pharmaceutical",
  "Food Industry",
  "Process Industry",
  "Engineering Equipment",
  "Line Automation",
  "Other Industrial",
];

const REQUIREMENTS = [
  "Design Engineering & 3D Modeling",
  "Turnkey Machine Manufacturing",
  "Induction Hardening Machine Build",
  "New Product Introduction (NPI)",
  "Material Handling / Conveyor Systems",
  "Inspection & NDT Sorting Fixture",
  "Machine Refurbishment / Retrofit",
];

const empty = {
  name: "",
  company: "",
  email: "",
  phone: "",
  industry: "",
  requirement: "",
  message: "",
};

export default function ContactPage() {
  const { company, addEnquiry } = useSite();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email address, and a brief description of your requirement.");
      return;
    }
    setError("");
    addEnquiry(form);
    setSent(true);
  };

  return (
    <>
      <PageHero
        index="07"
        eyebrow="Request For Quotation"
        title="Tell us what you need engineered and manufactured."
        intro="Share your part drawings, concept specifications, or machine line requirements. Our engineering team in Dehu Gaon, Pune will review the scope and provide a manufacturing proposal."
        image={IMAGES.pageContact}
      />

      <Section grid>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* LEFT: Contact Cards & Details */}
          <InView className="lg:col-span-5 space-y-8">
            <div>
              <SectionHead index="7.1" eyebrow="Pune Headquarters" title="Direct Communication" />
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Reach out directly by phone, email, or arrange an on-site visit to our Pune workshop facility.
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
                  <p className="text-xs text-muted">Direct technical RFQ submissions</p>
                </div>
              </div>

              <div className="border border-line bg-surface p-6 flex items-start gap-4">
                <span className="p-3 bg-accent/10 text-accent border border-accent/30 text-lg font-bold">
                  📍
                </span>
                <div>
                  <TechLabel>Works Location</TechLabel>
                  <p className="mt-1 text-xs leading-relaxed text-foreground font-medium">{company.address}</p>
                  <p className="mt-2 text-xs font-mono text-accent">Pune District, Maharashtra - 412109</p>
                </div>
              </div>
            </div>
          </InView>

          {/* RIGHT: RFQ Form Wizard */}
          <InView delay={120} className="lg:col-span-7">
            <div className="corner-marks border border-line bg-surface shadow-lg">
              <div className="border-b border-line bg-surface-soft px-8 py-6 flex items-center justify-between">
                <div>
                  <TechLabel tone="accent">Engineering RFQ</TechLabel>
                  <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                    Project Quotation & Consultation Form
                  </h2>
                </div>
                <Badge variant="accent">CONFIDENTIAL</Badge>
              </div>

              {sent ? (
                <div className="px-8 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center border border-accent bg-accent/10">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-8 w-8 text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M4 12.5l5 5L20 6.5" />
                    </svg>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
                    Enquiry Received Successfully
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                    Thank you, <span className="font-semibold text-foreground">{form.name}</span>. Your project parameters have been recorded. Our engineering department will review your scope and get in touch directly.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Btn
                      variant="outline"
                      onClick={() => {
                        setForm(empty);
                        setSent(false);
                      }}
                    >
                      Submit Another Requirement
                    </Btn>
                    <Btn to="/projects" variant="ghost">
                      Browse Portfolio →
                    </Btn>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="p-8 sm:p-10 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Contact Name"
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={form.name}
                      onChange={(v) => set("name", v)}
                    />
                    <Field
                      label="Company / OEM Organisation"
                      placeholder="e.g. Bharat Heavy Forge"
                      value={form.company}
                      onChange={(v) => set("company", v)}
                    />
                    <Field
                      label="Email Address"
                      type="email"
                      placeholder="e.g. engineering@company.com"
                      required
                      value={form.email}
                      onChange={(v) => set("email", v)}
                    />
                    <Field
                      label="Contact Phone / WhatsApp"
                      placeholder="e.g. +91 98765 43210"
                      value={form.phone}
                      onChange={(v) => set("phone", v)}
                    />
                    <Select
                      label="Industry Sector"
                      options={INDUSTRY_OPTIONS}
                      value={form.industry}
                      onChange={(v) => set("industry", v)}
                    />
                    <Select
                      label="Primary Requirement"
                      options={REQUIREMENTS}
                      value={form.requirement}
                      onChange={(v) => set("requirement", v)}
                    />
                  </div>

                  <div>
                    <label className="block">
                      <span className="tech-label text-muted">
                        Machine / Line Requirement Description <span className="text-accent">*</span>
                      </span>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Describe component dimensions, material grade, cycle time goals, hardening case depth, or machine quantity."
                        className="mt-2 w-full resize-y border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
                      />
                    </label>
                  </div>

                  {error && (
                    <div className="border border-danger/50 bg-danger/10 px-4 py-3 text-xs text-danger font-mono">
                      ⚠️ {error}
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <Btn type="submit" variant="primary" className="px-8 py-4">
                      Submit Technical RFQ
                    </Btn>
                    <span className="font-mono text-xs text-muted">
                      🔒 All drawings & specifications kept strictly confidential under NDA.
                    </span>
                  </div>
                </form>
              )}
            </div>
          </InView>
        </div>
      </Section>

      {/* VISITOR & LOGISTICS STRIP */}
      <Reveal>
        <Section dark tight grid>
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SectionHead
                dark
                index="7.2"
                eyebrow="Logistics & Access"
                title="Visiting the Pune Manufacturing Facility"
                intro="Located in Dehu Gaon within Pune's industrial corridor, our workshop is well-connected to major expressways and OEM manufacturing hubs in Chakan, Bhosari, and Talwade."
              />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="border border-onnavy/20 bg-navy-soft p-5">
                <TechLabel tone="accent">Transportation</TechLabel>
                <p className="mt-1 text-xs text-onnavy-muted">30 mins from Pune Railway Station • 45 mins from Pune International Airport (PNQ)</p>
              </div>
            </div>
          </div>
        </Section>
      </Reveal>
    </>
  );
}

function Field({ label, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <label className="block">
      <span className="tech-label text-muted">
        {label} {required ? <span className="text-accent">*</span> : null}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-line bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
      />
    </label>
  );
}

function Select({ label, options, value, onChange }) {
  return (
    <label className="block">
      <span className="tech-label text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-line bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
      >
        <option value="">Select Category…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
