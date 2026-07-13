import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
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
  { title: '공지 관리', description: '공지 등록·수정·삭제 (백엔드 연동 예정)' },
]

function AdminPage() {
  usePageTitle('운영자 페이지')
  const user = useAuthStore((state) => state.user)

  // 운영자가 아니면 접근 차단 — URL 직접 입력도 여기서 막힌다.
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const stats = [
    { label: '등록 기사', value: seedArticles.length, unit: '건' },
    { label: '등록 용어', value: seedTerms.length, unit: '개' },
    { label: '오늘 가입', value: 0, unit: '명' },
    { label: '미처리 신고', value: 0, unit: '건' },
  ]

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
