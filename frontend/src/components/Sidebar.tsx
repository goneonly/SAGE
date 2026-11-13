import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, SETTINGS_NAV_ITEM } from './navItems'
import Icon from './Icon'

function navLinkClassName({ isActive }: { isActive: boolean }): string {
  return [
    // h-[3.375rem](54px) — 기존 36px 의 1.5배 높이. 글자(text-base)·아이콘(h-5)도 그에 맞춰 한 단계 키웠다
    'flex h-[3.375rem] items-center gap-3 rounded-lg px-3 text-base font-medium transition-colors',
    isActive
      ? 'bg-primary-600 font-semibold text-on-primary'
      : 'text-muted hover:bg-primary-50 hover:text-ink',
  ].join(' ')
}

function Sidebar() {
  return (
    <nav className="flex h-full w-56 shrink-0 flex-col justify-between gap-4 overflow-y-auto border-r border-line bg-bg p-4">
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
