"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, Sparkles, Utensils, ShoppingBag } from "lucide-react";
import { StoreSettings } from "@/types";
import { DEFAULT_STORE_SETTINGS } from "@/data/menu";
import { checkStoreStatus, getWIBTimeStrings } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { Logo } from "@/components/brand/Logo";

interface StoreHeaderProps {
  settings?: StoreSettings;
}

export function StoreHeader({ settings = DEFAULT_STORE_SETTINGS }: StoreHeaderProps) {
  const [currentTimeWIB, setCurrentTimeWIB] = useState<string>("09:00:00 WIB");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [scheduleDesc, setScheduleDesc] = useState<string>("");
  const [isRamadan, setIsRamadan] = useState<boolean>(false);

  const orderType = useCartStore((s) => s.orderType);
  const setOrderType = useCartStore((s) => s.setOrderType);
  const tableNumber = useCartStore((s) => s.tableNumber);
  const setTableNumber = useCartStore((s) => s.setTableNumber);

  useEffect(() => {
    function updateClock() {
      const { timeStr } = getWIBTimeStrings();
      const status = checkStoreStatus(settings);
      setCurrentTimeWIB(`${timeStr} WIB`);
      setIsOpen(status.isOpen);
      setScheduleDesc(status.schedule);
      setIsRamadan(status.isRamadan);
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [settings]);

  return (
    <header className="relative w-full overflow-hidden bg-forest text-cream-50 pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-forest-light/40 shadow-glass">
      {/* Subtle architectural arched greenhouse grid background overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#F7F5F0_1px,transparent_1px)] [background-size:16px_16px]"
        aria-hidden="true"
      />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-forest-light/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#3d7a5a]/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center">
        {/* Brand Emblem & Header Typography */}
        <div className="mb-4">
          <Logo variant="full" size="lg" light />
        </div>

        {/* Location & Tagline */}
        <div className="flex items-center gap-2 text-xs text-cream-200/90 font-medium tracking-wide mb-5">
          <MapPin className="w-3.5 h-3.5 text-cream-300" />
          <span>Jl. Kaca Putih, Malang, Jawa Timur</span>
          <span className="text-cream-300/60">•</span>
          <span>Artisanal Cafe & Bakery</span>
        </div>

        {/* Live WIB Clock & Operational Hours Badge */}
        <div className="w-full max-w-md flex flex-wrap items-center justify-center gap-2.5 p-2.5 rounded-2xl bg-forest-dark/70 border border-forest-light/40 backdrop-blur-md shadow-inner text-xs">
          {/* Status Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-light/80 border border-forest-border/30">
            <span
              className={`w-2 h-2 rounded-full ${
                isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
              }`}
            />
            <span className="font-semibold tracking-wider uppercase text-[11px] text-cream-50">
              {isOpen ? "Open Now" : "Closed"}
            </span>
          </div>

          {/* Real-time WIB Clock */}
          <div className="flex items-center gap-1.5 text-cream-100 font-mono tracking-tight text-[12px] px-2 py-0.5">
            <Clock className="w-3.5 h-3.5 text-cream-300" />
            <span className="font-semibold">{currentTimeWIB}</span>
          </div>

          {/* Schedule pill */}
          <div className="text-[11px] text-cream-200/80 px-2">
            {scheduleDesc}
          </div>
        </div>

        {isRamadan && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-medium">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Ramadan Special Schedule Active (12:00 – 23:00 WIB)</span>
          </div>
        )}

        {/* Fulfillment Mode Toggle: Dine In (Table detected) vs Takeaway */}
        <div className="mt-6 w-full max-w-sm flex items-center p-1 rounded-xl bg-forest-dark/90 border border-forest-light/60 shadow-md">
          <button
            type="button"
            onClick={() => setOrderType("dine_in")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
              orderType === "dine_in"
                ? "bg-cream-100 text-forest shadow-sm font-bold"
                : "text-cream-200 hover:text-cream-50"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Dine In {tableNumber ? `(Table ${tableNumber})` : ""}</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderType("takeaway")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
              orderType === "takeaway"
                ? "bg-cream-100 text-forest shadow-sm font-bold"
                : "text-cream-200 hover:text-cream-50"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Takeaway Pickup</span>
          </button>
        </div>

        {/* If Dine In and no table number is set, provide quick table input */}
        {orderType === "dine_in" && (
          <div className="mt-2.5 flex items-center gap-2 text-xs text-cream-200/90">
            <span>Table Number:</span>
            <input
              type="number"
              min="1"
              max="99"
              value={tableNumber || ""}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value, 10) : null;
                setTableNumber(val);
              }}
              placeholder="e.g. 5"
              className="w-16 px-2 py-1 text-center bg-forest-dark border border-forest-light/60 rounded-md text-cream-50 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cream-300 placeholder:text-cream-300/40"
            />
            {tableNumber ? (
              <span className="text-emerald-300 text-[11px] font-medium">Auto-assigned</span>
            ) : (
              <span className="text-amber-200 text-[11px]">Enter number or scan QR</span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
