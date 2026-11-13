import { create } from 'zustand'

// 홈 화면이 지금 첫 화면(추천 뉴스)을 보여주는 중인지 — HomePage 가 스크롤에 맞춰 갱신하고,
// AppShell 이 읽어 우측 바를 숨기거나 띄운다(추천 뉴스가 화면 폭을 넓게 쓰도록).
// 화면 상태일 뿐이라 저장(persist)하지 않는다.
interface HomeViewState {
  isHeroActive: boolean
  setHeroActive: (active: boolean) => void
}

export const useHomeViewStore = create<HomeViewState>()((set) => ({
  isHeroActive: true,
  setHeroActive: (active) => set({ isHeroActive: active }),
}))
