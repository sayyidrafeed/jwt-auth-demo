"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface TokenData {
  raw: string;
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string | null;
}

export default function TokenInspectorPage(): React.JSX.Element {
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
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const fetchTokenInfo = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/token-info");
      if (!res.ok) throw new Error("Failed to fetch token info");
      const data = (await res.json()) as {
        accessToken: TokenData | null;
        refreshToken: TokenData | null;
      };
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

  useEffect(() => {
    if (!accessToken?.payload?.exp) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const exp = accessToken.payload.exp as number;
      const diff = Math.max(0, exp - now);

      if (diff === 0) {
        setTimeLeft("Expired");
        return;
      }

      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [accessToken]);

  const handleRefresh = async () => {
    setActionLoading("refresh");
    setActionMessage(null);
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      const data = (await res.json()) as { success: boolean; message: string };
      if (!res.ok) throw new Error(data.message || "Refresh failed");
      setActionMessage({ type: "success", text: "Tokens refreshed successfully!" });
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

  const handleRevoke = async () => {
    setActionLoading("revoke");
    setActionMessage(null);
    try {
      const res = await fetch("/api/auth/sign-out", { method: "POST" });
      const data = (await res.json()) as { success: boolean; message: string };
      if (!res.ok) throw new Error(data.message || "Revoke failed");
      router.refresh();
      router.push("/sign-in");
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Revoke failed",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyToken = async () => {
    if (!accessToken) return;
    try {
      await navigator.clipboard.writeText(accessToken.raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API may fail
    }
  };

  const formatJSON = (obj: Record<string, unknown>): string => {
    return JSON.stringify(obj, null, 2);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
        <p className="text-slate-500">No active session found.</p>
      </div>
    );
  }

  const tokenParts = accessToken.raw.split(".");
  const isExpired = accessToken.payload.exp
    ? Date.now() > (accessToken.payload.exp as number) * 1000
    : false;

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Token Inspector
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Decode, inspect, and manage your JWT tokens
        </p>
      </div>

      {/* Decoded JWT view */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <div className="bg-pink-50 px-4 py-2.5 border-b border-pink-100">
            <p className="text-xs font-semibold text-pink-700 uppercase tracking-wider">
              Header
            </p>
          </div>
          <div className="p-4">
            <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap overflow-x-auto">
              {formatJSON(accessToken.header)}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-100">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Payload
            </p>
          </div>
          <div className="p-4">
            <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap overflow-x-auto">
              {formatJSON(accessToken.payload)}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-100">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Signature
            </p>
          </div>
          <div className="p-4">
            <pre className="text-xs font-mono text-slate-500 break-all">
              {accessToken.signature || "N/A"}
            </pre>
          </div>
        </div>
      </div>

      {/* Raw token display */}
      <div className="bg-white rounded-xl border border-slate-200/60 mb-6">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Raw Access Token
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
            >
              {showRaw ? "Hide" : "Show"}
            </button>
            <button
              onClick={handleCopyToken}
              className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div className="p-4">
          {showRaw ? (
            <div className="space-y-1 text-xs font-mono leading-relaxed">
              <span className="text-pink-600 break-all">{tokenParts[0]}</span>
              <span className="text-slate-300">.</span>
              <span className="text-blue-600 break-all">{tokenParts[1]}</span>
              <span className="text-slate-300">.</span>
              <span className="text-amber-600 break-all">{tokenParts[2]}</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Token hidden - click Show to reveal
            </p>
          )}
        </div>
      </div>

      {/* Session info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Session Status
          </p>
          <p
            className={`mt-1 flex items-center gap-2 text-sm font-semibold ${
              isExpired ? "text-red-600" : "text-green-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isExpired ? "bg-red-500" : "bg-green-500"
              } ${isExpired ? "" : "animate-pulse"}`}
            />
            {isExpired ? "Expired" : "Active"}
            {!isExpired && timeLeft && (
              <span className="text-xs font-mono text-slate-500 ml-auto">
                {timeLeft}
              </span>
            )}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Email
          </p>
          <p className="mt-1 text-sm font-medium text-slate-900 truncate">
            {(accessToken.payload.email as string) || "N/A"}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            User ID
          </p>
          <p
            className="mt-1 text-sm font-mono text-slate-700 truncate"
            title={accessToken.payload.userId as string}
          >
            {(accessToken.payload.userId as string) || "N/A"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-4 mb-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Token Actions
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={actionLoading !== null}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {actionLoading === "refresh" ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            {actionLoading === "refresh" ? "Refreshing..." : "Refresh Tokens"}
          </button>

          <button
            onClick={handleRevoke}
            disabled={actionLoading !== null}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {actionLoading === "revoke" ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            {actionLoading === "revoke" ? "Revoking..." : "Revoke Token & Sign Out"}
          </button>
        </div>

        {actionMessage && (
          <div
            className={`mt-3 text-sm ${
              actionMessage.type === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {actionMessage.text}
          </div>
        )}
      </div>

      {/* Refresh token info */}
      {refreshToken && (
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Refresh Token
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-600">Valid</span>
            {typeof refreshToken.payload.exp === "number" && (
              <span className="text-xs text-slate-500">
                {'\u00B7'} expires{" "}
                {new Date(
                  refreshToken.payload.exp * 1000
                ).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            )}
          </div>
          <pre className="text-xs font-mono text-slate-500 break-all">
            {refreshToken.payload.userId
              ? `userId: ${refreshToken.payload.userId as string}`
              : JSON.stringify(refreshToken.payload, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
