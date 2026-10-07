"use client";

import { useEffect, useRef, useState } from "react";
import { Category } from "@/types";

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryNav({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Keep active button horizontally centered inside the container only
    if (!containerRef.current) return;
    const activeBtn = containerRef.current.querySelector<HTMLButtonElement>(
      `[data-category-id="${activeCategoryId}"]`
    );
    if (activeBtn && containerRef.current) {
      const container = containerRef.current;
      const left =
        activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
      container.scrollTo({ left, behavior: "smooth" });
    }
  }, [activeCategoryId]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`sticky top-20 z-30 w-full transition-all duration-200 border-b border-stone-200/60 ${
        isScrolled
          ? "bg-[#FAF8F5]/95 backdrop-blur-md shadow-2xs py-2.5"
          : "bg-[#FAF8F5] py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={containerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                data-category-id={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-forest text-cream-50 shadow-2xs"
                    : "bg-white/80 text-stone-600 hover:text-forest hover:bg-white border border-stone-200/60"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
