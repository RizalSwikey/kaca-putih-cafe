"use client";

import { useState } from "react";
import { formatIDR } from "@/lib/utils";
import { PaymentMethod } from "@/types";
import {
  X,
  Banknote,
  QrCode,
  CreditCard,
  Printer,
} from "lucide-react";

interface PosPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onCompletePayment: (payload: {
    paymentMethod: PaymentMethod;
    cashTendered: number;
    cashChange: number;
    printReceipt: boolean;
  }) => void;
}

export function PosPaymentModal({
  isOpen,
  onClose,
  totalAmount,
  onCompletePayment,
}: PosPaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [cashTendered, setCashTendered] = useState<number>(totalAmount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const cashChange = Math.max(0, cashTendered - totalAmount);
  const isCashInsufficient = method === "cash" && cashTendered < totalAmount;

  // Preset quick cash buttons
  const cashPresets = [
    { label: "Uang Pas", amount: totalAmount },
    { label: "20k", amount: 20000 },
    { label: "50k", amount: 50000 },
    { label: "100k", amount: 100000 },
    { label: "200k", amount: 200000 },
  ];

  const handlePay = (shouldPrint: boolean) => {
    if (isCashInsufficient) return;
    setIsSubmitting(true);
    try {
      onCompletePayment({
        paymentMethod: method,
        cashTendered: method === "cash" ? cashTendered : totalAmount,
        cashChange: method === "cash" ? cashChange : 0,
        printReceipt: shouldPrint,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-espresso">
              Pembayaran Kasir
            </h2>
            <p className="text-[11px] text-stone-500">
              Pilih metode dan input nominal uang kasir
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Total Tagihan Banner */}
          <div className="p-4 rounded-2xl bg-forest-subtle border border-forest-border/40 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest block">
              Total Tagihan
            </span>
            <span className="font-mono text-3xl font-black text-forest mt-0.5 block">
              {formatIDR(totalAmount)}
            </span>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod("cash")}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  method === "cash"
                    ? "border-forest bg-forest text-cream-50 shadow-sm"
                    : "border-stone-200 bg-white text-espresso hover:bg-stone-50"
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-bold">TUNAI (Cash)</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("qris")}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  method === "qris"
                    ? "border-forest bg-forest text-cream-50 shadow-sm"
                    : "border-stone-200 bg-white text-espresso hover:bg-stone-50"
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs font-bold">QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("card")}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  method === "card"
                    ? "border-forest bg-forest text-cream-50 shadow-sm"
                    : "border-stone-200 bg-white text-espresso hover:bg-stone-50"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold">DEBIT / KARTU</span>
              </button>
            </div>
          </div>

          {/* Cash Tendered Input & Instant Change Calculator */}
          {method === "cash" && (
            <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                  Uang Diterima dari Pelanggan
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={cashTendered || ""}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-base font-mono font-bold text-espresso focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>
              </div>

              {/* Quick Cash Presets */}
              <div className="flex flex-wrap gap-2">
                {cashPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCashTendered(preset.amount)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                      cashTendered === preset.amount
                        ? "bg-forest text-cream-50 border-forest shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Change Display */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between font-mono">
                <span className="text-xs font-bold text-stone-600">KEMBALIAN:</span>
                <span className={`text-xl font-black ${isCashInsufficient ? "text-rose-600" : "text-emerald-700"}`}>
                  {isCashInsufficient ? "Uang Kurang" : formatIDR(cashChange)}
                </span>
              </div>
            </div>
          )}

          {method === "qris" && (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center gap-3">
              <QrCode className="w-8 h-8 text-sky-700 shrink-0" />
              <div>
                <p className="font-bold">Scan QRIS Dinamis / Statis di Meja Kasir</p>
                <p className="text-[11px] text-sky-700 mt-0.5">
                  Pastikan bukti transfer telah terverifikasi sebelum memproses transaksi.
                </p>
              </div>
            </div>
          )}

          {method === "card" && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-amber-700 shrink-0" />
              <div>
                <p className="font-bold">Gesek / Masukkan Kartu di Mesin EDC Kasir</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Pilih Debit / Kredit GPN, Visa, atau Mastercard.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons: Bayar & Cetak Struk vs Bayar Saja */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isCashInsufficient || isSubmitting}
              onClick={() => handlePay(false)}
              className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 font-bold text-xs uppercase tracking-wider text-stone-700 transition-all active:scale-98 disabled:opacity-40"
            >
              Bayar (Tanpa Struk)
            </button>

            <button
              type="button"
              disabled={isCashInsufficient || isSubmitting}
              onClick={() => handlePay(true)}
              className="py-3 px-4 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-98 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Bayar &amp; Cetak Struk</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
