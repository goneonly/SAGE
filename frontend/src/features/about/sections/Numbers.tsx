import { NUMBERS } from '../content'
import Reveal, { CountUp } from '../Reveal'
import { SectionTitle } from './parts'

// 3. 숫자 — 화면에 들어오면 0 에서 올라가는 큰 숫자 세 개
function Numbers() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 text-center md:px-10 md:py-36">
      <Reveal>
        <SectionTitle text={NUMBERS.title} />
      </Reveal>
      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
        {NUMBERS.items.map((item, index) => (
          <Reveal
            key={item.label}
            delay={index * 120}
            className="rounded-2xl border border-line bg-surface px-6 py-10"
          >
            <div className="text-6xl font-bold tracking-tight text-ink">
              <CountUp to={item.value} />
              <span className="ml-1 text-2xl text-primary-600">{item.unit}</span>
            </div>
            <p className="mt-4 text-sm text-muted">{item.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default Numbers
