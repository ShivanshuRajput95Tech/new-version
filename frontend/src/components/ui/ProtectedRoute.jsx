import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"

function AuthLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      <div className="animate-pulse">
        Checking authentication...
      </div>
    </div>
  )
}

export default function ProtectedRoute({
  children,
  requiredRole
}) {

  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  const location = useLocation()

  if (loading) {
    return <AuthLoading />
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}