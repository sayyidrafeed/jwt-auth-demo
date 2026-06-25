import { getSession } from "@/lib/session";
import { db } from "@/db";
import { refreshTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";
import VerifyButton from "@/components/verify-button";
import { parseUserAgent } from "@/lib/user-agent";
import AuthDemoPanel from "./auth-demo-panel";
import XssDemoPanel from "./xss-demo-panel";
import { Shield, Key, Eye, Binary, Cpu, Calendar, User, MonitorSmartphone, Globe } from "lucide-react";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const sessionInfo = await db
    .select({
      deviceName: refreshTokens.deviceName,
      ipAddress: refreshTokens.ipAddress,
      createdAt: refreshTokens.createdAt,
    })
    .from(refreshTokens)
    .where(eq(refreshTokens.userId, session.userId))
    .limit(1);

  const device = sessionInfo[0];
  const deviceLabel = device?.deviceName
    ? parseUserAgent(device.deviceName)
    : "Unknown Device";

  return (
    <div className="dashboard-page min-h-screen bg-[#FAF7F2] text-stone-900 selection:bg-blue-100 selection:text-blue-900 font-mono antialiased relative overflow-hidden">
      {/* Warm niche grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ebe8df_1px,transparent_1px),linear-gradient(to_bottom,#ebe8df_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-stone-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 border-b border-stone-200/80 bg-[#FAF7F2]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar userEmail={session.email} />
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        {/* Page heading */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>SECURE_AUTH_SANDBOX_V1</span>
          </div>
          <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold tracking-[-0.04em] text-stone-900 leading-none">
            Session Dashboard
          </h1>
          <p className="text-[13px] text-stone-600 font-sans mt-1 max-w-2xl leading-relaxed">
            Inspect your current session claims, test server-side token
            validation, and probe protected API endpoints.
          </p>
        </div>

        {/* Console Node Status bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"
              role="status"
              aria-label="Sandbox is active"
            />
            <div className="text-[10px] font-bold text-stone-500 tracking-wider uppercase font-mono flex items-center gap-1.5">
              <span>ACTIVE_NODE: // SECURE_AUTH_SANDBOX_V1</span>
            </div>
          </div>
          <div className="text-[10px] text-stone-400 font-mono font-semibold">
            JWT_STATUS:{" "}
            <span className="text-blue-600">VERIFIED_STATELESS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-8">
          {/* Left Column: Session Manifest */}
          <div className="xl:col-span-6 flex flex-col gap-6">
            <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-3">
                <Key className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  SESSION_INFO_MANIFEST
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />{" "}
                    EMAIL_ADDRESS
                  </span>
                  <span className="sm:col-span-2 text-xs font-semibold text-stone-900 break-all">
                    {session.email}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                    <Binary className="w-3.5 h-3.5 text-stone-400" />{" "}
                    USER_UNIQUE_ID
                  </span>
                  <span className="sm:col-span-2 text-xs text-blue-600 break-all">
                    {session.userId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-stone-400" />{" "}
                    ROLE
                  </span>
                  <span className="sm:col-span-2 text-xs font-bold text-blue-600 uppercase">
                    {session.role}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-stone-400" />{" "}
                    TOKEN_ID_JTI
                  </span>
                  <span className="sm:col-span-2 text-xs text-stone-600 break-all">
                    {session.jti}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />{" "}
                    ISSUED_TIMESTAMP
                  </span>
                  <span className="sm:col-span-2 text-xs text-stone-500">
                    {session.iat
                      ? new Date(session.iat * 1000).toLocaleString()
                      : "—"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />{" "}
                    EXPIRATION_TIME
                  </span>
                  <span className="sm:col-span-2 text-xs text-stone-500">
                    {session.exp
                      ? new Date(session.exp * 1000).toLocaleString()
                      : "—"}
                  </span>
                </div>
              </div>
            </section>

            {device && (
              <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-3">
                  <MonitorSmartphone className="w-4 h-4 text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    ACTIVE_SESSION_DEVICE
                  </h2>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-stone-100">
                    <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                      <MonitorSmartphone className="w-3.5 h-3.5 text-stone-400" /> DEVICE
                    </span>
                    <span className="sm:col-span-2 text-xs font-semibold text-stone-900">
                      {deviceLabel}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-stone-100">
                    <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-stone-400" /> IP_ADDRESS
                    </span>
                    <span className="sm:col-span-2 text-xs text-stone-600">
                      {device.ipAddress || "Unknown"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2">
                    <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" /> LOGGED_IN_SINCE
                    </span>
                    <span className="sm:col-span-2 text-xs text-stone-500">
                      {device.createdAt?.toLocaleString() || "—"}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Verification Sandbox Panel */}
            <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
                <Cpu className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  SESSION_PROBE_SANDBOX
                </h2>
              </div>
              <VerifyButton />
            </section>

            {/* XSS Demo Probe */}
            <XssDemoPanel />
          </div>

          {/* Right Column: Protected Assets & Auth Demo */}
          <div className="xl:col-span-6 flex flex-col gap-6">
            {/* Protected Asset Viewport */}
            <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
                <Eye className="w-4 h-4 text-stone-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  SECURE_VIEWPORT
                </h2>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed font-sans mb-4">
                This asset is fetched from{" "}
                <code>/api/assets/{session.role === "admin" ? "cat-hihi.webp" : "cat-hehe.webp"}</code>.
                It is protected by cookie validation and role-based access control.
              </p>

              <div className="relative border border-stone-200 rounded overflow-hidden bg-stone-50 flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={session.role === "admin" ? "/api/assets/cat-hihi.webp" : "/api/assets/cat-hehe.webp"}
                  alt="Protected role asset"
                  className="rounded border border-stone-200 max-h-56 object-contain"
                />
                <span className="absolute top-3 right-3 text-[9px] font-bold tracking-widest bg-blue-600 text-white px-2 py-0.5 rounded shadow">
                  {session.role.toUpperCase()}
                </span>
              </div>
            </section>

            {/* Auth Demo Probe */}
            <AuthDemoPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
