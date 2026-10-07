export type OrderType = "dine_in" | "takeaway";

export type PaymentMethod = "cash" | "qris" | "card";

export type OrderStatus = "new" | "preparing" | "ready" | "completed" | "cancelled";

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
