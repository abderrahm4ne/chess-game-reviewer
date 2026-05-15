import icon from '../../public/icon.jpg'
import board from '../../public/board.jpg'
import { useState } from 'react'

interface Game {
  white:       { username: string; rating?: number; result: string }
  black:       { username: string; rating?: number; result: string }
  time_class:  string
  pgn:         string
  url:         string
  end_time:    number
}

interface Props {
  onSelectGame: (game: Game) => void
  selectedPgn?: string
}

function getResultBadge(game: Game, username: string) {
  const isWhite = game.white.username.toLowerCase() === username.toLowerCase()
  const result  = isWhite ? game.white.result : game.black.result
  if (result === 'win') return { label: 'WIN',  cls: 'bg-green-500 ' }
  if (['checkmated','resigned','timeout','abandoned'].includes(result))
    return { label: 'LOSS', cls: 'bg-red-500' }
  return { label: 'DRAW', cls: 'bg-gray-400' }
}

export default function LeftSection({ onSelectGame, selectedPgn }: Props) {
  const [username, setUsername] = useState('')
  const [month,    setMonth]    = useState('')
  const [year,     setYear]     = useState('')
  const [matches,  setMatches]  = useState<Game[]>([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const fetchMatches = async () => {
    if (!username || !month || !year) { setError('Fill all fields'); return }
    try {
      setLoading(true); setError('')
      const correctMonth = month.startsWith('0') ? month : "0" + month; 
      const res = await fetch(`https://api.chess.com/pub/player/${username}/games/${year}/${correctMonth}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMatches(data.games || [])
    } catch { setError('Could not fetch matches') }
    finally   { setLoading(false) }
  }

  const inputCls = 'border border-border-dark-background/10 rounded-md outline-0 px-2 py-2  placeholder:text-muted text-md w-full text-white'

  return (
    <div className="flex flex-col items-center space-y-4 h-full w-80 min-w-[256px] bg-primary-background py-5 border-r border-border-dark-background/10 overflow-hidden">

      {/* Title */}
      <div className="flex space-x-1.5 px-4 w-full items-center ">
        <img src={icon} className="rounded-md w-7 h-7 " alt="" />
        <h2 className="text-xl text-white font-text-jet tracking-tight">Chess Reviewer</h2>
      </div>

      {/* Inputs */}
      <div className="flex flex-col space-y-2 px-3 w-full font-inter">
        <input type="text" placeholder="Username" value={username}
          onChange={e => setUsername(e.target.value)} className={inputCls} />

        <div className="flex space-x-2">
          <input type="text" placeholder="Month (01-12)" value={month}
            onChange={e => setMonth(e.target.value)} className={inputCls} style={{ width: '50%' }} />
          <input type="text" placeholder="Year" value={year}
            onChange={e => setYear(e.target.value)} className={inputCls} style={{ width: '50%' }} />
        </div>

        <button onClick={fetchMatches} disabled={loading}
          className="bg-gold text-black py-2 bg-secondary-backgruond px-2 rounded-md font-semibold text-sm font-text-inter
                     hover:opacity-85 active:scale-[0.99] hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          {loading ? 'Loading…' : 'Fetch'}
        </button>
      </div>

      {/* Divider */}
      <div className="w-full border-b border-border-dark-background/10" />

      {/* Error */}
      {error && <p className="text-red-800 font-bold text-md font-text-inter px-3">{error}</p>}

      {/* Matches count */}
      {matches.length > 0 && (
        <p className="text-[0.7rem] uppercase tracking-widest px-3 w-full text-white ">
          {matches.length} games
        </p>
      )}

      {/* Matches */}
      <div className="flex flex-col w-full overflow-y-auto flex-1 px-2 gap-1">
        {matches.slice().reverse().map((match, i) => {
          const badge  = getResultBadge(match, username)
          const active = match.pgn === selectedPgn
          return (
            <button
              key={i}
              onClick={() => onSelectGame(match)}
              className={`flex flex-row items-center rounded-md py-2 px-2 text-left w-full transition-colors
                ${active ? 'border-l-2 border-gold' : 'hover:bg-primary-hoverd-background'} font-text-inter`}
            >
              <img src={board} className="w-20 h-20 rounded opacity-80" alt="" />

              <div className="flex flex-col gap-0.5 p-2 flex-1 min-w-0">

                <div className="flex items-center gap-1">
                  <div className="rounded-full bg-[#F0F0EF] w-3 h-3 border border-border2" />
                  <span className="text-sm text-white">{match.white.username}</span>
                </div>

                <div className="flex items-center gap-1">
                  <div className="rounded-full bg-[#1A1A1A] w-3 h-3 border border-border2" />
                  <span className="text-sm text-white">{match.black.username}</span>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] text-w font-inter font-bold px-1.5 py-0.5 rounded ${badge.cls}`}>
                    {badge.label}
                  </span>
                  <h1 className="text-[10px] bg-white px-1.5 py-0.5 text-black font-bold capitalize">{match.time_class}</h1>
                </div>

              </div>
            </button>
          )
        })}

        {!loading && matches.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted text-xs text-center">
            <span className="text-4xl opacity-20">♙</span>
            Fetch games to get started
          </div>
        )}
      </div>
    </div>
  )
}