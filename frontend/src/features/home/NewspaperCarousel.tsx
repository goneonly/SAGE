import {
  memo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import type { Article } from '../../types/article'
import Icon from '../../components/Icon'
import { formatDateLong, truncateText } from '../../lib/format'

/** 이웃 카드 사이의 각도 — 카드들은 화면 아래쪽 한 점을 중심으로 한 큰 원 위에 놓인다.
 *  반지름(캐러셀 폭의 144%)과 함께, 옆 장 중심이 가운데에서 폭의 약 30% 지점에 오도록 맞춘 값이다. */
const STEP_DEG = 12
/** 옆 장의 불투명도·흐림 — 지금 보는 한 장에 초점이 맞고 양옆은 살짝 흐릿하게 */
const NEIGHBOR_OPACITY = 0.85
const NEIGHBOR_BLUR_PX = 2.5
/** 가운데 기준 양옆으로 몇 장까지 DOM 에 둘지(가장 바깥 장은 투명 — 등장·퇴장용) */
const SLOT_RANGE = 3
/** 드래그로 한 장 넘어가는 데 필요한 거리(px) */
const DRAG_PX_PER_STEP = 220
/** 이 거리(px) 이상 움직여야 클릭이 아니라 드래그로 본다 */
const DRAG_START_PX = 6
/** 이 거리(px) 이상 끌었으면 반 장이 안 돼도 한 장은 넘긴다 */
const DRAG_FLICK_PX = 50

function mod(value: number, size: number): number {
  return ((value % size) + size) % size
}

// 신문 지면의 이중 괘선
function DoubleRule() {
  return <div className="h-2 shrink-0 border-y-[3px] border-ink" aria-hidden="true" />
}

// 신문 1면처럼 조판한 추천 기사 카드 — 제호 · 발행 정보 · 섹션명 · 헤드라인 · 리드문.
// 글자·여백은 전부 cqw(카드 폭 대비 %) 단위라 카드가 커지면 지면 전체가 같은 비율로 커진다.
// 카드는 화면보다 길게 잡혀 아래쪽이 잘리므로, 헤드라인 아래 리드문은 몇 줄만 보인다.
// memo: 드래그 중에는 캐러셀이 포인터 이동마다 다시 그려지는데, 카드 내용은 바뀌지 않으므로 건너뛴다.
const NewspaperCard = memo(function NewspaperCard({
  article,
  issue,
}: {
  article: Article
  issue: number
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden border border-ink/20 bg-surface p-[max(14px,4cqw)] text-ink shadow-xl">
      <DoubleRule />
      <p
        className="mt-[2cqw] text-center text-[length:17cqw] font-black uppercase leading-none tracking-tighter"
        aria-hidden="true"
      >
        The Sage
      </p>
      <div className="mt-[2cqw] flex items-center justify-between gap-2 border-y border-ink py-[0.8cqw] text-[length:max(12px,2cqw)] font-bold tracking-wide">
        <span className="truncate">{article.source}</span>
        <span aria-hidden="true">✱</span>
        <time dateTime={article.publishedAt} className="shrink-0">
          {formatDateLong(article.publishedAt)}
        </time>
      </div>
      <p className="py-[1.5cqw] text-center text-[length:max(18px,4.6cqw)] leading-tight tracking-widest">
        오늘의 추천 <span className="tabular-nums">{issue}</span>
      </p>
      <DoubleRule />
      <h3 className="mt-[3cqw] line-clamp-3 text-[length:max(18px,5cqw)] font-bold leading-[1.3]">
        {article.title}
      </h3>
      <p className="mt-[2.3cqw] text-[length:max(14px,2.8cqw)] leading-[1.7] text-muted">
        {/* 카드가 커서 본문을 길게 가져온다 — 넘치는 부분은 화면 아래에서 잘린다 */}
        {truncateText(article.body, 280)}
      </p>
    </article>
  )
})

interface DragState {
  startX: number
  moved: boolean
}

// 추천 뉴스 원형 캐러셀 — 신문 카드들이 큰 원호를 따라 돈다(가로 슬라이드가 아님).
// 무한 회전: position(정수, 끝없이 증감)을 기준으로 앞뒤 SLOT_RANGE 장만 그리고, 각 칸은
// 고유 번호(key)를 가져 한 바퀴를 돌아도 되감기 없이 계속 같은 방향으로 이어진다.
// 조작: 좌우 버튼 · 방향키 · 드래그/스와이프 · 옆 카드 클릭. 가운데 카드를 누르면 기사로 이동한다.
interface NewspaperCarouselProps {
  articles: Article[]
  /** 좌우 버튼 아래에 함께 놓을 요소(예: 다음 섹션으로 내려가는 버튼) */
  footer?: ReactNode
}

function NewspaperCarousel({ articles, footer }: NewspaperCarouselProps) {
  const [position, setPosition] = useState(0)
  const [dragPx, setDragPx] = useState(0)
  const dragRef = useRef<DragState | null>(null)
  // 드래그 직후 발생하는 click 이 카드 이동·기사 이동으로 처리되지 않게 막는다
  const suppressClickRef = useRef(false)

  const count = articles.length
  if (count === 0) return null

  const isDragging = dragPx !== 0
  const dragDeg = (dragPx / DRAG_PX_PER_STEP) * STEP_DEG
  const activeIndex = mod(position, count)
  const activeArticle = articles[activeIndex]

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragRef.current = { startX: event.clientX, moved: false }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag) return
    const deltaX = event.clientX - drag.startX
    if (!drag.moved) {
      if (Math.abs(deltaX) < DRAG_START_PX) return
      drag.moved = true
      // 드래그가 시작된 뒤에만 포인터를 잡는다 — 처음부터 잡으면 단순 클릭이 링크에 전달되지 않는다
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    setDragPx(deltaX)
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag?.moved) return

    const deltaX = event.clientX - drag.startX
    let steps = Math.round(-deltaX / DRAG_PX_PER_STEP)
    if (steps === 0 && Math.abs(deltaX) >= DRAG_FLICK_PX) steps = deltaX < 0 ? 1 : -1
    setPosition((current) => current + steps)
    setDragPx(0)
    suppressClickRef.current = true
    window.setTimeout(() => {
      suppressClickRef.current = false
    }, 0)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setPosition((current) => current - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      setPosition((current) => current + 1)
    }
  }

  const slots = Array.from({ length: SLOT_RANGE * 2 + 1 }, (_, index) => {
    const offset = index - SLOT_RANGE
    const slot = position + offset
    const angle = offset * STEP_DEG + dragDeg
    const distance = Math.abs(angle) / STEP_DEG
    // 가운데 장만 또렷하게, 바로 옆 장은 살짝 흐리게(blur), 그 바깥은 보이지 않게
    const blur = Math.min(distance, 1) * NEIGHBOR_BLUR_PX
    const opacity =
      distance <= 1
        ? 1 - (1 - NEIGHBOR_OPACITY) * distance
        : Math.max(0, NEIGHBOR_OPACITY * (2 - distance))
    const articleIndex = mod(slot, count)
    const article = articles[articleIndex]
    const isActive = offset === 0

    return (
      <div
        key={slot}
        className="absolute inset-x-0 top-4 mx-auto h-[110%] w-[var(--card-w)] transition-[transform,opacity,filter] duration-500 ease-out [container-type:inline-size] motion-reduce:transition-none"
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: '50% var(--wheel-radius)',
          opacity,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          zIndex: SLOT_RANGE - Math.abs(offset),
          transitionDuration: isDragging ? '0ms' : undefined,
          pointerEvents: opacity === 0 ? 'none' : undefined,
        }}
      >
        <Link
          to={`/article/${article.id}`}
          draggable={false}
          tabIndex={isActive ? 0 : -1}
          aria-hidden={!isActive}
          onClick={(event) => {
            if (suppressClickRef.current) {
              event.preventDefault()
              return
            }
            // 옆 카드는 기사로 가지 않고 가운데로 돌려 온다
            if (!isActive) {
              event.preventDefault()
              setPosition(slot)
            }
          }}
          className="block h-full select-none"
        >
          <NewspaperCard article={article} issue={articleIndex + 1} />
        </Link>
      </div>
    )
  })

  return (
    <div
      role="group"
      aria-roledescription="캐러셀"
      aria-label="추천 뉴스"
      onKeyDown={handleKeyDown}
      className="relative flex flex-1 flex-col [container-type:inline-size]"
    >
      {/* 무대 — 남은 세로 공간을 전부 쓴다. 카드는 무대보다 길어(h-110%) 아래쪽이 잘린다.
          카드 폭은 "헤드라인 + 리드문 3줄쯤"이 화면에 들어오도록 화면 높이에서 역산한다:
          (100dvh − 상단바·제목·하단 버튼 자리 310px) ÷ 0.9(그 지점까지의 높이/폭 비율),
          거기에 가로만 1.3배 넓힌다(본문 글자는 그만큼 cqw 를 줄여 크기를 유지). 좁은 화면에서는 무대 폭이 상한.
          --wheel-radius: 카드가 도는 원의 반지름(카드 윗변에서 원 중심까지). 캐러셀 폭의 144% —
          폭에 비례시켜, 우측 바가 접혀 무대가 넓어져도 옆 장이 늘 양 끝까지 닿게 한다 */}
      <div
        className="relative min-h-[420px] w-full flex-1 touch-pan-y overflow-hidden [--card-w:min(calc((100dvh-310px)/0.9*1.3),calc(100%-3rem))] [--wheel-radius:144cqw]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {slots}

        {/* 넘김 화살표 — 무대 양 끝에 < > 모양만 띄운다(배경·테두리 없음) */}
        <button
          type="button"
          aria-label="이전 추천 뉴스"
          onClick={() => setPosition((current) => current - 1)}
          className="group absolute left-0 top-[38%] z-20 flex h-20 w-8 items-center sm:w-12 justify-center text-ink/70 transition-colors hover:text-ink"
        >
          <Icon
            name="chevron-left"
            className="h-10 w-10 drop-shadow sm:h-16 sm:w-16 transition-transform duration-200 group-hover:-translate-x-1 group-hover:scale-125 group-active:scale-100 motion-reduce:transition-none"
          />
        </button>
        <button
          type="button"
          aria-label="다음 추천 뉴스"
          onClick={() => setPosition((current) => current + 1)}
          className="group absolute right-0 top-[38%] z-20 flex h-20 w-8 items-center sm:w-12 justify-center text-ink/70 transition-colors hover:text-ink"
        >
          <Icon
            name="chevron-right"
            className="h-10 w-10 drop-shadow sm:h-16 sm:w-16 transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-125 group-active:scale-100 motion-reduce:transition-none"
          />
        </button>
      </div>

      {/* 하단 조작부 — 잘린 지면 위에 배경색 그라데이션을 깔고 그 위에 올린다.
          그라데이션은 클릭을 통과시켜(pointer-events-none) 아래 카드 클릭·드래그를 막지 않는다 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center bg-gradient-to-t from-bg from-55% to-transparent pb-1 pt-16">
        <span className="text-sm tabular-nums text-muted" aria-hidden="true">
          {activeIndex + 1} / {count}
        </span>
        {footer && <div className="pointer-events-auto">{footer}</div>}
      </div>
      {/* 스크린리더용 — 카드가 바뀔 때 현재 기사를 알려 준다 */}
      <p className="sr-only" aria-live="polite">
        {count}개 중 {activeIndex + 1}번째: {activeArticle.title}
      </p>
    </div>
  )
}

export default NewspaperCarousel
