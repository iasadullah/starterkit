import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { p_user_id } = await request.json()

  const { data, error } = await supabase.rpc('get_enrolled_courses', {
    p_user_id: p_user_id
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
