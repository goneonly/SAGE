import PublicHeader from '../../components/PublicHeader'
import Footer from '../../components/Footer'

// 공지사항 — 공개 라우트. About 상단 바의 "공지사항"에서 진입한다.
// 아직 백엔드 연동 전이라 mock 공지 목록을 노출한다.
interface Notice {
  id: number
  title: string
  date: string
  body: string
}

const NOTICES: Notice[] = [
  {
    id: 2,
    title: 'SAGE 베타 서비스 오픈 안내',
    date: '2026-07-01',
    body: 'AI 금융 뉴스 학습 플랫폼 SAGE의 베타 서비스가 시작되었어요. 뉴스를 읽는 것만으로 투자 공부가 되도록 여러분의 눈높이에 맞춰 드릴게요.',
  },
  {
    id: 1,
    title: 'AI 생성 콘텐츠 이용 안내',
    date: '2026-06-10',
    body: 'SAGE의 설명과 인사이트는 AI가 생성해요. 투자 결정은 반드시 본인의 판단과 책임하에 진행해 주세요.',
  },
]

function NoticesPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <PublicHeader />

      <main className="max-w-3xl px-6 py-16">
        <h1 className="mx-auto text-3xl font-bold text-ink md:text-4xl">공지사항</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          SAGE의 새로운 소식과 서비스 안내를 확인하세요.
        </p>

        <ul className="mt-10 space-y-4">
          {NOTICES.map((notice) => (
            <li key={notice.id} className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold text-ink">{notice.title}</h2>
                <time className="shrink-0 text-xs text-subtle">{notice.date}</time>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{notice.body}</p>
            </li>
          ))}
        </ul>
      </main>

      <Footer />
    </div>
  )
}

export default NoticesPage
