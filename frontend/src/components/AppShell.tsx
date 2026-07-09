import { useState, type FormEvent } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import Sidebar from './Sidebar'
import RightBar from './RightBar'
import NotificationBell from './NotificationBell'
import Footer from './Footer'
import Logo from './Logo'

function TopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  // 모바일 — 돋보기 탭 시 헤더 아래로 펼쳐지는 검색바
  const [searchOpen, setSearchOpen] = useState(false)

  // 검색 제출 → 뉴스 페이지로 이동하며 ?q= 쿼리로 검색어를 넘긴다(NewsPage 가 필터링).
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    setSearchOpen(false)
    navigate(trimmed ? `/news?q=${encodeURIComponent(trimmed)}` : '/news')
  }

  return (
    // 데스크톱: 높이 h-[84px], 로고는 사이드바 폭(w-56) 컬럼에 두고 검색바 왼쪽 끝을
    // 사이드바 경계(x=224px)에 맞춘다. 모바일: h-16, 햄버거 + 로고 + 돋보기 + 알림벨만
    // 남기고 검색창(인라인)·사용자명·로그아웃은 omit(드로어/검색 토글로 이동).
    // 데모 navbar-eco — 반투명 배경(#FAFAF5 90%) + backdrop blur + 하단 보더
    <header className="shrink-0 border-b border-line bg-bg/90 backdrop-blur-[10px]">
      <div className="flex h-16 items-center pr-4 md:h-[76px]">
        {/* 모바일 — 사이드바 드로어를 여는 햄버거 */}
        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={onMenuOpen}
          className="ml-2 rounded p-2 text-muted transition-colors hover:text-primary-600 md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div className="flex items-center px-2 md:w-56 md:shrink-0 md:px-4">
          {/* md:-translate-y-1: 로고를 4px 위로 올려 시각적 중앙 보정(데스크톱) */}
          <Link to="/" aria-label="홈으로 이동" className="md:-translate-y-1">
            <Logo size={36} wordmarkClassName="text-xl md:text-2xl" />
          </Link>
        </div>
        {/* 데스크톱 검색 — 모바일에서는 collapse(돋보기 아이콘 토글로 대체) */}
        <form onSubmit={handleSearch} className="relative ml-8 hidden w-2/5 md:block">
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
        {/* md:mr-1.5 — 데스크톱에서 알림벨·사용자명 묶음의 오른쪽 여백 6px */}
        <div className="ml-auto flex items-center gap-2 pl-2 md:mr-[82px] md:gap-4 md:pl-4">
          {/* 모바일 — 검색바 펼침 토글 */}
          <button
            type="button"
            aria-label="검색 열기"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
            className="rounded p-1.5 text-muted transition-colors hover:text-primary-600 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4.3-4.3" />
            </svg>
          </button>
          <NotificationBell />
          {/* 사용자명 — 모바일에서는 omit. 로그아웃은 설정 화면(계정 섹션)과 모바일 드로어에서 제공 */}
          {user && (
            <div className="hidden items-center gap-2 text-sm md:flex">
              {/* 이름이 있으면 이름으로, 없으면(기존 이메일 가입 mock) 이메일로 표시.
                  클릭 시 내 정보·투자 이해도 등을 볼 수 있는 설정 화면으로 이동 */}
              <Link
                to="/settings"
                aria-label="내 정보·설정으로 이동"
                className="rounded font-medium text-ink transition-colors hover:text-primary-600"
              >
                {user.name ?? user.email} 님
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* 모바일 — 돋보기 탭 시 펼쳐지는 검색바 */}
      {searchOpen && (
        <form onSubmit={handleSearch} className="px-4 pb-3 md:hidden">
          <div className="relative">
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="뉴스 · 종목 검색"
              className="w-full rounded-lg border border-line bg-surface py-2.5 pl-4 pr-11 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
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
          </div>
        </form>
      )}
    </header>
  )
}

// 공통 레이아웃 셸 — 상단바 + 왼쪽 메뉴 + 본문(Outlet) + 우측 바.
// 보호 라우트 하위의 레이아웃 라우트로 사용 (routes/router.tsx 참고).
// 우측 바(3위젯)는 PLAN.md §5 상 홈 화면 전용이므로 다른 화면(리더/단어장/스크랩/설정 등)에서는 숨긴다.
// 모바일(<md): 사이드바는 고정 컬럼 대신 햄버거로 여는 오프캔버스 드로어로 전환.
function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const showRightBar = location.pathname === '/'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 모바일 드로어 하단 로그아웃 — TopBar 의 로그아웃이 모바일에서 omit 되므로 여기서 제공
  function handleDrawerLogout() {
    logout()
    navigate('/about', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <TopBar onMenuOpen={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        {/* 데스크톱 — 상시 노출 사이드바. 모바일에서는 드로어로 대체 */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
        {showRightBar && <RightBar />}
      </div>
      <Footer />

      {/* 모바일 — 오프캔버스 드로어 + 백드롭 */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-56 flex-col bg-bg shadow-xl">
            {/* 드로어 안에서 메뉴(링크)를 누르면 드로어를 닫는다 — 이벤트 위임 */}
            <div
              className="flex min-h-0 flex-1 overflow-y-auto"
              onClick={(event) => {
                if ((event.target as HTMLElement).closest('a')) setSidebarOpen(false)
              }}
            >
              <Sidebar />
            </div>
            <button
              type="button"
              onClick={handleDrawerLogout}
              className="m-4 rounded-full border-2 border-primary-600 px-4 py-1.5 text-xs font-semibold text-primary-600 transition-all hover:bg-primary-600 hover:text-white"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppShell
