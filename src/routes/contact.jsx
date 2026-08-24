import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { IMAGES } from "@/data/images";
import { useSite } from "@/store/site-store";
import { Btn, Reveal, SectionHead, TechLabel } from "@/components/site/ui";
import { PageHero, Section } from "@/components/site/blocks";
import { InView } from "@/components/site/reveal";
export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Three Star Enterprises, Dehu Gaon, Pune" },
      {
        name: "description",
        content:
          "Contact Three Star Enterprises in Dehu Gaon, Pune for design, turnkey manufacturing, NPI and automation enquiries. Phone +91 9823463655 / 8788848977.",
      },
      { property: "og:title", content: "Contact Three Star Enterprises" },
      {
        property: "og:description",
        content:
          "Share your drawings, concept or line requirement with our engineering team in Pune.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "THREE STAR ENTERPRISES",
          email: "3starchavan@gmail.com",
          telephone: "+91 9823463655",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Gat No 78, Near Parandwal Chowk Behind Atharva Hotel, Dehu Gaon, TQ: Haveli",
            addressLocality: "Pune",
            addressRegion: "Maharashtra",
            postalCode: "412109",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  component: Contact,
});
const INDUSTRY_OPTIONS = [
  "Material Handling",
  "Industrial Automation",
  "Pharmaceutical",
  "Food Industry",
  "Process Industry",
  "Engineering Equipment",
  "Line Automation",
  "Other",
];
const REQUIREMENTS = [
  "Design Engineering",
  "Turnkey Manufacturing",
  "New Product Introduction (NPI)",
  "Procurement Support",
  "Process Optimization",
  "Automation / Material Handling",
  "Machine Assembly / Refurbishment",
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
function Contact() {
  const { company, addEnquiry } = useSite();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email and message.");
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
        eyebrow="Contact"
        title="Tell us what you need engineered."
        intro="Send a concept, a drawing set or a line requirement. Our team in Dehu Gaon, Pune will come back to you with a route to build it."
        image={IMAGES.pageContact}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* DETAILS */}
          <InView className="lg:col-span-5">
            <SectionHead index="7.1" eyebrow="Direct contact" title="Speak to the team" />

            <dl className="mt-10 divide-y divide-line border-y border-line">
              <Row label="Contact person" value={company.contactPerson} />
              <Row label="Company" value={company.name} />
              <Row label="Address" value={company.address} />
              <Row
                label="Phone"
                value={company.phone}
                href={`tel:${(company.phone.split("/")[0] ?? "").trim()}`}
              />

              <Row label="Email" value={company.email} href={`mailto:${company.email}`} />
              <Row label="Website" value={company.website} />
            </dl>

            <div className="mt-10 border border-line bg-surface p-7">
              <TechLabel tone="accent">Working scope</TechLabel>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Design only, build to print or a full turnkey programme. Project details available
                on request — talk to our team about your requirement.
              </p>
            </div>
          </InView>

          {/* FORM */}
          <InView delay={120} className="lg:col-span-7">
            <div className="border border-line bg-surface">
              <div className="border-b border-line px-7 py-6 sm:px-9">
                <TechLabel>Enquiry form</TechLabel>
                <h2 className="mt-3 font-display text-xl font-semibold text-foreground">
                  Start a project enquiry
                </h2>
              </div>

              {sent ? (
                <div className="px-7 py-16 text-center sm:px-9">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center border border-accent/50 bg-accent/10">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7 text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 12.5l5 5L20 6.5" />
                    </svg>
                  </div>
                  <h3 className="mt-7 font-display text-2xl font-semibold text-foreground">
                    Enquiry received
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
                    Thank you — your requirement has been captured for this session. Our team will
                    review the scope and respond to you directly.
                  </p>
                  <p className="mt-4 font-mono text-xs text-muted">
                    Demo site — submissions are stored in browser session state only.
                  </p>
                  <div className="mt-9 flex flex-wrap justify-center gap-4">
                    <Btn
                      variant="outline"
                      onClick={() => {
                        setForm(empty);
                        setSent(false);
                      }}
                    >
                      Send another enquiry
                    </Btn>
                    <Btn to="/projects" variant="ghost">
                      Browse portfolio
                    </Btn>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="px-7 py-8 sm:px-9 sm:py-10">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Name"
                      required
                      value={form.name}
                      onChange={(v) => set("name", v)}
                    />
                    <Field
                      label="Company"
                      value={form.company}
                      onChange={(v) => set("company", v)}
                    />
                    <Field
                      label="Email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(v) => set("email", v)}
                    />
                    <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
                    <Select
                      label="Industry"
                      options={INDUSTRY_OPTIONS}
                      value={form.industry}
                      onChange={(v) => set("industry", v)}
                    />
                    <Select
                      label="Project requirement"
                      options={REQUIREMENTS}
                      value={form.requirement}
                      onChange={(v) => set("requirement", v)}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block">
                      <span className="tech-label text-muted">
                        Message <span className="text-accent">*</span>
                      </span>
                      <textarea
                        rows={6}
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Describe the equipment, component or line requirement."
                        className="mt-3 w-full resize-y border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
                      />
                    </label>
                  </div>

                  {error ? (
                    <p className="mt-5 border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
                      {error}
                    </p>
                  ) : null}

                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <Btn type="submit">Submit enquiry</Btn>
                    <p className="font-mono text-xs text-muted">No backend — session state only.</p>
                  </div>
                </form>
              )}
            </div>
          </InView>
        </div>
      </Section>

      <Reveal>
        <Section dark tight grid>
          <SectionHead
            dark
            index="7.2"
            eyebrow="Location"
            title="Dehu Gaon, TQ Haveli, District Pune"
            intro="Our workshop and engineering base sits within Pune's manufacturing belt, close to forging, machining and automation customers."
          />
        </Section>
      </Reveal>
    </>
  );
}
function Row({ label, value, href }) {
  return (
    <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <dt className="tech-label text-muted">{label}</dt>
      <dd className="text-sm leading-relaxed text-foreground">
        {href ? (
          <a href={href} className="transition-colors hover:text-accent">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="block">
      <span className="tech-label text-muted">
        {label} {required ? <span className="text-accent">*</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
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
        className="mt-3 w-full border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
