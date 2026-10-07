import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, OrderType } from "@/types";

interface CartState {
  items: CartItem[];
  orderType: OrderType;
  tableNumber: number | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isDemoMode: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (table: number | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsDemoMode: (demo: boolean) => void;

  // Computed helpers
  getTotalCount: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: "dine_in",
      tableNumber: null,
      isCartOpen: false,
      isCheckoutOpen: false,
      isDemoMode: false,

      addItem: (newItem) => {
        const variantKey = newItem.variant?.id || "default";
        const extraKey = newItem.extraShot ? "shot" : "noshot";
        const notesKey = (newItem.notes || "").trim().toLowerCase();
        const id = `${newItem.product.id}-${variantKey}-${extraKey}-${notesKey}`;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === id);
          if (existingIndex > -1) {
            const nextItems = [...state.items];
            const current = nextItems[existingIndex];
            if (current) {
              nextItems[existingIndex] = {
                ...current,
                quantity: current.quantity + newItem.quantity,
              };
            }
            return { items: nextItems, isCartOpen: true };
          }
          return {
            items: [...state.items, { ...newItem, id }],
            isCartOpen: true,
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, delta) => {
        set((state) => {
          const nextItems = state.items
            .map((item) => {
              if (item.id === id) {
                const nextQty = item.quantity + delta;
                return nextQty > 0 ? { ...item, quantity: nextQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);

          return { items: nextItems };
        });
      },

      clearCart: () => set({ items: [] }),

      setOrderType: (type) => set({ orderType: type }),

      setTableNumber: (table) => set({ tableNumber: table }),

      setIsCartOpen: (open) => set({ isCartOpen: open }),

      setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),

      setIsDemoMode: (demo) => set({ isDemoMode: demo }),

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },
    }),
    {
      name: "kp_cart_storage",
      partialize: (state) => ({
        items: state.items,
        orderType: state.orderType,
        tableNumber: state.tableNumber,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
);
