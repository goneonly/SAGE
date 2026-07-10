import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import { useThemeStore, type Theme } from '../lib/store/themeStore'
import { usePageTitle } from '../lib/usePageTitle'
import type { Level } from '../types/auth'
import Container from '../components/ui/Container'
import PageTitle from '../components/ui/PageTitle'

const LEVEL_OPTIONS: { value: Level; label: string; description: string }[] = [
  {
    value: 'beginner',
    label: '기초',
    description: '쉬운 비유와 일상적인 표현으로 설명해드려요.',
  },
  {
    value: 'intermediate',
    label: '성장',
    description: '정확한 정의와 계산식 위주로 설명해드려요.',
  },
  {
    value: 'advanced',
    label: '심화',
    description: '전문 용어와 실무 뉘앙스를 포함해 간결하게 설명해드려요.',
  },
]

const THEME_OPTIONS: { value: Theme; label: string; description: string }[] = [
  { value: 'light', label: '라이트 모드', description: '밝은 배경의 기본 테마예요.' },
  { value: 'dark', label: '다크 모드', description: '어두운 배경으로 눈의 부담을 줄여줘요.' },
]

// 설정 화면 (Phase 0 ComingSoonPage 스텁을 대체) — 레벨 변경은 authStore.updateLevel 을
// 통해 저장되고, persist 미들웨어가 localStorage 에도 반영한다. 리더 화면의 HighlightText/
// ParaphrasePanel 은 이 store 값을 그대로 읽으므로 여기서 바꾸면 바로 반영된다.
function SettingsPage() {
  usePageTitle('설정')
  const user = useAuthStore((state) => state.user)
  const updateLevel = useAuthStore((state) => state.updateLevel)
  const logout = useAuthStore((state) => state.logout)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const navigate = useNavigate()
  const [justSaved, setJustSaved] = useState(false)

  if (!user) return null

  function handleChange(level: Level) {
    updateLevel(level)
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 1500)
  }

  // 상단바에서 로그아웃 버튼을 없애면서 설정으로 이동 — 로그아웃하면 About 랜딩으로
  function handleLogout() {
    logout()
    navigate('/about', { replace: true })
  }

  return (
    <Container size="sm">
      <PageTitle title="설정" />

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-muted">내 정보</h2>
        {/* 이름/전화번호는 이메일 가입(입력값) 또는 소셜 mock 프로필에서 오고, 없으면 '-' */}
        <dl className="mt-2 space-y-2 text-sm">
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-muted">이름</dt>
            <dd className="text-ink">{user.name ?? '-'}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-muted">나이</dt>
            <dd className="text-ink">{user.age != null ? `${user.age}세` : '-'}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-muted">전화번호</dt>
            <dd className="text-ink">{user.phone ?? '-'}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-muted">이메일</dt>
            <dd className="text-ink">{user.email}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-muted">투자 이해도</h2>
        <p className="mt-1 text-xs text-muted">
          이해도에 따라 용어 설명의 난이도와 하이라이트되는 용어 범위가 달라져요.
        </p>

        <div className="mt-3 space-y-2">
          {LEVEL_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                user.level === option.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-line hover:bg-bg'
              }`}
            >
              <input
                type="radio"
                name="level"
                value={option.value}
                checked={user.level === option.value}
                onChange={() => handleChange(option.value)}
                className="mt-1 accent-primary-600"
              />
              <span>
                <span className="block text-sm font-medium text-ink">{option.label}</span>
                <span className="block text-xs text-muted">{option.description}</span>
              </span>
            </label>
          ))}
        </div>

        {justSaved && <p className="mt-2 text-xs text-primary-600">저장되었습니다.</p>}
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-muted">화면 테마</h2>
        <p className="mt-1 text-xs text-muted">선택 즉시 적용되고, 다음 접속 때도 유지돼요.</p>

        <div className="mt-3 space-y-2">
          {THEME_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                theme === option.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-line hover:bg-bg'
              }`}
            >
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={theme === option.value}
                onChange={() => setTheme(option.value)}
                className="mt-1 accent-primary-600"
              />
              <span>
                <span className="block text-sm font-medium text-ink">{option.label}</span>
                <span className="block text-xs text-muted">{option.description}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* 계정 — 다른 섹션과 같은 h2 + 설명 + 컨트롤 패턴. 파괴적 동작이라 맨 아래 배치 */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-muted">계정</h2>
        <p className="mt-1 text-xs text-muted">로그아웃하면 서비스 소개 화면으로 이동해요.</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 rounded-full border-2 border-primary-600 px-4 py-1.5 text-xs font-semibold text-primary-600 transition-all hover:bg-primary-600 hover:text-white"
        >
          로그아웃
        </button>
      </section>
    </Container>
  )
}

export default SettingsPage
