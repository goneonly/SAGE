import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ScrapEntry } from '../../types/scrap'

interface ScrapArticleInput {
  id: string
  title: string
  source: string
  publishedAt: string
}

function buildEntry(article: ScrapArticleInput): ScrapEntry {
  return {
    id: crypto.randomUUID(),
    articleId: article.id,
    title: article.title,
    source: article.source,
    publishedAt: article.publishedAt,
    createdAt: new Date().toISOString(),
  }
}

interface ScrapState {
  entries: ScrapEntry[]
  addScrap: (article: ScrapArticleInput) => void
  removeScrap: (articleId: string) => void
  toggleScrap: (article: ScrapArticleInput) => void
}

export const useScrapStore = create<ScrapState>()(
  persist(
    (set) => ({
      entries: [],
      addScrap: (article) =>
        set((state) => {
          if (state.entries.some((entry) => entry.articleId === article.id)) return state
          return { entries: [...state.entries, buildEntry(article)] }
        }),
      removeScrap: (articleId) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.articleId !== articleId),
        })),
      toggleScrap: (article) =>
        set((state) => {
          const alreadyScrapped = state.entries.some((entry) => entry.articleId === article.id)
          if (alreadyScrapped) {
            return { entries: state.entries.filter((entry) => entry.articleId !== article.id) }
          }
          return { entries: [...state.entries, buildEntry(article)] }
        }),
    }),
    { name: 'sage-scrap' },
  ),
)
