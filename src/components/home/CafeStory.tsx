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
    "Halo Kaca Putih Cafe & Kitchen, saya ingin bertanya tentang lokasi dan reservasi tempat."
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
      {/* 1. TENTANG KACA PUTIH — THE HIDDEN BAKERY STORY */}
      <section
        id="tentang-kaca-putih"
        className="relative w-full py-20 sm:py-28 bg-[#FAF8F5] border-b border-cream-border overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative (7 Cols): Editorial storytelling */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 text-forest text-[11px] font-bold uppercase tracking-widest">
                <Compass className="w-3.5 h-3.5" />
                <span>The Hidden Bakery Story • Bunulrejo</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso tracking-tight leading-[1.15]">
                Tentang Kaca Putih:{" "}
                <span className="italic font-normal text-forest block sm:inline">
                  Rumah Singgah di Sudut Kota.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-espresso-muted leading-relaxed font-normal">
                Kaca Putih berawal dari kerinduan sederhana akan sebuah ruang yang hangat di Malang — tempat aroma biji kopi yang baru digiling bersanding mesra dengan wangi mentega roti yang baru matang dari oven.
              </p>

              <div className="space-y-4 text-sm text-espresso-muted leading-relaxed font-normal pt-2">
                <p>
                  Terletak di kawasan pemukiman Bunulrejo, Blimbing, kami memilih berada di sudut tenang yang tersembunyi dari keriuhan jalan raya utama. Di sini, setiap cangkir kopi diseduh dengan kesabaran, dari racikan signature berlapis krim seperti Mont Blanc hingga seduhan tubruk nusantara yang bersahaja.
                </p>
                <p>
                  Bagi kami, Kaca Putih bukan sekadar kafe untuk singgah sebentar — ini adalah perpanjangan ruang keluarga Anda. Tempat untuk berbincang santai, menyelesaikan bacaan yang tertunda, atau menikmati piring hangat Nasi Goreng Rendang bersama sahabat.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-cream-border/80 text-xs">
                <div>
                  <span className="font-serif text-2xl font-bold text-forest block">
                    100%
                  </span>
                  <span className="text-espresso-subtle mt-0.5 block">
                    Biji Kopi Pilihan
                  </span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-forest block">
                    2x
                  </span>
                  <span className="text-espresso-subtle mt-0.5 block">
                    Sesi Panggang Harian
                  </span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-forest block">
                    Bunulrejo
                  </span>
                  <span className="text-espresso-subtle mt-0.5 block">
                    Malang, Jawa Timur
                  </span>
                </div>
              </div>
            </div>

            {/* Right Visual Collage (5 Cols): Layered authentic photography */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-floating bg-cream-200">
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
                    Sayur lodeh gurih khas Jawa Timur dengan telur kribo renyah keemasan.
                  </p>
                </div>
              </div>

              {/* Floating Coffee Stamp */}
              <div className="absolute -top-5 -right-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-cream-border shadow-card flex items-center gap-3">
                <Coffee className="w-5 h-5 text-forest" />
                <div className="text-left">
                  <span className="font-serif font-bold text-xs text-espresso block">
                    Espresso &amp; Kitchen
                  </span>
                  <span className="text-[10px] text-espresso-muted">
                    Freshly brewed daily
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KENAPA BERKUNJUNG KE KACA PUTIH — 4 PILLARS VISUAL STORYTELLING */}
      <section
        id="kenapa-kami"
        className="relative w-full py-20 sm:py-28 bg-[#F5F2EA] border-b border-cream-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-sans uppercase font-bold tracking-[0.25em] text-forest block mb-2">
              Alasan Mampir ke Sudut Bunulrejo
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso tracking-tight">
              Kenapa Harus Berkunjung Langsung?
            </h2>
            <p className="mt-4 text-espresso-muted text-base sm:text-lg leading-relaxed font-normal">
              Ada hal-hal yang hanya bisa dirasakan seutuhnya saat Anda melangkah masuk ke pintu kami di Bunulrejo.
            </p>
          </div>

          {/* 4 Thematic Pillars with visual storytelling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Specialty Coffee */}
            <div className="p-7 rounded-3xl bg-white border border-cream-border shadow-xs hover:border-forest/40 hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-forest-subtle flex items-center justify-center text-forest mb-5">
                  <Coffee className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-forest block mb-1">
                  1. Racikan Terkurasi
                </span>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3 leading-snug">
                  Specialty Coffee
                </h3>
                <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                  Dari kelembutan Mont Blanc bermahkota krim hingga espresso mocktail segar seperti Blossom dan Midnight Blush. Diracik presisi oleh barista setiap hari.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-forest font-semibold">
                Signature &amp; Manual Brew
              </div>
            </div>

            {/* Pillar 2: Daily Fresh Bakery */}
            <div className="p-7 rounded-3xl bg-white border border-cream-border shadow-xs hover:border-forest/40 hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100/70 flex items-center justify-center text-amber-800 mb-5">
                  <Croissant className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 block mb-1">
                  2. Dari Oven Langsung
                </span>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3 leading-snug">
                  Artisan Salt Bread
                </h3>
                <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                  Shio Pan Jepang dengan kerak mentega renyah dan kristal sea salt. Dipanggang dalam dua sesi harian sehingga selalu tiba di meja Anda dalam keadaan hangat.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-amber-800 font-semibold">
                Baked Fresh Daily
              </div>
            </div>

            {/* Pillar 3: Comfort Food */}
            <div className="p-7 rounded-3xl bg-white border border-cream-border shadow-xs hover:border-forest/40 hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#EFE8DC] flex items-center justify-center text-[#8B5A2B] mb-5">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B5A2B] block mb-1">
                  3. Dapur Berbumbu
                </span>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3 leading-snug">
                  Comfort Dining
                </h3>
                <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                  Menu makanan berat yang dimasak dari hati: Nasi Goreng Rendang kaya rempah, Mie Godok berkuah gurih kental, dan Sayur Lodeh Telor Kribo yang membangkitkan memori rumah.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-[#8B5A2B] font-semibold">
                Hearty Main Foods
              </div>
            </div>

            {/* Pillar 4: Cozy Hidden Spot */}
            <div className="p-7 rounded-3xl bg-white border border-cream-border shadow-xs hover:border-forest/40 hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-forest-subtle flex items-center justify-center text-forest mb-5">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-forest block mb-1">
                  4. Suasana Rumah
                </span>
                <h3 className="font-serif text-xl font-bold text-espresso mb-3 leading-snug">
                  Cozy Hidden Alley
                </h3>
                <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                  Suasana teduh nan akrab di pemukiman Bunulrejo. Cocok untuk work-from-cafe, berkumpul bersama keluarga, atau sekadar menikmati waktu jeda di sore hari yang sejuk.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-forest font-semibold">
                Warm &amp; Peaceful Ambiance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PHYSICAL VISIT INVITATION — TEMUKAN SUDUT NYAMANMU DI KACA PUTIH */}
      <section
        id="lokasi-kunjungan"
        className="relative w-full py-20 sm:py-28 bg-forest text-cream-50 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#F7F5F0_1px,transparent_1px)] [background-size:20px_20px]"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-sans uppercase font-bold tracking-[0.25em] text-amber-300 block mb-2">
                  Undangan Singgah &amp; Bersua
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                  Temukan Sudut Nyamanmu di Kaca Putih.
                </h2>
                <p className="text-cream-200/90 text-sm sm:text-base mt-4 leading-relaxed font-normal max-w-2xl">
                  Pintu kami di Bunulrejo selalu terbuka untuk Anda. Nikmati aroma seduhan kopi segar, sambut hangatnya roti bantal yang baru diangkat, dan nikmati waktu jeda yang menenangkan di Malang.
                </p>
              </div>

              {/* Exact Verified Address & Opening Hours Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-2xl bg-forest-dark/85 border border-forest-light/40 flex items-start gap-3">
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

                <div className="p-4 rounded-2xl bg-forest-dark/85 border border-forest-light/40 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cream-50 block uppercase text-[10px] tracking-wider">
                      Jam Buka &amp; Layanan
                    </span>
                    <span className="text-cream-200 leading-snug mt-1 block">
                      Reguler: 09:00 – 22:00 WIB
                      <br />
                      Ramadan: 12:00 – 23:00 WIB
                    </span>
                  </div>
                </div>
              </div>

              {/* Three Conversion Actions */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4">
                <a
                  href={gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-cream-100 hover:bg-white text-forest font-bold text-xs tracking-wider uppercase shadow-md transition-all active:scale-98 inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Lihat Rute di Google Maps</span>
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

                <button
                  type="button"
                  onClick={scrollToMenu}
                  className="px-5 py-3.5 rounded-xl bg-forest-dark/80 hover:bg-forest-dark border border-forest-light/50 text-cream-100 font-bold text-xs tracking-wider uppercase transition-all active:scale-98 inline-flex items-center gap-1.5"
                >
                  <span>Lihat Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Visual Image (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-forest-light/60 shadow-floating bg-forest-dark">
                <Image
                  src="/images/menu/sq_nasi_goreng_rendang.png"
                  alt="Sajian Hangat Kaca Putih Cafe"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain p-6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-xs text-cream-50">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                    Sajian Hangat &amp; Seduhan Segar
                  </span>
                  <p className="font-serif text-lg font-bold mt-0.5">
                    Nasi Goreng Rendang &amp; Kopi Kaca Putih
                  </p>
                  <p className="text-cream-200/80 text-[11px] mt-0.5">
                    Nikmati santap di tempat atau bawa pulang ke rumah.
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
