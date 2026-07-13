import type { Level, SocialProvider, User } from '../../types/auth'

// TODO(backend): FastAPI 붙으면 이 파일만 실제 fetch(`${API_BASE_URL}/api/auth/...`) 호출로 교체.
// 지금은 백엔드가 없으므로 mock 검증(빈 값만 아니면 통과)으로 대체한다.
// 호출부(authStore)는 이 함수 시그니처만 알면 되므로 나중에 교체해도 스토어/컴포넌트는 그대로 둘 수 있다.

const MOCK_LATENCY_MS = 200

// 소셜 로그인 mock 프로필 — 실제 OAuth 연동 전까지 제공자별 더미 계정을 돌려준다.
const MOCK_SOCIAL_PROFILE: Record<SocialProvider, { email: string; name: string }> = {
  kakao: { email: 'sage.user@kakao.mock', name: '카카오 사용자' },
  google: { email: 'sage.user@google.mock', name: '구글 사용자' },
}

export interface SignupProfile {
  name: string
  phone: string
  /** 선택 입력 — 값이 있으면 정수 */
  age?: number
}

function assertNonEmpty(email: string, password: string) {
  if (!email.trim() || !password.trim()) {
    throw new Error('이메일과 비밀번호를 입력해주세요.')
  }
}

// 운영자 이메일 — 이 이메일로 가입/로그인하면 자동으로 admin 권한이 부여된다.
// TODO(backend): 실제 백엔드 연동 시 서버(DB)에서 role 을 내려주는 방식으로 교체.
const ADMIN_EMAILS = ['4onlygone@gmail.com']

function roleForEmail(email: string): User['role'] {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase()) ? 'admin' : 'user'
}

function mockUser(email: string, level: Level = 'beginner', extra: Partial<User> = {}): User {
  return {
    id: crypto.randomUUID(),
    email,
    level,
    provider: 'email',
    role: roleForEmail(email),
    ...extra,
  }
}

export async function login(email: string, password: string): Promise<User> {
  assertNonEmpty(email, password)
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
  return mockUser(email)
}

export async function signup(
  email: string,
  password: string,
  level: Level = 'beginner',
  profile?: SignupProfile,
): Promise<User> {
  assertNonEmpty(email, password)
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
  return mockUser(email, level, { name: profile?.name, phone: profile?.phone, age: profile?.age })
}

// 카카오/구글 소셜 로그인 mock — 실제로는 OAuth 리디렉션 후 백엔드가 토큰을 교환한다.
export async function socialLogin(provider: SocialProvider): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
  const { email, name } = MOCK_SOCIAL_PROFILE[provider]
  return mockUser(email, 'beginner', { name, provider })
}
