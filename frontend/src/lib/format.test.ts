import { describe, expect, it } from 'vitest'
import { formatSignedPercent, formatWon, truncateText } from './format'

describe('formatSignedPercent', () => {
  it('양수에만 + 를 붙이고 소수 둘째 자리까지 표기한다', () => {
    expect(formatSignedPercent(4.4213)).toBe('+4.42%')
    expect(formatSignedPercent(-2.38)).toBe('-2.38%')
    expect(formatSignedPercent(0)).toBe('0.00%')
  })
})

describe('formatWon', () => {
  it('반올림해 천 단위 구분자와 "원"을 붙인다', () => {
    expect(formatWon(1234567.6)).toBe('1,234,568원')
  })
})

describe('truncateText', () => {
  it('줄바꿈을 공백으로 잇고 길이를 넘으면 말줄임표를 붙인다', () => {
    expect(truncateText('첫 문단\n\n둘째 문단', 100)).toBe('첫 문단 둘째 문단')
    expect(truncateText('가나다라마바사', 3)).toBe('가나다…')
  })
})
