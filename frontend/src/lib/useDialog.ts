import { useEffect, useEffectEvent, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

interface UseDialogOptions {
  /** 열려 있을 때만 동작한다. 항상 렌더링되는 컴포넌트(패널 등)는 열림 여부를 넘긴다. */
  enabled?: boolean
  /** 모달이면 Tab 포커스를 다이얼로그 안에 가둔다. 본문을 계속 조작하는 사이드 패널은 false. */
  trapFocus?: boolean
  /** 열려 있는 동안 뒤 페이지 스크롤을 막는다. 기본값은 trapFocus 와 같다(모달이면 잠금). */
  lockScroll?: boolean
}

// 배경 스크롤 잠금 — 중첩 모달(가입 폼 위 개인정보 모달 등)을 위해 잠금 횟수를 센다.
// 데스크톱에서 스크롤바가 사라지며 레이아웃이 옆으로 밀리지 않도록 그 폭만큼 padding 으로 보정한다.
let scrollLockCount = 0

function lockBodyScroll() {
  scrollLockCount += 1
  if (scrollLockCount > 1) return
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  document.documentElement.style.overflow = 'hidden'
  if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
}

function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1)
  if (scrollLockCount > 0) return
  document.documentElement.style.overflow = ''
  document.body.style.paddingRight = ''
}

// 모달·드로어·패널 공용 키보드 접근성 훅.
// - 열리면 첫 번째 포커스 가능 요소(없으면 컨테이너)로 포커스를 옮긴다.
// - Esc 로 닫는다.
// - trapFocus 면 Tab/Shift+Tab 이 다이얼로그 밖으로 나가지 않는다.
// - lockScroll 이면 열려 있는 동안 뒤 페이지가 스크롤되지 않는다.
// - 닫히면 열기 직전에 포커스가 있던 요소(트리거 버튼 등)로 포커스를 돌려준다.
// 반환한 ref 를 다이얼로그 컨테이너에 붙인다. 컨테이너에는 tabIndex={-1} 을 줘야 포커스를 받을 수 있다.
export function useDialog<T extends HTMLElement>(
  onClose: () => void,
  { enabled = true, trapFocus = true, lockScroll = trapFocus }: UseDialogOptions = {},
) {
  const containerRef = useRef<T>(null)
  const handleClose = useEffectEvent(onClose)

  useEffect(() => {
    const container = containerRef.current
    if (!enabled || !container) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    ;(firstFocusable ?? container).focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
        return
      }
      if (!trapFocus || event.key !== 'Tab' || !container) return

      const focusables = [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
      if (focusables.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !container.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    if (lockScroll) lockBodyScroll()
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (lockScroll) unlockBodyScroll()
      // 닫힐 때 트리거로 포커스 복귀 — 다이얼로그가 DOM 에서 빠지면 포커스가 body 로 떨어지므로
      // 그 경우(또는 아직 다이얼로그 안)에만 되돌리고, 사용자가 다른 곳을 눌렀으면 건드리지 않는다
      const active = document.activeElement
      const focusLost = !active || active === document.body || container.contains(active)
      if (previouslyFocused?.isConnected && focusLost) {
        previouslyFocused.focus()
      }
    }
  }, [enabled, trapFocus, lockScroll])

  return containerRef
}
