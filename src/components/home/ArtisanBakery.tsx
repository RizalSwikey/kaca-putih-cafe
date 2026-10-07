"use client";

import { Sparkles, Croissant, Plus, Flame, Clock } from "lucide-react";
import { Product } from "@/types";
import { formatIDRShort } from "@/lib/utils";

interface ArtisanBakeryProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export function ArtisanBakery({ products, onSelectProduct }: ArtisanBakeryProps) {
  const saltBread = products.find((p) => p.slug === "salt-bread");
  const cinnamonRoll = products.find((p) => p.slug === "cinnamon-roll");
  const donatKampung = products.find((p) => p.slug === "donat");

  return (
    <section id="artisan-bakery" className="relative w-full py-16 sm:py-24 bg-[#FAF7F0] border-b border-cream-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-widest mb-3 shadow-xs">
            <Croissant className="w-3.5 h-3.5 text-amber-700" />
            <span>Panggang Segar Harian • Oven Kaca Putih</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso tracking-tight">
            Artisan Japanese Salt Bread (Shio Pan)
          </h2>
          <p className="mt-4 text-espresso-muted text-base sm:text-lg leading-relaxed font-normal">
            Roti bantal artisanal dengan kerak dasar renyah gurih bermentega, butiran flaky sea salt di atasnya, serta bagian tengah yang lembut dan harum saat disantap hangat.
          </p>
        </div>

        {/* Feature Split Banner: Salt Bread Story on Left, Variety Chips on Right */}
        {saltBread && (
          <div className="rounded-3xl bg-white border border-cream-border shadow-card p-6 sm:p-10 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Craftsmanship story */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Dua Sesi Pemanggangan Harian (Pagi 09:30 &amp; Sore 15:30 WIB)</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
                  Rahasia Kenikmatan Shio Pan Kami
                </h3>

                <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed">
                  Kami mengadopsi teknik tradisional shio pan Jepang: mentega berkualitas tinggi digulung di inti adonan ragi alami. Saat dipanggang, mentega meleleh hingga menggoreng dasar roti hingga renyah keemasan, menghasilkan sensasi kontras tekstur luar dan dalam yang adiktif.
                </p>

                <div className="pt-2 flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-cream-border text-espresso font-medium">
                    <Clock className="w-3.5 h-3.5 text-forest" />
                    <span>Selalu disajikan hangat</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-cream-border text-espresso font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>5 Pilihan Topping Gurih &amp; Manis</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Variety Cards with Fast Add Trigger */}
              <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-[#F1ECE1] border border-cream-border">
                <div className="flex items-center justify-between pb-3 border-b border-cream-border mb-3">
                  <span className="font-serif font-bold text-base text-forest">
                    Pilihan Varian Shio Pan
                  </span>
                  <span className="text-xs font-mono font-bold text-espresso">
                    Mulai {formatIDRShort(saltBread.base_price)}
                  </span>
                </div>

                <div className="space-y-2 mb-5">
                  {saltBread.variants?.map((v) => (
                    <div
                      key={v.id}
                      className="p-2.5 rounded-xl bg-white/90 border border-cream-border/70 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-espresso">{v.name}</span>
                      <span className="font-mono text-forest font-bold">
                        {v.price_delta > 0
                          ? `+${formatIDRShort(v.price_delta)}`
                          : "Termasuk"}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectProduct(saltBread)}
                  className="w-full py-3 px-4 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Pesan Japanese Salt Bread</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Supporting Bakery Companions: Cinnamon Roll & Donat Kampung */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cinnamonRoll && (
            <div
              onClick={() => onSelectProduct(cinnamonRoll)}
              className="group p-6 rounded-3xl bg-white border border-cream-border hover:border-forest/40 shadow-xs hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase">
                    Sweet Bakes
                  </span>
                  <span className="font-mono text-sm font-bold text-forest">
                    {formatIDRShort(cinnamonRoll.base_price)}
                  </span>
                </div>
                <h4 className="font-serif text-xl font-bold text-espresso group-hover:text-forest transition-colors">
                  {cinnamonRoll.name}
                </h4>
                <p className="mt-2 text-xs text-espresso-muted leading-relaxed">
                  {cinnamonRoll.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-cream-border flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-medium">
                  Classic Glaze &amp; Cream Cheese
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(cinnamonRoll);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-forest/10 hover:bg-forest text-forest hover:text-cream-50 text-xs font-bold transition-all"
                >
                  Pilih Varian
                </button>
              </div>
            </div>
          )}

          {donatKampung && (
            <div
              onClick={() => onSelectProduct(donatKampung)}
              className="group p-6 rounded-3xl bg-white border border-cream-border hover:border-forest/40 shadow-xs hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cream-200 text-espresso text-[10px] font-bold uppercase">
                    Comfort Snack
                  </span>
                  <span className="font-mono text-sm font-bold text-forest">
                    {formatIDRShort(donatKampung.base_price)}
                  </span>
                </div>
                <h4 className="font-serif text-xl font-bold text-espresso group-hover:text-forest transition-colors">
                  {donatKampung.name}
                </h4>
                <p className="mt-2 text-xs text-espresso-muted leading-relaxed">
                  {donatKampung.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-cream-border flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-medium">
                  Gula Halus &amp; Brown Sugar
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(donatKampung);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-forest/10 hover:bg-forest text-forest hover:text-cream-50 text-xs font-bold transition-all"
                >
                  Pilih Varian
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
