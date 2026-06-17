"use client";

import { useState } from "react";

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
    <section className="card demo-card">
      <h2>Authorization Demo</h2>
      <p>
        The asset endpoint requires a valid JWT in the <code>access_token</code> cookie.
        Click below to simulate an unauthenticated request (no cookies sent):
      </p>
      <button onClick={testUnauthenticated} disabled={testResult.loading}>
        {testResult.loading ? "Testing..." : "Test Unauthenticated Access"}
      </button>
      {testResult.status && (
        <div className={`test-result ${testResult.status === 401 ? "error" : ""}`}>
          <p>
            <strong>Status:</strong> {testResult.status}{" "}
            {testResult.status === 401
              ? "(Unauthorized — access denied)"
              : "(Unexpected)"}
          </p>
          {testResult.body && (
            <pre>{testResult.body}</pre>
          )}
        </div>
      )}
    </section>
  );
}
