"use client";

import { Sparkles, Plus, Croissant, Coffee } from "lucide-react";
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

  return (
    <article
      onClick={() => isAvailable && onSelect(product)}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-cream-card border transition-all duration-300 ${
        isAvailable
          ? "border-cream-border/80 hover:border-forest/40 hover:shadow-card hover:-translate-y-0.5 cursor-pointer bg-white/70 backdrop-blur-sm"
          : "border-stone-200/50 opacity-60 cursor-not-allowed bg-stone-100/40"
      }`}
    >
      <div>
        {/* Top meta row: Category pill / Signature badge / Price Pill */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {product.is_signature && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest text-cream-50 text-[10px] font-bold tracking-wider uppercase shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>Signature</span>
              </span>
            )}
            {product.is_daily_bakery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold tracking-wide">
                <Croissant className="w-2.5 h-2.5 text-amber-600" />
                <span>Daily Fresh</span>
              </span>
            )}
            {categoryName && !product.is_signature && !product.is_daily_bakery && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-espresso-subtle">
                {categoryName}
              </span>
            )}
          </div>

          {/* Elegant Price Pill */}
          <div className="shrink-0 px-2.5 py-1 rounded-full bg-forest-subtle/80 text-forest font-mono text-xs font-bold tracking-tight border border-forest-border/40 group-hover:bg-forest group-hover:text-cream-50 transition-colors">
            {formatIDRShort(product.base_price)}
          </div>
        </div>

        {/* Product Name (Editorial Serif) */}
        <h3 className="font-serif text-lg font-bold text-espresso group-hover:text-forest transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Editorial Description */}
        <p className="mt-2 text-xs text-espresso-muted leading-relaxed line-clamp-2">
          {product.description}
        </p>
      </div>

      {/* Bottom Action & Variant indicator */}
      <div className="mt-4 pt-3 border-t border-cream-border/60 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-espresso-subtle">
          {hasVariants ? (
            <span className="inline-flex items-center gap-1 text-forest font-medium">
              <span>{product.variants?.length} Options</span>
            </span>
          ) : product.category_id === "cat-coffee" || product.category_id === "cat-signature" ? (
            <span className="inline-flex items-center gap-1 text-stone-500">
              <Coffee className="w-3 h-3 text-forest/70" />
              <span>Espresso base</span>
            </span>
          ) : (
            <span className="text-stone-400">Standard serving</span>
          )}
        </div>

        {isAvailable ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-forest/10 hover:bg-forest text-forest hover:text-cream-50 text-xs font-semibold transition-all active:scale-95"
            aria-label={`Select ${product.name}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{hasVariants ? "Choose" : "Add"}</span>
          </button>
        ) : (
          <span className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
            Sold Out
          </span>
        )}
      </div>
    </article>
  );
}
