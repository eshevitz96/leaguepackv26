"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TrendingUp, Award, Zap } from "lucide-react"

export function WhatsNewModal() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        // Check if user has seen this version update
        const hasSeenUpdate = localStorage.getItem("leaguepack_welcome_seen")
        if (!hasSeenUpdate) {
            setIsOpen(true)
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem("leaguepack_welcome_seen", "true")
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto bg-emerald-500/10 p-3 rounded-full mb-4">
                        <TrendingUp className="w-8 h-8 text-emerald-400" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold">Welcome to LeaguePack</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex gap-4">
                        <div className="mt-1">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-base">How to Play</h4>
                            <p className="text-sm text-slate-400">
                                Buy teams you believe in. Watch their stock rise as they win games. Sell to lock in your profits.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="mt-1">
                            <Zap className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-base">Wins Drive Value</h4>
                            <p className="text-sm text-slate-400">
                                Real-world performance controls the market. Undefeated teams skyrocket. Losses crush value.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="mt-1">
                            <Award className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-base">Prestige & Hype</h4>
                            <p className="text-sm text-slate-400">
                                Blue bloods hold value better than underdogs. Market sentiment (Hype) can inflate prices.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleClose}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12"
                    >
                        Start Trading
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
