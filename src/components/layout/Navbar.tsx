"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Sparkles,
  Menu as MenuIcon,
  X,
  ChefHat,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useCartStore } from "@/lib/cart-store";
import { formatIDRShort } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const totalCount = useCartStore((s) => s.getTotalCount());
  const totalAmount = useCartStore((s) => s.getTotalAmount());
  const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
  const isDemoMode = useCartStore((s) => s.isDemoMode);
  const setIsDemoMode = useCartStore((s) => s.setIsDemoMode);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        const topOffset = el.offsetTop - 80;
        window.scrollTo({ top: topOffset, behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF8F5]/90 border-b border-cream-border transition-all">
      {/* Persistent Recruiter Demo Mode Banner when active */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-100 px-4 py-1.5 text-center text-xs font-medium flex items-center justify-center gap-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>
            <strong>Recruiter Sandbox Aktif:</strong> Simulasi pesanan aman tanpa mengirim WhatsApp asli atau merubah data toko.
          </span>
          <button
            type="button"
            onClick={() => setIsDemoMode(false)}
            className="ml-2 underline text-[11px] text-amber-200 hover:text-white"
          >
            Matikan
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Home Link (Authentic Kaca Putih Logo) */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <Logo variant="horizontal" size="sm" />
        </Link>

        {/* Desktop Customer-First Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wide">
          <button
            type="button"
            onClick={() => handleNavClick("menu-catalog")}
            className="text-espresso hover:text-forest transition-colors uppercase tracking-wider py-1 font-bold"
          >
            Menu Lengkap
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("khas-kaca-putih")}
            className="text-espresso-muted hover:text-forest transition-colors uppercase tracking-wider py-1"
          >
            Paling Dicari
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("artisan-bakery")}
            className="text-espresso-muted hover:text-forest transition-colors uppercase tracking-wider py-1 flex items-center gap-1.5"
          >
            <span>Artisan Bakery</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-bold">
              Fresh
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("tentang-kaca-putih")}
            className="text-espresso-muted hover:text-forest transition-colors uppercase tracking-wider py-1"
          >
            Cerita Bunulrejo
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("lokasi-kunjungan")}
            className="text-espresso-muted hover:text-forest transition-colors uppercase tracking-wider py-1"
          >
            Lokasi &amp; Jam
          </button>
        </div>

        {/* Actions & Utilities Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Subtle Staff / Ops Dropdown (Discreet, not dominating customer view) */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setStaffDropdownOpen(!staffDropdownOpen)}
              onBlur={() => setTimeout(() => setStaffDropdownOpen(false), 200)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-stone-500 hover:text-espresso hover:bg-cream-200/50 transition-colors"
              title="Akses Sistem Internal (KDS & Admin)"
            >
              <span>Staff Hub</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {staffDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white border border-cream-border shadow-floating p-1.5 z-50 text-xs animate-fade-in">
                <Link
                  href="/kitchen"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-espresso hover:bg-forest hover:text-cream-50 transition-colors font-medium"
                >
                  <ChefHat className="w-4 h-4 text-forest group-hover:text-cream-50" />
                  <span>Kitchen KDS</span>
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-espresso hover:bg-forest hover:text-cream-50 transition-colors font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-forest group-hover:text-cream-50" />
                  <span>Admin Backoffice</span>
                </Link>
              </div>
            )}
          </div>

          {/* Sandbox Toggle Pill */}
          <button
            type="button"
            onClick={() => setIsDemoMode(!isDemoMode)}
            title="Mode Demo Recruiter"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
              isDemoMode
                ? "border-amber-600 bg-amber-50 text-amber-950 shadow-xs"
                : "border-stone-200 bg-white/70 text-stone-600 hover:border-forest/40 hover:text-forest"
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Sandbox</span>
          </button>

          {/* Cart Tray Button (With preview count & subtotal) */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-forest hover:bg-forest-hover text-cream-50 shadow-md transition-all active:scale-95 group"
            aria-label="Lihat Nampan Pesanan"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-cream-100" />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-amber-400 text-forest text-[10px] font-black border-2 border-forest shadow-xs animate-scale-in">
                  {totalCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[10px] text-cream-200 uppercase tracking-widest font-semibold">
                Nampan
              </span>
              <span className="text-xs font-mono font-bold mt-0.5">
                {totalCount > 0 ? formatIDRShort(totalAmount) : "Kosong"}
              </span>
            </div>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-espresso lg:hidden hover:bg-cream-200 transition-colors"
            aria-label="Buka Menu Navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-border bg-[#FAF8F5] px-5 py-6 space-y-4 shadow-floating animate-fade-in">
          <div className="flex flex-col space-y-3 text-sm font-serif font-bold text-espresso">
            <button
              type="button"
              onClick={() => handleNavClick("menu-catalog")}
              className="text-left py-2 border-b border-cream-border/60 hover:text-forest"
            >
              Jelajahi Menu Lengkap
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("khas-kaca-putih")}
              className="text-left py-2 border-b border-cream-border/60 hover:text-forest"
            >
              Kreasi Paling Dicari
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("artisan-bakery")}
              className="text-left py-2 border-b border-cream-border/60 hover:text-forest flex items-center justify-between"
            >
              <span>Artisan Salt Bread</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-sans font-bold">
                Panggang Harian
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("tentang-kaca-putih")}
              className="text-left py-2 border-b border-cream-border/60 hover:text-forest"
            >
              Cerita Bunulrejo
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("lokasi-kunjungan")}
              className="text-left py-2 border-b border-cream-border/60 hover:text-forest"
            >
              Lokasi &amp; Jam Operasional
            </button>
          </div>

          {/* Mobile Utility & Staff Links */}
          <div className="pt-4 border-t border-cream-border flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
            <button
              type="button"
              onClick={() => setIsDemoMode(!isDemoMode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white font-medium text-stone-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Sandbox: {isDemoMode ? "ON" : "OFF"}</span>
            </button>

            <div className="flex items-center gap-3">
              <Link
                href="/kitchen"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-forest flex items-center gap-1 underline underline-offset-2"
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>KDS</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-forest flex items-center gap-1 underline underline-offset-2"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
