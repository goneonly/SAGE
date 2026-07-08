// PLAN.md §7 users.level enum
export type Level = 'beginner' | 'intermediate' | 'advanced'

// 소셜 로그인 제공자 — 백엔드 OAuth 연동 전까지는 mock 으로만 동작한다.
export type SocialProvider = 'kakao' | 'google'

export interface User {
  id: string
  email: string
  level: Level
  name?: string
  phone?: string
  /** 나이(만 나이 정수) — 회원가입 시 선택 입력이라 없을 수 있다 */
  age?: number
  /** 가입 경로 — 이메일 가입이면 'email', 소셜이면 제공자명 */
  provider?: 'email' | SocialProvider
}
