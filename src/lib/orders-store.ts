import { Order, OrderStatus } from "@/types";
import { getSupabaseBrowserClient, isSupabaseConfigured, broadcastMockOrderChange } from "./supabase/client";
import { generateOrderCode } from "./utils";

const LOCAL_STORAGE_KEY = "kacaputih_orders";

interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name?: string;
  variant_id?: string | null;
  quantity: number;
  unit_price: number | string;
  notes?: string | null;
}

interface DbOrder extends Order {
  order_items?: DbOrderItem[];
}

const INITIAL_BENCHMARK_ORDERS: Order[] = [
  {
    id: "30000000-0000-0000-0000-000000000001",
    code: "#KP-1001",
    order_type: "dine_in",
    table_number: 4,
    customer_name: "Budi Santoso",
    customer_phone: "+6281234567890",
    notes: "Less ice on Mont Blanc",
    status: "completed",
    payment_method: "qris",
    total_amount: 59000,
    is_demo: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: "prod-mont-blanc",
        product_name: "Mont Blanc",
        quantity: 1,
        unit_price: 30000,
        notes: "Less ice",
      },
      {
        product_id: "prod-nasi-goreng-rendang",
        product_name: "Nasi Goreng Rendang",
        quantity: 1,
        unit_price: 29000,
        notes: "Medium spicy",
      },
    ],
  },
  {
    id: "30000000-0000-0000-0000-000000000002",
    code: "#KP-1002",
    order_type: "takeaway",
    table_number: null,
    customer_name: "Siti Rahma",
    customer_phone: "+6285712345678",
    notes: "Pack bakery separately",
    status: "preparing",
    payment_method: "cash",
    total_amount: 40000,
    is_demo: false,
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: "prod-salt-bread",
        product_name: "Japanese Salt Bread (Shio Pan)",
        variant_id: "var-sb-smoked-beef",
        variant_name: "Smoked Beef Mozarella",
        quantity: 1,
        unit_price: 22000,
      },
      {
        product_id: "prod-donat",
        product_name: "Donat Kampung",
        variant_id: "var-donat-icing",
        variant_name: "Icing Sugar",
        quantity: 1,
        unit_price: 18000,
      },
    ],
  },
  {
    id: "30000000-0000-0000-0000-000000000003",
    code: "#KP-DEMO-99",
    order_type: "dine_in",
    table_number: 12,
    customer_name: "Portfolio Reviewer",
    customer_phone: "+6289999999999",
    notes: "Demo test order",
    status: "new",
    payment_method: "qris",
    total_amount: 54000,
    is_demo: true,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: "prod-dirty-latte",
        product_name: "Dirty Latte",
        quantity: 1,
        unit_price: 32000,
      },
      {
        product_id: "prod-cinnamon-roll",
        product_name: "Cinnamon Roll",
        variant_id: "var-cr-classic",
        variant_name: "Classic Glaze",
        quantity: 1,
        unit_price: 22000,
      },
    ],
  },
];

function getStoredOrders(): Order[] {
  if (typeof window === "undefined") {
    return INITIAL_BENCHMARK_ORDERS;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_BENCHMARK_ORDERS));
      return INITIAL_BENCHMARK_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BENCHMARK_ORDERS;
  }
}

function saveStoredOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return (data as unknown as DbOrder[]).map((row) => ({
          ...row,
          items: (row.order_items || []).map((it) => ({
            id: it.id,
            order_id: it.order_id,
            product_id: it.product_id,
            product_name: it.product_name || "Item",
            variant_id: it.variant_id,
            variant_name: it.notes?.includes("Variant:")
              ? it.notes.split("Variant:")[1]?.split(",")[0]?.trim()
              : null,
            quantity: it.quantity,
            unit_price: Number(it.unit_price),
            notes: it.notes,
          })),
        }));
      }
    } catch {
      // fallback to local storage
    }
  }

  return getStoredOrders();
}

export async function fetchOrderByCode(code: string): Promise<Order | null> {
  const supabase = getSupabaseBrowserClient();
  const normalizedCode = code.startsWith("#") ? code : `#${code}`;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("code", normalizedCode)
        .single();

      if (!error && data) {
        const orderRow = data as unknown as DbOrder;
        return {
          ...orderRow,
          items: (orderRow.order_items || []).map((it) => ({
            id: it.id,
            order_id: it.order_id,
            product_id: it.product_id,
            product_name: it.product_name || "Item",
            variant_id: it.variant_id,
            variant_name: it.notes?.includes("Variant:")
              ? it.notes.split("Variant:")[1]?.split(",")[0]?.trim()
              : null,
            quantity: it.quantity,
            unit_price: Number(it.unit_price),
            notes: it.notes,
          })),
        };
      }
    } catch {
      // fallback to local
    }
  }

  const list = getStoredOrders();
  return list.find((o) => o.code.toUpperCase() === normalizedCode.toUpperCase()) || null;
}

export async function createOrder(
  payload: Omit<Order, "id" | "code" | "created_at" | "status"> & { is_demo?: boolean }
): Promise<Order> {
  const isDemo = Boolean(payload.is_demo);
  const code = generateOrderCode(isDemo);
  const newOrder: Order = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    code,
    order_type: payload.order_type,
    table_number: payload.table_number,
    customer_name: payload.customer_name,
    customer_phone: payload.customer_phone,
    notes: payload.notes || null,
    status: "new",
    payment_method: payload.payment_method,
    total_amount: payload.total_amount,
    cash_tendered: payload.cash_tendered || null,
    cash_change: payload.cash_change || null,
    shift_id: payload.shift_id || null,
    is_demo: isDemo,
    created_at: new Date().toISOString(),
    items: payload.items || [],
  };
  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase && !isDemo) {
    try {
      const { data: insertedOrder, error: orderErr } = await supabase
        .from("orders")
        .insert({
          id: newOrder.id,
          code: newOrder.code,
          order_type: newOrder.order_type,
          table_number: newOrder.table_number,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          notes: newOrder.notes,
          status: newOrder.status,
          payment_method: newOrder.payment_method,
          total_amount: newOrder.total_amount,
          cash_tendered: newOrder.cash_tendered,
          cash_change: newOrder.cash_change,
          shift_id: newOrder.shift_id,
          is_demo: newOrder.is_demo,
        })
        .single();

      if (!orderErr && insertedOrder) {
        if (newOrder.items && newOrder.items.length > 0) {
          const itemPayloads = newOrder.items.map((it) => ({
            order_id: newOrder.id,
            product_id: it.product_id,
            variant_id: it.variant_id || null,
            quantity: it.quantity,
            unit_price: it.unit_price,
            notes: [
              it.variant_name ? `Variant: ${it.variant_name}` : null,
              it.extra_shot ? "Extra Shot" : null,
              it.notes ? `Note: ${it.notes}` : null,
            ]
              .filter(Boolean)
              .join(", ") || null,
          }));

          await supabase.from("order_items").insert(itemPayloads);
        }
      }
    } catch {
      // ignore, fallback local
    }
  }

  const existing = getStoredOrders();
  const updated = [newOrder, ...existing];
  saveStoredOrders(updated);
  broadcastMockOrderChange("INSERT", newOrder);

  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  nextStatus: OrderStatus
): Promise<Order | null> {
  const supabase = getSupabaseBrowserClient();
  let updatedOrder: Order | null = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: nextStatus })
        .eq("id", orderId)
        .select("*, order_items(*)")
        .single();

      if (!error && data) {
        const orderRow = data as unknown as DbOrder;
        updatedOrder = {
          ...orderRow,
          items: (orderRow.order_items || []).map((it) => ({
            id: it.id,
            order_id: it.order_id,
            product_id: it.product_id,
            product_name: it.product_name || "Item",
            variant_id: it.variant_id,
            quantity: it.quantity,
            unit_price: Number(it.unit_price),
            notes: it.notes,
          })),
        };
      }
    } catch {
      // fallback to local
    }
  }

  const list = getStoredOrders();
  const idx = list.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    const existing = list[idx];
    if (existing) {
      existing.status = nextStatus;
      saveStoredOrders(list);
      updatedOrder = existing;
      broadcastMockOrderChange("UPDATE", existing);
    }
  }

  return updatedOrder;
}
