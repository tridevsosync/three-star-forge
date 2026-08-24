import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ADMIN_CREDENTIALS } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Btn, Container, TechLabel } from "@/components/site/ui";
export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Three Star Enterprises" },
      {
        name: "description",
        content:
          "Sign in to the Three Star Enterprises demo content panel to edit site content in session state.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login — Three Star Enterprises" },
      { property: "og:description", content: "Demo content panel sign-in." },
    ],
  }),
  component: AdminLogin,
});
function AdminLogin() {
  const { login, isAuthed } = useSite();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate({ to: "/admin" });
    } else {
      setError("Invalid credentials. Use the demo login shown below.");
    }
  };
  return (
    <section className="relative flex min-h-[80vh] items-center bg-navy py-24 text-onnavy">
      <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-50" />
      <Container className="relative">
        <div className="mx-auto w-full max-w-md border border-onnavy/15 bg-navy/60 p-8 sm:p-10">
          <TechLabel tone="accent">Restricted</TechLabel>
          <h1 className="mt-4 font-display text-3xl font-semibold text-onnavy">Content panel</h1>
          <p className="mt-3 text-sm leading-relaxed text-onnavy-muted">
            {isAuthed
              ? "You are already signed in for this session."
              : "Sign in to edit site content. Changes live in browser session state only."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block">
              <span className="tech-label text-onnavy-muted">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-3 w-full border border-onnavy/20 bg-navy px-4 py-3 text-sm text-onnavy outline-none transition-colors focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="tech-label text-onnavy-muted">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-3 w-full border border-onnavy/20 bg-navy px-4 py-3 text-sm text-onnavy outline-none transition-colors focus:border-accent"
              />
            </label>

            {error ? (
              <p className="border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </p>
            ) : null}

            <Btn type="submit" full>
              Sign in
            </Btn>
          </form>

          <div className="mt-8 border-t border-onnavy/12 pt-6 font-mono text-xs leading-relaxed text-onnavy-muted">
            <p>Demo credentials</p>
            <p className="mt-2 text-onnavy">{ADMIN_CREDENTIALS.email}</p>
            <p className="text-onnavy">{ADMIN_CREDENTIALS.password}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
