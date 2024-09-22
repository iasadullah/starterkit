'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import useAuth from '@/hooks/useAuth'
import { UserRole, roleRoutes, elevatedRoutes, elevatedRoles } from '@/types/roles'

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
      router.push('/login')

      return
    }

    if (userRole === UserRole.SUPER_ADMIN) {
      setAuthorized(true)

      return
    }

    const allowedRoutes = roleRoutes[userRole] || []
    const isAllowed = allowedRoutes.some(route => pathname.startsWith(route))

    // Check for elevated routes
    const isElevatedRoute = elevatedRoutes.some(route => pathname.startsWith(route))
    const canAccessElevatedRoute = elevatedRoles.includes(userRole)

    setAuthorized(isAllowed && (!isElevatedRoute || canAccessElevatedRoute))

    if (!isAllowed || (isElevatedRoute && !canAccessElevatedRoute)) {
      router.push('/unauthorized')
    }
  }, [isLoading, session, pathname, router])

  if (isLoading) return <div>Loading...</div>

  return authorized ? <>{children}</> : null
}

export default RouteGuard
