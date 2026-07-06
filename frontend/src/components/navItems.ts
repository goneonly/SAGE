// PLAN.md §5 — 왼쪽 메뉴: 홈·뉴스·스크랩·단어장·급상승 종목·포트폴리오·AI 투자 인사이트, 하단 설정
export interface NavItem {
  to: string
  label: string
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '홈' },
  { to: '/news', label: '뉴스' },
  { to: '/scrap', label: '스크랩' },
  { to: '/vocab', label: '단어장' },
  { to: '/top-movers', label: '급상승 종목' },
  { to: '/portfolio', label: '포트폴리오' },
  { to: '/insights', label: 'AI 투자 인사이트' },
]

export const SETTINGS_NAV_ITEM: NavItem = { to: '/settings', label: '설정' }
