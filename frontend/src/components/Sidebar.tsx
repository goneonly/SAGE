import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, SETTINGS_NAV_ITEM } from './navItems'
import Icon from './Icon'

function navLinkClassName({ isActive }: { isActive: boolean }): string {
  return [
    // h-[3.375rem](54px) — 기존 36px 의 1.5배 높이. 글자(text-base)·아이콘(h-5)도 그에 맞춰 한 단계 키웠다
    'relative isolate flex h-[3.375rem] items-center gap-3 overflow-hidden rounded-lg px-3 text-base font-medium transition-colors',
    isActive
      ? 'bg-primary-600 font-semibold text-on-primary'
      : // hover 시 배경이 왼쪽에서 오른쪽으로 차오른다 — ::before 를 scale-x 0 → 100 으로 늘린다(transform 만 움직여 가볍다).
        // 키보드 포커스에도 같은 효과. 동작 줄이기 설정이면 애니메이션 없이 바로 채운다.
        'text-muted hover:text-ink focus-visible:text-ink before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-primary-100 before:transition-transform before:duration-300 before:ease-out hover:before:scale-x-100 focus-visible:before:scale-x-100 motion-reduce:before:transition-none',
  ].join(' ')
}

function Sidebar() {
  return (
    // 배경·테두리는 없다 — AppShell 의 겹침 사이드바가 반투명 페이드 배경을 깐다
    <nav className="flex h-full w-56 shrink-0 flex-col justify-between gap-4 overflow-y-auto p-4">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.to === '/'} className={navLinkClassName}>
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <NavLink to={SETTINGS_NAV_ITEM.to} className={navLinkClassName}>
        <Icon name={SETTINGS_NAV_ITEM.icon} className="h-5 w-5" />
        {SETTINGS_NAV_ITEM.label}
      </NavLink>
    </nav>
  )
}

export default Sidebar
