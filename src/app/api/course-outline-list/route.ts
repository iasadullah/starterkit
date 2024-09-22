import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { p_user_id, p_is_draft } = await request.json()

  console.log(p_user_id, p_is_draft)

  const { data, error } = await supabase.rpc('get_user_course_outlines', {
    p_user_id,
    p_is_draft
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
