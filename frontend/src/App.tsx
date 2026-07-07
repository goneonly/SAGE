import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './routes/LoginPage'
import SignupPage from './routes/SignupPage'
import HomePage from './features/home/HomePage'
import NewsPage from './features/news/NewsPage'
import ArticleReaderPage from './features/reader/ArticleReaderPage'
import SettingsPage from './routes/SettingsPage'
import VocabPage from './features/vocab/VocabPage'
import ScrapPage from './features/scrap/ScrapPage'
import PortfolioPage from './features/portfolio/PortfolioPage'
import TopMoversPage from './features/topmovers/TopMoversPage'
import InsightsPage from './features/insights/InsightsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
