import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../lib/store/authStore'

// 인증 안 된 사용자는 /login 으로 리다이렉트. 로그인 후 원래 가려던 곳으로
// 돌아갈 수 있도록 현재 location 을 state 로 넘긴다.
function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
