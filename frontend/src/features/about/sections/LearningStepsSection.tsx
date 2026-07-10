import Reveal from '../Reveal'

const LEARNING_STEPS = [
  {
    title: '읽으면서 바로 이해',
    description:
      '기사 속 어려운 용어를 AI가 짚어주고, 클릭하면 그 자리에서 내 레벨에 맞게 설명해줘요.',
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

// 4. 학습 사이클 — 브랜드 다크 밴드(토스식 다크 섹션) 위 3단계 스텝.
function LearningStepsSection() {
  return (
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
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LearningStepsSection
