"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Coffee,
  Croissant,
  Compass,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { StoreSettings } from "@/types";
import { DEFAULT_STORE_SETTINGS } from "@/data/menu";
import { checkStoreStatus, getWIBTimeStrings } from "@/lib/utils";

interface HeroProps {
  settings?: StoreSettings;
  onExploreMenu?: () => void;
  onVisitUs?: () => void;
}

const SIGNATURE_SLIDES = [
  {
    id: "dirty-latte",
    index: "01",
    name: "Dirty Latte",
    subtitle: "Rich espresso over chilled velvety milk",
    image: "/images/menu/dirty_latte.png",
    price: "32K",
  },
  {
    id: "mont-blanc",
    index: "02",
    name: "Mont Blanc",
    subtitle: "Signature cold brew with sweet cream crown",
    image: "/images/menu/mont_blanc.png",
    price: "30K",
  },
  {
    id: "butterscotch",
    index: "03",
    name: "Butterscotch",
    subtitle: "Caramelized brown butter espresso symphony",
    image: "/images/menu/butterscotch.png",
    price: "25K",
  },
];

export function Hero({
  settings = DEFAULT_STORE_SETTINGS,
  onExploreMenu,
  onVisitUs,
}: HeroProps) {
  const [currentTimeWIB, setCurrentTimeWIB] = useState<string>("09:00:00 WIB");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isRamadan, setIsRamadan] = useState<boolean>(false);
  const [activeSlide, setActiveSlide] = useState<number>(0);

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

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SIGNATURE_SLIDES.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.offsetTop - 90;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? SIGNATURE_SLIDES.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SIGNATURE_SLIDES.length);
  };

  const hoursLabel = isRamadan
    ? "Open Today • 12:00 – 23:00 WIB"
    : "Open Today • 09:00 – 22:00 WIB";

  const currentItem = SIGNATURE_SLIDES[activeSlide] ?? SIGNATURE_SLIDES[0]!;

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5] text-espresso pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-stone-200/60">
      {/* Delicate warm ambient gradient washes */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#1F4A34_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#E8E2D2]/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-[#DCE5DF]/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Storytelling Headline & Editorial Copy */}
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

            {/* Primary & Secondary Actions */}
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

            {/* Operational Status, Location & Hours (Centered Vertical Stack) */}
            <div className="mt-8 pt-6 border-t border-stone-200/60 w-full">
              <div className="flex flex-col items-center justify-center gap-1.5 text-center my-4">
                {/* 1. Top: Operational Status */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide rounded-full ${
                    isOpen
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                      : "bg-rose-50 text-rose-800 border border-rose-200/60"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOpen ? "bg-emerald-600 animate-pulse" : "bg-rose-600"
                    }`}
                  />
                  <span>{isOpen ? "OPEN NOW" : "CLOSED"}</span>
                </div>

                {/* 2. Middle: Address & Location */}
                <div className="flex items-center justify-center gap-1 text-xs md:text-sm text-stone-700 font-sans tracking-tight">
                  <span>📍</span>
                  <span>Jl. Hamid Rusdi Tim. No.350, Bunulrejo, Blimbing, Malang</span>
                </div>

                {/* 3. Bottom: Operating Hours */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 font-sans">
                  <span>🕒</span>
                  <span>{hoursLabel}</span>
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
          </div>

          {/* Right Column: Clean Editorial Arched Frame with Auto-Cycling Crossfade Slideshow */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Arched Frame Showcase */}
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[4/5] rounded-t-full rounded-b-3xl overflow-hidden border-2 border-stone-200/60 bg-gradient-to-b from-[#F3EFE6] via-[#EFE9DC] to-[#E5DECF] shadow-2xl shadow-stone-300/40 flex flex-col justify-between p-6">
              {/* Top Subtitle inside arch */}
              <div className="w-full text-center pt-8 z-10">
                <span className="font-serif italic text-xs tracking-widest text-amber-900/80 uppercase">
                  Artisanal House Special
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso mt-1">
                  Signature Collection
                </h3>
              </div>

              {/* Center Signature Drink Crossfade Container */}
              <div className="relative w-full flex-1 flex items-center justify-center my-2 overflow-hidden">
                {SIGNATURE_SLIDES.map((slide, idx) => {
                  const isCurrent = idx === activeSlide;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out p-4 ${
                        isCurrent
                          ? "opacity-100 scale-100 z-10 pointer-events-auto"
                          : "opacity-0 scale-95 z-0 pointer-events-none"
                      }`}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.name}
                        fill
                        priority={idx === 0}
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-contain p-2"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Bottom Subtle Pill Badge */}
              <div className="w-full text-center pb-2 z-10">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/60 shadow-xs text-xs font-medium text-stone-700">
                  <span className="font-serif italic">Signature Pour</span> • Handcrafted Espresso
                </div>
              </div>
            </div>

            {/* Clean, Understated Caption & Controls Below the Arch */}
            <div className="w-full max-w-[360px] sm:max-w-[400px] mt-4 flex items-center justify-between px-2 text-espresso">
              {/* Active Item Title & Subtitle */}
              <div className="text-left">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-semibold text-forest">
                    {currentItem.index}
                  </span>
                  <span className="font-serif font-bold text-base text-espresso">
                    {currentItem.name}
                  </span>
                  <span className="font-mono text-xs font-bold text-forest">
                    {currentItem.price}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {currentItem.subtitle}
                </p>
              </div>

              {/* Slide Navigation: Arrow controls & Dots */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="p-1.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-forest hover:border-forest/40 transition-colors shadow-2xs"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1 px-1">
                  {SIGNATURE_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveSlide(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeSlide
                          ? "w-4 bg-forest"
                          : "w-1.5 bg-stone-300 hover:bg-stone-400"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="p-1.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-forest hover:border-forest/40 transition-colors shadow-2xs"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
