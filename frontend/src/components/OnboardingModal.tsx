import { useState, type ReactElement } from 'react'
import { markOnboardingDone } from '../lib/onboarding'

// 회원가입 완료 후 홈 화면 위에 1회 뜨는 온보딩 팝업.
// 3개 슬라이드(하이라이트 → 레벨별 설명 → 단어장·포트폴리오)를 "다음" 버튼으로 넘기고,
// 마지막 슬라이드에서 "확인"을 누르면 다시 뜨지 않는다(localStorage 플래그).

// 슬라이드별 미니 화면 목업 — 실제 앱 분위기(라이트 + 브랜드 그린)를 SVG로 그린다.
function HighlightPreview() {
  return (
    <svg viewBox="0 0 240 130" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="240" height="130" rx="8" className="fill-bg" />
      <rect x="14" y="14" width="140" height="10" rx="3" className="fill-ink" opacity="0.75" />
      <rect x="14" y="34" width="212" height="6" rx="3" className="fill-line" />
      <rect
        x="14"
        y="48"
        width="70"
        height="8"
        rx="4"
        className="fill-primary-500"
        opacity="0.35"
      />
      <rect x="90" y="48" width="136" height="6" rx="3" className="fill-line" />
      <rect x="14" y="62" width="212" height="6" rx="3" className="fill-line" />
      <rect
        x="14"
        y="76"
        width="90"
        height="8"
        rx="4"
        className="fill-primary-500"
        opacity="0.35"
      />
      <rect x="110" y="76" width="80" height="6" rx="3" className="fill-line" />
      <rect x="14" y="90" width="160" height="6" rx="3" className="fill-line" />
      <rect x="14" y="104" width="212" height="6" rx="3" className="fill-line" />
    </svg>
  )
}

function ParaphrasePreview() {
  return (
    <svg viewBox="0 0 240 130" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="240" height="130" rx="8" className="fill-bg" />
      <rect x="14" y="14" width="120" height="6" rx="3" className="fill-line" />
      <rect
        x="14"
        y="28"
        width="60"
        height="8"
        rx="4"
        className="fill-primary-500"
        opacity="0.35"
      />
      <rect x="14" y="46" width="212" height="66" rx="8" className="fill-surface" />
      <rect
        x="14"
        y="46"
        width="212"
        height="66"
        rx="8"
        className="fill-none stroke-primary-500"
        strokeWidth="1.5"
      />
      <rect x="26" y="58" width="52" height="10" rx="5" className="fill-primary-600" />
      <rect x="26" y="76" width="188" height="6" rx="3" className="fill-line" />
      <rect x="26" y="90" width="150" height="6" rx="3" className="fill-line" />
    </svg>
  )
}

function VocabPreview() {
  return (
    <svg viewBox="0 0 240 130" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="240" height="130" rx="8" className="fill-bg" />
      <rect x="14" y="14" width="100" height="10" rx="3" className="fill-ink" opacity="0.75" />
      <rect x="14" y="34" width="212" height="26" rx="6" className="fill-surface" />
      <rect
        x="24"
        y="42"
        width="56"
        height="9"
        rx="4"
        className="fill-primary-600"
        opacity="0.85"
      />
      <rect x="90" y="44" width="120" height="6" rx="3" className="fill-line" />
      <rect x="14" y="66" width="212" height="26" rx="6" className="fill-surface" />
      <rect
        x="24"
        y="74"
        width="44"
        height="9"
        rx="4"
        className="fill-primary-600"
        opacity="0.85"
      />
      <rect x="78" y="76" width="132" height="6" rx="3" className="fill-line" />
      <rect
        x="14"
        y="98"
        width="212"
        height="18"
        rx="6"
        className="fill-primary-500"
        opacity="0.2"
      />
      <rect
        x="24"
        y="104"
        width="90"
        height="6"
        rx="3"
        className="fill-primary-600"
        opacity="0.7"
      />
    </svg>
  )
}

const SLIDES: { title: string; description: string; Preview: () => ReactElement }[] = [
  {
    title: '어려운 용어는 하이라이트로',
    description: '뉴스 기사 속 어려운 금융 용어를 자동으로 하이라이트해 드려요.',
    Preview: HighlightPreview,
  },
  {
    title: '클릭 한 번, 내 수준에 맞게',
    description: '하이라이트를 누르면 내 투자 이해도에 맞춘 쉬운 설명으로 바꿔 드려요.',
    Preview: ParaphrasePreview,
  },
  {
    title: '단어장과 포트폴리오까지',
    description: '배운 용어는 단어장에, 관심 종목은 포트폴리오에 차곡차곡 쌓여요.',
    Preview: VocabPreview,
  },
]

function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const isLast = index === SLIDES.length - 1
  const { title, description, Preview } = SLIDES[index]

  function handleDone() {
    markOnboardingDone()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="SAGE 시작 안내"
        className="w-full max-w-sm rounded-xl border border-line bg-surface p-6 shadow-xl"
      >
        <div className="h-40 overflow-hidden rounded-lg border border-line">
          <Preview />
        </div>
        <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-muted">{description}</p>

        <div className="mt-5 flex items-center justify-between">
          {/* 왼쪽 하단 — 진행 점 인디케이터 */}
          <div className="flex gap-1.5" aria-label={`${index + 1} / ${SLIDES.length}`}>
            {SLIDES.map((slide, i) => (
              <span
                key={slide.title}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-4 bg-primary-600' : 'w-1.5 bg-line'
                }`}
              />
            ))}
          </div>
          {/* 오른쪽 하단 — 다음 / 마지막 슬라이드에선 확인 */}
          {isLast ? (
            <button
              type="button"
              onClick={handleDone}
              className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-600/90"
            >
              확인
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIndex((i) => i + 1)}
              className="rounded-lg border border-line px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-bg"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal
