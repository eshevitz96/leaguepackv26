"use client"

import { Team } from "@/app/data/teams"
import { JerseyIcon } from "@/components/jersey-icon"
import { Button } from "@/components/ui/button"
import { TrendingUp, ArrowRight } from "lucide-react"

interface MarketHeroProps {
    team: Team
    isMobile?: boolean
}

export function MarketHero({ team, isMobile = false }: MarketHeroProps) {
    if (!team) return null

    return (
        <div className={`relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-white/10 ${isMobile ? 'p-6 mb-0 h-full' : 'p-8 md:p-12 mb-12'} group`}>
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

                {/* Text Content */}
                <div className="space-y-6 text-center md:text-left max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4" />
                        Market Mover
                    </div>

                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                            {team.name}
                        </h2>
                        <p className="text-xl text-slate-400 font-medium">
                            The #{team.rank} ranked team is dominating the {team.sport} market.
                        </p>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Price</p>
                            <p className="text-4xl font-black text-white font-varsity">${team.price.toFixed(2)}</p>
                        </div>
                        <div className="h-12 w-px bg-white/10 mx-4" />
                        <div className="text-center md:text-left">
                            <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Change</p>
                            <p className={`text-2xl font-bold font-varsity ${team.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                {team.change > 0 ? "+" : ""}{team.change}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visual / Jersey */}
                <div className="relative transform group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-110" />
                    <JerseyIcon
                        sport={team.sport}
                        initial={team.initial}
                        color={team.color}
                        className={`${isMobile ? 'w-32 h-32' : 'w-48 h-48 md:w-64 md:h-64'} drop-shadow-2xl`}
                    />
                </div>
            </div>
        </div>
    )
}
