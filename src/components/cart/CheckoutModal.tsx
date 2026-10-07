"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  Sparkles,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { PaymentMethod, Order } from "@/types";
import { formatIDR, buildWhatsAppMessage } from "@/lib/utils";
import { createOrder } from "@/lib/orders-store";
import { DEFAULT_STORE_SETTINGS } from "@/data/menu";

export function CheckoutModal() {
  const router = useRouter();

  const isCheckoutOpen = useCartStore((s) => s.isCheckoutOpen);
  const setIsCheckoutOpen = useCartStore((s) => s.setIsCheckoutOpen);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const orderType = useCartStore((s) => s.orderType);
  const tableNumber = useCartStore((s) => s.tableNumber);
  const setTableNumber = useCartStore((s) => s.setTableNumber);
  const getTotalAmount = useCartStore((s) => s.getTotalAmount);
  const isDemoMode = useCartStore((s) => s.isDemoMode);
  const setIsDemoMode = useCartStore((s) => s.setIsDemoMode);

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isCheckoutOpen) return null;

  const totalAmount = getTotalAmount();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setErrorMessage("Please enter a valid phone number (e.g. 08123456789).");
      return;
    }
    if (orderType === "dine_in" && !tableNumber) {
      setErrorMessage("Please enter your table number for Dine In.");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        variant_id: item.variant?.id || null,
        variant_name: item.variant?.name || null,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        notes: item.notes || null,
        extra_shot: item.extraShot,
      }));

      const payload = {
        order_type: orderType,
        table_number: orderType === "dine_in" ? tableNumber : null,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        notes: orderNotes.trim() || null,
        payment_method: paymentMethod,
        total_amount: totalAmount,
        is_demo: isDemoMode,
        items: orderItems,
      };

      const savedOrder: Order = await createOrder(payload);

      // Trigger WhatsApp redirect if NOT in demo sandbox mode
      if (!isDemoMode) {
        const waLink = buildWhatsAppMessage(savedOrder, DEFAULT_STORE_SETTINGS.whatsapp_number);
        // Open WhatsApp in new tab
        window.open(waLink, "_blank", "noopener,noreferrer");
      }

      // Clear cart & close checkout
      clearCart();
      setIsCheckoutOpen(false);

      // Instant redirect to real-time tracker /track/[code]
      const cleanCode = savedOrder.code.replace("#", "");
      router.push(`/track/${cleanCode}`);
    } catch {
      setErrorMessage("Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/60 backdrop-blur-sm animate-fade-in flex items-center justify-center p-3 sm:p-4">
      <div
        className="w-full max-w-lg bg-cream-card rounded-3xl border border-cream-border shadow-floating overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-cream-border bg-white flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-espresso">Checkout Order</h2>
            <p className="text-xs text-espresso-muted mt-0.5">
              {orderType === "dine_in"
                ? `Dine In ${tableNumber ? `(Table ${tableNumber})` : ""}`
                : "Takeaway Pickup"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full hover:bg-cream-200 text-espresso-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sandbox indicator toggle */}
        <div className="p-3.5 bg-amber-500/10 border-b border-amber-500/20 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <div className="text-xs">
              <span className="font-bold text-amber-950 block">Recruiter Demo Sandbox</span>
              <span className="text-[11px] text-amber-800">
                {isDemoMode ? "Safe simulation: WhatsApp popup is suppressed." : "Live mode: Dispatches WhatsApp to cafe."}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              isDemoMode
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white text-stone-600 border border-stone-200"
            }`}
          >
            {isDemoMode ? "ON" : "OFF"}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Budi Santoso"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-border text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
              WhatsApp / Phone Number *
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. 081234567890"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-border text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest font-mono"
            />
          </div>

          {/* Table Number if Dine In */}
          {orderType === "dine_in" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                Table Number *
              </label>
              <input
                type="number"
                min="1"
                max="99"
                required
                value={tableNumber || ""}
                onChange={(e) => setTableNumber(e.target.value ? parseInt(e.target.value, 10) : null)}
                placeholder="Table number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-border text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest font-mono"
              />
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* QRIS */}
              <button
                type="button"
                onClick={() => setPaymentMethod("qris")}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === "qris"
                    ? "border-forest bg-forest text-cream-50 shadow-sm"
                    : "border-cream-border bg-white text-espresso hover:border-forest/40"
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs font-bold">QRIS</span>
                <span className="text-[10px] opacity-80">Instant Pay</span>
              </button>

              {/* Cash */}
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === "cash"
                    ? "border-forest bg-forest text-cream-50 shadow-sm"
                    : "border-cream-border bg-white text-espresso hover:border-forest/40"
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-bold">Cash</span>
                <span className="text-[10px] opacity-80">Pay at cashier</span>
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === "card"
                    ? "border-forest bg-forest text-cream-50 shadow-sm"
                    : "border-cream-border bg-white text-espresso hover:border-forest/40"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold">Card</span>
                <span className="text-[10px] opacity-80">Debit / Credit</span>
              </button>
            </div>
          </div>

          {/* QRIS preview helper */}
          {paymentMethod === "qris" && (
            <div className="p-3.5 rounded-2xl bg-white border border-cream-border flex items-center gap-3">
              <div className="p-2 rounded-xl bg-forest-subtle text-forest">
                <QrCode className="w-8 h-8" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-espresso">QRIS Dynamic Generator</p>
                <p className="text-[11px] text-espresso-muted">
                  A static/dynamic QR will also be attached to your live tracker page.
                </p>
              </div>
            </div>
          )}

          {/* General Notes for Kitchen */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
              Kitchen Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Serve dessert after main course, allergen note..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-border text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
            />
          </div>

          {/* Order Summary Snapshot */}
          <div className="p-3.5 rounded-2xl bg-cream-200/50 border border-cream-border space-y-2 text-xs">
            <div className="flex justify-between text-espresso-muted">
              <span>Items Count:</span>
              <span className="font-semibold text-espresso">{items.length} items</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-espresso pt-1 border-t border-cream-border">
              <span>Total Payable:</span>
              <span className="font-mono text-forest">{formatIDR(totalAmount)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs tracking-wider uppercase shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming Order...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & Track Order ({formatIDR(totalAmount)})</span>
              </>
            )}
          </button>

          {!isDemoMode && (
            <p className="text-center text-[10px] text-stone-500 flex items-center justify-center gap-1">
              <span>Will dispatch automatically to Cafe WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
