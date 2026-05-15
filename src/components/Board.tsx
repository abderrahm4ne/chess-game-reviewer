import { fenToBoard, isLight, PIECE_GLYPHS } from '../utils/board'

const FILES = ['a','b','c','d','e','f','g','h']
const RANKS = ['8','7','6','5','4','3','2','1']

interface Props {
  fen:       string
  flipped:   boolean
  lastMove?: { from: string; to: string } | null
  bestMove?: { from: string; to: string } | null
}

export default function Board({ fen, flipped, lastMove, bestMove }: Props) {
  const board = fenToBoard(fen)
  const files = flipped ? [...FILES].reverse() : FILES
  const ranks = flipped ? [...RANKS].reverse() : RANKS

  function bg(fi: number, ri: number, name: string) {
    const light = isLight(fi, ri)
    if (bestMove?.from === name || bestMove?.to === name) return '#00bfff'
    if (lastMove?.from === name || lastMove?.to === name) return light ? '#cdd16f' : '#aaa23a'
    return light ? '#f0f0ef' : '#398764'
  }

  return (
    <div className="grid grid-cols-8 rounded-md overflow-hidden w-full"
      style={{ border: '2px solid #1a1a1a', boxShadow: '0 16px 64px rgba(0,0,0,0.9)' }}>
      {ranks.map((rank, ri) =>
        files.map((_, fi) => {
          const name  = files[fi] + ranks[ri]
          const piece = board[RANKS.indexOf(rank)][FILES.indexOf(files[fi])]
          const glyph = piece ? PIECE_GLYPHS[piece] : ''
          const light = isLight(fi, ri)

          return (
            <div key={name}
              className="aspect-square relative flex items-center justify-center"
              style={{ background: bg(fi, ri, name) }}>

              {fi === 0 && (
                <span className={`absolute top-0.5 left-1 text-[1cqi] font-bold select-none opacity-70 ${light ? 'text-green-700' : 'text-white'}`}>
                  {rank}
                </span>
              )}
              {ri === 7 && (
                <span className={`absolute bottom-0.5 right-1 text-[1cqi] font-bold select-none opacity-70 ${light ? 'text-green-700' : 'text-white'}`}>
                  {files[fi]}
                </span>
              )}
              {glyph && (
                <span className="select-none pointer-events-none leading-none text-[4.5cqi]"
                  style={{
                    fontFamily: "'Segoe UI Symbol','Apple Symbols','Symbola',serif",
                    filter: piece?.startsWith('w') ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))',
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