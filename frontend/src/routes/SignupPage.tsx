import { type FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import { usePageTitle } from '../lib/usePageTitle'
import Logo from '../components/Logo'
import SocialLoginButtons from '../components/SocialLoginButtons'
import PrivacyConsentModal from '../components/PrivacyConsentModal'
import { clearOnboardingPending, markOnboardingPending } from '../lib/onboarding'
import type { Level } from '../types/auth'

const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: 'beginner', label: '기초' },
  { value: 'intermediate', label: '성장' },
  { value: 'advanced', label: '심화' },
]

// 전화번호 입력 마스크 — 숫자 외 문자는 버리고 휴대폰 11자리까지만 받아
// 010-0000-0000 형태로 하이픈을 자동으로 붙인다.
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const PHONE_PATTERN = /^010-\d{4}-\d{4}$/

// 필수 입력 표시 — 라벨 텍스트 왼쪽 위에 붙는 빨간 별표.
// 입력 요소의 required 속성이 접근성을 담당하므로 시각 장식으로만 취급한다.
function RequiredMark() {
  return (
    <span aria-hidden="true" className="mr-0.5 align-top leading-none text-rise">
      *
    </span>
  )
}

function SignupPage() {
  usePageTitle('회원가입')
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const signup = useAuthStore((state) => state.signup)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  // 나이는 선택 입력 — 입력 단계에서 숫자만 남겨 정수만 들어오게 한다.
  const [age, setAge] = useState('')
  const [level, setLevel] = useState<Level>('beginner')
  // 개인정보 수집·이용 동의(필수) — 미동의 시 가입을 차단한다.
  const [agreed, setAgreed] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    // 마스크가 형식을 강제하지만, 자릿수가 모자라거나(010-123) 010 번호가 아닌 경우를 걸러낸다.
    if (!PHONE_PATTERN.test(phone)) {
      setError('전화번호를 010-0000-0000 형식으로 입력해 주세요.')
      return
    }

    // 나이는 선택 입력이지만, 입력했다면 상식적인 범위의 정수여야 한다.
    const ageNumber = age === '' ? undefined : Number(age)
    if (ageNumber !== undefined && (ageNumber < 1 || ageNumber > 120)) {
      setError('나이는 1~120 사이의 숫자로 입력해 주세요.')
      return
    }

    if (!agreed) {
      setError('개인정보 수집 및 이용에 동의해 주세요.')
      return
    }

    setIsSubmitting(true)
    // 가입 완료 후 홈에서 온보딩 팝업을 띄우기 위한 플래그.
    // 인증 상태가 바뀌는 순간 리다이렉트가 일어날 수 있으므로 요청 "전"에 저장하고, 실패하면 되돌린다.
    markOnboardingPending()
    try {
      await signup(email, password, level, { name, phone, age: ageNumber })
      navigate('/', { replace: true })
    } catch (err) {
      clearOnboardingPending()
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <div className="w-full max-w-sm">
        {/* 카드 왼쪽 상단 위 — 서비스 소개(About) 랜딩으로 돌아가기 */}
        <Link
          to="/about"
          className="mb-3 inline-flex items-center text-sm font-medium text-muted transition-colors hover:text-primary-600"
        >
          ← 홈으로
        </Link>
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 rounded-xl border border-line bg-surface p-8 shadow-sm"
        >
          <div className="flex flex-col items-center gap-1">
            {/* 로고·워드마크 클릭 시에도 About 랜딩으로 */}
            <Link to="/about" aria-label="서비스 소개로 이동">
              <Logo size={40} wordmarkClassName="text-xl" />
            </Link>
            <p className="text-sm italic text-muted">Be a smart investor with SAGE.</p>
          </div>
          <h1 className="text-center text-lg font-bold text-ink">회원가입</h1>
          <p className="text-xs text-muted">
            <span className="text-rise">*</span> 표시는 필수 입력 항목입니다.
          </p>

          <label className="block text-sm">
            <span className="mb-1 block text-muted">
              <RequiredMark />
              이름
            </span>
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              // 이름에 숫자는 올 수 없으므로 입력 즉시 걸러낸다
              onChange={(event) => setName(event.target.value.replace(/\d/g, ''))}
              className="w-full rounded-lg border border-line px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-muted">나이</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={3}
              placeholder="선택 입력"
              value={age}
              onChange={(event) => setAge(event.target.value.replace(/\D/g, ''))}
              className="w-full rounded-lg border border-line px-3 py-2 placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-muted">
              <RequiredMark />
              전화번호
            </span>
            <input
              type="tel"
              required
              autoComplete="tel"
              inputMode="numeric"
              maxLength={13}
              placeholder="010-0000-0000"
              value={phone}
              onChange={(event) => setPhone(formatPhone(event.target.value))}
              className="w-full rounded-lg border border-line px-3 py-2 placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-muted">
              <RequiredMark />
              이메일
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-line px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-muted">
              <RequiredMark />
              비밀번호
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-line px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-muted">
              <RequiredMark />
              투자 이해도
            </span>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as Level)}
              className="w-full rounded-lg border border-line px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {LEVEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {/* 개인정보 수집·이용 동의 (필수) */}
          <div className="text-sm">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-0.5 accent-primary-600"
              />
              <span className="text-muted">
                <RequiredMark />
                개인정보 수집 및 이용에 동의합니다.
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="ml-6 mt-1 text-xs text-primary-600 underline hover:text-primary-600/80"
            >
              자세히 보기
            </button>
          </div>

          {error && <p className="text-sm text-rise">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary-600 py-2 font-medium text-white transition hover:bg-primary-600/90 disabled:opacity-50"
          >
            {isSubmitting ? '가입 중...' : '회원가입'}
          </button>

          <SocialLoginButtons />

          <p className="text-center text-sm text-muted">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              로그인
            </Link>
          </p>
        </form>
      </div>
      {showPrivacy && <PrivacyConsentModal onClose={() => setShowPrivacy(false)} />}
    </div>
  )
}

export default SignupPage
