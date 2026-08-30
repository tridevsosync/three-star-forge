/**
 * Image metadata resolver & static asset size registry for Three Star Forge
 */

export interface ImageMeta {
  fileName: string;
  fileSize: number; // in bytes
  fileSizeFormatted: string; // e.g. "245.8 KB", "1.2 MB"
  format: string; // e.g. "JPG", "PNG", "WEBP"
}

// Precomputed static size registry for all assets in src/assets and PDF extractions
export const STATIC_ASSET_SIZES: Record<string, number> = {
  // Main assets
  "about-design.jpg": 137432,
  "capabilities-metrology.jpg": 121136,
  "cta-workshop.jpg": 70856,
  "gallery-inspection-bench.jpg": 178004,
  "hero-industrial.jpg": 260933,
  "ind-automation.jpg": 166549,
  "ind-engineering-equipment.jpg": 212391,
  "ind-food.jpg": 125749,
  "ind-line-automation.jpg": 259982,
  "ind-material-handling.jpg": 277166,
  "ind-pharma.jpg": 175991,
  "ind-process.jpg": 233334,
  "npi-blueprints.jpg": 222488,
  "page-about-workshop.jpg": 242669,
  "page-capabilities-induction.jpg": 156690,
  "page-contact-facility.jpg": 210127,
  "page-projects-line.jpg": 257877,
  "page-services-design.jpg": 154051,

  // PDF catalog extracts
  "img_p10_1.jpg": 85504,
  "img_p10_2.jpg": 72195,
  "img_p11_1.jpg": 144685,
  "img_p11_2.jpg": 142904,
  "img_p12_1.jpg": 171540,
  "img_p12_2.jpg": 84146,
  "img_p13_1.jpg": 93382,
  "img_p13_2.jpg": 94873,
  "img_p1_1.jpg": 175505,
  "img_p3_1.jpg": 90960,
  "img_p3_2.jpg": 27429,
  "img_p3_3.jpg": 27459,
  "img_p4_1.jpg": 108769,
  "img_p4_2.jpg": 40233,
  "img_p4_3.jpg": 50332,
  "img_p5_1.jpg": 113385,
  "img_p5_2.jpg": 90060,
  "img_p5_3.jpg": 65264,
  "img_p6_1.jpg": 123961,
  "img_p6_2.jpg": 93114,
  "img_p7_1.jpg": 133997,
  "img_p7_2.jpg": 27145,
  "img_p7_3.jpg": 36029,
  "img_p8_1.jpg": 76216,
  "img_p8_2.jpg": 83651,
  "img_p9_1.jpg": 34052,
  "img_p9_2.jpg": 51438,
  "img_p9_3.jpg": 39778,
  "img_p9_4.jpg": 37179,
};

/**
 * Format bytes into readable string (e.g. 245.8 KB, 1.2 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return "0 KB";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i === 0) return `${bytes} B`;
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Extract clean filename from a URL, path, or asset identifier
 */
export function extractFileName(src: string): string {
  if (!src) return "unnamed-image.jpg";

  // Base64 data URL
  if (src.startsWith("data:image/")) {
    const ext = src.substring(11, src.indexOf(";")) || "jpeg";
    return `uploaded-image.${ext === "jpeg" ? "jpg" : ext}`;
  }

  try {
    // Remove query params and hash
    const cleanUrl = src.split("?")[0].split("#")[0];
    const rawName = cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);

    if (!rawName) return "equipment-photo.jpg";

    // Clean Next.js hashed assets (e.g. hero-industrial.5f38a1.jpg -> hero-industrial.jpg)
    const hashPatternMatch = rawName.match(/^(.+?)\.[a-f0-9]{8,}\.(jpg|jpeg|png|webp|svg)$/i);
    if (hashPatternMatch) {
      return `${hashPatternMatch[1]}.${hashPatternMatch[2]}`;
    }

    return decodeURIComponent(rawName);
  } catch {
    return "equipment-photo.jpg";
  }
}

/**
 * Resolve comprehensive metadata for any image src string
 */
export function getImageMeta(
  src: string | undefined | null,
  overrides?: { fileName?: string; fileSize?: number },
): ImageMeta {
  if (!src) {
    return {
      fileName: overrides?.fileName || "placeholder.jpg",
      fileSize: overrides?.fileSize || 0,
      fileSizeFormatted: formatBytes(overrides?.fileSize || 0),
      format: "JPG",
    };
  }

  const rawFileName = overrides?.fileName || extractFileName(src);
  let ext = "JPG";
  const extMatch = rawFileName.match(/\.([a-zA-Z0-9]+)$/);
  if (extMatch) {
    ext = extMatch[1].toUpperCase();
    if (ext === "JPEG") ext = "JPG";
  }

  let sizeInBytes = overrides?.fileSize || 0;

  // 1. Check if size was passed in overrides
  if (!sizeInBytes) {
    // 2. Check static asset registry
    const baseName = rawFileName.toLowerCase();
    for (const [key, bytes] of Object.entries(STATIC_ASSET_SIZES)) {
      if (baseName.includes(key.toLowerCase()) || src.toLowerCase().includes(key.toLowerCase())) {
        sizeInBytes = bytes;
        break;
      }
    }
  }

  // 3. Base64 calculation
  if (!sizeInBytes && src.startsWith("data:image/")) {
    const stringLength = src.length - src.indexOf(",") - 1;
    sizeInBytes = Math.round(stringLength * (3 / 4));
  }

  // 4. Default fallback estimate if completely unknown (e.g. 180 KB default for high-res web photo)
  if (!sizeInBytes) {
    sizeInBytes = 185000;
  }

  return {
    fileName: rawFileName,
    fileSize: sizeInBytes,
    fileSizeFormatted: formatBytes(sizeInBytes),
    format: ext,
  };
}

/**
 * Extract metadata directly from a browser File object during upload
 */
export function getFileMeta(file: File): ImageMeta {
  let ext = file.name.split(".").pop()?.toUpperCase() || "JPG";
  if (ext === "JPEG") ext = "JPG";

  return {
    fileName: file.name,
    fileSize: file.size,
    fileSizeFormatted: formatBytes(file.size),
    format: ext,
  };
}
