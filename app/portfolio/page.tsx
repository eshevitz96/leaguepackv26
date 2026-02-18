"use client"

import { usePortfolio } from "@/app/hooks/use-portfolio"
import { useMarket } from "@/app/hooks/use-market"
import { useNative } from "@/app/hooks/use-native"
import { PortfolioPerformanceGraph } from "@/components/portfolio-graph"
import { PortfolioCard } from "@/components/portfolio-card"
import { Trophy } from "lucide-react"

export default function PortfolioPage() {
    const { balance, portfolio } = usePortfolio()
    const teams = useMarket()
    const isNative = useNative()

    return (
        <div className={`min-h-screen bg-[#050505] text-white ${isNative ? 'p-4 pt-safe-header pb-safe-nav' : 'p-6 md:p-10'}`}>
            <div className="max-w-7xl mx-auto space-y-6">
                {!isNative && (
                    <header className="mb-8">
                        <h1 className="text-3xl font-black mb-2">My Portfolio</h1>
                        <p className="text-slate-400">Track your performance and holdings.</p>
                    </header>
                )}

                <PortfolioPerformanceGraph />

                <div>
                    <h3 className="text-xl font-bold mb-4">Your Holdings</h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                        {Object.entries(portfolio).map(([teamId, holding]) => {
                            const team = teams.find(t => t.id === teamId)
                            if (!team) return null
                            return (
                                <PortfolioCard
                                    key={teamId}
                                    team={team}
                                    holding={holding}
                                />
                            )
                        })}
                        {Object.keys(portfolio).length === 0 && (
                            <div className="col-span-full text-center py-24 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                                <Trophy className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-500">No Holdings Yet</h3>
                                <p className="text-slate-600">Start buying teams to build your portfolio.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
