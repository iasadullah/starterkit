import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { p_user_id, p_course_data } = await request.json()

  console.log('User ID:', p_user_id)
  console.log('Course Data:', p_course_data)

  const { data, error } = await supabase.rpc('save_course_outline', {
    p_user_id,
    p_course_data
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
