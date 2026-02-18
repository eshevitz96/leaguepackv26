import type { Metadata } from "next";
import { Geist, Geist_Mono, Graduate } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const graduate = Graduate({
  weight: "400",
  variable: "--font-graduate",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "LeaguePack",
  description: "The Fantasy Stock Market for College Sports",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";

import { PortfolioProvider } from "@/app/hooks/use-portfolio";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${graduate.variable} antialiased min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30`}
      >
        <PortfolioProvider>
          <MobileHeader />
          {children}
          <MobileNav />
        </PortfolioProvider>
      </body>
    </html>
  );
}
