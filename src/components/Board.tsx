import { fenToBoard, isLight, PIECE_GLYPHS } from '../utils/board'

const FILES = ['a','b','c','d','e','f','g','h']
const RANKS = ['8','7','6','5','4','3','2','1']

interface Props {
  fen:       string
  flipped:   boolean
  lastMove?: { from: string; to: string } | null
  bestMove?: { from: string; to: string } | null
}

const SQ = 85

export default function Board({ fen, flipped, lastMove, bestMove }: Props) {
    const board = fenToBoard(fen)
    const files = flipped ? [...FILES].reverse() : FILES
    const ranks = flipped ? [...RANKS].reverse() : RANKS

    function sq(fi: number, ri: number) { return files[fi] + ranks[ri] }

    function squareStyle(fi: number, ri: number): React.CSSProperties {
        const name  = sq(fi, ri)
        const light = isLight(fi, ri)
        if (bestMove?.from === name) return { background: '#00bfff' }
        if (bestMove?.to   === name) return { background: '#00bfff' }
        if (lastMove?.from === name || lastMove?.to === name)
          return { background: light ? '#cdd16f' : '#aaa23a' }
        return { background: light ? '#f0f0ef' : '#398764' }
    }

    return (
      <div className='grid grid-cols-8 grid-rows-8 width-[8 * SQ] height-[8 * SQ] rounded-md '>
        {ranks.map((rank, ri) =>
          files.map((_, fi) => {
            const name   = sq(fi, ri)
            const rowIdx = RANKS.indexOf(rank)
            const colIdx = FILES.indexOf(files[fi])
            const piece  = board[rowIdx][colIdx]
            const glyph  = piece ? PIECE_GLYPHS[piece] : ''
            const light  = isLight(fi, ri)

            return (
              <div key={name} style={{
                ...squareStyle(fi, ri),
                width: SQ, height: SQ,
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {fi === 0 && (
                  <span className={`absolute top-1 left-1 text-sm font-text-rubik ${light ? 'text-green-700' : 'text-white'}`} >
                    {rank}
                  </span>
                )}
                {ri === 7 && (
                  <span className={`absolute bottom-0 right-1 text-sm font-text-rubik ${light ? 'text-green-700' : 'text-white'}`} >
                    {files[fi]}
                  </span>
                )}
                {glyph && (
                  <span  style={{
                    fontSize: 52, lineHeight: 1,
                    userSelect: 'none', pointerEvents: 'none',
                    fontFamily: "'Syne','Apple Symbols','Symbola',serif",
                    filter: piece?.startsWith('w')
                      ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))'
                      : 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))',
                  }}>
                    {glyph}
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>
    )
}