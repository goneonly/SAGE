import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

// 렌더링 중 예외로 화면 전체가 하얗게 죽는 것을 막는 최후의 방어선.
// 라우트 아래 어디서 터져도 여기서 잡아 재시도(새로고침) 동선을 준다.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center text-ink">
          <p aria-hidden="true" className="text-3xl">
            ⚠️
          </p>
          <h1 className="mt-4 text-xl font-bold">화면을 표시하지 못했어요</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            일시적인 오류일 수 있어요. 아래 버튼으로 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-600/90"
          >
            다시 시도
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
