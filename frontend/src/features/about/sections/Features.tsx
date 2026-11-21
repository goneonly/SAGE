import Icon from '../../../components/Icon'
import { FEATURES } from '../content'
import Reveal from '../Reveal'
import { SectionTitle } from './parts'

// 5. 기능 목록 — 카드 격자. 화면에 들어오면 차례로 떠오르고, 마우스를 올리면 살짝 떠오른다.
// 아이콘은 앱 공용 채움형 세트(components/Icon)만 쓴다.
function Features() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-36">
      <Reveal className="text-center">
        <SectionTitle text={FEATURES.title} />
      </Reveal>
      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {FEATURES.items.map((item, index) => (
          <Reveal key={item.title} delay={(index % 3) * 120}>
            <div className="h-full rounded-2xl border border-line bg-surface p-6 transition-[transform,border-color] duration-300 hover:border-primary-600 motion-safe:hover:-translate-y-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-base font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default Features
