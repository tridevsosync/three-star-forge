"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_CREDENTIALS } from "@/data/site";
import { useSite } from "@/store/site-store";
import { Btn, Container, TechLabel } from "@/components/site/ui";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";

export default function AdminLoginPage() {
  const { login, logout, isAuthed } = useSite();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your administrator email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const ok = await login(email.trim(), password.trim());
      if (ok) {
        router.push("/admin");
      } else {
        setError("Invalid credentials. Please verify your email and password or use the demo login.");
      }
    } catch {
      setError("Unable to connect to authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
    setError("");
  };

  const handleInstantDemoLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const ok = await login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
      if (ok) {
        router.push("/admin");
      } else {
        setError("Demo login failed. Please try again.");
      }
    } catch {
      setError("Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-navy py-16 text-onnavy sm:py-24">
      {/* Background Motifs */}
      <div className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/15 via-navy/50 to-navy-deep" />

      <Container className="relative z-10">
        <div className="mx-auto w-full max-w-md">
          {/* Back Link */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-onnavy-muted hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Website</span>
            </Link>
            <span className="font-mono text-[0.65rem] text-accent uppercase tracking-widest">
              TSE Security Core
            </span>
          </div>

          {/* Login Card Terminal */}
          <div className="relative border border-onnavy/20 bg-navy-deep/90 p-8 sm:p-10 shadow-2xl backdrop-blur-md">
            {/* Top Cyan Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/80 to-transparent" />

            <div className="flex items-center justify-between border-b border-onnavy/15 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <TechLabel tone="accent">Admin Studio</TechLabel>
              </div>
              {isAuthed ? (
                <span className="flex items-center gap-1.5 border border-success/40 bg-success/15 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold text-success uppercase">
                  <CheckCircle2 className="h-3 w-3" />
                  Active Session
                </span>
              ) : (
                <span className="font-mono text-[0.65rem] text-onnavy-muted uppercase tracking-wider">
                  Tier-1 Clearance
                </span>
              )}
            </div>

            <div className="mt-6">
              <h1 className="font-display text-2xl font-bold text-onnavy tracking-tight sm:text-3xl">
                {isAuthed ? "Session Active" : "Authorized Sign In"}
              </h1>
              <p className="mt-2 text-xs text-onnavy-muted leading-relaxed">
                {isAuthed
                  ? "Your administrator session is already verified for this browser."
                  : "Enter administrative credentials to access shop-floor machinery controls, RFQs, and visual archives."}
              </p>
            </div>

            {isAuthed ? (
              <div className="mt-8 space-y-4">
                <Btn onClick={() => router.push("/admin")} full>
                  Enter Command Console →
                </Btn>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full border border-onnavy/25 bg-navy/60 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-onnavy transition-all hover:border-danger hover:bg-danger/10 hover:text-danger"
                >
                  Sign Out of Session
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 space-y-5">
                {/* Email Field */}
                <div>
                  <label className="flex items-center justify-between">
                    <span className="tech-label text-onnavy-muted text-xs uppercase">
                      Admin Email
                    </span>
                    <span className="font-mono text-[0.65rem] text-accent">Required</span>
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-onnavy-muted">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={ADMIN_CREDENTIALS.email}
                      className="w-full border border-onnavy/20 bg-navy/80 pl-10 pr-4 py-3 font-mono text-sm text-onnavy placeholder:text-onnavy-muted/40 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="flex items-center justify-between">
                    <span className="tech-label text-onnavy-muted text-xs uppercase">
                      Security Key
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="inline-flex items-center gap-1 font-mono text-[0.65rem] text-onnavy-muted hover:text-accent transition-colors"
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="h-3 w-3" /> Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" /> Show
                        </>
                      )}
                    </button>
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-onnavy-muted">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full border border-onnavy/20 bg-navy/80 pl-10 pr-10 py-3 font-mono text-sm text-onnavy placeholder:text-onnavy-muted/40 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-onnavy-muted hover:text-accent transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {error ? (
                  <div className="flex items-start gap-2.5 border border-danger/40 bg-danger/10 p-3.5 text-xs text-danger leading-relaxed">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                ) : null}

                {/* Buttons */}
                <div className="space-y-3 pt-2">
                  <Btn type="submit" full disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-navy border-t-transparent" />
                        <span>Authenticating...</span>
                      </span>
                    ) : (
                      "Sign In to Console →"
                    )}
                  </Btn>

                  <button
                    type="button"
                    onClick={handleInstantDemoLogin}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 border border-accent/40 bg-accent/10 py-3 font-mono text-xs font-bold uppercase tracking-wider text-accent transition-all hover:bg-accent hover:text-navy"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>1-Click Instant Demo Login</span>
                  </button>
                </div>
              </form>
            )}

            {/* Quick Autofill Helper Box */}
            <div className="mt-8 border-t border-onnavy/15 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[0.68rem] text-onnavy-muted uppercase tracking-wider">
                  <KeyRound className="h-3 w-3 text-accent" />
                  <span>Demo Credentials</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="font-mono text-[0.65rem] font-bold text-accent uppercase tracking-widest underline hover:text-white transition-colors"
                >
                  Autofill Form
                </button>
              </div>

              <div
                onClick={handleFillDemo}
                className="mt-2.5 cursor-pointer border border-onnavy/15 bg-navy/60 p-3 font-mono text-xs transition-all hover:border-accent/50 hover:bg-navy/80"
                title="Click to copy & autofill"
              >
                <div className="flex items-center justify-between text-onnavy">
                  <span className="text-onnavy-muted text-[0.7rem]">Email:</span>
                  <span className="text-accent font-semibold">{ADMIN_CREDENTIALS.email}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-onnavy">
                  <span className="text-onnavy-muted text-[0.7rem]">Password:</span>
                  <span className="text-accent font-semibold">{ADMIN_CREDENTIALS.password}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
