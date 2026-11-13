import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlistStore } from '../lib/store/watchlistStore'
import { useVocabStore } from '../lib/store/vocabStore'
import { useAuthStore } from '../lib/store/authStore'
import { getDailyTerm } from '../features/paraphrase/dailyTerm'
import DailyGoalWidget from '../features/learning/DailyGoalWidget'
import Icon from './Icon'

const RECENT_VOCAB_LIMIT = 5

// 내 관심 종목 — 종목코드 텍스트 입력으로 추가/X로 삭제. 실제 시세·종목명 조회 없이
// 코드 문자열만 다루는 단순 목업(watchlistStore, PLAN.md §7 watchlist 테이블 흉내).
function WatchlistWidget() {
  const items = useWatchlistStore((state) => state.items)
  const addTicker = useWatchlistStore((state) => state.addTicker)
  const removeTicker = useWatchlistStore((state) => state.removeTicker)
  const [input, setInput] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!input.trim()) return
    addTicker(input)
    setInput('')
  }

  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <h3 className="text-sm font-semibold text-ink">내 관심 종목</h3>

      {items.length === 0 ? (
        <p className="mt-2 text-xs text-muted">등록된 관심 종목이 없어요.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-ink">{item.ticker}</span>
              <button
                type="button"
                onClick={() => removeTicker(item.id)}
                aria-label={`${item.ticker} 삭제`}
                className="flex h-7 w-7 items-center justify-center rounded text-muted transition-colors hover:bg-primary-50 hover:text-danger"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-3 flex gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="종목코드 추가"
          className="min-w-0 flex-1 rounded-lg border border-line px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-primary-600 px-2 py-1 text-xs font-medium text-on-primary hover:bg-primary-600/90"
        >
          추가
        </button>
      </form>
    </section>
  )
}

// 오늘의 주식 단어 — daily_terms(term, explanation_by_level, date) 흉내. 날짜 해시로
// 하루 동안 고정된 용어를 고르고, 설명은 현재 로그인 사용자의 레벨에 맞춰 보여준다.
function DailyTermWidget() {
  const level = useAuthStore((state) => state.user?.level ?? 'beginner')
  const dailyTerm = getDailyTerm()

  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <h3 className="text-sm font-semibold text-ink">오늘의 주식 단어</h3>
      <p className="mt-2 font-medium text-primary-700">{dailyTerm.term}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{dailyTerm.explanations[level]}</p>
      {dailyTerm.impact && (
        <p className="mt-2 border-t border-line pt-2 text-xs leading-relaxed text-muted">
          <Icon
            name="lightbulb"
            className="mr-1 inline h-3.5 w-3.5 align-[-2px] text-primary-700"
          />
          {dailyTerm.impact}
        </p>
      )}
    </section>
  )
}

// 내가 스크랩한 단어 — 실은 vocabStore(단어장)를 최근 저장순으로 살짝 들여다보는 위젯.
// 클릭하면 전체 목록인 /vocab 으로 이동.
function RecentVocabWidget() {
  const entries = useVocabStore((state) => state.entries)
  const recent = [...entries]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, RECENT_VOCAB_LIMIT)

  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <h3 className="text-sm font-semibold text-ink">내가 스크랩한 단어</h3>
      {recent.length === 0 ? (
        <p className="mt-2 text-xs text-muted">아직 저장한 단어가 없어요.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {recent.map((entry) => (
            <li key={entry.id}>
              <Link to="/vocab" className="text-sm text-ink hover:text-primary-600 hover:underline">
                {entry.term}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// 홈 3위젯(PLAN.md §5): 내 관심 종목 · 오늘의 주식 단어 · 내가 스크랩한 단어.
// lg+ 에서는 우측 바(RightBar)에, 그보다 좁으면 홈 본문 하단(HomePage)에 같은 위젯을 렌더링한다.
// 관심 종목 추가·삭제는 여기서만 가능하므로 어느 폭에서든 반드시 노출돼야 한다.
export function HomeWidgets() {
  return (
    <>
      <WatchlistWidget />
      <DailyTermWidget />
      <RecentVocabWidget />
    </>
  )
}

// 우측 바 — 넓은 화면(lg+) 전용. sticky 라서 페이지를 내려도 고정된 상단바(--header-h) 바로 아래에 붙어 따라온다
// (홈에서 전체 뉴스로 내려갔을 때 위젯이 화면 밖에 남지 않도록). 세로 구분선·배경은 AppShell 의 래퍼가 그린다.
// 언제 보일지는 AppShell 이 결정한다(홈의 전체 뉴스 구간 · 기사 리더).
// 짝: HomePage 의 lg:hidden 위젯 섹션.
function RightBar() {
  return (
    <aside className="sticky top-[var(--header-h)] hidden max-h-[calc(100dvh-var(--header-h))] w-64 shrink-0 space-y-4 overflow-y-auto p-4 lg:block">
      {/* 오늘의 목표 — <lg 에서는 HomePage 가 본문 맨 위에 따로 렌더링한다(짝: lg:hidden) */}
      <DailyGoalWidget />
      <HomeWidgets />
    </aside>
  )
}

export default RightBar
