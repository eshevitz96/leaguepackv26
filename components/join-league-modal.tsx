"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { Users, Loader2, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export function JoinLeagueModal() {
    const [open, setOpen] = useState(false)
    const [leagues, setLeagues] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()

    useEffect(() => {
        if (open) {
            fetchPublicLeagues()
        }
    }, [open])

    const fetchPublicLeagues = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('leagues')
                .select('*')
                .eq('is_private', false)
                .order('created_at', { ascending: false })
                .limit(10) // Just showing top 10 recent public leagues for now

            if (error) throw error
            setLeagues(data || [])
        } catch (error) {
            console.error("Error fetching leagues:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleJoin = async (leagueId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { error } = await supabase.from('league_members').insert({
                league_id: leagueId,
                user_id: user.id
            })

            if (error) {
                // Check for duplicate key error (already joined)
                if (error.code === '23505') {
                    alert("You are already in this league!")
                } else {
                    throw error
                }
            }

            setOpen(false)
            router.refresh()
            router.push(`/leagues/${leagueId}`)

        } catch (error) {
            console.error("Error joining league:", error)
        }
    }

    const filteredLeagues = leagues.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-slate-700 hover:bg-slate-800">
                    <Users className="w-4 h-4" />
                    Join League
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Join a League</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search leagues..."
                            className="pl-9 bg-slate-950 border-slate-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                            </div>
                        ) : filteredLeagues.length === 0 ? (
                            <p className="text-center text-slate-500 py-8">No public leagues found.</p>
                        ) : (
                            filteredLeagues.map(league => (
                                <div key={league.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                                    <div>
                                        <h4 className="font-semibold">{league.name}</h4>
                                        <p className="text-xs text-slate-500">Entry: ${league.entry_fee}</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => handleJoin(league.id)}
                                    >
                                        Join
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
