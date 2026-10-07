import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/cart/CheckoutModal";
import { Logo } from "@/components/brand/Logo";
import { MapPin, MessageCircle, Clock, ChefHat, ShieldCheck, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Kaca Putih Cafe & Kitchen | Artisanal Coffee & Bakery di Bunulrejo, Malang",
  description:
    "Official website & digital ordering platform for Kaca Putih Cafe & Kitchen, Bunulrejo, Malang. Authentic specialty coffee, daily fresh Japanese Salt Bread (Shio Pan), and comfort dining.",
  keywords: [
    "Kaca Putih",
    "Kaca Putih Cafe",
    "Cafe Bunulrejo Malang",
    "Japanese Salt Bread Malang",
    "Shio Pan Malang",
    "Mont Blanc Coffee",
    "Hidden Gem Cafe Malang",
  ],
  authors: [{ name: "Kaca Putih Cafe & Kitchen" }],
  openGraph: {
    title: "Kaca Putih Cafe & Kitchen | Artisanal Coffee & Bakery",
    description: "Terselip di Sudut Bunulrejo, Hangat di Setiap Seduhan. Nikmati specialty coffee dan fresh Japanese Salt Bread harian.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] flex flex-col text-espresso selection:bg-forest selection:text-cream-50 font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <CartDrawer />
        <CheckoutModal />

        {/* Editorial Brand Footer */}
        <footer className="w-full bg-[#153424] text-cream-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-forest-light/30">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-forest-light/20">
            {/* Col 1: Brand crest & identity statement (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <Logo variant="horizontal" size="sm" light />
              </div>
              <p className="text-xs text-cream-300 leading-relaxed max-w-sm font-normal">
                Sebuah ruang singgah di sudut tenang Bunulrejo, Blimbing, Malang. Memadukan racikan specialty coffee, aroma roti bantal gurih harian, dan keramahan rumah.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-cream-300/80">
                <Heart className="w-3.5 h-3.5 text-amber-300" />
                <span>Diseduh dan dipanggang dengan ketulusan setiap hari.</span>
              </div>
            </div>

            {/* Col 2: Navigation & Sections (3 cols) */}
            <div className="md:col-span-3 space-y-3 text-xs">
              <span className="font-serif font-bold text-sm text-cream-50 block uppercase tracking-wider">
                Eksplorasi
              </span>
              <ul className="space-y-2 text-cream-300">
                <li>
                  <Link href="/#menu-catalog" className="hover:text-cream-50 transition-colors">
                    Menu Lengkap
                  </Link>
                </li>
                <li>
                  <Link href="/#khas-kaca-putih" className="hover:text-cream-50 transition-colors">
                    Racikan Paling Dicari
                  </Link>
                </li>
                <li>
                  <Link href="/#artisan-bakery" className="hover:text-cream-50 transition-colors">
                    Japanese Salt Bread (Shio Pan)
                  </Link>
                </li>
                <li>
                  <Link href="/#tentang-kaca-putih" className="hover:text-cream-50 transition-colors">
                    Cerita Bunulrejo
                  </Link>
                </li>
                <li>
                  <Link href="/#lokasi-kunjungan" className="hover:text-cream-50 transition-colors">
                    Lokasi &amp; Jam Buka
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Location & Operational Contacts (4 cols) */}
            <div className="md:col-span-4 space-y-3 text-xs">
              <span className="font-serif font-bold text-sm text-cream-50 block uppercase tracking-wider">
                Kunjungan &amp; Kontak
              </span>
              <div className="space-y-2.5 text-cream-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    Jl. Hamid Rusdi Tim. No.350, Bunulrejo, Blimbing, Malang, Jawa Timur
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Reguler: 09:00 – 22:00 WIB • Ramadan: 12:00 – 23:00 WIB</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>WhatsApp: +62 822-4540-6501</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Discreet Staff Links */}
          <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-cream-muted">
            <p>
              © {new Date().getFullYear()} Kaca Putih Cafe &amp; Kitchen. All rights reserved.
            </p>

            {/* Discreet Staff Portal Links */}
            <div className="flex items-center gap-4 text-cream-300/60">
              <Link
                href="/kitchen"
                className="hover:text-cream-200 transition-colors flex items-center gap-1"
                title="Kitchen Display System"
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Kitchen KDS</span>
              </Link>
              <span>•</span>
              <Link
                href="/admin"
                className="hover:text-cream-200 transition-colors flex items-center gap-1"
                title="Admin Backoffice"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Staff Admin</span>
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
