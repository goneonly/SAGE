import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// <html> 에 .dark 클래스를 붙였다 떼는 것만으로 index.css 의 CSS 변수 팔레트가
// 통째로 바뀌므로, 개별 컴포넌트는 테마를 몰라도 된다.
function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
    }),
    {
      name: 'sage-theme',
      // 새로고침 직후 저장된 테마를 <html> 클래스에 복원한다
      onRehydrateStorage: () => (state) => applyTheme(state?.theme ?? 'light'),
    },
  ),
)
