"use client";

import { useState, useEffect } from "react";
import { X, Plus, Minus, Coffee, Sparkles } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { formatIDR, formatIDRShort } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

interface VariantDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VariantDrawer({ product, isOpen, onClose }: VariantDrawerProps) {
  const addItem = useCartStore((s) => s.addItem);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [extraShot, setExtraShot] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Initialize or reset state when product changes
  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0] || null);
      } else {
        setSelectedVariant(null);
      }
      setExtraShot(false);
      setNotes("");
      setQuantity(1);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const EXTRA_SHOT_PRICE = 8000;
  const isCoffeeOrDrink =
    product.category_id === "cat-coffee" ||
    product.category_id === "cat-signature" ||
    product.category_id === "cat-milk-based" ||
    product.category_id === "cat-manual-brew";

  const basePrice = product.base_price;
  const variantDelta = selectedVariant ? Number(selectedVariant.price_delta) : 0;
  const extraShotCost = extraShot ? EXTRA_SHOT_PRICE : 0;
  const unitPrice = basePrice + variantDelta + extraShotCost;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      product,
      variant: selectedVariant,
      extraShot,
      notes: notes.trim() || undefined,
      quantity,
      unitPrice,
    });
    onClose();
  };

  // Determine if variants are Hot/Ice style
  const isHotIceVariant =
    product.variants?.some(
      (v) => v.name.toLowerCase() === "hot" || v.name.toLowerCase() === "ice" || v.name.toLowerCase() === "cold"
    );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-espresso/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-cream-card rounded-t-3xl sm:rounded-3xl border border-cream-border shadow-floating overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 border-b border-cream-border flex items-start justify-between bg-white/60">
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-1">
              {product.is_signature && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest text-cream-50 text-[10px] font-bold uppercase">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  Signature
                </span>
              )}
              {product.is_daily_bakery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-semibold">
                  Daily Fresh
                </span>
              )}
            </div>
            <h2 className="font-serif text-xl font-bold text-espresso">{product.name}</h2>
            <p className="text-xs text-espresso-muted mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-cream-200 text-espresso-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-forest">
                  {isHotIceVariant ? "Temperature Option" : "Choose Variety / Flavor"}
                </label>
                <span className="text-[11px] text-espresso-subtle">Required</span>
              </div>

              {/* If Hot / Cold toggle */}
              {isHotIceVariant ? (
                <div className="grid grid-cols-2 gap-2.5 p-1 rounded-2xl bg-cream-200/60 border border-cream-border">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const delta = Number(variant.price_delta);
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`py-3 px-4 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? "bg-forest text-cream-50 shadow-sm"
                            : "bg-white/80 text-espresso hover:bg-white border border-transparent"
                        }`}
                      >
                        <span className="text-sm font-bold">{variant.name}</span>
                        {delta > 0 && (
                          <span
                            className={`text-[11px] ${
                              isSelected ? "text-cream-200" : "text-forest"
                            }`}
                          >
                            +{formatIDRShort(delta)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* List of flavors (e.g. Salt Bread flavors or Donut toppings) */
                <div className="space-y-2">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const delta = Number(variant.price_delta);
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-forest bg-forest/5 shadow-xs"
                            : "border-cream-border bg-white hover:border-forest/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-forest bg-forest"
                                : "border-stone-300 bg-white"
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-xs font-bold text-espresso">{variant.name}</span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-forest">
                          {delta > 0 ? `+${formatIDRShort(delta)}` : "Included"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Add-on: Extra Espresso Shot (+8k) for drinks */}
          {isCoffeeOrDrink && (
            <div className="p-4 rounded-2xl bg-white border border-cream-border">
              <label className="flex items-start justify-between cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-forest-subtle text-forest shrink-0 mt-0.5">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-espresso block">
                      Extra Espresso Shot
                    </span>
                    <span className="text-[11px] text-espresso-muted block mt-0.5">
                      Boost intensity with an extra single extraction shot (+8K)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-forest">
                    +{formatIDRShort(EXTRA_SHOT_PRICE)}
                  </span>
                  <input
                    type="checkbox"
                    checked={extraShot}
                    onChange={(e) => setExtraShot(e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-forest cursor-pointer accent-forest"
                  />
                </div>
              </label>
            </div>
          )}

          {/* Special Request / Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Less ice, warm slightly, separate sauce..."
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-border text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest placeholder:text-stone-400"
            />
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-cream-200/60 border border-cream-border">
            <span className="text-xs font-bold uppercase tracking-wider text-espresso">
              Quantity
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg bg-white border border-cream-border flex items-center justify-center text-espresso hover:bg-cream-100 disabled:opacity-40 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-sm text-espresso w-6 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-cream-border flex items-center justify-center text-espresso hover:bg-cream-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-cream-border bg-white flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-espresso-subtle uppercase tracking-wider block">
              Total Price
            </span>
            <span className="font-mono text-base font-bold text-forest">
              {formatIDR(totalPrice)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 font-semibold text-xs transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Add to Order</span>
            <span>•</span>
            <span className="font-mono">{formatIDR(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
