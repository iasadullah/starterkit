import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const url = new URL(request.url)
  const userId = url.searchParams.get('user_id')

  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  const { role_id } = await request.json()
  if (!role_id) {
    return NextResponse.json({ error: 'role_id is required' }, { status: 400 })
  }
  const { data, error } = await supabase.from('user_roles').update({ role_id }).eq('user_id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ message: 'Role updated successfully', data })
}
