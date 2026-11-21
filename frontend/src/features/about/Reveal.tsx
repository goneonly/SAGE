import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { reduceMotion, useInView } from './motion'

// 소개 페이지의 등장 연출 부품 — 훅은 motion.ts, 여기는 그 훅을 쓰는 컴포넌트만 둔다(Fast Refresh 규칙).

interface RevealProps {
  children: ReactNode
  /** 형제 요소끼리 시차를 주는 지연(ms) */
  delay?: number
  /** 페이지가 열리자마자 나타남 (첫 화면용) */
  eager?: boolean
  className?: string
}

/** 화면에 들어오면 아래에서 떠오르며 나타난다 */
function Reveal({ children, delay = 0, eager = false, className }: RevealProps) {
  const [ref, seen] = useInView(0.2, eager)
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none',
        seen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 motion-reduce:translate-y-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** 화면에 들어오면 0 에서 to 까지 올라가는 숫자 */
export function CountUp({ to, duration = 1100 }: { to: number; duration?: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.6)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!seen || reduceMotion()) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3)))) // 끝으로 갈수록 느려짐
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [seen, to, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {seen && reduceMotion() ? to : value}
    </span>
  )
}

export default Reveal
