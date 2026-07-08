import { useVocabStore } from '../lib/store/vocabStore'
import type { Level } from '../types/auth'

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

// 클릭 시 뜨는 in-place 사이드 패널 — 절대 페이지 이동 없이(PLAN.md §1 원칙 1) 설명을 보여준다.
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

  if (!isOpen || !term) return null

  function handleSave() {
    if (term && explanation) {
      // 영향 해설까지 함께 저장 — VocabPage 가 whitespace-pre-line 으로 줄바꿈을 살려 보여준다.
      saveTerm(term, impact ? `${explanation}\n\n👉 ${impact}` : explanation, level)
    }
  }

  return (
    <div
      role="dialog"
      aria-label={`${term} 설명`}
      className="fixed inset-y-0 right-0 z-50 w-80 max-w-full overflow-y-auto border-l border-line bg-surface p-5 shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-ink">{term}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="rounded p-1 text-muted hover:bg-primary-50 hover:text-ink"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 text-sm">
        {isLoading ? (
          <p className="text-muted">설명을 불러오는 중...</p>
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
          </>
        )}
      </div>
    </div>
  )
}

export default ParaphrasePanel
