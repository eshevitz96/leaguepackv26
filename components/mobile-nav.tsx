"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PieChart, Trophy, User } from "lucide-react"
import { useNative } from "@/app/hooks/use-native"

export function MobileNav() {
    const isNative = useNative()
    const pathname = usePathname()

    if (!isNative) return null

    const isActive = (path: string) => pathname === path

    return (
        <div className="fixed bottom-6 left-4 right-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full px-2 py-4 shadow-2xl z-50 flex justify-around items-center pb-safe">
            <Link href="/" className="flex flex-col items-center gap-1 min-w-[50px]">
                <div className={`p-1 transition-all ${isActive('/') ? 'text-emerald-500 scale-110' : 'text-slate-500'}`}>
                    <Home className="w-6 h-6" strokeWidth={isActive('/') ? 3 : 2} />
                </div>
            </Link>

            <Link href="/portfolio" className="flex flex-col items-center gap-1 min-w-[50px]">
                <div className={`p-1 transition-all ${isActive('/portfolio') ? 'text-emerald-500 scale-110' : 'text-slate-500'}`}>
                    <PieChart className="w-6 h-6" strokeWidth={isActive('/portfolio') ? 3 : 2} />
                </div>
            </Link>

            <Link href="/leagues" className="flex flex-col items-center gap-1 min-w-[50px]">
                <div className={`p-1 transition-all ${isActive('/leagues') ? 'text-emerald-500 scale-110' : 'text-slate-500'}`}>
                    <Trophy className="w-6 h-6" strokeWidth={isActive('/leagues') ? 3 : 2} />
                </div>
            </Link>

            {/* Profile */}
            <Link href="/friends" className="flex flex-col items-center gap-1 min-w-[50px]">
                <div className={`p-1 transition-all ${isActive('/friends') ? 'text-emerald-500 scale-110' : 'text-slate-500'}`}>
                    <User className="w-6 h-6" strokeWidth={isActive('/friends') ? 3 : 2} />
                </div>
            </Link>
        </div>
    )
}
