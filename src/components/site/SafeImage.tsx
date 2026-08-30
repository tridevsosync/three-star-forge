"use client";

import { useState, useEffect } from "react";
import { getSafeImage } from "@/data/images";

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: "induction" | "cnc" | "conveyor" | "metrology" | "workshop" | "spm" | "general";
}

export function SafeImage({
  src,
  alt = "Industrial Machinery & Engineering",
  className = "",
  fallbackType = "general",
  ...props
}: SafeImageProps) {
  const strSrc = typeof src === "string" ? src : undefined;
  const safeInitial = getSafeImage(strSrc, fallbackType);
  const [imgSrc, setImgSrc] = useState<string>(safeInitial);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const nextSafe = getSafeImage(typeof src === "string" ? src : undefined, fallbackType);
    setImgSrc(nextSafe);
    setHasError(false);
  }, [src, fallbackType]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getSafeImage(null, fallbackType));
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
}

export default SafeImage;
