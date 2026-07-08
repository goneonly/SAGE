import { type FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import Logo from '../components/Logo'
import SocialLoginButtons from '../components/SocialLoginButtons'
import type { Level } from '../types/auth'

const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: 'beginner', label: '입문 (주린이)' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
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

function SignupPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const signup = useAuthStore((state) => state.signup)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [level, setLevel] = useState<Level>('beginner')
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

    setIsSubmitting(true)
    try {
      await signup(email, password, level, { name, phone })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-line bg-surface p-8 shadow-sm"
      >
        <div className="flex flex-col items-center gap-1">
          <Logo size={40} wordmarkClassName="text-xl" />
          <p className="text-sm italic text-muted">Be a smart investor with SAGE.</p>
        </div>
        <h1 className="text-center text-lg font-bold text-ink">회원가입</h1>

        <label className="block text-sm">
          <span className="mb-1 block text-muted">이름</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-muted">전화번호</span>
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
          <span className="mb-1 block text-muted">이메일</span>
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
          <span className="mb-1 block text-muted">비밀번호</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-muted">투자 레벨</span>
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

        {error && <p className="text-sm text-rise">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary-600 py-2 font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
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
  )
}

export default SignupPage
