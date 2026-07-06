import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './routes/LoginPage'
import SignupPage from './routes/SignupPage'
import ComingSoonPage from './routes/ComingSoonPage'
import HomePage from './features/home/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<ComingSoonPage title="뉴스" />} />
            <Route path="/scrap" element={<ComingSoonPage title="스크랩" />} />
            <Route path="/vocab" element={<ComingSoonPage title="단어장" />} />
            <Route path="/top-movers" element={<ComingSoonPage title="급상승 종목" />} />
            <Route path="/portfolio" element={<ComingSoonPage title="포트폴리오" />} />
            <Route path="/insights" element={<ComingSoonPage title="AI 투자 인사이트" />} />
            <Route path="/settings" element={<ComingSoonPage title="설정" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
