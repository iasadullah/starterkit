// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'

import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = supabase.auth.session()

    setUser(session?.user || null)

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signIn({ email, password })

    if (error) throw error
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
