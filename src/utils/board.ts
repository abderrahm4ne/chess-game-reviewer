export const PIECE_GLYPHS: Record<string, string> = {
  wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
  bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟',
}

/** Parse FEN board part → 8x8 array of piece strings (e.g. 'wK') or '' */
export function fenToBoard(fen: string): string[][] {
  const board: string[][] = Array.from({ length: 8 }, () => Array(8).fill(''))
  const rows = fen.split(' ')[0].split('/')
  rows.forEach((row, r) => {
    let c = 0
    for (const ch of row) {
      if (/\d/.test(ch)) { c += +ch; continue }
      const color = ch === ch.toUpperCase() ? 'w' : 'b'
      board[r][c] = color + ch.toUpperCase()
      c++
    }
  })
  return board
}

export function isLight(file: number, rank: number): boolean {
  return (file + rank) % 2 === 1
}

export function formatEval(ev: number | null, mate: number | null): string {
  if (mate != null) return `M${Math.abs(mate)}`
  if (ev == null)   return '—'
  return ev > 0 ? `+${ev.toFixed(1)}` : ev.toFixed(1)
}

export function evalToBarHeight(winChance: number | null): number {
  if (winChance == null) return 50
  return Math.max(5, Math.min(95, winChance))
}