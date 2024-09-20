import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { p_user_id, p_quiz_id } = await request.json()

  const { data, error } = await supabase.rpc('start_quiz_attempt', {
    p_user_id,
    p_quiz_id
  })

  if (error) {
    console.error('Error starting quiz attempt:', error)

    return NextResponse.json({ error: 'Failed to start quiz attempt' }, { status: 500 })
  }

  return NextResponse.json(data)
}
