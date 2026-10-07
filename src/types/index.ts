export type OrderType = "dine_in" | "takeaway";

export type PaymentMethod = "cash" | "qris" | "card";

export type OrderStatus = "new" | "preparing" | "ready" | "completed" | "cancelled";

export type ShiftType = "morning" | "afternoon"; // morning: 09:00 - 15:30, afternoon: 15:30 - 22:00

export type ShiftStatus = "open" | "closed";

export interface CashierShift {
  id: string;
  cashier_name: string;
  shift_type: ShiftType;
  starting_cash: number;
  actual_cash?: number | null;
  expected_cash?: number | null;
  cash_difference?: number | null;
  total_cash_sales: number;
  total_qris_sales: number;
  total_card_sales: number;
  total_sales: number;
  orders_count: number;
  status: ShiftStatus;
  opened_at: string;
  closed_at?: string | null;
  notes?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id?: string;
  name: string;
  price_delta: number;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  image_url?: string;
  is_signature: boolean;
  is_available: boolean;
  is_daily_bakery: boolean;
  variants?: ProductVariant[];
  created_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  variant_id?: string | null;
  variant_name?: string | null;
  quantity: number;
  unit_price: number;
  notes?: string | null;
  extra_shot?: boolean;
}

export interface Order {
  id: string;
  code: string;
  order_type: OrderType;
  table_number: number | null;
  customer_name: string;
  customer_phone: string;
  notes?: string | null;
  status: OrderStatus;
  payment_method: PaymentMethod;
  total_amount: number;
  cash_tendered?: number | null;
  cash_change?: number | null;
  shift_id?: string | null;
  is_demo: boolean;
  created_at: string;
  items?: OrderItem[];
}

export interface StoreSettings {
  id: string;
  is_ramadan_mode: boolean;
  open_time: string; // '09:00:00'
  close_time: string; // '22:00:00'
  whatsapp_number: string; // '+6282245406501'
  demo_mode_enabled: boolean;
  updated_at?: string;
}

export interface CartItem {
  id: string; // unique hash of product + variant + extra_shot + notes
  product: Product;
  variant?: ProductVariant | null;
  extraShot: boolean;
  notes?: string;
  quantity: number;
  unitPrice: number;
}
