"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "@/components/navbar";
import { Shield, Key, ArrowRight, Activity, Loader2 } from "lucide-react";

// The raw characters used for the shredder effect
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/\\";

function GlitchText({ text, isGlitching }: { text: string; isGlitching: boolean }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!isGlitching) {
      setDisplayText(text);
      return;
    }

    const interval = setInterval(() => {
      const newText = text
        .split("")
        .map((char) => {
          // Keep spaces as spaces
          if (char === " ") return " ";
          // Randomly replace characters with glitch chars 60% of the time
          return Math.random() > 0.4 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : char;
        })
        .join("");
      setDisplayText(newText);
    }, 40);

    return () => clearInterval(interval);
  }, [isGlitching, text]);

  return (
    <span className="glitch-text font-mono" data-glitching={isGlitching} data-text={displayText}>
      {displayText}
    </span>
  );
}

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });
  const [bgGlowPos, setBgGlowPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    // Tilt: map 0-100 to -3deg to +3deg
    const tiltY = ((x - 50) / 50) * 3;
    const tiltX = ((y - 50) / 50) * -3;
    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    setSpotPos({ x, y });
    // Viewport-relative position for background glow
    setBgGlowPos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    const card = cardRef.current;
    if (card) card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      await new Promise(r => setTimeout(r, 800));

      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-page min-h-screen bg-[#FAF7F2] text-stone-850 selection:bg-blue-100 selection:text-blue-900 font-mono antialiased relative overflow-hidden flex flex-col justify-between">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ebe8df_1px,transparent_1px),linear-gradient(to_bottom,#ebe8df_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 border-b border-stone-200/80 bg-[#FAF7F2]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar userEmail={null} />
        </div>
      </header>

      {/* Main Form Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 perspective-1000">
        {/* Background ambient blue glow — follows cursor, fades on hover */}
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 ease-out"
          style={{
            opacity: isHovering ? 0.55 : 0,
            background: `radial-gradient(800px circle at ${bgGlowPos.x}% ${bgGlowPos.y}%, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.04) 35%, transparent 70%)`,
          }}
        />
        {/* macOS window wrapper */}
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={handleMouseLeave}
          className="w-full max-w-md bg-stone-50/90 backdrop-blur-xl border border-stone-200/60 rounded-xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group transition-[box-shadow,border-color,transform] duration-500 ease-out hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.2)] hover:border-blue-200/60 relative transform-style-3d"
        >
          
          {/* macOS Titlebar */}
          <div className="bg-gradient-to-b from-white/80 to-stone-50/80 border-b border-stone-200/60 px-4 py-2.5 flex items-center justify-between relative z-20">
            <div className="flex items-center gap-2">
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5 group/lights">
                <div className="w-3 h-3 rounded-full bg-stone-300 border border-stone-400/20 shadow-inner group-hover/lights:bg-[#3B82F6] group-hover/lights:border-[#1D4ED8] transition-colors cursor-pointer flex items-center justify-center relative overflow-hidden" title="Close">
                  <div className="absolute inset-0 bg-black/20 opacity-100 group-hover/lights:opacity-0 transition-opacity" />
                </div>
                <div className="w-3 h-3 rounded-full bg-stone-300 border border-stone-400/20 shadow-inner group-hover/lights:bg-[#D1D5DB] group-hover/lights:border-[#9CA3AF] transition-colors cursor-pointer flex items-center justify-center relative overflow-hidden" title="Minimize">
                  <div className="absolute inset-0 bg-black/20 opacity-100 group-hover/lights:opacity-0 transition-opacity" />
                </div>
                <div className="w-3 h-3 rounded-full bg-stone-300 border border-stone-400/20 shadow-inner group-hover/lights:bg-[#6B7280] group-hover/lights:border-[#4B5563] transition-colors cursor-pointer flex items-center justify-center relative overflow-hidden" title="Zoom">
                  <div className="absolute inset-0 bg-black/20 opacity-100 group-hover/lights:opacity-0 transition-opacity" />
                </div>
              </div>
            </div>
            
            {/* Centered title */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              <span className="text-stone-600 font-semibold text-[10px] uppercase tracking-widest font-mono">
                <GlitchText text="PROVISION_NODE_V4.1" isGlitching={isLoading} />
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-stone-400">
              <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
            </div>
          </div>

          <div className="relative h-full transform-style-3d">
            {/* Radial spotlight that follows cursor */}
            <div 
              className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
              style={{
                opacity: isHovering ? 1 : 0,
                background: `radial-gradient(600px circle at ${spotPos.x}% ${spotPos.y}%, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0.02) 25%, transparent 60%)`,
              }}
            />

          {/* Form container */}
          <div className={`p-6 sm:p-8 flex flex-col gap-6 relative z-10 transition-opacity duration-300 ${isLoading ? "opacity-90" : "opacity-100"} translate-z-10`}>
            <div className="card-glitch-overlay bg-white rounded-b-xl" data-active={isLoading} />

            <div className="text-center sm:text-left relative z-30">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 justify-center sm:justify-start">
                <Key className="w-4 h-4 text-blue-600" />
                <GlitchText text="CREATE_IDENTITY" isGlitching={isLoading} />
              </h2>
              <p className="text-[10px] text-stone-500 mt-1 font-sans">
                <GlitchText text="Register a new operator profile with cryptographic credentials." isGlitching={isLoading} />
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold uppercase flex items-center gap-2 relative z-30">
                <Shield className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                <span>Error: {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4 relative z-30">
              <div>
                <label htmlFor="email" className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1.5 group-hover:text-blue-700 transition-colors duration-300">
                  <GlitchText text="IDENTITY_EMAIL" isGlitching={isLoading} />
                </label>
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 bg-stone-100 border border-blue-500 rounded px-3.5 py-2 text-xs font-mono text-blue-700 z-10 overflow-hidden flex items-center">
                       <GlitchText text={email || "0x00000000000000"} isGlitching={isLoading} />
                    </div>
                  )}
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., operator@node.sec"
                    className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-stone-300 group-hover:border-stone-300 hover:border-blue-300 relative z-0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1.5 group-hover:text-blue-700 transition-colors duration-300 delay-75">
                  <GlitchText text="ASSIGN_PASSPHRASE" isGlitching={isLoading} />
                </label>
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 bg-stone-100 border border-blue-500 rounded px-3.5 py-2 text-xs font-mono text-blue-700 z-10 overflow-hidden flex items-center tracking-[0.2em]">
                       <GlitchText text="****************" isGlitching={isLoading} />
                    </div>
                  )}
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-stone-350 group-hover:border-stone-300 hover:border-blue-300 relative z-0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1.5 group-hover:text-blue-700 transition-colors duration-300 delay-100">
                  <GlitchText text="CONFIRM_PASSPHRASE" isGlitching={isLoading} />
                </label>
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 bg-stone-100 border border-blue-500 rounded px-3.5 py-2 text-xs font-mono text-blue-700 z-10 overflow-hidden flex items-center tracking-[0.2em]">
                       <GlitchText text="****************" isGlitching={isLoading} />
                    </div>
                  )}
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-stone-350 group-hover:border-stone-300 hover:border-blue-300 relative z-0"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 cursor-pointer min-h-[44px] border border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_10px_rgba(37,99,235,0.2)] mt-2 group-hover:shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:scale-[1.02] relative overflow-hidden"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="text-white tracking-[0.2em]">
                      <GlitchText text="GENERATING_CLAIMS..." isGlitching={true} />
                    </span>
                  </>
                ) : (
                  <>
                    PROVISION_IDENTITY
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-stone-200/60 pt-5 mt-2 text-center">
              <p className="text-[10px] text-stone-500">
                ALREADY ENROLLED?{" "}
                <Link href="/sign-in" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                  SIGN_IN_CREDENTIALS
                </Link>
              </p>
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-stone-100/40 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-[9px] text-stone-500 font-semibold">
          SYSTEM PROVISION NODE: VERIFIED SECURE // &copy; {new Date().getFullYear()} JWT AUTH DEMO.
        </div>
      </footer>
    </div>
  );
}
