"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  userEmail: string | null;
}

export default function Navbar({ userEmail }: NavbarProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const res = await fetch("/api/auth/sign-out", { method: "POST" });
      if (res.ok) {
        router.refresh();
        router.push("/sign-in");
      }
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : null;

  return (
    <header className="w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-lg tracking-tight text-slate-900 hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          AuthGuard
        </Link>
        <nav className="flex items-center gap-3">
          {userEmail ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/tokens"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/tokens"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tokens
              </Link>
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
                  {userInitial}
                </span>
                <span className="text-sm text-slate-500 hidden sm:inline-block max-w-[140px] truncate">
                  {userEmail}
                </span>
                <form onSubmit={handleSignOut}>
                  <button
                    type="submit"
                    disabled={isLoggingOut}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoggingOut ? "..." : "Sign Out"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
