"use client"

import { useState, useEffect } from "react"
import { TEAMS } from "@/app/data/teams"
import { supabase } from "@/lib/supabase/client"
import { calculateTeamPrice } from "@/lib/pricing-engine"
import { Loader2, CheckCircle, Database, Play, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
    const [loading, setLoading] = useState(false)
    const [simulationLoading, setSimulationLoading] = useState(false)
    const [isAutoSimulating, setIsAutoSimulating] = useState(false)
    const [message, setMessage] = useState("")

    // Auto-Simulate Effect
    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isAutoSimulating) {
            interval = setInterval(() => {
                simulateMarket()
            }, 3000) // Run every 3 seconds
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isAutoSimulating])

    const seedTeams = async () => {
        setLoading(true)
        setMessage("")
        try {
            // 1. Get existing team IDs
            const { data: existingTeams } = await supabase.from('teams').select('id')
            const existingIds = new Set(existingTeams?.map(t => t.id) || [])

            // 2. Filter for missing teams
            const missingTeams = TEAMS.filter(t => !existingIds.has(t.id))

            if (missingTeams.length === 0) {
                setMessage(`All teams are already in the database.`)
                setLoading(false)
                return
            }

            // 3. Insert missing teams
            const { error } = await supabase.from('teams').insert(missingTeams)

            if (error) throw error
            setMessage(`Successfully restored ${missingTeams.length} missing teams (including Michigan)!`)
        } catch (error: any) {
            console.error(error)
            setMessage(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const simulateMarket = async () => {
        setSimulationLoading(true)
        setMessage("")
        try {
            const { data: teams } = await supabase.from('teams').select('*')
            if (!teams) throw new Error("No teams found")

            const updates = teams.map((team: any) => {
                const isWin = Math.random() > 0.4
                // Parse record
                let [wins, losses] = (team.record || "0-0").split('-').map(Number)

                if (isWin) wins++
                else losses++
                const newRecord = `${wins}-${losses}`

                // Create temp team object for pricing engine
                const tempTeam = {
                    ...team,
                    record: newRecord
                }

                // Calculate new price based on updated record
                const newPrice = calculateTeamPrice(tempTeam)

                const changeAmount = newPrice - team.price
                const changePercent = (changeAmount / team.price) * 100

                return {
                    ...team, // Spread original team data to satisfy Not-Null constraints during Upsert
                    price: Number(newPrice.toFixed(2)),
                    change: Number(changePercent.toFixed(2)),
                    record: newRecord,
                    updated_at: new Date().toISOString()
                }
            })

            const { error } = await supabase.from('teams').upsert(updates)
            if (error) throw error

            setMessage(`Simulated week for ${updates.length} teams. Market updated!`)
        } catch (error: any) {
            console.error(error)
            setMessage(`Simulation Error: ${error.message}`)
        } finally {
            setSimulationLoading(false)
        }
    }

    const payoutDividends = async () => {
        setLoading(true)
        setMessage("")
        try {
            // 1. Fetch Top 25 Teams
            const { data: rankedTeams } = await supabase
                .from('teams')
                .select('id, price, rank')
                .lte('rank', 25)

            if (!rankedTeams || rankedTeams.length === 0) {
                throw new Error("No ranked teams found.")
            }

            const rankedTeamIds = new Set(rankedTeams.map(t => t.id))

            // 2. Fetch Portfolios
            const { data: portfolios } = await supabase
                .from('portfolios')
                .select('*')

            if (!portfolios || portfolios.length === 0) {
                setMessage("No active portfolios found.")
                setLoading(false)
                return
            }

            let totalPayouts = 0
            let transactionCount = 0

            // 3. Iterate and Pay
            for (const holding of portfolios) {
                if (rankedTeamIds.has(holding.team_id)) {
                    const team = rankedTeams.find(t => t.id === holding.team_id)
                    if (!team) continue;

                    const currentValue = holding.quantity * team.price
                    const dividendAmount = Number((currentValue * 0.01).toFixed(2)) // 1%

                    if (dividendAmount > 0) {
                        const { data: profile } = await supabase.from('profiles').select('balance').eq('id', holding.user_id).single()
                        if (profile) {
                            // Update Balance
                            const { error: balanceError } = await supabase.from('profiles').update({
                                balance: Number(profile.balance) + dividendAmount
                            }).eq('id', holding.user_id)

                            if (balanceError) throw balanceError

                            // Log Transaction
                            const { error: txError } = await supabase.from('transactions').insert({
                                user_id: holding.user_id,
                                team_id: holding.team_id,
                                type: 'DIVIDEND',
                                quantity: holding.quantity,
                                price: dividendAmount,
                                timestamp: new Date().toISOString()
                            })

                            if (txError) throw txError

                            totalPayouts += dividendAmount
                            transactionCount++
                        }
                    }
                }
            }

            setMessage(`Dividend Run Complete: $${totalPayouts.toFixed(2)} paid out across ${transactionCount} positions.`)
        } catch (error: any) {
            console.error(error)
            setMessage(`Dividend Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-red-500">LeaguePack Admin</h1>
                <p className="text-slate-400">Market Control Center</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Seed Card */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-400" />
                            Database Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400 mb-4 text-sm">
                            Smart Seed: Checks for missing teams (like Michigan) and restores them without affecting existing data.
                        </p>
                        <Button
                            onClick={seedTeams}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Smart Seed / Restore Teams"}
                        </Button>
                        {message && message.includes("seeded") && (
                            <div className="mt-4 p-3 bg-slate-950 rounded border border-slate-800 text-sm flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                {message}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Simulator Card */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Play className="w-5 h-5 text-emerald-400" />
                            Market Simulator
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400 mb-4 text-sm">
                            Simulate a week of games. Updates records and prices based on pricing engine.
                        </p>
                        <Button
                            onClick={simulateMarket}
                            disabled={simulationLoading || isAutoSimulating}
                            variant="secondary"
                            className="w-full bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-500 border border-emerald-900/50 mb-3"
                        >
                            {simulationLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Simulate Week"}
                        </Button>

                        <Button
                            onClick={() => setIsAutoSimulating(!isAutoSimulating)}
                            variant={isAutoSimulating ? "destructive" : "outline"}
                            className={`w-full ${isAutoSimulating ? 'bg-red-900/20 text-red-500 border-red-900/50' : 'border-emerald-500/20 text-emerald-500'}`}
                        >
                            {isAutoSimulating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Stop Auto-Sim
                                </>
                            ) : (
                                "Start Auto-Sim (3s)"
                            )}
                        </Button>
                        {message && message.includes("Simulated") && (
                            <div className="mt-4 p-3 bg-slate-950 rounded border border-slate-800 text-sm flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                {message}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dividend Payout Card */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-1 bg-yellow-500/10 rounded-full">
                                <DollarSign className="w-4 h-4 text-yellow-500" />
                            </div>
                            Dividend Payouts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400 mb-4 text-sm">
                            Pay 1% dividend to all holders of Top 25 Ranked teams.
                        </p>
                        <Button
                            onClick={payoutDividends}
                            disabled={loading}
                            variant="outline"
                            className="w-full border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10"
                        >
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Trigger Weekly Dividends"}
                        </Button>
                        {message && message.includes("Dividend") && (
                            <div className="mt-4 p-3 bg-slate-950 rounded border border-slate-800 text-sm flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                {message}
                            </div>
                        )}
                        {message && message.includes("Error") && (
                            <div className="mt-4 p-3 bg-slate-950 rounded border border-red-800 text-sm flex items-center gap-2 text-red-500">
                                <CheckCircle className="w-4 h-4 text-red-500" />
                                {message}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
