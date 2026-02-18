"use client"

import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

interface SocialCardWrapperProps {
    children: React.ReactNode
    fileName: string
    aspectRatio?: "square" | "story"
}

export function SocialCardWrapper({ children, fileName, aspectRatio = "square" }: SocialCardWrapperProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [downloading, setDownloading] = useState(false)

    // Dimensions
    // We render at FULL HD resolution to ensure high quality output
    // and consistent spacing, then scale it down for the preview.
    const fullWidth = 1080
    const fullHeight = aspectRatio === "square" ? 1080 : 1920

    // Preview sizes
    const previewHeight = 600
    const scale = previewHeight / fullHeight
    const previewWidth = fullWidth * scale

    const handleDownload = async () => {
        if (!ref.current) return
        setDownloading(true)

        try {
            // We can just export at pixelRatio 1 since the node is already 1080p
            const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 1 })
            const link = document.createElement("a")
            link.download = `${fileName}.png`
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error("Failed to generate image", err)
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-6">
            {/* The Capture Container */}
            <div
                className="relative group shadow-2xl rounded-2xl overflow-hidden bg-black/50 ring-1 ring-white/10 transition-all duration-300"
                style={{ width: previewWidth, height: previewHeight }}
            >
                {/* Scaled Wrapper */}
                <div
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        width: fullWidth,
                        height: fullHeight
                    }}
                >
                    <div
                        ref={ref}
                        className="w-full h-full bg-slate-950 overflow-hidden relative"
                    >
                        {children}
                    </div>
                </div>
            </div>

            <Button
                size="lg"
                onClick={handleDownload}
                disabled={downloading}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full px-8 shadow-lg shadow-emerald-500/20"
            >
                {downloading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Asset
                    </>
                )}
            </Button>
        </div>
    )
}
