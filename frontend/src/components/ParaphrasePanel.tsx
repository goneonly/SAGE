interface ParaphrasePanelProps {
  isOpen: boolean
  term: string | null
  isLoading: boolean
  explanation: string | null
  onClose: () => void
}

// 클릭 시 뜨는 in-place 사이드 패널 — 절대 페이지 이동 없이(PLAN.md §1 원칙 1) 설명을 보여준다.
function ParaphrasePanel({ isOpen, term, isLoading, explanation, onClose }: ParaphrasePanelProps) {
  if (!isOpen || !term) return null

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
          <p className="leading-relaxed text-ink">{explanation}</p>
        )}
      </div>
    </div>
  )
}

export default ParaphrasePanel
