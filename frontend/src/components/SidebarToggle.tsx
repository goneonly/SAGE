import type { CSSProperties } from 'react'
import { cn } from '../lib/cn'
import { useSidebarStore } from '../lib/store/sidebarStore'
import Icon from './Icon'

// 왼쪽 사이드바 열기·닫기 버튼 — 둥근 버튼 + 가로 막대 3개.
// 모든 폭에서 상단바가 아니라 각 화면 제목 왼쪽(PageTitle·홈 "추천 뉴스")에 둔다.
// 열 때 자기 위치를 넘겨, 열린 사이드바의 닫기 버튼이 정확히 같은 자리에 오게 한다(버튼이 움직이지 않음).
// data-sidebar-toggle: 사이드바의 "바깥 클릭 시 닫기"가 이 버튼 클릭은 무시하도록 표시한다.
function SidebarToggle({ className, style }: { className?: string; style?: CSSProperties }) {
  const isOpen = useSidebarStore((state) => state.isOpen)
  const toggle = useSidebarStore((state) => state.toggle)

  return (
    <button
      type="button"
      data-sidebar-toggle
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
      aria-expanded={isOpen}
      aria-controls="app-sidebar"
      style={style}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const panelTop = document.getElementById('app-sidebar')?.getBoundingClientRect().top ?? 0
        toggle({ top: rect.top - panelTop, left: rect.left })
      }}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-primary-600 hover:text-ink',
        className,
      )}
    >
      <Icon name="sidebar" className="h-5 w-5" />
    </button>
  )
}

export default SidebarToggle
