import { useEffect, useState, type FormEvent } from 'react'
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
import SidebarToggle from './SidebarToggle'
import { useSidebarStore } from '../lib/store/sidebarStore'

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

function TopBar() {
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
    // 사이드바 폭(x=224px)에 맞춘다. 모바일: h-16, 로고 + 돋보기 + 알림벨만 남기고
    // 검색창(인라인)·사용자명은 omit(검색 토글로 이동). 메뉴 버튼은 상단바가 아니라 각 화면 제목 아래(SidebarToggle).
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

// 왼쪽 사이드바(메뉴) — 모든 폭에서 본문을 밀지 않고 위에 겹쳐 열린다(기본은 닫힘).
// 배경은 반투명하고 오른쪽 끝으로 갈수록 점점 투명해져, 아래 본문(신문 지면 등)이 비쳐 보인다.
// 닫기: 맨 위 메뉴 버튼 · Esc · 바깥 클릭 · 메뉴 링크 클릭 · 화면 이동. 본문을 계속 쓸 수 있는 패널이라 포커스는 가두지 않는다.
function SidebarOverlay() {
  const isOpen = useSidebarStore((state) => state.isOpen)
  const close = useSidebarStore((state) => state.close)
  const location = useLocation()
  const panelRef = useDialog<HTMLDivElement>(close, {
    enabled: isOpen,
    trapFocus: false,
    lockScroll: false,
  })

  // 다른 화면으로 이동하면 닫는다
  useEffect(() => {
    close()
  }, [location.pathname, close])

  // 바깥(본문)을 누르면 닫는다 — 제목 아래 여닫기 버튼은 자기 onClick 으로 처리하므로 제외
  useEffect(() => {
    if (!isOpen) return
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement
      if (panelRef.current?.contains(target) || target.closest('[data-sidebar-toggle]')) return
      close()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen, close, panelRef])

  return (
    <div
      ref={panelRef}
      id="app-sidebar"
      tabIndex={-1}
      aria-label="메뉴"
      inert={!isOpen}
      // 상단바 바로 아래부터 화면 아래까지 고정. 열릴 때 왼쪽에서 미끄러지며 나타난다.
      // z-20: 상단바(z-30) 아래, 본문 위
      className={`fixed bottom-0 left-0 top-[var(--header-h)] z-20 flex w-72 flex-col transition-[opacity,transform] duration-300 ease-out focus:outline-none motion-reduce:transition-none ${
        isOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-8 opacity-0'
      }`}
    >
      {/* 반투명 배경 — mask-image 로 오른쪽 45% 구간이 점점 투명해진다(흐림 효과도 같이 옅어진다) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-bg/85 backdrop-blur-md [mask-image:linear-gradient(to_right,#000_55%,transparent)]"
      />
      {/* 열린 상태의 여닫기 버튼 — 제목 아래 버튼이 사이드바에 가려지므로 맨 위에 하나 더 둔다 */}
      <div className="relative px-4 pt-4">
        <SidebarToggle />
      </div>
      {/* 메뉴 링크를 누르면 닫는다(같은 화면 링크는 화면 이동이 없으므로) — 이벤트 위임 */}
      <div
        className="relative flex min-h-0 flex-1"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) close()
        }}
      >
        <Sidebar />
      </div>
    </div>
  )
}

// 공통 레이아웃 셸 — 상단바 + 왼쪽 메뉴 + 본문(Outlet) + 우측 바.
// 보호 라우트 하위의 레이아웃 라우트로 사용 (routes/router.tsx 참고).
// 우측 바는 홈(전체 뉴스 구간)과 기사 리더에서만 보인다 — 아래 hasRightBar 참고.
// 왼쪽 메뉴는 고정 컬럼이 아니라 겹쳐 열리는 SidebarOverlay(모든 폭 공통).
function AppShell() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  // 우측 바는 홈과 기사 리더에서 쓴다. 단, 홈에서 추천 뉴스(첫 화면)를 보는 동안에는 접어서
  // 추천 뉴스가 그 폭까지 쓰게 하고, 전체 뉴스로 내려가거나 기사를 열면 다시 튀어나온다.
  const hasRightBar = isHome || location.pathname.startsWith('/article/')
  const isHeroActive = useHomeViewStore((state) => state.isHeroActive)
  const isRightBarCollapsed = isHome && isHeroActive
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
      <TopBar />
      <div className="flex flex-1">
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

      <SidebarOverlay />
    </div>
  )
}

export default AppShell
