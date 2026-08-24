import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminHead, MiniBtn, Panel, TextField } from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";
export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});
function AdminContent() {
  const { company, home, update } = useSite();
  const [saved, setSaved] = useState(null);
  const setCompany = (key, value) => update("company", { ...company, [key]: value });
  const setHome = (key, value) => update("home", { ...home, [key]: value });
  const flash = (msg) => {
    setSaved(msg);
    window.setTimeout(() => setSaved(null), 2200);
  };
  return (
    <div className="space-y-10">
      <AdminHead
        title="Company & homepage content"
        intro="Edit the details used across the public site. Updates apply immediately in this session."
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
          <MiniBtn tone="accent" onClick={() => flash("Company saved")}>
            Confirm company details
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
          <MiniBtn tone="accent" onClick={() => flash("Homepage saved")}>
            Confirm homepage copy
          </MiniBtn>
        </div>
      </Panel>
    </div>
  );
}
