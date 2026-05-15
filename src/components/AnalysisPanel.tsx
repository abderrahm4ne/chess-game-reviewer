import type { AnalysisResult } from '../hooks/useAnalysis'
import type { ChessMove }      from '../hooks/useChessGame'
import { formatEval }     from '../utils/board'

interface Props {
  analysis:    AnalysisResult | null
  isAnalyzing: boolean
  moves:       ChessMove[]
  currentIdx:  number
  onGoTo:      (idx: number) => void
}

export default function AnalysisPanel({ analysis, isAnalyzing, moves, currentIdx, onGoTo }: Props) {
  const ev       = analysis?.eval   ?? null
  const mate     = analysis?.mate   ?? null
  const evalStr  = formatEval(ev, mate)
  const winPct   = analysis?.winChance ?? 50
  const positive = mate != null ? mate > 0 : (ev ?? 0) >= 0

  return (
    <div className="min-w-[288px] border-l border-border flex flex-col w-80 bg-primary-background">

      {/* Analysis header */}
      <div className="px-4 py-3 border-b border-border-dark-background/20 ">
        <p className="text-sm text-white font-text-inter tracking-tight uppercase mb-3 font-bold">Stockfish Analysis</p>

        {/* Big eval */}
        <div className="flex items-end gap-3 mb-3">
          <span className={`font-display text-4xl font-bold text-white leading-none ${positive ? 'text-tx' : 'text-muted'}`}>
            {isAnalyzing ? '…' : evalStr}
          </span>
          {analysis && (
            <span className="text-[11px] text-gray-400 mb-1 font-mono">depth {analysis.depth}</span>
          )}
        </div>

        {/* Win probability bar */}
        <div className="h-1.5 w-full rounded-full bg-white overflow-hidden mb-3">
          <div
            className="h-full bg-gold rounded-full transition-all duration-700 ease-in-out"
            style={{ width: isAnalyzing ? '50%' : `${winPct}%` }}
          />
        </div>

        {/* Best move + continuation */}
        {analysis && !isAnalyzing && (
          <div className="space-y-1">
            <p className="text-sm font-rubik text-white">
              <span >Best Move: </span>
              <span className="text-green-700 ">{analysis.san}</span>
            </p>
            {analysis.continuationArr?.length > 0 && (
              <p className="text-[11px] font-rubik text-gray-400">
                {analysis.continuationArr.slice(0, 4).join(' ')}
              </p>
            )}
          </div>
        )}

        {isAnalyzing && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-block w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            Analyzing position…
          </div>
        )}

        {!analysis && !isAnalyzing && (
          <p className="text-xs text-gray-400">Click Analyze to evaluate this position.</p>
        )}
      </div>

      {/* Move list */}
      <div className="px-3 py-2 border-b border-border-dark-background/20">
        <p className="text-[10px] tracking-widest uppercase text-gray-300">Move List</p>
      </div>

      <MoveListInline moves={moves} currentIdx={currentIdx} onGoTo={onGoTo} />
    </div>
  )
}

import MoveList from './MoveList'

function MoveListInline(props: { moves: ChessMove[], currentIdx: number, onGoTo: (i: number) => void }) {
  return <MoveList {...props} />
}