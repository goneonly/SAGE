import { useVocabStore } from '../../lib/store/vocabStore'
import type { Level } from '../../types/auth'

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
  const entries = useVocabStore((state) => state.entries)
  const removeEntry = useVocabStore((state) => state.removeEntry)

  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-ink">단어장</h1>

      {sorted.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          아직 저장한 단어가 없어요. 기사 안에서 하이라이트된 용어를 클릭하고 "단어장 저장"을
          눌러보세요.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {sorted.map((entry) => (
            <li key={entry.id} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-ink">{entry.term}</h2>
                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                      {LEVEL_LABEL[entry.level]}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">
                    {entry.explanation}
                  </p>
                  <p className="mt-2 text-xs text-muted">{formatDate(entry.createdAt)} 저장</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  aria-label={`${entry.term} 삭제`}
                  className="shrink-0 rounded px-2 py-1 text-xs text-muted hover:bg-primary-50 hover:text-rise"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default VocabPage
