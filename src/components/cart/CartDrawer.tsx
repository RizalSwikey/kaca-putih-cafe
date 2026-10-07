"use client";

import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatIDR } from "@/lib/utils";

export function CartDrawer() {
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const orderType = useCartStore((s) => s.orderType);
  const tableNumber = useCartStore((s) => s.tableNumber);
  const getTotalAmount = useCartStore((s) => s.getTotalAmount);
  const setIsCheckoutOpen = useCartStore((s) => s.setIsCheckoutOpen);

  if (!isCartOpen) return null;

  const totalAmount = getTotalAmount();

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-espresso/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div
        className="w-full max-w-md bg-cream-50 h-full shadow-2xl flex flex-col border-l border-cream-border transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-cream-border bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-forest" />
            <h2 className="font-serif text-lg font-bold text-espresso">Your Order Tray</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-forest-subtle text-forest font-mono font-bold">
              {items.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-cream-200 text-espresso-muted transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Fulfillment banner */}
        <div className="px-5 py-2.5 bg-forest-subtle/80 border-b border-forest-border/40 flex items-center justify-between text-xs text-forest">
          <span className="font-semibold">
            {orderType === "dine_in"
              ? `Dine In ${tableNumber ? `• Table ${tableNumber}` : "(Counter scan)"}`
              : "Takeaway Pickup"}
          </span>
          <span className="text-[11px] font-medium opacity-80">Malang Outlet</span>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-espresso-subtle">
              <ShoppingBag className="w-12 h-12 stroke-1 text-stone-300 mb-3" />
              <p className="font-serif text-base font-semibold text-espresso">Your tray is empty</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Explore our signature coffees, artisanal Japanese salt breads, or hot meals and tap to add.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white border border-cream-border shadow-xs flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-serif text-sm font-bold text-espresso leading-snug">
                      {item.product.name}
                    </h4>

                    {/* Variant / customization details */}
                    <div className="text-[11px] text-espresso-muted mt-0.5 space-y-0.5">
                      {item.variant && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-cream-200/80 text-espresso text-[10px] font-medium mr-1.5">
                          {item.variant.name}
                        </span>
                      )}
                      {item.extraShot && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-forest/10 text-forest text-[10px] font-medium mr-1.5">
                          +Extra Shot
                        </span>
                      )}
                      {item.notes && (
                        <p className="italic text-stone-500 text-[10px]">"{item.notes}"</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="font-mono text-xs font-bold text-forest">
                    {formatIDR(item.unitPrice * item.quantity)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-md bg-cream-100 border border-cream-border flex items-center justify-center text-espresso hover:bg-cream-200 transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-md bg-cream-100 border border-cream-border flex items-center justify-center text-espresso hover:bg-cream-200 transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-cream-border bg-white shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs text-espresso-muted">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-espresso text-sm">
                {formatIDR(totalAmount)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleProceedCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs tracking-wide shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
