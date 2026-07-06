import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import Sidebar from './Sidebar'
import RightBar from './RightBar'
import NotificationBell from './NotificationBell'

function TopBar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    // 높이 h-14 → h-[84px] (1.5배). 로고는 사이드바 폭(w-56) 컬럼에 두고, 검색바의 왼쪽
    // 끝을 사이드바가 끝나는 지점(x=224px)에 정확히 맞춘다 — 검색 input 이 로고 컬럼 바로
    // 뒤 flex 형제로 오므로 왼쪽 끝이 사이드바 오른쪽 경계에서 시작한다.
    <header className="flex h-[84px] shrink-0 items-center border-b border-line bg-white pr-4">
      <div className="flex w-56 shrink-0 items-center px-4">
        <span className="text-lg font-bold text-primary-600">UFN</span>
      </div>
      <input
        type="search"
        placeholder="뉴스·종목 검색"
        className="w-72 rounded-md border border-line bg-bg px-3 py-1.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <div className="ml-auto flex items-center gap-4 pl-4">
        <NotificationBell />
        {user && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-ink">{user.email}님</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-line px-2 py-1 text-xs text-muted hover:bg-primary-50 hover:text-ink"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

// 공통 레이아웃 셸 — 상단바 + 왼쪽 메뉴 + 본문(Outlet) + 우측 바.
// 보호 라우트 하위의 레이아웃 라우트로 사용 (routes/router.tsx 참고).
// 우측 바(3위젯)는 PLAN.md §5 상 홈 화면 전용이므로 다른 화면(리더/단어장/스크랩/설정 등)에서는 숨긴다.
function AppShell() {
  const location = useLocation()
  const showRightBar = location.pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <TopBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        {showRightBar && <RightBar />}
      </div>
    </div>
  )
}

export default AppShell
