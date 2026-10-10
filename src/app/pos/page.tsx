"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, CashierShift, Order, PaymentMethod } from "@/types";
import { CATEGORIES } from "@/data/menu";
import { fetchAllProducts } from "@/lib/products-store";
import { fetchCurrentShift, recordSaleToShift } from "@/lib/shifts-store";
import { createOrder } from "@/lib/orders-store";
import { formatIDR, formatIDRShort } from "@/lib/utils";
import {
  formatOrderToPlainText,
  printViaRawBT,
  printViaWebBluetooth,
} from "@/lib/thermal-printer";
import { PosPaymentModal } from "@/components/pos/PosPaymentModal";
import { ReceiptPrint } from "@/components/pos/ReceiptPrint";
import { ShiftModal } from "@/components/pos/ShiftModal";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Utensils,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface PosCartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [orderType, setOrderType] = useState<"dine_in" | "takeaway">("dine_in");
  const [tableNumber, setTableNumber] = useState<number | null>(1);
  const [customerName, setCustomerName] = useState<string>("Walk-in");

  // Shift State
  const [activeShift, setActiveShift] = useState<CashierShift | null>(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [allProds, shift] = await Promise.all([
        fetchAllProducts(),
        fetchCurrentShift(),
      ]);
      setProducts(allProds);
      setActiveShift(shift);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        const existing = next[idx];
        if (existing) {
          next[idx] = { ...existing, quantity: existing.quantity + 1 };
        }
        return next;
      }
      return [...prev, { product, quantity: 1, unitPrice: product.base_price }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((i): i is PosCartItem => i !== null)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleClearCart = () => setCart([]);

  const handleCompletePayment = async ({
    paymentMethod,
    cashTendered,
    cashChange,
    printReceipt,
  }: {
    paymentMethod: PaymentMethod;
    cashTendered: number;
    cashChange: number;
    printReceipt: boolean;
  }) => {
    try {
      const orderItems = cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        notes: item.notes || null,
      }));

      const newOrder = await createOrder({
        order_type: orderType,
        table_number: orderType === "dine_in" ? tableNumber : null,
        customer_name: customerName.trim() || "Walk-in",
        customer_phone: "-",
        payment_method: paymentMethod,
        total_amount: totalAmount,
        cash_tendered: cashTendered,
        cash_change: cashChange,
        shift_id: activeShift?.id || null,
        is_demo: false,
        items: orderItems,
      });

      // Record sale to current shift if open
      if (activeShift) {
        await recordSaleToShift(activeShift.id, paymentMethod, totalAmount);
        const refreshedShift = await fetchCurrentShift();
        setActiveShift(refreshedShift);
      }

      setLastCompletedOrder(newOrder);
      setCart([]);
      setIsPaymentModalOpen(false);
      setSuccessToast(`Pesanan ${newOrder.code} berhasil dibayar!`);
      setTimeout(() => setSuccessToast(null), 4000);

      // Trigger thermal print if requested
      if (printReceipt) {
        setTimeout(() => {
          window.print();
        }, 150);
      }
    } catch {
      // ignore
    }
  };

  // Filter products by category & search
  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === "all" || p.category_id === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-espresso flex flex-col font-sans select-none">
      {/* Top POS Header Bar */}
      <header className="h-16 bg-forest text-cream-50 px-4 sm:px-6 flex items-center justify-between gap-4 border-b border-forest-light shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif font-bold text-lg text-cream-50 hover:text-white">
            Kaca Putih POS
          </Link>
          <span className="text-xs px-2 py-0.5 rounded-full bg-forest-dark border border-forest-light text-cream-200">
            Kasir Bunulrejo
          </span>
        </div>

        {/* Shift status & actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/pos/shift"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-dark border border-forest-light text-xs font-semibold hover:bg-forest-light transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${activeShift ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
            <span>
              {activeShift
                ? `Shift ${activeShift.shift_type === "morning" ? "Pagi" : "Siang"}: ${activeShift.cashier_name}`
                : "Kasir Belum Buka Shift"}
            </span>
          </Link>

          {!activeShift && (
            <button
              type="button"
              onClick={() => setIsShiftModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all shadow-xs"
            >
              Buka Shift Kasir
            </button>
          )}

          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-forest-dark/80 text-cream-200 text-xs hover:text-white"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        </div>
      </header>

      {/* Main Touchscreen Layout: 2 Columns (Catalog 65% / Active Cart Panel 35%) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: Catalog Browser */}
        <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Search & Category Pills Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari item cepat..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-forest shadow-xs font-medium"
              />
            </div>

            {/* Category horizontal scrolling buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === "all"
                    ? "bg-forest text-cream-50 shadow-xs"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                Semua Menu ({products.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                    selectedCategory === cat.id
                      ? "bg-forest text-cream-50 shadow-xs"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((p) => {
              const inCartItem = cart.find((i) => i.product.id === p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAddToCart(p)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-95 shadow-xs bg-white relative ${
                    inCartItem
                      ? "border-forest ring-2 ring-forest/30"
                      : "border-stone-200 hover:border-forest/40 hover:shadow-md"
                  }`}
                >
                  {/* Quantity badge if in cart */}
                  {inCartItem && (
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-forest text-cream-50 text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                      {inCartItem.quantity}
                    </span>
                  )}

                  {/* Thumbnail / Illustrated Box */}
                  <div className="relative w-full aspect-square rounded-xl bg-stone-50 overflow-hidden mb-2.5 flex items-center justify-center">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="180px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="font-serif text-lg font-bold text-forest/40">KP</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-xs text-espresso line-clamp-1 leading-snug">
                      {p.name}
                    </h3>
                    <span className="font-mono text-xs font-bold text-forest mt-1 block">
                      {formatIDRShort(p.base_price)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Cart Panel */}
        <div className="w-full lg:w-[380px] xl:w-[420px] bg-white border-t lg:border-t-0 lg:border-l border-stone-200 flex flex-col justify-between shrink-0 shadow-lg">
          {/* Cart Header & Walk-In Options */}
          <div className="p-4 border-b border-stone-200 bg-[#FAF8F5] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-forest" />
                <h2 className="font-serif font-bold text-base text-espresso">
                  Nota Pesanan Aktif
                </h2>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-[11px] text-rose-600 hover:underline font-bold"
                >
                  Kosongkan
                </button>
              )}
            </div>

            {/* Walk-in Fulfillment Toggles */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrderType("dine_in")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === "dine_in"
                    ? "bg-forest text-cream-50 border-forest shadow-xs"
                    : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Makan di Tempat</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType("takeaway")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === "takeaway"
                    ? "bg-forest text-cream-50 border-forest shadow-xs"
                    : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Bungkus (Takeaway)</span>
              </button>
            </div>

            {/* Table & Customer Inputs */}
            <div className="flex items-center gap-2 text-xs">
              {orderType === "dine_in" && (
                <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5">
                  <span className="text-stone-400 font-bold">Meja:</span>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={tableNumber || ""}
                    onChange={(e) => setTableNumber(Number(e.target.value) || null)}
                    className="w-10 text-center font-bold text-espresso focus:outline-none"
                  />
                </div>
              )}
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama pelanggan..."
                className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest font-medium"
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[48vh] lg:max-h-none">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <ShoppingBag className="w-12 h-12 stroke-1 text-stone-300 mb-2" />
                <p className="font-serif font-bold text-sm text-espresso">Keranjang Masih Kosong</p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Ketuk item di sebelah kiri untuk menambahkan pesanan kasir.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-2xl bg-stone-50/70 border border-stone-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 leading-snug">
                    <p className="font-bold text-espresso line-clamp-1">{item.product.name}</p>
                    <p className="font-mono text-[11px] text-stone-500 mt-0.5">
                      {formatIDR(item.unitPrice)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.product.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-espresso hover:bg-stone-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-xs w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.product.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-espresso hover:bg-stone-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer: Summary & Pay Button */}
          <div className="p-4 border-t border-stone-200 bg-[#FAF8F5] space-y-3">
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span>Total Item:</span>
              <span className="font-bold text-espresso">{totalItemsCount} pcs</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-espresso border-t border-stone-200 pt-2">
              <span>Total Tagihan:</span>
              <span className="font-mono text-xl text-forest">{formatIDR(totalAmount)}</span>
            </div>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full py-4 px-4 rounded-2xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span>Bayar Pesanan ({formatIDR(totalAmount)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PosPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={totalAmount}
        onCompletePayment={handleCompletePayment}
      />

      {/* Shift Modal */}
      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        activeShift={activeShift}
        initialMode="open"
        onShiftUpdated={(updated) => setActiveShift(updated)}
      />

      {/* Success Toast Notification */}
      {/* Success Notification with Direct Sharkpos Bluetooth & RawBT Buttons */}
      {successToast && lastCompletedOrder && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-stone-900 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs font-semibold animate-fade-in border border-stone-700 max-w-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => {
                const text = formatOrderToPlainText(lastCompletedOrder);
                printViaRawBT(text);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold"
              title="Cetak langsung via aplikasi RawBT Android"
            >
              RawBT (Sharkpos)
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  const text = formatOrderToPlainText(lastCompletedOrder);
                  await printViaWebBluetooth(text);
                } catch (e) {
                  alert(e instanceof Error ? e.message : "Gagal menghubungkan Bluetooth.");
                }
              }}
              className="px-2.5 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-[11px] font-bold"
              title="Sambungkan printer Bluetooth Sharkpos via Web Bluetooth"
            >
              Direct Bluetooth
            </button>
          </div>
        </div>
      )}

      {/* Hidden Thermal Print Area */}
      <ReceiptPrint order={lastCompletedOrder} />
    </div>
  );
}
