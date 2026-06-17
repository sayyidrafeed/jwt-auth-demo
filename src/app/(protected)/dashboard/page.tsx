import { getSession } from "@/lib/session";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";
import VerifyButton from "@/components/verify-button";
import AuthDemoPanel from "./auth-demo-panel";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <Navbar userEmail={session.email} />
      <main className="dashboard">
        <h1>Dashboard</h1>

        <section className="card session-card">
          <h2>Session Info</h2>
          <dl>
            <dt>Email</dt>
            <dd>{session.email}</dd>
            <dt>User ID</dt>
            <dd className="mono">{session.userId}</dd>
            <dt>Token ID (jti)</dt>
            <dd className="mono">{session.jti}</dd>
            <dt>Issued At</dt>
            <dd>{session.iat ? new Date(session.iat * 1000).toLocaleString() : "—"}</dd>
            <dt>Expires</dt>
            <dd>{session.exp ? new Date(session.exp * 1000).toLocaleString() : "—"}</dd>
          </dl>
        </section>

        <section className="card protected-asset-card">
          <h2>Protected Asset</h2>
          <p>
            This image is served through <code>/api/assets/cat-hihi.webp</code> —
            an authenticated-only endpoint. Without a valid <code>access_token</code> cookie,
            the server returns <strong>401 Unauthorized</strong>.
          </p>
          <div className="asset-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/assets/cat-hihi.webp"
              alt="Protected cat asset loaded via authenticated API"
              className="protected-image"
            />
            <span className="badge auth-badge">Authenticated</span>
          </div>
        </section>

        <AuthDemoPanel />

        <VerifyButton />
      </main>
    </>
  );
}
