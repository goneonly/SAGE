import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, SETTINGS_NAV_ITEM } from './navItems'
import NavIcon from './NavIcon'

function navLinkClassName({ isActive }: { isActive: boolean }): string {
  return [
    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary-600 font-semibold text-white'
      : 'text-muted hover:bg-primary-50 hover:text-ink',
  ].join(' ')
}

function Sidebar() {
  return (
    <nav className="flex w-56 shrink-0 flex-col justify-between border-r border-line bg-bg p-4">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.to === '/'} className={navLinkClassName}>
              <NavIcon name={item.icon} />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <NavLink to={SETTINGS_NAV_ITEM.to} className={navLinkClassName}>
        <NavIcon name={SETTINGS_NAV_ITEM.icon} />
        {SETTINGS_NAV_ITEM.label}
      </NavLink>
    </nav>
  )
}

export default Sidebar
