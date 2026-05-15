import { SkipForward, ArrowLeft, SkipBack, ArrowRight, Undo2 } from 'lucide-react';

interface Props {
  currentIdx:  number
  total:       number
  isAnalyzing: boolean
  onFirst:     () => void
  onPrev:      () => void
  onNext:      () => void
  onLast:      () => void
  onFlip:      () => void
  onAnalyze:   () => void
}


export default function Controls({ currentIdx, total, isAnalyzing, onFirst, onPrev, onNext, onLast, onFlip, onAnalyze }: Props) {
  const atStart = currentIdx === 0
  const atEnd   = currentIdx === total

  return (
    <div className="flex items-center gap-1.5">

      <button className={`w-9 h-9 flex items-center justify-center border rounded bg-secondary-backgruond hover:opacity-85 active:scale-[0.99] hover:cursor-pointer  transition-all`} onClick={onFirst} disabled={atStart} title="First"><SkipBack /></button>
      
      <button className={`w-9 h-9 flex items-center justify-center border rounded bg-secondary-backgruond hover:opacity-85 active:scale-[0.99] hover:cursor-pointer transition-all`} onClick={onPrev}  disabled={atStart} title="Prev"><ArrowLeft /></button>

      <span className="font-mono text-[20px] text-black rounded py-0.5 text-muted px-2 select-none whitespace-nowrap bg-white">
        {currentIdx} / {total}
      </span>

      <button className={`w-9 h-9 flex items-center justify-center border rounded bg-secondary-backgruond hover:opacity-85 active:scale-[0.99] hover:cursor-pointer transition-all`} onClick={onNext} disabled={atEnd} title="Next"><ArrowRight /></button>

      <button className={`w-9 h-9 flex items-center justify-center border rounded bg-secondary-backgruond hover:opacity-85 active:scale-[0.99] hover:cursor-pointer transition-all`} onClick={onLast} disabled={atEnd} title="Last"><SkipForward /></button>

      <div className="w-px h-5 bg-border mx-1" />

      <button className={`w-9 h-9 flex items-center justify-center border rounded bg-secondary-backgruond hover:opacity-85 active:scale-[0.99] hover:cursor-pointer transition-all`} onClick={onFlip} title="Flip board"><Undo2 className='rotate-90'/></button>

      <button
        onClick={onAnalyze}
        disabled={isAnalyzing || total === 0}
        className="h-9 px-4 bg-gold bg-white text-md font-semibold rounded ml-1
                   hover:opacity-85 hover:cursor-pointer disabled:bg-surface disabled:text-muted disabled:cursor-not-allowed transition-opacity"
      >
        {isAnalyzing ? 'Analyzing…' : 'ANALYZE'}
      </button>
    </div>
  )
}