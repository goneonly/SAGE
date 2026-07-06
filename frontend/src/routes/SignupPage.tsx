import { type FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import type { Level } from '../types/auth'

const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: 'beginner', label: '입문 (주린이)' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
]

function SignupPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const signup = useAuthStore((state) => state.signup)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [level, setLevel] = useState<Level>('beginner')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await signup(email, password, level)
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
        className="w-full max-w-sm space-y-4 rounded-lg border border-line bg-white p-8 shadow-sm"
      >
        <h1 className="text-center text-xl font-bold text-primary-600">UFN 회원가입</h1>

        <label className="block text-sm">
          <span className="mb-1 block text-muted">이메일</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-line px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-muted">비밀번호</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-line px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-muted">투자 레벨</span>
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value as Level)}
            className="w-full rounded-md border border-line px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          className="w-full rounded-md bg-primary-600 py-2 font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>

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
