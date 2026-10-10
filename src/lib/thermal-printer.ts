import { Order, CashierShift } from "@/types";
import { formatIDR } from "./utils";

/**
 * Format order into clean 58mm plain text receipt for thermal printers
 */
export function formatOrderToPlainText(order: Order): string {
  const dateObj = new Date(order.created_at);
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const sep = "--------------------------------\n"; // 32 chars standard 58mm
  const isDineIn = order.order_type === "dine_in";
  const orderTypeStr = isDineIn ? `DINE IN (MEJA ${order.table_number || "-"})` : "TAKEAWAY (BUNGKUS)";

  let text = "";
  text += "         KACA PUTIH           \n";
  text += "       CAFE & KITCHEN         \n";
  text += "  Jl. Hamid Rusdi Tim. No.350 \n";
  text += "   Bunulrejo, Blimbing, Malang\n";
  text += "     WA: +62 822-4540-6501    \n";
  text += sep;
  text += `No. Nota : ${order.code}\n`;
  text += `Waktu    : ${formattedDate} ${formattedTime}\n`;
  text += `Tipe     : ${orderTypeStr}\n`;
  text += `Pelanggan: ${order.customer_name || "Walk-in"}\n`;
  text += sep;

  order.items?.forEach((item) => {
    // line 1: name
    text += `${item.product_name}\n`;
    // line 2: qty x price ... total
    const qtyPrice = `  ${item.quantity} x ${formatIDR(item.unit_price)}`;
    const lineTotal = formatIDR(item.unit_price * item.quantity);
    const spaceCount = Math.max(1, 32 - qtyPrice.length - lineTotal.length);
    text += qtyPrice + " ".repeat(spaceCount) + lineTotal + "\n";
    if (item.variant_name) {
      text += `   (${item.variant_name})\n`;
    }
    if (item.extra_shot) {
      text += `   [+Extra Shot]\n`;
    }
    if (item.notes) {
      text += `   *${item.notes}\n`;
    }
  });

  text += sep;
  const totalLabel = "TOTAL :";
  const totalVal = formatIDR(order.total_amount);
  const totalSpaces = Math.max(1, 32 - totalLabel.length - totalVal.length);
  text += `${totalLabel}${" ".repeat(totalSpaces)}${totalVal}\n`;

  const payLabel = "Metode Bayar :";
  const payVal = order.payment_method.toUpperCase();
  const paySpaces = Math.max(1, 32 - payLabel.length - payVal.length);
  text += `${payLabel}${" ".repeat(paySpaces)}${payVal}\n`;

  if (order.payment_method === "cash") {
    const cashInLabel = "Tunai Diterima :";
    const cashInVal = formatIDR(order.cash_tendered || order.total_amount);
    const inSpaces = Math.max(1, 32 - cashInLabel.length - cashInVal.length);
    text += `${cashInLabel}${" ".repeat(inSpaces)}${cashInVal}\n`;

    const changeLabel = "Kembalian :";
    const changeVal = formatIDR(order.cash_change || 0);
    const changeSpaces = Math.max(1, 32 - changeLabel.length - changeVal.length);
    text += `${changeLabel}${" ".repeat(changeSpaces)}${changeVal}\n`;
  }

  text += sep;
  text += " TERIMA KASIH ATAS KUNJUNGANNYA\n";
  text += "Kenyamanan Anda Kebahagiaan Kami\n";
  text += " Wifi: KacaPutih_Guest / bunul350\n\n\n\n";

  return text;
}

/**
 * Format shift report into clean 58mm plain text for thermal printers
 */
export function formatShiftToPlainText(shift: CashierShift): string {
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

  const shiftLabel = shift.shift_type === "morning" ? "PAGI (09:00 - 15:30)" : "SIANG (15:30 - 22:00)";
  const sep = "--------------------------------\n";

  let text = "";
  text += "       REKAPITULASI KASIR       \n";
  text += "           KACA PUTIH           \n";
  text += "   Bunulrejo, Blimbing, Malang  \n";
  text += sep;
  text += `Kasir : ${shift.cashier_name}\n`;
  text += `Shift : ${shiftLabel}\n`;
  text += `Buka  : ${formattedOpen}\n`;
  text += `Tutup : ${formattedClose}\n`;
  text += `Nota  : ${shift.orders_count} Transaksi\n`;
  text += sep;
  text += "       RINCIAN PENJUALAN        \n";
  text += `Tunai (Cash) : ${formatIDR(shift.total_cash_sales)}\n`;
  text += `QRIS         : ${formatIDR(shift.total_qris_sales)}\n`;
  text += `Debit/Kartu  : ${formatIDR(shift.total_card_sales)}\n`;
  text += `OMSET TOTAL  : ${formatIDR(shift.total_sales)}\n`;
  text += sep;
  text += "      REKONSILIASI LACI KAS     \n";
  text += `Modal Awal   : ${formatIDR(shift.starting_cash)}\n`;
  text += `Kas Masuk    : +${formatIDR(shift.total_cash_sales)}\n`;
  text += `Target Laci  : ${formatIDR(shift.expected_cash || (shift.starting_cash + shift.total_cash_sales))}\n`;
  text += `Fisik Laci   : ${formatIDR(shift.actual_cash || 0)}\n`;

  const diff = shift.cash_difference ?? 0;
  const diffStr = diff === 0 ? "PAS / COCOK" : diff > 0 ? `LEBIH (+${formatIDR(diff)})` : `KURANG (${formatIDR(diff)})`;
  text += `SELISIH KAS  : ${diffStr}\n`;
  text += sep;
  text += " Kasir Bertugas,  Supervisor,   \n\n\n";
  text += ` (${shift.cashier_name})    (.............)   \n\n\n\n`;

  return text;
}

/**
 * Print via Android RawBT intent helper
 * Direct bridge to Bluetooth thermal printer (Sharkpos) on Android tablets
 */
export function printViaRawBT(plainText: string) {
  if (typeof window === "undefined") return;
  const encodedText = encodeURIComponent(plainText);
  // Intent URI scheme supported by RawBT app on Android
  window.location.href = `rawbt:${encodedText}`;
}

/**
 * Direct Web Bluetooth (BLE) printing
 * Connects to Sharkpos/generic thermal printer BLE GATT service (000018f0 or standard 0xffe0/0x18f0)
 */
export async function printViaWebBluetooth(plainText: string): Promise<boolean> {
  if (typeof window === "undefined" || !("bluetooth" in navigator)) {
    throw new Error("Web Bluetooth tidak didukung di browser ini.");
  }

  const nav = navigator as Navigator & {
    bluetooth: {
      requestDevice: (options: unknown) => Promise<{
        gatt?: {
          connect: () => Promise<{
            getPrimaryService: (uuid: string | number) => Promise<{
              getCharacteristic: (uuid: string | number) => Promise<{
                writeValue: (data: Uint8Array) => Promise<void>;
              }>;
            }>;
            disconnect: () => void;
          }>;
        };
      }>;
    };
  };

  const device = await nav.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [
      "000018f0-0000-1000-8000-00805f9b34fb",
      "0000ffe0-0000-1000-8000-00805f9b34fb",
      "0000ae01-0000-1000-8000-00805f9b34fb",
      0x18f0,
      0xffe0,
    ],
  });

  if (!device.gatt) throw new Error("GATT server tidak ditemukan.");

  const server = await device.gatt.connect();

  // Find printer primary service
  const serviceUuids = [
    "000018f0-0000-1000-8000-00805f9b34fb",
    "0000ffe0-0000-1000-8000-00805f9b34fb",
    "0000ae01-0000-1000-8000-00805f9b34fb",
  ];
  let service: {
    getCharacteristic: (uuid: string | number) => Promise<{
      writeValue: (data: Uint8Array) => Promise<void>;
    }>;
  } | null = null;
  for (const uuid of serviceUuids) {
    try {
      service = await server.getPrimaryService(uuid);
      if (service) break;
    } catch {
      // try next
    }
  }
  if (!service) {
    throw new Error("Service thermal printer tidak ditemukan pada perangkat Bluetooth ini.");
  }

  // Find write characteristic
  const charUuids = [
    "00002af1-0000-1000-8000-00805f9b34fb",
    "0000ffe1-0000-1000-8000-00805f9b34fb",
    "0000ae02-0000-1000-8000-00805f9b34fb",
  ];
  let characteristic: {
    writeValue: (data: Uint8Array) => Promise<void>;
  } | null = null;
  for (const uuid of charUuids) {
    try {
      characteristic = await service.getCharacteristic(uuid);
      if (characteristic) break;
    } catch {
      // try next
    }
  }
  if (!characteristic) {
    throw new Error("Karakteristik cetak tidak ditemukan.");
  }

  // Initialize printer and send text data in chunks (BLE MTU ~100 bytes)
  const encoder = new TextEncoder();
  // ESC @ (init)
  const initBytes = new Uint8Array([0x1b, 0x40]);
  await characteristic.writeValue(initBytes);

  const textBytes = encoder.encode(plainText);
  const CHUNK_SIZE = 64;
  for (let i = 0; i < textBytes.length; i += CHUNK_SIZE) {
    const chunk = textBytes.slice(i, i + CHUNK_SIZE);
    await characteristic.writeValue(chunk);
    await new Promise((r) => setTimeout(r, 20));
  }

  // Feed 4 lines and cut: GS V 66 0
  const feedCut = new Uint8Array([0x1d, 0x56, 0x42, 0x00]);
  try {
    await characteristic.writeValue(feedCut);
  } catch {
    // cutter optional
  }

  server.disconnect();
  return true;
}
