import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import SidebarToggle from '../SidebarToggle'

// 앱 셸 페이지 공통 헤더 — h1 + 보조 설명의 타이포그래피를 한 곳에서 통일한다.
// 제목 왼쪽에는 왼쪽 메뉴를 여는 SidebarToggle 이 온다(모든 화면 공통 위치).
// description 이 ReactNode 인 이유: 뉴스 화면처럼 검색 초기화 버튼이 섞이는 경우가 있다.
interface PageTitleProps {
  title: string
  description?: ReactNode
  className?: string
}

function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <header className={cn(className)}>
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <h1 className="text-xl font-bold text-ink">{title}</h1>
      </div>
      {description && <div className="mt-1 text-xs text-muted">{description}</div>}
    </header>
  )
}

export default PageTitle
