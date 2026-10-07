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
  variant = "full",
  size = "md",
  light = false,
}: LogoProps) {
  // Dimensions for authentic logo aspect ratio (713 x 781 -> ~ 0.913 width/height)
  const sizeMap = {
    sm: { width: 36, height: 39, hClass: "h-9", textClass: "text-base" },
    md: { width: 56, height: 61, hClass: "h-14", textClass: "text-lg" },
    lg: { width: 96, height: 105, hClass: "h-24", textClass: "text-2xl" },
    xl: { width: 140, height: 153, hClass: "h-36", textClass: "text-3xl" },
  }[size];

  const logoSrc = light ? "/images/brand/logo-white.png" : "/images/brand/logo-forest.png";
  const textColor = light ? "text-cream-50" : "text-espresso";
  const subtextColor = light ? "text-cream-200/80" : "text-espresso-muted";

  // Authentic Brand Graphic Image
  const AuthenticImage = (
    <Image
      src={logoSrc}
      alt="Kaca Putih Cafe & Kitchen Authentic Emblem"
      width={sizeMap.width}
      height={sizeMap.height}
      className={`shrink-0 object-contain drop-shadow-xs transition-transform duration-300 hover:scale-102 ${sizeMap.hClass} w-auto`}
      priority
    />
  );

  if (variant === "icon") {
    return <div className={`inline-flex items-center justify-center ${className}`}>{AuthenticImage}</div>;
  }

  if (variant === "horizontal") {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {AuthenticImage}
        <div className="flex flex-col text-left">
          <span className={`font-serif tracking-tight leading-tight font-bold ${sizeMap.textClass} ${textColor}`}>
            Kaca Putih
          </span>
          <span className={`text-[10px] tracking-[0.24em] font-sans uppercase font-medium ${subtextColor}`}>
            Cafe & Kitchen
          </span>
        </div>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-all ${
          light
            ? "border-cream-300/30 bg-forest-dark/80 text-cream-50"
            : "border-forest/20 bg-cream-card/90 text-forest"
        } ${className}`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <Image
            src={logoSrc}
            alt="Kaca Putih"
            width={20}
            height={22}
            className="w-5 h-auto object-contain"
          />
        </div>
        <span className="text-xs font-serif font-bold tracking-wide">
          Kaca Putih
        </span>
      </div>
    );
  }

  // Full authentic crest (Used in hero and main brand showcase)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {AuthenticImage}
    </div>
  );
}
