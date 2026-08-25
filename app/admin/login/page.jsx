"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_CREDENTIALS } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Btn, Container, TechLabel } from "@/components/site/ui";

export default function AdminLoginPage() {
  const { login, logout, isAuthed } = useSite();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      router.push("/admin");
    } else {
      setError("Invalid credentials. Use the demo login shown below.");
    }
  };

  const handleFillDemo = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
    setError("");
  };

  const handleInstantDemoLogin = () => {
    login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
    router.push("/admin");
  };

  return (
    <section className="relative flex min-h-[80vh] items-center bg-navy py-24 text-onnavy">
      <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-50" />
      <Container className="relative">
        <div className="mx-auto w-full max-w-md border border-onnavy/15 bg-navy/80 p-8 sm:p-10 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <TechLabel tone="accent">Restricted</TechLabel>
            {isAuthed ? (
              <span className="border border-success/40 bg-success/10 px-2 py-0.5 font-mono text-[0.65rem] text-success">
                Active Session
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold text-onnavy">Content panel</h1>
          <p className="mt-3 text-sm leading-relaxed text-onnavy-muted">
            {isAuthed
              ? "You are currently signed in for this session."
              : "Sign in to edit site content. Changes live in browser session state only."}
          </p>

          {isAuthed ? (
            <div className="mt-8 space-y-4">
              <Btn onClick={() => router.push("/admin")} full>
                Enter Admin Dashboard →
              </Btn>
              <Btn
                variant="light"
                onClick={() => {
                  logout();
                }}
                full
              >
                Sign out
              </Btn>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block">
                <span className="tech-label text-onnavy-muted">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={ADMIN_CREDENTIALS.email}
                  className="mt-3 w-full border border-onnavy/20 bg-navy px-4 py-3 text-sm text-onnavy outline-none transition-colors focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="tech-label text-onnavy-muted">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••"
                  className="mt-3 w-full border border-onnavy/20 bg-navy px-4 py-3 text-sm text-onnavy outline-none transition-colors focus:border-accent"
                />
              </label>

              {error ? (
                <p className="border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </p>
              ) : null}

              <div className="space-y-3 pt-2">
                <Btn type="submit" full>
                  Sign in
                </Btn>
                <Btn
                  type="button"
                  variant="light"
                  onClick={handleInstantDemoLogin}
                  full
                >
                  Instant 1-Click Demo Login
                </Btn>
              </div>
            </form>
          )}

          <div className="mt-8 border-t border-onnavy/12 pt-6 font-mono text-xs leading-relaxed text-onnavy-muted">
            <div className="flex items-center justify-between">
              <span>Demo credentials</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[0.65rem] text-accent uppercase tracking-wider underline hover:text-white"
              >
                Autofill
              </button>
            </div>
            <div
              onClick={handleFillDemo}
              className="mt-2 cursor-pointer rounded border border-onnavy/10 bg-navy/40 p-2.5 transition-colors hover:border-accent/40"
              title="Click to autofill"
            >
              <p className="text-onnavy">Email: <span className="text-accent">{ADMIN_CREDENTIALS.email}</span></p>
              <p className="text-onnavy">Password: <span className="text-accent">{ADMIN_CREDENTIALS.password}</span></p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
