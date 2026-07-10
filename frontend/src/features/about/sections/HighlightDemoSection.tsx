import Reveal from '../Reveal'

// 2. 스마트 하이라이트 — 기사 속 용어가 어떻게 짚이는지 정적 데모로 보여준다.
function HighlightDemoSection() {
  return (
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
  )
}

export default HighlightDemoSection
