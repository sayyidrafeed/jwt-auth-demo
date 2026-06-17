"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface TokenData {
  raw: string;
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string | null;
}

export default function TokenInspectorPage() {
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

  const fetchTokenInfo = useCallback(async () => {
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
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Refresh failed");
      setActionMessage({ type: "success", text: "Tokens refreshed" });
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
      const data = await res.json();
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

  const formatJSON = (obj: Record<string, unknown>): string => {
    return JSON.stringify(obj, null, 2);
  };

  if (loading) {
    return <main><p>Loading...</p></main>;
  }

  if (!accessToken) {
    return <main><p>No active session found.</p></main>;
  }

  return (
    <main>
      <h1>Token Inspector</h1>

      <h3>Header</h3>
      <pre>{formatJSON(accessToken.header)}</pre>

      <h3>Payload</h3>
      <pre>{formatJSON(accessToken.payload)}</pre>

      <h3>Signature</h3>
      <pre>{accessToken.signature || "N/A"}</pre>

      <h3>Raw Access Token</h3>
      <button onClick={() => setShowRaw(!showRaw)}>
        {showRaw ? "Hide" : "Show"}
      </button>
      {showRaw && <pre>{accessToken.raw}</pre>}

      <h3>Actions</h3>
      <button
        onClick={handleRefresh}
        disabled={actionLoading !== null}
      >
        {actionLoading === "refresh" ? "Refreshing..." : "Refresh Tokens"}
      </button>

      <button
        onClick={handleRevoke}
        disabled={actionLoading !== null}
      >
        {actionLoading === "revoke" ? "Revoking..." : "Revoke & Sign Out"}
      </button>

      {actionMessage && (
        <p className={actionMessage.type === "success" ? "success" : "error"}>{actionMessage.text}</p>
      )}

      {refreshToken && (
        <div>
          <h3>Refresh Token</h3>
          <p>Valid &middot; expires{" "}
            {typeof refreshToken.payload.exp === "number" &&
              new Date(refreshToken.payload.exp * 1000).toLocaleString()}
          </p>
          <pre>{JSON.stringify(refreshToken.payload, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
