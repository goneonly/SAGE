import type { ReactElement } from 'react'
import type { NavIconName } from './navItems'

// 사이드바 메뉴용 심플 라인 아이콘 세트 — 24x24 viewBox, stroke=currentColor 라서
// 활성(흰색)/비활성(muted) 상태의 글자색을 그대로 따라간다.
const ICON_SHAPES: Record<NavIconName, ReactElement> = {
  // 집
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </>
  ),
  // 신문
  news: (
    <>
      <rect x="3" y="5" width="18" height="15" rx="2" />
      <path d="M7 9.5h10M7 13h10M7 16.5h6" />
    </>
  ),
  // 북마크
  scrap: <path d="M6 3h12v18l-6-4.5L6 21z" />,
  // 책
  vocab: (
    <>
      <path d="M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
      <path d="M20 17H6.5a2.5 2.5 0 0 0-2.5 2.5" />
    </>
  ),
  // 우상향 화살표
  trending: (
    <>
      <path d="M3 17.5 9.5 11l4 4L21 7" />
      <path d="M15.5 7H21v5.5" />
    </>
  ),
  // 파이 차트
  portfolio: (
    <>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </>
  ),
  // 반짝임(AI)
  insights: (
    <>
      <path d="M11 5.5 12.8 10l4.7 1.8-4.7 1.8L11 18l-1.8-4.4L4.5 11.8 9.2 10z" />
      <path d="M18.5 3.5v3.6M16.7 5.3h3.6" />
    </>
  ),
  // 톱니바퀴(설정) — 몸통 원 + 바깥 톱니 8개 + 중심 축
  settings: (
    <>
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3v2.5M12 18.5V21M21 12h-2.5M5.5 12H3M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4 5.6 5.6" />
    </>
  ),
}

function NavIcon({ name }: { name: NavIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      {ICON_SHAPES[name]}
    </svg>
  )
}

export default NavIcon
