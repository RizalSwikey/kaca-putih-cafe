import React from "react";

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
  const strokeColor = light ? "#F7F5F0" : "#1F4A34";
  const accentColor = light ? "#EAE6DD" : "#2B6346";
  const textColor = light ? "#FCFBF8" : "#1E1E1E";
  const subtextColor = light ? "#DDD6C4" : "#4A4A4A";

  const sizeDimensions = {
    sm: { width: 36, height: 36, textClasses: "text-base font-serif" },
    md: { width: 52, height: 52, textClasses: "text-xl font-serif" },
    lg: { width: 80, height: 80, textClasses: "text-2xl font-serif" },
    xl: { width: 120, height: 120, textClasses: "text-4xl font-serif" },
  }[size];

  // SVG Emblem Mark: Arch wreath + Colonial house facade + Coffee cup with crossed fork & spoon
  const EmblemSvg = (
    <svg
      width={sizeDimensions.width}
      height={sizeDimensions.height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
    >
      {/* Outer arched decorative botanical wreath */}
      <path
        d="M20 72 C12 55, 15 28, 50 16 C85 28, 88 55, 80 72"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Botanical leaves details */}
      <path
        d="M24 64 C20 60, 18 53, 22 50 C25 54, 25 58, 24 64 Z"
        fill={accentColor}
        opacity="0.8"
      />
      <path
        d="M20 48 C16 43, 16 36, 21 34 C23 38, 23 43, 20 48 Z"
        fill={accentColor}
        opacity="0.8"
      />
      <path
        d="M28 32 C26 26, 29 20, 35 20 C35 25, 32 29, 28 32 Z"
        fill={accentColor}
        opacity="0.8"
      />
      <path
        d="M76 64 C80 60, 82 53, 78 50 C75 54, 75 58, 76 64 Z"
        fill={accentColor}
        opacity="0.8"
      />
      <path
        d="M80 48 C84 43, 84 36, 79 34 C77 38, 77 43, 80 48 Z"
        fill={accentColor}
        opacity="0.8"
      />
      <path
        d="M72 32 C74 26, 71 20, 65 20 C65 25, 68 29, 72 32 Z"
        fill={accentColor}
        opacity="0.8"
      />

      {/* Colonial Awning House Pediment / Canopy Facade */}
      <path
        d="M32 38 L50 24 L68 38 Z"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Awning stripes */}
      <path
        d="M30 40 L70 40 L68 45 L32 45 Z"
        stroke={strokeColor}
        strokeWidth="1.8"
        fill={light ? "rgba(255,255,255,0.1)" : "rgba(31,74,52,0.06)"}
      />
      <line x1="38" y1="40" x2="38" y2="45" stroke={strokeColor} strokeWidth="1.2" />
      <line x1="46" y1="40" x2="46" y2="45" stroke={strokeColor} strokeWidth="1.2" />
      <line x1="54" y1="40" x2="54" y2="45" stroke={strokeColor} strokeWidth="1.2" />
      <line x1="62" y1="40" x2="62" y2="45" stroke={strokeColor} strokeWidth="1.2" />

      {/* Centered Coffee Cup */}
      <path
        d="M40 54 C40 64, 60 64, 60 54 L60 50 L40 50 Z"
        stroke={strokeColor}
        strokeWidth="2"
        fill={light ? "#1F4A34" : "#F7F5F0"}
      />
      {/* Cup handle */}
      <path
        d="M60 52 C64 52, 65 58, 60 58"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Cup saucer */}
      <path
        d="M36 65 C43 67, 57 67, 64 65"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Steam curves */}
      <path
        d="M47 47 C46 44, 48 42, 47 39"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M53 47 C54 44, 52 42, 53 39"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Crossed Fork & Spoon behind/below cup */}
      {/* Spoon (diagonal left to right) */}
      <ellipse
        cx="34"
        cy="71"
        rx="2.5"
        ry="3.5"
        transform="rotate(-35 34 71)"
        stroke={strokeColor}
        strokeWidth="1.4"
      />
      <line
        x1="36"
        y1="73"
        x2="63"
        y2="83"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Fork (diagonal right to left) */}
      <path
        d="M64 70 L62 73 M66 69 L64 72 M68 68 L66 71"
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="64"
        y1="72"
        x2="37"
        y2="83"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Bottom Ribbon Line */}
      <path
        d="M26 82 C38 86, 62 86, 74 82"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "icon") {
    return <div className={`inline-flex items-center ${className}`}>{EmblemSvg}</div>;
  }

  if (variant === "horizontal") {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {EmblemSvg}
        <div className="flex flex-col text-left">
          <span
            className="font-serif tracking-tight leading-tight text-xl font-bold"
            style={{ color: textColor }}
          >
            Kaca Putih
          </span>
          <span
            className="text-[10px] tracking-[0.24em] font-sans uppercase font-medium"
            style={{ color: subtextColor }}
          >
            Cafe & Kitchen
          </span>
        </div>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-forest/20 bg-cream-card/90 shadow-sm ${className}`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {React.cloneElement(EmblemSvg, { width: 20, height: 20 })}
        </div>
        <span className="text-xs font-serif font-bold text-forest tracking-wide">
          Kaca Putih
        </span>
      </div>
    );
  }

  // Full vertical/hero layout
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {EmblemSvg}
      <div className="mt-2 flex flex-col items-center">
        <h1
          className={`${sizeDimensions.textClasses} font-serif tracking-tight font-bold`}
          style={{ color: textColor }}
        >
          Kaca Putih
        </h1>
        <p
          className="text-[11px] tracking-[0.3em] font-sans uppercase font-semibold mt-0.5"
          style={{ color: subtextColor }}
        >
          Cafe & Kitchen • Malang
        </p>
      </div>
    </div>
  );
}
