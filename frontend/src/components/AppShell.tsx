import { useState, type FormEvent } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import Sidebar from './Sidebar'
import RightBar from './RightBar'
import NotificationBell from './NotificationBell'
import Footer from './Footer'
import Logo from './Logo'

function TopBar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  // 검색 제출 → 뉴스 페이지로 이동하며 ?q= 쿼리로 검색어를 넘긴다(NewsPage 가 필터링).
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/news?q=${encodeURIComponent(trimmed)}` : '/news')
  }

  function handleLogout() {
    logout()
    // 로그아웃하면 서비스 소개 랜딩(About)으로 — 재로그인/가입 진입점이 그 안에 있다
    navigate('/about', { replace: true })
  }

  return (
    // 높이 h-14 → h-[84px] (1.5배). 로고는 사이드바 폭(w-56) 컬럼에 두고, 검색바의 왼쪽
    // 끝을 사이드바가 끝나는 지점(x=224px)에 정확히 맞춘다 — 검색 input 이 로고 컬럼 바로
    // 뒤 flex 형제로 오므로 왼쪽 끝이 사이드바 오른쪽 경계에서 시작한다.
    // 데모 navbar-eco — 반투명 배경(#FAFAF5 90%) + backdrop blur + 하단 보더
    <header className="flex h-[84px] shrink-0 items-center border-b border-line bg-bg/90 pr-4 backdrop-blur-[10px]">
      <div className="flex w-56 shrink-0 items-center px-4">
        {/* -translate-y-1: 로고를 4px 위로 올려 시각적 중앙 보정 */}
        <Link to="/" aria-label="홈으로 이동" className="-translate-y-1">
          <Logo size={36} wordmarkClassName="text-2xl" />
        </Link>
      </div>
      <form onSubmit={handleSearch} className="relative ml-8 w-2/5">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="뉴스 · 종목 검색"
          className="w-full rounded-lg border border-line bg-surface py-3 pl-4 pr-11 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {/* 돋보기 — 입력창 오른쪽 끝에 겹쳐 놓은 제출 버튼 */}
        <button
          type="submit"
          aria-label="검색"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted transition-colors hover:text-primary-600"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4.3-4.3" />
          </svg>
        </button>
      </form>
      <div className="ml-auto flex items-center gap-4 pl-4">
        <NotificationBell />
        {user && (
          <div className="flex items-center gap-2 text-sm">
            {/* 이름이 있으면 이름으로, 없으면(기존 이메일 가입 mock) 이메일로 표시 */}
            <span className="font-medium text-ink">{user.name ?? user.email} 님</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border-2 border-primary-600 px-4 py-1.5 text-xs font-semibold text-primary-600 transition-all hover:bg-primary-600 hover:text-white"
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
      <Footer />
    </div>
  )
}

export default AppShell
