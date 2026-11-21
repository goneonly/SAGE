import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

// 브라우저 창 틀 — SAGE 는 웹 서비스라 휴대폰 대신 브라우저 창 안에 화면 예시를 끼워 보여 준다.
// 높이는 className 으로 정하고(예: h-[420px]), 안쪽 화면은 남은 높이를 채운다.
interface BrowserMockupProps {
  /** 주소창 자리에 보일 경로 (실제 링크 아님) */
  path?: string
  className?: string
  children: ReactNode
}

function BrowserMockup({ path = '/', className, children }: BrowserMockupProps) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-xl',
        className,
      )}
    >
      {/* 창 위쪽 막대 — 신호등 점 3개 + 주소창 */}
      <div className="flex shrink-0 items-center gap-3 border-b border-line bg-bg-alt px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </div>
        <div className="flex-1 truncate rounded-md bg-surface px-3 py-1 text-center text-[11px] text-subtle">
          SAGE{path}
        </div>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export default BrowserMockup
