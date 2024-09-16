import { NextResponse } from 'next/server'

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single()

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const user = authData.user

    if (!user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Save additional user data in the user_roles table
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role_id: 4, email, name }) // Default role: Guest (role_id: 4)

    if (insertError) {
      // If role assignment fails, we should delete the created user
      await supabase.auth.admin.deleteUser(user.id)

      return NextResponse.json({ error: 'Failed to assign user role' }, { status: 500 })
    }

    return NextResponse.json({ message: 'User registered successfully!' }, { status: 200 })
  } catch (error) {
    console.error('Registration error:', error)

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
