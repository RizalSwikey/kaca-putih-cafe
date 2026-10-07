import { CashierShift, ShiftType } from "@/types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "./supabase/client";

const LOCAL_SHIFTS_KEY = "kp_cashier_shifts";
const LOCAL_ACTIVE_SHIFT_KEY = "kp_active_shift_id";

function getStoredShifts(): CashierShift[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_SHIFTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredShifts(shifts: CashierShift[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_SHIFTS_KEY, JSON.stringify(shifts));
  } catch {
    // ignore
  }
}

export async function fetchCurrentShift(): Promise<CashierShift | null> {
  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("cashier_shifts")
        .select("*")
        .eq("status", "open")
        .order("opened_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          starting_cash: Number(data.starting_cash),
          actual_cash: data.actual_cash ? Number(data.actual_cash) : null,
          expected_cash: data.expected_cash ? Number(data.expected_cash) : null,
          cash_difference: data.cash_difference ? Number(data.cash_difference) : null,
          total_cash_sales: Number(data.total_cash_sales),
          total_qris_sales: Number(data.total_qris_sales),
          total_card_sales: Number(data.total_card_sales),
          total_sales: Number(data.total_sales),
        };
      }
    } catch {
      // fallback local
    }
  }

  const shifts = getStoredShifts();
  return shifts.find((s) => s.status === "open") || null;
}

export async function fetchShiftById(shiftId: string): Promise<CashierShift | null> {
  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("cashier_shifts")
        .select("*")
        .eq("id", shiftId)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          starting_cash: Number(data.starting_cash),
          actual_cash: data.actual_cash ? Number(data.actual_cash) : null,
          expected_cash: data.expected_cash ? Number(data.expected_cash) : null,
          cash_difference: data.cash_difference ? Number(data.cash_difference) : null,
          total_cash_sales: Number(data.total_cash_sales),
          total_qris_sales: Number(data.total_qris_sales),
          total_card_sales: Number(data.total_card_sales),
          total_sales: Number(data.total_sales),
        };
      }
    } catch {
      // fallback
    }
  }

  const shifts = getStoredShifts();
  return shifts.find((s) => s.id === shiftId) || null;
}

export async function openShift(payload: {
  cashier_name: string;
  shift_type: ShiftType;
  starting_cash: number;
  notes?: string;
}): Promise<CashierShift> {
  const newShift: CashierShift = {
    id: typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `shift-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    cashier_name: payload.cashier_name,
    shift_type: payload.shift_type,
    starting_cash: Number(payload.starting_cash),
    actual_cash: null,
    expected_cash: Number(payload.starting_cash),
    cash_difference: null,
    total_cash_sales: 0,
    total_qris_sales: 0,
    total_card_sales: 0,
    total_sales: 0,
    orders_count: 0,
    status: "open",
    opened_at: new Date().toISOString(),
    closed_at: null,
    notes: payload.notes || null,
  };

  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("cashier_shifts").insert({
        id: newShift.id,
        cashier_name: newShift.cashier_name,
        shift_type: newShift.shift_type,
        starting_cash: newShift.starting_cash,
        status: newShift.status,
        notes: newShift.notes,
        opened_at: newShift.opened_at,
      });
    } catch {
      // fallback
    }
  }

  const shifts = getStoredShifts();
  const updated = [newShift, ...shifts];
  saveStoredShifts(updated);
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_ACTIVE_SHIFT_KEY, newShift.id);
  }

  return newShift;
}

export async function recordSaleToShift(
  shiftId: string,
  paymentMethod: "cash" | "qris" | "card",
  amount: number
): Promise<CashierShift | null> {
  const shifts = getStoredShifts();
  const shift = shifts.find((s) => s.id === shiftId && s.status === "open");

  if (shift) {
    if (paymentMethod === "cash") {
      shift.total_cash_sales += amount;
    } else if (paymentMethod === "qris") {
      shift.total_qris_sales += amount;
    } else if (paymentMethod === "card") {
      shift.total_card_sales += amount;
    }
    shift.total_sales += amount;
    shift.orders_count += 1;
    shift.expected_cash = shift.starting_cash + shift.total_cash_sales;

    saveStoredShifts(shifts);

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("cashier_shifts")
          .update({
            total_cash_sales: shift.total_cash_sales,
            total_qris_sales: shift.total_qris_sales,
            total_card_sales: shift.total_card_sales,
            total_sales: shift.total_sales,
            orders_count: shift.orders_count,
            expected_cash: shift.expected_cash,
          })
          .eq("id", shiftId);
      } catch {
        // fallback
      }
    }
    return shift;
  }

  return null;
}

export async function closeShift(
  shiftId: string,
  actualCash: number,
  notes?: string
): Promise<CashierShift | null> {
  const shifts = getStoredShifts();
  const shift = shifts.find((s) => s.id === shiftId);

  if (!shift) return null;

  const expectedCash = shift.starting_cash + shift.total_cash_sales;
  const difference = actualCash - expectedCash;

  shift.actual_cash = actualCash;
  shift.expected_cash = expectedCash;
  shift.cash_difference = difference;
  shift.status = "closed";
  shift.closed_at = new Date().toISOString();
  if (notes) shift.notes = notes;

  saveStoredShifts(shifts);
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_ACTIVE_SHIFT_KEY);
  }

  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("cashier_shifts")
        .update({
          actual_cash: shift.actual_cash,
          expected_cash: shift.expected_cash,
          cash_difference: shift.cash_difference,
          status: "closed",
          closed_at: shift.closed_at,
          notes: shift.notes,
        })
        .eq("id", shiftId);
    } catch {
      // fallback
    }
  }

  return shift;
}

export async function fetchShiftHistory(): Promise<CashierShift[]> {
  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("cashier_shifts")
        .select("*")
        .order("opened_at", { ascending: false });

      if (!error && data) {
        return data.map((d: any) => ({
          ...d,
          starting_cash: Number(d.starting_cash),
          actual_cash: d.actual_cash ? Number(d.actual_cash) : null,
          expected_cash: d.expected_cash ? Number(d.expected_cash) : null,
          cash_difference: d.cash_difference ? Number(d.cash_difference) : null,
          total_cash_sales: Number(d.total_cash_sales),
          total_qris_sales: Number(d.total_qris_sales),
          total_card_sales: Number(d.total_card_sales),
          total_sales: Number(d.total_sales),
        }));
      }
    } catch {
      // fallback
    }
  }

  return getStoredShifts();
}
