
"use client"

import { useEffect, useState } from "react"
import { Team, TEAMS } from "@/app/data/teams"
import { supabase } from "@/lib/supabase/client"

export function useMarket() {
    const [teams, setTeams] = useState<Team[]>(TEAMS) // Initialize with static teams

    useEffect(() => {
        // 1. Initial Fetch
        const fetchTeams = async () => {
            try {
                const { data, error } = await supabase
                    .from('teams')
                    .select('*')
                    .order('price', { ascending: false })

                if (error) throw error;
                if (data && data.length > 0) {
                    setTeams(data as Team[])
                }
            } catch (error) {
                console.error("Error fetching teams from Supabase, using local data:", error)
                // We already have TEAMS as initial state, so no need to doing anything here
            }
        }

        fetchTeams()

        // 2. Realtime Subscription
        const channel = supabase
            .channel('market-updates')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'teams' },
                (payload) => {
                    console.log("Realtime Update Received:", payload.new)
                    const updatedTeam = payload.new as Team
                    setTeams(current => {
                        const updatedList = current.map(team =>
                            team.id === updatedTeam.id ? updatedTeam : team
                        )
                        // Sort by Price Descending to keep UI stable
                        return updatedList.sort((a, b) => b.price - a.price)
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return teams
}
