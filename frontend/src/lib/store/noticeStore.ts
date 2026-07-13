import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notice } from '../../types/notice'

// 공지 스토어 — 운영자 페이지에서 등록·수정·삭제하고 /notices 에서 노출한다.
// TODO(backend): 백엔드 연동 시 API 호출로 교체. 지금은 scrapStore 와 같은 persist mock 패턴.

interface NoticeInput {
  title: string
  body: string
}

/** 오늘 날짜를 YYYY-MM-DD 로 — 공지 카드의 표시용 날짜 */
function today(): string {
  return new Date().toISOString().slice(0, 10)
}

// 기존 NoticesPage 의 mock 공지를 초기 seed 로 유지한다.
const SEED_NOTICES: Notice[] = [
  {
    id: 'seed-2',
    title: 'SAGE 베타 서비스 오픈 안내',
    date: '2026-07-01',
    body: 'AI 금융 뉴스 학습 플랫폼 SAGE의 베타 서비스가 시작되었어요. 뉴스를 읽는 것만으로 투자 공부가 되도록 여러분의 눈높이에 맞춰 드릴게요.',
    createdAt: '2026-07-01T00:00:00.000Z',
  },
  {
    id: 'seed-1',
    title: 'AI 생성 콘텐츠 이용 안내',
    date: '2026-06-10',
    body: 'SAGE의 설명과 인사이트는 AI가 생성해요. 투자 결정은 반드시 본인의 판단과 책임하에 진행해 주세요.',
    createdAt: '2026-06-10T00:00:00.000Z',
  },
]

interface NoticeState {
  notices: Notice[]
  addNotice: (input: NoticeInput) => void
  updateNotice: (id: string, input: NoticeInput) => void
  removeNotice: (id: string) => void
}

export const useNoticeStore = create<NoticeState>()(
  persist(
    (set) => ({
      notices: SEED_NOTICES,
      addNotice: (input) =>
        set((state) => ({
          notices: [
            {
              id: crypto.randomUUID(),
              title: input.title.trim(),
              body: input.body.trim(),
              date: today(),
              createdAt: new Date().toISOString(),
            },
            ...state.notices,
          ],
        })),
      updateNotice: (id, input) =>
        set((state) => ({
          notices: state.notices.map((notice) =>
            notice.id === id
              ? { ...notice, title: input.title.trim(), body: input.body.trim() }
              : notice,
          ),
        })),
      removeNotice: (id) =>
        set((state) => ({
          notices: state.notices.filter((notice) => notice.id !== id),
        })),
    }),
    { name: 'sage-notices' },
  ),
)

/** 최신 공지가 먼저 오도록 정렬 — 노출용 셀렉터 */
export function sortNotices(notices: Notice[]): Notice[] {
  return [...notices].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
