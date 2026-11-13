import { useVocabStore } from '../lib/store/vocabStore'
import { useLearningStore } from '../lib/store/learningStore'
import { getMasteryStage } from '../features/learning/mastery'
import MasteryBadge from '../features/learning/MasteryBadge'
import { useDialog } from '../lib/useDialog'
import { LG_MEDIA_QUERY, useMediaQuery } from '../lib/useMediaQuery'
import type { Level } from '../types/auth'
import Skeleton from './ui/Skeleton'
import Icon from './Icon'

interface ParaphrasePanelProps {
  isOpen: boolean
  term: string | null
  level: Level
  isLoading: boolean
  explanation: string | null
  /** 이 용어가 시장·투자판단에 어떻게 작용하는지 — 정의와 분리된 실전 해설 블록 */
  impact: string | null
  onClose: () => void
}

// 클릭 시 뜨는 in-place 설명 뷰 — 절대 페이지 이동 없이(PLAN.md §1 원칙 1) 설명을 보여준다.
// 넓은 화면(lg+): 우측 사이드 패널(비모달 — 본문을 계속 읽고 다른 용어도 누를 수 있다) /
// 그보다 좁으면(<lg): 백드롭 딸린 중앙 모달. md~lg 구간은 본문 폭이 좁아 패널을 옆에 둘 자리가 없어
// 모달로 처리한다(사이드 패널이 본문을 가리던 문제 방지). 본문 쪽 여백은 ArticleReaderPage 가 확보한다.
// Esc 로 닫히고, 열리면 닫기 버튼으로 포커스가 이동, 닫히면 누른 용어로 돌아간다(useDialog).
// "단어장 저장" 버튼은 term+level 조합으로 중복 저장을 막는다(vocabStore.saveTerm 이 upsert).
function ParaphrasePanel({
  isOpen,
  term,
  level,
  isLoading,
  explanation,
  impact,
  onClose,
}: ParaphrasePanelProps) {
  const saveTerm = useVocabStore((state) => state.saveTerm)
  const isSaved = useVocabStore((state) =>
    term ? state.entries.some((entry) => entry.term === term && entry.level === level) : false,
  )
  // 용어 숙련도 — 열어 본 기록(learningStore)과 단어장 저장 여부로 단계를 정한다
  const progress = useLearningStore((state) => (term ? state.terms[term] : undefined))
  const setMastered = useLearningStore((state) => state.setMastered)
  const stage = getMasteryStage(progress, isSaved)
  const isSidePanel = useMediaQuery(LG_MEDIA_QUERY)
  const dialogRef = useDialog<HTMLDivElement>(onClose, {
    enabled: isOpen && term !== null,
    trapFocus: !isSidePanel,
  })

  if (!isOpen || !term) return null

  function handleSave() {
    if (term && explanation) {
      // 영향 해설까지 함께 저장 — VocabPage 가 whitespace-pre-line 으로 줄바꿈을 살려 보여준다.
      saveTerm(term, impact ? `${explanation}\n\n→ ${impact}` : explanation, level)
    }
  }

  return (
    <>
      {/* 모바일 전용 백드롭 — 탭하면 모달 닫힘. 데스크톱 사이드 패널에서는 본문을 계속 읽을 수 있어야 하므로 없다 */}
      <div
        className="fixed inset-0 z-40 bg-black/40 motion-safe:animate-fade-in lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal={!isSidePanel}
        aria-label={`${term} 설명`}
        className="fixed inset-x-4 top-1/2 z-50 max-h-[80vh] -translate-y-1/2 overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-lg motion-safe:animate-modal-in lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-96 lg:max-w-full lg:translate-y-0 lg:rounded-none lg:border-0 lg:border-l lg:motion-safe:animate-slide-in-right"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-ink">{term}</h3>
            {stage && <MasteryBadge stage={stage} />}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded p-1 text-muted hover:bg-primary-50 hover:text-ink"
          >
            <Icon name="close" className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 text-sm" aria-busy={isLoading}>
          {isLoading ? (
            // 스켈레톤 — 설명 2~3줄 + 저장 버튼 자리를 미리 그려 로딩 중 레이아웃 점프를 막는다
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="mt-4 h-9 w-full rounded-lg" />
            </div>
          ) : (
            <>
              <p className="leading-relaxed text-ink">{explanation}</p>
              {impact && (
                <div className="mt-4 rounded-lg bg-primary-50 p-3">
                  <p className="text-xs font-bold text-primary-700">시장에선 이렇게 작동해요</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink">{impact}</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaved}
                className="mt-4 w-full rounded-lg border border-primary-600 py-1.5 text-sm font-medium text-primary-600 transition hover:bg-primary-50 disabled:cursor-default disabled:border-line disabled:text-muted disabled:hover:bg-transparent"
              >
                {isSaved ? '단어장에 저장됨' : '단어장 저장'}
              </button>
              {/* 스스로 확인하는 마스터 표시 — 누르면 되돌리기 버튼으로 바뀐다 */}
              <button
                type="button"
                onClick={() => setMastered(term, stage !== 'mastered')}
                aria-pressed={stage === 'mastered'}
                className="mt-2 w-full rounded-lg py-1.5 text-sm font-medium text-muted transition hover:bg-primary-50 hover:text-ink"
              >
                {stage === 'mastered' ? '다시 익히기' : '이제 알아요'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ParaphrasePanel
