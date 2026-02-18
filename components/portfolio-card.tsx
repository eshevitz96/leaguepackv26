"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JerseyIcon } from "@/components/jersey-icon"
import { Team } from "@/app/data/teams"
import { PortfolioItem } from "@/app/hooks/use-portfolio"

interface PortfolioCardProps {
    team: Team
    holding: PortfolioItem
}

export function PortfolioCard({ team, holding }: PortfolioCardProps) {
    const currentValue = holding.quantity * team.price
    const costBasis = holding.quantity * holding.avgCost
    const pnl = currentValue - costBasis
    const pnlPercent = costBasis !== 0 ? (pnl / costBasis) * 100 : 0

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between text-slate-400 text-sm font-medium">
                    <span>{team.ticker}</span>
                    <span className="text-slate-500">{holding.quantity} Shares</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-2xl font-bold text-white font-varsity">${currentValue.toFixed(2)}</div>
                        <div className={`text-xs font-varsity ${pnl >= 0 ? "text-emerald-500" : "text-red-500"} flex gap-1 mt-1`}>
                            <span>{pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}</span>
                            <span>({pnlPercent.toFixed(2)}%)</span>
                        </div>
                    </div>
                    <JerseyIcon color={team.color} initial={team.initial} sport={team.sport} />
                </div>
                <div className="text-xs text-slate-600">Avg Cost: ${holding.avgCost.toFixed(2)}</div>
                <div className="mt-4">
                    <h3 className="font-semibold text-white truncate">{team.name}</h3>
                </div>
            </CardContent>
        </Card>
    )
}
