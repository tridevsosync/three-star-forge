"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSite } from "@/store/site-store";
import { Btn } from "@/components/site/ui";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function AdminLoginPage() {
  const { login, logout, isAuthed } = useSite();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
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
        setError("Invalid administrator email or password. Please verify your credentials.");
      }
    } catch {
      setError("Unable to reach authentication service. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-navy text-onnavy blueprint-grid-dark py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient Light Cones */}
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-onnavy-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Website</span>
          </Link>
          <div className="flex items-center gap-1.5 font-mono text-[0.65rem] text-accent uppercase tracking-widest border border-accent/40 bg-accent/10 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span>Secure Access</span>
          </div>
        </div>

        {/* Main Terminal Card */}
        <div className="relative border border-onnavy/20 bg-navy-deep/95 shadow-2xl backdrop-blur-xl p-8 sm:p-10">
          {/* Top Laser Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/80 to-transparent" />

          {/* Brand Identity Header */}
          <div className="flex items-start justify-between border-b border-onnavy/15 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-11 w-11 items-center justify-center border border-accent bg-navy shadow-md">
                <span className="absolute inset-0.5 border border-accent/40" />
                <span className="font-mono text-sm font-bold text-accent tracking-tight">3S</span>
              </div>
              <div>
                <span className="block font-display text-sm font-bold tracking-[0.16em] text-onnavy sm:text-base">
                  THREE STAR
                </span>
                <div className="flex items-center gap-2">
                  <span className="tech-label text-accent font-semibold text-[0.68rem]">ENTERPRISES</span>
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  <span className="font-mono text-[0.62rem] text-onnavy-muted uppercase tracking-wider">
                    Admin Portal
                  </span>
                </div>
              </div>
            </div>

            {isAuthed ? (
              <span className="inline-flex items-center gap-1.5 border border-success/40 bg-success/15 px-2.5 py-1 font-mono text-[0.68rem] font-bold text-success uppercase">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Active</span>
              </span>
            ) : (
              <span className="font-mono text-[0.68rem] text-onnavy-muted uppercase tracking-widest border border-onnavy/15 px-2.5 py-1">
                Restricted
              </span>
            )}
          </div>

          {/* Title and Intro */}
          <div className="mt-6">
            <h1 className="font-display text-2xl font-bold text-onnavy tracking-tight sm:text-3xl">
              {isAuthed ? "Administrator Session" : "Admin Sign In"}
            </h1>
            <p className="mt-2 text-xs text-onnavy-muted leading-relaxed">
              {isAuthed
                ? "Your administrator session is already active in this browser. Proceed to the dashboard or sign out below."
                : "Enter your administrator credentials to access the control panel."}
            </p>
          </div>

          {/* Already Logged In Actions */}
          {isAuthed ? (
            <div className="mt-8 space-y-4">
              <Btn onClick={() => router.push("/admin")} variant="primary" full className="py-4">
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Btn>

              <button
                type="button"
                onClick={() => logout()}
                className="w-full border border-onnavy/20 bg-navy/50 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-onnavy-muted hover:text-danger hover:border-danger/50 hover:bg-danger/10 transition-all"
              >
                Sign Out of Current Session
              </button>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={submit} className="mt-8 space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-onnavy-muted uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-accent" />
                    Administrator Email
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full border border-onnavy/25 bg-navy/80 px-4 py-3 font-mono text-sm text-onnavy placeholder:text-onnavy-muted/40 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/50"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="font-bold text-onnavy-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-accent" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="inline-flex items-center gap-1 font-mono text-[0.68rem] text-onnavy-muted hover:text-accent transition-colors"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full border border-onnavy/25 bg-navy/80 px-4 pr-11 py-3 font-mono text-sm text-onnavy placeholder:text-onnavy-muted/40 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-onnavy-muted hover:text-accent transition-colors p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center text-xs font-mono pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-onnavy-muted hover:text-onnavy">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-onnavy/30 bg-navy text-accent focus:ring-accent accent-accent cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2.5 border border-danger/40 bg-danger/15 p-3.5 text-xs text-danger leading-relaxed font-mono">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <Btn type="submit" full disabled={loading} variant="primary" className="py-3.5 font-bold">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy border-t-transparent" />
                      <span>Verifying Credentials...</span>
                    </span>
                  ) : (
                    "Sign In →"
                  )}
                </Btn>
              </div>
            </form>
          )}
        </div>

        {/* Security Badge Footer */}
        <div className="text-center font-mono text-[0.7rem] text-onnavy-muted/70 flex items-center justify-center gap-4">
          <span>THREE STAR ENTERPRISES</span>
          <span>•</span>
          <span>Pune Works</span>
        </div>
      </div>
    </div>
  );
}
