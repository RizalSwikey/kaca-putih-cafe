import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "horizontal" | "badge";
  size?: "sm" | "md" | "lg" | "xl";
  light?: boolean;
}

export function Logo({
  className = "",
  variant = "horizontal",
  size = "md",
  light = false,
}: LogoProps) {
  // Use the verified transparent brand marks: logo-green.png and logo-white.png
  // The authentic logo artwork already contains the original lettering "Kaca putih" and "CAFE & KITCHEN"
  // within the wreath emblem. Thus, no redundant text is needed beside it!
  const dimensions = {
    sm: { width: 140, height: 153, hClass: "h-11", maxW: "max-w-[150px]" },
    md: { width: 180, height: 196, hClass: "h-14", maxW: "max-w-[190px]" },
    lg: { width: 240, height: 262, hClass: "h-24", maxW: "max-w-[260px]" },
    xl: { width: 320, height: 350, hClass: "h-36", maxW: "max-w-[340px]" },
  }[size];

  const logoSrc = light
    ? "/images/brand/logo-white.png"
    : "/images/brand/logo-green.png";

  // Clean, transparent brand mark with zero grey bounding box or clipping
  const BrandImage = (
    <Image
      src={logoSrc}
      alt="Kaca Putih Cafe & Kitchen"
      width={dimensions.width}
      height={dimensions.height}
      className={`shrink-0 object-contain w-auto ${dimensions.hClass} ${
        light ? "" : "mix-blend-multiply"
      } transition-transform duration-300 hover:scale-[1.02]`}
      priority
    />
  );

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {BrandImage}
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center p-1.5 rounded-full border shadow-2xs transition-all ${
          light
            ? "border-cream-300/30 bg-forest-dark/80 text-cream-50"
            : "border-stone-200/60 bg-cream-card/90 text-forest"
        } ${className}`}
      >
        <Image
          src={logoSrc}
          alt="Kaca Putih"
          width={32}
          height={35}
          className={`w-auto h-7 object-contain ${light ? "" : "mix-blend-multiply"}`}
        />
      </div>
    );
  }

  // Horizontal and full layouts both render the authentic self-contained brand mark
  // without redundant adjacent HTML text
  return (
    <div className={`inline-flex items-center ${className}`}>
      {BrandImage}
    </div>
  );
}
