import { evalToBarHeight } from '../utils/board'

interface Props {
  winChance: number | null
}

export default function EvalBar({ winChance }: Props) {
  const whiteH = evalToBarHeight(winChance)

  return (
    <div className="w-4 2xl:h-150 h-110 bg-[#0d0d0d] border border-border rounded-sm overflow-hidden relative ">
      {/* white fill from bottom */}
      <div
        className="absolute bottom-0 w-full bg-[#F0F0EF] transition-all duration-700 ease-in-out"
        style={{ height: `${whiteH}%` }}
      />
    </div>
  )
}