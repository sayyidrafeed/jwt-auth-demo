import { getSession } from "@/lib/session";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard(): Promise<React.JSX.Element> {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const issuedAt = session.iat
    ? new Date(session.iat * 1000).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  const expirationTime = session.exp
    ? new Date(session.exp * 1000).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <>
      <Navbar userEmail={session.email} />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Welcome back,{" "}
              <span className="font-medium text-slate-700">
                {session.email}
              </span>
            </p>
          </div>
          <Link
            href="/tokens"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
          >
            Token Inspector
          </Link>
        </div>

        {/* Session status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200/60">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Session
            </p>
            <p className="text-lg font-bold text-green-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              Active
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Token Type
            </p>
            <p className="text-lg font-bold text-slate-900">JWT HS256</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Issued At
            </p>
            <p className="text-sm font-medium text-slate-700">
              {issuedAt || "N/A"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Expires At
            </p>
            <p className="text-sm font-medium text-slate-700">
              {expirationTime || "N/A"}
            </p>
          </div>
        </div>

        {/* User details */}
        <div className="bg-white rounded-xl border border-slate-200/60 mb-8">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">
              User Details
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Email
              </p>
              <p className="text-sm font-medium text-slate-900">
                {session.email}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                User ID (UUID)
              </p>
              <p
                className="text-sm font-mono text-slate-700 truncate"
                title={session.userId}
              >
                {session.userId}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Token ID (JTI)
              </p>
              <p
                className="text-sm font-mono text-slate-700 truncate"
                title={session.jti}
              >
                {session.jti}
              </p>
            </div>
          </div>
        </div>

        {/* Demo feature highlights */}
        <div className="bg-white rounded-xl border border-slate-200/60">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">
              How Authentication Works
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="font-semibold text-slate-900 text-sm mb-1">
                Double Cookie Strategy
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Access token (15 min) and refresh token (7 days) stored in
                httpOnly, Secure, SameSite cookies - protected against XSS.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="font-semibold text-slate-900 text-sm mb-1">
                Silent Token Rotation
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Expired access tokens automatically refreshed via middleware
                using rotating refresh token strategy.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="font-semibold text-slate-900 text-sm mb-1">
                Token Blacklisting
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Optionally revoke access tokens on logout via JTI blacklisting
                in the database (ENABLE_TOKEN_BLACKLIST).
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
