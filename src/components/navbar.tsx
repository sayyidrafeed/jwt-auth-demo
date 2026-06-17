"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <nav>
      <Link href="/">JWT Auth Demo</Link>
      {userEmail ? (
        <>
          <span>{userEmail}</span>
          <Link href="/dashboard">Dashboard</Link>
          <form onSubmit={handleSignOut}>
            <button type="submit" disabled={isLoggingOut}>
              {isLoggingOut ? "..." : "Sign Out"}
            </button>
          </form>
        </>
      ) : (
        <>
          <Link href="/sign-in">Sign In</Link>
          <Link href="/sign-up">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
