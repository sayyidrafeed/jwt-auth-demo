"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <main>
      <h2>Sign Up</h2>
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Sign Up"}
        </button>
      </form>
      <p>
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
    </main>
  );
}
