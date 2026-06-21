"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/navbar";
import { Shield, Key, ArrowRight, Activity, Binary } from "lucide-react";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-page min-h-screen bg-[#FAF7F2] text-stone-850 selection:bg-blue-100 selection:text-blue-900 font-mono antialiased relative overflow-hidden flex flex-col justify-between">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ebe8df_1px,transparent_1px),linear-gradient(to_bottom,#ebe8df_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 border-b border-stone-200/80 bg-[#FAF7F2]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar userEmail={null} />
        </div>
      </header>

      {/* Main Form Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-stone-50 border border-stone-200 rounded-xl overflow-hidden shadow-xl">
          {/* Console Header bar */}
          <div className="bg-stone-100 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block animate-pulse" />
              <span className="text-stone-600 font-semibold text-[11px] flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5 text-blue-600" />
                IDENTITY_PROVISIONING // auth_v4.1.2
              </span>
            </div>
            <div className="text-stone-400 text-[9px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-blue-650" />
              PORTAL_ONLINE
            </div>
          </div>

          {/* Form container */}
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 justify-center sm:justify-start">
                <Key className="w-4 h-4 text-blue-600" />
                CREATE_IDENTITY
              </h2>
              <p className="text-[10px] text-stone-500 mt-1 font-sans">
                Register a new operator profile with cryptographic credentials.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold uppercase flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                <span>Error: {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  IDENTITY_EMAIL
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., operator@node.sec"
                  className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-stone-300"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  ASSIGN_PASSPHRASE
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-stone-350"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  CONFIRM_PASSPHRASE
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-stone-350"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold rounded bg-blue-600 text-white hover:bg-blue-500 transition-all duration-150 cursor-pointer min-h-[44px] border border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.15)] mt-2"
              >
                {isLoading ? "REGISTRATION_IN_PROGRESS..." : "PROVISION_IDENTITY"}
                {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            <div className="border-t border-stone-200/80 pt-4 text-center">
              <p className="text-[10px] text-stone-500">
                ALREADY ENROLLED?{" "}
                <Link href="/sign-in" className="text-blue-600 font-bold hover:underline">
                  SIGN_IN_CREDENTIALS
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-stone-100/40 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-[9px] text-stone-500 font-semibold">
          SYSTEM PROVISION NODE: VERIFIED SECURE // &copy; {new Date().getFullYear()} JWT AUTH DEMO.
        </div>
      </footer>
    </div>
  );
}
