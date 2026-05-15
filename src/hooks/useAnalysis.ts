import { useState, useRef } from 'react'

export interface AnalysisResult {
    eval:            number | null
    mate:            number | null
    san:             string
    from:            string
    to:              string
    winChance:       number
    continuationArr: string[]
    text:            string
    depth:           number
}

export function useAnalysis() {
    const [analysis,    setAnalysis]    = useState<AnalysisResult | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const ctrlRef = useRef<AbortController | null>(null)

    async function analyze(fen: string) {
        ctrlRef.current?.abort()
        ctrlRef.current = new AbortController()
        setIsAnalyzing(true)
        setAnalysis(null)
        try {
        const res = await fetch('https://chess-api.com/v1', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ fen, depth: 12, variants: 1 }),
            signal:  ctrlRef.current.signal,
        })
        if (!res.ok) throw new Error('Analysis failed')
        setAnalysis(await res.json())
        } catch (e: any) {
        if (e.name !== 'AbortError') console.error(e)
        } finally {
        setIsAnalyzing(false)
        }
    }

    function clear() {
        ctrlRef.current?.abort()
        setAnalysis(null)
        setIsAnalyzing(false)
    }

    return { analysis, isAnalyzing, analyze, clear }
}