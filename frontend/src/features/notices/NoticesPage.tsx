import PublicHeader from '../../components/PublicHeader'
import Footer from '../../components/Footer'
import { useNoticeStore, sortNotices } from '../../lib/store/noticeStore'
import { usePageTitle } from '../../lib/usePageTitle'

// 공지사항 — 공개 라우트. About 상단 바의 "공지사항"에서 진입한다.
// 공지는 운영자 페이지(/admin)의 공지 관리에서 등록·수정·삭제한다.
// TODO(backend): 백엔드 연동 시 noticeStore 를 API 조회로 교체.
function NoticesPage() {
  usePageTitle('공지사항')
  const notices = useNoticeStore((state) => state.notices)

  return (
    <div className="min-h-screen bg-bg text-ink">
      <PublicHeader />

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-ink md:text-4xl">공지사항</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          SAGE의 새로운 소식과 서비스 안내를 확인하세요.
        </p>

        {notices.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
            아직 등록된 공지가 없어요.
          </p>
        ) : (
          <ul className="mt-10 space-y-4">
            {sortNotices(notices).map((notice) => (
              <li
                key={notice.id}
                className="rounded-2xl border border-line bg-surface p-6 shadow-sm"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-lg font-semibold text-ink">{notice.title}</h2>
                  <time className="shrink-0 text-xs text-subtle">{notice.date}</time>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
                  {notice.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default NoticesPage
