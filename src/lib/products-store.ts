import { Product } from "@/types";
import { PRODUCTS } from "@/data/menu";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "./supabase/client";

const LOCAL_PRODUCTS_KEY = "kp_managed_products";

function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return PRODUCTS;
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(PRODUCTS));
      return PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return PRODUCTS;
  }
}

function saveStoredProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch {
    // ignore
  }
}

// Build image lookup dictionary from local authentic menu data
const LOCAL_IMAGE_MAP = new Map<string, string>();
for (const p of PRODUCTS) {
  if (p.image_url) {
    LOCAL_IMAGE_MAP.set(p.name.toLowerCase().trim(), p.image_url);
    LOCAL_IMAGE_MAP.set(p.slug.toLowerCase().trim(), p.image_url);
  }
}

export async function fetchAllProducts(): Promise<Product[]> {
  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) => {
          const r = row as {
            id: string;
            category_id: string;
            name: string;
            slug: string;
            description?: string | null;
            base_price: number | string;
            image_url?: string | null;
            is_signature: boolean;
            is_available: boolean;
            is_daily_bakery: boolean;
            created_at?: string;
            product_variants?: Array<{
              id: string;
              product_id: string;
              name: string;
              price_delta: number | string;
            }>;
          };

          // Find authentic image fallback if Supabase column is empty/null
          const nameKey = r.name.toLowerCase().trim();
          const slugKey = r.slug.toLowerCase().trim();
          const resolvedImageUrl =
            r.image_url ||
            LOCAL_IMAGE_MAP.get(nameKey) ||
            LOCAL_IMAGE_MAP.get(slugKey) ||
            undefined;

          return {
            id: r.id,
            category_id: r.category_id,
            name: r.name,
            slug: r.slug,
            description: r.description || "",
            base_price: Number(r.base_price),
            image_url: resolvedImageUrl,
            is_signature: Boolean(r.is_signature),
            is_available: Boolean(r.is_available),
            is_daily_bakery: Boolean(r.is_daily_bakery),
            created_at: r.created_at,
            variants: (r.product_variants || []).map((v) => ({
              id: v.id,
              product_id: v.product_id,
              name: v.name,
              price_delta: Number(v.price_delta),
            })),
          };
        });
      }
    } catch {
      // fallback
    }
  }

  return getStoredProducts();
}

export async function createProduct(payload: {
  name: string;
  category_id: string;
  description: string;
  base_price: number;
  image_url?: string;
  is_signature: boolean;
  is_daily_bakery: boolean;
  is_available?: boolean;
}): Promise<Product> {
  const slug = payload.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const newProduct: Product = {
    id: typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: payload.name,
    category_id: payload.category_id,
    slug: `${slug}-${Math.random().toString(36).slice(2, 5)}`,
    description: payload.description,
    base_price: payload.base_price,
    image_url: payload.image_url || undefined,
    is_signature: payload.is_signature,
    is_daily_bakery: payload.is_daily_bakery,
    is_available: payload.is_available ?? true,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("products").insert({
        id: newProduct.id,
        category_id: newProduct.category_id,
        name: newProduct.name,
        slug: newProduct.slug,
        description: newProduct.description,
        base_price: newProduct.base_price,
        image_url: newProduct.image_url,
        is_signature: newProduct.is_signature,
        is_daily_bakery: newProduct.is_daily_bakery,
        is_available: newProduct.is_available,
      });
    } catch {
      // fallback
    }
  }

  const existing = getStoredProducts();
  const updated = [newProduct, ...existing];
  saveStoredProducts(updated);

  return newProduct;
}

export async function updateProduct(
  id: string,
  payload: Partial<Product>
): Promise<Product | null> {
  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const updateData: Record<string, unknown> = {};
      if (payload.name !== undefined) updateData.name = payload.name;
      if (payload.base_price !== undefined) updateData.base_price = payload.base_price;
      if (payload.description !== undefined) updateData.description = payload.description;
      if (payload.image_url !== undefined) updateData.image_url = payload.image_url;
      if (payload.is_available !== undefined) updateData.is_available = payload.is_available;
      if (payload.is_signature !== undefined) updateData.is_signature = payload.is_signature;
      if (payload.is_daily_bakery !== undefined) updateData.is_daily_bakery = payload.is_daily_bakery;

      await supabase.from("products").update(updateData).eq("id", id);
    } catch {
      // fallback
    }
  }

  const list = getStoredProducts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx !== -1) {
    const existing = list[idx];
    if (existing) {
      const updatedItem = { ...existing, ...payload };
      list[idx] = updatedItem;
      saveStoredProducts(list);
      return updatedItem;
    }
  }

  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("products").delete().eq("id", id);
    } catch {
      // fallback
    }
  }

  const list = getStoredProducts();
  const updated = list.filter((p) => p.id !== id);
  saveStoredProducts(updated);

  return true;
}

export async function uploadProductImage(file: File): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `menu/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!uploadError) {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
        return data.publicUrl;
      }
    } catch {
      // fallback
    }
  }

  // Fallback: convert to base64 Data URL for standalone offline / demo mode
  const { promise, resolve } = Promise.withResolvers<string | null>();
  const reader = new FileReader();
  reader.onloadend = () => {
    resolve(typeof reader.result === "string" ? reader.result : null);
  };
  reader.onerror = () => resolve(null);
  reader.readAsDataURL(file);
  return promise;
}
