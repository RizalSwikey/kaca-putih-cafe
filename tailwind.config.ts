import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1F4A34",
          dark: "#153424",
          light: "#2B6346",
          hover: "#26573E",
          subtle: "#EBF1ED",
          border: "#D0DDD5",
        },
        cream: {
          DEFAULT: "#F7F5F0",
          50: "#FCFBF8",
          100: "#F7F5F0",
          200: "#ECE8DD",
          300: "#DDD6C4",
          card: "#FBF9F5",
          border: "#E7E2D5",
          muted: "#8F897B",
        },
        espresso: {
          DEFAULT: "#1E1E1E",
          muted: "#4A4A4A",
          subtle: "#767676",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "Cambria", "serif"],
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 74, 52, 0.08)",
        "glass-sm": "0 4px 16px 0 rgba(31, 74, 52, 0.05)",
        floating: "0 12px 40px -8px rgba(30, 30, 30, 0.15)",
        card: "0 2px 12px -2px rgba(31, 74, 52, 0.06)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.25s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
