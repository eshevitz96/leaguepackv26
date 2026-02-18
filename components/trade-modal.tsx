
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Team } from "@/app/data/teams"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"


interface TradeModalProps {
    team: Team
    type: 'buy' | 'sell'
    balance: number
    holdings?: number
    onTrade: (amount: number, cost: number) => void
    trigger: React.ReactNode
}

export function TradeModal({ team, type, balance, holdings = 0, onTrade, trigger }: TradeModalProps) {
    const [amount, setAmount] = useState(1)
    const [isOpen, setIsOpen] = useState(false)

    // Reset amount when opening modal
    // Note: In a real app we'd use useEffect on isOpen, but simplified here

    const totalCost = team.price * amount

    // Validation Logic
    const canAfford = type === 'buy'
        ? totalCost <= balance
        : amount <= holdings && holdings > 0

    const handleTrade = () => {
        if (canAfford) {
            onTrade(amount, totalCost)
            setIsOpen(false)
            setAmount(1)
        }
    }

    const maxSellable = type === 'sell' ? holdings : 999

    // Adjust amount if it exceeds holdings when switching to sell (though usually separate buttons)
    if (type === 'sell' && amount > maxSellable && maxSellable > 0) {
        setAmount(maxSellable)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {type === 'buy' ? "Buy" : "Sell"} {team.name}
                        <span className="text-sm font-normal text-slate-400">({team.ticker})</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Current Price</span>
                        <span className="font-bold text-xl">${team.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            className="border-slate-700 text-white h-10 w-10 p-0"
                            onClick={() => setAmount(Math.max(1, amount - 1))}
                            disabled={amount <= 1}
                        >
                            -
                        </Button>
                        <div className="flex-1 text-center">
                            <span className="text-3xl font-bold">{amount}</span>
                            <p className="text-xs text-slate-400">SHARES</p>
                        </div>
                        <Button
                            variant="outline"
                            className="border-slate-700 text-white h-10 w-10 p-0"
                            onClick={() => setAmount(amount + 1)}
                            disabled={type === 'sell' && amount >= holdings}
                        >
                            +
                        </Button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-400">Total {type === 'buy' ? 'Cost' : 'Value'}</span>
                            <span className={`font-mono ${type === 'buy' ? 'text-red-400' : 'text-emerald-400'}`}>
                                ${totalCost.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">
                                {type === 'buy' ? 'Available Balance' : 'Shares Owned'}
                            </span>
                            <span className="text-slate-300">
                                {type === 'buy' ? `$${balance.toFixed(2)}` : holdings}
                            </span>
                        </div>
                    </div>

                    <Button
                        className={`w-full ${type === 'buy' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'} text-white font-bold h-12`}
                        disabled={!canAfford}
                        onClick={handleTrade}
                    >
                        CONFIRM {type.toUpperCase()}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
