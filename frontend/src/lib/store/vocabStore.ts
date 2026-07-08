import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Level } from '../../types/auth'
import type { VocabEntry } from '../../types/vocab'

interface VocabState {
  entries: VocabEntry[]
  saveTerm: (term: string, explanation: string, level: Level) => void
  removeEntry: (id: string) => void
}

export const useVocabStore = create<VocabState>()(
  persist(
    (set) => ({
      entries: [],
      saveTerm: (term, explanation, level) =>
        set((state) => {
          const existingIndex = state.entries.findIndex(
            (entry) => entry.term === term && entry.level === level,
          )
          if (existingIndex !== -1) {
            // 이미 저장된 term+level 조합 — 새 항목을 추가하는 대신 설명만 최신화한다(idempotent upsert).
            const entries = [...state.entries]
            entries[existingIndex] = { ...entries[existingIndex], explanation }
            return { entries }
          }
          return {
            entries: [
              ...state.entries,
              {
                id: crypto.randomUUID(),
                term,
                explanation,
                level,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        }),
      removeEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) })),
    }),
    { name: 'sage-vocab' },
  ),
)
