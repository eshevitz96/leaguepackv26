"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus, Search, Check, X, Users, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function FriendsPage() {
    const [userId, setUserId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [pendingRequests, setPendingRequests] = useState<any[]>([])
    const [friends, setFriends] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUserId(user.id)

        await Promise.all([
            fetchRequests(user.id),
            fetchFriends(user.id)
        ])
        setLoading(false)
    }

    const fetchRequests = async (uid: string) => {
        const { data } = await supabase
            .from('friendships')
            .select(`
                id,
                user_id,
                profiles!user_id (username, id)
            `)
            .eq('friend_id', uid)
            .eq('status', 'pending')

        setPendingRequests(data || [])
    }

    const fetchFriends = async (uid: string) => {
        const { data } = await supabase
            .from('friendships')
            .select(`
                id,
                user_id,
                friend_id,
                status,
                p1:profiles!user_id (username, id, balance),
                p2:profiles!friend_id (username, id, balance)
            `)
            .or(`user_id.eq.${uid},friend_id.eq.${uid}`)
            .eq('status', 'accepted')

        if (!data) return

        const friendsData = await Promise.all(data.map(async (row: any) => {
            const isMeP1 = row.user_id === uid
            const friendProfile = isMeP1 ? row.p2 : row.p1

            const { data: portfolios } = await supabase
                .from('portfolios')
                .select('quantity, team_id')
                .eq('user_id', friendProfile.id)

            const { data: teams } = await supabase.from('teams').select('id, price')
            const priceMap = new Map(teams?.map((t: any) => [t.id, t.price]))

            let holdingsValue = 0
            portfolios?.forEach((p: any) => {
                holdingsValue += p.quantity * (priceMap.get(p.team_id) || 0)
            })

            return {
                ...friendProfile,
                totalValue: (friendProfile.balance || 0) + holdingsValue
            }
        }))

        friendsData.sort((a, b) => b.totalValue - a.totalValue)
        setFriends(friendsData)
    }

    const handleSearch = async () => {
        if (!searchQuery.trim()) return

        const { data } = await supabase
            .from('profiles')
            .select('id, username')
            .ilike('username', `%${searchQuery}%`)
            .neq('id', userId)
            .limit(5)

        setSearchResults(data || [])
    }

    const sendRequest = async (targetId: string) => {
        if (!userId) return

        const { data: existing } = await supabase
            .from('friendships')
            .select('id')
            .or(`and(user_id.eq.${userId},friend_id.eq.${targetId}),and(user_id.eq.${targetId},friend_id.eq.${userId})`)
            .single()

        if (existing) {
            alert("Friendship already exists or is pending.")
            return
        }

        const { error } = await supabase
            .from('friendships')
            .insert({
                user_id: userId,
                friend_id: targetId,
                status: 'pending'
            })

        if (error) {
            console.error(error)
            alert("Error sending request")
        } else {
            alert("Request sent!")
            setSearchResults([])
            setSearchQuery("")
        }
    }

    const respondToRequest = async (friendshipId: string, accept: boolean) => {
        if (accept) {
            await supabase
                .from('friendships')
                .update({ status: 'accepted' })
                .eq('id', friendshipId)
        } else {
            await supabase
                .from('friendships')
                .delete()
                .eq('id', friendshipId)
        }
        if (userId) fetchRequests(userId)
        if (userId && accept) fetchFriends(userId)
    }

    return (
        <div className="min-h-screen bg-transparent text-white p-6 md:p-10 font-sans selection:bg-emerald-500/30">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                            FRIENDS <span className="text-emerald-500">& RIVALS</span>
                        </h1>
                        <p className="text-slate-400 font-medium text-lg">Track your competition.</p>
                    </div>
                </header>

                <div className="grid gap-8 lg:grid-cols-12">

                    {/* LEFT COLUMN: Search & Requests (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Search Card */}
                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-emerald-400" />
                                    Add Friends
                                </h3>
                                <p className="text-sm text-slate-400">Find users by username.</p>
                            </div>

                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 bg-slate-950/50 border-slate-800 focus-visible:ring-emerald-500/50 rounded-xl h-12"
                                    />
                                </div>
                                <Button onClick={handleSearch} className="h-12 w-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950">
                                    <Search className="w-5 h-5" />
                                </Button>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    {searchResults.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-white/5 group hover:border-emerald-500/30 transition-colors">
                                            <span className="font-bold text-sm text-slate-200">{user.username}</span>
                                            <Button size="sm" variant="ghost" onClick={() => sendRequest(user.id)} className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                                                <UserPlus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Requests Card */}
                        {pendingRequests.length > 0 && (
                            <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white">Requests</h3>
                                    <Badge variant="secondary" className="bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400">{pendingRequests.length}</Badge>
                                </div>
                                <div className="space-y-3">
                                    {pendingRequests.map((req) => (
                                        <div key={req.id} className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                                                    {req.profiles?.username?.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-sm">{req.profiles?.username}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button size="icon" className="h-8 w-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg" onClick={() => respondToRequest(req.id, true)}>
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-400 hover:bg-rose-500/10 rounded-lg" onClick={() => respondToRequest(req.id, false)}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Friends List (8 cols) */}
                    <div className="lg:col-span-8">
                        <div className="bg-slate-900/20 backdrop-blur-sm border border-white/5 rounded-[2rem] p-6 md:p-8 min-h-[500px]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <Trophy className="w-6 h-6 text-yellow-500" />
                                    Leaderboard
                                </h2>
                                <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                                    Total Value
                                </span>
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)}
                                </div>
                            ) : friends.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center border border-white/5">
                                        <Users className="w-10 h-10 text-slate-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">No Friends Yet</h3>
                                        <p className="text-slate-400 mt-1">Add friends to compete on the leaderboard.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {friends.map((friend, index) => (
                                        <div key={friend.id} className="group flex items-center justify-between p-4 bg-slate-950/40 hover:bg-slate-900/60 transition-colors rounded-2xl border border-white/5 hover:border-emerald-500/30">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 flex items-center justify-center text-sm font-black rounded-xl ${index === 0 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' :
                                                        index === 1 ? 'bg-slate-300 text-black' :
                                                            index === 2 ? 'bg-amber-700 text-white' :
                                                                'bg-slate-800 text-slate-500'
                                                    }`}>
                                                    #{index + 1}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
                                                        {friend.username.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-lg leading-tight group-hover:text-emerald-400 transition-colors">{friend.username}</p>
                                                        <p className="text-xs text-slate-500 font-mono">My Rival</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-white tracking-tight">${friend.totalValue.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
