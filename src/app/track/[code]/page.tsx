"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  ChefHat,
  BellRing,
  ShoppingBag,
  Utensils,
  ArrowLeft,
  QrCode,
  MessageCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { fetchOrderByCode } from "@/lib/orders-store";
import { formatIDR } from "@/lib/utils";
import { getSupabaseBrowserClient, isSupabaseConfigured, subscribeToMockOrders } from "@/lib/supabase/client";
import { DEFAULT_STORE_SETTINGS } from "@/data/menu";

const STATUS_STEPS: Array<{ key: OrderStatus; label: string; desc: string }> = [
  { key: "new", label: "Order Received", desc: "Your order is queued in the kitchen." },
  { key: "preparing", label: "Preparing in Kitchen", desc: "Barista & chefs are preparing your items." },
  { key: "ready", label: "Ready to Serve / Pick Up", desc: "Freshly made and ready for you!" },
  { key: "completed", label: "Completed", desc: "Enjoy your dining experience at Kaca Putih." },
];

export default function OrderTrackerPage() {
  const params = useParams();
  const rawCode = Array.isArray(params["code"]) ? params["code"][0] : params["code"];
  const code = (rawCode || "").toUpperCase();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const loadOrder = async () => {
    if (!code) return;
    try {
      const found = await fetchOrderByCode(code);
      if (found) {
        setOrder(found);
      } else {
        setError(`Order with code #${code} could not be found.`);
      }
    } catch {
      setError("Error loading order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();

    // 1. Supabase Realtime subscription if configured
    const supabase = getSupabaseBrowserClient();
    let channel: any = null;

    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel(`order-track-${code}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `code=eq.#${code}`,
          },
          (payload: any) => {
            if (payload.new) {
              setOrder((prev) => (prev ? { ...prev, status: payload.new.status } : null));
            }
          }
        )
        .subscribe();
    }

    // 2. In-memory / localStorage broadcast fallback
    const unsubscribeMock = subscribeToMockOrders((payload) => {
      const cleanTarget = code.replace("#", "");
      const cleanEvent = payload.new.code.replace("#", "");
      if (cleanTarget === cleanEvent) {
        setOrder(payload.new);
      }
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "kp_last_order_event" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const cleanTarget = code.replace("#", "");
          const cleanEvent = parsed.order?.code?.replace("#", "");
          if (cleanTarget === cleanEvent) {
            setOrder(parsed.order);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
      unsubscribeMock();
      window.removeEventListener("storage", handleStorage);
    };
  }, [code]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <RefreshCw className="w-8 h-8 text-forest animate-spin mb-3" />
        <h2 className="font-serif text-lg font-bold text-espresso">Locating Order #{code}...</h2>
        <p className="text-xs text-stone-500 mt-1">Checking live kitchen dispatch system</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="p-4 rounded-full bg-rose-50 text-rose-600 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-xl font-bold text-espresso">Order Not Found</h2>
        <p className="text-xs text-stone-600 mt-2">{error || "Could not find this order."}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-cream-50 text-xs font-bold hover:bg-forest-hover"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);

  // WhatsApp Support Link
  const waSupportLink = `https://wa.me/${DEFAULT_STORE_SETTINGS.whatsapp_number.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    `Halo Kaca Putih, saya ingin menanyakan status pesanan saya dengan kode ${order.code} (${order.customer_name}).`
  )}`;

  return (
    <div className="flex-1 bg-cream-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Back Nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso-muted hover:text-forest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Order More Items</span>
          </Link>

          <button
            type="button"
            onClick={loadOrder}
            className="inline-flex items-center gap-1 text-xs text-forest hover:text-forest-dark font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Live Status Card */}
        <div className="p-6 rounded-3xl bg-white border border-cream-border shadow-floating">
          {/* Header Code & Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-cream-border">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-espresso-subtle block">
                Order Tracking Code
              </span>
              <h1 className="font-mono text-2xl font-black text-forest mt-0.5">
                {order.code}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {order.is_demo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Sandbox Demo</span>
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-forest-subtle text-forest text-xs font-bold uppercase tracking-wider border border-forest-border/40">
                {order.status}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-6">
            <div className="relative flex items-center justify-between mb-2">
              <div
                className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-stone-200 -z-0"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-forest transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStepIdx / (STATUS_STEPS.length - 1)) * 100)}%`,
                  }}
                />
              </div>

              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                        isCurrent
                          ? "bg-forest text-cream-50 ring-4 ring-forest-subtle scale-110"
                          : isPassed
                          ? "bg-forest text-cream-50"
                          : "bg-white text-stone-400 border-2 border-stone-200"
                      }`}
                    >
                      {idx === 0 && <Clock className="w-4 h-4" />}
                      {idx === 1 && <ChefHat className="w-4 h-4" />}
                      {idx === 2 && <BellRing className="w-4 h-4" />}
                      {idx === 3 && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stepper text label for active status */}
            <div className="text-center mt-4">
              <p className="font-serif text-lg font-bold text-espresso">
                {STATUS_STEPS[currentStepIdx]?.label || order.status}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                {STATUS_STEPS[currentStepIdx]?.desc || "Status update"}
              </p>
            </div>
          </div>

          {/* Quick Fulfillment Meta */}
          <div className="p-4 rounded-2xl bg-cream-100/60 border border-cream-border grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                Fulfillment
              </span>
              <span className="font-semibold text-espresso mt-0.5 flex items-center gap-1">
                {order.order_type === "dine_in" ? (
                  <>
                    <Utensils className="w-3 h-3 text-forest" />
                    <span>Table {order.table_number || "Counter"}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3 text-forest" />
                    <span>Takeaway</span>
                  </>
                )}
              </span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                Customer
              </span>
              <span className="font-semibold text-espresso mt-0.5 truncate block">
                {order.customer_name}
              </span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                Payment
              </span>
              <span className="font-semibold text-forest uppercase font-mono mt-0.5 block">
                {order.payment_method}
              </span>
            </div>
          </div>
        </div>

        {/* QRIS Visual Card if payment method is QRIS */}
        {order.payment_method === "qris" && (
          <div className="p-5 rounded-3xl bg-white border border-cream-border shadow-xs flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-3 bg-forest-subtle rounded-2xl text-forest shrink-0">
              <QrCode className="w-16 h-16" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-forest block">
                QRIS Pembayaran
              </span>
              <h3 className="font-serif font-bold text-base text-espresso">
                Scan via GoPay, OVO, BCA, Livin, Dana, ShopeePay
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Total Payable: <strong className="text-forest font-mono">{formatIDR(order.total_amount)}</strong>. Tunjukkan bukti pembayaran ke kasir jika diperlukan.
              </p>
            </div>
          </div>
        )}

        {/* Order Items Breakdown */}
        <div className="p-6 rounded-3xl bg-white border border-cream-border shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-espresso border-b border-cream-border pb-3">
            Ordered Items
          </h2>

          <div className="divide-y divide-stone-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-forest">
                      {item.quantity}x
                    </span>
                    <span className="font-bold text-espresso">{item.product_name}</span>
                  </div>
                  {item.variant_name && (
                    <span className="text-stone-500 text-[11px] block ml-6">
                      Option: {item.variant_name}
                    </span>
                  )}
                  {item.extra_shot && (
                    <span className="text-forest text-[11px] block ml-6 font-medium">
                      +Extra Espresso Shot
                    </span>
                  )}
                  {item.notes && (
                    <span className="text-stone-400 italic text-[11px] block ml-6">
                      Note: "{item.notes}"
                    </span>
                  )}
                </div>

                <span className="font-mono font-bold text-espresso">
                  {formatIDR(item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-cream-border flex items-center justify-between text-sm font-bold text-espresso">
            <span>Total Amount</span>
            <span className="font-mono text-base text-forest">
              {formatIDR(order.total_amount)}
            </span>
          </div>
        </div>

        {/* Help & Support Button */}
        <div className="flex justify-center">
          <a
            href={waSupportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Cafe via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
