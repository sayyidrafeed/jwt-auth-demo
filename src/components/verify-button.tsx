"use client";

import { useState } from "react";

export default function VerifyButton() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/auth/token-info");
      const data = await res.json();
      if (res.ok && data.accessToken) {
        setResult("Token is valid");
      } else {
        setResult("No valid token");
      }
    } catch {
      setResult("Error checking token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Checking..." : "Verify Token"}
      </button>
      {result && <p className={result === "Token is valid" ? "success" : "error"}>{result}</p>}
    </div>
  );
}
