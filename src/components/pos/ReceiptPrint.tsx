import React from "react";
import { Order } from "@/types";
import { formatIDR } from "@/lib/utils";

interface ReceiptPrintProps {
  order: Order | null;
}

export function ReceiptPrint({ order }: ReceiptPrintProps) {
  if (!order) return null;

  const orderDate = new Date(order.created_at);
  const formattedDate = orderDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = orderDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const isDineIn = order.order_type === "dine_in";
  const fulfillmentText = isDineIn
    ? `DINE IN (MEJA ${order.table_number || "-"})`
    : "TAKEAWAY (BUNGKUS)";

  return (
    <div id="receipt-print-area" className="hidden print:block font-mono text-black text-[12px] leading-tight p-0 m-0">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: 58mm auto;
            margin: 0mm;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            color: #000 !important;
          }
          body * {
            visibility: hidden;
          }
          #receipt-print-area, #receipt-print-area * {
            visibility: visible;
          }
          #receipt-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 58mm;
            padding: 3mm;
            box-sizing: border-box;
            background: #fff !important;
            color: #000 !important;
          }
        }
      `}} />

      <div className="w-[52mm] mx-auto text-center space-y-1">
        {/* Header Store Info */}
        <div className="border-b border-dashed border-black pb-2 mb-2">
          <p className="font-bold text-[14px] tracking-wider uppercase">KACA PUTIH</p>
          <p className="text-[10px] tracking-widest uppercase">CAFE &amp; KITCHEN</p>
          <p className="text-[9px] mt-1">Jl. Hamid Rusdi Tim. No.350</p>
          <p className="text-[9px]">Bunulrejo, Blimbing, Malang</p>
          <p className="text-[9px]">Telp/WA: +62 822-4540-6501</p>
        </div>

        {/* Transaction Metadata */}
        <div className="text-[10px] text-left space-y-0.5 border-b border-dashed border-black pb-2 mb-2">
          <div className="flex justify-between">
            <span>No. Nota :</span>
            <span className="font-bold">{order.code}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal  :</span>
            <span>{formattedDate} {formattedTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Tipe     :</span>
            <span className="font-bold">{fulfillmentText}</span>
          </div>
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span>{order.customer_name || "Walk-in"}</span>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="text-[10px] text-left border-b border-dashed border-black pb-2 mb-2">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left py-0.5 font-bold">ITEM</th>
                <th className="text-right py-0.5 font-bold">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx} className="align-top">
                  <td className="py-1 pr-1">
                    <p className="font-semibold">{item.product_name}</p>
                    <div className="text-[9px] pl-1 text-gray-800">
                      <span>{item.quantity} x {formatIDR(item.unit_price)}</span>
                      {item.variant_name && <span> ({item.variant_name})</span>}
                      {item.extra_shot && <span> [+Extra Shot]</span>}
                      {item.notes && <p className="italic">*{item.notes}</p>}
                    </div>
                  </td>
                  <td className="text-right py-1 font-mono font-bold whitespace-nowrap">
                    {formatIDR(item.unit_price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation & Payment Summary */}
        <div className="text-[11px] text-left space-y-1 border-b border-dashed border-black pb-2 mb-2 font-mono">
          <div className="flex justify-between font-bold text-[12px]">
            <span>TOTAL :</span>
            <span>{formatIDR(order.total_amount)}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Metode Bayar:</span>
            <span className="uppercase font-bold">{order.payment_method}</span>
          </div>
          {order.payment_method === "cash" && (
            <>
              <div className="flex justify-between text-[10px]">
                <span>Tunai Diterima:</span>
                <span>{formatIDR(order.cash_tendered || order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold">
                <span>Kembalian:</span>
                <span>{formatIDR(order.cash_change || 0)}</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Notes */}
        <div className="text-[9px] text-center pt-1 space-y-0.5">
          <p className="font-bold">TERIMA KASIH ATAS KUNJUNGANNYA</p>
          <p>Kenyamanan Anda Kebahagiaan Kami</p>
          <p className="text-[8px] text-gray-600">Wifi: KacaPutih_Guest / Pass: bunulrejo350</p>
        </div>
      </div>
    </div>
  );
}
