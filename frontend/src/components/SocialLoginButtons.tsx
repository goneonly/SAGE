import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'
import type { SocialProvider } from '../types/auth'

// 카카오/구글 소셜 로그인 버튼 — 로그인·회원가입 화면 공용.
// 백엔드 OAuth 연동 전이라 authStore.socialLogin(mock)으로 즉시 로그인 처리한다.
// 버튼 색은 각 브랜드 가이드(카카오 #FEE500/검정, 구글 흰 배경/보더)를 따른다.

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7l-1 3.6c-.1.3.3.6.6.4l4.3-2.8c.5.1.9.1 1.4.1 5.5 0 10-3.6 10-8s-4.5-8-10-8z"
        fill="#191919"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1C3.3 21.3 7.3 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.3 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.3C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l4-3.1z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8L20 3.1C18 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z"
        fill="#EA4335"
      />
    </svg>
  )
}

function SocialLoginButtons() {
  const socialLogin = useAuthStore((state) => state.socialLogin)
  const navigate = useNavigate()
  const [pending, setPending] = useState<SocialProvider | null>(null)

  async function handleSocialLogin(provider: SocialProvider) {
    setPending(provider)
    try {
      await socialLogin(provider)
      navigate('/', { replace: true })
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-muted">또는</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        onClick={() => handleSocialLogin('kakao')}
        disabled={pending !== null}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] py-2 text-sm font-medium text-[#191919] transition hover:brightness-95 disabled:opacity-50"
      >
        <KakaoIcon />
        {pending === 'kakao' ? '카카오로 로그인 중...' : '카카오로 시작하기'}
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin('google')}
        disabled={pending !== null}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-surface py-2 text-sm font-medium text-ink transition hover:bg-bg disabled:opacity-50"
      >
        <GoogleIcon />
        {pending === 'google' ? '구글로 로그인 중...' : '구글로 시작하기'}
      </button>
    </div>
  )
}

export default SocialLoginButtons
