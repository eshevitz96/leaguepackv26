import Image from "next/image"

export function CustomLogo({ className = "w-8 h-8", classNamePath = "fill-emerald-500" }: { className?: string, classNamePath?: string }) {
    return (
        <div className={`relative ${className}`}>
            <Image
                src="/app-icon-header.png"
                alt="LeaguePack Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    )
}
