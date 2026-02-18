"use client"


import Link from "next/link"
import { useMarket } from "@/app/hooks/use-market"
import { usePortfolio } from "@/app/hooks/use-portfolio"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Smartphone, Trophy, Users, LogOut } from "lucide-react"
import { WhatsNewModal } from "@/components/whats-new-modal"
import { AuthModal } from "@/components/auth-modal"
import { PortfolioPerformanceGraph } from "@/components/portfolio-graph"
import { supabase } from "@/lib/supabase/client"
import { MarketCard } from "@/components/market-card"
import { PortfolioCard } from "@/components/portfolio-card"
import { MarketHero } from "@/components/market-hero"

import { useNative } from "@/app/hooks/use-native"
import { MobileHeroCarousel } from "@/components/mobile-hero-carousel"

export default function Dashboard() {
  const teams = useMarket()
  const { balance, portfolio, user, handleTrade } = usePortfolio()
  const isNative = useNative()

  // Find the top ranked team for the Hero section
  // 1. Look for Rank 1 CFB Team (Michigan)
  // 2. Look for ANY Rank 1 Team
  // 3. Fallback to highest priced team
  const topTeam = teams.find(t => t.rank === 1 && t.sport === 'CFB')
    || teams.find(t => t.rank === 1)
    || teams[0]

  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-emerald-500/30">
      <div className={`max-w-7xl mx-auto space-y-6 md:space-y-12 ${isNative ? 'p-4 pt-safe-header pb-safe-nav' : 'p-6 md:p-10'}`}>

        {/* Desktop Header - HIDDEN on Native */}
        {!isNative && (
          <header className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                LEAGUE<span className="text-emerald-500">PACK</span>
              </h1>
              <p className="text-slate-400 font-medium text-lg">The Fantasy Stock Market for College Sports</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
              {/* Navigation Links */}
              <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                <Link href="/friends">
                  <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
                    <Users className="w-4 h-4 mr-2" />
                    Friends
                  </Button>
                </Link>
                <Link href="/leagues">
                  <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
                    <Trophy className="w-4 h-4 mr-2" />
                    Leagues
                  </Button>
                </Link>
              </div>

              {/* User / Wallet */}
              <div className="flex items-center gap-4 pl-2">
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Buying Power</p>
                  <p className="text-xl font-black text-emerald-400">${balance.toFixed(2)}</p>
                </div>

                {user ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => supabase.auth.signOut()}
                    className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                ) : (
                  <AuthModal />
                )}
              </div>
            </div>
          </header>
        )}

        {/* Hero Section - Carousel on Mobile, Single on Desktop */}
        {isNative ? (
          <MobileHeroCarousel team={topTeam} />
        ) : (
          <MarketHero team={topTeam} />
        )}

        {/* Main Content Area */}
        <Tabs defaultValue="all" className="w-full space-y-4 md:space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">Marketplace</h3>

            {/* Mobile Filter "Pills" */}
            {isNative ? (
              <TabsList className="bg-transparent p-0 gap-2 overflow-x-auto w-full justify-start scrollbar-hide">
                <TabsTrigger value="all" className="rounded-full border border-white/10 bg-slate-900/50 px-4 py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 data-[state=active]:border-emerald-500 font-bold text-xs whitespace-nowrap">All</TabsTrigger>
                <TabsTrigger value="cfb" className="rounded-full border border-white/10 bg-slate-900/50 px-4 py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 data-[state=active]:border-emerald-500 font-bold text-xs whitespace-nowrap">College Football</TabsTrigger>
                <TabsTrigger value="cbb" className="rounded-full border border-white/10 bg-slate-900/50 px-4 py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 data-[state=active]:border-emerald-500 font-bold text-xs whitespace-nowrap">College Hoops</TabsTrigger>
                <TabsTrigger value="portfolio" className="rounded-full border border-white/10 bg-slate-900/50 px-4 py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 data-[state=active]:border-emerald-500 font-bold text-xs whitespace-nowrap">My Portfolio</TabsTrigger>
              </TabsList>
            ) : (
              <TabsList className="bg-slate-900/50 border border-white/5 p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-black font-bold text-xs md:text-sm">All</TabsTrigger>
                <TabsTrigger value="cfb" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-black font-bold text-xs md:text-sm">CFB</TabsTrigger>
                <TabsTrigger value="cbb" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-black font-bold text-xs md:text-sm">CBB</TabsTrigger>
                <TabsTrigger value="portfolio" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-black font-bold text-xs md:text-sm">My Portfolio</TabsTrigger>
              </TabsList>
            )}
          </div>

          <TabsContent value="all" className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 min-h-[50vh]">
            {teams.map((team) => (
              <MarketCard
                key={team.id}
                team={team}
                balance={balance}
                holdings={portfolio[team.id]?.quantity || 0}
                onTrade={(amount, cost) => handleTrade(team.id, amount, cost)}
              />
            ))}
          </TabsContent>

          <TabsContent value="cfb" className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 min-h-[50vh]">
            {teams.filter(t => t.sport === 'CFB').map((team) => (
              <MarketCard
                key={team.id}
                team={team}
                balance={balance}
                holdings={portfolio[team.id]?.quantity || 0}
                onTrade={(amount, cost) => handleTrade(team.id, amount, cost)}
              />
            ))}
          </TabsContent>

          <TabsContent value="cbb" className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 min-h-[50vh]">
            {teams.filter(t => t.sport === 'CBB').map((team) => (
              <MarketCard
                key={team.id}
                team={team}
                balance={balance}
                holdings={portfolio[team.id]?.quantity || 0}
                onTrade={(amount, cost) => handleTrade(team.id, amount, cost)}
              />
            ))}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-8">
            <PortfolioPerformanceGraph />

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 min-h-[50vh]">
              {Object.entries(portfolio).map(([teamId, holding]) => {
                const team = teams.find(t => t.id === teamId)
                if (!team) return null
                return (
                  <PortfolioCard
                    key={teamId}
                    team={team}
                    holding={holding}
                  />
                )
              })}
              {Object.keys(portfolio).length === 0 && (
                <div className="col-span-full text-center py-24 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                  <Trophy className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-500">No Holdings Yet</h3>
                  <p className="text-slate-600">Start buying teams to build your portfolio.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <WhatsNewModal />

        {/* Footer Link - Hidden on Native */}
        {!isNative && (
          <div className="flex justify-center pt-12 pb-6">
            <Link href="/download">
              <Button variant="link" className="text-slate-600 hover:text-emerald-500">
                <Smartphone className="w-4 h-4 mr-2" />
                Download Mobile App
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
