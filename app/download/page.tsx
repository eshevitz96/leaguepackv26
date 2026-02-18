"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Download, Smartphone } from "lucide-react"

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col relative overflow-hidden">
            {/* Dynamic Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-[#000000] to-[#0f172a] -z-10" />
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] -z-10" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[128px] -z-10" />

            {/* Navigation */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
                        LEAGUE<span className="text-emerald-500">PACK</span>
                    </Link>
                </div>
                <Link href="/">
                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full px-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Market
                    </Button>
                </Link>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6 z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 max-w-6xl mx-auto">

                    {/* Left Column: Text & Instructions */}
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div className="space-y-6">
                            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] drop-shadow-lg">
                                THE MARKET <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                    IN YOUR POCKET.
                                </span>
                            </h1>
                            <p className="text-xl text-slate-300 max-w-md mx-auto lg:mx-0 font-medium leading-relaxed">
                                Trade teams, track your portfolio, and compete with friends anywhere. The full <span className="text-white font-bold">LeaguePack</span> experience, optimized for mobile.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "Real-time Price Alerts",
                                "Instant Trading",
                                "Start with $1,000 Free"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-4 justify-center lg:justify-start group">
                                    <div className="bg-emerald-500/20 p-2 rounded-full border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-black transition-colors duration-300">
                                        <Check className="w-5 h-5 text-emerald-400 group-hover:text-black" />
                                    </div>
                                    <span className="font-bold text-lg">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="hidden lg:block pt-8">
                            <p className="text-sm text-slate-500 mb-2 font-mono uppercase tracking-widest">Available on</p>
                            <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* Mock Store Badges */}
                                <div className="h-10 w-32 bg-white/10 rounded-lg flex items-center justify-center border border-white/5 cursor-not-allowed">
                                    <span className="text-xs font-bold">App Store</span>
                                </div>
                                <div className="h-10 w-32 bg-white/10 rounded-lg flex items-center justify-center border border-white/5 cursor-not-allowed">
                                    <span className="text-xs font-bold">Google Play</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Phone Mockup & QR Card */}
                    <div className="flex-1 relative w-full max-w-md">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600 to-emerald-400 rounded-[2.5rem] blur-2xl opacity-40 animate-pulse -z-10"></div>

                        <div className="relative bg-[#1e1e1e] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl flex flex-col items-center gap-8 backdrop-blur-xl">

                            <div className="text-center space-y-2">
                                <Smartphone className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                                <h3 className="text-3xl font-black tracking-tight">GET THE APP</h3>
                                <p className="text-slate-400 font-medium">Scan to download on iOS & Android</p>
                            </div>

                            {/* QR Code Placeholder */}
                            <div className="bg-white p-4 rounded-3xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://leaguepack.app"
                                    alt="Download QR Code"
                                    className="w-48 h-48 mix-blend-multiply"
                                />
                            </div>

                            <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black h-14 rounded-2xl text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all">
                                <Download className="w-5 h-5 mr-2" />
                                DIRECT DOWNLOAD
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
