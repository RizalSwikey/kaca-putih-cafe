"use client";

import Image from "next/image";
import { Sparkles, Plus, ArrowRight } from "lucide-react";
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
  // Grab authentic signature items: Mont Blanc, Dirty Latte, Butterscotch, Blossom, Nasi Goreng Rendang, Masitta Wings
  const signatureSlugs = [
    "mont-blanc",
    "dirty-latte",
    "butterscotch",
    "blossom",
    "nasi-goreng-rendang",
    "masitta-hot-korean-wings",
  ];

  const featuredItems = signatureSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);

  return (
    <section className="relative w-full py-12 sm:py-16 bg-[#F7F5F0] border-b border-cream-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-subtle text-forest text-[11px] font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Rekomendasi Utama Barista &amp; Kitchen</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso tracking-tight">
              Kreasi Khas Kaca Putih
            </h2>
            <p className="mt-2 text-espresso-muted text-sm max-w-xl font-normal leading-relaxed">
              Empat racikan kopi khas halaman depan Menu Kaca Putih, ditemani hidangan gurih pilihan dari dapur Bunulrejo.
            </p>
          </div>

          {onViewAllMenu && (
            <button
              type="button"
              onClick={onViewAllMenu}
              className="inline-flex items-center gap-2 text-xs font-bold text-forest hover:text-forest-hover transition-colors uppercase tracking-wider group"
            >
              <span>Lihat Semua Katalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Featured Items Grid (Editorial cards with generous photography) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="group relative rounded-3xl bg-white border border-cream-border hover:border-forest/40 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative w-full aspect-[4/3] bg-[#FAF8F5] border-b border-cream-border/60 overflow-hidden flex items-center justify-center p-3">
                {item.image_url && (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-3 group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest text-cream-50 text-[10px] font-bold tracking-wider uppercase shadow-md">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    <span>Signature</span>
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-forest font-mono text-sm font-bold shadow-md">
                  {formatIDRShort(item.base_price)}
                </div>
              </div>

              {/* Text Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-espresso group-hover:text-forest transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs text-espresso-muted leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-cream-border/70 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-espresso-subtle">
                    Kaca Putih Original
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(item);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 text-xs font-bold transition-all shadow-xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pesan</span>
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
