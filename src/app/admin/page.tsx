"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Sparkles,
  Lock,
  LogOut,
  Croissant,
  Check,
  X,
  Moon,
  Sun,
  Store,
} from "lucide-react";
import { PRODUCTS, DEFAULT_STORE_SETTINGS } from "@/data/menu";
import { Product, StoreSettings } from "@/types";
import { useCartStore } from "@/lib/cart-store";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminPage() {
  const isDemoMode = useCartStore((s) => s.isDemoMode);
  const setIsDemoMode = useCartStore((s) => s.setIsDemoMode);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Store Settings & Bakery Availability State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [bakeryStatus, setBakeryStatus] = useState<Record<string, boolean>>({
    "var-sb-original": true,
    "var-sb-chocolate": true,
    "var-sb-garlic": true,
    "var-sb-sausage": true,
    "var-sb-smoked-beef": true,
    "var-cr-classic": true,
    "var-cr-creamcheese": true,
  });

  // Check Supabase session on mount
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }: { data: { session: { user?: { email?: string } } | null } }) => {
        if (data.session) {
          setIsAuthenticated(true);
          setCurrentUser(data.session.user?.email || "Admin");
        }
      });
    } else {
      // If local demo mode, check session storage
      const localSession = sessionStorage.getItem("kp_admin_authenticated");
      if (localSession === "true") {
        setIsAuthenticated(true);
        setCurrentUser("recruiter.demo@kacaputih.com");
      }
    }

    // Load saved bakery overrides from localStorage if present
    try {
      const savedBakery = localStorage.getItem("kp_bakery_status");
      if (savedBakery) {
        setBakeryStatus(JSON.parse(savedBakery));
      }
      const savedSettings = localStorage.getItem("kp_store_settings");
      if (savedSettings) {
        setStoreSettings(JSON.parse(savedSettings));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) {
          setAuthError(error.message);
        } else if (data.session) {
          setIsAuthenticated(true);
          setCurrentUser(data.user?.email || "Admin");
        }
      } catch {
        setAuthError("Failed to connect to Supabase Auth.");
      } finally {
        setAuthLoading(false);
      }
    } else {
      // Demo password check
      if (authPassword === "admin123" || authEmail.includes("kacaputih")) {
        setIsAuthenticated(true);
        setCurrentUser(authEmail || "admin@kacaputih.com");
        sessionStorage.setItem("kp_admin_authenticated", "true");
      } else {
        setAuthError("For demo access: use password 'admin123' or tap '1-Tap Demo Staff Login'.");
      }
      setAuthLoading(false);
    }
  };

  const handleDemoBypassLogin = () => {
    setIsAuthenticated(true);
    setCurrentUser("recruiter.reviewer@kacaputih.com");
    sessionStorage.setItem("kp_admin_authenticated", "true");
  };

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem("kp_admin_authenticated");
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const toggleBakeryVariant = (variantId: string) => {
    const next = { ...bakeryStatus, [variantId]: !bakeryStatus[variantId] };
    setBakeryStatus(next);
    localStorage.setItem("kp_bakery_status", JSON.stringify(next));
  };

  const toggleProductAvailability = (productId: string) => {
    const updated = productsList.map((p) =>
      p.id === productId ? { ...p, is_available: !p.is_available } : p
    );
    setProductsList(updated);
  };

  const toggleRamadanMode = () => {
    const nextSettings: StoreSettings = {
      ...storeSettings,
      is_ramadan_mode: !storeSettings.is_ramadan_mode,
      open_time: !storeSettings.is_ramadan_mode ? "12:00:00" : "09:00:00",
      close_time: !storeSettings.is_ramadan_mode ? "23:00:00" : "22:00:00",
    };
    setStoreSettings(nextSettings);
    localStorage.setItem("kp_store_settings", JSON.stringify(nextSettings));
  };

  // If not authenticated, render login form with Demo bypass
  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-cream-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-cream-border p-6 sm:p-8 shadow-floating">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-forest text-cream-50 mb-3 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-espresso">
              Kaca Putih Backoffice
            </h1>
            <p className="text-xs text-espresso-muted mt-1">
              Supabase Auth & Cafe Management Control Center
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                Staff Email
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="staff@kacaputih.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-card border border-cream-border text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-card border border-cream-border text-xs text-espresso focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 px-4 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {authLoading ? "Authenticating..." : "Login to Backoffice"}
            </button>
          </form>

          {/* Recruiter / Reviewer 1-Tap Demo Access */}
          <div className="mt-6 pt-5 border-t border-cream-border text-center">
            <p className="text-[11px] text-stone-500 mb-2.5">
              Testing the platform for portfolio review or inspection?
            </p>
            <button
              type="button"
              onClick={handleDemoBypassLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>1-Tap Recruiter Sandbox Access</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const saltBread = PRODUCTS.find((p) => p.id === "prod-salt-bread");
  const cinnamonRoll = PRODUCTS.find((p) => p.id === "prod-cinnamon-roll");

  return (
    <div className="flex-1 bg-cream-50 pb-16">
      {/* Top Banner: Recruiter Demo Mode Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-50 px-4 py-3 border-b border-amber-950 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-600/40 text-amber-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs block">
                Recruiter Sandbox Environment ({isDemoMode ? "ENABLED" : "DISABLED"})
              </span>
              <p className="text-[11px] text-amber-200/90">
                Allows testing full checkout flow without sending live WhatsApp dispatches or mutating production database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isDemoMode
                  ? "bg-amber-500 text-white"
                  : "bg-amber-950 text-amber-200 hover:bg-amber-900 border border-amber-700"
              }`}
            >
              Toggle Demo Mode: {isDemoMode ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cream-border">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-forest" />
              <h1 className="font-serif text-2xl font-bold text-espresso">
                Store Operations & Bakery Batches
              </h1>
            </div>
            <p className="text-xs text-espresso-muted mt-0.5">
              Logged in as <strong className="text-forest">{currentUser}</strong> • Supabase Auth Session
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Operational Schedule Settings Card */}
        <div className="p-6 rounded-3xl bg-white border border-cream-border shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-forest-subtle text-forest">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-espresso">
                  Store Schedule & Ramadan Operating Mode
                </h3>
                <p className="text-xs text-espresso-muted mt-1 max-w-xl">
                  {storeSettings.is_ramadan_mode
                    ? "Currently in Ramadan Schedule (12:00 – 23:00 WIB). The customer header clock and badges reflect adjusted hours."
                    : "Currently in Regular Schedule (09:00 – 22:00 WIB)."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleRamadanMode}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                storeSettings.is_ramadan_mode
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-forest text-cream-50 hover:bg-forest-hover"
              }`}
            >
              {storeSettings.is_ramadan_mode ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Switch to Regular Hours (09:00 - 22:00)</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Switch to Ramadan Hours (12:00 - 23:00)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Daily Bakery Sold-Out Toggles (Salt Bread Batches) */}
        <div className="p-6 rounded-3xl bg-white border border-cream-border shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-cream-border">
            <div className="flex items-center gap-2">
              <Croissant className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-serif font-bold text-lg text-espresso">
                  Daily Bakery Batch Sold-Out Controls
                </h3>
                <p className="text-xs text-espresso-muted">
                  Quick one-tap stock toggles for artisanal morning and afternoon bake batches.
                </p>
              </div>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
              Real-time Sync
            </span>
          </div>

          {/* Japanese Salt Bread (Shio Pan) Varieties */}
          {saltBread && (
            <div>
              <h4 className="font-serif font-bold text-sm text-forest mb-3">
                Japanese Salt Bread (Shio Pan) Varieties
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {saltBread.variants?.map((v) => {
                  const isAvailable = bakeryStatus[v.id] ?? true;
                  return (
                    <div
                      key={v.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        isAvailable
                          ? "bg-cream-50 border-cream-border"
                          : "bg-rose-50/60 border-rose-200"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-espresso block">{v.name}</span>
                        <span className="text-[11px] text-espresso-subtle">
                          Base +{v.price_delta ? `${v.price_delta / 1000}K` : "0"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleBakeryVariant(v.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          isAvailable
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-rose-600 text-white hover:bg-rose-700"
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cinnamon Roll Varieties */}
          {cinnamonRoll && (
            <div className="pt-4 border-t border-cream-border">
              <h4 className="font-serif font-bold text-sm text-forest mb-3">
                Cinnamon Roll Varieties
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cinnamonRoll.variants?.map((v) => {
                  const isAvailable = bakeryStatus[v.id] ?? true;
                  return (
                    <div
                      key={v.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        isAvailable
                          ? "bg-cream-50 border-cream-border"
                          : "bg-rose-50/60 border-rose-200"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-espresso block">{v.name}</span>
                        <span className="text-[11px] text-espresso-subtle">
                          Base +{v.price_delta ? `${v.price_delta / 1000}K` : "0"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleBakeryVariant(v.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          isAvailable
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-rose-600 text-white hover:bg-rose-700"
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Global Catalog Items Availability Overview */}
        <div className="p-6 rounded-3xl bg-white border border-cream-border shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-espresso">
            General Catalog Availability Toggles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {productsList.slice(0, 16).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-cream-border bg-cream-card/60 flex items-center justify-between text-xs"
              >
                <div className="truncate mr-2">
                  <span className="font-semibold text-espresso block truncate">{item.name}</span>
                  <span className="text-[10px] text-stone-500">{item.base_price / 1000}K</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleProductAvailability(item.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    item.is_available
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {item.is_available ? "Active" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
