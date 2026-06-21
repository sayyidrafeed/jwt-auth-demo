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
        <div data-impeccable-variants="577051d1" data-impeccable-variant-count="3" style={{ display: "contents" }}>
          {/* impeccable-variants-start 577051d1 */}
          {/* Original */}
          <div data-impeccable-variant="original">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>CRYPTOGRAPHIC_TOKEN_INSPECTOR</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 leading-none">
                Token Inspector
              </h1>
              <p className="text-xs text-stone-500 font-sans mt-1 max-w-xl leading-relaxed">
                Decodes the live JWT access token from your session cookie. Inspect
                header, payload, and signature; rotate the keypair; or revoke the
                session entirely.
              </p>
            </div>
          </div>
          {/* Variants: insert below this line */}
          <style data-impeccable-css="577051d1">{`
            @scope ([data-impeccable-variant="1"]) {
              :scope > div {
                border-left: calc(var(--p-border-width, 3) * 1px) solid #2563eb;
                padding-left: calc(var(--p-spacing, 16) * 1px);
              }
              :scope > div > h1 {
                letter-spacing: -0.04em;
              }
            }
            @scope ([data-impeccable-variant="2"]) {
              :scope > div {
                background: #ffffff;
                border: 1px solid #e7e5e4;
                border-radius: 12px;
                padding: calc(var(--p-padding, 24) * 1px);
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                position: relative;
                overflow: hidden;
              }
              :scope > div::before {
                content: '';
                position: absolute;
                top: 0; left: 0;
                width: 100%;
                height: 3px;
                background: #2563eb;
              }
              :scope > div h1 {
                font-family: ui-monospace, 'SF Mono', Monaco, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
                letter-spacing: -0.05em;
              }
            }
            @scope ([data-impeccable-variant="3"]) {
              :scope > div {
                align-items: center;
                text-align: center;
                max-width: 600px;
                margin: 0 auto;
                padding-bottom: calc(var(--p-spacing, 16) * 1px);
                border-bottom: 1px solid #e7e5e4;
              }
              :scope > div > p {
                font-size: 0.875rem;
              }
              :scope > div > h1 {
                font-size: 2.5rem;
                letter-spacing: -0.03em;
              }
            }
          `}</style>
          <div
            data-impeccable-variant="1"
            data-impeccable-params={JSON.stringify([
              { id: "border-width", kind: "range", min: 1, max: 8, step: 1, default: 3, label: "Border Width" },
              { id: "spacing", kind: "range", min: 8, max: 32, step: 4, default: 16, label: "Left Padding" }
            ])}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>CRYPTOGRAPHIC_TOKEN_INSPECTOR</span>
              </div>
              <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold tracking-tight text-stone-900 leading-none">
                Token Inspector
              </h1>
              <p className="text-[13px] text-stone-600 font-sans mt-1 max-w-2xl leading-relaxed">
                Decodes the live JWT access token from your session cookie. Inspect header, payload, and signature; rotate the keypair; or revoke the session entirely.
              </p>
            </div>
          </div>
          <div
            data-impeccable-variant="2"
            style={{ display: "none" }}
            data-impeccable-params={JSON.stringify([
              { id: "padding", kind: "range", min: 16, max: 40, step: 4, default: 24, label: "Container Padding" }
            ])}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between w-full border-b border-stone-100 pb-3 mb-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-stone-600 uppercase tracking-widest font-mono">
                  <Database className="w-3.5 h-3.5 text-stone-400" />
                  <span>SESSION_MANIFEST_VIEWER</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" aria-hidden="true" />
                  <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">LIVE</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 leading-none">
                Token Inspector
              </h1>
              <p className="text-[13px] text-stone-600 font-sans max-w-3xl leading-relaxed">
                Decodes the live JWT access token from your session cookie. Inspect header, payload, and signature; rotate the keypair; or revoke the session entirely.
              </p>
            </div>
          </div>
          <div
            data-impeccable-variant="3"
            style={{ display: "none" }}
            data-impeccable-params={JSON.stringify([
              { id: "spacing", kind: "range", min: 16, max: 48, step: 8, default: 16, label: "Bottom Spacing" }
            ])}
          >
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 rounded-full text-[10px] font-bold text-stone-600 uppercase tracking-widest font-mono shadow-sm">
                <Database className="w-3 h-3 text-blue-600" />
                <span>CRYPTOGRAPHIC_TOKEN_INSPECTOR</span>
              </div>
              <h1 className="font-extrabold tracking-tight text-stone-900 leading-none mt-2">
                Token Inspector
              </h1>
              <p className="text-stone-500 font-sans mt-2 max-w-xl leading-relaxed">
                Decodes the live JWT access token from your session cookie. Inspect header, payload, and signature; rotate the keypair; or revoke the session entirely.
              </p>
            </div>
          </div>
          {/* impeccable-variants-end 577051d1 */}
        </div>

        <TokenInspector userEmail={session.email} />
      </main>
    </div>
  );
}
