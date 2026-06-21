"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, LayoutDashboard, Database, LogOut } from "lucide-react";

interface NavbarProps {
  userEmail: string | null;
}

export default function Navbar({ userEmail }: NavbarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const res = await fetch("/api/auth/sign-out", { method: "POST" });
      if (res.ok) {
        router.refresh();
        router.push("/sign-in");
      }
    } catch {
      //
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-16 items-center justify-between gap-4">
      {/* Brand Logo */}
      <Link 
        href="/" 
        className="flex items-center gap-2 font-bold text-stone-900 text-lg tracking-tight hover:text-blue-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
      >
        <Shield className="w-5 h-5 text-blue-600" />
        <span>JWT Auth</span>
      </Link>

      {/* Nav Links & Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {userEmail ? (
          <>
            <span className="hidden sm:inline text-xs font-mono text-stone-600 bg-stone-100 border border-stone-200 rounded px-2.5 py-1">
              {userEmail}
            </span>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-3 py-2 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden xs:inline">Dashboard</span>
            </Link>
            <Link 
              href="/tokens" 
              className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-3 py-2 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Database className="w-4 h-4" />
              <span className="hidden xs:inline">Tokens</span>
            </Link>
            <form onSubmit={handleSignOut} className="m-0">
              <button 
                type="submit" 
                disabled={isLoggingOut}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-150 disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? "..." : "Sign Out"}</span>
              </button>
            </form>
          </>
        ) : (
          <>
            <Link 
              href="/sign-in" 
              className="text-sm font-semibold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg hover:bg-stone-100 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] flex items-center"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] flex items-center"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
