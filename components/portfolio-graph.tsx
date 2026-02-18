"use client"

import { useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, TrendingUp } from "lucide-react"

const data = [
    { date: "Jan 1", value: 1000 },
    { date: "Jan 3", value: 1025 },
    { date: "Jan 5", value: 1010 },
    { date: "Jan 7", value: 1045 },
    { date: "Jan 9", value: 1080 },
    { date: "Jan 11", value: 1065 },
    { date: "Jan 13", value: 1120 },
    { date: "Jan 15", value: 1150 },
    { date: "Jan 17", value: 1140 },
    { date: "Jan 19", value: 1180 },
    { date: "Jan 21", value: 1210 },
    { date: "Jan 23", value: 1195 },
    { date: "Jan 25", value: 1250 },
    { date: "Jan 27", value: 1280 },
    { date: "Jan 29", value: 1230 },
    { date: "Jan 31", value: 1295 },
]

export function PortfolioPerformanceGraph() {
    const [timeRange, setTimeRange] = useState("30D")

    const latestValue = data[data.length - 1].value
    const startValue = data[0].value
    const percentChange = ((latestValue - startValue) / startValue) * 100

    return (
        <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-normal text-slate-400">
                        Portfolio Value
                    </CardTitle>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">
                            ${latestValue.toFixed(2)}
                        </span>
                        <span className="text-sm font-medium text-emerald-500 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{percentChange.toFixed(1)}%
                        </span>
                    </div>
                </div>

                {/* Time Filters */}
                <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
                    {['7D', '30D', 'YTD', 'ALL'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${timeRange === range
                                ? 'bg-emerald-500 text-slate-950'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                hide
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                hide
                                domain={['dataMin - 100', 'dataMax + 50']}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border border-slate-800 bg-slate-950 p-2 shadow-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-slate-500">
                                                            Value
                                                        </span>
                                                        <span className="font-bold text-emerald-500">
                                                            ${Number(payload[0].value).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#10b981" // Emerald-500
                                strokeWidth={2}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
