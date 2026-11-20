// 날짜·금액·등락률 표기 공용 포매터 — 화면마다 같은 함수를 복사해 쓰지 않도록 한 곳에 모은다.
// 전부 한국어 로케일(ko-KR) 기준.

/** 7. 6. 오전 08:12 — 목록 카드의 짧은 일시 */
export function formatDateTimeShort(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** 2026년 7월 6일 오전 08:12 — 기사 상세의 전체 일시 */
export function formatDateTimeLong(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** 2026년 7월 6일 — 날짜만 */
export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** 75,000원 — 원 단위 반올림 */
export function formatWon(value: number): string {
  return `${Math.round(value).toLocaleString('ko-KR')}원`
}

/** +4.42% / -2.38% — 양수에만 + 부호를 붙인다(색만으로 등락을 구분하지 않기 위함) */
export function formatSignedPercent(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/** 기사 본문을 한 줄 요약용으로 자른다 — 줄바꿈은 공백으로 잇는다 */
export function truncateText(text: string, length: number): string {
  const flat = text.replace(/\s*\n\s*/g, ' ').trim()
  return flat.length > length ? `${flat.slice(0, length)}…` : flat
}
