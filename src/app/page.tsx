"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Sparkles, ShoppingBag } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/data/menu";
import { Product } from "@/types";
import { StoreHeader } from "@/components/layout/StoreHeader";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuCard } from "@/components/menu/MenuCard";
import { VariantDrawer } from "@/components/menu/VariantDrawer";
import { useCartStore } from "@/lib/cart-store";
import { formatIDR } from "@/lib/utils";

function MenuContent() {
  const searchParams = useSearchParams();
  const setTableNumber = useCartStore((s) => s.setTableNumber);
  const setOrderType = useCartStore((s) => s.setOrderType);
  const totalCount = useCartStore((s) => s.getTotalCount());
  const totalAmount = useCartStore((s) => s.getTotalAmount());
  const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);

  // Detect table parameter from URL (e.g. /?table=5 or /?t=5)
  useEffect(() => {
    const tableParam = searchParams.get("table") || searchParams.get("t");
    if (tableParam) {
      const parsedTable = parseInt(tableParam, 10);
      if (!isNaN(parsedTable) && parsedTable > 0) {
        setTableNumber(parsedTable);
        setOrderType("dine_in");
      }
    }
  }, [searchParams, setTableNumber, setOrderType]);

  const [activeCategoryId, setActiveCategoryId] = useState<string>(CATEGORIES[0]?.id || "");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Scroll spy for sticky category bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const cat of CATEGORIES) {
        const el = sectionRefs.current[cat.id];
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategoryId(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectCategory = (catId: string) => {
    setActiveCategoryId(catId);
    const targetElement = sectionRefs.current[catId];
    if (targetElement) {
      const topOffset = targetElement.offsetTop - 140;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  // Filter products by search query
  const filteredProducts = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="flex-1 flex flex-col pb-28">
      {/* Dynamic Store Header with WIB Real-Time Clock */}
      <StoreHeader />

      {/* Sticky Category Navigation */}
      <CategoryNav
        categories={CATEGORIES}
        activeCategoryId={activeCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      {/* Search Input Filter */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search our coffees, salt breads, snacks..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-cream-border text-xs text-espresso placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-forest shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Catalog Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* If search query active */}
        {filteredProducts !== null ? (
          <div>
            <h2 className="font-serif text-xl font-bold text-espresso mb-4">
              Search Results ({filteredProducts.length})
            </h2>
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-cream-border text-espresso-subtle">
                <p className="font-serif text-base font-semibold">No items found</p>
                <p className="text-xs text-stone-500 mt-1">
                  Try searching for another keyword like "Latte", "Salt Bread", or "Nasi".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <MenuCard
                    key={product.id}
                    product={product}
                    onSelect={handleOpenProduct}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Grouped by Categories matching MenuKacaputih.pdf */
          CATEGORIES.map((category) => {
            const categoryProducts = PRODUCTS.filter(
              (p) => p.category_id === category.id
            );
            if (categoryProducts.length === 0) return null;

            return (
              <section
                key={category.id}
                id={category.slug}
                ref={(el) => {
                  sectionRefs.current[category.id] = el;
                }}
                className="scroll-mt-40"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-cream-border">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold text-forest tracking-tight">
                      {category.name}
                    </h2>
                    {category.slug === "our-signature" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                        Staff Picks
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-semibold text-espresso-subtle">
                    {categoryProducts.length} items
                  </span>
                </div>

                {/* Grid of Typography-First Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryProducts.map((product) => (
                    <MenuCard
                      key={product.id}
                      product={product}
                      categoryName={category.name}
                      onSelect={handleOpenProduct}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Floating Cart Dock Bar (Visible when tray has items) */}
      {totalCount > 0 && (
        <aside
          aria-label="Current order tray"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 max-w-md w-full animate-fade-in"
        >
          <div className="p-3.5 rounded-2xl bg-forest text-cream-50 shadow-floating border border-forest-light flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-xl bg-forest-dark">
                <ShoppingBag className="w-5 h-5 text-cream-200" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {totalCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-cream-200 uppercase font-semibold tracking-wider">
                  Tray Subtotal
                </span>
                <span className="font-mono text-sm font-bold text-cream-50">
                  {formatIDR(totalAmount)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-cream-100 text-forest hover:bg-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              View Order Tray
            </button>
          </div>
        </aside>
      )}

      {/* Variant & Customization Drawer */}
      <VariantDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-espresso-subtle text-xs">
          Loading Kaca Putih Menu...
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
