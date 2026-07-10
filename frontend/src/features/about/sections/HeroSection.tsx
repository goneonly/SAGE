import Reveal from '../Reveal'

// 1. 히어로 — 큰 타이포 + 슬로건. About 랜딩의 첫인상.
function HeroSection() {
  return (
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
  )
}

export default HeroSection
