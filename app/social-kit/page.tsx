"use client"

import { useState } from "react"
import { useMarket } from "@/app/hooks/use-market"
import { Team } from "@/app/data/teams"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Share2, ImageIcon, Trophy } from "lucide-react"
import { TeamPromoCard } from "@/components/social/team-promo-card"
import { MatchupCard } from "@/components/social/matchup-card"
import { SocialCardWrapper } from "@/components/social/social-card-wrapper"

type TemplateType = "team-promo" | "matchup"

export default function SocialKitPage() {
    const teams = useMarket()
    const [template, setTemplate] = useState<TemplateType>("team-promo")
    const [format, setFormat] = useState<"square" | "story">("square")
    const [selectedTeam, setSelectedTeam] = useState<string>(teams[0]?.id || "")
    const [opponentTeam, setOpponentTeam] = useState<string>(teams[1]?.id || "")

    const team1 = teams.find(t => t.id === selectedTeam) || teams[0]
    const team2 = teams.find(t => t.id === opponentTeam) || teams[1]

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 font-sans selection:bg-emerald-500/30 flex flex-col items-center">

            <header className="max-w-4xl w-full text-center mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm uppercase tracking-widest">
                    <Share2 className="w-4 h-4" />
                    Marketing Kit
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                    SOCIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">GENERATOR</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">
                    Create high-quality, viral marketing assets for your social media channels in seconds.
                </p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8 max-w-7xl w-full">

                {/* Controls Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-slate-900/50 backdrop-blur-md border-white/5 p-6 rounded-3xl">
                        <CardContent className="space-y-6 p-0">
                            <div className="space-y-3">
                                <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Template Style</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={template === "team-promo" ? "default" : "outline"}
                                        className={`h-20 flex flex-col gap-2 ${template === "team-promo" ? "bg-emerald-500 text-black hover:bg-emerald-400" : "bg-transparent border-slate-700 text-slate-400 hover:text-white"}`}
                                        onClick={() => setTemplate("team-promo")}
                                    >
                                        <ImageIcon className="w-6 h-6" />
                                        Team Promo
                                    </Button>
                                    <Button
                                        variant={template === "matchup" ? "default" : "outline"}
                                        className={`h-20 flex flex-col gap-2 ${template === "matchup" ? "bg-emerald-500 text-black hover:bg-emerald-400" : "bg-transparent border-slate-700 text-slate-400 hover:text-white"}`}
                                        onClick={() => setTemplate("matchup")}
                                    >
                                        <Trophy className="w-6 h-6" />
                                        Matchup Hype
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Format</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={format === "square" ? "default" : "outline"}
                                        className={`h-12 ${format === "square" ? "bg-indigo-500 text-white hover:bg-indigo-400" : "bg-transparent border-slate-700 text-slate-400 hover:text-white"}`}
                                        onClick={() => setFormat("square")}
                                    >
                                        Square (1:1)
                                    </Button>
                                    <Button
                                        variant={format === "story" ? "default" : "outline"}
                                        className={`h-12 ${format === "story" ? "bg-indigo-500 text-white hover:bg-indigo-400" : "bg-transparent border-slate-700 text-slate-400 hover:text-white"}`}
                                        onClick={() => setFormat("story")}
                                    >
                                        Story (9:16)
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Primary Team</Label>
                                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-12 rounded-xl">
                                        <SelectValue placeholder="Select Team" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[300px]">
                                        {teams.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {template === "matchup" && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <Label className="text-slate-300 font-bold uppercase tracking-wider text-xs">Opponent Team</Label>
                                    <Select value={opponentTeam} onValueChange={setOpponentTeam}>
                                        <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-12 rounded-xl">
                                            <SelectValue placeholder="Select Opponent" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[300px]">
                                            {teams.map(t => (
                                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-slate-500 text-center mb-4">
                                    Preview updates automatically. Click 'Download' on the card to save.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-8 flex items-center justify-center bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800 p-8 min-h-[800px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-slate-950/0 to-slate-950/0 pointer-events-none" />

                    <SocialCardWrapper
                        fileName={`leaguepack-${template}-${team1?.ticker}-asset`}
                        aspectRatio={format}
                    >
                        {template === "team-promo" ? (
                            <TeamPromoCard team={team1} format={format} />
                        ) : (
                            <MatchupCard team1={team1} team2={team2} format={format} />
                        )}
                    </SocialCardWrapper>
                </div>
            </div>
        </div>
    )
}
