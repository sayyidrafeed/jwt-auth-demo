import { getSession } from "@/lib/session";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";
import TokenInspector from "./token-inspector";
import { Database } from "lucide-react";

export default async function TokensPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="dashboard-page min-h-screen bg-[#FAF7F2] text-stone-900 font-mono antialiased relative overflow-hidden">
      {/* Grid background */}
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
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>CRYPTOGRAPHIC_TOKEN_INSPECTOR</span>
          </div>
          <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold tracking-[-0.04em] text-stone-900 leading-none">
            Token Inspector
          </h1>
          <p className="text-[13px] text-stone-600 font-sans mt-1 max-w-2xl leading-relaxed">
            Decodes the live JWT access token from your session cookie. Inspect header, payload, and signature; rotate the keypair; or revoke the session entirely.
          </p>
        </div>

        <TokenInspector userEmail={session.email} />
      </main>
    </div>
  );
}
