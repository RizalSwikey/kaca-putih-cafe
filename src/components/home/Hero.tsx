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
  const [scheduleDesc, setScheduleDesc] = useState<string>("09:00 – 22:00 WIB (Regular)");
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
      setScheduleDesc(status.schedule);
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

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5] text-espresso pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-cream-border">
      {/* Subtle warm architectural texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1F4A34_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#E8E3D5]/50 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-[#DCE5DF]/40 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Storytelling Headline, Badges & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cream-200/70 border border-cream-border text-forest text-xs font-semibold mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-forest" />
              <span className="font-serif tracking-wider uppercase text-[11px] font-bold">
                Kaca Putih Cafe & Kitchen • Bunulrejo, Malang
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-espresso tracking-tight leading-[1.15]">
              Terselip di Sudut Bunulrejo,{" "}
              <span className="italic font-normal text-forest block sm:inline">
                Hangat di Setiap Seduhan.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-5 text-espresso-muted text-base sm:text-lg leading-relaxed max-w-2xl font-sans font-normal">
              Hidden gem cafe &amp; bakery di Malang dengan racikan kopi khas, artisan Salt Bread panggang harian, dan kenyamanan rumah.
            </p>

            {/* Three Brand Badges */}
            <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-cream-border shadow-xs text-xs font-semibold text-espresso">
                <Croissant className="w-4 h-4 text-amber-700" />
                <span>Daily Fresh Bakery</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-cream-border shadow-xs text-xs font-semibold text-espresso">
                <Compass className="w-4 h-4 text-forest" />
                <span>Cozy Hidden Alley</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-cream-border shadow-xs text-xs font-semibold text-espresso">
                <Coffee className="w-4 h-4 text-[#8B5A2B]" />
                <span>Comfort Food &amp; Coffee</span>
              </div>
            </div>

            {/* Primary & Secondary Call to Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  if (onExploreMenu) onExploreMenu();
                  else handleScrollTo("menu-catalog");
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs tracking-wider uppercase shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 group"
              >
                <span>Jelajahi Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onVisitUs) onVisitUs();
                  else handleScrollTo("tentang-kaca-putih");
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-cream-100 border border-forest/30 text-forest font-bold text-xs tracking-wider uppercase shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Kunjungi Kami</span>
              </button>
            </div>

            {/* Secondary Operational Info & Live Status */}
            <div className="mt-8 pt-6 border-t border-cream-border/80 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-espresso-muted">
              {/* Location & Address */}
              <div className="flex items-start gap-2 max-w-sm">
                <MapPin className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Jl. Hamid Rusdi Tim. No.350, Bunulrejo, Blimbing, Malang
                </span>
              </div>

              {/* Hours & Status */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isOpen
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOpen ? "bg-emerald-600 animate-pulse" : "bg-rose-600"
                    }`}
                  />
                  <span>{isOpen ? "Open Now" : "Closed"}</span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-espresso">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{currentTimeWIB}</span>
                  <span className="text-stone-300 font-sans">•</span>
                  <span className="font-sans text-[11px] text-espresso-muted font-normal">{scheduleDesc}</span>
                </div>
              </div>
            </div>

            {/* Ramadan Schedule Alert if Active */}
            {isRamadan && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Jadwal Khusus Ramadan Aktif (12:00 – 23:00 WIB)</span>
              </div>
            )}

            {/* Dine-In vs Takeaway Order Toggle Bar (Secondary Utility) */}
            <div className="mt-5 w-full max-w-md p-1.5 rounded-2xl bg-cream-200/70 border border-cream-border flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setOrderType("dine_in")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
                  orderType === "dine_in"
                    ? "bg-forest text-cream-50 font-bold shadow-xs"
                    : "text-espresso-muted hover:text-espresso"
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Dine In {tableNumber ? `(Meja ${tableNumber})` : ""}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType("takeaway")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
                  orderType === "takeaway"
                    ? "bg-forest text-cream-50 font-bold shadow-xs"
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
                  placeholder="Meja"
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : null;
                    setTableNumber(val);
                  }}
                  className="w-14 px-2 py-1.5 bg-white border border-cream-border rounded-lg text-center text-xs font-bold text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
                  title="Nomor Meja"
                />
              )}
            </div>
          </div>

          {/* Right Column: Layered Editorial Photo Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Main Arch Frame with Signature Beverage Photography */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-floating bg-gradient-to-b from-[#ECE7DB] via-[#E4DDD0] to-[#D8CFC0] flex items-center justify-center p-6">
              <Image
                src="/images/menu/dirty_latte.png"
                alt="Signature Dirty Latte Kaca Putih"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-contain p-10 transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Image Caption */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-amber-300 block mb-1">
                  Signature Specialty
                </span>
                <p className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  Dirty Latte &amp; Mont Blanc
                </p>
                <p className="text-xs text-cream-200/90 mt-1 line-clamp-1">
                  Espresso pekat dituangkan langsung di atas susu dingin kental khas Kaca Putih.
                </p>
              </div>
            </div>

            {/* Overlapping Floating Card 1: Mont Blanc Coffee */}
            <div className="absolute -top-4 -left-4 sm:-left-8 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-cream-border shadow-floating flex items-center gap-3 max-w-[210px] animate-fade-in hidden sm:flex">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-cream-200">
                <Image
                  src="/images/menu/sq_mont_blanc.png"
                  alt="Mont Blanc 30K"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xs text-espresso leading-snug">
                  Mont Blanc
                </span>
                <span className="text-[10px] text-espresso-muted">Velvety Cream</span>
                <span className="font-mono text-xs font-bold text-forest mt-0.5">30K</span>
              </div>
            </div>

            {/* Overlapping Floating Card 2: Korean Wings / Food Badge */}
            <div className="absolute -bottom-6 -right-2 sm:-right-6 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-cream-border shadow-floating items-center gap-3 max-w-[230px] animate-fade-in hidden sm:flex">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-cream-200">
                <Image
                  src="/images/menu/sq_masitta_korean_wings.png"
                  alt="Masitta Korean Wings"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-amber-700 tracking-wider">
                  Chef&apos;s Favorite
                </span>
                <span className="font-serif font-bold text-xs text-espresso leading-snug">
                  Masitta Hot Wings
                </span>
                <span className="font-mono text-xs font-bold text-forest mt-0.5">30K</span>
              </div>
            </div>

            {/* Authentic Brand Crest Stamp Seal */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-2xl bg-white/90 backdrop-blur-md border border-cream-border shadow-md">
              <Logo variant="icon" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
