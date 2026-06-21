import { getSession } from "@/lib/session";
import Navbar from "@/components/navbar";
import Link from "next/link";
import VerifyButton from "@/components/verify-button";
import Jwtsimulator from "@/components/jwt-simulator";
import { Shield, Lock, RefreshCw, Terminal, ArrowRight, Binary } from "lucide-react";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="landing-page min-h-screen bg-[#FAF7F2] text-stone-850 selection:bg-blue-100 selection:text-blue-900 font-mono antialiased relative overflow-hidden">
      {/* Warm niche grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ebe8df_1px,transparent_1px),linear-gradient(to_bottom,#ebe8df_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-stone-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 border-b border-stone-200/80 bg-[#FAF7F2]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar userEmail={session?.email ?? null} />
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col gap-16">
        
        {/* Hero & Interactive Simulator Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Console Details */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
              <Binary className="w-3.5 h-3.5 text-blue-600" />
              <span>PROTOCOL // SECURE_AUTH_NODE</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-none">
              Stateless JWT <br />
              <span className="text-blue-600">
                with Stateful Revocation
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans max-w-xl">
              An advanced, developer-focused demo demonstrating the exact mechanics of production-ready JSON Web Token architectures. Implements secure HttpOnly cookies, background session rotation, and a stateful revocation blacklist database.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold rounded bg-blue-600 text-white hover:bg-blue-500 transition-all duration-150 cursor-pointer min-h-[44px] border border-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                >
                  ENTER DEVELOPER DASHBOARD
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold rounded bg-blue-600 text-white hover:bg-blue-500 transition-all duration-150 cursor-pointer min-h-[44px] border border-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                  >
                    GENERATE ACCOUNT
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center px-5 py-3 text-xs font-bold rounded bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition-all duration-150 cursor-pointer min-h-[44px]"
                  >
                    SIGN IN TO NODE
                  </Link>
                </>
              )}
            </div>

            {/* Live Verification Panel */}
            <div className="mt-4 p-4 rounded bg-stone-100/50 border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-stone-500 font-bold tracking-wider uppercase">SESSION_PROBE_SANDBOX</span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block" />
              </div>
              <VerifyButton />
            </div>
          </div>

          {/* Right Column: Interactive Cryptographic Decoded Board */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="text-center lg:text-left mb-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">LIVE INTERACTIVE MODULE</span>
            </div>
            <Jwtsimulator />
          </div>
        </section>

        {/* Spec Blueprint Mechanics */}
        <section className="border-t border-stone-200/80 pt-16">
          <div className="mb-12">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-600" />
              SPECIFICATION_SPEC_SHEET
            </h2>
            <p className="text-stone-500 text-[11px] mt-1 font-sans">
              Technical implementation constraints and architecture highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Spec 1 */}
            <div className="p-5 rounded bg-white border border-stone-200 hover:border-stone-300 transition-all duration-200 shadow-sm">
              <div className="flex items-center gap-2 text-stone-700 mb-3">
                <Lock className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs">HTTP_ONLY_SHIELDING</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed font-sans">
                Prevents cross-site scripting (XSS) attacks by keeping session JWTs out of browser-accessible JavaScript namespaces. Tokens are transferred exclusively via securely-configured HTTP headers.
              </p>
            </div>

            {/* Spec 2 */}
            <div className="p-5 rounded bg-white border border-stone-200 hover:border-stone-300 transition-all duration-200 shadow-sm">
              <div className="flex items-center gap-2 text-stone-700 mb-3">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs">TOKEN_ROTATION_ROT</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed font-sans">
                Silent token rotation handles background refreshes transparently. If the access token expires, a short-lived refresh token issues a brand new keypair dynamically, maintaining high security without disturbing usability.
              </p>
            </div>

            {/* Spec 3 */}
            <div className="p-5 rounded bg-white border border-stone-200 hover:border-stone-300 transition-all duration-200 shadow-sm">
              <div className="flex items-center gap-2 text-stone-700 mb-3">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs">STATEFUL_BLACKLIST</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed font-sans">
                Combines performance and security: verified sessions remain completely stateless in Next.js middleware, but explicitly revoked credentials (from logouts or lockouts) check an optimized blacklist database in real-time.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Terminal-style Footer */}
      <footer className="border-t border-stone-200/80 bg-stone-100/40 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-stone-500 font-semibold">
          <p>SYSTEM STATE: SECURE // &copy; {new Date().getFullYear()} JWT Authentication Demo Node.</p>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">REPOSITORY_SOURCE</a>
            <span>//</span>
            <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">NEXTJS_DOCUMENTATION</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
