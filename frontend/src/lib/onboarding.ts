// 회원가입 완료 온보딩 팝업 노출 여부 플래그 (localStorage).
// SignupPage 가 가입 직전에 'pending' 을 심고, AppShell 이 읽어 팝업을 띄운다.
// 컴포넌트 파일(OnboardingModal)과 분리한 이유: react-refresh 는 컴포넌트만 export 하는
// 파일을 요구하므로, 상수·함수는 여기에 둔다.
export const ONBOARDING_FLAG_KEY = 'sage.onboarding.v1'

export function markOnboardingPending() {
  localStorage.setItem(ONBOARDING_FLAG_KEY, 'pending')
}

export function clearOnboardingPending() {
  localStorage.removeItem(ONBOARDING_FLAG_KEY)
}

export function isOnboardingPending(): boolean {
  return localStorage.getItem(ONBOARDING_FLAG_KEY) === 'pending'
}

export function markOnboardingDone() {
  localStorage.setItem(ONBOARDING_FLAG_KEY, 'done')
}
