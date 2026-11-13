import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ArticleCard from './ArticleCard'
import NewspaperCarousel from './NewspaperCarousel'
import { useSectionSnap } from './useSectionSnap'
import { HomeWidgets } from '../../components/RightBar'
import DailyGoalWidget from '../learning/DailyGoalWidget'
import LevelUpBanner from '../learning/LevelUpBanner'
import { seedArticles, seedArticlesByLatest } from './seedArticles'
import { getRecommendedArticles } from './recommend'
import { useWatchlistStore } from '../../lib/store/watchlistStore'
import { useHomeViewStore } from '../../lib/store/homeViewStore'
import { usePageTitle } from '../../lib/usePageTitle'
import Icon from '../../components/Icon'

// 홈의 "전체 뉴스"는 최신 몇 건만 미리보기로 보여주고,
// 나머지는 "전체 더보기" 버튼으로 뉴스 화면(/news, 페이지네이션)에서 이어 본다.
const HOME_NEWS_PREVIEW_COUNT = 5
const LATEST_ARTICLES = seedArticlesByLatest.slice(0, HOME_NEWS_PREVIEW_COUNT)

function HomePage() {
  usePageTitle('홈')
  const watchlistItems = useWatchlistStore((state) => state.items)
  const watchlistTickers = useMemo(
    () => watchlistItems.map((item) => item.ticker),
    [watchlistItems],
  )

  // 관심 종목이 바뀌면 watchlistTickers 가 바뀌고, 이 컴포넌트가 다시 렌더링되며
  // 추천 목록도 그때그때 다시 계산된다(한 번 계산해 고정하는 게 아님).
  const recommended = useMemo(
    () => getRecommendedArticles(seedArticles, watchlistTickers),
    [watchlistTickers],
  )

  // 첫 화면(추천 뉴스) ↔ 전체 뉴스 사이를 한 번의 스크롤로 넘긴다
  const { targetRef, isFirstActive, scrollToTarget } = useSectionSnap<HTMLDivElement>()

  // 추천 뉴스를 보는 동안에는 AppShell 이 우측 바를 숨기도록 알린다
  const setHeroActive = useHomeViewStore((state) => state.setHeroActive)
  useEffect(() => {
    setHeroActive(isFirstActive)
  }, [isFirstActive, setHeroActive])

  return (
    <div>
      {/* 시각적으로는 상단바 로고가 h1 역할이지만, 스크린리더용 heading 계층을 위해 숨긴 h1 을 둔다 */}
      <h1 className="sr-only">홈</h1>
      {/* 첫 화면 — 추천 뉴스가 상단바와 왼쪽 사이드바를 뺀 화면 전체를 쓴다.
          main 의 패딩(p-4 · md:p-6)을 음수 마진으로 상쇄해 좌우·위 여백 없이 가장자리까지 채우고,
          높이는 100dvh − 상단바(--header-h). 전체 뉴스에서 다시 올라오면 살짝 튀어 오르며(pop) 나타난다. */}
      <section
        className={`-mx-4 -mt-4 flex min-h-[calc(100dvh-var(--header-h))] flex-col transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none md:-mx-6 md:-mt-6 ${
          isFirstActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* 제목·배너만 안쪽 여백을 주고, 캐러셀 무대는 좌우 끝까지 쓴다 */}
        <div className="px-4 pt-4 md:px-6 md:pt-6">
          <LevelUpBanner />
          <h2 className="text-2xl font-bold text-ink">추천 뉴스</h2>
        </div>
        <NewspaperCarousel
          articles={recommended}
          footer={
            <button
              type="button"
              onClick={scrollToTarget}
              className="flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-xs font-medium text-muted transition-colors hover:text-ink"
            >
              전체 뉴스
              <Icon name="caret-down" className="h-6 w-6 motion-safe:animate-bounce" />
            </button>
          }
        />
      </section>

      {/* 둘째 화면 — 전체 뉴스. 첫 화면에서 넘어오면 아래에서 떠오르듯 나타난다 */}
      {/* 스냅 위치는 이 바깥 div 기준으로 잰다 — 안쪽 div 는 등장 애니메이션(transform)으로 위치가 흔들리기 때문 */}
      {/* min-h(화면 높이 − 고정 상단바): 전체 뉴스 구간이 화면 한 장보다 짧아도 맨 위까지 스크롤이 닿게 한다(스냅 위치 보장) */}
      <div ref={targetRef} className="min-h-[calc(100dvh-var(--header-h))]">
        <div
          className={`pt-6 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
            isFirstActive ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          {/* 오늘의 목표 — 우측 바가 숨는 폭(<lg)에서는 전체 뉴스 위에 둔다(짝: RightBar) */}
          <DailyGoalWidget className="mb-8 lg:hidden" />
          <section>
            <h2 className="mb-3 text-lg font-bold text-ink">전체 뉴스</h2>
            <div className="space-y-3">
              {LATEST_ARTICLES.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <Link
              to="/news"
              className="mt-4 block w-full rounded-lg border border-line bg-surface py-2.5 text-center text-sm font-medium text-muted transition-colors hover:border-primary-600 hover:text-primary-600"
            >
              전체 더보기
            </Link>
          </section>
          {/* 우측 바가 숨는 폭(<lg)에서는 같은 위젯을 본문 하단에 보여준다 — 짝: RightBar 의 hidden lg:block */}
          <section className="mt-12 lg:hidden">
            <h2 className="mb-3 text-lg font-bold text-ink">내 학습 도구</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <HomeWidgets />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default HomePage
