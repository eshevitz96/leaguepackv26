"use client"

import { Team } from "@/app/data/teams"
import { JerseyIcon } from "@/components/jersey-icon"

export function TeamPromoCard({ team, format = "square" }: { team: Team, format?: "square" | "story" }) {
    if (!team) return null

    const isStory = format === "story"

    return (
        <div className="w-full h-full relative bg-slate-950 flex flex-col items-center justify-between p-8 md:p-12 overflow-hidden">

            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />

            {/* Glow / Spotlight - Adjusted for Format */}
            <div className={`absolute ${isStory ? "top-[-10%] right-[-30%]" : "top-[-20%] right-[-20%]"} w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px]`} />
            <div className={`absolute ${isStory ? "bottom-[-10%] left-[-30%]" : "bottom-[-20%] left-[-20%]"} w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]`} />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

            {/* Header / Branding */}
            <div className="relative z-10 w-full flex justify-center pt-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full shadow-xl">
                    <span className="text-white font-black tracking-[0.2em] text-sm md:text-base">LEAGUEPACK MARKET</span>
                </div>
            </div>

            {/* Main Content Container */}
            <div className={`relative z-10 flex flex-col items-center w-full ${isStory ? "flex-1 justify-center gap-12" : "gap-8 mt-8"}`}>

                {/* Jersey Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-125 animate-pulse" />
                    <JerseyIcon
                        sport={team.sport}
                        initial={team.initial}
                        color={team.color}
                        className={`${isStory ? "w-72 h-72 md:w-96 md:h-96" : "w-56 h-56 md:w-64 md:h-64"} drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500`}
                    />
                </div>

                {/* Team Info */}
                <div className="space-y-4 px-4 w-full text-center">
                    <h1 className={`${isStory ? "text-5xl md:text-7xl" : "text-3xl md:text-5xl"} font-black text-white tracking-tighter uppercase leading-[0.9] drop-shadow-2xl line-clamp-2`}>
                        {team.name}
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <span className="text-xl text-slate-400 font-bold tracking-widest uppercase">{team.ticker}</span>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-xl text-slate-400 font-bold tracking-widest uppercase">{team.sport}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className={`w-full ${isStory ? "grid grid-cols-2 gap-4 px-4" : "flex items-center justify-center gap-8 border-t border-white/10 pt-8"}`}>
                    <div className={`text-center ${isStory ? "bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm" : ""}`}>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] mb-1">Rank</p>
                        <p className={`${isStory ? "text-5xl" : "text-4xl md:text-5xl"} font-black text-white`}>#{team.rank}</p>
                    </div>

                    {!isStory && <div className="w-px h-16 bg-white/10" />}

                    <div className={`text-center ${isStory ? "bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm" : ""}`}>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] mb-1">Price</p>
                        <p className={`${isStory ? "text-5xl" : "text-4xl md:text-5xl"} font-black text-emerald-400 drop-shadow-lg`}>${team.price.toFixed(2)}</p>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className={`relative z-10 w-full text-center ${isStory ? "pb-8" : "pb-4"}`}>
                <p className="text-slate-500 font-medium tracking-wide text-xs md:text-sm bg-slate-950/80 backdrop-blur-md py-2 inline-block px-6 rounded-full border border-white/10 shadow-lg">
                    Trade now on LeaguePack.app
                </p>
            </div>
        </div>
    )
}
