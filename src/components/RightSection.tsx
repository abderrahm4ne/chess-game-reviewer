import Board        from './Board'
import EvalBar      from './EvalBar'
import Controls     from './Controls'
import AnalysisPanel from './AnalysisPanel'
import type { ChessMove } from '../hooks/useChessGame'
import type { AnalysisResult } from '../hooks/useAnalysis'

interface Game {
  white:       string
  black:       string
  whiteRating?: number
  blackRating?: number
}

interface Props {
  fen:         string
  moves:       ChessMove[]
  currentIdx:  number
  flipped:     boolean
  game:        Game | null
  analysis:    AnalysisResult | null
  isAnalyzing: boolean
  onFirst:     () => void
  onPrev:      () => void
  onNext:      () => void
  onLast:      () => void
  onFlip:      () => void
  onAnalyze:   () => void
  onGoTo:      (idx: number) => void
}

export default function RightSection(props: Props) {
  const { fen, moves, currentIdx, flipped, game, analysis, isAnalyzing } = props
  const lastMove = moves[currentIdx - 1] ?? null
  const winChance = analysis?.winChance ?? null

  const topPlayer    = flipped ? game?.white  : game?.black
  const topRating    = flipped ? game?.whiteRating : game?.blackRating
  const bottomPlayer = flipped ? game?.black  : game?.white
  const bottomRating = flipped ? game?.blackRating : game?.whiteRating
  const topColor     = flipped ? 'white' : 'black'
  const bottomColor  = flipped ? 'black' : 'white'

  return (
    <div className="flex flex-1 overflow-hidden bg-primary2-background">

      {/* Center */}
      <div className="flex-1 flex flex-col items-center gap-2.5 p-6 overflow-hidden">

        {/* Top player */}
        <PlayerRow name={topPlayer} rating={topRating} color={topColor} />

        {/* Eval bar + board */}
        <div className="flex items-center gap-3">
          <EvalBar winChance={winChance} />
          {game
            ? <Board fen={fen} flipped={flipped} lastMove={lastMove} bestMove={analysis ? { from: analysis.from, to: analysis.to } : null} />
            : <EmptyBoard />
          }
        </div>

        {/* Bottom player */}
        <PlayerRow name={bottomPlayer} rating={bottomRating} color={bottomColor} />

        {/* Controls */}
        <Controls
          currentIdx={currentIdx}
          total={moves.length}
          isAnalyzing={isAnalyzing}
          onFirst={props.onFirst}
          onPrev={props.onPrev}
          onNext={props.onNext}
          onLast={props.onLast}
          onFlip={props.onFlip}
          onAnalyze={props.onAnalyze}
        />
      </div>

      {/* Analysis + Move list */}
      <AnalysisPanel
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        moves={moves}
        currentIdx={currentIdx}
        onGoTo={props.onGoTo}
      />
    </div>
  )
}

function PlayerRow({ name, rating, color }: { name?: string, rating?: number, color: string }) {
  return (
    <div className="flex items-center gap-2.5" style={{ width: 710 }}>
      <div className={`w-4 h-4 rounded-full border border-border2 ${color === 'white' ? 'bg-[#F0F0EF]' : 'bg-black'}`} />
      <span className="font-text-rubik text-white text-md flex-1 truncate">{name ?? '—'}</span>
      {rating && <span className="font-text-rubik text-white text-xs text-muted">{rating}</span>}
    </div>
  )
}

function EmptyBoard() {
  return (
    <div className="flex items-center justify-center bg-sec border border-border-dark-background rounded 2xl:w-150 2xl:h-150 w-110 h-110">
      <div className="text-center text-muted">
        <div className="text-6xl opacity-50 mb-4">♟</div>
        <p className="text-md text-white font-text-rubik">Select a game to begin</p>
      </div>
    </div>
  )
}