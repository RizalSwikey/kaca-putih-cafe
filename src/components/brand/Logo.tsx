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
  // Dimensions for emblem (aspect ratio 713 x 525 -> ~ 1.35 width/height)
  const emblemSizes = {
    sm: { width: 34, height: 25, hClass: "h-7", textClass: "text-lg", subClass: "text-[9px]" },
    md: { width: 44, height: 32, hClass: "h-9", textClass: "text-xl", subClass: "text-[10px]" },
    lg: { width: 72, height: 53, hClass: "h-14", textClass: "text-2xl", subClass: "text-[11px]" },
    xl: { width: 108, height: 80, hClass: "h-20", textClass: "text-3xl", subClass: "text-xs" },
  }[size];

  const emblemSrc = light
    ? "/images/brand/emblem-white.png"
    : "/images/brand/emblem-forest.png";

  const fullLogoSrc = light
    ? "/images/brand/logo-white.png"
    : "/images/brand/logo-forest.png";

  const textColor = light ? "text-cream-50" : "text-espresso";
  const subtextColor = light ? "text-cream-200/80" : "text-stone-500";

  // Emblem mark only (clean wreath + awning house + coffee cup + fork & spoon; NO duplicate text)
  const EmblemOnly = (
    <Image
      src={emblemSrc}
      alt="Kaca Putih Authentic Emblem"
      width={emblemSizes.width}
      height={emblemSizes.height}
      className={`shrink-0 object-contain w-auto ${emblemSizes.hClass} ${
        light ? "" : "mix-blend-multiply"
      } transition-transform duration-300 hover:scale-105`}
      priority
    />
  );

  // Icon only
  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {EmblemOnly}
      </div>
    );
  }

  // Horizontal lockup: Authentic crest on left + Luxury editorial serif typography on right
  // ZERO duplicate text!
  if (variant === "horizontal") {
    return (
      <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
        {EmblemOnly}
        <div className="flex flex-col text-left leading-tight">
          <span
            className={`font-serif tracking-tight font-bold ${emblemSizes.textClass} ${textColor}`}
          >
            Kaca Putih
          </span>
          <span
            className={`font-sans tracking-[0.26em] uppercase font-semibold ${emblemSizes.subClass} ${subtextColor}`}
          >
            Cafe &amp; Kitchen
          </span>
        </div>
      </div>
    );
  }

  // Badge pill
  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-2xs transition-all ${
          light
            ? "border-cream-300/30 bg-forest-dark/80 text-cream-50"
            : "border-stone-200/60 bg-cream-card/90 text-forest"
        } ${className}`}
      >
        <div className="w-5 h-4 flex items-center justify-center">
          <Image
            src={emblemSrc}
            alt="Kaca Putih"
            width={20}
            height={15}
            className={`w-auto h-3.5 object-contain ${light ? "" : "mix-blend-multiply"}`}
          />
        </div>
        <span className="text-xs font-serif font-bold tracking-wide">
          Kaca Putih
        </span>
      </div>
    );
  }

  // Full standalone crest with integrated original lettering
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <Image
        src={fullLogoSrc}
        alt="Kaca Putih Cafe & Kitchen"
        width={140}
        height={153}
        className={`object-contain h-28 w-auto ${light ? "" : "mix-blend-multiply"}`}
        priority
      />
    </div>
  );
}
