import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, type Location } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import Logo from '../components/Logo'
import SocialLoginButtons from '../components/SocialLoginButtons'

function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    const from = (location.state as { from?: Location } | undefined)?.from
    return <Navigate to={from?.pathname ?? '/'} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-line bg-white p-8 shadow-sm"
      >
        <div className="flex flex-col items-center gap-1">
          <Logo size={40} wordmarkClassName="text-xl" />
          <p className="text-xs italic text-muted">Be a smart investor with SAGE.</p>
        </div>
        <h1 className="text-center text-lg font-bold text-ink">로그인</h1>

        <label className="block text-sm">
          <span className="mb-1 block text-muted">이메일</span>
          <input
            type="email"
            required
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

        {error && <p className="text-sm text-rise">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary-600 py-2 font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>

        <SocialLoginButtons />

        <p className="text-center text-sm text-muted">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-primary-600 hover:underline">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
