"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JerseyIcon } from "@/components/jersey-icon"
import { TradeModal } from "@/components/trade-modal"
import { Team } from "@/app/data/teams"

interface MarketCardProps {
    team: Team
    balance: number
    holdings: number
    onTrade: (amount: number, cost: number) => void
}

export function MarketCard({ team, balance, holdings, onTrade }: MarketCardProps) {
    const isPositive = team.change >= 0

    return (
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-purple-600/20 transition-all" />

            <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
                <span className="text-slate-600">RANK</span>
                <span className="text-white font-bold">#{team.rank}</span>
            </div>

            <CardContent className="pt-4 md:pt-8 px-3 md:px-6 pb-4 md:pb-6 flex flex-col items-center text-center relative z-10">
                <div className="relative mb-4 md:mb-6">
                    <div className="absolute inset-0 bg-white/5 rounded-full blur-xl scale-125 group-hover:scale-150 transition-transform duration-500" />
                    <JerseyIcon
                        color={team.color}
                        initial={team.initial}
                        sport={team.sport}
                        className="w-16 h-16 md:w-24 md:h-24 drop-shadow-2xl relative z-10"
                    />
                </div>

                <div className="space-y-1 mb-4 md:mb-6">
                    <h3 className="text-sm md:text-xl font-bold text-white tracking-tight">{team.name}</h3>
                    <p className="text-[10px] md:text-xs text-slate-500 font-medium tracking-wide uppercase">{team.ticker} • {team.sport}</p>
                </div>

                <div className="flex items-baseline gap-2 md:gap-3 mb-4 md:mb-8">
                    <div className="text-xl md:text-3xl font-black text-white tracking-tight font-varsity">${team.price.toFixed(2)}</div>
                    <div className={`text-xs md:text-sm font-bold flex items-center gap-0.5 font-varsity ${isPositive ? "text-emerald-400" : "text-rose-500"}`}>
                        {isPositive ? "+" : ""}{team.change}%
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-4 w-full mt-auto">
                    <TradeModal
                        team={team}
                        type="buy"
                        balance={balance}
                        onTrade={onTrade}
                        trigger={
                            <Button className="h-8 md:h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-wide border-0 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all rounded-lg md:rounded-xl relative overflow-hidden group/btn text-xs md:text-base">
                                <span className="relative z-10 flex items-center gap-2">
                                    BUY
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                            </Button>
                        }
                    />
                    <TradeModal
                        team={team}
                        type="sell"
                        balance={balance}
                        holdings={holdings}
                        onTrade={(amount, cost) => onTrade(-amount, -cost)}
                        trigger={
                            <Button
                                variant="outline"
                                className="h-8 md:h-12 border-slate-700 bg-slate-900/50 hover:bg-rose-500/10 hover:border-rose-500/50 hover:text-rose-400 text-slate-400 font-bold tracking-wide transition-all rounded-lg md:rounded-xl text-xs md:text-base"
                                disabled={holdings <= 0}
                            >
                                SELL
                            </Button>
                        }
                    />
                </div>
            </CardContent>
        </Card>
    )
}
