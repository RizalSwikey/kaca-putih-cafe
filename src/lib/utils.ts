import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Order, StoreSettings } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatIDRShort(amount: number): string {
  if (amount >= 1000) {
    const k = amount / 1000;
    return `${k}K`;
  }
  return `${amount}`;
}

export function generateOrderCode(isDemo: boolean = false): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return isDemo ? `#KP-DEMO-${random}` : `#KP-${random}`;
}

export function getWIBDate(inputDate?: Date): Date {
  const date = inputDate || new Date();
  // Get current time formatted to Asia/Jakarta
  const jakartaString = date.toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  return new Date(jakartaString);
}

export function getWIBTimeStrings(): {
  timeStr: string;
  hour: number;
  minute: number;
  isOpen: boolean;
  scheduleText: string;
} {
  const now = new Date();
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const timeStr = timeFormatter.format(now);
  const [hourStr = "0", minStr = "0"] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);

  return {
    timeStr,
    hour,
    minute,
    isOpen: true,
    scheduleText: "",
  };
}

export function checkStoreStatus(settings: StoreSettings): {
  isOpen: boolean;
  statusLabel: string;
  schedule: string;
  isRamadan: boolean;
} {
  const { hour } = getWIBTimeStrings();
  const isRamadan = settings.is_ramadan_mode;

  // Regular: 09:00 - 22:00
  // Ramadan: 12:00 - 23:00
  const openHour = isRamadan ? 12 : 9;
  const closeHour = isRamadan ? 23 : 22;

  const isOpen = hour >= openHour && hour < closeHour;

  return {
    isOpen,
    statusLabel: isOpen ? "Open Now" : "Closed",
    schedule: isRamadan ? "12:00 – 23:00 WIB (Ramadan Hours)" : "09:00 – 22:00 WIB (Regular)",
    isRamadan,
  };
}

export function buildWhatsAppMessage(order: Order, storePhone: string): string {
  const cleanPhone = storePhone.replace(/[^0-9]/g, "");
  const orderTypeLabel = order.order_type === "dine_in"
    ? `Dine In (Table ${order.table_number || "-"})`
    : "Takeaway (Counter Pickup)";

  let itemsText = "";
  if (order.items && order.items.length > 0) {
    itemsText = order.items
      .map((item, idx) => {
        let details = "";
        if (item.variant_name) details += ` (${item.variant_name})`;
        if (item.extra_shot) details += " [+Extra Shot]";
        if (item.notes) details += ` [Note: ${item.notes}]`;
        return `${idx + 1}. *${item.quantity}x ${item.product_name}*${details} — ${formatIDR(item.unit_price * item.quantity)}`;
      })
      .join("\n");
  }

  const rawMessage = `*KACA PUTIH CAFE & KITCHEN*
*NEW ORDER NOTIFICATION*
----------------------------------------
*Order Code:* ${order.code}
*Order Type:* ${orderTypeLabel}
*Customer:* ${order.customer_name} (${order.customer_phone})
*Payment:* ${order.payment_method.toUpperCase()}
${order.notes ? `*Customer Note:* ${order.notes}\n` : ""}----------------------------------------
*ORDER ITEMS:*
${itemsText}
----------------------------------------
*TOTAL AMOUNT:* *${formatIDR(order.total_amount)}*
----------------------------------------
_This order was dispatched via Kaca Putih Web Platform._
_Please confirm this order. Thank you!_`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rawMessage)}`;
}
