'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import useAuth from '@/hooks/useAuth'
import { roleRoutes } from '@/types/roles'

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { session, isLoading } = useAuth()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuthorization = () => {
      if (isLoading || !session) {
        setAuthorized(false)

        return
      }

      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      const userRole = userData.role?.role_name?.toLowerCase() || 'authenticated'

      console.log('User role:', userRole)

      if (userRole === 'superadmin') {
        setAuthorized(true)

        return
      }

      const allowedRoutes = roleRoutes[userRole] || []
      const isAllowed = allowedRoutes.length === 0 || allowedRoutes.some(route => pathname.startsWith(route))

      if (!isAllowed) {
        setAuthorized(false)
        router.push('/unauthorized')
      } else {
        setAuthorized(true)
      }
    }

    checkAuthorization()
  }, [isLoading, session, pathname, router])

  if (isLoading) return <div>Loading...</div>

  return authorized ? <>{children}</> : null
}

export default RouteGuard
