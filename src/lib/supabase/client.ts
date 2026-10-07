import { createBrowserClient } from "@supabase/ssr";
import { Order } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  supabaseAnonKey.length > 10
);

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured) {
    return null;
  }
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

// Global in-memory broadcast bus for fallback realtime when Supabase keys are not set
type RealtimeCallback = (payload: { eventType: string; new: Order; old?: Order }) => void;
const memorySubscribers = new Set<RealtimeCallback>();

export function subscribeToMockOrders(callback: RealtimeCallback) {
  memorySubscribers.add(callback);
  return () => {
    memorySubscribers.delete(callback);
  };
}

export function broadcastMockOrderChange(eventType: "INSERT" | "UPDATE", order: Order) {
  memorySubscribers.forEach((cb) => {
    try {
      cb({ eventType, new: order });
    } catch {
      // ignore listener error
    }
  });

  // Also broadcast across browser tabs via window storage event if in browser
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("kp_last_order_event", JSON.stringify({ eventType, order, timestamp: Date.now() }));
    } catch {
      // ignore storage error
    }
  }
}
