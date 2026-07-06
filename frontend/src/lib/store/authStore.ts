import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as apiLogin, signup as apiSignup } from '../api/auth'
import type { Level, User } from '../../types/auth'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, level?: Level) => Promise<void>
  logout: () => void
  updateLevel: (level: Level) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email, password) => {
        const user = await apiLogin(email, password)
        set({ isAuthenticated: true, user })
      },
      signup: async (email, password, level = 'beginner') => {
        const user = await apiSignup(email, password, level)
        set({ isAuthenticated: true, user })
      },
      logout: () => set({ isAuthenticated: false, user: null }),
      // 설정 화면에서 레벨 변경 시 호출 — persist 미들웨어가 localStorage 에도 반영한다.
      updateLevel: (level) =>
        set((state) => (state.user ? { user: { ...state.user, level } } : state)),
    }),
    { name: 'ufn-auth' },
  ),
)
