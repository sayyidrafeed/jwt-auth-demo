import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JWT Authentication Demo",
  description: "A production-grade Next.js 16 authentication system with Tailwind CSS v4 and Drizzle ORM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
