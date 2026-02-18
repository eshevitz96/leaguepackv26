"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2, LogIn } from "lucide-react"

export function AuthModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [view, setView] = useState<"sign_in" | "sign_up">("sign_in")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (view === "sign_up") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username,
                        },
                    },
                })
                if (error) throw error
                // Auto sign in or show success message? Supabase usually auto signs in if email confirm is off.
                // If email confirm is on, we should tell them to check email.
                // For this demo, let's assume it might just work or ask to check email.
                setIsOpen(false)
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                setIsOpen(false)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        {view === "sign_in" ? "Welcome Back" : "Create Account"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAuth} className="space-y-4 py-4">
                    {view === "sign_up" && (
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="TraderJoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-slate-950 border-slate-800 text-white"
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="joe@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-950 border-slate-800 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-slate-950 border-slate-800 text-white"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center bg-red-950/30 p-2 rounded">{error}</p>
                    )}

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (view === "sign_in" ? "Sign In" : "Sign Up")}
                    </Button>

                    <div className="text-center text-sm text-slate-400">
                        {view === "sign_in" ? (
                            <p>
                                New to LeaguePack?{" "}
                                <button type="button" onClick={() => setView("sign_up")} className="text-emerald-400 hover:underline">
                                    Sign Up
                                </button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{" "}
                                <button type="button" onClick={() => setView("sign_in")} className="text-emerald-400 hover:underline">
                                    Sign In
                                </button>
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900 px-2 text-slate-500">
                                OR (Dev Mode)
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-emerald-900/50 text-emerald-500 hover:bg-emerald-900/20"
                        onClick={async () => {
                            setLoading(true)
                            const testEmail = "test@leaguepack.com"
                            const testPass = "password123"

                            // Try Login
                            console.log("Attempting Dev Login...")
                            const { error: loginError } = await supabase.auth.signInWithPassword({
                                email: testEmail,
                                password: testPass
                            })

                            if (!loginError) {
                                setIsOpen(false)
                                setLoading(false)
                                return
                            }

                            // If Login fails, try Signup
                            console.log("Login failed, attempting Dev Signup...")
                            const { error: signupError } = await supabase.auth.signUp({
                                email: testEmail,
                                password: testPass,
                                options: { data: { username: "TestUser" } }
                            })

                            if (signupError) {
                                setError(signupError.message)
                            } else {
                                setIsOpen(false)
                            }
                            setLoading(false)
                        }}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Quick Test Login"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
