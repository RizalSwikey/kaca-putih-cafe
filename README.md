# Kaca Putih Cafe & Kitchen — Web Platform & Kitchen Display System

Modern, fullstack digital ordering platform and real-time Kitchen Display System (KDS) engineered for **Kaca Putih Cafe & Kitchen** (Jl. Kaca Putih, Malang, East Java, Indonesia).

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase SSR / Realtime**, **Lucide React**, and **Framer Motion**.

---

## 🏛️ Brand Identity & Design System

The visual language is derived directly from the physical cafe's branding and print menu catalog (`MenuKacaputih.pdf`):
- **Deep Forest Green** (`#1F4A34`): Anchor tone reflecting colonial greenhouse botany, primary navbars, buttons, and typography highlights.
- **Warm Cream Canvas** (`#F7F5F0`): Warm paper/linen backdrop reducing eye strain during indoor and outdoor dining.
- **Espresso** (`#1E1E1E`): High-contrast editorial headers and metadata text.
- **Frosted Glass Elements**: `backdrop-blur-md bg-white/70 border border-stone-200/40`.
- **Monoline Vector Emblem (Logo Mark)**: Symmetrical botanical wreath arch, colonial awning house pediment, centered porcelain coffee cup with aroma steam curves, and crossed fork & spoon.
- **Typography-First Editorial Menu**: Curated cards with category tags, signature badges, price pills, and daily bakery indicators ensuring premium visual presentation across all items.

---

## 📋 Comprehensive Business Logic & Operational Workflows

### 1. Dual-Schedule Operating Hours (Malang / WIB Timezone)
The cafe runs two operational profiles depending on the calendar season, managed dynamically via store settings:
- **Regular Hours Schedule**: `09:00 – 22:00 WIB`
- **Ramadan Special Schedule**: `12:00 – 23:00 WIB` (adjusted for late evening dining / iftar & suhoor crowds)

#### Detection & Clock Algorithm:
1. The platform computes current time specifically in `Asia/Jakarta` (WIB, UTC+7), preventing client device clock skew from showing incorrect store states.
2. The current WIB hour is evaluated against `store_settings.is_ramadan_mode`.
3. The store header displays an active **WIB ticker clock**, an animated status indicator (**Open Now** vs. **Closed**), and the active operational schedule badge.

---

### 2. Fulfillment Workflows

```
                           ┌──────────────────────────────┐
                           │ Customer Visits Digital Menu │
                           └──────────────┬───────────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
       [Dine-In Workflow]                           [Takeaway Workflow]
 ┌───────────────────────────┐                 ┌───────────────────────────┐
 │ Scans Table QR Code       │                 │ Clicks "Takeaway Pickup"  │
 │ URL: `/?table=5`          │                 │ URL: `/?type=takeaway`    │
 │ Table Auto-Assigned (#5)  │                 │ Counter Order Mode        │
 └─────────────┬─────────────┘                 └─────────────┬─────────────┘
               │                                             │
               └──────────────────────┬──────────────────────┘
                                      │
                         ┌────────────▼───────────┐
                         │ Browse Menu Categories │
                         │ & Select Customization │
                         └────────────┬───────────┘
                                      │
                   ┌──────────────────┼──────────────────┐
                   ▼                  ▼                  ▼
             [Temperature]     [Bakery Flavor]    [Add-On Booster]
              Hot vs. Cold     Shio Pan Options   Extra Shot (+8K)
                   └──────────────────┬──────────────────┘
                                      │
                         ┌────────────▼───────────┐
                         │ Add to Tray (Zustand)  │
                         └────────────┬───────────┘
                                      │
                         ┌────────────▼───────────┐
                         │    Checkout Modal      │
                         │ Customer Name & Phone  │
                         │ Cash / QRIS / Card     │
                         └────────────┬───────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        [Live Production Mode]               [Recruiter Sandbox Mode]
   ┌────────────────────────────────┐   ┌────────────────────────────────┐
   │ 1. Insert DB (orders + items)  │   │ 1. Local isolated state insert │
   │ 2. WhatsApp: +6282245406501    │   │ 2. Suppress WhatsApp dispatch  │
   │ 3. Redirect: /track/:code      │   │ 3. Instant /track/:code demo   │
   └────────────────────────────────┘   └────────────────────────────────┘
```

#### A. Dine-In Workflow:
- Tables feature QR stickers pointing to `/?table=N` (or `/?t=N`).
- The application automatically extracts the table number and sets fulfillment mode to `dine_in`.
- If table number is unassigned, customers can enter their table number directly on the header or during checkout.

#### B. Takeaway / Pickup Workflow:
- One-tap toggle switches to `takeaway`.
- Omits table number requirement and tags the ticket for counter collection.

---

### 3. Variant & Customization Hierarchy
Items in `MenuKacaputih.pdf` feature custom flavor selections and beverage parameters handled by `src/components/menu/VariantDrawer.tsx`:
- **Temperature Options**: Hot vs. Ice (with beverage-specific price deltas, e.g., Black Coffee Ice +2K, Matcha Cold +2K).
- **Japanese Salt Bread (Shio Pan) Varieties**:
  - *Original Butter* (Base: 18K)
  - *Chocolate* (+0K)
  - *Garlic Butter* (+2K)
  - *Sausage Savory* (+3K)
  - *Smoked Beef Mozarella* (+4K)
- **Cinnamon Roll Options**: *Classic Glaze* (+0K) vs. *Cream Cheese Frosting* (+3K).
- **Enoki & Snacks Options**: *Barbeque* vs. *Balado*; *Melted Chocolate* vs. *Shredded Cheese*; *Icing Sugar* vs. *Brown Sugar*.
- **Add-On Booster**: *Extra Espresso Shot* (+8,000 IDR) available for all coffee and milk beverages.
- **Kitchen Notes**: Freeform field for customer requests ("Less sweet", "Separate sauce", "Extra napkins").

---

### 4. Hybrid Dispatch & Payment Integration

#### Payment Methods Supported:
1. **QRIS (Quick Response Code Indonesian Standard)**:
   - Instant digital payments across GoPay, OVO, Dana, ShopeePay, BCA, Livin' by Mandiri, and Indonesian banking apps.
   - Dynamic QR preview and payment instruction banner embedded in checkout and live tracker.
2. **Cash (Tunai)**:
   - Order queued immediately; payment settled at the cashier counter upon order preparation.
3. **Card (Debit & Credit)**:
   - Settled at cashier using EDC terminal (GPN, Visa, Mastercard).

#### WhatsApp Dispatch Automation:
Upon successful submission, the system formats a comprehensive order manifest for the store's dispatch number (**+6282245406501**):
```
*KACA PUTIH CAFE & KITCHEN*
*NEW ORDER NOTIFICATION*
----------------------------------------
*Order Code:* #KP-8W2A
*Order Type:* Dine In (Table 5)
*Customer:* Budi Santoso (+6281234567890)
*Payment:* QRIS
----------------------------------------
*ORDER ITEMS:*
1. *1x Mont Blanc* — Rp 30.000
2. *2x Japanese Salt Bread (Shio Pan)* (Smoked Beef Mozarella) — Rp 44.000
----------------------------------------
*TOTAL AMOUNT:* *Rp 74.000*
----------------------------------------
Pesanan ini dikirim via Sistem Web Kaca Putih.
```

---

### 5. Order Lifecycle & Real-Time Kitchen Display System (KDS)

```
 [ Customer Order Created ]
            │
            ▼
 ┌──────────────────────┐
 │    1. NEW ORDERS     │ ◄── Audio Chime Rings (Web Audio API)
 └──────────┬───────────┘
            │ 1-Tap "Start Prep"
            ▼
 ┌──────────────────────┐
 │    2. PREPARING      │ ◄── Barista & Chef crafting items; SLA Timer counts
 └──────────┬───────────┘
            │ 1-Tap "Mark Ready"
            ▼
 ┌──────────────────────┐
 │ 3. READY TO SERVE    │ ◄── Runner serves to table or counter pickup call
 └──────────┬───────────┘
            │ 1-Tap "Complete"
            ▼
 ┌──────────────────────┐
 │    4. COMPLETED      │ ◄── Order archived; Tracker shows green check
 └──────────────────────┘
```

#### Real-Time Engine & Kitchen Audio Alerts:
- **Supabase Realtime Channel**: Listens to `INSERT` and `UPDATE` on the `orders` table with full replica identity.
- **Web Audio API Chime**: Native synthesized harmonic two-tone doorbell chime (F5 698.46Hz -> A5 880Hz) fires when new orders arrive, alerting baristas even if working away from the screen. Zero external MP3 files required.
- **Elapsed SLA Indicators**:
  - `Just now` / `<15m`: Normal operational flow (Neutral gray/stone).
  - `>15m`: Caution threshold (Amber badge).
  - `>25m`: Urgent SLA breach threshold (Red pulsing alert).
- **One-Tap Card Progression**: Touchscreen-optimized advancement buttons to quickly move tickets forward or revert if needed.

---

### 6. Live Customer Order Tracker (`/track/:code`)
- Accessible via unique `#KP-XXXX` order code.
- Synchronized via Supabase Realtime and local bus events.
- Features real-time 4-step progress bar, order items breakdown, fulfillment metadata, and direct WhatsApp support trigger.

---

### 7. Inventory & Daily Bakery Stock Management (`/admin`)
- **Daily Bakery Batch Controls**:
  - Artisan Japanese Salt Bread (Shio Pan) batches baked in morning and afternoon slots.
  - One-tap sold-out toggles for individual varieties (e.g. mark *Smoked Beef Mozarella* as sold-out while *Original Butter* remains available).
- **Ramadan Hours Switcher**:
  - Toggles between regular schedule (09:00 - 22:00) and Ramadan schedule (12:00 - 23:00) with immediate store-wide synchronization.

---

### 8. Recruiter & Portfolio Sandbox Mode
- Recruiter demo banner present in the navigation and admin dashboard.
- Enables safe exploratory testing:
  - Suppresses live WhatsApp redirections.
  - Prevents production database mutations while simulating the full flow through local storage and in-memory event buses.
  - Includes a 1-tap **Recruiter Sandbox Access** button on `/admin` to bypass authentication without needing a production invite token.

---

## 🗄️ Database Architecture (PostgreSQL / Supabase)

### Entity Relationship Model:
- `categories`: Menu categorization with slug and sort order.
- `products`: Base catalog items with descriptions, base prices, signature badges, and bakery batch flags.
- `product_variants`: Flavors and hot/cold options with price deltas.
- `orders`: Order headers storing codes (`#KP-XXXX`), fulfillment types, customer contacts, statuses, and payment methods.
- `order_items`: Order line items referencing product, variant, quantity, unit price, and special notes.
- `store_settings`: Single-row configuration managing Ramadan schedule, store hours, and dispatch phone.

The repository includes:
- `schema.sql`: Full DDL, indexes, realtime publications, and RLS policies.
- `seed.sql`: Data extracted strictly from `MenuKacaputih.pdf` with sample benchmark orders.

---

## 💻 Tech Stack Summary

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14.2 (App Router) |
| **Language** | TypeScript 5.5+ |
| **Styling** | Tailwind CSS 3.4 (Custom Brand Color Tokens) |
| **State Management** | Zustand 5.0 (Persistent Order Tray) |
| **Database & Realtime** | Supabase SSR (`@supabase/ssr`, `@supabase/supabase-js`) |
| **Audio Alert** | Web Audio API (Synthesized Chime) |
| **Icons** | Lucide React |
| **Animations** | Framer Motion & CSS Animations |

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js 18+ or Bun 1.1+
- Git

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/RizalSwikey/kaca-putih-cafe.git
cd kaca-putih-cafe

# Install dependencies
bun install
# or: npm install
```

### Environment Configuration
```bash
cp .env.example .env.local
```
Configure your credentials in `.env.local`:
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_WHATSAPP_NUMBER=+6282245406501
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
*(Note: If Supabase credentials are not provided, the application automatically activates its offline-first mock fallback engine with initial seed orders).*

### Running Locally
```bash
bun run dev
# or: npm run dev
```
Open:
- **Customer Menu**: [http://localhost:3000](http://localhost:3000)
- **Customer Dine-In Simulation**: [http://localhost:3000/?table=5](http://localhost:3000/?table=5)
- **Kitchen Display System (KDS)**: [http://localhost:3000/kitchen](http://localhost:3000/kitchen)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

### Production Build
```bash
bun run build
bun run start
```

---

## 👤 Author & Maintainer

- **Developer**: Rizal Akbar Syah Fauzan Putra
- **GitHub**: [@RizalSwikey](https://github.com/RizalSwikey)
- **Repository**: [https://github.com/RizalSwikey/kaca-putih-cafe.git](https://github.com/RizalSwikey/kaca-putih-cafe.git)
- **Location**: Malang, East Java, Indonesia
