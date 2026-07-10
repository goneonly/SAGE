import { Link } from 'react-router-dom'
import { useVocabStore } from '../../lib/store/vocabStore'
import { usePageTitle } from '../../lib/usePageTitle'
import type { Level } from '../../types/auth'
import Container from '../../components/ui/Container'
import PageTitle from '../../components/ui/PageTitle'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'

const LEVEL_LABEL: Record<Level, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 단어장 화면 — ParaphrasePanel의 "단어장 저장"으로 생긴 항목을 읽고 삭제하는
// 기본 CRUD 뷰(Create는 파라프레이즈 패널에서, 여기서는 조회/삭제).
function VocabPage() {
  usePageTitle('단어장')
  const entries = useVocabStore((state) => state.entries)
  const removeEntry = useVocabStore((state) => state.removeEntry)

  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <Container size="md">
      <PageTitle title="단어장" />

      {sorted.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon="📖"
          title="아직 저장한 단어가 없어요"
          description='기사 안에서 하이라이트된 용어를 클릭하고 "단어장 저장"을 누르면 여기에 쌓여요.'
          action={
            <Link
              to="/news"
              className="inline-block rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-600/90"
            >
              기사 읽으러 가기
            </Link>
          }
        />
      ) : (
        <ul className="mt-6 space-y-3">
          {sorted.map((entry) => (
            <Card as="li" key={entry.id} className="relative p-4">
              <div className="pr-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-ink">{entry.term}</h2>
                  <Badge>{LEVEL_LABEL[entry.level]}</Badge>
                </div>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">
                  {entry.explanation}
                </p>
                <p className="mt-2 text-xs text-muted">{formatDate(entry.createdAt)} 저장</p>
              </div>
              {/* 삭제 버튼은 스크랩 카드와 동일한 원형 ✕ — 카드 우상단에 겹쳐 배치 */}
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                aria-label={`${entry.term} 삭제`}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs leading-none text-muted shadow hover:bg-primary-50 hover:text-rise"
              >
                ✕
              </button>
            </Card>
          ))}
        </ul>
      )}
    </Container>
  )
}

export default VocabPage
