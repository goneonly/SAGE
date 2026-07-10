import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

// 토스(toss.im)식 스크롤 리빌 — 뷰포트에 20% 들어오면 아래에서 떠오르며(fade + rise)
// 한 번만 재생된다. About 랜딩의 모든 섹션이 공유하는 연출 프리미티브.
interface RevealProps {
  children: ReactNode
  /** 형제 요소끼리 시차를 주는 지연(ms) — 토스식 스태거 연출 */
  delay?: number
  className?: string
}

function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Reveal
