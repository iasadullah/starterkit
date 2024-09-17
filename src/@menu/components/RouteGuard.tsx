'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import useAuth from '@/hooks/useAuth'
import type { UserRole } from '@/types/roles'
import { roleRoutes } from '@/types/roles'

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { session, isLoading } = useAuth()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (isLoading) return

    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    const userRole = (userData.role?.role_name?.toLowerCase() || 'authenticated') as UserRole

    console.log('User role:', userRole)

    if (!session) {
      setAuthorized(false)
      router.push('/login') // Redirect to login if no session

      return
    }

    if (userRole === 'superadmin') {
      setAuthorized(true)

      return
    }

    const allowedRoutes = roleRoutes[userRole] || []
    const isAllowed = allowedRoutes.length === 0 || allowedRoutes.some(route => pathname.startsWith(route))

    setAuthorized(isAllowed)

    if (!isAllowed) {
      router.push('/unauthorized')
    }
  }, [isLoading, session, pathname, router])

  if (isLoading) return <div>Loading...</div>

  return authorized ? <>{children}</> : null
}

export default RouteGuard
