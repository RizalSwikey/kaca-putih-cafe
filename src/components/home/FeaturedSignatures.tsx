"use client";

import Image from "next/image";
import { Sparkles, Plus, ArrowRight, Coffee, Heart } from "lucide-react";
import { Product } from "@/types";
import { formatIDRShort } from "@/lib/utils";

interface FeaturedSignaturesProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAllMenu?: () => void;
}

export function FeaturedSignatures({
  products,
  onSelectProduct,
  onViewAllMenu,
}: FeaturedSignaturesProps) {
  const montBlanc = products.find((p) => p.slug === "mont-blanc");
  const dirtyLatte = products.find((p) => p.slug === "dirty-latte");
  const butterscotch = products.find((p) => p.slug === "butterscotch");
  const blossom = products.find((p) => p.slug === "blossom");

  const secondarySignatures = [dirtyLatte, butterscotch, blossom].filter(
    (p): p is Product => p !== undefined
  );

  return (
    <section id="khas-kaca-putih" className="relative w-full py-16 sm:py-24 bg-[#F5F2EA] border-b border-cream-border overflow-hidden">
      {/* Decorative background watermark */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EAE4D5]/60 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest text-cream-50 text-[10px] font-bold uppercase tracking-widest mb-3 shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Our Signatures • Menu Halaman 2</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso tracking-tight">
              Yang Paling Dicari di Kaca Putih
            </h2>
            <p className="mt-3 text-espresso-muted text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              Empat racikan kopi khas yang diramu khusus oleh barista kami. Dibuat dari biji kopi pilihan dan disajikan dengan keseimbangan rasa yang menenangkan.
            </p>
          </div>

          {onViewAllMenu && (
            <button
              type="button"
              onClick={onViewAllMenu}
              className="inline-flex items-center gap-2 text-xs font-bold text-forest hover:text-forest-hover transition-colors uppercase tracking-wider group shrink-0"
            >
              <span>Lihat Semua Katalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* 1. VISUALLY DOMINANT MARQUEE HERO: Mont Blanc Spotlight */}
        {montBlanc && (
          <div className="mb-12 rounded-3xl bg-white border border-cream-border shadow-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
              {/* Left Showcase (55%): Generous Atmospheric Visual Presentation */}
              <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto lg:h-[460px] bg-gradient-to-br from-[#FAF8F5] via-[#F3EEE3] to-[#E9E1D2] flex items-center justify-center p-8 overflow-hidden group">
                {montBlanc.image_url && (
                  <Image
                    src={montBlanc.image_url}
                    alt="Mont Blanc Signature Coffee"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-8 group-hover:scale-108 transition-transform duration-700 ease-out"
                    priority
                  />
                )}

                {/* Floating Badge on Visual */}
                <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-cream-50 text-xs font-bold shadow-md">
                  <Heart className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>#1 Best Seller Barista</span>
                </div>

                <div className="absolute bottom-5 right-5 px-3.5 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-cream-border shadow-md text-forest font-mono text-base font-bold">
                  {formatIDRShort(montBlanc.base_price)}
                </div>
              </div>

              {/* Right Details (45%): Craftsmanship Narrative & Tasting Notes */}
              <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 uppercase tracking-widest mb-2">
                    <Coffee className="w-4 h-4 text-amber-700" />
                    <span>The Crown Jewel of Kaca Putih</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-4xl font-bold text-espresso leading-tight">
                    {montBlanc.name}
                  </h3>

                  <p className="mt-4 text-xs sm:text-sm text-espresso-muted leading-relaxed font-normal">
                    {montBlanc.description} Diciptakan untuk dinikmati langsung dari bibir gelas tanpa sedotan — agar kelembutan krim manis dingin menyentuh lidah terlebih dahulu, disusul kepekatan espresso aromatik yang hangat dan kaya.
                  </p>

                  {/* Flavor Profile Indicators */}
                  <div className="mt-6 pt-5 border-t border-cream-border/80">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-espresso-subtle block mb-2.5">
                      Karakter Rasa
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-3 py-1 rounded-xl bg-[#F5F2EA] border border-cream-border text-espresso font-medium">
                        Velvety Sweet Cream
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-[#F5F2EA] border border-cream-border text-espresso font-medium">
                        Dense Cold Brew Layer
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-[#F5F2EA] border border-cream-border text-espresso font-medium">
                        Smooth Dark Chocolate Note
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-8 pt-6 border-t border-cream-border flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-espresso-subtle block">
                      Harga Menu
                    </span>
                    <span className="font-mono text-xl font-bold text-forest">
                      Rp 30.000
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProduct(montBlanc)}
                    className="px-6 py-3 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Pesan Mont Blanc</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ASYMMETRIC TRIO: The Other 3 Coffee Signatures from Page 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondarySignatures.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="group relative rounded-3xl bg-white border border-cream-border hover:border-forest/40 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Product Visual Container */}
              <div className="relative w-full aspect-square bg-gradient-to-b from-[#FAF8F5] to-[#F1ECE1] flex items-center justify-center p-6 overflow-hidden">
                {item.image_url && (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-6 group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                )}

                <div className="absolute top-3.5 left-3.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest text-cream-50 text-[10px] font-bold tracking-wider uppercase shadow-xs">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    <span>Signature</span>
                  </span>
                </div>

                <div className="absolute bottom-3.5 right-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-forest font-mono text-xs font-bold shadow-xs border border-white">
                  {formatIDRShort(item.base_price)}
                </div>
              </div>

              {/* Editorial Description */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-espresso group-hover:text-forest transition-colors leading-snug">
                    {item.name}
                  </h4>
                  <p className="mt-2 text-xs text-espresso-muted leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-cream-border/70 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-forest font-semibold">
                    Kaca Putih Blend
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(item);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest/10 hover:bg-forest text-forest hover:text-cream-50 text-xs font-bold transition-all shadow-2xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pilih</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
