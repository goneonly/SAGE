import Logo from './Logo'
import { AI_DISCLAIMER } from '../lib/aiDisclaimer'

// 하단 바 — 앱 셸에 어울리게 슬림하게: 로고 + 슬로건 왼쪽, 바로가기 오른쪽, 아래 고지문 + copyright.
// href 가 정해진 항목만 <a>로 렌더링하고, 나머지는 주소가 정해질 때까지 텍스트로 둔다.
const FOOTER_LINKS: { label: string; href?: string }[] = [
  { label: '회사' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/feed/' },
  { label: 'GitHub', href: 'https://github.com/goneonly/SAGE' },
]

function Footer() {
  return (
    <footer className="border-t border-line bg-bg py-5">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-3">
          <Logo size={24} wordmarkClassName="text-base" />
          <span className="text-xs italic text-muted">Be a smart investor with SAGE.</span>
        </div>

        <ul className="flex items-center gap-5">
          {FOOTER_LINKS.map(({ label, href }) => (
            <li key={label}>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted transition-colors hover:text-primary-600 hover:underline"
                >
                  {label}
                </a>
              ) : (
                <span className="cursor-default text-xs text-muted transition-colors hover:text-primary-600">
                  {label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* AI 생성 콘텐츠 고지 — 서비스 전 화면 공통이므로 하단 바에 상시 노출 */}
      <div className="mx-auto mt-3 flex max-w-7xl flex-col gap-1 px-4 text-center text-[11px] leading-relaxed text-subtle sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-6 sm:text-left lg:px-8">
        <p>{AI_DISCLAIMER}</p>
        <p className="shrink-0">© 2026 SAGE. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
