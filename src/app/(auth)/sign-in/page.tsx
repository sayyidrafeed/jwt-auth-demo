"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
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
    <main>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p>
        Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
      </p>
    </main>
  );
}
