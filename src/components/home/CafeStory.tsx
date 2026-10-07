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
    "Halo Kaca Putih Cafe & Kitchen, saya ingin bertanya tentang lokasi dan reservasi tempat."
  )}`;

  return (
    <section id="tentang-kaca-putih" className="relative w-full py-16 sm:py-24 bg-[#FAF8F5] border-b border-cream-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-[11px] font-sans uppercase font-bold tracking-[0.25em] text-forest block mb-2">
            The Hidden Bakery Story
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso tracking-tight">
            Tentang Kaca Putih
          </h2>
          <p className="mt-4 text-espresso-muted text-base sm:text-lg leading-relaxed font-normal">
            Sebuah rumah singgah di sudut Bunulrejo tempat aroma kopi segar, artisan Japanese Salt Bread, dan kenyamanan bertaut hangat.
          </p>
        </div>

        {/* Three Thematic Editorial Story Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Theme 1: Hidden Neighborhood */}
          <div className="p-7 rounded-3xl bg-white border border-cream-border shadow-xs flex flex-col justify-between hover:border-forest/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-forest-subtle flex items-center justify-center text-forest mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-forest block mb-1">
                Lokasi &amp; Suasana
              </span>
              <h3 className="font-serif text-xl font-bold text-espresso mb-3 leading-snug">
                Sudut Tenang di Bunulrejo
              </h3>
              <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                Terselip di kawasan pemukiman Bunulrejo, Blimbing, Kaca Putih menghadirkan atmosfer teduh yang jauh dari hiruk-pikuk bising kota. Tempat untuk bernapas lega dan menikmati tempo waktu yang melambat.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              Malang, Jawa Timur
            </div>
          </div>

          {/* Theme 2: Coffee & Bakery */}
          <div className="p-7 rounded-3xl bg-white border border-cream-border shadow-xs flex flex-col justify-between hover:border-forest/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100/70 flex items-center justify-center text-amber-800 mb-5">
                <Coffee className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-800 block mb-1">
                Racikan &amp; Oven Harian
              </span>
              <h3 className="font-serif text-xl font-bold text-espresso mb-3 leading-snug">
                Kopi Khas &amp; Artisan Bakes
              </h3>
              <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                Dari resep istimewa Mont Blanc bermahkota krim lembut hingga kehangatan Shio Pan bermentega gurih yang dipanggang harian. Setiap teguk dan gigitan diramu dari bahan pilihan dengan ketulusan barista.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              Signature &amp; Daily Bakes
            </div>
          </div>

          {/* Theme 3: Welcoming Pause */}
          <div className="p-7 rounded-3xl bg-white border border-cream-border shadow-xs flex flex-col justify-between hover:border-forest/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EFE8DC] flex items-center justify-center text-[#8B5A2B] mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#8B5A2B] block mb-1">
                Kenyamanan Bertemu
              </span>
              <h3 className="font-serif text-xl font-bold text-espresso mb-3 leading-snug">
                Ruang Singgah &amp; Cerita
              </h3>
              <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                Entah untuk menikmati pagi yang hening dengan manual brew, bertukar cerita hangat bersama sahabat, atau menikmati santap siang penuh rasa — Kaca Putih menyambut Anda dengan keramahan sebuah rumah.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              Dine-In &amp; Community
            </div>
          </div>
        </div>

        {/* Physical Visit Conversion Section (Interactive Map & Direct Contact Card) */}
        <div id="lokasi-kunjungan" className="p-8 sm:p-12 rounded-3xl bg-forest text-cream-50 shadow-floating relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#F7F5F0_1px,transparent_1px)] [background-size:20px_20px]"
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Info & Direct Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-sans uppercase font-bold tracking-[0.25em] text-cream-200 block mb-2">
                  Rencana Kunjungan Anda
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                  Kunjungi Kaca Putih Cafe &amp; Kitchen Secara Langsung
                </h3>
                <p className="text-cream-200/90 text-sm sm:text-base mt-3 leading-relaxed font-normal">
                  Temukan kenyamanan tersembunyi kami di Bunulrejo, nikmati seduhan kopi segar langsung dari bar, serta cicipi pastry hangat yang baru keluar dari oven.
                </p>
              </div>

              {/* Verified Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-forest-dark/80 border border-forest-light/40 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cream-50 block uppercase text-[10px] tracking-wider">
                      Alamat Lengkap
                    </span>
                    <span className="text-cream-200 leading-snug mt-1 block">
                      Jl. Hamid Rusdi Tim. No.350, Bunulrejo, Blimbing, Malang
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-forest-dark/80 border border-forest-light/40 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cream-50 block uppercase text-[10px] tracking-wider">
                      Jam Operasional
                    </span>
                    <span className="text-cream-200 leading-snug mt-1 block">
                      Reguler: 09:00 – 22:00 WIB
                      <br />
                      Ramadan: 12:00 – 23:00 WIB
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Prominent Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <a
                  href={gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-cream-100 hover:bg-white text-forest font-bold text-xs tracking-wider uppercase shadow-md transition-all active:scale-98 inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Lihat Rute (Google Maps)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all active:scale-98 inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hubungi via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Col: Graphic Preview Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-forest-light/60 shadow-floating bg-forest-dark">
                <Image
                  src="/images/menu/sq_nasi_goreng_rendang.png"
                  alt="Sajian Hangat Kaca Putih Cafe"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-xs text-cream-50">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                    Bunulrejo Comfort Food
                  </span>
                  <p className="font-serif text-base font-bold mt-0.5">
                    Nasi Goreng Rendang &amp; Aneka Seduhan Kopi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
