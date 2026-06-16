import { getSession } from "@/lib/session";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default async function Home(): Promise<React.JSX.Element> {
  const session = await getSession();

  return (
    <>
      <Navbar userEmail={session?.email ?? null} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-4xl mx-auto animate-fade-in">
        {/* Hero */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider border border-blue-100">
            Next.js 16 &middot; Tailwind v4 &middot; Drizzle ORM
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
            JWT Authentication
            <br className="hidden md:inline" />
            <span className="text-blue-600"> Demo Platform</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            A full-stack authentication demo with secure JWT handling,
            automatic token rotation, and an interactive token inspector.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          {session ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              Sign In to Explore
            </Link>
          )}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 shadow-sm transition-all duration-200 cursor-pointer"
          >
            View on GitHub
          </a>
        </div>

        {/* Feature grid */}
        <div className="mt-20 w-full max-w-3xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Key Features
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 text-left">
              <p className="font-semibold text-slate-900 text-sm">
                JWT Access + Refresh Tokens
              </p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Short-lived access tokens (15min) with long-lived refresh tokens
                (7 days) for secure session management.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 text-left">
              <p className="font-semibold text-slate-900 text-sm">
                Automatic Token Rotation
              </p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Silent refresh via Next.js middleware - no disruption when
                access tokens expire mid-session.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 text-left">
              <p className="font-semibold text-slate-900 text-sm">
                Interactive Token Inspector
              </p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Decode and inspect live JWT tokens, test refresh and revocation
                directly from the dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-16 border-t border-slate-200/60 pt-10 w-full max-w-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Built With
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-600 font-medium">
            <span>Bun Runtime</span>
            <span>PostgreSQL</span>
            <span>jose JWT</span>
            <span>Drizzle ORM</span>
            <span>bcryptjs</span>
            <span>Next.js 16</span>
          </div>
        </div>
      </main>
    </>
  );
}
