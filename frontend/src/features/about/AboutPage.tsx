import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../lib/store/authStore'
import Logo from '../../components/Logo'
import Footer from '../../components/Footer'

// About — SAGE 서비스 소개이자 로그아웃 상태의 랜딩 페이지(공개 라우트).
// 토스(toss.im)식 스크롤 반응형: 큰 타이포 + 넉넉한 여백의 풀폭 섹션들이 스크롤에 따라
// 아래에서 떠오르며(fade + rise) 순차(stagger)로 나타난다.
// IntersectionObserver 로 뷰포트 진입을 감지해 한 번만 재생한다.

interface RevealProps {
  children: ReactNode
  /** 형제 요소끼리 시차를 주는 지연(ms) — 토스식 스태거 연출 */
  delay?: number
  className?: string
}

function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// 레벨별 설명 미리보기 — 같은 용어(코스피)가 레벨에 따라 어떻게 달라지는지 발췌
const LEVEL_PREVIEWS = [
  {
    level: '초보',
    text: '우리나라 주식시장의 "건강 점수판" 같은 것. 이 숫자가 오르면 대체로 시장 전체가 좋아졌다는 뜻.',
  },
  {
    level: '중급',
    text: '유가증권시장 전체 종목의 시가총액을 기준 시점(1980년=100)과 비교해 산출하는 시가총액 가중 지수.',
  },
  {
    level: '고급',
    text: '시총 가중이라 대형주 쏠림이 크고, 코스피200 선물·옵션 베이시스를 함께 봐야 방향성 판단이 정확함.',
  },
]

const LEARNING_STEPS = [
  {
    title: '읽으면서 바로 이해',
    description: '기사 속 어려운 용어를 AI가 짚어주고, 클릭하면 그 자리에서 내 레벨에 맞게 설명해줘요.',
  },
  {
    title: '모아서 내 것으로',
    description: '중요한 기사는 스크랩, 새로 배운 용어는 단어장에. 흩어진 배움이 자산으로 쌓여요.',
  },
  {
    title: '매일 조금씩 성장',
    description: '오늘의 주식 단어와 AI 투자 인사이트로 하루 5분, 투자 감각을 길러요.',
  },
]

function AboutPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* 상단 바 — 로고 + (로그아웃 상태) 로그인/회원가입, (로그인 상태) 홈으로 */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-bg/90 px-6 backdrop-blur-[10px]">
        <Logo size={32} wordmarkClassName="text-xl" />
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link
              to="/"
              className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-600/90"
            >
              홈으로 가기
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition hover:bg-primary-50"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-600/90"
              >
                회원가입 하기
              </Link>
            </>
          )}
        </div>
      </header>

      {/* 1. 히어로 — 큰 타이포 + 슬로건 */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-primary-600">
            SAGE — Smart AI Guidance for Economics
          </p>
        </Reveal>
        <Reveal delay={150}>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-ink md:text-6xl">
            어려운 금융 뉴스,
            <br />
            나에게 맞는 언어로.
          </h1>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            SAGE는 사용자 맞춤형 AI 금융 뉴스 학습 플랫폼이에요.
            <br />
            뉴스를 읽는 것만으로 투자 공부가 되도록, AI가 당신의 눈높이에 맞춰드려요.
          </p>
        </Reveal>
        <Reveal delay={450}>
          <p className="mt-10 text-lg font-semibold italic text-primary-600">
            Be A Smart Investor with SAGE!
          </p>
        </Reveal>
        <Reveal delay={600} className="mt-16">
          <div aria-hidden="true" className="animate-bounce text-2xl text-subtle">
            ↓
          </div>
        </Reveal>
      </section>

      {/* 2. 스마트 하이라이트 */}
      <section className="bg-bg-alt px-6 py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-3xl font-bold leading-snug text-ink md:text-4xl">
              읽다가 막히는 순간,
              <br />
              AI가 짚어드려요.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted">
              &ldquo;이 단어에 설명이 필요할까?&rdquo; — SAGE의 판단 근거 엔진이 용어의 난이도와
              문맥을 따져 꼭 필요한 곳에만 하이라이트를 켜요.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-line bg-surface p-8 text-left shadow-eco-hover">
              <p className="text-base leading-loose text-ink">
                코스피 지수가 외국인{' '}
                <span className="rounded bg-primary-100 px-1 font-medium text-primary-700 underline decoration-primary-700 decoration-2 underline-offset-2">
                  순매수
                </span>
                에 힘입어 2650선을 회복했다...
              </p>
              <div className="mt-5 rounded-xl border border-line bg-bg p-4">
                <p className="text-sm font-bold text-ink">순매수</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  일정 기간 동안 산 금액이 판 금액보다 많다는 뜻. &ldquo;누가 사고 있는지&rdquo;를
                  보여주는 수급 지표로 쓰임.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. 레벨 맞춤 설명 */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="text-3xl font-bold leading-snug text-ink md:text-4xl">
              같은 뉴스도,
              <br />내 레벨에 맞는 설명으로.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 text-base leading-relaxed text-muted">
              초보·중급·고급 — 같은 용어도 당신이 고른 레벨에 따라 완전히 다르게 읽혀요.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
            {LEVEL_PREVIEWS.map((preview, index) => (
              <Reveal key={preview.level} delay={index * 150}>
                <div className="h-full rounded-2xl border border-line bg-surface p-6">
                  <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                    {preview.level}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-ink">{preview.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 학습 사이클 — 브랜드 다크 밴드(토스식 다크 섹션) */}
      <section className="bg-bg-dark px-6 py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-center text-3xl font-bold leading-snug text-white md:text-4xl">
              뉴스가 공부가 되는
              <br />
              가장 자연스러운 방법.
            </h2>
          </Reveal>
          <div className="mt-14 space-y-10">
            {LEARNING_STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 150}>
                <div className="flex items-start gap-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-base font-bold text-primary-500">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 신뢰 고지 + CTA */}
      <section className="px-6 py-28 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold leading-snug text-ink md:text-5xl">
            Be A Smart Investor
            <br />
            with SAGE!
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted">
            SAGE의 설명과 인사이트는 AI가 생성해요. 투자 결정은 반드시 본인의 판단과 책임하에
            진행해 주세요.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <Link
            to={isAuthenticated ? '/' : '/signup'}
            className="mt-10 inline-block rounded-full bg-primary-600 px-8 py-3 text-base font-semibold text-white shadow-eco-btn transition hover:bg-primary-600/90"
          >
            지금 시작하기
          </Link>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
}

export default AboutPage
