export function CustomLogo({ className = "w-8 h-8", classNamePath = "fill-emerald-500" }: { className?: string, classNamePath?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* 
               Lightning L (Sketch Match)
               - Italicized Block L
               - Sharp jagged "Z" cut (Negative Space)
            */}

            {/* Upper Section */}
            <path
                d="M 25 10 H 75 L 60 35 H 35 L 35 60 L 15 50 V 10 H 25 Z"
                className={classNamePath}
                fill="currentColor"
            />

            {/* Lower Section */}
            <path
                d="M 50 45 L 85 45 L 65 90 H 25 L 45 65 H 65 L 75 50 L 50 50 V 45 Z"
                className={classNamePath}
                fill="currentColor"
            />
        </svg>
    )
}
