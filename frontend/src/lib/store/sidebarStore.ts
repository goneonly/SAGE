import { create } from 'zustand'

// 왼쪽 사이드바(메뉴) 열림 상태 — 기본은 닫힘.
// 여는 버튼(SidebarToggle)은 각 화면 제목 왼쪽에 있고, 사이드바 자체는 AppShell 이 그리므로 상태를 전역에 둔다.

/** 사이드바를 연 버튼의 위치(사이드바 패널 기준 px) — 열린 사이드바의 닫기 버튼을 같은 자리에 둔다 */
export interface SidebarAnchor {
  top: number
  left: number
}

interface SidebarState {
  isOpen: boolean
  anchor: SidebarAnchor | null
  toggle: (anchor?: SidebarAnchor) => void
  close: () => void
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  isOpen: false,
  anchor: null,
  toggle: (anchor) =>
    set((state) => (state.isOpen ? { isOpen: false } : { isOpen: true, anchor: anchor ?? null })),
  close: () => set({ isOpen: false }),
}))
