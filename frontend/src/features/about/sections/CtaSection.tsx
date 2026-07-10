import { Link } from 'react-router-dom'
import { useAuthStore } from '../../../lib/store/authStore'
import Reveal from '../Reveal'

// 5. 신뢰 고지 + CTA — 뷰포트를 거의 채워(min-h-[90vh]) 맨 아래로 스크롤했을 때
// 위 다크 밴드가 화면 밖으로 밀려나게 한다. 로그인 상태면 홈으로, 아니면 로그인으로.
function CtaSection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 py-28 text-center">
      <Reveal>
        <h2 className="text-3xl font-bold leading-snug text-ink md:text-5xl">
          Be A Smart Investor
          <br />
          with SAGE!
        </h2>
      </Reveal>
      <Reveal delay={150}>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted">
          SAGE의 설명과 인사이트는 AI가 생성해요.
          <br />
          투자 결정은 반드시 본인의 판단과 책임하에 진행해주세요.
        </p>
      </Reveal>
      <Reveal delay={300}>
        <Link
          to={isAuthenticated ? '/' : '/login'}
          className="mt-10 inline-block rounded-full bg-primary-600 px-8 py-3 text-base font-semibold text-white shadow-eco-btn transition hover:bg-primary-600/90"
        >
          지금 시작하기
        </Link>
      </Reveal>
    </section>
  )
}

export default CtaSection
