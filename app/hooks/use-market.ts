
"use client"

import { useEffect, useState } from "react"
import { Team } from "@/app/data/teams"
import { supabase } from "@/lib/supabase/client"

export function useMarket() {
    const [teams, setTeams] = useState<Team[]>([])

    useEffect(() => {
        // 1. Initial Fetch
        const fetchTeams = async () => {
            const { data } = await supabase
                .from('teams')
                .select('*')
                .order('price', { ascending: false })

            if (data) setTeams(data as Team[])
        }

        fetchTeams()

        // 2. Realtime Subscription
        const channel = supabase
            .channel('market-updates')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'teams' },
                (payload) => {
                    const updatedTeam = payload.new as Team
                    setTeams(current =>
                        current.map(team =>
                            team.id === updatedTeam.id ? updatedTeam : team
                        )
                    )
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return teams
}
