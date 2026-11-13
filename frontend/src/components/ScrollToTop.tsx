import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// 화면 이동 시 맨 위에서 시작하게 한다 — SPA 는 페이지가 바뀌어도 창 스크롤 위치가 그대로 남아,
// 예를 들어 서비스 소개 맨 아래의 "지금 시작하기"로 홈에 오면 추천 뉴스가 아니라 아래쪽이 보였다.
// 뒤로/앞으로 가기(POP)는 브라우저가 이전 위치를 복원하도록 건드리지 않는다.
// 같은 페이지 안에서 검색어(?q=)만 바뀌는 경우는 NewsPage 가 따로 처리한다.
function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo({ top: 0 })
  }, [pathname, navigationType])

  return null
}

export default ScrollToTop
