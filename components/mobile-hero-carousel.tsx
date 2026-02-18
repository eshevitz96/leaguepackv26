"use client"

import { Team } from "@/app/data/teams"
import { MarketHero } from "@/components/market-hero"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, Ticket, ChevronRight } from "lucide-react"

interface MobileHeroCarouselProps {
    team: Team
}

export function MobileHeroCarousel({ team }: MobileHeroCarouselProps) {
    if (!team) return null

    return (
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
            {/* Slide 1: Market Hero */}
            <div className="min-w-[85vw] snap-center">
                <div className="transform scale-100 origin-top-left">
                    <MarketHero team={team} isMobile={true} />
                </div>
            </div>

            {/* Slide 2: Referral Promo */}
            <div className="min-w-[85vw] snap-center">
                <Card className="h-full bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                        <div className="space-y-2">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                                <Gift className="w-5 h-5" />
                            </div>
                            <h3 className="text-2xl font-black text-white italic">FREE $50</h3>
                            <p className="text-slate-400 text-sm font-medium">Refer a friend to LeaguePack and you both get $50 in Buying Power.</p>
                        </div>
                        <button className="flex items-center text-emerald-400 text-sm font-bold mt-4">
                            INVITE FRIENDS <ChevronRight className="w-4 h-4" />
                        </button>
                    </CardContent>
                </Card>
            </div>

            {/* Slide 3: Sweepstakes */}
            <div className="min-w-[85vw] snap-center">
                <Card className="h-full bg-gradient-to-br from-purple-900/50 to-slate-900 border-purple-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                        <div className="space-y-2">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500 mb-2">
                                <Ticket className="w-5 h-5" />
                            </div>
                            <h3 className="text-2xl font-black text-white italic">WIN TICKETS</h3>
                            <p className="text-slate-400 text-sm font-medium">Enter the CFP Championship sweepstakes using your portfolio gains.</p>
                        </div>
                        <button className="flex items-center text-purple-400 text-sm font-bold mt-4">
                            ENTER NOW <ChevronRight className="w-4 h-4" />
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
