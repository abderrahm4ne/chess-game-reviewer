import { useEffect, useRef } from 'react'
import LeftSection  from './components/LeftSection'
import RightSection from './components/RightSection'
import { useChessGame } from './hooks/useChessGame'
import { useAnalysis }  from './hooks/useAnalysis'

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

interface Game {
  white:       { username: string; rating?: number; result: string }
  black:       { username: string; rating?: number; result: string }
  time_class:  string
  pgn:         string
  url:         string
  end_time:    number
}

export default function App() {
    const game    = useChessGame()
    const anal    = useAnalysis()

    const currentFen = game.positions[game.currentIdx] ?? START_FEN

    function handleSelectGame(match: Game) {
        game.loadGame(match.pgn)
        anal.clear()
        ;(window as any).__selectedGame = {
        white:       match.white.username,
        black:       match.black.username,
        whiteRating: match.white.rating,
        blackRating: match.black.rating,
        }
    }

    function handleAnalyze() { anal.analyze(currentFen) }

    function handleGoTo(idx: number) { game.setCurrentIdx(idx); anal.clear() }
    function handlePrev()            { game.prev();              anal.clear() }
    function handleNext()            { game.next();              anal.clear() }

    const keysRef = useRef({ handlePrev, handleNext, handleAnalyze, flip: game.flip, clear: anal.clear })
    keysRef.current = { handlePrev, handleNext, handleAnalyze, flip: game.flip, clear: anal.clear }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
        const k = keysRef.current
        if (e.key === 'ArrowLeft')  k.handlePrev()
        if (e.key === 'ArrowRight') k.handleNext()
        if (e.key === 'f')          k.flip()
        if (e.key === 'Enter')      k.handleAnalyze()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    const selectedGame: any = (window as any).__selectedGame ?? null

    return (
        <div className="flex h-screen overflow-hidden bg-bg font-ui ">
        <LeftSection
            onSelectGame={handleSelectGame}
            selectedPgn={undefined}
        />
        <RightSection
            fen={currentFen}
            moves={game.moves}
            currentIdx={game.currentIdx}
            flipped={game.flipped}
            game={selectedGame}
            analysis={anal.analysis}
            isAnalyzing={anal.isAnalyzing}
            onFirst={() => { game.first(); anal.clear() }}
            onPrev={handlePrev}
            onNext={handleNext}
            onLast={() => { game.last(); anal.clear() }}
            onFlip={game.flip}
            onAnalyze={handleAnalyze}
            onGoTo={handleGoTo}
        />
        
        </div>
    )
}