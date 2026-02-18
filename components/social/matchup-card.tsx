import { Team } from "@/app/data/teams"
import { JerseyIcon } from "@/components/jersey-icon"

interface MatchupCardProps {
    team1: Team
    team2: Team
    format?: "square" | "story"
}

export function MatchupCard({ team1, team2, format = "square" }: MatchupCardProps) {
    if (!team1 || !team2) return null

    const isStory = format === "story"

    return (
        <div className="w-full h-full relative bg-slate-950 flex flex-col p-8 overflow-hidden">

            {/* Background Split */}
            <div className={`absolute inset-0 flex ${isStory ? "flex-col" : "flex-row"}`}>
                <div className={`${isStory ? "w-full h-1/2 border-b" : "w-1/2 h-full border-r"} bg-slate-900 border-white/5 relative overflow-hidden`}>
                    <div className="absolute -left-20 top-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px]" />
                </div>
                <div className={`${isStory ? "w-full h-1/2" : "w-1/2 h-full"} bg-slate-950 relative overflow-hidden`}>
                    <div className="absolute -right-20 bottom-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px]" />
                </div>
            </div>

            {/* Header */}
            <div className="relative z-10 text-center mb-4 md:mb-8">
                <div className="inline-block bg-white text-black font-black px-4 py-1 rounded text-xs tracking-[0.2em]">MARKET MATCHUP</div>
            </div>

            {/* Content Container - Relative for positioning */}
            <div className="relative z-10 flex-1 w-full h-full">

                {/* VS Badge - Always Absolute Center */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] border-4 border-slate-950">
                        <span className="text-slate-950 font-black text-2xl italic">VS</span>
                    </div>
                </div>

                {/* Team 1 */}
                <div className={`absolute flex flex-col items-center justify-center gap-2 md:gap-4 transition-all duration-500
                    ${isStory
                        ? "top-[5%] left-0 w-full h-[40%] px-8" // Brought closer to center
                        : "left-0 top-0 h-full w-[45%] pl-4"
                    }
                `}>
                    <div className="relative">
                        <JerseyIcon
                            sport={team1.sport}
                            initial={team1.initial}
                            color={team1.color}
                            className={`${isStory ? "w-32 h-32" : "w-32 h-32 md:w-36 md:h-36"} drop-shadow-2xl transition-all`}
                        />
                        <div className="absolute -top-3 -left-3 bg-slate-800 text-white font-black px-3 py-1 rounded text-sm shadow-xl">#{team1.rank}</div>
                    </div>
                    <div className="text-center w-full px-4">
                        <h2 className={`font-black text-white leading-tight mb-1 break-words flex items-center justify-center line-clamp-2 ${isStory ? "text-3xl" : "text-xl md:text-2xl min-h-[3.5rem]"}`}>
                            {team1.name}
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className={`font-black text-emerald-400 drop-shadow-lg ${isStory ? "text-4xl" : "text-2xl md:text-3xl"}`}>${team1.price.toFixed(2)}</div>

                            {/* Trend 1 */}
                            <div className={`flex items-center gap-1.5 mt-1 ${isStory ? "bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm" : "bg-slate-900/50 px-2 py-0.5 rounded-full border border-white/10"}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${team1.change >= 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
                                <span className={`font-bold tracking-wider ${isStory ? "text-sm text-slate-300" : "text-xs text-slate-400"}`}>
                                    {team1.change > 0 ? "+" : ""}{team1.change}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team 2 */}
                <div className={`absolute flex flex-col items-center justify-center gap-2 md:gap-4 transition-all duration-500
                    ${isStory
                        ? "bottom-[5%] left-0 w-full h-[40%] px-8" // Brought closer to center
                        : "right-0 top-0 h-full w-[45%] pr-4"
                    }
                `}>
                    <div className="relative">
                        <JerseyIcon
                            sport={team2.sport}
                            initial={team2.initial}
                            color={team2.color}
                            className={`${isStory ? "w-32 h-32" : "w-32 h-32 md:w-36 md:h-36"} drop-shadow-2xl transition-all`}
                        />
                        <div className={`absolute ${isStory ? "-top-3 -left-3" : "-top-3 -right-3"} bg-slate-800 text-white font-black px-3 py-1 rounded text-sm shadow-xl`}>#{team2.rank}</div>
                    </div>
                    <div className="text-center w-full px-4">
                        <h2 className={`font-black text-white leading-tight mb-1 break-words flex items-center justify-center line-clamp-2 ${isStory ? "text-3xl" : "text-xl md:text-2xl min-h-[3.5rem]"}`}>
                            {team2.name}
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className={`font-black text-emerald-400 drop-shadow-lg ${isStory ? "text-4xl" : "text-2xl md:text-3xl"}`}>${team2.price.toFixed(2)}</div>

                            {/* Trend 2 */}
                            <div className={`flex items-center gap-1.5 mt-1 ${isStory ? "bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm" : "bg-slate-900/50 px-2 py-0.5 rounded-full border border-white/10"}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${team2.change >= 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
                                <span className={`font-bold tracking-wider ${isStory ? "text-sm text-slate-300" : "text-xs text-slate-400"}`}>
                                    {team2.change > 0 ? "+" : ""}{team2.change}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="relative z-10 text-center mt-auto pb-4 pt-4">
                <div className="inline-block border-t border-white/10 pt-4 px-8">
                    <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">
                        Who is the better buy?
                    </p>
                    <p className="text-emerald-500 font-bold text-xs mt-1">LeaguePack.app</p>
                </div>
            </div>
        </div>
    )
}
