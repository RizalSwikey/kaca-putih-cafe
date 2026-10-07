"use client";

import Image from "next/image";
import {
  MapPin,
  MessageCircle,
  Clock,
  Compass,
  Coffee,
  Heart,
  ExternalLink,
  Croissant,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";
import { DEFAULT_STORE_SETTINGS } from "@/data/menu";

export function CafeStory() {
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Jl. Hamid Rusdi Tim. No.350, Bunulrejo, Blimbing, Malang"
  )}`;

  const waUrl = `https://wa.me/${DEFAULT_STORE_SETTINGS.whatsapp_number.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    "Hello Kaca Putih Cafe & Kitchen, I would like to inquire about visiting and reservations."
  )}`;

  const scrollToMenu = () => {
    const el = document.getElementById("menu-catalog");
    if (el) {
      const topOffset = el.offsetTop - 80;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      {/* 1. THE BUNULREJO STORY */}
      <section
        id="tentang-kaca-putih"
        className="relative w-full py-20 sm:py-28 bg-[#FAF8F5] border-b border-stone-200/60 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative (7 Cols): Editorial storytelling */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-200/80 border border-stone-200/60 text-forest text-[11px] font-bold uppercase tracking-widest shadow-2xs">
                <Compass className="w-3.5 h-3.5" />
                <span>The Bunulrejo Story</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso tracking-tight leading-[1.15]">
                A Neighborhood Sanctuary{" "}
                <span className="italic font-normal text-forest block sm:inline font-serif">
                  Tucked in the Quiet Alleys.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-espresso-muted leading-relaxed font-normal">
                Kaca Putih was born from a simple desire for warmth in Malang — a place where freshly ground specialty coffee meets the aroma of artisanal bread straight from the oven.
              </p>

              <div className="space-y-4 text-sm text-espresso-muted leading-relaxed font-normal pt-2">
                <p>
                  Located in the serene residential neighborhood of Bunulrejo, Blimbing, we deliberately settled away from the traffic and haste of main thoroughfares. Here, every pour is crafted with intention — from layered signature cups like the Mont Blanc to comforting traditional Indonesian brews.
                </p>
                <p>
                  To us, Kaca Putih is more than a cafe for brief transactions; it is an extension of your own living room. A welcoming corner to unhurriedly read, gather with companions, or enjoy a comforting plate of Nasi Goreng Rendang.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-stone-200/60 text-xs">
                <div>
                  <span className="font-serif text-2xl font-bold text-forest block">
                    100%
                  </span>
                  <span className="text-espresso-subtle mt-0.5 block">
                    Curated Coffee Beans
                  </span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-forest block">
                    2x
                  </span>
                  <span className="text-espresso-subtle mt-0.5 block">
                    Daily Baking Batches
                  </span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-forest block">
                    Bunulrejo
                  </span>
                  <span className="text-espresso-subtle mt-0.5 block">
                    Malang, East Java
                  </span>
                </div>
              </div>
            </div>

            {/* Right Visual Collage (5 Cols): Layered authentic photography */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-stone-200/60 shadow-floating bg-cream-200">
                <Image
                  src="/images/menu/sq_nasi_lodeh_telor_kribo.png"
                  alt="Nasi Lodeh Telor Kribo Kaca Putih"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-contain p-6 transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-300 block mb-1">
                    Authentic Comfort Food
                  </span>
                  <p className="font-serif text-xl font-bold leading-tight">
                    Nasi Lodeh Telor Kribo
                  </p>
                  <p className="text-xs text-cream-200/90 mt-1 line-clamp-1">
                    Savory East Javanese coconut vegetable stew with crispy golden egg.
                  </p>
                </div>
              </div>

              {/* Floating Coffee Stamp */}
              <div className="absolute -top-4 -right-2 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200/60 shadow-card flex items-center gap-3">
                <Coffee className="w-5 h-5 text-forest" />
                <div className="text-left">
                  <span className="font-serif font-bold text-xs text-espresso block">
                    Espresso &amp; Kitchen
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Handcrafted daily
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY VISIT KACA PUTIH — 4 PILLARS VISUAL STORYTELLING */}
      <section
        id="kenapa-kami"
        className="relative w-full py-20 sm:py-28 bg-[#F5F2EA] border-b border-stone-200/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-sans uppercase font-bold tracking-[0.25em] text-forest block mb-2">
              Reasons to Visit Bunulrejo
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso tracking-tight">
              Why Visit In Person?
            </h2>
            <p className="mt-4 text-espresso-muted text-base sm:text-lg leading-relaxed font-normal">
              Some rituals can only be truly experienced when stepping into our quiet cafe door in Malang.
            </p>
          </div>

          {/* 4 Thematic Pillars with visual storytelling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Specialty Coffee */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200/60 shadow-2xs hover:border-forest/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-forest-subtle flex items-center justify-center text-forest mb-5">
                  <Coffee className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-forest block mb-1">
                  1. Handcrafted Pours
                </span>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3 leading-snug">
                  Specialty Coffee
                </h3>
                <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                  From the velvety cream of Mont Blanc to sparkling espresso mocktails like Blossom and Midnight Blush. Calibrated daily by our baristas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-forest font-semibold">
                Signatures &amp; Pour Overs
              </div>
            </div>

            {/* Pillar 2: Daily Fresh Bakery */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200/60 shadow-2xs hover:border-forest/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100/70 flex items-center justify-center text-amber-800 mb-5">
                  <Croissant className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 block mb-1">
                  2. Fresh from the Oven
                </span>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3 leading-snug">
                  Artisan Salt Bread
                </h3>
                <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                  Japanese Shio Pan baked with a butter-crisp base and flaky sea salt. Scheduled across two daily slots so it arrives at your table warm.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-amber-800 font-semibold">
                Twice Daily Batches
              </div>
            </div>

            {/* Pillar 3: Comfort Food */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200/60 shadow-2xs hover:border-forest/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#EFE8DC] flex items-center justify-center text-[#8B5A2B] mb-5">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B5A2B] block mb-1">
                  3. Made from Scratch
                </span>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3 leading-snug">
                  Comfort Dining
                </h3>
                <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                  Hearty meals made with care: spiced Nasi Goreng Rendang, savory Mie Godok broth, and crispy Telor Kribo evoking the nostalgia of home.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-[#8B5A2B] font-semibold">
                Hearty Main Dishes
              </div>
            </div>

            {/* Pillar 4: Cozy Hidden Spot */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200/60 shadow-2xs hover:border-forest/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-forest-subtle flex items-center justify-center text-forest mb-5">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-forest block mb-1">
                  4. Unrushed Peace
                </span>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3 leading-snug">
                  Alleyway Sanctuary
                </h3>
                <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                  A tranquil retreat nestled in Bunulrejo. Ideal for focused work, quiet conversations with friends, or simply resting in Malang&apos;s cool breeze.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-forest font-semibold">
                Calm Neighborhood Setting
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PHYSICAL VISIT INVITATION — VISIT US */}
      <section
        id="lokasi-kunjungan"
        className="relative w-full py-20 sm:py-28 bg-forest text-cream-50 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#F7F5F0_1px,transparent_1px)] [background-size:20px_20px]"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-sans uppercase font-bold tracking-[0.25em] text-amber-300 block mb-2">
                  Visit Us
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                  Find Your Quiet Corner at Kaca Putih.
                </h2>
                <p className="text-cream-200/90 text-sm sm:text-base mt-4 leading-relaxed font-normal max-w-2xl">
                  Our doors in Bunulrejo are always open. Experience the rich aroma of freshly pulled espresso, greet warm pillow rolls right out of the oven, and take an unhurried pause.
                </p>
              </div>

              {/* Exact Verified Address & Opening Hours Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-2xl bg-forest-dark/85 border border-forest-light/30 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cream-50 block uppercase text-[10px] tracking-wider">
                      Location
                    </span>
                    <span className="text-cream-200 leading-snug mt-1 block">
                      Jl. Hamid Rusdi Tim. No.350, Bunulrejo, Blimbing, Malang
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-forest-dark/85 border border-forest-light/30 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cream-50 block uppercase text-[10px] tracking-wider">
                      Operating Hours
                    </span>
                    <span className="text-cream-200 leading-snug mt-1 block">
                      Regular: 09:00 – 22:00 WIB
                      <br />
                      Ramadan: 12:00 – 23:00 WIB
                    </span>
                  </div>
                </div>
              </div>

              {/* Three Refined Conversion Actions */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3">
                <a
                  href={gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-cream-100 hover:bg-white text-forest font-bold text-xs tracking-wider uppercase shadow-sm hover:-translate-y-0.5 transition-all active:scale-98 inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase shadow-sm hover:-translate-y-0.5 transition-all active:scale-98 inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={scrollToMenu}
                  className="px-5 py-3.5 rounded-full bg-forest-dark/70 hover:bg-forest-dark border border-forest-light/40 text-cream-100 font-bold text-xs tracking-wider uppercase hover:-translate-y-0.5 transition-all active:scale-98 inline-flex items-center gap-1.5"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Visual Image (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-forest-light/40 shadow-floating bg-forest-dark">
                <Image
                  src="/images/menu/sq_nasi_goreng_rendang.png"
                  alt="Comfort Food & Fresh Coffee Kaca Putih"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain p-6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-xs text-cream-50">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                    Warm Meals &amp; Fresh Coffee
                  </span>
                  <p className="font-serif text-lg font-bold mt-0.5">
                    Nasi Goreng Rendang &amp; Kaca Putih Brews
                  </p>
                  <p className="text-cream-200/80 text-[11px] mt-0.5">
                    Enjoy in-house or take home to savor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
