import React from "react";
import { CashierShift } from "@/types";
import { formatIDR } from "@/lib/utils";

interface ShiftReportPrintProps {
  shift: CashierShift | null;
}

export function ShiftReportPrint({ shift }: ShiftReportPrintProps) {
  if (!shift) return null;

  const openDate = new Date(shift.opened_at);
  const closeDate = shift.closed_at ? new Date(shift.closed_at) : new Date();

  const formattedOpen = `${openDate.toLocaleDateString("id-ID")} ${openDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  const formattedClose = `${closeDate.toLocaleDateString("id-ID")} ${closeDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  const shiftLabel = shift.shift_type === "morning"
    ? "PAGI (09:00 - 15:30)"
    : "SIANG (15:30 - 22:00)";

  const difference = shift.cash_difference ?? 0;
  const diffStatus = difference === 0
    ? "SEIMBANG (PAS)"
    : difference > 0
    ? `LEBIH (+${formatIDR(difference)})`
    : `KURANG (${formatIDR(difference)})`;

  return (
    <div
      id="thermal-receipt"
      className="hidden print:block font-mono text-black text-[12px] leading-tight p-0 m-0"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @page {
          size: 58mm auto;
          margin: 0mm;
        }
        @media print {
          html, body {
            width: 58mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            overflow: visible !important;
          }
          body * {
            visibility: hidden !important;
          }
          #thermal-receipt, #thermal-receipt * {
            visibility: visible !important;
          }
          #thermal-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 58mm !important;
            max-width: 58mm !important;
            padding: 3mm 2mm !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            background: #fff !important;
            color: #000 !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `,
        }}
      />

      <div className="w-[52mm] mx-auto text-center space-y-1">
        {/* Header */}
        <div className="border-b border-dashed border-black pb-2 mb-2">
          <p className="font-bold text-[13px] tracking-wider uppercase">REKAPITULASI KASIR</p>
          <p className="font-bold text-[14px]">KACA PUTIH</p>
          <p className="text-[9px]">Jl. Hamid Rusdi Tim. No.350, Malang</p>
        </div>

        {/* Shift Details */}
        <div className="text-[10px] text-left space-y-0.5 border-b border-dashed border-black pb-2 mb-2">
          <div className="flex justify-between">
            <span>Kasir      :</span>
            <span className="font-bold">{shift.cashier_name}</span>
          </div>
          <div className="flex justify-between">
            <span>Shift      :</span>
            <span className="font-bold">{shiftLabel}</span>
          </div>
          <div className="flex justify-between">
            <span>Buka Shift :</span>
            <span>{formattedOpen}</span>
          </div>
          <div className="flex justify-between">
            <span>Tutup Shift:</span>
            <span>{formattedClose}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Nota :</span>
            <span className="font-bold">{shift.orders_count} Transaksi</span>
          </div>
        </div>

        {/* Sales by Payment Method */}
        <div className="text-[10px] text-left space-y-1 border-b border-dashed border-black pb-2 mb-2">
          <p className="font-bold text-center border-b border-black pb-0.5 mb-1">RINCIAN PENJUALAN</p>
          <div className="flex justify-between">
            <span>Uang Tunai (Cash):</span>
            <span className="font-bold">{formatIDR(shift.total_cash_sales)}</span>
          </div>
          <div className="flex justify-between">
            <span>Non-Tunai (QRIS) :</span>
            <span className="font-bold">{formatIDR(shift.total_qris_sales)}</span>
          </div>
          <div className="flex justify-between">
            <span>Debit / Kartu    :</span>
            <span className="font-bold">{formatIDR(shift.total_card_sales)}</span>
          </div>
          <div className="flex justify-between border-t border-black pt-1 font-bold text-[11px]">
            <span>OMSET PENJUALAN  :</span>
            <span>{formatIDR(shift.total_sales)}</span>
          </div>
        </div>

        {/* Cash Drawer Reconciliation */}
        <div className="text-[10px] text-left space-y-1 border-b border-dashed border-black pb-2 mb-2">
          <p className="font-bold text-center border-b border-black pb-0.5 mb-1">REKONSILIASI LACI KAS</p>
          <div className="flex justify-between">
            <span>Modal Awal Laci  :</span>
            <span>{formatIDR(shift.starting_cash)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Kas Masuk  :</span>
            <span>+{formatIDR(shift.total_cash_sales)}</span>
          </div>
          <div className="flex justify-between font-bold border-t border-black pt-0.5">
            <span>Harus Ada di Laci:</span>
            <span>{formatIDR(shift.expected_cash || (shift.starting_cash + shift.total_cash_sales))}</span>
          </div>
          <div className="flex justify-between">
            <span>Kas Fisik Aktual :</span>
            <span className="font-bold">{formatIDR(shift.actual_cash || 0)}</span>
          </div>
          <div className="flex justify-between font-bold text-[11px] border-t border-dashed border-black pt-1">
            <span>SELISIH KAS      :</span>
            <span>{diffStatus}</span>
          </div>
        </div>

        {/* Signatures */}
        <div className="text-[9px] pt-3 grid grid-cols-2 gap-2 text-center">
          <div>
            <p>Kasir Bertugas,</p>
            <div className="h-8"></div>
            <p className="border-t border-black pt-0.5">({shift.cashier_name})</p>
          </div>
          <div>
            <p>Supervisor / SPV,</p>
            <div className="h-8"></div>
            <p className="border-t border-black pt-0.5">( ................... )</p>
          </div>
        </div>
      </div>
    </div>
  );
}
