// Placeholder — 공통 레이아웃 셸 (상단바 + 왼쪽 메뉴 + 본문 + 우측 바). Phase 1에서 구현.
import type { ReactNode } from 'react'

function AppShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-bg text-ink">{children}</div>
}

export default AppShell
