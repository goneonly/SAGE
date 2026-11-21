import BrowserMockup from '../BrowserMockup'
import { HERO } from '../content'
import Reveal from '../Reveal'
import { useScrollProgress, useTilt } from '../motion'
import { ParaphraseScreen } from '../screens'
import { Lines, StartButton } from './parts'

// 1. 첫 화면 — 큰 제목과 시작 버튼, 그 아래 뒤로 누워 있다가 스크롤하면 일어서는 브라우저 화면.
// 마우스를 따라 화면이 살짝 기울어진다(useTilt). 화면 속은 설명 패널이 열린 기사 예시.
function Hero() {
  const tiltRef = useTilt<HTMLElement>() // 마우스 위치 — 구간 전체에서 받아 화면까지 내려감
  const deviceRef = useScrollProgress('enter')

  return (
    <section ref={tiltRef} className="px-6 pt-20 text-center md:pt-28">
      <Reveal eager>
        <p className="text-sm font-semibold tracking-wide text-primary-600">{HERO.eyebrow}</p>
      </Reveal>
      <Reveal eager delay={100}>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">
          <Lines text={HERO.title} />
        </h1>
      </Reveal>
      <Reveal eager delay={200}>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          {HERO.body}
        </p>
      </Reveal>
      <Reveal eager delay={300} className="mt-9 flex flex-col items-center gap-3">
        <StartButton>{HERO.cta}</StartButton>
        <span className="text-sm text-subtle">{HERO.note}</span>
      </Reveal>

      {/* 바깥 칸으로 스크롤 위치를 재고(기울어지기 전 자리 기준), 안쪽 칸을 기울인다 */}
      <div ref={deviceRef} className="mx-auto mt-14 w-full max-w-3xl" aria-hidden="true">
        <div className="about-hero-device">
          <BrowserMockup path="/article/kospi-2650" className="h-[440px] md:h-[380px]">
            <div inert className="h-full">
              <ParaphraseScreen initial="netbuy" />
            </div>
          </BrowserMockup>
        </div>
      </div>
    </section>
  )
}

export default Hero
