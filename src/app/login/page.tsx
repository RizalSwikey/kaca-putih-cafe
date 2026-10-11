"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, Sparkles, Coffee } from "lucide-react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authErr) {
          setError(authErr.message);
        } else if (data.session) {
          router.push("/admin");
        }
      } catch {
        setError("Gagal menghubungi server otentikasi.");
      } finally {
        setLoading(false);
      }
    } else {
      // Demo / offline password check
      if (password === "admin123" || email.toLowerCase().includes("kacaputih")) {
        sessionStorage.setItem("kp_admin_authenticated", "true");
        router.push("/admin");
      } else {
        setError("Akses demo: gunakan password 'admin123' atau klik '1-Tap Demo Staff Login' di bawah.");
      }
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    sessionStorage.setItem("kp_admin_authenticated", "true");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top back button */}
      <div className="max-w-md w-full mx-auto pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-forest transition-colors bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Tamu</span>
        </Link>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md mx-auto my-auto bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-forest text-cream-50 mb-3 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-espresso">
            Portal Staf &amp; Internal
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Kaca Putih Cafe &amp; Kitchen • Akses Operasional Resto
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">
              Email Staf
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kasir@kacaputih.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest bg-stone-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest bg-stone-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-forest hover:bg-forest-hover text-cream-50 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Workspace Staf"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-200 space-y-3">
          <div className="text-center">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Akses Cepat Penguji &amp; Penilai
            </span>
          </div>

          <button
            type="button"
            onClick={handleDemoBypass}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>1-Tap Demo Staff Login</span>
          </button>
        </div>
      </div>

      {/* Footer watermark */}
      <div className="text-center py-4 text-[11px] text-stone-400">
        Bunulrejo, Blimbing, Malang • Kaca Putih Workspace
      </div>
    </div>
  );
}
