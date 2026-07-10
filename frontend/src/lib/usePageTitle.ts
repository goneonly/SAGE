import { useEffect } from 'react'

const BASE_TITLE = 'SAGE — Smart AI Guidance for Economics'

// 페이지별 문서 제목 — SPA 라 라우트 전환 시 document.title 을 직접 갱신한다.
// 브라우저 탭·히스토리·검색엔진(공개 페이지)에 페이지 맥락을 제공한다.
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · SAGE` : BASE_TITLE
    return () => {
      document.title = BASE_TITLE
    }
  }, [title])
}
