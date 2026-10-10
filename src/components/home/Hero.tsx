"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Clock,
  MapPin,
  Sparkles,
  Utensils,
  ShoppingBag,
  ArrowRight,
  Coffee,
  Croissant,
  Compass,
} from "lucide-react";
import { StoreSettings } from "@/types";
import { DEFAULT_STORE_SETTINGS } from "@/data/menu";
import { checkStoreStatus, getWIBTimeStrings } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { Logo } from "@/components/brand/Logo";

interface HeroProps {
  settings?: StoreSettings;
  onExploreMenu?: () => void;
  onVisitUs?: () => void;
}

export function Hero({
  settings = DEFAULT_STORE_SETTINGS,
  onExploreMenu,
  onVisitUs,
}: HeroProps) {
  const [currentTimeWIB, setCurrentTimeWIB] = useState<string>("09:00:00 WIB");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isRamadan, setIsRamadan] = useState<boolean>(false);

  const orderType = useCartStore((s) => s.orderType);
  const setOrderType = useCartStore((s) => s.setOrderType);
  const tableNumber = useCartStore((s) => s.tableNumber);
  const setTableNumber = useCartStore((s) => s.setTableNumber);

  useEffect(() => {
    function updateClock() {
      const { timeStr } = getWIBTimeStrings();
      const status = checkStoreStatus(settings);
      setCurrentTimeWIB(`${timeStr} WIB`);
      setIsOpen(status.isOpen);
      setIsRamadan(status.isRamadan);
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [settings]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.offsetTop - 90;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const hoursLabel = isRamadan
    ? "Open Today • 12:00 – 23:00 WIB"
    : "Open Today • 09:00 – 22:00 WIB";

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5] text-espresso pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-stone-200/60">
      {/* Delicate warm ambient gradient washes */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#1F4A34_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#E8E2D2]/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-[#DCE5DF]/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Storytelling Headline, Refined Badges & Minimalist English Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Eyebrow Chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-200/70 border border-stone-200/60 text-forest text-xs font-semibold mb-6 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
              <span className="font-serif tracking-widest uppercase text-[11px] font-bold">
                Kaca Putih Cafe &amp; Kitchen • Bunulrejo, Malang
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4.25rem] font-bold text-espresso tracking-tight leading-[1.12]">
              Quiet Corners,{" "}
              <span className="italic font-normal text-forest block sm:inline font-serif">
                Honest Brews.
              </span>
            </h1>

            {/* Subheadline in refined typography */}
            <p className="mt-5 text-espresso-muted text-base sm:text-lg leading-relaxed max-w-2xl font-sans font-normal">
              An artisanal cafe &amp; hidden bakery tucked away in the serene alleys of Bunulrejo, Malang. Handcrafted espresso, daily fresh Japanese Salt Bread, and comforting heritage recipes.
            </p>

            {/* Three Refined Hero Feature Tags */}
            <div className="mt-7 flex flex-wrap gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 border border-stone-200/60 shadow-2xs text-xs font-semibold text-espresso hover:border-forest/30 transition-colors">
                <Croissant className="w-4 h-4 text-amber-700" />
                <span>Fresh Daily Shio Pan</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 border border-stone-200/60 shadow-2xs text-xs font-semibold text-espresso hover:border-forest/30 transition-colors">
                <Coffee className="w-4 h-4 text-[#8B5A2B]" />
                <span>Artisanal Roasts</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 border border-stone-200/60 shadow-2xs text-xs font-semibold text-espresso hover:border-forest/30 transition-colors">
                <Compass className="w-4 h-4 text-forest" />
                <span>Alleyway Sanctuary</span>
              </div>
            </div>

            {/* Primary & Secondary Minimalist Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  if (onExploreMenu) onExploreMenu();
                  else handleScrollTo("menu-catalog");
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs tracking-wider uppercase shadow-sm hover:-translate-y-0.5 transition-all active:scale-98 flex items-center justify-center gap-2 group"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onVisitUs) onVisitUs();
                  else handleScrollTo("tentang-kaca-putih");
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-cream-100 border border-stone-200/80 text-espresso font-bold text-xs tracking-wider uppercase shadow-2xs hover:-translate-y-0.5 transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Find Our Cafe</span>
              </button>
            </div>

            {/* Operational Status & Verified Address Bar */}
            <div className="mt-9 pt-6 border-t border-stone-200/60 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-espresso-muted">
              {/* Address */}
              <div className="flex items-start gap-2 max-w-sm">
                <MapPin className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <span className="leading-snug font-medium text-stone-600">
                  Jl. Hamid Rusdi Tim. No.350, Bunulrejo, Blimbing, Malang
                </span>
              </div>

              {/* Status & Dynamic Hours */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isOpen
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOpen ? "bg-emerald-600 animate-pulse" : "bg-rose-600"
                    }`}
                  />
                  <span>{isOpen ? "Open Now" : "Closed"}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-medium">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{hoursLabel}</span>
                  <span className="text-stone-300">•</span>
                  <span className="font-mono text-stone-500">{currentTimeWIB}</span>
                </div>
              </div>
            </div>

            {/* Ramadan Schedule Alert if Active */}
            {isRamadan && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Special Ramadan Schedule Active (12:00 – 23:00 WIB)</span>
              </div>
            )}

            {/* Dine-In vs Takeaway Order Toggle Bar (Discreet Utility) */}
            <div className="mt-5 w-full max-w-md p-1.5 rounded-full bg-cream-200/60 border border-stone-200/60 flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setOrderType("dine_in")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full transition-all ${
                  orderType === "dine_in"
                    ? "bg-forest text-cream-50 font-bold shadow-2xs"
                    : "text-espresso-muted hover:text-espresso"
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Dine In {tableNumber ? `(Table ${tableNumber})` : ""}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType("takeaway")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full transition-all ${
                  orderType === "takeaway"
                    ? "bg-forest text-cream-50 font-bold shadow-2xs"
                    : "text-espresso-muted hover:text-espresso"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Takeaway Pickup</span>
              </button>

              {orderType === "dine_in" && !tableNumber && (
                <input
                  type="number"
                  min="1"
                  max="99"
                  placeholder="Table"
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : null;
                    setTableNumber(val);
                  }}
                  className="w-14 px-2 py-1.5 bg-white border border-stone-200/60 rounded-full text-center text-xs font-bold text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
                  title="Table number"
                />
              )}
            </div>
          </div>

          {/* Right Column: Luxury Editorial Magazine Collage (Arch Frame + Soft Ambient Shadows + Floating Tags) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background Decorative Soft Arch Frame */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-t-full rounded-b-3xl overflow-hidden border-2 border-stone-200/60 bg-gradient-to-b from-[#F3EFE6] via-[#EFE9DC] to-[#E5DECF] shadow-2xl shadow-stone-300/40 flex flex-col justify-between p-6 group">
              {/* Top Subtitle inside arch */}
              <div className="w-full text-center pt-8 z-10">
                <span className="font-serif italic text-xs tracking-widest text-amber-900/80 uppercase">
                  Artisanal House Special
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso mt-1">
                  Dirty Latte &amp; Mont Blanc
                </h3>
              </div>

              {/* Center Signature Glass Photo */}
              <div className="relative w-full flex-1 flex items-center justify-center my-2">
                <Image
                  src="/images/menu/dirty_latte.png"
                  alt="Signature Pour • Mont Blanc / Dirty Latte"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Bottom Delicate Floating Tag */}
              <div className="w-full text-center pb-2 z-10">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/60 shadow-sm text-xs font-medium text-stone-700">
                  <span className="font-serif italic">Signature Pour</span> • Mont Blanc / Dirty Latte
                </div>
              </div>
            </div>

            {/* Overlapping Floating Ingredient Tag 1: Mont Blanc Velvety Cream */}
            <div className="absolute -top-3 -left-3 sm:-left-6 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200/60 shadow-floating flex items-center gap-3 max-w-[210px] animate-fade-in hidden sm:flex">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-cream-200">
                <Image
                  src="/images/menu/sq_mont_blanc.png"
                  alt="Mont Blanc 30K"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xs text-espresso leading-snug">
                  Mont Blanc
                </span>
                <span className="text-[10px] text-stone-500">Velvety Cream Crown</span>
                <span className="font-mono text-xs font-bold text-forest mt-0.5">30K</span>
              </div>
            </div>

            {/* Overlapping Floating Ingredient Tag 2: Japanese Salt Bread Callout */}
            <div className="absolute -bottom-4 -right-3 sm:-right-6 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200/60 shadow-floating flex items-center gap-3 max-w-[210px] animate-fade-in hidden sm:flex">
              <div className="relative w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
                <Croissant className="w-5 h-5 text-amber-700" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xs text-espresso leading-snug">
                  Artisan Shio Pan
                </span>
                <span className="text-[10px] text-stone-500">Baked Fresh Daily</span>
                <span className="font-mono text-xs font-bold text-amber-800 mt-0.5">From 18K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
