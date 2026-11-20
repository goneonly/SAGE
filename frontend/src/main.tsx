import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// 테마 클래스를 첫 렌더 전에 <html> 에 붙인다(설정 화면에 들어가지 않아도 저장된 테마가 적용되도록)
import './lib/store/themeStore'
// Pretendard — 한글 글리프가 많아 전체 로드 대신 사용 글자만 내려받는 dynamic-subset 사용
import 'pretendard/dist/web/static/pretendard-dynamic-subset.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
