import { useEffect, useRef } from 'react'
import type { ChessMove } from '../hooks/useChessGame'

interface Props {
  moves:      ChessMove[]
  currentIdx: number           // 0 = start, 1 = after move 0, …
  onGoTo:     (idx: number) => void
}

export default function MoveList({ moves, currentIdx, onGoTo }: Props) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' })
  }, [currentIdx])

  if (!moves.length) return (
    <div className="flex-1 flex items-center justify-center text-muted text-xs">
      No game loaded
    </div>
  )

  // Group into pairs: [[w, b], [w, b], …]
  const pairs: [ChessMove, ChessMove | null][] = []
  for (let i = 0; i < moves.length; i += 2)
    pairs.push([moves[i], moves[i + 1] ?? null])

  function moveBtn(move: ChessMove, plyIdx: number) {
    const active = currentIdx === plyIdx + 1
    return (
      <button
        key={plyIdx}
        ref={active ? activeRef : undefined}
        onClick={() => onGoTo(plyIdx + 1)}
        className={`px-2 py-0.5 rounded text-sm font-mono font-medium transition-colors text-left
          ${active
            ? 'bg-gold text-black'
            : 'text-tx hover:bg-surface2'}`}
      >
        {move.san}
      </button>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
      {pairs.map(([w, b], pairIdx) => (
        <div key={pairIdx} className="flex items-center gap-1">
          <span className="w-7 text-[11px] text-muted font-mono select-none text-right flex-shrink-0">
            {pairIdx + 1}.
          </span>
          {moveBtn(w, pairIdx * 2)}
          {b && moveBtn(b, pairIdx * 2 + 1)}
        </div>
      ))}
    </div>
  )
}