import { useEffect, useEffectEvent, useRef, useState } from 'react'

// 소개 페이지의 움직임 도구 — 스크롤 진행도, 등장, 숫자 올라가기, 마우스 기울기.
// 움직임 줄이기 설정을 켠 사람에게는 위치가 바뀌는 움직임을 보여 주지 않는다.

export const reduceMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/** 스크롤 진행도 계산 방식
 *  - through: 요소 윗변이 화면 아래에 닿을 때 0, 아랫변이 화면 위로 빠질 때 1 (지나가는 내내)
 *  - enter:   요소 윗변이 화면 아래에 닿을 때 0, 화면 맨 위에 닿을 때 1 (들어오는 동안만)
 *  - pin:     요소 윗변이 화면 맨 위에 닿을 때 0, 아랫변이 화면 아래에 닿을 때 1 (화면에 고정해 두는 긴 구간) */
export type ScrollMode = 'through' | 'enter' | 'pin'

function scrollProgress({ top, height }: DOMRect, viewport: number, mode: ScrollMode) {
  if (!viewport) return 0
  if (mode === 'pin') return height <= viewport ? 0 : clamp01(-top / (height - viewport))
  if (mode === 'enter') return clamp01((viewport - top) / viewport)
  return clamp01((viewport - top) / (viewport + height))
}

// 스크롤 이벤트 하나를 여러 구간이 나눠 쓴다 (화면을 그리기 직전에 한 번만 계산)
const listeners = new Set<() => void>()
let scheduled = false
function schedule() {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(() => {
    scheduled = false
    listeners.forEach((fn) => fn())
  })
}
function subscribe(fn: () => void) {
  if (!listeners.size) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  }
  listeners.add(fn)
  fn()
  return () => {
    listeners.delete(fn)
    if (!listeners.size) {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }
}

/** ref 요소의 스크롤 진행도를 CSS 변수 --p(0~1)로 넣어 준다. CSS 가 calc(var(--p) …)로 움직임을 만든다.
 *  onChange 를 넘기면 값이 바뀔 때마다 불러 준다(지금 몇 번째 단계인지 계산할 때). */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(
  mode: ScrollMode = 'through',
  onChange?: (progress: number) => void,
) {
  const ref = useRef<T>(null)
  const notify = useEffectEvent((progress: number) => onChange?.(progress))

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let last = -1
    return subscribe(() => {
      const progress = scrollProgress(element.getBoundingClientRect(), window.innerHeight, mode)
      if (Math.abs(progress - last) < 0.0005) return
      last = progress
      element.style.setProperty('--p', progress.toFixed(4))
      notify(progress)
    })
  }, [mode])

  return ref
}

/** 화면에 들어왔는지 (한 번 들어오면 계속 true). eager: 기다리지 않고 처음부터 true (첫 화면용) */
export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.2, eager = false) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(eager)

  useEffect(() => {
    const element = ref.current
    if (!element || seen) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true)
      },
      { threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [seen, threshold])

  return [ref, seen] as const
}

/** 마우스를 따라 살짝 기울이기 — 요소에 CSS 변수 --tx, --ty(-1~1)를 넣어 준다.
 *  마우스가 있는 기기에서만, 움직임 줄이기 설정이 꺼져 있을 때만 동작한다. */
export function useTilt<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (
      !element ||
      reduceMotion() ||
      !window.matchMedia?.('(hover: hover) and (pointer: fine)').matches
    )
      return
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      element.style.setProperty(
        '--tx',
        (((event.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3),
      )
      element.style.setProperty(
        '--ty',
        (((event.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3),
      )
    }
    const leave = () => {
      element.style.setProperty('--tx', '0')
      element.style.setProperty('--ty', '0')
    }
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', leave)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
    }
  }, [])

  return ref
}
