import { getSession } from "@/lib/session";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";
import VerifyButton from "@/components/verify-button";
import AuthDemoPanel from "./auth-demo-panel";
import { Shield, Key, Eye, Binary, Cpu, Calendar, User } from "lucide-react";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="dashboard-page min-h-screen bg-[#FAF7F2] text-stone-850 selection:bg-blue-100 selection:text-blue-900 font-mono antialiased relative overflow-hidden">
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
        {/* Console Node Status bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white border border-stone-200 rounded shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <div className="text-[10px] font-bold text-stone-500 tracking-wider uppercase flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>ACTIVE_NODE: // SECURE_AUTH_SANDBOX_V1</span>
            </div>
          </div>
          <div className="text-[10px] text-stone-500 font-semibold self-end sm:self-auto">
            JWT_STATUS: <span className="text-blue-600">VERIFIED_STATELESS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Session Manifest */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <section className="bg-white border border-stone-200 rounded p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-600" />
              
              <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-3">
                <Key className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-850">
                  SESSION_INFO_MANIFEST
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" /> EMAIL_ADDRESS
                  </span>
                  <span className="sm:col-span-2 text-xs font-semibold text-stone-900 break-all">
                    {session.email}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                    <Binary className="w-3.5 h-3.5 text-stone-400" /> USER_UNIQUE_ID
                  </span>
                  <span className="sm:col-span-2 text-xs text-blue-600 break-all">
                    {session.userId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-stone-400" /> TOKEN_ID_JTI
                  </span>
                  <span className="sm:col-span-2 text-xs text-stone-600 break-all">
                    {session.jti}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" /> ISSUED_TIMESTAMP
                  </span>
                  <span className="sm:col-span-2 text-xs text-stone-750">
                    {session.iat ? new Date(session.iat * 1000).toLocaleString() : "—"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" /> EXPIRATION_TIME
                  </span>
                  <span className="sm:col-span-2 text-xs text-stone-750">
                    {session.exp ? new Date(session.exp * 1000).toLocaleString() : "—"}
                  </span>
                </div>
              </div>
            </section>

            {/* Verification Sandbox Panel */}
            <section className="bg-white border border-stone-200 rounded p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-stone-300" />
              
              <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
                <Cpu className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-850">
                  SESSION_PROBE_SANDBOX
                </h2>
              </div>
              <VerifyButton />
            </section>
          </div>

          {/* Right Column: Protected Assets & Auth Demo */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Protected Asset Viewport */}
            <section className="bg-white border border-stone-200 rounded p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-600" />
              
              <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
                <Eye className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-850">
                  SECURE_VIEWPORT
                </h2>
              </div>
              
              <p className="text-[11px] text-stone-500 leading-relaxed font-sans mb-4">
                This asset is fetched from <code>/api/assets/cat-hihi.webp</code>. It is protected by cookie validation inside Next.js API routes.
              </p>

              <div className="relative border border-stone-200 rounded overflow-hidden bg-stone-50 flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/api/assets/cat-hihi.webp"
                  alt="Protected cat asset"
                  className="rounded border border-stone-200 max-h-56 object-contain"
                />
                <span className="absolute top-3 right-3 text-[9px] font-bold tracking-widest bg-blue-600 text-white px-2 py-0.5 rounded shadow">
                  AUTHENTICATED
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

