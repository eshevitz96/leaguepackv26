"use client"
import { useState, useEffect, Suspense } from "react"
import { supabase } from "@/lib/supabase/client"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, TrendingUp, DollarSign } from "lucide-react"

function LeagueDetailContent() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const [league, setLeague] = useState<any>(null)
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) fetchLeagueData()
    }, [id])

    const fetchLeagueData = async () => {
        try {
            // 1. Fetch League Info
            const { data: leagueData, error: leagueError } = await supabase
                .from('leagues')
                .select('*')
                .eq('id', id)
                .single()

            if (leagueError) throw leagueError
            setLeague(leagueData)

            // 2. Fetch Members & Profiles
            const { data: memberData, error: memberError } = await supabase
                .from('league_members')
                .select(`
            user_id,
            profiles (
                id,
                username,
                balance
            )
        `)
                .eq('league_id', id)

            if (memberError) throw memberError

            // 3. Calculate "Total Portfolio Value" for each member
            // This is expensive (N queries), ideally we'd have a view or materialized view.
            // For now, we fetch portfolios for these users.
            const userIds = memberData.map((m: any) => m.user_id)

            const { data: portfolios } = await supabase
                .from('portfolios')
                .select('*')
                .in('user_id', userIds)

            const { data: teams } = await supabase.from('teams').select('id, price')

            // Map prices
            const priceMap = new Map()
            teams?.forEach((t: any) => priceMap.set(t.id, t.price))

            // Rank mapping
            const leaderboard = memberData.map((m: any) => {
                const userPortfolios = portfolios?.filter((p: any) => p.user_id === m.user_id) || []

                let portfolioValue = 0
                userPortfolios.forEach((p: any) => {
                    const price = priceMap.get(p.team_id) || 0
                    portfolioValue += p.quantity * price
                })

                const totalValue = (m.profiles?.balance || 0) + portfolioValue

                return {
                    id: m.user_id,
                    username: m.profiles?.username || "Unknown",
                    balance: m.profiles?.balance || 0,
                    portfolioValue,
                    totalValue
                }
            })

            // Sort by Total Value
            leaderboard.sort((a: any, b: any) => b.totalValue - a.totalValue)

            setMembers(leaderboard)

        } catch (error) {
            console.error("Error fetching league:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 text-white">Loading League...</div>
    if (!league) return <div className="p-8 text-white">League not found.</div>

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">
                <header>
                    <h1 className="text-3xl font-bold text-emerald-400 flex items-center gap-3">
                        <Trophy className="w-8 h-8" />
                        {league.name}
                    </h1>
                    <p className="text-slate-400">Entry Fee: ${league.entry_fee}</p>
                </header>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>Leaderboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {members.map((member, index) => (
                                <div key={member.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-800 text-slate-400'}`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{member.username}</p>
                                            <p className="text-xs text-slate-500">
                                                Cash: ${member.balance.toFixed(2)} | Portfolio: ${member.portfolioValue.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-emerald-400">${member.totalValue.toFixed(2)}</p>
                                        <p className="text-xs text-emerald-500/50 flex items-center justify-end gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Total Value
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function LeagueDetailPage() {
    return (
        <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
            <LeagueDetailContent />
        </Suspense>
    )
}
