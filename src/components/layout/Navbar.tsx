"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
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
  const staffDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        staffDropdownRef.current &&
        !staffDropdownRef.current.contains(event.target as Node)
      ) {
        setStaffDropdownOpen(false);
      }
    }
    if (staffDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [staffDropdownOpen]);
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
          {/* Authentic Brand Logo Mark (No redundant adjacent text, transparent, mix-blend-multiply) */}
          <Link href="/" className="flex items-center group shrink-0" aria-label="Kaca Putih Cafe & Kitchen">
            <Logo variant="horizontal" size="sm" />
          </Link>

          {/* Desktop Customer Navigation (Refined Minimalist English) */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase text-stone-600">
            <button
              type="button"
              onClick={() => handleNavClick("menu-catalog")}
              className="hover:text-forest transition-colors py-1 font-bold text-espresso"
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

          {/* Actions & Utilities Right Section */}
          <div className="flex items-center gap-3">
            {/* Discreet Staff Portal Dropdown */}
            <div ref={staffDropdownRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setStaffDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-stone-500 hover:text-espresso hover:bg-cream-200/50 transition-colors"
                title="Internal Management (KDS & Admin)"
              >
                <span>Staff Hub</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {staffDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-white border border-stone-200/60 shadow-floating p-1.5 z-50 text-xs animate-fade-in space-y-0.5">
                  <Link
                    href="/pos"
                    onClick={() => setStaffDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-espresso hover:bg-forest hover:text-cream-50 transition-colors font-medium group"
                  >
                    <ShoppingBag className="w-4 h-4 text-forest group-hover:text-cream-50" />
                    <span>POS Terminal</span>
                  </Link>
                  <Link
                    href="/pos/shift"
                    onClick={() => setStaffDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-espresso hover:bg-forest hover:text-cream-50 transition-colors font-medium group"
                  >
                    <ChefHat className="w-4 h-4 text-forest group-hover:text-cream-50" />
                    <span>Shift &amp; Cash Register</span>
                  </Link>
                  <Link
                    href="/kitchen"
                    onClick={() => setStaffDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-espresso hover:bg-forest hover:text-cream-50 transition-colors font-medium group"
                  >
                    <ChefHat className="w-4 h-4 text-forest group-hover:text-cream-50" />
                    <span>Kitchen KDS</span>
                  </Link>
                  <Link
                    href="/admin/menu"
                    onClick={() => setStaffDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-espresso hover:bg-forest hover:text-cream-50 transition-colors font-medium group"
                  >
                    <ShieldCheck className="w-4 h-4 text-forest group-hover:text-cream-50" />
                    <span>Menu Catalog Admin</span>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setStaffDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-espresso hover:bg-forest hover:text-cream-50 transition-colors font-medium group"
                  >
                    <ShieldCheck className="w-4 h-4 text-forest group-hover:text-cream-50" />
                    <span>Admin Backoffice</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Button: Refined Cart (X) indicator with minimal shopping bag icon */}
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

        {/* Mobile Navigation Drawer */}
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

            {/* Mobile Utility & Staff Links */}
            <div className="pt-4 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 font-medium">
              <Link
                href="/pos"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-forest flex items-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>POS</span>
              </Link>
              <Link
                href="/kitchen"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-forest flex items-center gap-1"
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>KDS</span>
              </Link>
              <Link
                href="/admin/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-forest flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Menu</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-forest flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Subtle Floating Recruiter Sandbox Pill (Bottom-Right, Never dominating header) */}
      {isDemoMode && (
        <button
          type="button"
          onClick={() => setIsDemoMode(false)}
          className="fixed bottom-4 right-4 z-50 bg-stone-900/80 backdrop-blur-md text-stone-200 text-xs px-3 py-1.5 rounded-full border border-stone-700 hover:bg-stone-900 transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
          title="Click to turn off sandbox mode"
        >
          <span>⚡ Recruiter Sandbox Active</span>
          <span className="text-[10px] text-stone-400 underline ml-1">Turn Off</span>
        </button>
      )}
    </>
  );
}
