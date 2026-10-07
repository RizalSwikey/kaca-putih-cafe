"use client";

import Image from "next/image";
import { Sparkles, Plus, Croissant, Coffee, Flame } from "lucide-react";
import { Product } from "@/types";
import { formatIDRShort } from "@/lib/utils";

interface MenuCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  categoryName?: string;
}

export function MenuCard({ product, onSelect, categoryName }: MenuCardProps) {
  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const isAvailable = product.is_available;
  const hasImage = Boolean(product.image_url);

  return (
    <article
      onClick={() => isAvailable && onSelect(product)}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white border transition-all duration-300 overflow-hidden ${
        isAvailable
          ? "border-cream-border/90 hover:border-forest/40 hover:shadow-card hover:-translate-y-1 cursor-pointer"
          : "border-stone-200/50 opacity-60 cursor-not-allowed bg-stone-50/60"
      }`}
    >
      {/* 1. Top Media: Photo OR Artisanal Illustrated Medallion */}
      {hasImage ? (
        <div className="relative w-full aspect-square bg-[#FAF8F5] border-b border-cream-border/60 overflow-hidden flex items-center justify-center">
          <Image
            src={product.image_url!}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-3 group-hover:scale-108 transition-transform duration-500 ease-out"
          />

          {/* Badge Overlays on Top of Photo */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {product.is_signature && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest text-cream-50 text-[10px] font-bold tracking-wider uppercase shadow-md">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>Signature</span>
              </span>
            )}
            {product.is_daily_bakery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold tracking-wide shadow-xs">
                <Croissant className="w-2.5 h-2.5 text-amber-700" />
                <span>Daily Fresh</span>
              </span>
            )}
          </div>

          {/* Price Pill Overlay Bottom Right */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-forest font-mono text-xs font-bold tracking-tight shadow-md border border-white">
            {formatIDRShort(product.base_price)}
          </div>
        </div>
      ) : (
        /* Artisanal Illustrated Medallion Canvas for bakery or add-ons without photos */
        <div className="relative w-full aspect-square bg-gradient-to-br from-[#FAF8F5] via-[#F4EFE4] to-[#ECE3D2] border-b border-cream-border/60 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
          {/* Circular textured frame */}
          <div className="w-24 h-24 rounded-full bg-white/80 border border-cream-border shadow-xs flex items-center justify-center text-amber-800 group-hover:scale-110 transition-transform duration-500">
            {product.is_daily_bakery ? (
              <Croissant className="w-11 h-11 text-amber-700 stroke-[1.5]" />
            ) : product.slug === "extra-shot" ? (
              <Coffee className="w-11 h-11 text-forest stroke-[1.5]" />
            ) : (
              <Flame className="w-11 h-11 text-amber-700 stroke-[1.5]" />
            )}
          </div>

          <span className="mt-3 text-[10px] uppercase tracking-widest font-bold text-amber-900/80">
            {product.is_daily_bakery
              ? "Artisan Oven Fresh"
              : product.slug === "extra-shot"
              ? "Single Extraction"
              : "Specialty Item"}
          </span>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {product.is_signature && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest text-cream-50 text-[10px] font-bold tracking-wider uppercase shadow-md">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>Signature</span>
              </span>
            )}
            {product.is_daily_bakery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold tracking-wide shadow-xs">
                <Croissant className="w-2.5 h-2.5 text-amber-700" />
                <span>Daily Fresh</span>
              </span>
            )}
          </div>

          {/* Price Pill */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-forest font-mono text-xs font-bold tracking-tight shadow-md border border-white">
            {formatIDRShort(product.base_price)}
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {categoryName && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-espresso-subtle block mb-1">
              {categoryName}
            </span>
          )}

          <h3 className="font-serif text-base sm:text-lg font-bold text-espresso group-hover:text-forest transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="mt-2 text-xs text-espresso-muted leading-relaxed line-clamp-2 font-sans font-normal">
            {product.description}
          </p>
        </div>

        {/* Bottom Action Footer */}
        <div className="mt-4 pt-3 border-t border-cream-border/70 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-espresso-subtle">
            {hasVariants ? (
              <span className="inline-flex items-center gap-1 text-forest font-semibold">
                <span>{product.variants?.length} Options</span>
              </span>
            ) : product.category_id === "cat-coffee" || product.category_id === "cat-signature" ? (
              <span className="text-stone-500">Espresso base</span>
            ) : (
              <span className="text-stone-400">Regular</span>
            )}
          </div>

          {isAvailable ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest/10 hover:bg-forest text-forest hover:text-cream-50 text-xs font-bold transition-all active:scale-95 shadow-2xs"
              aria-label={`Select ${product.name}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{hasVariants ? "Pilih" : "Tambah"}</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-wider border border-stone-200">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
