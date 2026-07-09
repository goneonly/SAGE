// PLAN.md §5 — 왼쪽 메뉴: 홈·뉴스·스크랩·단어장·급상승 종목·포트폴리오·AI 투자 인사이트, 하단 설정
// icon 은 NavIcon.tsx 의 아이콘 이름과 1:1 대응한다.
export type NavIconName =
  'home' | 'news' | 'scrap' | 'vocab' | 'trending' | 'portfolio' | 'insights' | 'settings'

export interface NavItem {
  to: string
  label: string
  icon: NavIconName
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '홈', icon: 'home' },
  { to: '/news', label: '뉴스', icon: 'news' },
  { to: '/scrap', label: '스크랩', icon: 'scrap' },
  { to: '/vocab', label: '단어장', icon: 'vocab' },
  { to: '/top-movers', label: '급상승 종목', icon: 'trending' },
  { to: '/portfolio', label: '포트폴리오', icon: 'portfolio' },
  { to: '/insights', label: 'AI 투자 인사이트', icon: 'insights' },
]

export const SETTINGS_NAV_ITEM: NavItem = { to: '/settings', label: '설정', icon: 'settings' }
