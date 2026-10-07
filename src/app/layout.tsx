import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/cart/CheckoutModal";

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
    title: "Kaca Putih Cafe & Kitchen",
    description: "Artisanal Coffee, Japanese Salt Bread & Dining in Malang",
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
      <body className="min-h-screen bg-cream flex flex-col text-espresso selection:bg-forest selection:text-cream-50">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <CartDrawer />
        <CheckoutModal />
        <footer className="w-full bg-forest-dark text-cream-200 py-8 px-4 border-t border-forest-light/40 text-center text-xs">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
            <p className="font-serif text-cream-50 text-base font-semibold tracking-wide">
              Kaca Putih Cafe & Kitchen
            </p>
            <p className="text-cream-300 text-[11px] font-sans">
              Jl. Hamid Rusdi Tim. No.350, Bunulrejo, Blimbing, Malang • WhatsApp: +62 822-4540-6501
            </p>
            <p className="text-cream-muted text-[10px] mt-2">
              © {new Date().getFullYear()} Kaca Putih Cafe & Kitchen. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
