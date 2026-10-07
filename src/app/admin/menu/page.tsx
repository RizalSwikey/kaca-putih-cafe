"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { CATEGORIES } from "@/data/menu";
import {
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "@/lib/products-store";
import { formatIDR } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  Search,
  Check,
  X,
  ArrowLeft,
  Coffee,
  CheckCircle2,
} from "lucide-react";

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Form Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(CATEGORIES[0]?.id || "cat-signature");
  const [basePrice, setBasePrice] = useState<number>(25000);
  const [description, setDescription] = useState("");
  const [isSignature, setIsSignature] = useState(false);
  const [isDailyBakery, setIsDailyBakery] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Inline Price Editing
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
    setCategoryId(CATEGORIES[0]?.id || "cat-signature");
    setBasePrice(25000);
    setDescription("");
    setIsSignature(false);
    setIsDailyBakery(false);
    setIsAvailable(true);
    setImageUrl("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.category_id);
    setBasePrice(p.base_price);
    setDescription(p.description);
    setIsSignature(p.is_signature);
    setIsDailyBakery(p.is_daily_bakery);
    setIsAvailable(p.is_available);
    setImageUrl(p.image_url || "");
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploaded = await uploadProductImage(file);
      if (uploaded) {
        setImageUrl(uploaded);
        showToast("Foto berhasil diunggah!");
      }
    } catch {
      showToast("Gagal mengunggah foto.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: name.trim(),
          category_id: categoryId,
          base_price: basePrice,
          description: description.trim(),
          is_signature: isSignature,
          is_daily_bakery: isDailyBakery,
          is_available: isAvailable,
          image_url: imageUrl || undefined,
        });
        showToast(`Produk ${name} berhasil diperbarui!`);
      } else {
        await createProduct({
          name: name.trim(),
          category_id: categoryId,
          base_price: basePrice,
          description: description.trim(),
          is_signature: isSignature,
          is_daily_bakery: isDailyBakery,
          is_available: isAvailable,
          image_url: imageUrl || undefined,
        });
        showToast(`Produk baru ${name} berhasil ditambahkan!`);
      }

      await loadProducts();
      setIsModalOpen(false);
    } catch {
      showToast("Gagal menyimpan produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveQuickPrice = async (productId: string) => {
    if (quickPriceVal <= 0) return;
    try {
      await updateProduct(productId, { base_price: quickPriceVal });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, base_price: quickPriceVal } : p
        )
      );
      setQuickEditId(null);
      showToast("Harga berhasil diperbarui!");
    } catch {
      showToast("Gagal memperbarui harga.");
    }
  };

  const handleDeleteProduct = async (p: Product) => {
    if (confirm(`Hapus produk "${p.name}" dari menu?`)) {
      try {
        await deleteProduct(p.id);
        setProducts((prev) => prev.filter((item) => item.id !== p.id));
        showToast(`Produk ${p.name} dihapus.`);
      } catch {
        showToast("Gagal menghapus produk.");
      }
    }
  };

  const handleToggleAvailability = async (p: Product) => {
    const nextVal = !p.is_available;
    try {
      await updateProduct(p.id, { is_available: nextVal });
      setProducts((prev) =>
        prev.map((item) =>
          item.id === p.id ? { ...item, is_available: nextVal } : item
        )
      );
    } catch {
      // ignore
    }
  };

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
    <div className="min-h-screen bg-[#FAF8F5] text-espresso p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-forest transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-espresso">
                Katalog &amp; Manajemen Menu
              </h1>
              <p className="text-xs text-stone-500">
                Kaca Putih Admin • Tambah, Edit Harga Instan, Upload Foto &amp; Hapus Produk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pos"
              className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Ke Layar POS
            </Link>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-stone-200 text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCategory === "all"
                  ? "bg-forest text-cream-50 shadow-2xs"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              Semua ({products.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? "bg-forest text-cream-50 shadow-2xs"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <p className="text-xs text-stone-400 text-center py-12">Memuat daftar produk...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 max-w-md mx-auto">
            <Coffee className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="font-serif font-bold text-sm text-espresso">Tidak ada produk ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((p) => {
              const categoryName = CATEGORIES.find((c) => c.id === p.category_id)?.name;
              const isEditingPrice = quickEditId === p.id;

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl bg-white border flex flex-col justify-between transition-all ${
                    p.is_available ? "border-stone-200 shadow-2xs" : "border-stone-200/60 opacity-60 bg-stone-50/80"
                  }`}
                >
                  <div>
                    {/* Image Thumbnail */}
                    <div className="relative w-full aspect-square rounded-xl bg-stone-50 overflow-hidden mb-3 flex items-center justify-center border border-stone-100">
                      {p.image_url ? (
                        <Image
                          src={p.image_url}
                          alt={p.name}
                          fill
                          sizes="240px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <span className="font-serif text-2xl font-bold text-forest/30">KP</span>
                      )}

                      {/* Badges Overlay */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {p.is_signature && (
                          <span className="px-2 py-0.5 rounded-full bg-forest text-cream-50 text-[9px] font-bold uppercase tracking-wider">
                            Signature
                          </span>
                        )}
                        {p.is_daily_bakery && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-bold tracking-wide">
                            Bakery
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold uppercase text-stone-400 block mb-0.5">
                      {categoryName || "Menu"}
                    </span>
                    <h3 className="font-serif font-bold text-base text-espresso leading-snug line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {p.description || "Tidak ada deskripsi"}
                    </p>
                  </div>

                  {/* Price & Quick Edit Price */}
                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1.5 flex-1 mr-2">
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={quickPriceVal}
                            onChange={(e) => setQuickPriceVal(Number(e.target.value))}
                            className="w-24 px-2 py-1 rounded-lg border border-forest text-xs font-mono font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveQuickPrice(p.id)}
                            className="p-1 rounded bg-forest text-cream-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setQuickEditId(null)}
                            className="p-1 rounded bg-stone-200 text-stone-700"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setQuickEditId(p.id);
                            setQuickPriceVal(p.base_price);
                          }}
                          className="font-mono text-sm font-bold text-forest hover:underline flex items-center gap-1 text-left"
                          title="Klik untuk ubah harga cepat"
                        >
                          <span>{formatIDR(p.base_price)}</span>
                          <Edit2 className="w-3 h-3 opacity-60 ml-0.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(p)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.is_available
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {p.is_available ? "Aktif" : "Habis"}
                      </button>
                    </div>

                    {/* Action buttons (Edit modal & Delete) */}
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-forest hover:bg-stone-50 transition-colors"
                        title="Edit Produk Lengkap"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p)}
                        className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Tambah / Edit Produk */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-5 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg font-bold text-espresso">
                    {editingProduct ? "Edit Produk Menu" : "Tambah Produk Baru"}
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Kaca Putih Cafe &amp; Kitchen Catalog
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hazelnut Choco Frappe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                      Kategori *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                      Harga Dasar (IDR) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1000"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                    Deskripsi Produk
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tuliskan rasa, bahan utama, dan karakteristik..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>

                {/* Upload Foto Produk */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                    Foto Produk (Storage Bucket: product-images)
                  </label>
                  <div className="flex items-center gap-3">
                    {imageUrl ? (
                      <div className="relative w-14 h-14 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                        <Image src={imageUrl} alt="Preview" fill sizes="56px" className="object-contain p-1" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 shrink-0">
                        <Upload className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-forest file:text-cream-50 hover:file:bg-forest-hover cursor-pointer"
                      />
                      {uploadingImage && (
                        <span className="text-[11px] text-amber-700 block mt-1">Mengunggah gambar...</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-semibold text-espresso">Tandai Sebagai Menu Signature</span>
                    <input
                      type="checkbox"
                      checked={isSignature}
                      onChange={(e) => setIsSignature(e.target.checked)}
                      className="w-4 h-4 rounded text-forest focus:ring-forest accent-forest cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-semibold text-espresso">Kategori Daily Bakery (Batch Oven Harian)</span>
                    <input
                      type="checkbox"
                      checked={isDailyBakery}
                      onChange={(e) => setIsDailyBakery(e.target.checked)}
                      className="w-4 h-4 rounded text-forest focus:ring-forest accent-forest cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-semibold text-espresso">Status Ketersediaan (Tersedia / Habis)</span>
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-forest focus:ring-forest accent-forest cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingImage}
                    className="w-full py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? "Menyimpan..." : editingProduct ? "Simpan Perubahan Produk" : "Tambah Produk ke Menu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-forest-dark text-white shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-forest">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
