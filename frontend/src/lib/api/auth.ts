import type { Level, User } from '../../types/auth'

// TODO(backend): FastAPI 붙으면 이 파일만 실제 fetch(`${API_BASE_URL}/api/auth/...`) 호출로 교체.
// 지금은 백엔드가 없으므로 mock 검증(빈 값만 아니면 통과)으로 대체한다.
// 호출부(authStore)는 이 함수 시그니처만 알면 되므로 나중에 교체해도 스토어/컴포넌트는 그대로 둘 수 있다.

const MOCK_LATENCY_MS = 200

function assertNonEmpty(email: string, password: string) {
  if (!email.trim() || !password.trim()) {
    throw new Error('이메일과 비밀번호를 입력해주세요.')
  }
}

function mockUser(email: string, level: Level = 'beginner'): User {
  return {
    id: crypto.randomUUID(),
    email,
    level,
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
): Promise<User> {
  assertNonEmpty(email, password)
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
  return mockUser(email, level)
}
