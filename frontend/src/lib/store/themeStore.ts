import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'magazine' | 'light' | 'dark'

/** 저장된 선택이 없을 때의 기본 테마 */
const DEFAULT_THEME: Theme = 'magazine'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// <html> 에 .magazine / .dark 클래스를 붙였다 떼는 것만으로 index.css 의 CSS 변수 팔레트가
// 통째로 바뀌므로, 개별 컴포넌트는 테마를 몰라도 된다. 라이트는 클래스 없는 :root 팔레트다.
function applyTheme(theme: Theme) {
  const classList = document.documentElement.classList
  classList.toggle('dark', theme === 'dark')
  classList.toggle('magazine', theme === 'magazine')
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
    }),
    { name: 'sage-theme' },
  ),
)

// 앱 시작 시 1회 적용 — localStorage 복원은 스토어 생성 중에 동기로 끝나므로 여기서 읽으면
// 저장된 테마(없으면 기본 매거진)가 나온다. main.tsx 가 이 모듈을 import 해 첫 렌더 전에 실행된다.
applyTheme(useThemeStore.getState().theme)
