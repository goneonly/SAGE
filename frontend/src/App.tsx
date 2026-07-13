import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import AppShell from './components/AppShell'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './routes/ProtectedRoute'

// 페이지 코드 스플리팅 — 라우트 진입 시점에 해당 청크만 내려받는다.
// 셸(AppShell)·가드(ProtectedRoute)는 모든 화면의 공통 골격이라 eager 로 남긴다.
const AboutPage = lazy(() => import('./features/about/AboutPage'))
const NoticesPage = lazy(() => import('./features/notices/NoticesPage'))
const LoginPage = lazy(() => import('./routes/LoginPage'))
const SignupPage = lazy(() => import('./routes/SignupPage'))
const HomePage = lazy(() => import('./features/home/HomePage'))
const NewsPage = lazy(() => import('./features/news/NewsPage'))
const ArticleReaderPage = lazy(() => import('./features/reader/ArticleReaderPage'))
const SettingsPage = lazy(() => import('./routes/SettingsPage'))
const AdminPage = lazy(() => import('./routes/AdminPage'))
const VocabPage = lazy(() => import('./features/vocab/VocabPage'))
const ScrapPage = lazy(() => import('./features/scrap/ScrapPage'))
const PortfolioPage = lazy(() => import('./features/portfolio/PortfolioPage'))
const TopMoversPage = lazy(() => import('./features/topmovers/TopMoversPage'))
const InsightsPage = lazy(() => import('./features/insights/InsightsPage'))

// 청크 로딩 중 표시할 최소 폴백 — 화면 전환이 빨라 대부분 스치듯 지나간다.
function RouteFallback() {
  return (
    <div aria-busy="true" className="flex min-h-[50vh] items-center justify-center bg-bg">
      <div
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary-600"
      />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      {/* 렌더링 예외 최후 방어선 — 어떤 화면에서 터져도 재시도 UI 를 보여준다 */}
      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* 공개 라우트 — About 은 로그아웃 상태의 랜딩 페이지를 겸한다 */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/article/:id" element={<ArticleReaderPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/scrap" element={<ScrapPage />} />
                <Route path="/vocab" element={<VocabPage />} />
                <Route path="/top-movers" element={<TopMoversPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* 운영자 전용 — AdminPage 내부에서 role 검사 후 비운영자는 홈으로 돌려보낸다 */}
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      {/* Vercel Web Analytics — 배포 환경에서 모든 라우트의 페이지뷰를 자동 집계 */}
      <Analytics />
    </BrowserRouter>
  )
}

export default App
