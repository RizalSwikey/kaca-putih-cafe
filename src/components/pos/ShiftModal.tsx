"use client";

import { useState } from "react";
import { CashierShift, ShiftType } from "@/types";
import { openShift, closeShift } from "@/lib/shifts-store";
import { formatIDR } from "@/lib/utils";
import { ShiftReportPrint } from "@/components/pos/ShiftReportPrint";
import {
  Clock,
  AlertCircle,
  Printer,
  CheckCircle,
  X,
  Lock,
  Unlock,
} from "lucide-react";

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeShift: CashierShift | null;
  onShiftUpdated: (shift: CashierShift | null) => void;
  initialMode?: "open" | "close";
}

export function ShiftModal({
  isOpen,
  onClose,
  activeShift,
  onShiftUpdated,
  initialMode = "open",
}: ShiftModalProps) {
  const mode = initialMode;
  const [cashierName, setCashierName] = useState(activeShift?.cashier_name || "Kasir Bunulrejo");
  const [shiftType, setShiftType] = useState<ShiftType>(activeShift?.shift_type || "morning");
  const [startingCash, setStartingCash] = useState<number>(activeShift?.starting_cash || 200000);
  const [actualCash, setActualCash] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closedShiftForPrint, setClosedShiftForPrint] = useState<CashierShift | null>(null);

  if (!isOpen) return null;

  const handleOpenShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const shift = await openShift({
        cashier_name: cashierName,
        shift_type: shiftType,
        starting_cash: startingCash,
        notes: notes || undefined,
      });
      onShiftUpdated(shift);
      onClose();
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;
    setIsSubmitting(true);
    try {
      const closed = await closeShift(activeShift.id, actualCash, notes);
      if (closed) {
        setClosedShiftForPrint(closed);
        onShiftUpdated(null);
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const expectedCash = activeShift
    ? activeShift.starting_cash + activeShift.total_cash_sales
    : 0;
  const difference = actualCash - expectedCash;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200/80 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200/60 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-forest text-cream-50">
              {mode === "open" ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-espresso">
                {mode === "open" ? "Buka Kasir (Start Shift)" : "Tutup Kasir (Reconciliation)"}
              </h2>
              <p className="text-[11px] text-stone-500">
                Kaca Putih POS • Manajemen Laci Kas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Closed Shift Success & Print Preview */}
        {closedShiftForPrint ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-espresso">
              Shift Berhasil Ditutup!
            </h3>
            <p className="text-xs text-stone-600">
              Rekapitulasi penjualan dan laci kas telah disimpan ke sistem. Silakan cetak rekapitulasi shift untuk arsip kasir.
            </p>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span>Total Penjualan:</span>
                <span className="font-bold">{formatIDR(closedShiftForPrint.total_sales)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kas Masuk:</span>
                <span>+{formatIDR(closedShiftForPrint.total_cash_sales)}</span>
              </div>
              <div className="flex justify-between">
                <span>Selisih Fisik Laci:</span>
                <span className={`font-bold ${closedShiftForPrint.cash_difference === 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {closedShiftForPrint.cash_difference === 0 ? "Pas / Cocok" : formatIDR(closedShiftForPrint.cash_difference || 0)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrintReport}
                className="flex-1 py-3 px-4 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Rekap Shift (Thermal)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setClosedShiftForPrint(null);
                  onClose();
                }}
                className="py-3 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold"
              >
                Selesai
              </button>
            </div>

            <ShiftReportPrint shift={closedShiftForPrint} />
          </div>
        ) : mode === "open" ? (
          /* FORM BUKA KASIR */
          <form onSubmit={handleOpenShiftSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                Nama Kasir Bertugas *
              </label>
              <input
                type="text"
                required
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                placeholder="e.g. Budi / Siti"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                Pilih Jadwal Shift *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShiftType("morning")}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    shiftType === "morning"
                      ? "border-forest bg-forest/5 text-forest ring-1 ring-forest"
                      : "border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span className="font-bold text-xs">Shift Pagi</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1">
                    09:00 – 15:30 WIB
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShiftType("afternoon")}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    shiftType === "afternoon"
                      ? "border-forest bg-forest/5 text-forest ring-1 ring-forest"
                      : "border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span className="font-bold text-xs">Shift Siang</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1">
                    15:30 – 22:00 WIB
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                Modal Awal Uang Laci (Starting Cash) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                  Rp
                </span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={startingCash}
                  onChange={(e) => setStartingCash(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-bold text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[100000, 200000, 300000, 500000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setStartingCash(val)}
                    className="px-2 py-1 rounded-lg border border-stone-200 text-[10px] font-mono text-stone-600 hover:bg-stone-100"
                  >
                    {val / 1000}k
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                Catatan Operasional (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Uang pecahan 2k banyak di laci bawah"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? "Membuka Kasir..." : "Buka Kasir & Mulai Transaksi"}
              </button>
            </div>
          </form>
        ) : (
          /* FORM TUTUP KASIR */
          <form onSubmit={handleCloseShiftSubmit} className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between text-stone-500">
                <span>Kasir Bertugas:</span>
                <span className="font-bold text-espresso">{activeShift?.cashier_name}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Shift:</span>
                <span className="font-bold text-espresso uppercase">{activeShift?.shift_type}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 font-mono">
                <span>Modal Awal:</span>
                <span>{formatIDR(activeShift?.starting_cash || 0)}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Penjualan Tunai (Cash):</span>
                <span>+{formatIDR(activeShift?.total_cash_sales || 0)}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Penjualan Non-Tunai (QRIS):</span>
                <span>{formatIDR(activeShift?.total_qris_sales || 0)}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Penjualan Kartu:</span>
                <span>{formatIDR(activeShift?.total_card_sales || 0)}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-1.5 font-bold font-mono text-sm text-forest">
                <span>Total Omset Shift:</span>
                <span>{formatIDR(activeShift?.total_sales || 0)}</span>
              </div>
            </div>

            {/* Input Fisik Uang Laci */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-forest">
                  Hitung Uang Fisik di Laci *
                </label>
                <span className="text-[11px] font-mono text-stone-500">
                  Target: {formatIDR(expectedCash)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                  Rp
                </span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={actualCash || ""}
                  onChange={(e) => setActualCash(Number(e.target.value))}
                  placeholder="Masukkan total uang fisik di laci"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-mono font-bold text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              {actualCash > 0 && (
                <div className={`mt-2 p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                  difference === 0
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : difference > 0
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}>
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{difference === 0 ? "Uang Fisik Pas" : difference > 0 ? "Uang Fisik Lebih" : "Uang Fisik Kurang"}</span>
                  </div>
                  <span className="font-mono font-bold">
                    {difference === 0 ? "Rp 0" : (difference > 0 ? `+${formatIDR(difference)}` : formatIDR(difference))}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                Catatan Rekonsiliasi (Opsional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Setoran shift telah dihitung bersama SPV"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? "Menutup Shift..." : "Tutup Shift & Rekonsiliasi Kas"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
