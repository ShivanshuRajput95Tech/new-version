import { useState, useCallback, useRef, useEffect } from "react"

const DEFAULT_MESSAGE = "Loading..."
const DEFAULT_VARIANT = "default"

export const useLoading = (initialLoading = false) => {

    const [isLoading, setIsLoading] = useState(initialLoading)
    const [loadingMessage, setLoadingMessage] = useState(DEFAULT_MESSAGE)
    const [loadingProgress, setLoadingProgress] = useState(null)
    const [loadingVariant, setLoadingVariant] = useState(DEFAULT_VARIANT)

    const intervalRef = useRef(null)

    /* Cleanup interval */

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    const startLoading = useCallback((message = DEFAULT_MESSAGE, variant = DEFAULT_VARIANT) => {
        setIsLoading(true)
        setLoadingMessage(message)
        setLoadingVariant(variant)
        setLoadingProgress(null)
    }, [])

    const stopLoading = useCallback(() => {

        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }

        setIsLoading(false)
        setLoadingMessage(DEFAULT_MESSAGE)
        setLoadingProgress(null)
        setLoadingVariant(DEFAULT_VARIANT)

    }, [])

    const updateProgress = useCallback((progress) => {
        setLoadingProgress(progress)
    }, [])

    const updateMessage = useCallback((message) => {
        setLoadingMessage(message)
    }, [])

    const setVariant = useCallback((variant) => {
        setLoadingVariant(variant)
    }, [])

    /* Simulated progress */

    const simulateProgress = useCallback(async(operation, steps = 100) => {

        setLoadingProgress(0)

        intervalRef.current = setInterval(() => {

            setLoadingProgress(prev => {
                const current = prev ? ? 0
                const next = current + (100 / steps)
                return next >= 95 ? 95 : next
            })

        }, 50)

        try {

            const result =
                typeof operation === "function" ?
                await operation() :
                await operation

            setLoadingProgress(100)

            setTimeout(() => {
                stopLoading()
            }, 300)

            return result

        } catch (error) {

            stopLoading()
            throw error

        }

    }, [stopLoading])

    return {
        isLoading,
        loadingMessage,
        loadingProgress,
        loadingVariant,
        startLoading,
        stopLoading,
        updateProgress,
        updateMessage,
        setVariant,
        simulateProgress
    }

}