"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CashierShift } from "@/types";
import { fetchCurrentShift, fetchShiftHistory } from "@/lib/shifts-store";
import { ShiftModal } from "@/components/pos/ShiftModal";
import { ShiftReportPrint } from "@/components/pos/ShiftReportPrint";
import { formatIDR } from "@/lib/utils";
import {
  Clock,
  Printer,
  Unlock,
  Lock,
  ArrowLeft,
  History,
} from "lucide-react";

export default function ShiftManagementPage() {
  const [currentShift, setCurrentShift] = useState<CashierShift | null>(null);
  const [history, setHistory] = useState<CashierShift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"open" | "close">("open");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShiftForPrint, setSelectedShiftForPrint] = useState<CashierShift | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const active = await fetchCurrentShift();
      const past = await fetchShiftHistory();
      setCurrentShift(active);
      setHistory(past);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePrintSpecificShift = (shift: CashierShift) => {
    setSelectedShiftForPrint(shift);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-espresso p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
          <div className="flex items-center gap-3">
            <Link
              href="/pos"
              className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-forest transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-espresso">
                Manajemen Shift &amp; Laci Kasir
              </h1>
              <p className="text-xs text-stone-500">
                Kaca Putih POS • Buka/Tutup Kasir &amp; Rekonsiliasi Keuangan
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

            {currentShift ? (
              <button
                type="button"
                onClick={() => {
                  setModalMode("close");
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Tutup Shift Kasir</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setModalMode("open");
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>Buka Shift Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Active Shift Banner */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${currentShift ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"}`}>
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg font-bold text-espresso">
                    Status Kasir Saat Ini
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    currentShift ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                  }`}>
                    {currentShift ? "SHIFT TERBUKA (AKTIF)" : "KASIR TUTUP"}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {currentShift
                    ? `Dibuka oleh ${currentShift.cashier_name} (${currentShift.shift_type === "morning" ? "Pagi: 09:00 - 15:30" : "Siang: 15:30 - 22:00"}) sejak ${new Date(currentShift.opened_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`
                    : "Belum ada shift kasir yang aktif. Buka kasir untuk memulai transaksi penjualan."}
                </p>
              </div>
            </div>

            {currentShift && (
              <button
                type="button"
                onClick={() => handlePrintSpecificShift(currentShift)}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Rekap Sementara</span>
              </button>
            )}
          </div>

          {currentShift ? (
            /* Live Performance Metrics */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-cream-50 border border-stone-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Modal Awal Laci
                </span>
                <span className="font-mono text-lg font-bold text-espresso mt-1 block">
                  {formatIDR(currentShift.starting_cash)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-cream-50 border border-stone-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Penjualan Tunai
                </span>
                <span className="font-mono text-lg font-bold text-forest mt-1 block">
                  {formatIDR(currentShift.total_cash_sales)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-cream-50 border border-stone-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Non-Tunai (QRIS &amp; Kartu)
                </span>
                <span className="font-mono text-lg font-bold text-sky-700 mt-1 block">
                  {formatIDR(currentShift.total_qris_sales + currentShift.total_card_sales)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-forest-subtle border border-forest-border/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest block">
                  Total Omset Shift
                </span>
                <span className="font-mono text-lg font-black text-forest mt-1 block">
                  {formatIDR(currentShift.total_sales)}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  {currentShift.orders_count} transaksi selesai
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              <p className="text-xs text-stone-500 mb-3">
                Laci kasir saat ini terkunci. Pastikan uang modal awal dihitung sebelum membuka shift.
              </p>
              <button
                type="button"
                onClick={() => {
                  setModalMode("open");
                  setIsModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                Buka Kasir Sekarang
              </button>
            </div>
          )}
        </div>

        {/* History Table */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-forest" />
              <h3 className="font-serif text-lg font-bold text-espresso">
                Riwayat Rekonsiliasi Shift Kasir
              </h3>
            </div>
            <span className="text-xs font-mono text-stone-400">
              {history.length} shift tercatat
            </span>
          </div>

          {isLoading ? (
            <p className="text-xs text-stone-400 text-center py-8">Memuat riwayat shift...</p>
          ) : history.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-8">Belum ada riwayat shift yang tersimpan.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase tracking-wider font-bold text-stone-400 border-b border-stone-200 bg-stone-50">
                  <tr>
                    <th className="py-3 px-3">Tanggal &amp; Shift</th>
                    <th className="py-3 px-3">Kasir</th>
                    <th className="py-3 px-3 font-mono text-right">Modal Awal</th>
                    <th className="py-3 px-3 font-mono text-right">Penjualan Tunai</th>
                    <th className="py-3 px-3 font-mono text-right">Total Omset</th>
                    <th className="py-3 px-3 font-mono text-right">Fisik Laci</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {history.map((s) => {
                    const isOpen = s.status === "open";
                    const diff = s.cash_difference ?? 0;
                    return (
                      <tr key={s.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 px-3 font-medium">
                          <div>
                            <span className="font-bold text-espresso">
                              {new Date(s.opened_at).toLocaleDateString("id-ID")}
                            </span>
                            <span className="text-[11px] text-stone-500 block uppercase">
                              {s.shift_type === "morning" ? "Pagi (09:00 - 15:30)" : "Siang (15:30 - 22:00)"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-espresso">
                          {s.cashier_name}
                        </td>
                        <td className="py-3 px-3 font-mono text-right text-stone-600">
                          {formatIDR(s.starting_cash)}
                        </td>
                        <td className="py-3 px-3 font-mono text-right text-forest font-semibold">
                          +{formatIDR(s.total_cash_sales)}
                        </td>
                        <td className="py-3 px-3 font-mono text-right font-bold text-espresso">
                          {formatIDR(s.total_sales)}
                        </td>
                        <td className="py-3 px-3 font-mono text-right">
                          {s.actual_cash !== null && s.actual_cash !== undefined ? (
                            <div>
                              <span className="font-bold text-espresso">{formatIDR(s.actual_cash)}</span>
                              <span className={`text-[10px] block ${diff === 0 ? "text-emerald-700" : diff > 0 ? "text-amber-700" : "text-rose-700"}`}>
                                {diff === 0 ? "Pas" : diff > 0 ? `+${formatIDR(diff)}` : formatIDR(diff)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-stone-400 italic">Belum dihitung</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isOpen ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                          }`}>
                            {isOpen ? "Aktif" : "Selesai"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handlePrintSpecificShift(s)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-forest hover:bg-stone-100 transition-colors"
                            title="Cetak Struk Rekap"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Shift Modal */}
        <ShiftModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activeShift={currentShift}
          initialMode={modalMode}
          onShiftUpdated={() => {
            loadData();
          }}
        />

        {/* Print Anchor */}
        <ShiftReportPrint shift={selectedShiftForPrint} />
      </div>
    </div>
  );
}
