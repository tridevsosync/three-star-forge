"use client";

import { useState, useRef, ReactNode, useEffect, FormEvent } from "react";
import { createPortal } from "react-dom";
import { Send, Star, X, Sparkles, UploadCloud, CheckCircle2, Award, Building2, User, HardDrive } from "lucide-react";
import { formatBytes } from "@/lib/image-meta";

export const MACHINERY_CATEGORIES = [
  "Vertical Induction Hardening Machines",
  "Horizontal Induction Hardening Machines",
  "Dual-Spindle Induction Hardening Machines",
  "Custom Induction Tooling & Coils",
  "Turnkey SPM Automation & Gantries",
  "Machine Refurbishment & CNC Retrofitting",
  "Precision Machining & Fabrication",
  "Other Turnkey Machine Manufacturing",
];

export function FeedbackModal({
  triggerLabel = "Share Your Feedback",
  triggerClassName,
  triggerChildren,
  type = "client",
  title,
  description,
  defaultCategory,
  onSubmitted,
}: {
  triggerLabel?: string;
  triggerClassName?: string;
  triggerChildren?: ReactNode;
  type?: "client" | "general";
  title?: string;
  description?: string;
  defaultCategory?: string;
  onSubmitted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const defaultCat = defaultCategory || MACHINERY_CATEGORIES[0];
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState(defaultCat);
  const [message, setMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFileName, setAvatarFileName] = useState("");
  const [avatarFileSize, setAvatarFileSize] = useState<number | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetForm = () => {
    setFullName("");
    setCompany("");
    setRating(5);
    setCategory(defaultCat);
    setMessage("");
    setAvatarUrl("");
    setAvatarPreview("");
    setAvatarFileName("");
    setAvatarFileSize(null);
    setHoverRating(null);
    setFieldErrors({});
    setSubmitting(false);
    setSubmitted(false);
    setError("");
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setOpen(false);
        if (onSubmitted) onSubmitted();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [submitted, onSubmitted]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = "Please enter your full name.";
    } else if (fullName.trim().length > 80) {
      errors.fullName = "Full name cannot exceed 80 characters.";
    }

    if (company.trim().length > 100) {
      errors.company = "Company name cannot exceed 100 characters.";
    }

    if (!message.trim()) {
      errors.message = "Please enter your review message.";
    } else if (message.trim().length < 10) {
      errors.message = "Review message must be at least 10 characters.";
    } else if (message.trim().length > 500) {
      errors.message = "Review message cannot exceed 500 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the errors in the highlighted fields.");
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          company: company.trim(),
          rating,
          category,
          message: message.trim(),
          avatarUrl: avatarUrl.trim() || undefined,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Feedback submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Image must be smaller than 3MB.");
      return;
    }
    setError("");
    setAvatarFileName(file.name);
    setAvatarFileSize(file.size);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Trigger Button */}
      {triggerChildren ? (
        <div onClick={() => setOpen(true)} className={triggerClassName}>
          {triggerChildren}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={
            triggerClassName ||
            "inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/15 px-6 py-2.5 text-xs font-bold text-accent uppercase tracking-wider shadow-sm transition-all hover:bg-accent hover:text-navy cursor-pointer"
          }
        >
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span>{triggerLabel}</span>
        </button>
      )}

      {/* Modal Popup via Portal */}
      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-navy-deep/85 backdrop-blur-md transition-opacity duration-300"
                onClick={() => !submitting && setOpen(false)}
              />

              {/* Modal Card */}
              <div className="relative w-full max-w-lg rounded-3xl border border-onnavy/20 bg-navy text-onnavy shadow-2xl overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="relative border-b border-onnavy/15 bg-navy-soft p-5 sm:p-7 shrink-0">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={submitting}
                    className="absolute top-5 right-5 rounded-full border border-onnavy/20 bg-navy/60 p-2 text-onnavy-muted hover:text-onnavy hover:border-accent transition cursor-pointer disabled:opacity-40"
                    aria-label="Close dialog"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 border border-accent/30 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Client Experience Form</span>
                  </div>

                  <h3 className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-onnavy">
                    {title || "Share Your Machinery Experience"}
                  </h3>
                  <p className="mt-1 font-sans text-xs sm:text-sm text-onnavy-muted leading-relaxed">
                    {description ||
                      "Your feedback helps manufacturing partners and showcases the reliability of Three Star custom machines."}
                  </p>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-7 overflow-y-auto flex-1 min-h-0">
                  {submitted ? (
                    <div className="py-8 sm:py-12 text-center space-y-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h4 className="font-display text-xl font-bold text-onnavy">
                        Feedback Submitted Successfully!
                      </h4>
                      <p className="text-xs sm:text-sm text-onnavy-muted max-w-sm mx-auto leading-relaxed">
                        Thank you for sharing your experience. Once approved by our team, your review will be highlighted in our public Client Testimonials section.
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            if (onSubmitted) onSubmitted();
                          }}
                          className="rounded-full bg-accent px-6 py-2 text-xs font-bold text-navy uppercase tracking-wider shadow-sm hover:opacity-90 transition cursor-pointer"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                      {error && (
                        <div className="rounded-2xl border border-danger/40 bg-danger/10 p-3.5 text-xs font-semibold text-danger">
                          {error}
                        </div>
                      )}

                      {/* Name & Company */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className={`mb-1.5 block font-bold uppercase tracking-wider text-[0.68rem] ${fieldErrors.fullName ? "text-danger" : "text-onnavy-muted"}`}>
                            Full Name <span className="text-accent">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              maxLength={80}
                              disabled={submitting}
                              placeholder="e.g. Rajesh Kulkarni"
                              value={fullName}
                              onChange={(e) => {
                                setFullName(e.target.value);
                                if (fieldErrors.fullName) {
                                  setFieldErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.fullName;
                                    return next;
                                  });
                                }
                              }}
                              className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs text-onnavy placeholder:text-onnavy-muted/50 outline-none transition disabled:opacity-50 ${
                                fieldErrors.fullName
                                  ? "border-danger bg-danger/10 focus:border-danger focus:ring-1 focus:ring-danger"
                                  : "border-onnavy/20 bg-navy-soft focus:border-accent focus:ring-1 focus:ring-accent"
                              }`}
                            />
                            {fieldErrors.fullName && (
                              <p className="mt-1.5 flex items-center gap-1 text-[0.7rem] font-semibold text-danger animate-fadeIn">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                                <span>{fieldErrors.fullName}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className={`mb-1.5 block font-bold uppercase tracking-wider text-[0.68rem] ${fieldErrors.company ? "text-danger" : "text-onnavy-muted"}`}>
                            Company / Role
                          </label>
                          <input
                            type="text"
                            maxLength={100}
                            disabled={submitting}
                            placeholder="e.g. Automotive Parts Plant"
                            value={company}
                            onChange={(e) => {
                              setCompany(e.target.value);
                              if (fieldErrors.company) {
                                setFieldErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.company;
                                  return next;
                                });
                              }
                            }}
                            className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs text-onnavy placeholder:text-onnavy-muted/50 outline-none transition disabled:opacity-50 ${
                              fieldErrors.company
                                ? "border-danger bg-danger/10 focus:border-danger focus:ring-1 focus:ring-danger"
                                : "border-onnavy/20 bg-navy-soft focus:border-accent focus:ring-1 focus:ring-accent"
                            }`}
                          />
                          {fieldErrors.company && (
                            <p className="mt-1.5 flex items-center gap-1 text-[0.7rem] font-semibold text-danger animate-fadeIn">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                              <span>{fieldErrors.company}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Rating & Machinery Category */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block font-bold uppercase tracking-wider text-onnavy-muted text-[0.68rem]">
                            Star Rating ({rating} of 5 Stars) <span className="text-accent">*</span>
                          </label>
                          <div className="flex items-center gap-1.5 py-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                disabled={submitting}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(null)}
                                className="transition hover:scale-110 disabled:opacity-50 cursor-pointer p-0.5"
                                title={`${star} Star${star > 1 ? "s" : ""}`}
                              >
                                <Star
                                  className={`h-6 w-6 transition-colors duration-150 ${
                                    star <= (hoverRating ?? rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-onnavy/20"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block font-bold uppercase tracking-wider text-onnavy-muted text-[0.68rem]">
                            Machine / Equipment Category <span className="text-accent">*</span>
                          </label>
                          <select
                            value={category}
                            disabled={submitting}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-2xl border border-onnavy/20 bg-navy-soft px-3 py-2 text-xs text-onnavy outline-none transition focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 cursor-pointer"
                          >
                            {MACHINERY_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat} className="bg-navy text-onnavy">
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Profile / Plant Photo Upload */}
                      <div>
                        <label className="mb-1.5 block font-bold uppercase tracking-wider text-onnavy-muted text-[0.68rem]">
                          Profile or Plant Photo (Optional)
                        </label>
                        <div
                          onClick={() => !submitting && avatarInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            handleAvatarFile(e.dataTransfer.files[0]);
                          }}
                          className={`relative flex items-center gap-3.5 rounded-2xl border-2 border-dashed px-4 py-3 transition cursor-pointer ${
                            avatarPreview
                              ? "border-accent/60 bg-accent/10"
                              : "border-onnavy/20 bg-navy-soft/60 hover:border-accent/40 hover:bg-navy-soft"
                          } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {avatarPreview ? (
                            <>
                              <img
                                src={avatarPreview}
                                alt="Preview"
                                className="h-12 w-12 rounded-xl object-cover border-2 border-accent/60 shrink-0 shadow-sm"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-xs font-bold text-onnavy truncate max-w-[160px] sm:max-w-[220px]">
                                    {avatarFileName}
                                  </p>
                                  <span className="rounded bg-accent/25 px-1.5 py-0.5 text-[0.6rem] font-extrabold text-accent uppercase shrink-0">
                                    {avatarFileName.split(".").pop()?.toUpperCase() || "IMG"}
                                  </span>
                                </div>
                                <p className="text-[0.68rem] font-mono text-accent font-semibold mt-0.5 flex items-center gap-1">
                                  <HardDrive className="h-3 w-3 inline shrink-0" />
                                  <span>Size: {avatarFileSize ? formatBytes(avatarFileSize) : "180 KB"}</span>
                                </p>
                                <p className="text-[0.62rem] text-onnavy-muted">Click to replace photo</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="h-5 w-5 text-accent" />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAvatarUrl("");
                                    setAvatarPreview("");
                                    setAvatarFileName("");
                                    setAvatarFileSize(null);
                                  }}
                                  className="text-xs text-onnavy-muted hover:text-danger ml-1 p-1 cursor-pointer"
                                  title="Remove photo"
                                >
                                  ✕
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 text-accent shrink-0">
                                <UploadCloud className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-onnavy">
                                  Upload photo or avatar
                                </p>
                                <p className="text-[0.68rem] text-onnavy-muted">JPG, PNG, or WebP up to 3MB</p>
                              </div>
                            </>
                          )}
                          <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            disabled={submitting}
                            className="hidden"
                            onChange={(e) => handleAvatarFile(e.target.files?.[0] ?? null)}
                          />
                        </div>
                      </div>

                      {/* Review Text with Live Character Counter */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className={`block font-bold uppercase tracking-wider text-[0.68rem] ${fieldErrors.message ? "text-danger" : "text-onnavy-muted"}`}>
                            Your Review / Experience <span className="text-accent">*</span>
                          </label>
                          <span
                            className={`font-mono text-[0.65rem] font-semibold transition-colors ${
                              message.length >= 450
                                ? "text-amber-400 font-bold"
                                : "text-onnavy-muted/70"
                            }`}
                          >
                            {message.length} / 500
                          </span>
                        </div>
                        <textarea
                          maxLength={500}
                          disabled={submitting}
                          rows={3}
                          placeholder="Describe the machine performance, build quality, testing, or engineering support (10-500 characters)..."
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            if (fieldErrors.message) {
                              setFieldErrors((prev) => {
                                const next = { ...prev };
                                delete next.message;
                                return next;
                              });
                            }
                          }}
                          className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs text-onnavy placeholder:text-onnavy-muted/50 outline-none transition disabled:opacity-50 resize-y leading-relaxed ${
                            fieldErrors.message
                              ? "border-danger bg-danger/10 focus:border-danger focus:ring-1 focus:ring-danger"
                              : "border-onnavy/20 bg-navy-soft focus:border-accent focus:ring-1 focus:ring-accent"
                          }`}
                        />
                        {fieldErrors.message && (
                          <p className="mt-1.5 flex items-center gap-1 text-[0.7rem] font-semibold text-danger animate-fadeIn">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                            <span>{fieldErrors.message}</span>
                          </p>
                        )}
                      </div>

                      {/* Modal Footer Controls */}
                      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 border-t border-onnavy/15 pt-4 mt-4">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          disabled={submitting}
                          className="rounded-full border border-onnavy/20 bg-navy-soft px-5 py-2.5 text-xs font-semibold text-onnavy-muted hover:text-onnavy transition disabled:opacity-50 cursor-pointer text-center"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-bold text-navy uppercase tracking-wider shadow-sm transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
                        >
                          {submitting ? "Submitting..." : "Submit Feedback"}
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
