import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import Logo from './Logo'

// 로그아웃 상태의 공개 화면(About·공지사항)이 공유하는 상단 바.
// 좌측: 로고(→ About) + 공지사항(→ 공지사항 페이지), 우측: 로그인/회원가입 (로그인 시 홈으로).
// 모바일(<sm): 좌우 10%/5% 여백 제거, 공지사항은 더보기(햄버거) 메뉴로 수납,
// 로고 + 회원가입 CTA 를 최우선으로 남긴다.
function PublicHeader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur-[10px]">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6 sm:ml-[10%]">
          {/* 로고·워드마크 클릭 시 About 랜딩으로 리디렉션 */}
          <Link to="/about" aria-label="서비스 소개로 이동" className="shrink-0">
            <Logo size={32} wordmarkClassName="text-xl" />
          </Link>
          {/* 공지사항 — 모바일에서는 숨기고(omit) 더보기 메뉴로 이동 */}
          <Link
            to="/notices"
            className="ml-5 hidden whitespace-nowrap text-m font-semibold text-muted transition-colors hover:text-primary-600 sm:block"
          >
            공지사항
          </Link>
        </div>
        <div className="flex items-center gap-1 sm:mr-[5%] sm:gap-2">
          {isAuthenticated ? (
            <Link
              to="/"
              className="whitespace-nowrap rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600/90 sm:px-5"
            >
              홈으로 가기
            </Link>
          ) : (
            <>
              {/* 로그인 — 모바일에서는 여백을 줄인 텍스트 버튼으로 collapse */}
              <Link
                to="/login"
                className="whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold text-ink transition hover:bg-primary-50 sm:px-4"
              >
                로그인
              </Link>
              {/* 회원가입 — 핵심 CTA, 최저 폭에서도 유지 */}
              <Link
                to="/signup"
                className="whitespace-nowrap rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600/90 sm:px-5"
              >
                회원가입 하기
              </Link>
            </>
          )}
          {/* 모바일 전용 더보기 — 공지사항 등 부가 메뉴 진입점 */}
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded p-2 text-muted transition-colors hover:text-primary-600 sm:hidden"
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
        </div>
      </div>
      {/* 모바일 더보기 드롭다운 — 공지사항 수납 */}
      {menuOpen && (
        <nav className="border-t border-line px-4 py-2 sm:hidden">
          <Link
            to="/notices"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-primary-50 hover:text-ink"
          >
            공지사항
          </Link>
        </nav>
      )}
    </header>
  )
}

export default PublicHeader
