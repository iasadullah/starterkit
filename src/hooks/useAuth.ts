import { useState, useEffect } from 'react'

import type { User, Session } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabaseClient'

// import { UserRole } from '@/types/roles'

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return { user, session, isLoading }
}

export default useAuth
