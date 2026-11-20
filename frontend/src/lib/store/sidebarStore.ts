import { create } from 'zustand'

// 왼쪽 사이드바(메뉴) 열림 상태 — 기본은 닫힘.
// 여는 버튼(SidebarToggle)은 각 화면 제목 아래에 있고, 사이드바 자체는 AppShell 이 그리므로 상태를 전역에 둔다.
interface SidebarState {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}))
