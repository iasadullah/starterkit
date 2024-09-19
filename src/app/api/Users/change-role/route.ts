import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

// Update user role based on user_id
export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Extract user_id from query parameters and role_id from the request body
  const url = new URL(request.url)
  const userId = url.searchParams.get('user_id') // Get user_id from URL query params

  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  const { role_id } = await request.json() // Get role_id from body
  if (!role_id) {
    return NextResponse.json({ error: 'role_id is required' }, { status: 400 })
  }

  // Update the user role in 'user_roles' table where user_id matches
  const { data, error } = await supabase
    .from('user_roles')
    .update({ role_id }) // Update role_id in the user_roles table
    .eq('user_id', userId) // Filter by user_id

  // Handle error for updating user role
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return the updated data
  return NextResponse.json({ message: 'Role updated successfully', data })
}
