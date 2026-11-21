import PublicHeader from '../../components/PublicHeader'
import Footer from '../../components/Footer'
import { usePageTitle } from '../../lib/usePageTitle'
import './about.css'
import { useScrollProgress } from './motion'
import Compare from './sections/Compare'
import Cta from './sections/Cta'
import Features from './sections/Features'
import Hero from './sections/Hero'
import Numbers from './sections/Numbers'
import Showcase from './sections/Showcase'

// About — SAGE 서비스 소개이자 로그아웃 상태의 랜딩 페이지(공개 라우트).
// 이 파일은 구간의 순서만 정한다. 구간은 sections/, 문구는 content.ts,
// 브라우저 창 속 화면 예시는 screens.tsx(가짜 데이터), 움직임은 motion.tsx 와 about.css.
// 브랜드 얼굴이라 사용자가 고른 화면 테마와 상관없이 항상 라이트(브랜드 그린)로 보여 준다.
function AboutPage() {
  usePageTitle()
  const pageRef = useScrollProgress('pin') // 페이지를 내려간 비율 — 상단 진행 막대

  return (
    <div ref={pageRef} className="theme-light min-h-dvh overflow-x-clip bg-bg text-ink">
      <PublicHeader />
      {/* 상단바 바로 아래 진행 막대 — 페이지를 내려간 만큼 늘어난다(about.css) */}
      <i
        className="about-progress fixed inset-x-0 top-16 z-20 block h-0.5 bg-primary-600"
        aria-hidden="true"
      />
      <main>
        <Hero />
        <Showcase />
        <Numbers />
        <Compare />
        <Features />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage
