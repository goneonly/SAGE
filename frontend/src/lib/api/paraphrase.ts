import { findSeedTerm } from '../../features/paraphrase/seedTerms'
import type { Level } from '../../types/auth'

// TODO(backend): FastAPI 붙으면 POST /api/paraphrase 호출로 교체
// (PLAN.md §4 — 캐시 조회 → 미스 시 Claude 호출 → term_cache 저장 → 반환).
// 지금은 백엔드가 없으므로 이 파일이 term_cache 역할까지 대신한다:
//   (a) in-memory + localStorage 맵에서 캐시 조회
//   (b) 미스면 seed 사전에서 설명을 찾고(없으면 fallback 문구), 인위적 지연으로 비동기 호출 흉내
//   (c) 결과를 캐시에 저장 — 재조회 시 즉시 반환(캐시 히트)

const CACHE_STORAGE_KEY = 'ufn-term-cache'
const MOCK_LATENCY_RANGE_MS = [300, 600] as const
const FALLBACK_EXPLANATION = '설명을 생성하는 중...'

type CacheMap = Record<string, string>

function loadCache(): CacheMap {
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CacheMap) : {}
  } catch {
    return {}
  }
}

function persistCache(cache: CacheMap) {
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // localStorage 사용 불가(프라이빗 모드 등) 시 인메모리 캐시만으로 계속 동작.
  }
}

// 모듈 로드 시 1회만 localStorage 에서 읽어와 인메모리에 들고 있는다.
const cache: CacheMap = loadCache()

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, '')
}

// PLAN.md §4 cache_key = hash(정규화 텍스트 + level + context_id) 를 문자열 키로 단순화한 버전.
function buildCacheKey(term: string, level: Level, articleId?: string): string {
  return `${normalize(term)}|${level}|${articleId ?? ''}`
}

function randomDelay(): number {
  const [min, max] = MOCK_LATENCY_RANGE_MS
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 캐시만 확인하고 즉시 반환(비동기 아님) — UI에서 로딩 스피너를 띄울지 미리 판단할 때 사용. */
export function peekParaphraseCache(term: string, level: Level, articleId?: string): string | null {
  return cache[buildCacheKey(term, level, articleId)] ?? null
}

export async function getParaphrase(
  term: string,
  level: Level,
  articleId?: string,
): Promise<string> {
  const cacheKey = buildCacheKey(term, level, articleId)

  const cached = cache[cacheKey]
  if (cached) {
    return cached
  }

  await new Promise((resolve) => setTimeout(resolve, randomDelay()))

  const seedMatch = findSeedTerm(term)
  const explanation = seedMatch ? seedMatch.explanations[level] : FALLBACK_EXPLANATION

  cache[cacheKey] = explanation
  persistCache(cache)

  return explanation
}
