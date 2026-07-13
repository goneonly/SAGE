import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import { useNoticeStore, sortNotices } from '../lib/store/noticeStore'
import { usePageTitle } from '../lib/usePageTitle'
import Container from '../components/ui/Container'
import PageTitle from '../components/ui/PageTitle'
import Card from '../components/ui/Card'
import { seedArticles } from '../features/home/seedArticles'
import { seedTerms } from '../features/paraphrase/seedTerms'

// 운영자 페이지 — role === 'admin' 인 계정만 접근 가능(그 외에는 홈으로 돌려보낸다).
// TODO(backend): 백엔드 연동 시 회원 수·신고 등 실데이터로 교체. 지금은 seed 데이터 기반 현황판.
const MANAGEMENT_MENUS: { title: string; description: string }[] = [
  { title: '회원 관리', description: '회원 목록 조회, 이용 제한 처리 (백엔드 연동 예정)' },
  { title: '기사 관리', description: '기사 노출·숨김, 추천 배치 관리 (백엔드 연동 예정)' },
  { title: '용어 사전 관리', description: '용어 추가·수정, 레벨별 설명 검수 (백엔드 연동 예정)' },
]

function AdminPage() {
  usePageTitle('운영자 페이지')
  const user = useAuthStore((state) => state.user)
  const notices = useNoticeStore((state) => state.notices)
  const addNotice = useNoticeStore((state) => state.addNotice)
  const updateNotice = useNoticeStore((state) => state.updateNotice)
  const removeNotice = useNoticeStore((state) => state.removeNotice)

  // 공지 작성 폼 — editingId 가 있으면 수정 모드, 없으면 신규 등록 모드.
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  // 운영자가 아니면 접근 차단 — URL 직접 입력도 여기서 막힌다.
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const stats = [
    { label: '등록 기사', value: seedArticles.length, unit: '건' },
    { label: '등록 용어', value: seedTerms.length, unit: '개' },
    { label: '등록 공지', value: notices.length, unit: '건' },
    { label: '미처리 신고', value: 0, unit: '건' },
  ]

  const resetForm = () => {
    setTitle('')
    setBody('')
    setEditingId(null)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !body.trim()) return
    if (editingId) {
      updateNotice(editingId, { title, body })
    } else {
      addNotice({ title, body })
    }
    resetForm()
  }

  const startEdit = (id: string) => {
    const notice = notices.find((item) => item.id === id)
    if (!notice) return
    setEditingId(id)
    setTitle(notice.title)
    setBody(notice.body)
  }

  const handleRemove = (id: string) => {
    if (!window.confirm('이 공지를 삭제할까요? 삭제하면 공지사항 페이지에서도 사라져요.')) return
    if (editingId === id) resetForm()
    removeNotice(id)
  }

  return (
    <Container size="md">
      <PageTitle title="운영자 페이지" />
      <p className="mt-1 text-xs text-muted">
        운영자 계정({user.email})으로 접속 중입니다. 일반 회원에게는 이 화면이 보이지 않아요.
      </p>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-muted">현황</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <p className="text-xs text-muted">{stat.label}</p>
              <p className="mt-1 text-xl font-bold text-ink">
                {stat.value}
                <span className="ml-0.5 text-sm font-medium text-muted">{stat.unit}</span>
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 공지 관리 — 등록·수정·삭제. 공개 /notices 페이지에 즉시 반영된다. */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-muted">공지 관리</h2>

        <form
          onSubmit={handleSubmit}
          className="mt-3 space-y-3 rounded-lg border border-line bg-surface p-4"
        >
          <label className="block text-sm">
            <span className="mb-1 block text-muted">제목</span>
            <input
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="공지 제목을 입력하세요"
              className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">내용</span>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="공지 내용을 입력하세요"
              className="w-full resize-y rounded-lg border border-line bg-bg px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600/90"
            >
              {editingId ? '수정 완료' : '공지 등록'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted transition hover:bg-bg"
              >
                취소
              </button>
            )}
          </div>
        </form>

        <ul className="mt-3 space-y-2">
          {notices.length === 0 && (
            <li className="rounded-lg border border-line bg-surface p-4 text-center text-xs text-muted">
              등록된 공지가 없어요. 위 폼에서 첫 공지를 등록해 보세요.
            </li>
          )}
          {sortNotices(notices).map((notice) => (
            <li
              key={notice.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-line bg-surface p-3"
            >
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="truncate text-sm font-medium text-ink">{notice.title}</p>
                  <time className="shrink-0 text-[10px] text-subtle">{notice.date}</time>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{notice.body}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(notice.id)}
                  className="rounded-md border border-line px-2 py-1 text-xs text-muted transition hover:bg-bg hover:text-ink"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(notice.id)}
                  className="rounded-md border border-line px-2 py-1 text-xs text-rise transition hover:bg-bg"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-muted">관리 메뉴</h2>
        <div className="mt-3 space-y-2">
          {MANAGEMENT_MENUS.map((menu) => (
            <div
              key={menu.title}
              className="flex items-center justify-between rounded-lg border border-line bg-surface p-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">{menu.title}</p>
                <p className="text-xs text-muted">{menu.description}</p>
              </div>
              <span className="rounded-full bg-bg px-2 py-0.5 text-[10px] font-medium text-subtle">
                준비 중
              </span>
            </div>
          ))}
        </div>
      </section>
    </Container>
  )
}

export default AdminPage
