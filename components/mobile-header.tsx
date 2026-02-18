"use client"

import { useNative } from "@/app/hooks/use-native"
import { usePortfolio } from "@/app/hooks/use-portfolio"
import { Bell, Users, Trophy } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"

import { CustomLogo } from "@/components/custom-logo"

export function MobileHeader() {
    const isNative = useNative()
    const { balance, user } = usePortfolio()

    if (!isNative) return null

    return (
        <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 pb-4 pt-safe-header">
            <div className="flex items-center justify-between px-6 mb-4">
                <div className="flex items-center gap-2">
                    <CustomLogo className="w-8 h-8 text-emerald-500" />
                    <span className="text-xl font-black tracking-tighter text-white">
                        LEAGUE<span className="text-emerald-500">PACK</span>
                    </span>
                </div>
                {/* User Profile / Omni-button */}
                <div className="flex items-center gap-3">
                    {!user ? (
                        <div className="flex items-center gap-3 bg-white/5 rounded-full pl-4 pr-1 py-1 border border-white/10">
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Buying Power</p>
                                <p className="text-sm font-bold text-emerald-400 font-varsity">${balance.toFixed(2)}</p>
                            </div>
                            <AuthModal />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                            <span className="font-bold text-emerald-400">{user.email?.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Sub-nav / Quick Actions */}
            {!user && (
                <div className="grid grid-cols-2 gap-4 px-6">
                    <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300">
                        <Users className="w-4 h-4 text-emerald-500" />
                        Friends
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300">
                        <Trophy className="w-4 h-4 text-purple-500" />
                        Leagues
                    </button>
                </div>
            )}
        </header>
    )
}
