import { useCallback, useEffect, useRef, useState } from 'react'

/** 스냅 후 대상 섹션 위에 남길 여백(px) */
const TOP_GAP = 16
/** 부드러운 스크롤이 끝날 때까지 추가 휠 입력을 무시하는 시간(ms) — 트랙패드 관성 스크롤 대응 */
const LOCK_MS = 900

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// 휠 이벤트가 알림 드롭다운·모달처럼 자체 스크롤 영역 안에서 일어났는지 — 그 안의 스크롤은 건드리지 않는다
function isInsideScrollable(target: EventTarget | null): boolean {
  for (
    let element = target instanceof Element ? target : null;
    element && element !== document.body;
    element = element.parentElement
  ) {
    const overflowY = getComputedStyle(element).overflowY
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      element.scrollHeight > element.clientHeight
    ) {
      return true
    }
  }
  return false
}

// 홈 2단 섹션 스냅 — 첫 화면(추천 뉴스)과 그 아래(전체 뉴스) 사이를 한 번의 스크롤로 넘긴다.
// - 첫 화면에서 아래로 스크롤 → 대상 섹션으로 부드럽게 이동
// - 대상 섹션 맨 위에서 위로 스크롤 → 첫 화면으로 부드럽게 복귀
// - 대상 섹션 안쪽에서는 평소처럼 스크롤된다(올라오다 맨 위를 지나치면 맨 위에서 한 번 멈춘다)
// 터치 스크롤은 가로채지 않는다(휠·트랙패드와 버튼만 스냅). 반환한 ref 를 대상 섹션에 붙인다.
export function useSectionSnap<T extends HTMLElement>() {
  const targetRef = useRef<T>(null)
  // 첫 화면이 보이는 중인지 — 등장(pop) 애니메이션 전환에 쓴다
  const [isFirstActive, setIsFirstActive] = useState(true)

  const getTargetTop = useCallback((): number => {
    const target = targetRef.current
    if (!target) return 0
    // 상단바가 화면 위에 고정(sticky)돼 있으므로 그 높이만큼 덜 올려, 대상이 상단바 바로 아래에 오게 한다
    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
    const top = target.getBoundingClientRect().top + window.scrollY - TOP_GAP - headerHeight
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    return Math.max(0, Math.min(top, maxScroll))
  }, [])

  const scrollToY = useCallback((top: number) => {
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [])

  const scrollToTarget = useCallback(() => scrollToY(getTargetTop()), [scrollToY, getTargetTop])

  useEffect(() => {
    let lockedUntil = 0

    function handleWheel(event: WheelEvent) {
      // 확대(ctrl+휠)·가로 스크롤·모달로 스크롤이 잠긴 상태·내부 스크롤 영역은 그대로 둔다
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      if (document.documentElement.style.overflow === 'hidden') return
      if (isInsideScrollable(event.target)) return

      if (performance.now() < lockedUntil) {
        event.preventDefault()
        return
      }

      const targetTop = getTargetTop()
      const current = window.scrollY
      let destination: number | null = null
      if (event.deltaY > 0 && current < targetTop - 4) destination = targetTop
      else if (event.deltaY < 0 && current > 0 && current <= targetTop + 4) destination = 0
      // 대상 섹션 안쪽에서 올라오다 맨 위를 지나칠 것 같으면 맨 위에서 한 번 멈춘다
      // (두 섹션 사이 어중간한 위치에 서지 않도록) — 거기서 한 번 더 올리면 첫 화면으로 간다
      else if (event.deltaY < 0 && current > targetTop + 4 && current + event.deltaY < targetTop) {
        destination = targetTop
      }
      if (destination === null) return

      event.preventDefault()
      lockedUntil = performance.now() + LOCK_MS
      scrollToY(destination)
    }

    // 스크롤 이벤트는 프레임보다 자주 오므로, 위치 계산(레이아웃 읽기)은 프레임당 한 번만 한다
    let frame = 0
    function handleScroll() {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setIsFirstActive(window.scrollY < getTargetTop() / 2)
      })
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [getTargetTop, scrollToY])

  return { targetRef, isFirstActive, scrollToTarget }
}
