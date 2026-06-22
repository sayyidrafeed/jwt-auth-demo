"use client";

import { useState } from "react";
import { Key, Terminal, Code, Cpu, Activity } from "lucide-react";

export default function Jwtsimulator() {
  const [activePart, setActivePart] = useState<"header" | "payload" | "signature" | null>(null);
  const [logs, setLogs] = useState<string[]>([
    "SYS_INIT: Booting Cryptographic Module v4.1.2...",
    "DB_CONN: Real-time blacklist listener online.",
    "COOKIE_WATCHER: Listening for HTTP-only credentials."
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const tokenParts = {
    header: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    payload: "eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJkZXZAdGVzdC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9",
    signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12 bg-stone-50 border border-stone-200 rounded-xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] font-mono text-xs text-stone-855 group hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.2)] transition-[box-shadow] duration-500 transform-style-3d">
      {/* Top Bar */}
      <div className="col-span-12 bg-stone-100 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 group/lights mr-2">
            <div className="w-3 h-3 rounded-full bg-stone-300 border border-stone-400/20 shadow-inner group-hover/lights:bg-[#3B82F6] group-hover/lights:border-[#1D4ED8] transition-colors cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20 opacity-100 group-hover/lights:opacity-0 transition-opacity" />
            </div>
            <div className="w-3 h-3 rounded-full bg-stone-300 border border-stone-400/20 shadow-inner group-hover/lights:bg-[#D1D5DB] group-hover/lights:border-[#9CA3AF] transition-colors cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20 opacity-100 group-hover/lights:opacity-0 transition-opacity" />
            </div>
            <div className="w-3 h-3 rounded-full bg-stone-300 border border-stone-400/20 shadow-inner group-hover/lights:bg-[#6B7280] group-hover/lights:border-[#4B5563] transition-colors cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20 opacity-100 group-hover/lights:opacity-0 transition-opacity" />
            </div>
          </div>
          <span className="text-stone-600 font-semibold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            JWT_DECODER_PROBE // stateless_inspector
          </span>
        </div>
        <div className="flex items-center gap-2 text-stone-500 text-[10px]">
          <span className="animate-pulse flex items-center gap-1 text-blue-600 font-bold">
            <Activity className="w-3 h-3" />
            ONLINE
          </span>
        </div>
      </div>

      {/* Left: Token Inspector & Interaction */}
      <div className="col-span-12 lg:col-span-6 p-6 border-b lg:border-b-0 lg:border-r border-stone-200 flex flex-col gap-6">
        <div>
          <h4 className="text-stone-800 font-bold mb-2 flex items-center gap-1.5 text-sm">
            <Code className="w-4 h-4 text-blue-600" />
            1. ENCODED TOKEN
          </h4>
          <p className="text-stone-500 mb-3 text-[11px] font-sans">
            Hover over the distinct color segments of this token to isolate and inspect the cryptographic chunks.
          </p>

          <div className="p-4 bg-stone-100/50 border border-stone-200 rounded-lg break-all text-sm leading-relaxed tracking-tight select-none">
            <span
              onMouseEnter={() => { setActivePart("header"); addLog("INSPECT_HEADER: Resolving hashing metadata..."); }}
              onMouseLeave={() => setActivePart(null)}
              className={`cursor-crosshair transition-all duration-150 py-0.5 rounded px-1 ${
                activePart === "header" 
                  ? "bg-blue-105 bg-blue-50 text-blue-800 font-bold border border-blue-200" 
                  : "text-blue-600/90"
              }`}
            >
              {tokenParts.header}
            </span>
            <span className="text-stone-400 font-bold">.</span>
            <span
              onMouseEnter={() => { setActivePart("payload"); addLog("INSPECT_PAYLOAD: Decoding claims dictionary..."); }}
              onMouseLeave={() => setActivePart(null)}
              className={`cursor-crosshair transition-all duration-150 py-0.5 rounded px-1 ${
                activePart === "payload" 
                  ? "bg-stone-200 text-stone-900 font-bold border border-stone-300" 
                  : "text-stone-700"
              }`}
            >
              {tokenParts.payload}
            </span>
            <span className="text-stone-400 font-bold">.</span>
            <span
              onMouseEnter={() => { setActivePart("signature"); addLog("INSPECT_SIGNATURE: Checking crypto-integrity..."); }}
              onMouseLeave={() => setActivePart(null)}
              className={`cursor-crosshair transition-all duration-150 py-0.5 rounded px-1 ${
                activePart === "signature" 
                  ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-250 border-emerald-200" 
                  : "text-emerald-700"
              }`}
            >
              {tokenParts.signature}
            </span>
          </div>
        </div>

        {/* Live System Logs */}
        <div className="flex-1 flex flex-col justify-end">
          <h4 className="text-stone-800 font-bold mb-2 flex items-center gap-1.5 text-sm">
            <Terminal className="w-4 h-4 text-stone-600" />
            SYSTEM_LOGS
          </h4>
          <div className="p-3 bg-stone-100/30 border border-stone-200 rounded-lg text-stone-600 flex flex-col gap-1.5 h-[110px] overflow-hidden justify-end">
            {logs.map((log, idx) => (
              <div 
                key={idx} 
                className={`text-[10px] truncate ${
                  log.includes("SYS_INIT") ? "text-stone-400" :
                  log.includes("DB_CONN") ? "text-stone-400" :
                  log.includes("INSPECT") ? "text-blue-600 font-semibold" : "text-stone-700"
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Decoded JSON View */}
      <div className="col-span-12 lg:col-span-6 p-6 flex flex-col gap-6 bg-stone-100/10">
        <div>
          <h4 className="text-stone-800 font-bold mb-4 flex items-center gap-1.5 text-sm">
            <Key className="w-4 h-4 text-blue-600" />
            2. DECODED METADATA & CLAIMS
          </h4>

          <div className="flex flex-col gap-4">
            {/* Header Box */}
            <div 
              className={`p-3 rounded-lg border transition-all duration-200 ${
                activePart === "header" 
                  ? "bg-blue-50 border-blue-300 shadow-[0_0_12px_rgba(37,99,235,0.05)]" 
                  : "bg-white border-stone-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">HEADER: Algorithm & Token Type</span>
                {activePart === "header" && <span className="text-[9px] bg-blue-105 bg-blue-50 text-blue-800 px-1.5 py-0.2 rounded font-bold">INSPECTING</span>}
              </div>
              <pre className="text-blue-900 leading-tight">
{`{
  "alg": "HS256",
  "typ": "JWT"
}`}
              </pre>
            </div>

            {/* Payload Box */}
            <div 
              className={`p-3 rounded-lg border transition-all duration-200 ${
                activePart === "payload" 
                  ? "bg-stone-105 bg-stone-100 border-stone-400 shadow-[0_0_12px_rgba(0,0,0,0.02)]" 
                  : "bg-white border-stone-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wider">PAYLOAD: Decoded Session Claims</span>
                {activePart === "payload" && <span className="text-[9px] bg-stone-200 text-stone-850 px-1.5 py-0.2 rounded font-bold">INSPECTING</span>}
              </div>
              <pre className="text-stone-800 leading-tight">
{`{
  "sub": "1234567890",
  "email": "dev@test.com",
  "iat": 1516239022
}`}
              </pre>
            </div>

            {/* Signature Box */}
            <div 
              className={`p-3 rounded-lg border transition-all duration-200 ${
                activePart === "signature" 
                  ? "bg-emerald-50/50 border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.05)]" 
                  : "bg-white border-stone-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">SIGNATURE: Verification</span>
                {activePart === "signature" && <span className="text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded font-bold">INSPECTING</span>}
              </div>
              <pre className="text-emerald-900 leading-tight">
{`HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "SECRET_HMAC_KEY"
) === VERIFIED`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
