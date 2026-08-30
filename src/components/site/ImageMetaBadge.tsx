"use client";

import { getImageMeta, ImageMeta, formatBytes } from "@/lib/image-meta";
import { Image as ImageIcon, FileText, CheckCircle2, HardDrive } from "lucide-react";

export interface ImageMetaBadgeProps {
  src?: string | null;
  fileName?: string;
  fileSize?: number;
  variant?: "badge" | "pill" | "overlay" | "upload-preview" | "panel";
  className?: string;
  onRemove?: () => void;
  onChange?: () => void;
}

export function ImageMetaBadge({
  src,
  fileName,
  fileSize,
  variant = "badge",
  className = "",
  onRemove,
  onChange,
}: ImageMetaBadgeProps) {
  const meta: ImageMeta = getImageMeta(src, { fileName, fileSize });

  if (!src && !fileName) return null;

  if (variant === "upload-preview") {
    return (
      <div
        className={`flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-3 text-xs text-onnavy ${className}`}
      >
        {src ? (
          <img
            src={src}
            alt={meta.fileName}
            className="h-11 w-11 rounded-xl object-cover border border-accent/40 shrink-0"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20 text-accent shrink-0">
            <ImageIcon className="h-5 w-5" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-sans text-xs font-bold text-onnavy truncate max-w-[200px] sm:max-w-xs">
              {meta.fileName}
            </p>
            <span className="rounded-full bg-accent/25 px-2 py-0.5 text-[0.62rem] font-extrabold text-accent uppercase">
              {meta.format}
            </span>
          </div>
          <p className="font-mono text-[0.68rem] text-accent font-semibold mt-0.5 flex items-center gap-1.5">
            <HardDrive className="h-3 w-3" />
            <span>Size: {meta.fileSizeFormatted}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <CheckCircle2 className="h-5 w-5 text-accent" />
          {onChange && (
            <button
              type="button"
              onClick={onChange}
              className="text-[0.68rem] font-bold text-accent hover:underline ml-1 cursor-pointer"
            >
              Change
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div
        className={`absolute bottom-0 inset-x-0 bg-navy-deep/85 backdrop-blur-md border-t border-onnavy/15 px-3 py-1.5 flex items-center justify-between text-[0.68rem] font-mono text-onnavy-muted transition-opacity z-10 ${className}`}
      >
        <span className="truncate max-w-[180px] font-sans font-semibold text-onnavy">
          {meta.fileName}
        </span>
        <span className="shrink-0 text-accent font-bold">{meta.fileSizeFormatted}</span>
      </div>
    );
  }

  if (variant === "panel") {
    return (
      <div
        className={`rounded-2xl border border-line bg-background/80 p-3 text-xs font-sans space-y-1.5 ${className}`}
      >
        <div className="flex items-center justify-between text-[0.68rem] text-muted">
          <span className="uppercase font-bold tracking-wider">File Name</span>
          <span className="font-mono font-bold text-foreground truncate max-w-[220px]">
            {meta.fileName}
          </span>
        </div>
        <div className="flex items-center justify-between text-[0.68rem] text-muted">
          <span className="uppercase font-bold tracking-wider">File Size</span>
          <span className="font-mono font-bold text-accent">{meta.fileSizeFormatted}</span>
        </div>
        <div className="flex items-center justify-between text-[0.68rem] text-muted">
          <span className="uppercase font-bold tracking-wider">Format</span>
          <span className="font-mono font-bold text-foreground">{meta.format}</span>
        </div>
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border border-onnavy/20 bg-navy-deep/75 backdrop-blur-md px-2.5 py-0.5 text-[0.65rem] font-mono text-onnavy-muted ${className}`}
      >
        <ImageIcon className="h-3 w-3 text-accent shrink-0" />
        <span className="font-sans font-medium text-onnavy truncate max-w-[130px]">
          {meta.fileName}
        </span>
        <span className="text-onnavy/40">·</span>
        <span className="text-accent font-bold shrink-0">{meta.fileSizeFormatted}</span>
      </div>
    );
  }

  // Default "badge" floating pill
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-onnavy/25 bg-navy-deep/85 backdrop-blur-md px-2.5 py-1 text-[0.65rem] font-mono text-onnavy shadow-md transition-all ${className}`}
      title={`File: ${meta.fileName} | Size: ${meta.fileSizeFormatted}`}
    >
      <ImageIcon className="h-3 w-3 text-accent shrink-0" />
      <span className="font-sans font-semibold text-onnavy truncate max-w-[140px]">
        {meta.fileName}
      </span>
      <span className="text-onnavy/30">|</span>
      <span className="text-accent font-bold shrink-0">{meta.fileSizeFormatted}</span>
    </div>
  );
}
