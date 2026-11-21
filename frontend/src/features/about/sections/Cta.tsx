import { CTA } from '../content'
import Reveal from '../Reveal'
import { SectionTitle, StartButton } from './parts'

// 6. 마무리 — 브랜드 다크 밴드 위 마지막 인상: AI 고지와 한 번 더 시작 버튼
function Cta() {
  return (
    <section className="bg-bg-dark px-6 py-24 text-center md:py-36">
      <Reveal>
        <SectionTitle text={CTA.title} className="text-white md:text-5xl" />
      </Reveal>
      <Reveal delay={100}>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/70">{CTA.body}</p>
      </Reveal>
      <Reveal delay={200} className="mt-10">
        <StartButton>{CTA.cta}</StartButton>
      </Reveal>
    </section>
  )
}

export default Cta
