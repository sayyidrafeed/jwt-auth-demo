"use client";

import { useState } from "react";
import { ShieldCheck, RefreshCw } from "lucide-react";

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <p className="text-[11px] text-stone-500 font-sans leading-relaxed max-w-md">
          Query the authenticated <code>/api/auth/token-info</code> endpoint using existing cookies to verify signature authenticity.
        </p>
        <button 
          onClick={handleVerify} 
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded bg-stone-150 hover:bg-stone-200 text-stone-700 border border-stone-300 hover:border-stone-400 transition-all duration-150 disabled:opacity-50 cursor-pointer min-h-[40px] uppercase tracking-wider font-mono self-start sm:self-auto shrink-0"
        >
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          {loading ? "CHECKING_INTEGRITY..." : "VERIFY_TOKEN_INTEGRITY"}
        </button>
      </div>

      {loading && (
        <div className="p-3 rounded border border-stone-200 bg-stone-50 text-[10px] text-stone-500 font-semibold animate-pulse flex items-center gap-2 font-mono">
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          <span>QUERYING /api/auth/token-info ... SHIELD_STATUS: COMPUTING</span>
        </div>
      )}

      {!loading && result && (
        <div className={`p-3 rounded border font-mono text-[11px] flex items-center gap-2.5 ${
          result === "Token is valid" 
            ? "border-blue-200 bg-blue-50/20 text-blue-800" 
            : "border-red-200 bg-red-50/20 text-red-800"
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            result === "Token is valid" ? "bg-blue-600 animate-pulse" : "bg-red-600 animate-pulse"
          }`} />
          <div>
            <span className="font-bold uppercase">PROBE_RESULT:</span> {result}
          </div>
        </div>
      )}
    </div>
  );
}

