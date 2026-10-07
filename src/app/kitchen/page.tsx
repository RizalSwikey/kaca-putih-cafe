"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  ChefHat,
  Volume2,
  VolumeX,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Utensils,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { fetchAllOrders, updateOrderStatus } from "@/lib/orders-store";
import { formatIDR } from "@/lib/utils";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
  subscribeToMockOrders,
} from "@/lib/supabase/client";

// Sound synthesizer using standard Web Audio API (zero external assets required)
function playKitchenChime() {
  if (typeof window === "undefined") return;
  try {
    const win = window as Window & { webkitAudioContext?: typeof AudioContext };
    const AudioContextClass = window.AudioContext || win.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic two-tone doorbell chime: F5 (698.46Hz) followed by A5 (880Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    // Frequency sequence
    osc1.frequency.setValueAtTime(698.46, now);
    osc1.frequency.setValueAtTime(880, now + 0.18);

    osc2.frequency.setValueAtTime(698.46 * 1.5, now);
    osc2.frequency.setValueAtTime(880 * 1.5, now + 0.18);

    // Envelope
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.15, now + 0.18);
    gainNode.gain.exponentialRampToValueAtTime(0.4, now + 0.22);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.95);
    osc2.stop(now + 0.95);
  } catch {
    // AudioContext might be blocked until user gesture
  }
}

function getElapsedMinutes(createdAt: string): number {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60)));
}

function formatElapsedTime(createdAt: string): { text: string; isUrgent: boolean; isWarning: boolean } {
  const mins = getElapsedMinutes(createdAt);
  if (mins < 1) return { text: "Just now", isUrgent: false, isWarning: false };
  if (mins >= 25) return { text: `${mins}m ago`, isUrgent: true, isWarning: false };
  if (mins >= 15) return { text: `${mins}m ago`, isUrgent: false, isWarning: true };
  return { text: `${mins}m ago`, isUrgent: false, isWarning: false };
}

const COLUMNS: Array<{ status: OrderStatus; title: string; color: string; badgeBg: string }> = [
  { status: "new", title: "New Orders", color: "border-sky-500", badgeBg: "bg-sky-100 text-sky-900" },
  { status: "preparing", title: "Preparing", color: "border-amber-500", badgeBg: "bg-amber-100 text-amber-900" },
  { status: "ready", title: "Ready to Serve", color: "border-emerald-500", badgeBg: "bg-emerald-100 text-emerald-900" },
  { status: "completed", title: "Completed", color: "border-stone-400", badgeBg: "bg-stone-200 text-stone-700" },
];

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  // Audio sound state
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const loadAllOrders = useCallback(async () => {
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch {
      // ignore
    }
  }, []);

  // Poll elapsed time every 30s to keep elapsed indicators active
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAllOrders();

    // 1. Supabase Realtime Listener
    const supabase = getSupabaseBrowserClient();
    let channel: any = null;

    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel("kitchen-orders-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
          },
          (payload: any) => {
            if (payload.eventType === "INSERT") {
              if (soundEnabledRef.current) {
                playKitchenChime();
              }
            }
            loadAllOrders();
          }
        )
        .subscribe();
    }

    // 2. Mock and local storage Realtime listener
    const unsubscribeMock = subscribeToMockOrders((payload) => {
      if (payload.eventType === "INSERT" && soundEnabledRef.current) {
        playKitchenChime();
      }
      loadAllOrders();
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "kp_last_order_event" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.eventType === "INSERT" && soundEnabledRef.current) {
            playKitchenChime();
          }
          loadAllOrders();
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
  }, [loadAllOrders]);

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    await updateOrderStatus(orderId, nextStatus);
  };

  const nextStepMap: Record<OrderStatus, OrderStatus | null> = {
    new: "preparing",
    preparing: "ready",
    ready: "completed",
    completed: null,
    cancelled: null,
  };

  const prevStepMap: Record<OrderStatus, OrderStatus | null> = {
    new: null,
    preparing: "new",
    ready: "preparing",
    completed: "ready",
    cancelled: null,
  };

  return (
    <div className="flex-1 bg-stone-900 text-stone-100 flex flex-col min-h-screen">
      {/* KDS Header Bar */}
      <div className="bg-stone-950 border-b border-stone-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-forest text-cream-50">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-white tracking-wide">
              Kaca Putih — Kitchen Display System (KDS)
            </h1>
            <p className="text-[11px] text-stone-400">
              Live Realtime Kanban • Malang Central Kitchen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Chime Controller */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playKitchenChime();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              soundEnabled
                ? "bg-emerald-950/80 border-emerald-600 text-emerald-300"
                : "bg-stone-800 border-stone-700 text-stone-400"
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Chime Active</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Muted</span>
              </>
            )}
          </button>

          {/* Test Sound */}
          <button
            type="button"
            onClick={playKitchenChime}
            className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700"
            title="Test Audio Chime"
          >
            Test Chime
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={loadAllOrders}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest hover:bg-forest-light text-cream-50 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[900px] h-full items-start">
          {COLUMNS.map((col) => {
            const columnOrders = orders.filter((o) => o.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-stone-950/70 border border-stone-800 rounded-2xl flex flex-col max-h-[85vh] overflow-hidden"
              >
                {/* Column Header */}
                <div
                  className={`p-3.5 border-b border-stone-800 border-t-4 ${col.color} bg-stone-900/60 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif font-bold text-sm text-white">{col.title}</h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${col.badgeBg}`}
                    >
                      {columnOrders.length}
                    </span>
                  </div>
                </div>

                {/* Tickets Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {columnOrders.length === 0 ? (
                    <div className="p-8 text-center text-stone-500 text-xs italic">
                      No tickets in {col.title.toLowerCase()}
                    </div>
                  ) : (
                    columnOrders.map((ord) => {
                      const elapsed = formatElapsedTime(ord.created_at);
                      const nextStatus = nextStepMap[ord.status];
                      const prevStatus = prevStepMap[ord.status];

                      return (
                        <div
                          key={ord.id}
                          className="p-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 shadow-md space-y-3 transition-all"
                        >
                          {/* Ticket Header */}
                          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-stone-800">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-base font-black text-amber-400">
                                  {ord.code}
                                </span>
                                {ord.is_demo && (
                                  <span className="p-0.5 rounded bg-amber-900 text-amber-300 text-[9px] font-bold">
                                    <Sparkles className="w-2.5 h-2.5 inline mr-0.5" />
                                    DEMO
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-semibold text-stone-300 block truncate max-w-[140px]">
                                {ord.customer_name}
                              </span>
                            </div>

                            {/* Elapsed Time SLA Pill */}
                            <div
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${
                                elapsed.isUrgent
                                  ? "bg-rose-950 text-rose-300 border border-rose-800 animate-pulse"
                                  : elapsed.isWarning
                                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                                  : "bg-stone-800 text-stone-300"
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              <span>{elapsed.text}</span>
                            </div>
                          </div>

                          {/* Fulfillment & Payment */}
                          <div className="flex items-center justify-between text-xs text-stone-400">
                            <span className="flex items-center gap-1 font-semibold text-stone-200">
                              {ord.order_type === "dine_in" ? (
                                <>
                                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Table {ord.table_number || "Counter"}</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
                                  <span>Takeaway</span>
                                </>
                              )}
                            </span>
                            <span className="font-mono uppercase font-bold text-[11px] text-stone-300">
                              {ord.payment_method}
                            </span>
                          </div>

                          {/* Order Items List */}
                          <div className="space-y-1.5 pt-1">
                            {ord.items?.map((item, i) => (
                              <div
                                key={i}
                                className="text-xs flex items-start justify-between gap-2"
                              >
                                <div className="leading-snug">
                                  <span className="font-mono font-bold text-amber-300 mr-1.5">
                                    {item.quantity}x
                                  </span>
                                  <span className="font-semibold text-stone-100">
                                    {item.product_name}
                                  </span>
                                  {item.variant_name && (
                                    <span className="text-[11px] text-stone-400 block ml-5">
                                      • {item.variant_name}
                                    </span>
                                  )}
                                  {item.extra_shot && (
                                    <span className="text-[11px] text-emerald-400 block ml-5">
                                      • +Extra Espresso Shot
                                    </span>
                                  )}
                                  {item.notes && (
                                    <span className="text-[11px] text-amber-200/90 italic block ml-5">
                                      "{item.notes}"
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Customer General Notes */}
                          {ord.notes && (
                            <div className="p-2 rounded-lg bg-stone-800/80 border border-stone-700/60 text-[11px] text-amber-300 italic">
                              <span className="font-bold not-italic">Note:</span> {ord.notes}
                            </div>
                          )}

                          {/* Total amount */}
                          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
                            <span className="text-stone-400">Total:</span>
                            <span className="font-mono font-bold text-stone-200">
                              {formatIDR(ord.total_amount)}
                            </span>
                          </div>

                          {/* Card Action Controls: Advance or Move back */}
                          <div className="pt-1 flex items-center gap-1.5">
                            {prevStatus && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(ord.id, prevStatus)}
                                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
                                title={`Move back to ${prevStatus}`}
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {nextStatus ? (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(ord.id, nextStatus)}
                                className="flex-1 py-2 px-3 rounded-lg bg-forest hover:bg-forest-light text-cream-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
                              >
                                <span>
                                  {nextStatus === "preparing"
                                    ? "Start Prep"
                                    : nextStatus === "ready"
                                    ? "Mark Ready"
                                    : "Complete"}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <div className="flex-1 text-center py-1.5 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Order Fulfilled</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
