import { useState, type FormEvent } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import Sidebar from './Sidebar'
import RightBar from './RightBar'
import OnboardingModal from './OnboardingModal'
import { isOnboardingPending } from '../lib/onboarding'
import NotificationBell from './NotificationBell'
import Footer from './Footer'
import Logo from './Logo'
import { useDialog } from '../lib/useDialog'
import { useHomeViewStore } from '../lib/store/homeViewStore'
import Icon from './Icon'

interface TopBarProps {
  onMenuOpen: () => void
}

interface SearchFieldProps {
  query: string
  onQueryChange: (value: string) => void
  /** 데스크톱·모바일의 세로 패딩 차이만 넘긴다 */
  inputClassName: string
  autoFocus?: boolean
}

// 검색 입력 + 돋보기 제출 버튼 — 데스크톱 상단바와 모바일 펼침 검색바가 같이 쓴다.
function SearchField({ query, onQueryChange, inputClassName, autoFocus }: SearchFieldProps) {
  return (
    <div className="relative">
      <input
        type="search"
        aria-label="뉴스·종목 검색"
        autoFocus={autoFocus}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="뉴스 · 종목 검색"
        className={`w-full rounded-lg border border-line bg-surface pl-4 pr-11 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 ${inputClassName}`}
      />
      {/* 돋보기 — 입력창 오른쪽 끝에 겹쳐 놓은 제출 버튼 */}
      <button
        type="submit"
        aria-label="검색"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted transition-colors hover:text-primary-600"
      >
        <Icon name="search" className="h-4 w-4" />
      </button>
    </div>
  )
}

function TopBar({ onMenuOpen }: TopBarProps) {
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
    // sticky top-0 — 스크롤해도 상단에 고정. z-30 으로 본문·캐러셀 화살표(z-20) 위에 둔다
    <header className="sticky top-0 z-30 shrink-0 border-b border-line bg-bg/90 backdrop-blur-[10px]">
      <div className="flex h-16 items-center pr-4 md:h-[76px]">
        <div className="flex items-center px-2 md:w-56 md:shrink-0 md:px-4">
          {/* md:-translate-y-1: 로고를 4px 위로 올려 시각적 중앙 보정(데스크톱) */}
          <Link to="/" aria-label="홈으로 이동" className="md:-translate-y-1">
            <Logo size={36} wordmarkClassName="text-xl md:text-2xl" />
          </Link>
        </div>
        {/* 데스크톱 검색 — 모바일에서는 collapse(돋보기 아이콘 토글로 대체) */}
        <form onSubmit={handleSearch} className="ml-8 hidden w-2/5 md:block">
          <SearchField query={query} onQueryChange={setQuery} inputClassName="py-3" />
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
            <Icon name="search" className="h-5 w-5" />
          </button>
          <NotificationBell />
          {/* 사용자명 — 모바일에서는 omit. 로그아웃은 설정 화면(계정 섹션)에서 제공 */}
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
          {/* 모바일 — 사이드바 드로어를 여는 햄버거. PublicHeader 와 동일하게 우측 끝에 배치 */}
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={onMenuOpen}
            className="rounded p-1.5 text-muted transition-colors hover:text-primary-600 md:hidden"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>
        </div>
      </div>
      {/* 모바일 — 돋보기 탭 시 펼쳐지는 검색바 */}
      {searchOpen && (
        <form onSubmit={handleSearch} className="px-4 pb-3 md:hidden">
          <SearchField query={query} onQueryChange={setQuery} inputClassName="py-2.5" autoFocus />
        </form>
      )}
    </header>
  )
}

// 모바일(<md) 사이드바 드로어 — 모달 다이얼로그로 동작한다.
// Esc·백드롭·메뉴 링크 클릭으로 닫히고, 열려 있는 동안 Tab 포커스는 드로어 안에 머문다(useDialog).
function MobileDrawer({ onClose }: { onClose: () => void }) {
  const dialogRef = useDialog<HTMLDivElement>(onClose)

  return (
    <div className="fixed inset-0 z-30 md:hidden">
      <div
        className="absolute inset-0 bg-black/40 motion-safe:animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* 햄버거 버튼이 우측에 있으므로 드로어도 오른쪽에서 슬라이드 */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
        className="absolute inset-y-0 right-0 flex w-56 flex-col bg-bg shadow-xl motion-safe:animate-slide-in-right"
      >
        {/* 드로어 안에서 메뉴(링크)를 누르면 드로어를 닫는다 — 이벤트 위임 */}
        <div
          className="flex min-h-0 flex-1 overflow-y-auto"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) onClose()
          }}
        >
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

// 공통 레이아웃 셸 — 상단바 + 왼쪽 메뉴 + 본문(Outlet) + 우측 바.
// 보호 라우트 하위의 레이아웃 라우트로 사용 (routes/router.tsx 참고).
// 우측 바는 홈(전체 뉴스 구간)과 기사 리더에서만 보인다 — 아래 hasRightBar 참고.
// 모바일(<md): 사이드바는 고정 컬럼 대신 햄버거로 여는 오프캔버스 드로어로 전환.
function AppShell() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  // 우측 바는 홈과 기사 리더에서 쓴다. 단, 홈에서 추천 뉴스(첫 화면)를 보는 동안에는 접어서
  // 추천 뉴스가 그 폭까지 쓰게 하고, 전체 뉴스로 내려가거나 기사를 열면 다시 튀어나온다.
  const hasRightBar = isHome || location.pathname.startsWith('/article/')
  const isHeroActive = useHomeViewStore((state) => state.isHeroActive)
  const isRightBarCollapsed = isHome && isHeroActive
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // 회원가입 직후 1회 뜨는 온보딩 팝업 — SignupPage 가 심어둔 플래그로 판단한다.
  const [showOnboarding, setShowOnboarding] = useState(() => isOnboardingPending())

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      {/* 키보드 사용자용 — Tab 첫 번째에서만 보이고, 누르면 메뉴를 건너뛰어 본문으로 간다 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-primary"
      >
        본문으로 건너뛰기
      </a>
      <TopBar onMenuOpen={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        {/* 데스크톱 — 상시 노출 사이드바. 모바일에서는 드로어로 대체.
            상단바(--header-h) 바로 아래에 고정되어 스크롤해도 따라온다 */}
        <div className="sticky top-[var(--header-h)] hidden h-[calc(100dvh-var(--header-h))] self-start md:flex">
          <Sidebar />
        </div>
        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 p-4 focus:outline-none md:p-6"
        >
          <Outlet />
        </main>
        {hasRightBar && (
          // 바깥: 폭을 0 ↔ w-64 로 바꿔 본문이 넓어지고 좁아지게 한다. 안쪽: 튀어 오르며(pop) 나타난다.
          // overflow-clip: hidden 과 달리 스크롤 컨테이너를 만들지 않아 안쪽 RightBar 의 sticky 가 동작한다.
          // 접힌 동안에는 inert 로 포커스·스크린리더에서 빼 둔다. 짝: RightBar 의 hidden lg:block
          <div
            inert={isRightBarCollapsed}
            className={`hidden shrink-0 overflow-clip transition-[width] duration-500 ease-out motion-reduce:transition-none lg:block ${
              isRightBarCollapsed ? 'w-0' : 'w-64'
            }`}
          >
            <div
              className={`h-full w-64 border-l border-line bg-bg transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
                isRightBarCollapsed ? 'translate-x-8 scale-95 opacity-0' : 'opacity-100'
              }`}
            >
              <RightBar />
            </div>
          </div>
        )}
      </div>
      <Footer />

      {/* 회원가입 완료 온보딩 팝업 (1회성) */}
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}

      {/* 모바일 — 오프캔버스 드로어 + 백드롭 */}
      {sidebarOpen && <MobileDrawer onClose={() => setSidebarOpen(false)} />}
    </div>
  )
}

export default AppShell
