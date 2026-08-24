import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminHead, MiniBtn } from "@/components/site/admin-ui";
import { useSite } from "@/store/site-store";
export const Route = createFileRoute("/admin/enquiries")({
  component: AdminEnquiries,
});
function AdminEnquiries() {
  const { enquiries, update } = useSite();
  const [query, setQuery] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const list = enquiries.filter(
    (e) =>
      (!onlyUnread || !e.read) &&
      `${e.name} ${e.company} ${e.email} ${e.industry}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-8">
      <AdminHead
        title="Contact enquiries"
        intro="Enquiries submitted through the contact form during this browser session. Nothing is sent to a server."
      />

      <div className="flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search enquiries"
          className="w-full max-w-xs border border-line bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
        <button
          type="button"
          onClick={() => setOnlyUnread((v) => !v)}
          className={`border px-4 py-2 text-[0.7rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${
            onlyUnread
              ? "border-accent bg-accent/10 text-accent"
              : "border-line text-muted hover:border-line-strong"
          }`}
        >
          Unread only
        </button>
      </div>

      {list.length === 0 ? (
        <div className="border border-line bg-surface px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-foreground">No enquiries yet</p>
          <p className="mt-2 text-sm text-muted">
            Submissions from the contact page will appear here for the duration of this session.
          </p>
        </div>
      ) : (
        <div className="space-y-px bg-line">
          {list.map((e) => (
            <article key={e.id} className="bg-surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-lg font-semibold text-foreground">{e.name}</h2>
                    {!e.read ? (
                      <span className="border border-accent px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.12em] uppercase text-accent">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {e.company || "—"} · {new Date(e.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <MiniBtn
                    onClick={() =>
                      update(
                        "enquiries",
                        enquiries.map((x) => (x.id === e.id ? { ...x, read: !x.read } : x)),
                      )
                    }
                  >
                    {e.read ? "Mark unread" : "Mark read"}
                  </MiniBtn>
                  <MiniBtn
                    tone="danger"
                    onClick={() =>
                      update(
                        "enquiries",
                        enquiries.filter((x) => x.id !== e.id),
                      )
                    }
                  >
                    Delete
                  </MiniBtn>
                </div>
              </div>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Email", e.email],
                  ["Phone", e.phone],
                  ["Industry", e.industry],
                  ["Requirement", e.requirement],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="tech-label text-muted">{label}</dt>
                    <dd className="mt-1 break-words text-foreground">{value || "—"}</dd>
                  </div>
                ))}
              </dl>

              {e.message ? (
                <p className="mt-5 border-l-2 border-line-strong pl-4 text-sm leading-relaxed text-muted">
                  {e.message}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
