"use client";

import { useState } from "react";
import { Play, AlertCircle } from "lucide-react";

export default function AuthDemoPanel() {
  const [testResult, setTestResult] = useState<{
    loading: boolean;
    status?: number;
    body?: string;
  }>({ loading: false });

  const testUnauthenticated = async () => {
    setTestResult({ loading: true });
    try {
      const res = await fetch("/api/assets/cat-hihi.webp", {
        credentials: "omit",
      });
      const text = await res.text();
      setTestResult({ loading: false, status: res.status, body: text });
    } catch {
      setTestResult({ loading: false, status: 0, body: "Network error" });
    }
  };

  return (
    <section className="bg-white border border-stone-200 rounded p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-stone-300" />
      
      <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
        <AlertCircle className="w-4 h-4 text-blue-600" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-850">
          PROBE_UNAUTHORIZED_ACCESS
        </h2>
      </div>

      <p className="text-[11px] text-stone-500 leading-relaxed font-sans mb-4">
        Simulate an external HTTP client requesting the protected asset without the required session context (no cookies transmitted).
      </p>

      <button 
        onClick={testUnauthenticated} 
        disabled={testResult.loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded bg-blue-600 text-white hover:bg-blue-500 border border-blue-700 hover:border-blue-600 shadow-sm transition-all duration-150 disabled:opacity-50 cursor-pointer min-h-[40px] uppercase tracking-wider"
      >
        <Play className="w-3.5 h-3.5" />
        {testResult.loading ? "SIMULATING_REQUEST..." : "RUN_UNAUTH_PROBE"}
      </button>

      {testResult.loading && (
        <div className="mt-4 p-4 rounded border border-stone-200 bg-stone-50 text-[10px] text-stone-500 font-semibold animate-pulse flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
          <span>CONNECTING TO TARGET PORT:443 // AWAITING SECURE RESPONSE...</span>
        </div>
      )}

      {!testResult.loading && testResult.status !== undefined && (
        <div className={`mt-4 border rounded overflow-hidden font-mono text-[11px] ${
          testResult.status === 401 
            ? "border-red-200 bg-red-50/30" 
            : "border-blue-200 bg-blue-50/30"
        }`}>
          {/* Console top header */}
          <div className={`px-3 py-1.5 border-b text-[9px] font-bold tracking-wider ${
            testResult.status === 401 
              ? "bg-red-50 border-red-200 text-red-700" 
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}>
            PROBE_RESPONSE // STATUS: {testResult.status} {testResult.status === 401 ? "UNAUTHORIZED" : "OK"}
          </div>
          
          <div className="p-3">
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-stone-400">HTTP/1.1 {testResult.status} {testResult.status === 401 ? "Unauthorized" : "OK"}</span>
              </div>
              {testResult.body && (
                <div className="mt-1">
                  <span className="text-stone-400 block text-[9px] mb-1">RESPONSE_BODY:</span>
                  <pre className="bg-stone-900 text-stone-250 p-2.5 rounded text-[10px] overflow-x-auto border border-stone-850">
                    {testResult.body}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

