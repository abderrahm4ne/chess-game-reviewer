import { useState } from 'react'
import { Chess } from 'chess.js'

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export interface ChessMove {
    san:            string
    from:           string
    to:             string
    color:          'w' | 'b'
    after:          string
}

export function useChessGame() {
    const [positions,  setPositions]  = useState<string[]>([])
    const [moves,      setMoves]      = useState<ChessMove[]>([])
    const [currentIdx, setCurrentIdx] = useState(0)
    const [flipped,    setFlipped]    = useState(false)

    function loadGame(pgn: string) {
        const chess = new Chess()
        chess.loadPgn(pgn)
        const history = chess.history({ verbose: true }) as ChessMove[]
        setPositions([START_FEN, ...history.map(m => m.after)])
        setMoves(history)
        setCurrentIdx(0)
    }

    function goTo(idx: number) { setCurrentIdx(Math.max(0, Math.min(idx, moves.length))) }
    function prev() { setCurrentIdx(i => Math.max(0, i - 1)) }
    function next() { setCurrentIdx(i => Math.min(moves.length, i + 1)) }
    function first() { setCurrentIdx(0) }
    function last() { setCurrentIdx(moves.length) }
    function flip() { setFlipped(f => !f) }

    return { positions, moves, currentIdx, setCurrentIdx, flipped, loadGame, goTo, prev, next, first, last, flip }
}