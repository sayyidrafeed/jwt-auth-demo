"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  LogOut,
  Eye,
  EyeOff,
  Shield,
  Key,
  Binary,
  Clock,
  CheckCircle,
  AlertCircle,
  Database,
} from "lucide-react";

interface TokenData {
  raw: string;
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string | null;
}

const CLAIM_DESCRIPTIONS: Record<string, string> = {
  iat: "Issued At — when the token was created",
  exp: "Expiration — when the token becomes invalid",
  sub: "Subject — who this token represents (user ID)",
  jti: "JWT ID — unique identifier for this token",
  iss: "Issuer — who created the token",
  aud: "Audience — intended recipient of this token",
  nbf: "Not Before — token is invalid before this time",
};

function formatTimestamp(unix: unknown): string {
  if (typeof unix !== "number") return "—";
  return new Date(unix * 1000).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function TokenPartBlock({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "blue" | "stone" | "muted";
}) {
  const colorMap = {
    blue: "text-blue-600",
    stone: "text-stone-700",
    muted: "text-stone-400",
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 font-mono">
        {label}
      </span>
      <pre
        className={`text-[11px] font-mono break-all whitespace-pre-wrap leading-relaxed ${colorMap[color]}`}
      >
        {value}
      </pre>
    </div>
  );
}

function ManifestRow({
  label,
  value,
  mono = false,
  description,
}: {
  label: string;
  value: string;
  mono?: boolean;
  description?: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 py-2 border-b border-stone-100 items-start last:border-0">
      <span
        className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono whitespace-nowrap pt-0.5 cursor-help"
        title={description}
      >
        {label}
      </span>
      <span
        className={`text-xs text-stone-800 break-all ${mono ? "font-mono" : "font-sans"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function TokenInspector({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<TokenData | null>(null);
  const [refreshToken, setRefreshToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRaw, setShowRaw] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  const fetchTokenInfo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/token-info");
      if (!res.ok) throw new Error("Failed to fetch token info");
      const data = await res.json();
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    } catch {
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokenInfo();
  }, [fetchTokenInfo]);

  const handleRefresh = async () => {
    setActionLoading("refresh");
    setActionMessage(null);
    setConfirmRevoke(false);
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Refresh failed");
      setActionMessage({ type: "success", text: "Token pair rotated." });
      await fetchTokenInfo();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Refresh failed",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = useCallback(async () => {
    setActionLoading("revoke");
    setActionMessage(null);
    try {
      const res = await fetch("/api/auth/sign-out", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Revoke failed");
      router.refresh();
      router.push("/sign-in");
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Revoke failed",
      });
      setActionLoading(null);
    }
  }, [router]);

  // Keyboard shortcuts (R = rotate, T = toggle raw)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        if (actionLoading === null && accessToken && !confirmRevoke)
          handleRefresh();
      }
      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setShowRaw((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm animate-pulse"
          >
            <div className="h-10 bg-stone-100 border-b border-stone-200" />
            <div className="p-6 flex flex-col gap-3">
              <div className="h-3 bg-stone-100 rounded w-1/3" />
              <div className="h-3 bg-stone-100 rounded w-2/3" />
              <div className="h-3 bg-stone-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ── No token state ── */
  if (!accessToken) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-10 shadow-sm flex flex-col items-center gap-4 text-center">
        <Shield className="w-8 h-8 text-stone-300" />
        <div>
          <p className="text-sm font-bold text-stone-700 font-mono uppercase tracking-wider">
            NO_ACTIVE_SESSION
          </p>
          <p className="text-xs text-stone-400 font-sans mt-1">
            No valid access token found in this session.
          </p>
        </div>
      </div>
    );
  }

  const parts = accessToken.raw.split(".");

  return (
    <div className="flex flex-col gap-8">

      {/* ── Status bar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"
            role="status"
            aria-label="Token is live"
          />
          <div className="text-[10px] font-bold text-stone-500 tracking-wider uppercase font-mono flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
            TOKEN_INSPECTOR_NODE: // {userEmail}
          </div>
        </div>
        <div className="text-[10px] text-stone-400 font-mono font-semibold">
          ACCESS_TOKEN:{" "}
          <span className="text-blue-600">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-12 gap-8">

        {/* ── Left: Access Token breakdown ── */}
        <div className="md:col-span-3 lg:col-span-7 flex flex-col gap-6 min-w-0">

          {/* Encoded token visual */}
          <section className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-stone-100 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Binary className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 font-mono">
                  ENCODED_ACCESS_TOKEN
                </span>
              </div>
              <button
                onClick={() => setShowRaw(!showRaw)}
                aria-expanded={showRaw}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-mono text-stone-500 hover:text-stone-800 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
              >
                {showRaw ? (
                  <>
                    <EyeOff className="w-3 h-3" aria-hidden="true" /> HIDE_RAW
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" aria-hidden="true" /> SHOW_RAW
                  </>
                )}
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Visual token parts — hoverable per segment */}
                            
              <div
                className="p-4 bg-stone-50 border border-stone-200 rounded-lg break-all text-[11px] font-mono leading-loose select-all token-inspect-display"
                aria-describedby="token-legend"
              >
                <span className="s3-seg s3-hdr">
                  <span className="sr-only">Header: </span>
                  {parts[0]}
                  <span className="s3-tip">HEADER</span>
                </span>
                <span className="s3-dot">.</span>
                <span className="s3-seg s3-pay">
                  <span className="sr-only">Payload: </span>
                  {parts[1]}
                  <span className="s3-tip">PAYLOAD</span>
                </span>
                <span className="s3-dot">.</span>
                <span className="s3-seg s3-sig">
                  <span className="sr-only">Signature: </span>
                  {parts[2]}
                  <span className="s3-tip">SIGNATURE</span>
                </span>
              </div>

              {/* Part legend */}
              <div
                id="token-legend"
                className="flex flex-wrap gap-3 text-[9px] font-mono font-bold uppercase tracking-widest"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" aria-hidden="true" />
                  <span className="text-stone-500">HEADER</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-700 inline-block" aria-hidden="true" />
                  <span className="text-stone-500">PAYLOAD</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-300 inline-block" aria-hidden="true" />
                  <span className="text-stone-500">SIGNATURE</span>
                </span>
              </div>

              {/* Raw string */}
              {showRaw && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 font-mono">
                    RAW_STRING
                  </span>
                  <pre className="text-[10px] font-mono text-stone-500 bg-stone-50 border border-stone-200 rounded-lg p-3 overflow-x-auto break-all whitespace-pre-wrap leading-relaxed">
                    {accessToken.raw}
                  </pre>
                </div>
              )}
            </div>
          </section>

          {/* Decoded sections */}
          <style dangerouslySetInnerHTML={{ __html: `
            .hover-3d-container {
              perspective: 1000px;
            }
            .hover-3d-row {
              transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              position: relative;
              padding: 0.75rem 1rem;
              margin: -0.25rem -1rem;
              border: 1px solid transparent;
              border-radius: 8px;
              transform-origin: center left;
            }
            .hover-3d-row:hover {
              background: #ffffff;
              border-color: #2563eb;
              transform: translateZ(10px) rotateX(0deg) scale(1.02);
              box-shadow: -10px 10px 20px -5px rgba(37,99,235,0.15), 0 0 0 2px #2563eb inset;
              z-index: 10;
            }
            .hover-3d-container:hover .hover-3d-row:not(:hover) {
              transform: translateZ(-10px) scale(0.95);
              opacity: 0.4;
            }
          ` }} />
          <section className="relative bg-white border border-stone-200 rounded-xl shadow-sm overflow-visible">
            <div className="bg-stone-100 border-b border-stone-200 px-4 py-3 flex items-center gap-2 rounded-t-xl">
              <Key className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 font-mono">
                DECODED_PAYLOAD
              </span>
            </div>
            <div className="p-5 flex flex-col gap-0 hover-3d-container">
              {Object.entries(accessToken.payload).map(([k, v]) => {
                const isTimestamp = k === "iat" || k === "exp";
                const displayValue = isTimestamp
                  ? `${formatTimestamp(v)}  (${v})`
                  : String(v);
                return (
                  <div key={k} className="hover-3d-row">
                    <ManifestRow
                      label={k.toUpperCase()}
                      value={displayValue}
                      mono={!isTimestamp}
                      description={CLAIM_DESCRIPTIONS[k]}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Header + Signature in a 2-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-stone-100 border-b border-stone-200 px-4 py-3 flex items-center gap-2">
                <Binary className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 font-mono">
                  HEADER
                </span>
              </div>
              <div className="p-5">
                <TokenPartBlock
                  label="Algorithm"
                  value={String(accessToken.header.alg ?? "—")}
                  color="blue"
                />
                <div className="mt-3">
                  <TokenPartBlock
                    label="Type"
                    value={String(accessToken.header.typ ?? "—")}
                    color="stone"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-stone-100 border-b border-stone-200 px-4 py-3 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 font-mono">
                  SIGNATURE
                </span>
              </div>
              <div className="p-5">
                <TokenPartBlock
                  label="Base64Url"
                  value={accessToken.signature ?? "N/A"}
                  color="muted"
                />
              </div>
            </section>
          </div>
        </div>

        {/* ── Right: Actions + Refresh Token ── */}
        <div className="md:col-span-2 lg:col-span-5 flex flex-col gap-6 min-w-0">

          {/* Actions */}
          <section className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-stone-100 border-b border-stone-200 px-4 py-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 font-mono">
                SESSION_CONTROLS
              </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                Rotate the token pair or revoke the session entirely. Rotation
                issues a new access/refresh keypair and invalidates the previous
                one.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={actionLoading !== null}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-wider font-mono rounded-lg bg-blue-600 text-white hover:bg-blue-500 border border-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${actionLoading === "refresh" ? "animate-spin" : ""}`}
                    aria-hidden="true"
                  />
                  {actionLoading === "refresh"
                    ? "ROTATING_KEYPAIR..."
                    : "ROTATE_TOKEN_PAIR"}
                </button>

                {/* Two-phase revoke confirmation */}
                {!confirmRevoke ? (
                  <button
                    onClick={() => setConfirmRevoke(true)}
                    disabled={actionLoading !== null}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-wider font-mono rounded-lg bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-stone-200 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    REVOKE_AND_SIGN_OUT
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleRevoke}
                      disabled={actionLoading !== null}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-wider font-mono rounded-lg bg-rose-600 text-white hover:bg-rose-500 border border-rose-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
                    >
                      <AlertCircle
                        className={`w-3.5 h-3.5 ${actionLoading === "revoke" ? "animate-spin" : ""}`}
                        aria-hidden="true"
                      />
                      {actionLoading === "revoke"
                        ? "REVOKING..."
                        : "CONFIRM_REVOKE"}
                    </button>
                    <button
                      onClick={() => setConfirmRevoke(false)}
                      disabled={actionLoading !== null}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-wider font-mono rounded-lg bg-stone-50 text-stone-500 hover:bg-stone-100 border border-stone-200 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
                    >
                      CANCEL
                    </button>
                  </div>
                )}
              </div>

              {/* Action message */}
              {actionMessage && (
                <div
                  className={`flex items-start gap-2.5 p-3 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider ${
                    actionMessage.type === "success"
                      ? "bg-stone-50 border-stone-200 text-stone-600"
                      : "bg-rose-50 border-rose-200 text-rose-700"
                  }`}
                  role="alert"
                >
                  {actionMessage.type === "success" ? (
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <span>{actionMessage.text}</span>
                </div>
              )}
            </div>
          </section>

          {/* Refresh Token */}
          {refreshToken && (
            <section className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-stone-100 border-b border-stone-200 px-4 py-3 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 font-mono">
                  REFRESH_TOKEN
                </span>
              </div>

              <div className="p-5 flex flex-col gap-0">
                <div className="mb-3 flex items-center gap-2 pb-3 border-b border-stone-100">
                  <span
                    className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                    role="status"
                    aria-label="Refresh token is valid"
                  />
                  <span className="text-[10px] text-stone-500 font-mono font-bold uppercase tracking-wider">
                    VALID — HASHED IN DB
                  </span>
                </div>

                {Object.entries(refreshToken.payload).map(([k, v]) => {
                  const isTimestamp = k === "iat" || k === "exp";
                  const displayValue = isTimestamp
                    ? formatTimestamp(v)
                    : String(v);
                  return (
                    <ManifestRow
                      key={k}
                      label={k.toUpperCase()}
                      value={displayValue}
                      mono={!isTimestamp}
                      description={CLAIM_DESCRIPTIONS[k]}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
