import { useSyncExternalStore } from 'react'

// CSS 미디어쿼리 일치 여부를 구독한다 — 창 크기가 바뀌면 다시 렌더링된다.
// 레이아웃은 Tailwind 분기로 처리하고, 이 훅은 aria-modal·포커스 가두기처럼
// CSS 로 표현할 수 없는 동작을 분기할 때만 쓴다.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQueryList = window.matchMedia(query)
      mediaQueryList.addEventListener('change', onChange)
      return () => mediaQueryList.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
  )
}

/** Tailwind `lg`(1024px) 이상 — 리더 패널이 사이드 패널(비모달)로 바뀌는 기준 */
export const LG_MEDIA_QUERY = '(min-width: 1024px)'
