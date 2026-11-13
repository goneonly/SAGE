import { Link } from 'react-router-dom'
import { useVocabStore } from '../../lib/store/vocabStore'
import { useLearningStore } from '../../lib/store/learningStore'
import { getMasteryStage } from '../learning/mastery'
import MasteryBadge from '../learning/MasteryBadge'
import { usePageTitle } from '../../lib/usePageTitle'
import Container from '../../components/ui/Container'
import PageTitle from '../../components/ui/PageTitle'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Icon from '../../components/Icon'
import ProgressBar from '../../components/ui/ProgressBar'
import { formatDateLong } from '../../lib/format'
import { LEVEL_NAME } from '../../lib/levels'

// 단어장 화면 — ParaphrasePanel의 "단어장 저장"으로 생긴 항목을 읽고 삭제하는
// 기본 CRUD 뷰(Create는 파라프레이즈 패널에서, 여기서는 조회/삭제).
function VocabPage() {
  usePageTitle('단어장')
  const entries = useVocabStore((state) => state.entries)
  const removeEntry = useVocabStore((state) => state.removeEntry)

  const progressByTerm = useLearningStore((state) => state.terms)
  const setMastered = useLearningStore((state) => state.setMastered)

  // 같은 용어를 레벨별로 여러 번 저장할 수 있으므로 숙련도 집계는 용어 기준(중복 제거)으로 센다
  const savedTerms = [...new Set(entries.map((entry) => entry.term))]
  const masteredCount = savedTerms.filter((term) => progressByTerm[term]?.mastered).length

  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <Container size="md">
      <PageTitle title="단어장" />

      {sorted.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={<Icon name="vocab" className="h-8 w-8" />}
          title="아직 저장한 단어가 없어요"
          description='기사 안에서 하이라이트된 용어를 클릭하고 "단어장 저장"을 누르면 여기에 쌓여요.'
          action={
            <Link
              to="/news"
              className="inline-block rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-on-primary transition hover:bg-primary-600/90"
            >
              기사 읽으러 가기
            </Link>
          }
        />
      ) : (
        <>
          <Card className="mt-6 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-ink">마스터한 용어</span>
              <span className="tabular-nums text-muted">
                {masteredCount} / {savedTerms.length}
              </span>
            </div>
            <ProgressBar
              label="마스터한 용어"
              value={masteredCount}
              max={savedTerms.length}
              className="mt-2"
            />
          </Card>
          <ul className="mt-3 space-y-3">
            {sorted.map((entry) => {
              const stage = getMasteryStage(progressByTerm[entry.term], true) ?? 'learning'
              return (
                <Card as="li" key={entry.id} className="relative p-4">
                  <div className="pr-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-ink">{entry.term}</h2>
                      <Badge>{LEVEL_NAME[entry.level]}</Badge>
                      <MasteryBadge stage={stage} />
                    </div>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">
                      {entry.explanation}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-xs text-muted">{formatDateLong(entry.createdAt)} 저장</p>
                      <button
                        type="button"
                        onClick={() => setMastered(entry.term, stage !== 'mastered')}
                        aria-pressed={stage === 'mastered'}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary-600 hover:text-primary-600"
                      >
                        {stage === 'mastered' ? '다시 익히기' : '이제 알아요'}
                      </button>
                    </div>
                  </div>
                  {/* 삭제 버튼은 스크랩 카드와 동일한 원형 닫기 아이콘 — 카드 우상단에 겹쳐 배치 */}
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    aria-label={`${entry.term} 삭제`}
                    className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-muted shadow transition-colors hover:bg-primary-50 hover:text-danger"
                  >
                    <Icon name="close" className="h-3.5 w-3.5" />
                  </button>
                </Card>
              )
            })}
          </ul>
        </>
      )}
    </Container>
  )
}

export default VocabPage
