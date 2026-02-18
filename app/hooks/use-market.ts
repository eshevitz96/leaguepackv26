
"use client"

import { useEffect, useState } from "react"
import { TEAMS, Team } from "@/app/data/teams"
import { calculateTeamPrice } from "@/lib/pricing-engine"

export function useMarket() {
    const [teams, setTeams] = useState<Team[]>([])

    // Initialize prices using the Pricing Engine
    useEffect(() => {
        const initialTeams = TEAMS.map(team => ({
            ...team,
            price: calculateTeamPrice(team),
            change: 0 // Reset change on initial load
        }))
        setTeams(initialTeams)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setTeams(currentTeams =>
                currentTeams.map(team => {
                    // Simulate random price movement (-0.5% to +0.5%)
                    const movement = (Math.random() - 0.5) * 0.015
                    const newPrice = team.price * (1 + movement)

                    // Recalculate change from base price (or previous?)
                    // Let's keep change relative to valid open for now, simplified to visual change
                    return {
                        ...team,
                        price: Number(newPrice.toFixed(2)),
                        change: Number(((newPrice - team.price) / team.price * 100).toFixed(2))
                    }
                })
            )
        }, 3000) // Update every 3 seconds

        return () => clearInterval(interval)
    }, [])

    return teams
}
