import { useVocabStore } from '../lib/store/vocabStore'
import type { Level } from '../types/auth'

interface ParaphrasePanelProps {
  isOpen: boolean
  term: string | null
  level: Level
  isLoading: boolean
  explanation: string | null
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
  onClose,
}: ParaphrasePanelProps) {
  const saveTerm = useVocabStore((state) => state.saveTerm)
  const isSaved = useVocabStore((state) =>
    term ? state.entries.some((entry) => entry.term === term && entry.level === level) : false,
  )

  if (!isOpen || !term) return null

  function handleSave() {
    if (term && explanation) {
      saveTerm(term, explanation, level)
    }
  }

  return (
    <div
      role="dialog"
      aria-label={`${term} 설명`}
      className="fixed inset-y-0 right-0 z-50 w-80 max-w-full overflow-y-auto border-l border-line bg-white p-5 shadow-lg"
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
