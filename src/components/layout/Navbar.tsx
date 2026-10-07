"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, ChefHat, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useCartStore } from "@/lib/cart-store";

export function Navbar() {
  const pathname = usePathname();
  const totalCount = useCartStore((s) => s.getTotalCount());
  const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
  const isDemoMode = useCartStore((s) => s.isDemoMode);
  const setIsDemoMode = useCartStore((s) => s.setIsDemoMode);

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-stone-200/50 shadow-glass-sm transition-all">
      {/* Persistent Recruiter Demo Mode Banner when active */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-amber-50 px-4 py-1.5 text-center text-xs font-medium flex items-center justify-center gap-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
          <span>
            <strong>Recruiter Sandbox Mode Active:</strong> Safe demo test orders (no live WhatsApp dispatch or real database mutations).
          </span>
          <button
            type="button"
            onClick={() => setIsDemoMode(false)}
            className="ml-2 underline text-[11px] text-amber-200 hover:text-white"
          >
            Turn Off
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Home Link */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Logo variant="horizontal" size="sm" />
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/#menu-catalog"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              pathname === "/"
                ? "text-forest font-bold"
                : "text-espresso-muted hover:text-forest hover:bg-forest/5"
            }`}
          >
            Menu
          </Link>

          <Link
            href="/#tentang-kaca-putih"
            className="hidden md:inline px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide text-espresso-muted hover:text-forest hover:bg-forest/5 transition-colors"
          >
            Tentang Kami
          </Link>

          <Link
            href="/#lokasi-kunjungan"
            className="hidden sm:inline px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide text-espresso-muted hover:text-forest hover:bg-forest/5 transition-colors"
          >
            Lokasi
          </Link>

          <Link
            href="/kitchen"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              pathname === "/kitchen"
                ? "bg-forest text-cream-50 shadow-sm"
                : "text-espresso-muted hover:text-forest hover:bg-forest/5"
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kitchen KDS</span>
            <span className="sm:hidden">KDS</span>
          </Link>

          <Link
            href="/admin"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              pathname === "/admin"
                ? "bg-forest text-cream-50 shadow-sm"
                : "text-espresso-muted hover:text-forest hover:bg-forest/5"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Admin</span>
          </Link>

          {/* Sandbox Toggle */}
          <button
            type="button"
            onClick={() => setIsDemoMode(!isDemoMode)}
            title="Toggle Recruiter Demo Sandbox"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
              isDemoMode
                ? "border-amber-500 bg-amber-50 text-amber-900"
                : "border-stone-200 text-stone-500 hover:border-forest/40 hover:text-forest"
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span className="hidden md:inline">Demo Sandbox</span>
          </button>

          {/* Cart Floating / Dock Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2.5 rounded-xl bg-forest text-cream-50 hover:bg-forest-hover shadow-md transition-all active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 text-cream-100" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold border-2 border-white shadow-sm animate-scale-in">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
