import { useRef, useState } from 'react'
import Icon from '../../../components/Icon'
import { cn } from '../../../lib/cn'
import { COMPARE } from '../content'
import Reveal from '../Reveal'
import { SectionTitle } from './parts'

// 4. 원문 ↔ SAGE 비교 — 같은 자리에 원문 카드와 SAGE 설명 카드를 겹쳐 두고, 가운데 선을 끌어 비교한다.
// 아래에는 원문, 위에는 SAGE 카드를 깔고, 위 카드를 선의 오른쪽만 보이게 잘라 낸다(clip-path).
function Compare() {
  // 선의 위치(0~100%). 선 왼쪽은 원문, 오른쪽은 SAGE — 처음에는 원문이 거의 다 보이게 오른쪽에서 시작
  const [split, setSplit] = useState(85)
  const [focused, setFocused] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  function moveTo(clientX: number) {
    const box = boxRef.current
    if (!box) return
    const rect = box.getBoundingClientRect()
    setSplit(Math.round(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))))
  }

  // 두 카드는 같은 칸(grid-area 1/1)에 겹쳐 높이가 긴 쪽에 맞춰진다
  const card = 'rounded-2xl border border-line p-6 [grid-area:1/1] md:p-8'

  return (
    <section className="bg-bg-alt px-6 py-24 md:py-36">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row md:gap-16">
        <Reveal className="max-w-sm text-center md:text-left">
          <SectionTitle text={COMPARE.title} />
          <p className="mt-4 text-base leading-relaxed text-muted">{COMPARE.body}</p>
        </Reveal>

        <Reveal delay={150} className="w-full max-w-xl">
          <div
            ref={boxRef}
            className="relative cursor-ew-resize touch-pan-y select-none"
            onPointerDown={(event) => {
              dragging.current = true
              event.currentTarget.setPointerCapture(event.pointerId)
              moveTo(event.clientX)
            }}
            onPointerMove={(event) => {
              if (dragging.current) moveTo(event.clientX)
            }}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            <div className="grid" aria-hidden="true">
              <div className={cn(card, 'bg-surface')}>
                <p className="text-xs font-bold text-muted">{COMPARE.left}</p>
                <p className="mt-3 text-base leading-loose text-ink">{COMPARE.original}</p>
              </div>
              <div
                className={cn(card, 'border-primary-600 bg-primary-50')}
                style={{ clipPath: `inset(0 0 0 ${split}%)` }}
              >
                <p className="text-xs font-bold text-primary-700">{COMPARE.right}</p>
                <p className="mt-3 text-base leading-loose text-ink">{COMPARE.paraphrased}</p>
              </div>
            </div>

            {/* 가운데 선과 손잡이 */}
            <div
              className="pointer-events-none absolute inset-y-3 w-0.5 -translate-x-1/2 bg-primary-600"
              style={{ left: `${split}%` }}
            >
              <span
                className={cn(
                  'absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-primary-600 shadow-lg',
                  focused && 'outline outline-2 outline-offset-2 outline-primary-600',
                )}
              >
                <Icon name="chevron-left" className="-mr-1.5 h-5 w-5" />
                <Icon name="chevron-right" className="-ml-1.5 h-5 w-5" />
              </span>
            </div>

            {/* 키보드·화면 낭독기용 조절 막대(보이지 않음). 좌우 화살표로 선을 옮긴다 */}
            <input
              type="range"
              className="sr-only"
              min={0}
              max={100}
              step={5}
              value={split}
              onChange={(event) => setSplit(Number(event.target.value))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="원문과 SAGE 설명 비교"
              aria-valuetext={`원문 ${split}%, SAGE ${100 - split}%`}
            />
          </div>
          <div
            className="mt-4 flex justify-between px-2 text-xs font-bold text-muted"
            aria-hidden="true"
          >
            <span>← {COMPARE.left}</span>
            <span>{COMPARE.right} →</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Compare
