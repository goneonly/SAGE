import { cn } from '../../lib/cn'

// 진행 막대 — 오늘의 목표·마스터한 용어 수처럼 "n / 전체"를 보여줄 때 쓴다.
// 수치는 호출부가 옆에 글자로도 적는다(막대만으로 값을 전달하지 않는다).
interface ProgressBarProps {
  /** 스크린리더가 읽을 이름 */
  label: string
  value: number
  max: number
  className?: string
}

function ProgressBar({ label, value, max, className }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max)
  const percent = max > 0 ? (clamped / max) * 100 : 0
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      className={cn('h-1.5 overflow-hidden rounded-full bg-line', className)}
    >
      <div
        className="h-full rounded-full bg-primary-600 transition-[width] duration-300 motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export default ProgressBar
