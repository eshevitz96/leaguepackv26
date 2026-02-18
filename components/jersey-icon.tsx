
interface JerseyIconProps {
    color: string
    initial: string
    sport: 'CFB' | 'CBB'
    className?: string
}

const FootballJerseySVG = ({ color, initial }: { color: string, initial: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl filter saturate-110">
        <defs>
            {/* Mesh Pattern for Texture */}
            <pattern id="mesh" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="rgba(0,0,0,0.1)" />
            </pattern>
        </defs>

        {/* Jersey Body - Broad Shoulders, Tapered Waist */}
        <path
            d="M10,25 L25,15 L35,20 L65,20 L75,15 L90,25 L85,45 L80,40 L80,85 C80,88 78,90 75,90 L25,90 C22,90 20,88 20,85 L20,40 L15,45 Z"
            fill={color}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
        />

        {/* Texture Overlay */}
        <path
            d="M10,25 L25,15 L35,20 L65,20 L75,15 L90,25 L85,45 L80,40 L80,85 C80,88 78,90 75,90 L25,90 C22,90 20,88 20,85 L20,40 L15,45 Z"
            fill="url(#mesh)"
        />

        {/* Collar - V-Neck with Trim */}
        <path d="M35,20 L50,35 L65,20" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Sleeve Stripes */}
        <path d="M12,28 L23,21" stroke="white" strokeWidth="3" />
        <path d="M77,21 L88,28" stroke="white" strokeWidth="3" />

        {/* Number/Initial - Varsity Font */}
        <text
            x="50"
            y="65"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="35"
            fontFamily="var(--font-graduate), monospace"
            fontWeight="bold"
            style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}
        >
            {initial}
        </text>
    </svg>
)

const BasketballJerseySVG = ({ color, initial }: { color: string, initial: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl filter saturate-110">
        <defs>
            {/* Mesh Pattern */}
            <pattern id="mesh-bball" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="0.5" fill="rgba(0,0,0,0.05)" />
            </pattern>
        </defs>

        {/* Better Tank: Wide shoulders, scooping neck, deep arms */}
        <path
            d="M28,12 L40,12 C50,28 50,28 60,12 L72,12 L78,40 L78,92 L22,92 L22,40 L28,12 Z"
            fill={color}
            stroke="rgba(0,0,0,0.1)"
        />

        <path
            d="M28,12 L40,12 C50,28 50,28 60,12 L72,12 L78,40 L78,92 L22,92 L22,40 L28,12 Z"
            fill="url(#mesh-bball)"
        />

        {/* Collar Trim */}
        <path d="M40,12 C50,28 50,28 60,12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />

        {/* Armhole Trim */}
        <path d="M28,12 L22,40" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M72,12 L78,40" stroke="white" strokeWidth="3" strokeLinecap="round" />

        {/* Side Panels */}
        <path d="M26,40 L26,92" stroke="white" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <path d="M74,40 L74,92" stroke="white" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        {/* Number/Initial - Varsity Font */}
        <text
            x="50"
            y="60"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="40"
            fontFamily="var(--font-graduate), monospace"
            fontWeight="bold"
            style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}
        >
            {initial}
        </text>
    </svg>
)

export function JerseyIcon({ color, initial, sport, className = "w-10 h-10" }: JerseyIconProps) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {sport === 'CFB' ? (
                <FootballJerseySVG color={color} initial={initial} />
            ) : (
                <BasketballJerseySVG color={color} initial={initial} />
            )}
        </div>
    )
}
