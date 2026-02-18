"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface PortfolioItem {
    quantity: number
    avgCost: number
}

interface PortfolioContextType {
    balance: number
    portfolio: Record<string, PortfolioItem>
    user: any
    isLoading: boolean
    handleTrade: (teamId: string, amount: number, cost: number) => void
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
    const [balance, setBalance] = useState(1000.00)
    const [portfolio, setPortfolio] = useState<Record<string, PortfolioItem>>({})
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Auth & Data Fetching
    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchData(session.user.id)
            } else {
                setIsLoading(false)
            }
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchData(session.user.id)
            } else {
                // Reset to default if logged out
                setBalance(1000.00)
                setPortfolio({})
                setIsLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function fetchData(userId: string) {
        setIsLoading(true)
        try {
            // 1. Fetch Profile (Balance)
            const { data: profile } = await supabase
                .from('profiles')
                .select('balance')
                .eq('id', userId)
                .single()

            if (profile) setBalance(Number(profile.balance))

            // 2. Fetch Portfolio
            const { data: holdings } = await supabase
                .from('portfolios')
                .select('*')
                .eq('user_id', userId)

            if (holdings) {
                const newPortfolio: Record<string, PortfolioItem> = {}
                holdings.forEach((h: any) => {
                    newPortfolio[h.team_id] = {
                        quantity: h.quantity,
                        avgCost: Number(h.avg_cost)
                    }
                })
                setPortfolio(newPortfolio)
            }
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    async function syncTrade(userId: string, teamId: string, cost: number, newQuantity: number, newAvgCost: number) {
        try {
            // 1. Update Profile Balance
            const { data: profile } = await supabase.from('profiles').select('balance').eq('id', userId).single()
            if (profile) {
                await supabase.from('profiles').update({ balance: Number(profile.balance) - cost }).eq('id', userId)
            }

            // 2. Update Portfolio
            if (newQuantity <= 0) {
                await supabase.from('portfolios').delete().match({ user_id: userId, team_id: teamId })
            } else {
                await supabase.from('portfolios').upsert({
                    user_id: userId,
                    team_id: teamId,
                    quantity: newQuantity,
                    avg_cost: newAvgCost,
                    updated_at: new Date().toISOString()
                })
            }

            // 3. Log Transaction
            await supabase.from('transactions').insert({
                user_id: userId,
                team_id: teamId,
                type: cost > 0 ? 'BUY' : 'SELL',
                quantity: Math.abs(cost > 0 ? (cost / newAvgCost) : ((cost * -1) / newAvgCost)),
                price: Math.abs(cost),
                timestamp: new Date().toISOString()
            })

            // 4. Update Market Demand (Hype)
            // Fetch current team to get hype
            const { data: teamData } = await supabase.from('teams').select('hype').eq('id', teamId).single()
            if (teamData) {
                const currentHype = teamData.hype || 5
                // Buy = +0.1, Sell = -0.1
                const impact = cost > 0 ? 0.1 : -0.1
                const newHype = Math.max(1, Math.min(10, currentHype + impact))

                await supabase.from('teams').update({
                    hype: newHype,
                    updated_at: new Date().toISOString()
                }).eq('id', teamId)
            }
        } catch (error) {
            console.error("Error syncing trade:", error)
        }
    }

    const handleTrade = (teamId: string, amount: number, cost: number) => {
        // Optimistic Update
        setBalance(prev => prev - cost)
        setPortfolio(prev => {
            const current = prev[teamId] || { quantity: 0, avgCost: 0 }
            const newQuantity = current.quantity + amount

            if (newQuantity <= 0) {
                const { [teamId]: removed, ...rest } = prev
                // DB Sync (Sell All)
                if (user) {
                    syncTrade(user.id, teamId, -cost, newQuantity, 0)
                }
                return rest
            }

            let newAvgCost = current.avgCost
            if (amount > 0) {
                newAvgCost = ((current.quantity * current.avgCost) + cost) / newQuantity
            }

            // DB Sync (Buy/Partial Sell)
            if (user) {
                syncTrade(user.id, teamId, cost, newQuantity, newAvgCost)
                    .catch(err => {
                        toast.error("Transaction Failed", {
                            description: err.message || "Database rejected the update.",
                            duration: 4000,
                        })
                        // Revert optimistic update? (Optional, but good practice. For now, just alert).
                    })
            }

            return { ...prev, [teamId]: { quantity: newQuantity, avgCost: newAvgCost } }
        })
    }

    const value = { balance, portfolio, user, isLoading, handleTrade }

    return (
        <PortfolioContext.Provider value={value} >
            {children}
        </PortfolioContext.Provider>
    )
}

export function usePortfolio() {
    const context = useContext(PortfolioContext)
    if (context === undefined) {
        throw new Error("usePortfolio must be used within a PortfolioProvider")
    }
    return context
}
