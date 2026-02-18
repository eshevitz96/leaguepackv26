"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trophy, ArrowRight, Shield } from "lucide-react"
import Link from "next/link"
import { CreateLeagueModal } from "@/components/create-league-modal"
import { JoinLeagueModal } from "@/components/join-league-modal"

export default function LeaguesPage() {
    const [leagues, setLeagues] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLeagues()
    }, [])

    const fetchLeagues = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('league_members')
                .select(`
          league_id,
          leagues (
             id,
             name,
             created_by,
             entry_fee
          )
        `)
                .eq('user_id', user.id)

            if (error) throw error
            setLeagues(data.map((item: any) => item.leagues))
        } catch (error) {
            console.error("Error fetching leagues:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-transparent text-white p-6 md:p-10 font-sans selection:bg-emerald-500/30">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                            MY <span className="text-emerald-500">LEAGUES</span>
                        </h1>
                        <p className="text-slate-400 font-medium text-lg">Compete with friends for the best portfolio.</p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
                        <JoinLeagueModal />
                        <div className="h-8 w-px bg-white/10 mx-1" />
                        <CreateLeagueModal />
                    </div>
                </header>

                {/* Empty State */}
                {!loading && leagues.length === 0 && (
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <Card className="relative bg-slate-900/80 border-slate-800 text-center py-16 backdrop-blur-xl rounded-[1.8rem]">
                            <CardContent className="space-y-6">
                                <div className="relative mx-auto w-24 h-24">
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                                    <div className="relative w-full h-full bg-slate-800/50 rounded-full flex items-center justify-center border border-white/5">
                                        <Trophy className="w-10 h-10 text-emerald-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">No Leagues Yet</h3>
                                    <p className="text-slate-400 max-w-sm mx-auto text-lg leading-relaxed">
                                        Join an existing league with a code or create your own to challenge your friends.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* List */}
                <div className="grid gap-6">
                    {leagues.map((league) => (
                        <Link href={`/leagues/view?id=${league.id}`} key={league.id} className="group">
                            <Card className="bg-slate-900/50 border-white/5 hover:border-emerald-500/30 hover:bg-slate-900/80 transition-all duration-300 rounded-2xl overflow-hidden backdrop-blur-sm group-hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                <CardHeader className="flex flex-row items-center justify-between p-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                            <Shield className="w-7 h-7 text-indigo-400 group-hover:text-emerald-400 transition-colors" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{league.name}</CardTitle>
                                            <CardDescription className="text-white/50 text-base font-medium mt-1">
                                                Entry Fee: <span className="text-white">${league.entry_fee}</span>
                                            </CardDescription>
                                        </div>
                                    </div>

                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
