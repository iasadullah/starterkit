// src/hooks/useAuth.ts
import { useAuth } from '../context/AuthContext'

export const useAuthActions = () => {
  const { user, login, logout } = useAuth()

  const isLoggedIn = Boolean(user)
  const role = user?.role || 'guest' // Placeholder for actual role

  return { user, isLoggedIn, login, logout, role }
}
