"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
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
    <>
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF8F5]/85 border-b border-stone-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Kaca Putih Cafe & Kitchen"
          >
            <div className="w-12 h-12 relative flex items-center justify-center p-1 rounded-full bg-forest/5 border border-forest/15 group-hover:border-forest/40 transition-colors">
              <Logo variant="icon" size="sm" className="w-9 h-9 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-espresso group-hover:text-forest transition-colors leading-none">
                Kaca Putih
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-stone-500 mt-1">
                Cafe &amp; Kitchen
              </span>
            </div>
          </Link>

          {/* Desktop Customer Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase text-stone-600">
            <button
              type="button"
              onClick={() => handleNavClick("menu-catalog")}
              className="hover:text-forest transition-colors py-1"
            >
              Menu
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("khas-kaca-putih")}
              className="hover:text-forest transition-colors py-1"
            >
              Signatures
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("artisan-bakery")}
              className="hover:text-forest transition-colors py-1 flex items-center gap-1.5"
            >
              <span>Artisan Bakery</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[9px] font-bold font-sans">
                Fresh
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("tentang-kaca-putih")}
              className="hover:text-forest transition-colors py-1"
            >
              Our Story
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("lokasi-kunjungan")}
              className="hover:text-forest transition-colors py-1"
            >
              Location
            </button>
          </div>

          {/* Customer Actions & Utilities Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-forest hover:bg-forest-hover text-cream-50 shadow-sm hover:-translate-y-0.5 transition-all active:scale-95 group"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-cream-100" />
              <span className="text-xs font-semibold tracking-wide">
                Cart ({totalCount})
              </span>
              {totalCount > 0 && (
                <span className="hidden sm:inline text-xs font-mono font-bold text-cream-200 border-l border-forest-light/60 pl-2">
                  {formatIDRShort(totalAmount)}
                </span>
              )}
            </button>

            {/* Mobile Navigation Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-espresso lg:hidden hover:bg-cream-200/60 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Customer Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200/60 bg-[#FAF8F5] px-5 py-6 space-y-4 shadow-floating animate-fade-in">
            <div className="flex flex-col space-y-3 text-sm font-serif font-bold text-espresso">
              <button
                type="button"
                onClick={() => handleNavClick("menu-catalog")}
                className="text-left py-2 border-b border-stone-200/40 hover:text-forest"
              >
                Menu
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("khas-kaca-putih")}
                className="text-left py-2 border-b border-stone-200/40 hover:text-forest"
              >
                Signatures
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("artisan-bakery")}
                className="text-left py-2 border-b border-stone-200/40 hover:text-forest flex items-center justify-between"
              >
                <span>Artisan Bakery</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-sans font-bold">
                  Daily Fresh
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("tentang-kaca-putih")}
                className="text-left py-2 border-b border-stone-200/40 hover:text-forest"
              >
                Our Story
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("lokasi-kunjungan")}
                className="text-left py-2 border-b border-stone-200/40 hover:text-forest"
              >
                Location &amp; Hours
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Subtle Floating Recruiter Sandbox Pill (Bottom-Right) */}
      {isDemoMode && (
        <button
          type="button"
          onClick={() => setIsDemoMode(false)}
          className="fixed bottom-4 right-4 z-40 bg-stone-900/90 text-stone-300 hover:text-white px-3 py-1.5 rounded-full text-[11px] font-mono border border-stone-700/60 shadow-floating backdrop-blur-xs flex items-center gap-1.5 transition-all group"
          title="Sandbox Mode Active: Click to disable"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Recruiter Sandbox Active</span>
          <span className="text-stone-500 group-hover:text-stone-300 ml-1">Turn Off</span>
        </button>
      )}
    </>
  );
}
