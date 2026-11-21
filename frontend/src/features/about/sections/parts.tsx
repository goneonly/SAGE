import { Link } from 'react-router-dom'
import { useAuthStore } from '../../../lib/store/authStore'
import { cn } from '../../../lib/cn'

// 소개 페이지 구간들이 함께 쓰는 작은 부품

/** 여러 줄 제목: ['첫 줄', '둘째 줄'] 을 줄바꿈으로 이어 준다 */
export function Lines({ text }: { text: string[] }) {
  return text.map((line, index) => (
    <span key={line} className="block">
      {line}
      {index < text.length - 1 && <span className="sr-only"> </span>}
    </span>
  ))
}

/** 구간 제목 (큰 글자 두 줄) */
export function SectionTitle({ text, className }: { text: string[]; className?: string }) {
  return (
    <h2
      className={cn(
        'text-3xl font-bold leading-snug tracking-tight text-ink md:text-4xl',
        className,
      )}
    >
      <Lines text={text} />
    </h2>
  )
}

/** 시작 버튼 — 로그인 상태면 홈(추천 뉴스)으로, 아니면 회원가입으로 */
export function StartButton({ children }: { children: string }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return (
    <Link
      to={isAuthenticated ? '/' : '/signup'}
      className="inline-block rounded-full bg-primary-600 px-8 py-3 text-base font-semibold text-on-primary transition hover:bg-primary-600/90"
    >
      {children}
    </Link>
  )
}
