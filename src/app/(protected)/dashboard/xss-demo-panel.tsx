"use client";

import { useState } from "react";
import { Bug, Play, ShieldAlert, ShieldX } from "lucide-react";

export default function XssDemoPanel() {
  const [inputValue, setInputValue] = useState("<img src=x onerror=alert('XSS')>");
  const [testResult, setTestResult] = useState<{
    loading: boolean;
    status?: number;
    body?: string;
    bypassed?: boolean;
  }>({ loading: false });

  const testXss = async (bypass: boolean) => {
    setTestResult({ loading: true });
    // Simulate network request
    try {
      await new Promise(r => setTimeout(r, 600));
      
      if (bypass) {
        // Execute the script safely using Function constructor if it contains alert
        if (inputValue.includes("alert")) {
          setTimeout(() => {
            try {
              // Only extracting simple alerts for the demo safely
              const alertMatch = inputValue.match(/alert\(['"]([^'"]+)['"]\)/);
              if (alertMatch && alertMatch[1]) {
                alert(alertMatch[1]);
              } else {
                 alert("XSS");
              }
            } catch(e) {
               console.error(e)
            }
          }, 100);
        }
        
        setTestResult({ 
          loading: false, 
          status: 200, 
          body: `{"status": "ok", "reflected_input": "${inputValue.replace(/"/g, '\\"')}"}`,
          bypassed: true
        });
      } else {
        // Sanitized version encodes HTML entities
        const sanitized = inputValue
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
          
        setTestResult({ 
          loading: false, 
          status: 200, 
          body: `{"status": "ok", "reflected_input": "${sanitized}"}`,
          bypassed: false
        });
      }
    } catch {
      setTestResult({ loading: false, status: 0, body: "Network error" });
    }
  };

  return (
    <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
      <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
        <Bug className="w-4 h-4 text-blue-600" aria-hidden="true" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
          PROBE_XSS_VULNERABILITY
        </h2>
      </div>

      <p className="text-[11px] text-stone-500 leading-relaxed font-sans mb-4">
        Simulate an injection attack by posting unsanitized markup. Tests if the server reflects the payload safely.
      </p>

      <div className="flex flex-col gap-3 mb-4">
        <div>
          <label className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5 mb-1.5 font-mono tracking-wider">
             MALICIOUS_PAYLOAD
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[40px]"
            placeholder="Enter XSS payload..."
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          onClick={() => testXss(false)} 
          disabled={testResult.loading || !inputValue}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 border border-blue-700 hover:border-blue-600 shadow-sm transition-all duration-150 disabled:opacity-50 cursor-pointer min-h-[40px] uppercase tracking-wider font-mono"
        >
          <Play className="w-3.5 h-3.5" aria-hidden="true" />
          {testResult.loading ? "INJECTING..." : "RUN_SAFE_PROBE"}
        </button>
        
        <button 
          onClick={() => testXss(true)} 
          disabled={testResult.loading || !inputValue}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-500 border border-rose-700 hover:border-rose-600 shadow-sm transition-all duration-150 disabled:opacity-50 cursor-pointer min-h-[40px] uppercase tracking-wider font-mono"
        >
          <Bug className="w-3.5 h-3.5" aria-hidden="true" />
          {testResult.loading ? "INJECTING..." : "BYPASS_SANITIZER"}
        </button>

        {testResult.status !== undefined && (
          <button
            onClick={() => setTestResult({ loading: false, status: undefined, body: undefined, bypassed: false })}
            disabled={testResult.loading}
            className="flex-none px-4 py-2.5 text-xs font-bold rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300 transition-all duration-150 disabled:opacity-50 cursor-pointer min-h-[40px] uppercase tracking-wider font-mono"
          >
            CLEAR
          </button>
        )}
      </div>

      {testResult.loading && (
        <div className="mt-4 p-4 rounded-lg border border-stone-200 bg-stone-50 text-[10px] text-stone-500 font-semibold animate-pulse flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" aria-hidden="true" />
          <span className="font-mono">TRANSMITTING PAYLOAD TO TARGET...</span>
        </div>
      )}

      {!testResult.loading && testResult.status !== undefined && (
        <div className={`mt-4 border rounded-lg overflow-hidden font-mono text-[11px] ${
          testResult.bypassed 
            ? "border-rose-200 bg-rose-50/30" 
            : "border-blue-200 bg-blue-50/30"
        }`}>
          <div className={`px-3 py-1.5 border-b text-[9px] font-bold tracking-wider flex items-center justify-between ${
            testResult.bypassed
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}>
            <span>PROBE_RESPONSE // STATUS: {testResult.status} OK</span>
            {testResult.bypassed ? (
              <span className="flex items-center gap-1"><ShieldX className="w-3 h-3" aria-hidden="true" /> VULNERABLE</span>
            ) : (
               <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3" aria-hidden="true" /> SANITIZED</span>
            )}
          </div>
          
          <div className="p-3">
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-stone-400 block text-[9px] mb-1">RAW_RESPONSE:</span>
                <pre className="bg-stone-900 text-stone-300 p-2.5 rounded-lg text-[10px] overflow-x-auto border border-stone-800 whitespace-pre-wrap">
                  {testResult.body}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
