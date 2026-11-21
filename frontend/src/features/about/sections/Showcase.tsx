import { useState, type ReactNode } from 'react'
import { cn } from '../../../lib/cn'
import BrowserMockup from '../BrowserMockup'
import { SHOWCASE, type ShowcaseScreen } from '../content'
import { reduceMotion, useScrollProgress } from '../motion'
import { ArticleScreen, CollectScreen, LevelScreen, ParaphraseScreen } from '../screens'
import { Lines } from './parts'

// 2. 기능 소개 — 브라우저 화면을 화면에 고정해 두고, 스크롤하는 동안 설명과 화면 속 예시가 한 단계씩 바뀐다.
// 단계 수만큼 긴 구간(단계마다 화면 한 장 높이)을 만들고, 그 안에서 지나온 비율로 지금 단계를 정한다.

// content.ts 의 screen 이름과 실제 화면을 잇는 표. interactive: 화면 속을 눌러 볼 수 있는 화면
const SCREENS: Record<
  ShowcaseScreen,
  { render: () => ReactNode; path: string; interactive?: boolean }
> = {
  article: { render: () => <ArticleScreen />, path: '/article/kospi-2650' },
  paraphrase: {
    render: () => <ParaphraseScreen />,
    path: '/article/kospi-2650',
    interactive: true,
  },
  level: { render: () => <LevelScreen />, path: '/settings', interactive: true },
  collect: { render: () => <CollectScreen />, path: '/vocab' },
}

const STEPS = SHOWCASE.length

function Showcase() {
  const [active, setActive] = useState(0)
  const ref = useScrollProgress<HTMLElement>('pin', (progress) =>
    setActive(Math.min(STEPS - 1, Math.floor(progress * STEPS))),
  )

  // 단계 점을 누르면 그 단계의 가운데로 스크롤
  function goTo(index: number) {
    const element = ref.current
    if (!element) return
    const start = element.getBoundingClientRect().top + window.scrollY
    const span = element.offsetHeight - window.innerHeight
    window.scrollTo({
      top: start + (span * (index + 0.5)) / STEPS,
      behavior: reduceMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <section
      ref={ref}
      className="relative mt-24 md:mt-36"
      style={{ height: `${STEPS * 100}svh` }}
      aria-label="주요 기능"
    >
      {/* 상단바(h-16) 아래에 고정 */}
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col items-center gap-6 overflow-hidden px-6 pb-6 pt-6 md:flex-row md:justify-center md:gap-16 md:px-10 md:pb-0 md:pt-0">
        {/* 브라우저 화면: 좁은 화면에서는 위, 넓은 화면에서는 오른쪽 */}
        <div className="flex min-h-0 w-full flex-1 items-center justify-center md:order-2 md:max-w-2xl md:flex-none">
          <div className="about-showcase-device w-full">
            <BrowserMockup
              path={SCREENS[SHOWCASE[active].screen].path}
              className="h-[min(46svh,400px)] md:h-[420px]"
            >
              {SHOWCASE.map((step, index) => {
                const screen = SCREENS[step.screen]
                const shown = index === active
                const usable = shown && screen.interactive
                return (
                  <div
                    key={step.key}
                    className={cn(
                      'absolute inset-0 overflow-y-auto transition-opacity duration-500 motion-reduce:transition-none',
                      shown ? 'opacity-100' : 'opacity-0',
                    )}
                    // 보이지 않는 화면과 눌러 볼 수 없는 화면은 키보드와 화면 낭독기가 건너뛴다
                    inert={!usable}
                    aria-hidden={!usable}
                    role={usable ? 'group' : undefined}
                    aria-label={usable ? `${step.label} 화면 예시` : undefined}
                  >
                    {screen.render()}
                  </div>
                )
              })}
            </BrowserMockup>
          </div>
        </div>

        {/* 설명: 단계마다 같은 자리에 겹쳐 두고 지금 단계만 보이게 */}
        <div className="w-full max-w-md flex-none md:order-1 md:w-80">
          <div className="relative h-44 md:h-72">
            {SHOWCASE.map((step, index) => (
              <div
                key={step.key}
                className={cn(
                  'absolute inset-0 flex flex-col justify-center transition-[opacity,transform] duration-500 motion-reduce:transition-none',
                  index === active ? 'opacity-100' : 'pointer-events-none opacity-0',
                  index > active && 'translate-y-6 motion-reduce:translate-y-0',
                  index < active && '-translate-y-6 motion-reduce:translate-y-0',
                )}
              >
                <p className="text-xs font-bold tabular-nums text-primary-600">
                  {String(index + 1).padStart(2, '0')} {step.label}
                </p>
                <h3 className="mt-2 text-xl font-bold leading-snug tracking-tight text-ink md:mt-3 md:text-3xl">
                  <Lines text={step.title} />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted md:mt-4 md:text-base">
                  {step.body}
                </p>
                {step.hint && (
                  <p className="mt-3 text-sm font-semibold text-primary-700">{step.hint}</p>
                )}
              </div>
            ))}
          </div>

          {/* 단계 점: 지금 단계는 길게. 누르면 그 단계로 이동 */}
          <div className="mt-4 flex gap-2 md:mt-8" role="tablist" aria-label="기능 단계">
            {SHOWCASE.map((step, index) => (
              <button
                key={step.key}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`${index + 1}번째: ${step.label}`}
                className="flex h-6 items-center"
                onClick={() => goTo(index)}
              >
                <i
                  className={cn(
                    'block h-1.5 rounded-full transition-[width,background-color] duration-300',
                    index === active ? 'w-8 bg-primary-600' : 'w-3 bg-line',
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Showcase
