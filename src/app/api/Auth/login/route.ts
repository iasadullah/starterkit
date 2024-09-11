import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import type { User } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  // Perform sign-in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Extract user from the response data
  const user: User | null = data?.user ?? null

  return NextResponse.json({ user })
}
