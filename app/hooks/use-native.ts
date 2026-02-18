import { Capacitor } from '@capacitor/core'
import { useState, useEffect } from 'react'

export function useNative() {
    const [isNative, setIsNative] = useState(false)

    useEffect(() => {
        // Double check: Capacitor platform OR user agent
        const isCapacitor = Capacitor.isNativePlatform() ||
            window.navigator.userAgent.includes('Capacitor') ||
            (window.navigator.userAgent.includes('iPhone') && !window.navigator.userAgent.includes('Safari'))

        setIsNative(isCapacitor)
    }, [])

    return isNative
}
