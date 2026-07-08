import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Pretendard — 한글 글리프가 많아 전체 로드 대신 사용 글자만 내려받는 dynamic-subset 사용
import 'pretendard/dist/web/static/pretendard-dynamic-subset.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
