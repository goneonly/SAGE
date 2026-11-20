import PublicHeader from '../../components/PublicHeader'
import Footer from '../../components/Footer'
import { usePageTitle } from '../../lib/usePageTitle'
import HeroSection from './sections/HeroSection'
import HighlightDemoSection from './sections/HighlightDemoSection'
import LevelPreviewSection from './sections/LevelPreviewSection'
import LearningStepsSection from './sections/LearningStepsSection'
import CtaSection from './sections/CtaSection'

// About — SAGE 서비스 소개이자 로그아웃 상태의 랜딩 페이지(공개 라우트).
// 각 섹션은 sections/ 하위 컴포넌트로 분리되어 있고, 이 파일은 순서 조합만 담당한다.
// 스크롤 연출(Reveal)은 features/about/Reveal.tsx 참고.
// 서비스 소개는 브랜드 얼굴이라, 사용자가 고른 화면 테마(매거진·다크)와 상관없이 항상 라이트(브랜드 그린)로 보여준다.
function AboutPage() {
  usePageTitle()

  return (
    <div className="theme-light min-h-dvh bg-bg text-ink">
      <PublicHeader />
      <HeroSection />
      <HighlightDemoSection />
      <LevelPreviewSection />
      <LearningStepsSection />
      <CtaSection />
      <Footer />
    </div>
  )
}

export default AboutPage
