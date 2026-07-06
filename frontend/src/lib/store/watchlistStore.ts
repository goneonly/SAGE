import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// PLAN.md §7 watchlist(id, user_id, ticker, created_at) — user_id는 클라이언트에
// 로그인 사용자가 한 명뿐이라 생략.
export interface WatchlistItem {
  id: string
  ticker: string
  createdAt: string
}

// 처음 로드 시 위젯이 비어있지 않도록 기본 관심 종목 2개를 시드로 넣어둔다.
// 삼성전자(005930)·LG에너지솔루션(373220) — seed 기사(a1/a3/a5/a6)와 겹치도록 골라
// features/home/recommend.ts 의 관심종목 매칭 스코어링이 실제로 동작하는 걸 바로 볼 수 있게 함.
const DEFAULT_TICKERS = ['005930', '373220']

function buildDefaultItems(): WatchlistItem[] {
  const now = new Date().toISOString()
  return DEFAULT_TICKERS.map((ticker) => ({ id: crypto.randomUUID(), ticker, createdAt: now }))
}

interface WatchlistState {
  items: WatchlistItem[]
  addTicker: (ticker: string) => void
  removeTicker: (id: string) => void
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      items: buildDefaultItems(),
      addTicker: (ticker) =>
        set((state) => {
          const normalized = ticker.trim()
          if (!normalized || state.items.some((item) => item.ticker === normalized)) return state
          return {
            items: [
              ...state.items,
              { id: crypto.randomUUID(), ticker: normalized, createdAt: new Date().toISOString() },
            ],
          }
        }),
      removeTicker: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    }),
    { name: 'ufn-watchlist' },
  ),
)
