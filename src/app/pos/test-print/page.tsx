"use client";

import { useState } from "react";
import Link from "next/link";
import { Order } from "@/types";
import { ReceiptPrint } from "@/components/pos/ReceiptPrint";
import {
  formatOrderToPlainText,
  printViaRawBT,
  printViaWebBluetooth,
} from "@/lib/thermal-printer";
import {
  Printer,
  ArrowLeft,
  Smartphone,
  Bluetooth,
  Receipt,
  Info,
  CheckCircle2,
} from "lucide-react";
import { formatIDR } from "@/lib/utils";

const SAMPLE_TEST_ORDER: Order = {
  id: "order-test-58mm-001",
  code: "KP-7890",
  order_type: "dine_in",
  table_number: 4,
  customer_name: "Bpk. Rahmat (Test)",
  customer_phone: "+6281234567890",
  status: "completed",
  payment_method: "cash",
  total_amount: 87000,
  cash_tendered: 100000,
  cash_change: 13000,
  is_demo: true,
  created_at: new Date().toISOString(),
  items: [
    {
      id: "item-test-1",
      order_id: "order-test-58mm-001",
      product_id: "prod-mont-blanc",
      product_name: "Mont Blanc",
      variant_name: "Cold",
      quantity: 1,
      unit_price: 30000,
      notes: "Less sweet, extra cold",
    },
    {
      id: "item-test-2",
      order_id: "order-test-58mm-001",
      product_id: "prod-dirty-latte",
      product_name: "Dirty Latte",
      variant_name: "Cold",
      extra_shot: true,
      quantity: 1,
      unit_price: 32000,
    },
    {
      id: "item-test-3",
      order_id: "order-test-58mm-001",
      product_id: "prod-nasi-goreng-teri",
      product_name: "Nasi Goreng Teri",
      quantity: 1,
      unit_price: 25000,
      notes: "Pedas sedang",
    },
  ],
};

export default function TestPrintPage() {
  const [order, setOrder] = useState<Order>(SAMPLE_TEST_ORDER);
  const [bluetoothStatus, setBluetoothStatus] = useState<string | null>(null);

  const handlePrintStandard = () => {
    window.print();
  };

  const handlePrintRawBT = () => {
    const text = formatOrderToPlainText(order);
    printViaRawBT(text);
  };

  const handlePrintBluetooth = async () => {
    setBluetoothStatus("Menghubungkan printer Bluetooth...");
    try {
      const text = formatOrderToPlainText(order);
      await printViaWebBluetooth(text);
      setBluetoothStatus("Berhasil mencetak via Bluetooth!");
      setTimeout(() => setBluetoothStatus(null), 3000);
    } catch (err) {
      setBluetoothStatus(
        err instanceof Error ? err.message : "Gagal menghubungkan Bluetooth."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-espresso p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/pos"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-forest transition-colors bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke POS</span>
          </Link>
          <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
            TEST MODE: 58mm Thermal Engine
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-espresso">
                Uji Cetak Struk 58mm
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Pengujian isolasi layout thermal printer Sharkpos &amp; Bluetooth BLE
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handlePrintStandard}
              className="w-full py-4 px-6 rounded-2xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <Printer className="w-6 h-6" />
              <span>Cetak Test Struk 58mm</span>
            </button>
          </div>

          {/* Alternative direct print triggers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrintRawBT}
              className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-bold flex items-center justify-center gap-2 text-stone-700 transition-all"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Cetak via RawBT App (Android)</span>
            </button>

            <button
              type="button"
              onClick={handlePrintBluetooth}
              className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-bold flex items-center justify-center gap-2 text-stone-700 transition-all"
            >
              <Bluetooth className="w-4 h-4 text-sky-600" />
              <span>Cetak via Web Bluetooth BLE</span>
            </button>
          </div>

          {bluetoothStatus && (
            <p className="text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 p-3 rounded-xl">
              {bluetoothStatus}
            </p>
          )}
        </div>

        {/* Instructions & Help Callout */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 space-y-2 text-xs text-amber-950">
          <div className="flex items-start gap-2.5 font-bold text-amber-900">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Petunjuk Koneksi Printer Bluetooth (Sharkpos / Generic 58mm):</span>
          </div>
          <p className="pl-6.5 text-[13px] font-semibold text-amber-900">
            Gunakan RawBT Print Service jika printer Bluetooth Sharkpos belum muncul di dialog Android.
          </p>
          <ul className="pl-6.5 list-disc space-y-1 text-amber-800 text-[12px]">
            <li>
              <strong>Browser Dialog (window.print):</strong> Pastikan ukuran kertas diset ke <strong>58mm</strong> atau <strong>Roll Paper</strong>, dan matikan <em>Headers &amp; Footers</em>.
            </li>
            <li>
              <strong>Aplikasi Android RawBT:</strong> Install &quot;RawBT Print Service&quot; dari Google Play Store, pair printer Sharkpos di Bluetooth Android, lalu klik tombol &quot;Cetak via RawBT App&quot;.
            </li>
            <li>
              <strong>Web Bluetooth BLE:</strong> Memerlukan browser yang mendukung Web Bluetooth (Google Chrome / Edge) dan printer thermal dengan BLE service aktif.
            </li>
          </ul>
        </div>

        {/* Sample Order Preview Card */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Detail Sampel Transaksi (#KP-7890)
          </h2>
          <div className="divide-y divide-stone-100 text-xs">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-espresso">
                    {item.product_name} {item.variant_name && `(${item.variant_name})`}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {item.quantity} x {formatIDR(item.unit_price)}
                    {item.notes && ` • ${item.notes}`}
                  </p>
                </div>
                <span className="font-mono font-bold text-espresso">
                  {formatIDR(item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-stone-200 flex justify-between items-center font-mono text-sm font-bold">
            <span>TOTAL DIBAYAR:</span>
            <span className="text-forest text-base">{formatIDR(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Hidden 58mm Thermal Print Area Component */}
      <ReceiptPrint order={order} />
    </div>
  );
}
