"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client"
import { Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function CreateLeagueModal() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [entryFee, setEntryFee] = useState("0")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCreate = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            // 1. Create League
            const { data: league, error: leagueError } = await supabase
                .from('leagues')
                .insert({
                    name,
                    created_by: user.id,
                    entry_fee: Number(entryFee),
                    is_private: false
                })
                .select()
                .single()

            if (leagueError) throw leagueError

            // 2. Add Creator as Member
            const { error: memberError } = await supabase
                .from('league_members')
                .insert({
                    league_id: league.id,
                    user_id: user.id
                })

            if (memberError) throw memberError

            setOpen(false)
            router.refresh()
            router.push(`/leagues/${league.id}`)
        } catch (error) {
            console.error("Error creating league:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4" />
                    Create League
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle>Create a New League</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>League Name</Label>
                        <Input
                            placeholder="e.g. Office Rivals"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Entry Fee ($)</Label>
                        <Input
                            type="number"
                            value={entryFee}
                            onChange={(e) => setEntryFee(e.target.value)}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>
                    <Button
                        onClick={handleCreate}
                        disabled={loading || !name}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create League"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
